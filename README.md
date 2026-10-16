<div align="center">

```
 ██████╗   █████╗  ███╗   ███╗ ███████╗ ██╗      ██╗  ██╗ ██╗   ██╗ ██████╗
██╔════╝  ██╔══██╗ ████╗ ████║ ██╔════╝ ██║      ██║  ██║ ██║   ██║ ██╔══██╗
██║       ███████║ ██╔████╔██║ █████╗   ██║      ███████║ ██║   ██║ ██████╔╝
██║       ██╔══██║ ██║╚██╔╝██║ ██╔══╝   ██║      ██╔══██║ ██║   ██║ ██╔══██╗
╚██████╗  ██║  ██║ ██║ ╚═╝ ██║ ███████╗ ███████╗ ██║  ██║ ╚██████╔╝ ██████╔╝
 ╚═════╝  ╚═╝  ╚═╝ ╚═╝     ╚═╝ ╚══════╝ ╚══════╝ ╚═╝  ╚═╝  ╚═════╝  ╚═════╝
```

# camelhub-bulk-apikey

**Bulk-create CaMeL AI accounts with auto-generated API keys — OpenAI-compatible + 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6.svg?style=for-the-badge)](#-connect-to-9router)
[![Models](https://img.shields.io/badge/models-469%20listed-d97706?style=for-the-badge)](https://camel-hub.cn)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [✅ Verified](#-verified-authentic--spendable) · [🤖 Models & free tier](#-models--free-tier) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

---

> **One account, one key.** N accounts → N keys, one sign-up each, every key verified live
> before it lands in `keys.txt` — `GET /v1/models` must answer 200 for it *and* a real
> completion must come back, on an exit other than the one that minted it.

> **The credit is real; not every model channel is up.** The sign-up grant and the daily
> check-in both pay, and keys complete — but a model that is *listed* can still answer
> `404 当前模型暂时不可用` while its channel is down (measured on this batch: `ERNIE-Lite-8K`
> and `claude-3-haiku-20240307` down, `claude-haiku-4-5` answering 200 on the same key).
> That is why the tool walks the cheapest listed ids instead of trusting the first one.

## ✨ What this does

* **One account per key, any number you want.** `--count N` (default 5) mints N fresh
  accounts and appends one key per line to `keys.txt`.
* **No mailbox to set up.** Every account gets its own fresh gmail address from
  [Emailnator](https://www.emailnator.com), which is the form this panel accepts; the
  verification mail is read over your exits, so the sign-up runs unattended.
* **No captcha step.** The panel's own gates report `turnstile_check = false`, so the
  sign-up is plain HTTP from start to finish (`email_verification = true`).
* **Keys are verified, not assumed.** Each key is checked on `GET /v1/models` (its own
  host, an exit other than the mint's) *and* probed with a real completion, so you know
  whether a key is spendable today or only authentic.
* **A banned exit is never read as a bad key.** This panel blocks by source IP, so an exit
  that answered a minute ago can start answering `403 IP banned`. Verification filters
  banned exits before it spends a key on them, retires any that get banned later, and
  counts them — a key that could not be measured says `unmeasured` instead of reading as
  dead, and the closing line of the run says which exits the panel banned. The panel's own
  account ban (`403 auth.user_banned`) is recorded as exactly that, so neither a blocked
  exit nor a banned account can be mistaken for a broken key.
* **Everything lands on disk.** `keys.txt` (one key per line), `accounts.json` (mailbox,
  steps, check-in, both verify exits), a fresh `models.json`, and a per-run log under `out/`.

## 🛠 Quick start

```bash
# clone this repository (or download the ZIP), then:
cd camelhub-bulk-apikey

# 1) your proxy list, one exit per line (http://, socks5://, socks4:// or bare host:port)
printf 'socks5://127.0.0.1:1080\n' > proxies.txt

# 2) go
node src/launcher.js               # interactive: mint / verify / settings
# or drive it directly:
node src/cli.js mint --count 30            # any N; 5 is the sample default
node src/cli.js mint --count 10 --scan-conc 8
node src/cli.js verify                     # re-check every key in keys.txt
node src/cli.js help                       # task list
node src/mint.js --help                    # the flags mint actually reads
```

Keys are appended to `keys.txt`, one per line, once a key has answered `GET /v1/models`
200 *and* a model call has come back with something (a completion, or a credit refusal —
only an error withholds it). Accounts run one after another; `--count 30` is a long run,
and `out/pinned-<date>.log` is the running record of it. Nothing is sent to the panel that
does not go through an exit from `proxies.txt` — a call with no exit left raises instead of
dialing out directly.

`GET /v1/models` 200 plus an answered completion is the gate for `keys.txt`, so every line
in it is a key that authenticated against the panel host *and* spent on it.

## ✅ Verified: authentic + spendable

Measured **2026-10-15**: **4 accounts → 4 keys, one key per account**. Every key was checked
after it existed, on an exit *independent* of the mint — and every key was re-checked later,
because the panel bans by exit *and* by account. **1 of the 4 is live as this was written**
(2026-10-15 12:05 UTC); the other three were answered `403 auth.user_banned` (the panel
banned the account after its key had worked):

| model | live (test) | real chat call | measured |
|---|---|---|---|
| `claude-haiku-4-5` | **200** · 469 models | **200** · `claude-haiku-4-5` · `<chat-id>` | 2026-10-15 09:57 |
| `claude-haiku-4-5` | **200** · 469 models | **200** · `claude-haiku-4-5` · `<chat-id>` | 2026-10-15 09:55 |
| `claude-haiku-4-5` | **200** · 469 models | **200** · `claude-haiku-4-5` · `<chat-id>` | 2026-10-15 09:56 |
| `claude-haiku-4-5` | **200** · 469 models | **200** · `claude-haiku-4-5` · `<chat-id>` · re-checked 12:05 · ✔ **live** | 2026-10-15 11:08 |

**The two middle columns are the point.** `GET /v1/models` 200 proves a key is *authentic*;
a completion 200 carrying a chat-completion body (`<chat-id>`) proves the account behind it can *spend*. `verify.js`
(and every mint) records the exact status, body and observing exit of both calls per key in
`accounts.json` — `verify` holds the current verdict, `verify.atMint` the measurement taken
when the key was minted — so "the key works" is never confused with "this session works",
and an account the panel banned is reported as banned rather than as a broken key.

The three banned accounts were minted back to back in the first batch; the one that is still
live was minted on its own through `mint.js` exactly as published. A key is never committed —
`keys.txt` is git-ignored and is where your own keys land.

## 🤖 Models & free tier

`GET /v1/models` returns **469 model ids** for a minted key, for example:

```
claude-haiku-4-5 · claude-opus-4-5 · gemini-2.5-flash · deepseek-chat
deepseek-r1-250528 · qwen-flash · glm-4.5 · kimi-k2.5
grok-4 · gpt-3.5-turbo · llama-3.1-405b
```

**What a fresh account holds** — read off the panel's own gates and the accounts in the
table above:

| item | measured |
|---|---|
| sign-up grant | **500,000 quota = $1.00** (`quota_per_unit: 500000`, `usd_exchange_rate: 1`) |
| daily check-in | **enabled**, paid `$0.56 – $1.86` on the first day across three accounts |
| balance after sign-up + one same-day check-in | **$1.556 · $2.062 · $2.856** |
| captcha at sign-up | **none** (`turnstile_check: false`) |
| e-mail the panel accepts | plain `@gmail.com` (a dotted alias is refused: `邮箱地址别名限制`); the panel's mail wall takes `@qq.com` too |

**No rate limit was measured on a key.** What the batch saw instead was a listed model whose
channel was down — the same key that answered 200 for `claude-haiku-4-5` answered `404` for
two other ids:

| call | status | body |
|---|---|---|
| `claude-haiku-4-5` | **200** | `{"id":"<chat-id>","object":"chat.completion",…}` |
| `ERNIE-Lite-8K` | **404** | `当前模型暂时不可用 (request id: 202610150957163500869548268d9d6AuoSH231)` |
| `claude-3-haiku-20240307` | **404** | `当前模型暂时不可用 (request id: 202610150957176610724008268d9d6WhPqLlbQ)` |

Both 404s came from the same key that answered 200 for `claude-haiku-4-5` seconds later, so
a down channel is a property of the model, not of your key. `verify.js` walks the cheapest
listed ids for that reason, and `--model <id>` pins the one you care about.

## 🔌 Connect to 9Router

CaMeL AI is OpenAI-compatible, so register it once and use every key:

```bash
node src/connect-9router.js \
  --base http://localhost:20128 --password 123456 \
  --keys-file keys.txt
```

Every key in `keys.txt` becomes one connection of the `camelhub` provider node
(`--api-key <key>` registers a single key instead, `--model <id>` overrides the
default). Then pick a model inside 9Router:

```
camelhub/claude-haiku-4-5
camelhub/deepseek-chat
camelhub/glm-4.5
```

Point the connector at a refreshed `keys.txt` to add more accounts; the node and
its model list stay the same. `node src/launcher.js --connect-9router` runs exactly
this and asks for the base URL and password first.

## ⚙️ Options

All code lives in `src/` — run it from the repository root as `node src/<file>.js`; the data files
(`keys.txt`, `proxies.txt`, `accounts.json`, `out/`) stay in the repository root.

| tool | flags |
|---|---|
| `src/mint.js` | `--count N` (5) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (or `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--base URL` · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, max 8) · `--budget` (2400 s) |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | interactive: mint / verify / settings — `count` (keys per run) and `conc` (parallel exit probes) persist in `launcher.config.json` |

`--count` controls how many keys one run produces; the panel's grant is per account, so N
keys are N accounts. `--scan` / `--scan-conc` control how much of your exit list is probed
per pinned exit — raise `--scan` on a stale list, lower it on a small one.

## 🛰️ Behind a proxy

* Exits come from `proxies.txt` (one line per exit, `scheme://host:port`, `user:pass@`
  supported, `#` comments ignored). The same pool feeds the panel calls, the key
  verification and the mailbox reads; the tools never dial the provider directly.
* **Screening is the work.** Each account pins the first exit that proves
  `GET /api/status` against the panel host, and verification pins a *different* proven
  exit — an exit that dies mid-run retires itself and the account continues on the next one.
* The mailbox is [Emailnator](https://www.emailnator.com), a third-party temp-mail service
  rather than the panel; its API is read through your exits as well. `--mail imap` switches
  to a mailbox you own instead, which needs a real address per account here — the panel
  refuses address aliases.
* The panel runs several API hosts; `https://api.camel-hub.com` is the one this batch was
  measured against, and `--base URL` points the tools at another (its own gates name
  `https://api.camel-hub.cn` as the current main line).

## 🐞 Issues

Open an issue with the failing step and the run log tail (`out/pinned-<date>.log`) — it
carries the exit, the timing and the exact server answer, which is everything needed to
reproduce a miss. Never attach a key.

## 📄 License

MIT — see [LICENSE](LICENSE). Use it on accounts you are allowed to create.

---

<div align="center">

**Built by camelhub-bulk-apikey contributors** · [x.com/bigbullapp](https://x.com/bigbullapp)

</div>
