#!/usr/bin/env node
'use strict';

/**
 * IP-ban handling for camelhub-bulk-apikey.
 *
 * This panel answers `403 {"error":{"message":"IP banned: (request id: …)"}}` when
 * it has blocked the *exit*, not when the key is bad — the same key answers 200
 * from another exit minutes later. It is the panel banning us on purpose: a small
 * exit set reused across a mint and its verification is enough to earn it. So a
 * ban must retire the exit and move on; it must never be recorded as a key
 * verdict, and a run that ends because of bans must say so instead of reading
 * like "the keys are dead".
 *
 * `guard()` wraps the panel client so a ban response is re-raised as an exit
 * failure — the retry loops already in place (`ExitPool.attempt` for verification,
 * the pinned mint's re-pin guard for minting) then retire that exit and continue
 * on the next one, exactly as they do for a transport error. Counts and the
 * offending exits are kept in `stats` for the run summary.
 *
 *   const ipban = require('./ipban.js');
 *   ipban.guard({ Panel: require('./newapi.js').Panel });
 */

const BAN_RE = /IP banned|ip_banned|IP 封禁|IP已被封禁|IP 黑名单|IP黑名单/i;

const stats = { banned: 0, exits: [] };

/** True when a panel answer is the panel banning the exit. */
function isBan(res) {
  if (!res || typeof res !== 'object') return false;
  const text = String(res.text || '') || JSON.stringify(res.json || {});
  return BAN_RE.test(text);
}

function record(line) {
  stats.banned++;
  if (line && !stats.exits.includes(line)) stats.exits.push(line);
}

/**
 * The error a ban becomes. The message carries the word "proxy" on purpose: the
 * shared `isExitError()` classifies exit failures by text, and this must take the
 * exit path (retire + retry) rather than the panel-answer path.
 */
function banError(res, line) {
  const err = new Error(`the panel IP-banned this proxy exit (${line || res.exit || 'unknown'}): ${String(res.text || '').slice(0, 160)}`);
  err.ipBanned = true;
  err.exit = line || res.exit || null;
  return err;
}

/** Retire the banned exit in the pool that served it, when the pool can be reached. */
function retire(pool, line) {
  if (!pool || typeof pool.kill !== 'function') return;
  const exits = pool.exits || (pool.pin ? [pool.pin] : []);
  const hit = exits.find((p) => p && p.line === line);
  if (hit) pool.kill(hit);
}

/**
 * Wrap `Panel.prototype.{call,models,chat}`: a ban answer throws instead of being
 * returned, and the exit that earned it is retired. Idempotent.
 */
function guard({ Panel }) {
  if (!Panel || Panel.__ipBanGuarded) return stats;
  for (const method of ['call', 'models', 'chat']) {
    const original = Panel.prototype[method];
    Panel.prototype[method] = async function (...args) {
      const res = await original.apply(this, args);
      if (isBan(res)) {
        record(res.exit);
        retire(this.pool, res.exit);
        throw banError(res, res.exit);
      }
      return res;
    };
  }
  Panel.__ipBanGuarded = true;
  return stats;
}

/** Print the ban tally when the process ends — a mint's own summary never mentions it. */
function reportOnExit() {
  process.on('exit', () => {
    if (!stats.banned) return;
    console.log(`\n⚠ ${stats.banned} exit(s) were IP-banned by the panel and retired — the tool moved to the next exit each time`);
    for (const line of stats.exits) console.log(`  · ${line}`);
  });
}

module.exports = { isBan, guard, banError, reportOnExit, stats, BAN_RE };
