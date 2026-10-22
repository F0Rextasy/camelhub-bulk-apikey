'use strict';

/**
 * Exit plumbing shared by the pool-driven scripts.
 *
 * The tools learned the hard way that raw free-exit lists are useless for a
 * multi-step mint: `register`/`login` answers arrive, but `checkin` and `/v1/models`
 * exhaust 5-6 retries on dead candidates. So every script first **collects**
 * candidates (pool-proven exits for the host first, screened local lists behind)
 * and then **screens** them with a real HTTP request against the panel's own
 * `/api/status`, keeping only exits that answer.
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const { loadExits, req, DIRECT_EXIT, isDirect, poolFilesWithLines } = require('./lib');
const ROOT = path.resolve(__dirname, '..'); // data root (the repo root)
const { parseProxy } = require(path.join(__dirname, 'proxy'));

const O = (...p) => path.join(__dirname, '..', ...p);

const DEFAULT_LISTS = [
  path.join(ROOT, 'proxies.txt'), // rewritten by the pool every round, `# proven=<host>` tagged
  path.join(ROOT, 'proxies.txt'),
  path.join(ROOT, 'proxies.txt'),
  path.join(ROOT, 'proxies.txt'),
  path.join(ROOT, 'proxies.txt'),
  path.join(ROOT, 'proxies.txt'),
  path.join(ROOT, 'proxies.txt'),
];

function poolGet(url) {
  return new Promise((resolve, reject) => {
    const r = http.get(url, { timeout: 20000 }, (res) => {
      let text = '';
      res.setEncoding('utf8');
      res.on('data', (c) => (text += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(text));
        } catch (e) {
          reject(new Error('pool json'));
        }
      });
    });
    r.setTimeout(20000, () => r.destroy(new Error('pool timeout')));
    r.on('error', reject);
  });
}

/**
 * Ordered, deduped candidate list: pool-proven exits for `host` at the head,
 * screened local lists behind. `log` is optional.
 */
async function collectCandidates({ host, pool = 'http://127.0.0.1:8791', poolLimit = 60, lists = DEFAULT_LISTS, extra = [], noPool = false, log = () => {} } = {}) {
  const lines = [];
  if (!noPool && host) {
    for (const fresh of ['only', 'any']) {
      try {
        const doc = await poolGet(`${pool}/pool?target=${encodeURIComponent(host)}&limit=${poolLimit}&fresh=${fresh}`);
        const ex = doc.exits || [];
        lines.push(...ex.map((e) => `${e.protocol}://${e.line}`));
        log(`pool(${fresh}): ${ex.length} exit(s) for ${host} (fresh ${ex.filter((e) => e.fresh).length})`);
        if (fresh === 'only' && ex.length >= 12) break;
      } catch (e) {
        log(`pool(${fresh}) unavailable: ${String(e.message).slice(0, 80)}`);
        break;
      }
    }
  }
  const seen = new Set();
  const head = [];
  const tail = [];
  const push = (arr, p) => {
    if (!p) return;
    const id = `${p.host}:${p.port}`;
    if (seen.has(id)) return;
    seen.add(id);
    p.connectTimeoutMs = 8000;
    p.timeoutMs = 32000;
    p.line = `${p.protocol}://${p.host}:${p.port}`;
    arr.push(p);
  };
  for (const l of lines) push(head, parseProxy(l));
  for (const p of loadExits([...lists, ...extra], { shuffle: true })) push(tail, p);
  head.sort(() => Math.random() - 0.5);
  // "No pool at all" (nothing configured) means DIRECT mode: offer the direct
  // pseudo-exit so screening still finds a way out. A pool file that *is*
  // configured but yields no usable line is something else — going direct there
  // would send every key from this machine's own address (README: "a call with
  // no exit left raises instead of dialing out directly").
  if (!head.length && !tail.length) {
    const withLines = poolFilesWithLines([...lists, ...extra]);
    if (withLines.length) {
      throw new Error(
        `the exit list ${withLines.join(', ')} has candidate line(s) but no usable exit — a line must be scheme://host:port[#comment] (socks4 lines are dropped by the pool reader); refusing to run from this machine's own address`
      );
    }
    return { candidates: [DIRECT_EXIT], poolCount: 0 };
  }
  // The normal path: pool-proven candidates first, the local lists behind them.
  // Without this return the function answered `undefined` for every pool that
  // actually had an exit, and both callers died on their own destructuring line.
  return { candidates: [...head, ...tail], poolCount: head.length };
}

/**
 * Keep only exits that answer `GET <base>/api/status` with 200 + a panel body.
 * Stops as soon as `want` are found or `budgetMs` runs out; ≤`conc` sockets live.
 *
 * `check` replaces the default panel probe with an arbitrary predicate — used by
 * the captcha handoff, where an exit must reach the panel *and* the captcha CDN
 * before a widget page can even render.
 */
async function screenFor(base, candidates, { want = 6, conc = 4, budgetMs = 240000, min = 0, log = () => {}, check = null } = {}) {
  const good = [];
  const queue = [...candidates];
  const t0 = Date.now();
  let tried = 0;
  const probe = check || (async (p) => {
    const res = await req(p, `${base}/api/status`, { timeoutMs: 20000, connectTimeoutMs: 6000, headers: { accept: 'application/json' } });
    return res.status === 200 && /system_name/.test(res.text);
  });
  await Promise.all(
    Array.from({ length: Math.min(conc, Math.max(queue.length, 1)) }, async () => {
      while (queue.length && good.length < want && Date.now() - t0 < budgetMs) {
        const p = queue.shift();
        tried++;
        try {
          if (await probe(p)) {
            good.push(p);
            log(`  ✓ screened ${p.line}`);
          }
        } catch (e) {
          /* dead candidate — expected on free exits */
        }
      }
    })
  );
  log(`screen: ${good.length} working exit(s) from ${tried} tried in ${Math.round((Date.now() - t0) / 1000)}s`);
  const goodIds = new Set(good.map((p) => p.line));
  const rest = candidates.filter((p) => !goodIds.has(p.line));
  if (min && good.length < min) log(`screen: below min (${good.length} < ${min}) — proceeding with fallbacks in the tail`);
  return { exits: [...good, ...rest], good, tried };
}

/**
 * The canonical screened list for a host: `out/pool/screened-<host>.txt`, which
 * the tools read back. The host is a `host[:port]`, and a colon is not a legal
 * filename character on Windows — `--base http://127.0.0.1:3000` (a local fork)
 * used to write an NTFS alternate stream nobody could read back.
 */
function screenedFile(host) {
  const tag = String(host).replace(/[^A-Za-z0-9._-]+/g, '_');
  return path.join(ROOT, 'out', 'pool', `screened-${tag}.txt`);
}

/**
 * Appends the exits that answered to that list, keeping the lines that are
 * already there. Returns the number of lines added.
 *
 * `verify.js` used to log this write without doing it; `verify-key.js` did it
 * inline. One function, one path, so the log line cannot lie again.
 */
function saveScreened(host, good, { log = () => {} } = {}) {
  const target = screenedFile(host);
  try {
    const seen = new Set();
    if (fs.existsSync(target)) for (const l of fs.readFileSync(target, 'utf8').split('\n')) if (l.trim()) seen.add(l.split('#')[0].trim());
    const fresh = good.filter((p) => !isDirect(p) && !seen.has(p.line));
    if (!fresh.length) {
      log(`· screened exits → ${path.relative(process.cwd(), target)} (no new line of ${good.length} proven)`);
      return 0;
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.appendFileSync(target, fresh.map((p) => `${p.line}  # verified ${new Date().toISOString()}`).join('\n') + '\n', { mode: 0o600 });
    log(`· screened exits → ${path.relative(process.cwd(), target)} (+${fresh.length} of ${good.length} proven)`);
    return fresh.length;
  } catch (e) {
    log(`· screened list write failed: ${String(e.message).slice(0, 100)}`);
    return 0;
  }
}

/** Accepts a mix of proxy lines and parsed proxies; returns parsed proxies only. */
function toProxies(list) {
  const out = [];
  for (const item of list || []) {
    if (!item) continue;
    const p = typeof item === 'string' ? parseProxy(item) : item;
    if (!p) continue;
    p.connectTimeoutMs = p.connectTimeoutMs || 8000;
    p.timeoutMs = p.timeoutMs || 32000;
    p.line = p.line || `${p.protocol}://${p.host}:${p.port}`;
    out.push(p);
  }
  return out;
}

module.exports = { collectCandidates, screenFor, poolGet, toProxies, saveScreened, screenedFile, DEFAULT_LISTS, O };
