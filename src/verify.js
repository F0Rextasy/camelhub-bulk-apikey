#!/usr/bin/env node
'use strict';

/**
 * camelhub-bulk-apikey · verify
 *
 * Re-checks keys that are already on disk, on an exit that is *not* the one that
 * minted them (a same-exit pass can be session state rather than key validity):
 *
 *   ① `GET /v1/models` with the key answers 200 (authentic), and
 *   ② one real completion on a cheap listed model answers 200 (spendable) —
 *      this panel has model channels that are down (`404 当前模型暂时不可用`), so the
 *      tool walks the cheapest few ids before it calls a key unspendable.
 *
 * Three verdicts stay apart, because they mean different things:
 *
 *   ok            models 200 and a completion 200 — the key works
 *   quota         models 200, completion refused for credit (`insufficient…`)
 *   key_refused   the panel answered the key itself (401/403/404 with a body)
 *   exit_banned   the panel **banned the exit** (`IP banned`) — the key was never
 *                 measured; the run retires that exit and continues on the next
 *
 *   node src/verify.js                 # every key on disk that is not already ok
 *   node src/verify.js --key <key>     # one key
 *   node src/verify.js --all           # also re-check keys whose last run said ok
 *   node src/verify.js --model claude-haiku-4-5
 *
 * Verdicts are written to `accounts.json` (`verifyIndependent`), a fresh model
 * list to `models.json`, the exits that proved reachable to
 * `out/screened-<host>.txt`, and a key is appended to `keys.txt` only when it is
 * `ok` — `GET /v1/models` 200 *and* a completion 200.
 */

const fs = require('fs');
const path = require('path');

const { ExitPool, readJson, writeJson, appendLine, nowIso, req, isExitError } = require('./lib.js');
const { Panel } = require('./newapi.js');
const { collectCandidates, screenFor } = require('./xwave-lib.js');
const ipban = require('./ipban.js');

// A ban that appears *after* screening (the panel blocks an exit mid-run) must take
// the exit path too: this makes a ban response throw like a transport failure, so
// every call site below retires that exit and moves on.
ipban.guard({ Panel });

const BASE = 'https://api.camel-hub.com';
const HOST = new URL(BASE).host;
const ROOT = path.resolve(__dirname, '..'); // data root (the repo root)
const POOL = path.join(ROOT, 'proxies.txt');
const ACCOUNTS = path.join(ROOT, 'accounts.json');
const KEYS = path.join(ROOT, 'keys.txt');
const MODELS_FILE = path.join(__dirname, 'models.json'); // the shipped catalogue sits beside the code
const OUT = path.join(ROOT, 'out');

const USAGE = `camelhub-bulk-apikey · verify — re-check keys already on disk

usage: node src/verify.js [options]

  --key K          verify one key instead of every key on disk
  --all            also re-check keys whose last run said they work
  --model ID[,ID]  model(s) for the completion check (default: cheapest listed)
  --max-tokens N   tokens to ask for (default 8)
  --want N         independent exits to prove before checking keys (default 3)
  --pool FILE      exit list, one per line (default proxies.txt)
  --base URL       panel address (default ${BASE})
  --help           this text

Every call rides an exit from proxies.txt; the exit that verified a key is
recorded next to the exit that minted it, so "the key works" is never confused
with "this session works". An exit the panel has banned is retired and the run
continues on the next one — it is never recorded as a key verdict.`;

const argv = process.argv.slice(2);
const has = (name) => argv.includes(`--${name}`);
const one = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : null;
};

if (has('help') || has('-h') || argv.includes('-h')) {
  console.log(USAGE);
  process.exit(0);
}

const FLAGS = ['--key', '--all', '--model', '--max-tokens', '--want', '--pool', '--base'];
for (const a of argv) {
  if (a.startsWith('-') && !FLAGS.includes(a)) {
    console.error(`unknown flag: ${a}\n`);
    console.log(USAGE);
    process.exit(2);
  }
}

const pool = path.resolve(one('pool') || POOL);
if (!fs.existsSync(pool)) {
  console.error(`no exit list at ${pool}\n  one exit per line, e.g. socks5://127.0.0.1:1080 — see README "Behind a proxy"`);
  process.exit(2);
}

const BASE_URL = one('base') || BASE;
const ONLY_KEY = one('key') || '';
const ALL = has('all');
const MODELS = (one('model') || '').split(',').map((s) => s.trim()).filter(Boolean);
const MAX_TOKENS = parseInt(one('max-tokens') || '8', 10);
const WANT = parseInt(one('want') || '3', 10);
const MAX_EXITS = Math.max(WANT, 4); // every key may burn this many exits before the run calls it unmeasured

const log = (...a) => console.log(`[${nowIso()}] ${a.join(' ')}`);
const CHATTY = /embed|rerank|reranker|whisper|tts|image|audio|video|vision|bge/i;

/** Cheap-model ranking — the same heuristic the mint uses. */
function rankCheapest(ids) {
  const rank = (id) => {
    let s = 5;
    if (/flash|nano|mini|small|lite|turbo|haiku|8b|7b|4b|1b/i.test(id)) s -= 3;
    if (/free/i.test(id)) s -= 2;
    if (/pro|opus|ultra|max|72b|70b|235b|405b|550b/i.test(id)) s += 3;
    if (/embed|rerank|whisper|tts|image|audio|video|vision/i.test(id)) s += 4;
    return s;
  };
  return [...ids].sort((a, b) => rank(a) - rank(b));
}

const looksQuota = (text) => /insufficient|quota|额度|余额|balance|余额不足/i.test(String(text || ''));
const looksAccountBanned = (text) => /user_banned|user banned|账号封禁|账号已被封禁|account.*banned/i.test(String(text || ''));

/** What the panel answered for a key, never for the exit. */
function classify(models, chat, bannedMidChat) {
  if (models.status === 200) {
    if (chat && chat.status === 200) return 'ok';
    if (bannedMidChat) return 'authentic';
    if (chat && looksQuota(chat.text)) return 'quota';
    return 'authentic';
  }
  if (looksAccountBanned(models.text)) return 'account_banned';
  return 'key_refused';
}

/** A cursor over the screened exits, skipping the mint exit and every banned line. */
class ExitCursor {
  constructor(pool, { avoid = [], banned = [] } = {}) {
    this.queue = pool.slice();
    this.skip = new Set([...avoid, ...banned].filter(Boolean));
    this.proven = []; // exits that answered a panel answer for some key — worth more than an untried candidate
  }
  take() {
    while (this.queue.length) {
      const p = this.queue.shift();
      if (!p || this.skip.has(p.line)) continue;
      return p;
    }
    // Untried candidates are gone: an exit that already answered may carry the
    // next key, so a small pool does not leave keys unmeasured. Banned or failed
    // exits remove themselves from `proven`, so this cannot loop on a bad one.
    return this.proven.find((p) => !this.skip.has(p.line)) || null;
  }
  ban(line) {
    if (line) this.skip.add(line);
    this.proven = this.proven.filter((p) => p.line !== line);
  }
  died(line) {
    this.proven = this.proven.filter((p) => p.line !== line);
  }
  answered(pin) {
    if (pin && !this.proven.some((p) => p.line === pin.line)) this.proven.push(pin);
  }
}

function panelOn(pin) {
  return new Panel(BASE_URL, new ExitPool([pin], { label: 'camelhub' }), { label: 'camelhub', log: () => {} });
}

/**
 * Screening probe. `/api/status` answers 200 *through an exit the panel has
 * banned* (measured: two ports of the same banned IP), so bans are only visible
 * on a gated route: a junk bearer on `/v1/models` answers `401 invalid_api_key`
 * from a healthy exit and `403 IP banned` from a blocked one. Banning at
 * screening time costs nothing and keeps a banned exit from ever being spent on
 * a key.
 */
const bannedAtScreen = [];
async function reachable(p) {
  const res = await req(p, `${BASE_URL}/v1/models`, {
    timeoutMs: 20000,
    connectTimeoutMs: 6000,
    headers: { authorization: 'Bearer screening-probe', accept: 'application/json' },
  });
  if (ipban.isBan(res)) {
    if (!bannedAtScreen.includes(p.line)) bannedAtScreen.push(p.line);
    log(`  ✖ banned by the panel: ${p.line}`);
    return false;
  }
  return res.status < 500;
}

/**
 * Measure one key. Every *exit* failure — a panel ban, a dead exit, a timeout —
 * retires that candidate and the key is tried on the next one, because neither
 * says anything about the key. Only a panel answer *about the key* becomes a key
 * verdict; a key that never got one comes back `exit_banned` / `error`
 * (unmeasured) instead of reading as broken.
 */
async function measure(rec, cursor, { bannedThisRun, deadExits }) {
  const out = { at: nowIso(), key: rec.key, mintExit: null, exit: null, models: null, chat: null, verdict: null, triedExits: [], note: null };
  const mintExit = (rec.verify && rec.verify.mintExit) || (rec.verifyIndependent && rec.verifyIndependent.mintExit) || '';
  out.mintExit = mintExit || null;
  if (mintExit) cursor.ban(mintExit);

  let bannedHere = false;
  let lastError = null;
  let pin = cursor.take();
  while (pin) {
    out.triedExits.push(pin.line);
    let models;
    try {
      models = await panelOn(pin).models(rec.key, { tries: 1, timeoutMs: 30000 });
    } catch (e) {
      if (e.ipBanned) {
        log(`#${rec.index} ${rec.key.slice(0, 10)}… exit banned by the panel: ${pin.line} — trying the next exit`);
        bannedThisRun.push(pin.line);
        bannedHere = true;
        cursor.ban(pin.line);
      } else {
        log(`#${rec.index} ${rec.key.slice(0, 10)}… exit failed (${String(e.message).slice(0, 80)}) — trying the next exit`);
        deadExits.push(pin.line);
        cursor.died(pin.line);
        lastError = e;
      }
      pin = cursor.take();
      continue;
    }

    if (models.status !== 200) {
      // The panel answered the key itself: that is a key verdict, not an exit one.
      cursor.answered(pin);
      out.exit = pin.line;
      out.models = { status: models.status, body: String(models.text || '').slice(0, 300), exit: pin.line };
      out.verdict = classify(models, null, false);
      log(`#${rec.index} ${rec.key.slice(0, 10)}… /v1/models ${models.status} · ${out.models.body.slice(0, 140)}`);
      return out;
    }

    // ---- authentic: this exit answered the key. Now make it spend.
    const ids = models.json && Array.isArray(models.json.data) ? models.json.data.map((m) => m.id || m) : [];
    cursor.answered(pin);
    out.exit = pin.line;
    out.models = { status: 200, count: ids.length || null, exit: pin.line };
    if (ids.length) writeJson(MODELS_FILE, { at: nowIso(), base: BASE_URL, models: ids });

    let tryList = MODELS.slice();
    if (!tryList.length) tryList = rankCheapest(ids.filter((id) => !CHATTY.test(id))).slice(0, 5);

    let bannedMidChat = false;
    for (const id of tryList) {
      let res = null;
      for (;;) {
        try {
          res = await panelOn(pin).chat(rec.key, id, { tries: 1, timeoutMs: 90000, maxTokens: MAX_TOKENS });
          break;
        } catch (e) {
          if (e.ipBanned) {
            log(`#${rec.index} ${rec.key.slice(0, 10)}… exit banned by the panel mid-check: ${pin.line} — trying the next exit`);
            bannedThisRun.push(pin.line);
            bannedHere = true;
            cursor.ban(pin.line);
          } else if (isExitError(e)) {
            log(`#${rec.index} ${rec.key.slice(0, 10)}… exit failed mid-check (${String(e.message).slice(0, 60)}) — trying the next exit`);
            deadExits.push(pin.line);
            cursor.died(pin.line);
          } else {
            res = { status: 0, text: String(e.message).slice(0, 200), exit: pin.line };
            break;
          }
          const next = cursor.take();
          if (!next) {
            bannedMidChat = true;
            res = { status: 403, text: 'no candidate exit left (banned or dead)', exit: pin.line };
            break;
          }
          out.triedExits.push(next.line);
          pin = next;
        }
      }
      out.chat = { model: id, status: res.status, text: String(res.text || '').slice(0, 300), exit: res.exit };
      log(`#${rec.index} chat ${id} → ${res.status} ${String(res.text || '').slice(0, 140)}`);
      if (res.status === 200) break;
      if (looksQuota(res.text)) break;
      if (bannedMidChat) break;
    }

    out.exit = pin.line;
    out.verdict = classify({ status: 200 }, out.chat, bannedMidChat);
    if (out.verdict === 'ok') {
      if (!fs.existsSync(KEYS) || !fs.readFileSync(KEYS, 'utf8').includes(rec.key)) appendLine(KEYS, rec.key);
    }
    log(
      `#${rec.index} ${rec.key.slice(0, 10)}… models=200 chat=${out.chat ? out.chat.status : 'n/a'} → ${out.verdict} (exit ${pin.line}${mintExit ? `, mint exit ${mintExit}` : ''})`
    );
    return out;
  }

  // no candidate exit could answer the key
  if (bannedHere) {
    out.verdict = 'exit_banned';
    out.note = 'the panel banned every candidate exit — the key was not measured';
    log(`#${rec.index} ${rec.key.slice(0, 10)}… unmeasured: every candidate exit was banned by the panel`);
  } else {
    out.verdict = 'error';
    out.note = `no candidate exit answered (${String((lastError && lastError.message) || 'no exits left').slice(0, 160)}) — the key was not measured`;
    log(`#${rec.index} ${rec.key.slice(0, 10)}… unmeasured: no exit answered — ${String((lastError && lastError.message) || 'no exits left').slice(0, 100)}`);
  }
  return out;
}

(async () => {
  const accounts = readJson(ACCOUNTS, []);
  let todo = accounts.filter((r) => r.key);
  if (ONLY_KEY) todo = todo.filter((r) => r.key === ONLY_KEY);
  if (!ALL && !ONLY_KEY) todo = todo.filter((r) => !(r.verifyIndependent && r.verifyIndependent.verdict === 'ok'));
  if (!todo.length) {
    log('no keys to verify for camelhub' + (ONLY_KEY ? ' (that key is not in accounts.json)' : ''));
    return;
  }

  // ---- exits: the user's pool, screened for this host, proven list first
  const { candidates } = await collectCandidates({ host: HOST, extra: [pool], noPool: true, log: (m) => log('· ' + m) });
  if (!candidates.length) {
    log(`no exits parsed from ${path.basename(pool)} — one per line, e.g. socks5://127.0.0.1:1080`);
    return;
  }
  const { exits, good, tried } = await screenFor(BASE_URL, candidates, {
    want: WANT,
    conc: Math.min(4, WANT),
    budgetMs: 240000,
    check: reachable,
    log: (m) => log('· ' + m),
  });
  if (!good.length) {
    log(`no usable exit for ${HOST} (${tried} tried${bannedAtScreen.length ? `, ${bannedAtScreen.length} banned by the panel` : ''}) — no key was measured, ${todo.length} key(s) left untouched`);
    return;
  }
  if (bannedAtScreen.length) log(`· ${bannedAtScreen.length} exit(s) are banned by the panel (filtered before any key call): ${bannedAtScreen.join(', ')}`);
  try {
    fs.mkdirSync(OUT, { recursive: true });
    const file = path.join(OUT, `screened-${HOST}.txt`);
    const known = new Set();
    if (fs.existsSync(file)) for (const l of fs.readFileSync(file, 'utf8').split('\n')) if (l.trim()) known.add(l.split('#')[0].trim());
    const fresh = good.filter((p) => !known.has(p.line));
    if (fresh.length) fs.appendFileSync(file, fresh.map((p) => `${p.line}  # verified ${nowIso()}`).join('\n') + '\n');
    log(`· screened exits → out/screened-${HOST}.txt (+${fresh.length} of ${good.length} proven)`);
  } catch (e) {
    log(`· screened list write failed: ${String(e.message).slice(0, 120)}`);
  }

  log(`verify ${todo.length} key(s) for camelhub (${BASE_URL}) · exits ${good.length} proven of ${tried} tried · want ${WANT}`);

  const cursor = new ExitCursor(exits, {});
  const bannedThisRun = [];
  const deadExits = [];
  const results = [];
  for (const rec of todo) {
    try {
      results.push(await measure(rec, cursor, { bannedThisRun, deadExits }));
    } catch (e) {
      results.push({ key: rec.key, verdict: 'error', note: String(e.message).slice(0, 200) });
      log(`#${rec.index} verify error: ${String(e.message).slice(0, 160)}`);
    }
    rec.verifyIndependent = results[results.length - 1];
    // The current verdict also lands where the exit verdicts already live, so a
    // reader of `accounts.json` sees one shape: `verify.status` (the HTTP status
    // when a key authenticated, otherwise the verdict — `account_banned`,
    // `key_refused`), `verify.verdict`, `verify.exit` (the exit that observed it)
    // and `verify.at`. The mint-time measurement is kept, not overwritten: it
    // moves to `verify.atMint`.
    const r = rec.verifyIndependent;
    const refused = r.verdict === 'account_banned' || r.verdict === 'key_refused';
    const prev = rec.verify && !rec.verify.atMint ? { ...rec.verify } : (rec.verify && rec.verify.atMint) || null;
    rec.verify = {
      status: refused ? r.verdict : (r.models && r.models.status) || r.verdict,
      verdict: r.verdict,
      exit: r.exit || (r.models && r.models.exit) || null,
      at: r.at,
      ...(r.models && r.models.body ? { body: r.models.body } : {}),
      ...(r.chat ? { chat: { model: r.chat.model, status: r.chat.status, exit: r.chat.exit } } : {}),
      ...(prev ? { atMint: prev } : {}),
    };
  }
  writeJson(ACCOUNTS, accounts);

  const ok = results.filter((r) => r.models && r.models.status === 200).length;
  const spendable = results.filter((r) => r.verdict === 'ok').length;
  const authentic = results.filter((r) => r.verdict === 'authentic').length;
  const quota = results.filter((r) => r.verdict === 'quota').length;
  const accountBanned = results.filter((r) => r.verdict === 'account_banned').length;
  const refused = results.filter((r) => r.verdict === 'key_refused').length;
  const bannedUnmeasured = results.filter((r) => r.verdict === 'exit_banned').length;
  const deadUnmeasured = results.filter((r) => r.verdict === 'error').length;
  const banned = [...new Set([...bannedAtScreen, ...bannedThisRun])];
  const parts = [`${ok}/${results.length} keys answered /v1/models 200`];
  if (spendable) parts.push(`${spendable} spendable`);
  if (authentic) parts.push(`${authentic} authentic, no channel answered`);
  if (quota) parts.push(`${quota} out of credit`);
  if (accountBanned) parts.push(`${accountBanned} account(s) banned by the panel (auth.user_banned)`);
  if (refused) parts.push(`${refused} key(s) refused`);
  const unmeasured = bannedUnmeasured + deadUnmeasured;
  if (bannedUnmeasured) parts.push(`${bannedUnmeasured} unmeasured: ${banned.length} exit(s) banned by the panel`);
  if (deadUnmeasured) parts.push(`${deadUnmeasured} unmeasured: ${new Set(deadExits).size} exit(s) did not answer`);
  if (!unmeasured && banned.length) parts.push(`${banned.length} exit(s) banned by the panel and retired`);
  const tail = unmeasured ? ' — re-run to measure them (an exit problem is not a key verdict)' : '';
  log(`done: camelhub — ${parts.join(' · ')}${tail}`);
})().catch((e) => {
  log(`FATAL ${e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e}`);
  process.exit(1);
});
