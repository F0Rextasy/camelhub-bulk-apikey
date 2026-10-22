#!/usr/bin/env node
'use strict';

/**
 * verify-key — re-verify minted keys on a **fresh, independent exit**.
 *
 * The verification contract has two lines and they must be measured, not
 * assumed:
 *   ① `GET /v1/models` with the key answers 200 (authentic), and
 *   ② one real completion on a cheap model answers 200 (spendable) —
 *      a panel that issues keys but refuses every call for `insufficient_user_quota`
 *      is authentic-but-not-spendable, and the report must say which.
 *
 * Independence: the exit that verifies must NOT be the exit that minted the key
 * (a same-egress pass can be session state). The mint records `verify.mintExit`;
 * this tool screens exits for the host, takes the first that is not that line,
 * and pins it for both calls. When no distinct exit can be proven it says so
 * (`independent:false`) instead of silently reusing the mint exit.
 *
 *   node src/verify-key.js --name dmxapi
 *   node src/verify-key.js --name liangjiewis --model glm-4-flash --max-tokens 8
 *   node src/verify-key.js --name yjs --key <key> --all
 *
 * Updates `accounts.json` (`verifyIndependent` block), `models.json` (when the
 * panel lists models) and appends to `keys.txt` only keys that answered 200.
 */

const fs = require('fs');
const path = require('path');
const { ExitPool, readJson, writeJson, appendLine, nowIso, sleep } = require('./lib');
const { Panel } = require('./newapi');
const { collectCandidates, screenFor, saveScreened, screenedFile } = require('./xwave-lib');

// Same rule as verify.js: `403 IP banned` is the panel refusing the *exit*, not
// the key. Without this the ban lands in `verifyIndependent.models.status` as a
// 403 and reads like a key verdict.
const ipban = require('./ipban');
ipban.guard({ Panel });

const argv = process.argv.slice(2);
const one = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt;
};
const many = (name) => {
  const out = [];
  for (let i = 0; i < argv.length; i++) if (argv[i] === `--${name}` && argv[i + 1]) out.push(argv[i + 1]);
  return out;
};

const NAME = one('name');
if (!NAME) {
  console.error('usage: verify-key.js --name <provider> [--base URL] [--key K] [--model id,id] [--pool FILE] [--max-tokens 8] [--all]');
  process.exit(2);
}

const DIR = path.resolve(__dirname, '..'); // data root (the repo root)
const CFG = readJson(path.join(DIR, 'config.json'), {});
const BASE = one('base', CFG.base);
if (!BASE) {
  console.error(`no base for ${NAME} (config.json missing)`);
  process.exit(2);
}
const HOST = new URL(BASE).host;
const POOLS = many('pool');
const MODELS = (one('model', '') || '').split(',').map((s) => s.trim()).filter(Boolean);
const MAX_TOKENS = parseInt(one('max-tokens', '8'), 10);
const ONLY_KEY = one('key', '');
const ALL = argv.includes('--all');
const WANT_EXITS = parseInt(one('want', '3'), 10);
// Some forks gate `/api/pricing` behind a session (measured 2026-10-15:
// www.dmxapi.cn answers 403 to anonymous GETs). With this flag the tool logs in
// as the account and reads the price table, so "which models are free / how
// much does an account really get" is measured instead of guessed.
const AUTH_PATH = one('auth-path', '');

const ACCOUNTS = path.join(DIR, 'accounts.json');
const KEYS = path.join(DIR, 'keys.txt');
const MODELS_FILE = path.join(DIR, 'models.json');
const log = (...a) => console.log(`[${nowIso()}] ${a.join(' ')}`);

/** Cheap-model ranking — same heuristic the mint engines use. */
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

/**
 * Screens exits for the host and returns the pool, with any `avoid` lines
 * pushed to the back so the *independent* exit is the one that gets pinned.
 */
async function exitPool(avoid = []) {
  const extra = POOLS.length ? POOLS : [screenedFile(HOST)];
  const { candidates } = await collectCandidates({ host: HOST, extra, log: (m) => log('· ' + m) });
  const avoidSet = new Set(avoid.filter(Boolean));
  const ordered = [...candidates.filter((p) => !avoidSet.has(p.line)), ...candidates.filter((p) => avoidSet.has(p.line))];
  const { good } = await screenFor(BASE, ordered, { want: WANT_EXITS, conc: 3, budgetMs: 180000, log: (m) => log('· ' + m) });
  // Write the exits that answered to the canonical screened list: one screening
  // then serves every later mint for this host (an early lesson — a mint’s own
  // screen is the expensive half, and the next run re-pays for it otherwise).
  if (good.length) saveScreened(HOST, good, { log: (m) => log(m) });
  return { pool: new ExitPool(good.length ? good : ordered.slice(0, 5), { label: NAME }), good };
}

(async () => {
  const accounts = readJson(ACCOUNTS, []);
  let todo = accounts.filter((r) => r.key);
  if (ONLY_KEY) todo = todo.filter((r) => r.key === ONLY_KEY);
  if (!ALL) todo = todo.filter((r) => r.status === 'minted' || r.status === 'key-unverified');
  if (!todo.length) {
    log(`no keys to verify for ${NAME}`);
    return;
  }
  log(`verify ${todo.length} key(s) for ${NAME} (${BASE})${MODELS.length ? ` · models=${MODELS.join(',')}` : ''}`);

  let ok = 0;
  for (const rec of todo) {
    const mintExit = (rec.verify && rec.verify.mintExit) || rec.verifyExit || '';
    const { pool, good } = await exitPool([mintExit]);
    const pin = good.find((p) => p.line !== mintExit) || good[0] || null;
    if (!pin) {
      log(`#${rec.index} no exit reaches ${HOST} — skipping`);
      continue;
    }
    const independent = Boolean(pin.line && pin.line !== mintExit);
    const panel = new Panel(BASE, pool, { label: NAME, log });
    try {
      const models = await panel.models(rec.key, { tries: 4 });
      const list = models.status === 200 && models.json && Array.isArray(models.json.data) ? models.json.data.map((m) => m.id || m) : null;
      if (list && list.length) writeJson(MODELS_FILE, { at: nowIso(), base: BASE, models: list });
      const ids = list || [];
      // A single cheapest model is not enough: a panel's *channel* for one model
      // can be down (measured 2026-10-15, camelhub: `ERNIE-Lite-8K` → 404
      // "当前模型暂时不可用" while the account held ¥1 credit and check-in had just
      // paid out). Try the five cheapest chat-shaped ids, stop on 200 or on a
      // quota refusal (which is the panel's answer for every further model).
      let tryList = MODELS.slice();
      if (!tryList.length) {
        const chatty = ids.filter((id) => !/embed|rerank|whisper|tts|image|audio|video|vision|bge|embedding/i.test(id));
        tryList = rankCheapest(chatty).slice(0, 5);
      }
      let chatBest = null;
      for (const id of tryList) {
        const chat = await panel.chat(rec.key, id, { tries: 4, timeoutMs: 90000, maxTokens: MAX_TOKENS });
        const text = chat.json ? JSON.stringify(chat.json).slice(0, 400) : String(chat.text || '').slice(0, 300);
        chatBest = { model: id, status: chat.status, text, exit: chat.exit };
        log(`#${rec.index} chat ${id} → ${chat.status} ${text.slice(0, 140)}`);
        if (chat.status === 200) break;
        // a quota refusal is the panel's answer for every further model too
        if (/insufficient|quota|额度|余额|balance/i.test(text)) break;
      }
      rec.verifyIndependent = {
        at: nowIso(),
        models: { status: models.status, count: list ? list.length : null, exit: models.exit },
        chat: chatBest,
        exit: pin.line,
        mintExit,
        independent,
        screened: good.length,
      };
      if (models.status === 200) {
        if (!fs.existsSync(KEYS) || !fs.readFileSync(KEYS, 'utf8').includes(rec.key)) appendLine(KEYS, rec.key);
        ok++;
      }
      // Optional authenticated price-table read (same exit, same session).
      if (AUTH_PATH && rec.username && rec.password) {
        try {
          const login = await panel.login({ username: rec.username, password: rec.password, tries: 2 });
          const pr = await panel.call(AUTH_PATH, { auth: true, tries: 2, timeoutMs: 60000 });
          const rows = pr.json && ((pr.json.data && (Array.isArray(pr.json.data) ? pr.json.data : pr.json.data.models)) || pr.json.models) || null;
          const priceFile = path.join(DIR, 'out', `pricing-${Date.now()}.json`);
          writeJson(priceFile, { at: nowIso(), base: BASE, login: { status: login.status, success: Boolean(login.json && login.json.success) }, path: AUTH_PATH, status: pr.status, rowCount: rows ? rows.length : null, rows: rows || pr.json || String(pr.text || '').slice(0, 400) });
          if (rows) {
            const free = rows.filter((r) => Number(r.model_ratio || 0) === 0 && Number(r.model_price || 0) === 0).map((r) => r.model_name);
            rec.verifyIndependent.pricing = { file: path.relative(process.cwd(), priceFile), rows: rows.length, freeModels: free.slice(0, 30), freeCount: free.length };
            log(`#${rec.index} pricing ${pr.status} · ${rows.length} rows · ${free.length} zero-price model(s)${free.length ? `: ${free.slice(0, 6).join(', ')}` : ''}`);
          } else {
            rec.verifyIndependent.pricing = { file: path.relative(process.cwd(), priceFile), status: pr.status, note: 'no rows parsed' };
            log(`#${rec.index} pricing ${pr.status} · no rows parsed (body ${String(pr.text || '').slice(0, 100)})`);
          }
        } catch (e) {
          rec.verifyIndependent.pricing = { error: String(e.message).slice(0, 160), path: AUTH_PATH };
          log(`#${rec.index} pricing read failed: ${String(e.message).slice(0, 120)}`);
        }
      }
      log(`#${rec.index} ${rec.key.slice(0, 10)}… models=${models.status} chat=${chatBest ? chatBest.status : 'n/a'} independent=${independent} (verify exit ${pin.line}, mint exit ${mintExit || 'n/a'})`);
    } catch (e) {
      const fail = { at: nowIso(), error: String(e.message).slice(0, 200), exit: pin.line, mintExit, independent };
      // A failed *re-*verification must not erase a pass that already happened
      // (measured 2026-10-15: camelhub key #5 verified 200/200 in one run, then
      // an exit death on the retry overwrote the record).
      if (rec.verifyIndependent && rec.verifyIndependent.models && rec.verifyIndependent.models.status === 200) rec.verifyIndependent.lastError = fail;
      else rec.verifyIndependent = fail;
      log(`#${rec.index} verify error: ${String(e.message).slice(0, 140)}`);
    }
    writeJson(ACCOUNTS, accounts);
    await sleep(1000);
  }
  log(`done: ${NAME} — ${ok}/${todo.length} keys answered /v1/models 200`);
})().catch((e) => {
  console.error(`FATAL ${e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e}`);
  process.exit(1);
});
