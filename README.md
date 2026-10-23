<div align="center">

```
 ██████╗ █████╗ ███╗   ███╗███████╗██╗     ██╗  ██╗██╗   ██╗██████╗
██╔════╝██╔══██╗████╗ ████║██╔════╝██║     ██║  ██║██║   ██║██╔══██╗
██║     ███████║██╔████╔██║█████╗  ██║     ███████║██║   ██║██████╔╝
██║     ██╔══██║██║╚██╔╝██║██╔══╝  ██║     ██╔══██║██║   ██║██╔══██╗
╚██████╗██║  ██║██║ ╚═╝ ██║███████╗███████╗██║  ██║╚██████╔╝██████╔╝
 ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝
```

# camelhub-bulk-apikey

**Bulk-create CaMeL AI accounts with auto-generated API keys — OpenAI-compatible inference (469 models: Claude, Gemini, DeepSeek, GLM, Qwen) + 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-469%20served-412991?style=for-the-badge)](https://camel-hub.cn)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-469-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Free tier — how much you get

**Every new account holds a real, spendable credit: $1.00 on sign-up plus a paid daily check-in — no card, no captcha.**

| Item | Measured |
| --- | --- |
| Sign-up grant | **500,000 quota = $1.00** (`quota_per_unit: 500000`, `usd_exchange_rate: 1`) |
| Daily check-in | **enabled**, paid **$0.56 – $1.86** on the first day across three accounts |
| Balance after sign-up + one same-day check-in | **$1.556 · $2.062 · $2.856** |
| Captcha at sign-up | **none** (`turnstile_check: false`) |
| E-mail the panel accepts | plain `@gmail.com` (a dotted alias is refused: `邮箱地址别名限制`); `@qq.com` works on the panel's own mail wall |
| Rate limit on a key | **none measured** — see the model-channel note below |
| The unit that scales | **one account = one key** → `--count N` is really "N free accounts" |

**The credit is real; not every model channel is up.** A *listed* model can still answer `404 当前模型暂时不可用` while its channel is down — measured on one batch: `ERNIE-Lite-8K` and `claude-3-haiku-20240307` down, `claude-haiku-4-5` answering `200` on the same key seconds later. That is why the tool walks the cheapest listed ids instead of trusting the first one.

> 💡 The free tier is set by CaMeL AI and can change. Check the live numbers at [camel-hub.cn](https://camel-hub.cn) — and let the tool's own gate decide:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Models — all 469 of them

`GET https://api.camel-hub.com/v1/models` returns **469 model ids** for a minted key, for example:

```
claude-haiku-4-5 · claude-opus-4-5 · gemini-2.5-flash · deepseek-chat
deepseek-r1-250528 · qwen-flash · glm-4.5 · kimi-k2.5
grok-4 · gpt-3.5-turbo · llama-3.1-405b
```

| Call | Status | Body |
| --- | --- | --- |
| `claude-haiku-4-5` | **200** | `{"id":"<chat-id>","object":"chat.completion",…}` |
| `ERNIE-Lite-8K` | **404** | `当前模型暂时不可用` (channel down) |
| `claude-3-haiku-20240307` | **404** | `当前模型暂时不可用` (channel down) |

Both 404s came from the same key that answered 200 for `claude-haiku-4-5` seconds later, so a down channel is a property of the model, not of your key. `verify` walks the cheapest listed ids for that reason, and `--model <id>` pins the one you care about.

```bash
curl https://api.camel-hub.com/v1/models -H "Authorization: Bearer <one of your keys>"
```

## 🧪 How to use the API

The base URL is **`https://api.camel-hub.com/v1`** — OpenAI-compatible, so anything that speaks OpenAI works (SDKs, Cursor, OpenCode, Kilo Code, …).

```bash
curl https://api.camel-hub.com/v1/chat/completions \
  -H "Authorization: Bearer <one of your keys>" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-haiku-4-5","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

```python
from openai import OpenAI
client = OpenAI(base_url="https://api.camel-hub.com/v1", api_key="<your key>")
print(client.chat.completions.create(model="claude-haiku-4-5",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

The panel runs several API hosts; `https://api.camel-hub.com` is the one this batch was measured against, and `--base URL` points the tools at another (the panel's own gates name `https://api.camel-hub.cn` as the current main line).

## 🛠 Quick start

```bash
# clone this repository (or download the ZIP), then:
cd camelhub-bulk-apikey

# 1) your proxy list, one exit per line (http://, socks5://, socks4:// or bare host:port) — optional
printf 'socks5://127.0.0.1:1080\n' > proxies.txt   # optional — without it the tool runs direct

# 2) go
node src/launcher.js               # interactive: mint / verify / settings
# or drive it directly:
node src/cli.js mint --count 30            # any N; 5 is the sample default
node src/cli.js mint --count 10 --scan-conc 8
node src/cli.js verify                     # re-check every key in keys.txt
node src/cli.js help                       # task list
node src/mint.js --help                    # the flags mint actually reads
```

Keys are appended to `keys.txt`, one per line, once a key has answered `GET /v1/models` 200 *and* a model call has come back (a completion, or a credit refusal — only an error withholds it). Accounts run one after another; `--count 30` is a long run, and `out/pinned-<date>.log` is the running record of it. The proxy pool is OPTIONAL: with exits in `proxies.txt` every panel call rides one of them, and with no list at all the run goes out direct (recommended at scale, never required).

### 🖱️ The launcher

```bash
node src/launcher.js
```

A menu over the task modules: **mint**, **verify**, **9Router**. It asks for `count` (keys per run) and `conc` (parallel exit probes), keeps them in `launcher.config.json`, and spawns `node src/cli.js <task>` with the right flags. `node src/launcher.js --connect-9router` runs the 9Router registration directly and asks for the base URL and password first.

## ✅ Verified working — every key is tested

Measured **2026-10-15**: **each account minted its own key, one key per account**. Every key was checked after it existed, on an exit *independent* of the mint — and every key was re-checked later, because the panel bans by exit *and* by account.

| Model | Live (models) | Real chat call | Measured |
| --- | --- | --- | --- |
| `claude-haiku-4-5` | **200** · 469 models | **200** · `claude-haiku-4-5` · `<chat-id>` | 2026-10-15 09:57 |
| `claude-haiku-4-5` | **200** · 469 models | **200** · `claude-haiku-4-5` · `<chat-id>` | 2026-10-15 09:55 |
| `claude-haiku-4-5` | **200** · 469 models | **200** · `claude-haiku-4-5` · `<chat-id>` | 2026-10-15 09:56 |
| `claude-haiku-4-5` | **200** · 469 models | **200** · `claude-haiku-4-5` · `<chat-id>` · re-checked 12:05 · ✔ **live** | 2026-10-15 11:08 |

`GET /v1/models` 200 proves a key is *authentic*; a completion 200 carrying a chat-completion body proves the account behind it can *spend*. `verify.js` (and every mint) records the exact status, body and observing exit of both calls per key in `accounts.json` — `verify` holds the current verdict, `verify.atMint` the measurement taken when the key was minted.

**Exit screening is the work.** This panel blocks by source IP, so an exit that answered a minute ago can start answering `403 IP banned`. Verification filters banned exits before spending a key on them, retires any that get banned later, and counts them — a key that could not be measured says `unmeasured` instead of reading as dead. The panel's own account ban (`403 auth.user_banned`) is recorded as exactly that, so neither a blocked exit nor a banned account can be mistaken for a broken key.

> **Quality gates.** Every key here passed a live `chat-200` before it was written to `keys.txt`
> (dead keys are never shipped). Router combos follow the same rule at the model level: an entry is
> added **only if the model answers `chat-200` and can call tools** — a model without tool support,
> a dead key or a dead provider is dropped instead of added. Re-run the verify step any time;
> failures are reported, never hidden.

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: CaMeL AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.camel-hub.com/v1/chat/completions → real content = the key is live
```

| Step | Call | Notes |
| --- | --- | --- |
| gates | the panel's own config | `turnstile_check: false`, `email_verification: true` |
| mailbox | [Emailnator](https://www.emailnator.com) | a fresh gmail address per account, read over your exits |
| verification mail | panel send | the code is only accepted when the mail's sender matches `noreply@<panel-mail>` / `CaMeL AI` |
| register | panel register route | plain HTTP, no captcha |
| check-in | daily check-in route | pays into the balance |
| key | panel key route | one key per account |
| prove | `GET /v1/models` + a real completion | both recorded, with the observing exit |

A banned exit is never read as a bad key: the tool retires that exit and re-measures elsewhere. The mailbox can be swapped with `--mail imap --imap-user … --imap-pass …` when you own the addresses (the panel refuses aliases, so each account then needs its own).

## ⚙️ CLI options

All code lives in `src/` — run it from the repository root as `node src/<file>.js`; the data files (`keys.txt`, `proxies.txt`, `accounts.json`, `out/`) stay in the repository root.

| Tool | Flags |
| --- | --- |
| `src/mint.js` | `--count N` (5) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (or `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--base URL` · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, max 8) · `--budget` (2400 s) |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | interactive: mint / verify / settings — `count` and `conc` persist in `launcher.config.json` |

```bash
node src/cli.js mint --count 30
node src/cli.js verify
node src/cli.js 9router
```

`--count` controls how many keys one run produces; the panel's grant is per account, so N keys are N accounts. `--scan` / `--scan-conc` control how much of your exit list is probed per pinned exit — raise `--scan` on a stale list, lower it on a small one.

## 🛰️ Behind a proxy

* Exits come from `proxies.txt` (one line per exit, `scheme://host:port`, `user:pass@` supported, `#` comments ignored). The same pool feeds the panel calls, the key verification and the mailbox reads.
* **Optional — recommended at scale (per-IP limits, bans).** The tool works without a proxy too: with no exit list (or an empty one) the CLI prints `running WITHOUT a proxy (direct)` and every request leaves from your own line — sign-up, key minting and verification are unchanged.
* **Screening is the work.** Each account pins the first exit that proves `GET /api/status` against the panel host (with no pool the pinned "exit" is the direct route), and verification pins a *different* proven exit — an exit that dies mid-run retires itself and the account continues on the next one.
* A banned exit answers `403 IP banned`; it is filtered before a key is spent on it and retired when it happens later.
* The mailbox ([Emailnator](https://www.emailnator.com)) is a third-party temp-mail service rather than the panel; its API is read through your exits as well.

## 📄 Files

| Path | Contents |
| --- | --- |
| `keys.txt` | one live-verified key per line — git-ignored |
| `accounts.json` | mailbox, steps, check-in, both verify exits per account — git-ignored |
| `models.json` | a fresh `/v1/models` capture per run — git-ignored |
| `proxies.txt` | your exits, one per line — git-ignored |
| `out/pinned-<date>.log` | the per-run log (exit, timing, exact server answer) — git-ignored |
| `src/mint.js` · `src/verify.js` | the two engines the CLI dispatches to |
| `src/connect-9router.js` | registers the keys in `keys.txt` as 9Router connections |

## 🔌 Connect to 9Router

[9Router](https://9router.com) is a self-hosted, OpenAI-compatible router. CaMeL AI is OpenAI-compatible, so register it once and use every key:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
# or: node src/cli.js 9router
```

Every key in `keys.txt` becomes one connection of the `camelhub` provider node (`--api-key <key>` registers a single key instead, `--model <id>` overrides the default). Then pick a model inside 9Router:

```
camelhub/claude-haiku-4-5
camelhub/deepseek-chat
camelhub/glm-4.5
```

Defaults: `--base http://localhost:20128`, `--password 123456`, `--prefix camelhub`, `--base-url https://api.camel-hub.com/v1`, default model `claude-haiku-4-5`. Point the connector at a refreshed `keys.txt` to add more accounts; the node and its model list stay the same.

## 🔌 Connect to OmniRoute

[OmniRoute](https://omniroute.online) is a self-hosted, OpenAI-compatible router. CaMeL AI is OpenAI-compatible, so register it once and use every key:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
# or: node src/cli.js omniroute
```

Every key in `keys.txt` becomes one connection of the `camelhub` provider node (`--api-key <key>` registers a single key instead, `--model <id>` overrides the default). Then pick a model inside OmniRoute:

```
camelhub/claude-haiku-4-5
camelhub/deepseek-chat
camelhub/glm-4.5
```

Defaults: `--base http://localhost:20128`, `--password 123456`, `--prefix camelhub`, `--base-url https://api.camel-hub.com/v1`, default model `claude-haiku-4-5`. Point the connector at a refreshed `keys.txt` to add more accounts; the node and its model list stay the same.

## 🔑 What one key gets you

| | |
| --- | --- |
| 🏢 Provider | **CaMeL AI** — [camel-hub.cn](https://camel-hub.cn) |
| 🎁 What the provider gives | 469 listed models · $1.00 credit on sign-up plus a daily check-in · every key verified |
| 🔑 What one key gets you | one API key scoped to its own account: the 469 model ids on the endpoint below, at your plan's limits. The quota lives on the **account**, which is exactly why this tool creates one account per key |
| 🌐 API shape | OpenAI-compatible: `POST https://api.camel-hub.com/v1/chat/completions` |
| 🔒 Your data | only camel-hub.cn and the inbox backend you configure are contacted; keys stay on your machine |

## 🐞 Issues

Open an issue with the failing step and the run log tail (`out/pinned-<date>.log`) — it carries the exit, the timing and the exact server answer, which is everything needed to reproduce a miss. Never attach a key. **[Open an issue](../../issues)** and PRs are welcome.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 camelhub-bulk-apikey contributors

</div>
