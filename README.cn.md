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
**批量创建 CaMeL AI 账户并自动生成 API 密钥 — 兼容 OpenAI 的推理服务（469 个模型：Claude、Gemini、DeepSeek、GLM、Qwen）+ 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-469%20served-412991?style=for-the-badge)](https://camel-hub.cn)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-469-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题反馈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 免费额度 — 你能获得多少

**每个新账户都持有真实、可消费的额度：注册即得 $1.00，外加每日付费签到 — 无需银行卡，无需验证码。**

| 项目 | 实测 |
| --- | --- |
| 注册赠送 | **500,000 配额 = $1.00**（`quota_per_unit: 500000`，`usd_exchange_rate: 1`） |
| 每日签到 | **已启用**，三个账户首日签到分别支付 **$0.56 – $1.86** |
| 注册 + 当日一次签到后的余额 | **$1.556 · $2.062 · $2.856** |
| 注册时的验证码 | **无**（`turnstile_check: false`） |
| 面板接受的邮箱 | 普通 `@gmail.com`（带点的别名会被拒绝：`邮箱地址别名限制`）；`@qq.com` 在面板自带的邮件墙上可用 |
| 密钥的速率限制 | **未测得限制** — 见下方模型通道说明 |
| 可扩展的单位 | **一个账户 = 一个密钥** → `--count N` 实际上就是“N 个免费账户” |

**额度是真实的；但并非每个模型通道都可用。** 一个*已列出*的模型在其通道宕机时仍可能返回 `404 当前模型暂时不可用` — 在一批实测中：`ERNIE-Lite-8K` 和 `claude-3-haiku-20240307` 不可用，而 `claude-haiku-4-5` 在同一密钥上几秒后返回 `200`。这就是为什么该工具会遍历最便宜的已列出 id，而不是轻信第一个。

> 💡 免费额度由 CaMeL AI 设定，可能发生变化。请在 [camel-hub.cn](https://camel-hub.cn) 查看实时数据 — 并让工具自身的关卡来判定：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 — 全部 469 个

`GET https://api.camel-hub.com/v1/models` 会为已铸造的密钥返回 **469 个模型 id**，例如：

```

claude-haiku-4-5 · claude-opus-4-5 · gemini-2.5-flash · deepseek-chat
deepseek-r1-250528 · qwen-flash · glm-4.5 · kimi-k2.5
grok-4 · gpt-3.5-turbo · llama-3.1-405b
```

|模型|✓|
|---|---|
|`claude-haiku-4-5`|✓|

即使你的密钥正常，已列出的通道也可能返回 `404 当前模型暂时不可用`，因此只有验证器实际获得补全的 id 才会被勾选；`--model <id>` 可固定你关心的那个。

```bash
curl https://api.camel-hub.com/v1/models -H "Authorization: Bearer <one of your keys>"
```

## 🧪 如何使用 API

基础 URL 是 **`https://api.camel-hub.com/v1`** — 兼容 OpenAI，因此任何支持 OpenAI 的工具都能使用（SDK、Cursor、OpenCode、Kilo Code 等）。

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

面板运行着多个 API 主机；`https://api.camel-hub.com` 是本批次实测所针对的那个，`--base URL` 可将工具指向另一个（面板自身的关卡将 `https://api.camel-hub.cn` 标为当前主线）。

## 🛠 快速开始

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

一旦某个密钥对 `GET /v1/models` 返回 200 *且* 模型调用有返回（一次补全，或一次额度拒绝 — 只有错误才会使其被扣留），该密钥就会被追加到 `keys.txt`，每行一个。账户依次运行；`--count 30` 是一次长时间运行，`out/pinned-<date>.log` 是其运行记录。任何未经过 `proxies.txt` 中某个出口的请求都不会发送到面板 — 没有可用出口的调用会抛出异常，而不是直接拨出。

### 🖱️ 启动器

```bash
node src/launcher.js
```

一个覆盖各任务模块的菜单：**mint**、**verify**、**9Router**。它会询问 `count`（每次运行的密钥数）和 `conc`（并行出口探测数），将它们保存在 `launcher.config.json` 中，并以正确的标志启动 `node src/cli.js <task>`。`node src/launcher.js --connect-9router` 会直接运行 9Router 注册，并先询问基础 URL 和密码。

## ✅ 已验证可用 — 每个密钥都经过测试

实测于 **2026-10-15**：**4 个账户 → 4 个密钥，每个账户一个密钥**。每个密钥在生成后都经过检查，使用的是*独立于*铸造过程的出口 — 并且每个密钥后来都重新检查过，因为面板会按出口*和*按账户封禁。

| 模型 | 实时（models） | 真实聊天调用 | 实测时间 |
| --- | --- | --- | --- |
| `claude-haiku-4-5` | **200** · 469 个模型 | **200** · `claude-haiku-4-5` · `<chat-id>` · 12:05 重新检查 · ✔ **实时** | 2026-10-15 11:08 |

`GET /v1/models` 返回 200 证明密钥是*真实的*；携带聊天补全响应体的补全 200 证明其背后的账户能够*消费*。`verify.js`（以及每次铸造）会在 `accounts.json` 中记录每个密钥两次调用的确切状态、响应体和观察出口 — `verify` 保存当前判定，`verify.atMint` 保存密钥铸造时的测量结果。

**出口筛选才是关键工作。** 该面板按源 IP 封禁，因此一分钟前还能响应的出口可能开始返回 `403 IP banned`。验证会在将密钥用于某个出口之前过滤掉被封禁的出口，淘汰之后被封禁的出口，并对它们进行计数 — 无法测量的密钥会显示 `unmeasured`，而不会被当作已失效。面板自身的账户封禁（`403 auth.user_banned`）会被如实记录，因此无论是被封锁的出口还是被封禁的账户，都不会被误认为是密钥损坏。

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: CaMeL AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.camel-hub.com/v1/chat/completions → real content = the key is live
```

| 步骤 | 调用 | 说明 |
| --- | --- | --- |
| 关卡 | 面板自身的配置 | `turnstile_check: false`，`email_verification: true` |
| 邮箱 | [Emailnator](https://www.emailnator.com) | 每个账户一个全新的 gmail 地址，通过你的出口读取 |
| 验证邮件 | 面板发送 | 仅当邮件发件人匹配 `<panel-mail>` / `CaMeL AI` 时，验证码才会被接受 |
| 注册 | 面板注册路由 | 纯 HTTP，无验证码 |
| 签到 | 每日签到路由 | 计入余额 |
| 密钥 | 面板密钥路由 | 每个账户一个密钥 |
| 证明 | `GET /v1/models` + 一次真实补全 | 两者均被记录，并附观察出口 |

被封禁的出口绝不会被当作坏密钥：工具会淘汰该出口并在别处重新测量。当你拥有这些地址时，可用 `--mail imap --imap-user … --imap-pass …` 替换邮箱（面板拒绝别名，因此每个账户都需要自己的地址）。

## ⚙️ CLI 选项

所有代码都在 `src/` 中 — 从仓库根目录以 `node src/<file>.js` 运行；数据文件（`keys.txt`、`proxies.txt`、`accounts.json`、`out/`）保留在仓库根目录。

| 工具 | 标志 |
| --- | --- |
| `src/mint.js` | `--count N` (5) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (或 `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--base URL` · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, 最大 8) · `--budget` (2400 s) |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | 交互式：mint / verify / settings — `count` 和 `conc` 保存在 `launcher.config.json` 中 |

```bash
node src/cli.js mint --count 30
node src/cli.js verify
node src/cli.js 9router
```

`--count` 控制一次运行生成多少个密钥；面板的赠送是按账户计算的，因此 N 个密钥就是 N 个账户。`--scan` / `--scan-conc` 控制每个固定出口探测多少出口列表 — 列表陈旧时调高 `--scan`，列表较小时调低。

## 🛰️ 在代理之后

* 出口来自 `proxies.txt`（每行一个出口，`scheme://host:port`，支持 `user:pass@`，忽略 `#` 注释）。同一个池为面板调用、密钥验证和邮箱读取提供支持；工具从不直接拨向提供商。
* **筛选才是关键工作。** 每个账户固定第一个对面板主机证明 `GET /api/status` 可用的出口，而验证则固定一个*不同的*已验证出口 — 运行中途失效的出口会自行淘汰，账户则在下一个出口上继续。
* 被封禁的出口会返回 `403 IP banned`；它会在密钥被用于其上之前被过滤掉，并在之后发生时被淘汰。
* 邮箱（[Emailnator](https://www.emailnator.com)）是第三方临时邮件服务，而非面板；其 API 同样通过你的出口读取。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个实时验证的密钥 — 已被 git 忽略 |
| `accounts.json` | 每个账户的邮箱、步骤、签到、两个验证出口 — 已被 git 忽略 |
| `models.json` | 每次运行新捕获的 `/v1/models` — 已被 git 忽略 |
| `proxies.txt` | 你的出口，每行一个 — 已被 git 忽略 |
| `out/pinned-<date>.log` | 每次运行的日志（出口、时间、服务器确切响应）— 已被 git 忽略 |
| `src/mint.js` · `src/verify.js` | CLI 分派到的两个引擎 |
| `src/connect-9router.js` | 将 `keys.txt` 中的密钥注册为 9Router 连接 |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器。CaMeL AI 兼容 OpenAI，因此注册一次即可使用所有密钥：

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt

```

## 🔌 连接到 OmniRoute

[OmniRoute](https://omniroute.online) 是一个自托管、兼容 OpenAI 的路由器。CaMeL AI 兼容 OpenAI，因此注册一次即可使用所有密钥：

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456 --keys-file keys.txt

# or: node src/cli.js 9router
```

`keys.txt` 中的每个密钥都会成为 `camelhub` 提供商节点的一个连接（`--api-key <key>` 则注册单个密钥，`--model <id>` 覆盖默认值）。然后在 9Router 内选择一个模型：

```
camelhub/claude-haiku-4-5
camelhub/deepseek-chat
camelhub/glm-4.5
```

默认值：`--base http://localhost:20128`，`--password 123456`，`--prefix camelhub`，`--base-url https://api.camel-hub.com/v1`，默认模型 `claude-haiku-4-5`。将连接器指向刷新后的 `keys.txt` 即可添加更多账户；节点及其模型列表保持不变。

## 🔑 一个密钥能给你什么

| | |
| --- | --- |
| 🏢 提供商 | **CaMeL AI** — [camel-hub.cn](https://camel-hub.cn) |
| 🎁 提供商提供什么 | 469 个已列出模型 · 注册即得 $1.00 额度外加每日签到 · 每个密钥都经过实时验证 |
| 🔑 一个密钥能给你什么 | 一个限定于其自身账户的 API 密钥：下方端点上的 469 个模型 id，按你的套餐限制使用。配额存在于**账户**上，这正是本工具为每个密钥创建一个账户的原因 |
| 🌐 API 形态 | 兼容 OpenAI：`POST https://api.camel-hub.com/v1/chat/completions` |
| 🔒 你的数据 | 仅联系 camel-hub.cn 和你配置的邮箱后端；密钥保留在你的机器上 |

## 🐞 问题反馈

提交 issue 时请附上失败的步骤和运行日志尾部（`out/pinned-<date>.log`）— 它包含出口、时间和服务器确切响应，这是复现一次失败所需的全部信息。切勿附上密钥。**[提交 issue](../../issues)**，欢迎 PR。

## 📄 许可证

MIT © 2026 — 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 camelhub-bulk-apikey contributors

</div>