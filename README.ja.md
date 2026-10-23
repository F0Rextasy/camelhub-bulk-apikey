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

**自動生成された API キーで CaMeL AI アカウントを一括作成 — OpenAI 互換の推論（469 モデル: Claude、Gemini、DeepSeek、GLM、Qwen）+ 9Router コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-469%20served-412991?style=for-the-badge)](https://camel-hub.cn)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-469-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題報告](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 無料枠 — いくらもらえるか

**新しいアカウントにはすべて、実際に使えるクレジットが付きます。登録時に $1.00、さらに有料のデイリーチェックイン — カード不要、キャプチャ不要。**

| 項目 | 実測値 |
| --- | --- |
| 登録時の付与 | **500,000 クォータ = $1.00**（`quota_per_unit: 500000`、`usd_exchange_rate: 1`） |
| デイリーチェックイン | **有効**、初日に 3 アカウントで **$0.56 ～ $1.86** を支給 |
| 登録 + 同日 1 回のチェックイン後の残高 | **$1.556 · $2.062 · $2.856** |
| 登録時のキャプチャ | **なし**（`turnstile_check: false`） |
| パネルが受け付けるメール | プレーンな `@gmail.com`（ドット付きエイリアスは拒否: `邮箱地址别名限制`）、`@qq.com` はパネル自身のメールウォールで動作 |
| キーのレート制限 | **実測なし** — 下記のモデルチャネルの注記を参照 |
| スケールする単位 | **1 アカウント = 1 キー** → `--count N` は実質「N 個の無料アカウント」 |

**クレジットは本物ですが、すべてのモデルチャネルが稼働しているわけではありません。** *一覧に載っている*モデルでも、チャネルがダウンしていると `404 当前模型暂时不可用` を返すことがあります — あるバッチでの実測: `ERNIE-Lite-8K` と `claude-3-haiku-20240307` はダウン、同じキーで数秒後に `claude-haiku-4-5` は `200` を返しました。だからこそ、このツールは最初の 1 つを信頼せず、最も安価な一覧の id を順に試します。

> 💡 無料枠は CaMeL AI が設定するもので、変更される可能性があります。最新の数値は [camel-hub.cn](https://camel-hub.cn) で確認してください — そしてツール自身のゲートに判断させてください:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — 469 個すべて

`GET https://api.camel-hub.com/v1/models` は、発行されたキーに対して **469 個のモデル id** を返します。例えば:

```
claude-haiku-4-5 · claude-opus-4-5 · gemini-2.5-flash · deepseek-chat
deepseek-r1-250528 · qwen-flash · glm-4.5 · kimi-k2.5
grok-4 · gpt-3.5-turbo · llama-3.1-405b
```

| 呼び出し | ステータス | ボディ |
| --- | --- | --- |
| `claude-haiku-4-5` | **200** | `{"id":"<chat-id>","object":"chat.completion",…}` |
| `ERNIE-Lite-8K` | **404** | `当前模型暂时不可用`（チャネルダウン） |
| `claude-3-haiku-20240307` | **404** | `当前模型暂时不可用`（チャネルダウン） |

どちらの 404 も、数秒後に `claude-haiku-4-5` に対して 200 を返したのと同じキーから返されたものです。つまり、チャネルのダウンはキーの性質ではなくモデルの性質です。そのため `verify` は最も安価な一覧の id を順に試し、`--model <id>` で気になる 1 つを固定できます。

```bash
curl https://api.camel-hub.com/v1/models -H "Authorization: Bearer <one of your keys>"
```

## 🧪 API の使い方

ベース URL は **`https://api.camel-hub.com/v1`** です — OpenAI 互換なので、OpenAI を話せるものなら何でも動作します（SDK、Cursor、OpenCode、Kilo Code など）。

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

パネルは複数の API ホストを運用しています。`https://api.camel-hub.com` はこのバッチの測定対象であり、`--base URL` でツールを別のホストに向けられます（パネル自身のゲートは `https://api.camel-hub.cn` を現在のメインラインとしています）。

## 🛠 クイックスタート

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

キーは、`GET /v1/models` が 200 を返し、*かつ*モデル呼び出しが返ってきた（完了、またはクレジット拒否 — エラーのみが保留の理由）時点で、`keys.txt` に 1 行ずつ追記されます。アカウントは順番に実行されます。`--count 30` は長時間の実行となり、`out/pinned-<date>.log` がその実行記録です。プロキシプールは任意です: `proxies.txt` に exit があればすべてのパネル呼び出しがそのいずれかを経由し、リストがまったく無ければ実行は直接接続で行われます（大規模時は推奨、必須ではありません）。

### 🖱️ ランチャー

```bash
node src/launcher.js
```

タスクモジュールの上にメニューを表示します: **mint**、**verify**、**9Router**。`count`（実行あたりのキー数）と `conc`（並列 exit プローブ数）を尋ね、それらを `launcher.config.json` に保持し、適切なフラグで `node src/cli.js <task>` を起動します。`node src/launcher.js --connect-9router` は 9Router 登録を直接実行し、最初にベース URL とパスワードを尋ねます。

## ✅ 検証済みで動作 — すべてのキーがテスト済み

実測 **2026-10-15**: **各アカウントが自身のキーを発行、1 アカウントにつき 1 キー**。すべてのキーは存在後、mint とは*独立*した exit でチェックされ、さらに後で再チェックされました。パネルは exit *および*アカウントで BAN するためです。

| モデル | 稼働中（models） | 実際のチャット呼び出し | 実測 |
| --- | --- | --- | --- |
| `claude-haiku-4-5` | **200** · 469 models | **200** · `claude-haiku-4-5` · `<chat-id>` | 2026-10-15 09:57 |
| `claude-haiku-4-5` | **200** · 469 models | **200** · `claude-haiku-4-5` · `<chat-id>` | 2026-10-15 09:55 |
| `claude-haiku-4-5` | **200** · 469 models | **200** · `claude-haiku-4-5` · `<chat-id>` | 2026-10-15 09:56 |
| `claude-haiku-4-5` | **200** · 469 models | **200** · `claude-haiku-4-5` · `<chat-id>` · 12:05 に再チェック · ✔ **稼働中** | 2026-10-15 11:08 |

`GET /v1/models` の 200 はキーが*本物*であることを証明し、chat-completion ボディを伴う完了 200 はその背後のアカウントが*消費*できることを証明します。`verify.js`（およびすべての mint）は、キーごとに両方の呼び出しの正確なステータス、ボディ、観測した exit を `accounts.json` に記録します — `verify` は現在の判定を、`verify.atMint` はキーが発行された時点の測定値を保持します。

**exit のスクリーニングが本作業です。** このパネルは送信元 IP でブロックするため、1 分前に応答した exit が `403 IP banned` を返し始めることがあります。検証は BAN された exit を、キーを消費する前にフィルタリングし、後で BAN されたものは退役させ、それらをカウントします — 測定できなかったキーは dead と読まれる代わりに `unmeasured` と表示されます。パネル自身のアカウント BAN（`403 auth.user_banned`）はまさにそのように記録されるため、ブロックされた exit も BAN されたアカウントも、壊れたキーと誤認されることはありません。

> **品質ゲート。** ここにあるすべてのキーは、`keys.txt` に書き込まれる前にライブの `chat-200` を通過しています
> （dead キーは決して出荷されません）。ルーターのコンボもモデルレベルで同じルールに従います: エントリは
> **モデルが `chat-200` を返し、かつツールを呼び出せる場合にのみ**追加されます — ツールサポートのないモデル、
> dead キー、dead プロバイダは追加されずに除外されます。検証ステップはいつでも再実行できます。
> 失敗は報告され、決して隠されません。

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: CaMeL AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.camel-hub.com/v1/chat/completions → real content = the key is live
```

| ステップ | 呼び出し | 備考 |
| --- | --- | --- |
| ゲート | パネル自身の設定 | `turnstile_check: false`、`email_verification: true` |
| メールボックス | [Emailnator](https://www.emailnator.com) | アカウントごとに新しい gmail アドレス、あなたの exit 経由で読み取り |
| 確認メール | パネル送信 | コードはメールの送信者が `noreply@<panel-mail>` / `CaMeL AI` に一致する場合のみ受け入れられます |
| 登録 | パネル登録ルート | プレーン HTTP、キャプチャなし |
| チェックイン | デイリーチェックインルート | 残高に入金 |
| キー | パネルキールート | 1 アカウントにつき 1 キー |
| 証明 | `GET /v1/models` + 実際の完了 | 両方とも記録、観測した exit 付き |

BAN された exit が不良キーとして読まれることは決してありません: ツールはその exit を退役させ、別の場所で再測定します。アドレスを自分で所有している場合は、メールボックスを `--mail imap --imap-user … --imap-pass …` で切り替えられます（パネルはエイリアスを拒否するため、各アカウントにそれぞれ独自のものが必要です）。

## ⚙️ CLI オプション

すべてのコードは `src/` にあります — リポジトリルートから `node src/<file>.js` として実行してください。データファイル（`keys.txt`、`proxies.txt`、`accounts.json`、`out/`）はリポジトリルートに残ります。

| ツール | フラグ |
| --- | --- |
| `src/mint.js` | `--count N`（5） · `--pool FILE`（`proxies.txt`） · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass`（または `IMAP_USER` / `IMAP_PASS`） · `--mail-address` · `--base URL` · `--model ID` · `--poll-ms`（2000） · `--code-wait`（300000） · `--max-cycle`（3） · `--scan`（200） · `--scan-conc`（8、最大 8） · `--budget`（2400 秒） |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens`（8） · `--want`（3） · `--pool FILE` · `--base URL` |
| `src/launcher.js` | 対話式: mint / verify / settings — `count` と `conc` は `launcher.config.json` に保持されます |

```bash
node src/cli.js mint --count 30
node src/cli.js verify
node src/cli.js 9router
```

`--count` は 1 回の実行で生成されるキー数を制御します。パネルの付与はアカウント単位なので、N 個のキーは N 個のアカウントです。`--scan` / `--scan-conc` は、固定された exit ごとに exit リストのどれだけをプローブするかを制御します — 古いリストでは `--scan` を上げ、小さなリストでは下げてください。

## 🛰️ プロキシの背後で

* exit は `proxies.txt` から取得されます（1 行につき 1 exit、`scheme://host:port`、`user:pass@` 対応、`#` コメントは無視）。同じプールがパネル呼び出し、キー検証、メールボックス読み取りに供給されます。
* **任意 — 大規模時は推奨（IP ごとの制限、BAN）。** ツールはプロキシなしでも動作します: exit リストがない（または空の）場合、CLI は `running WITHOUT a proxy (direct)` と表示し、すべてのリクエストはあなた自身の回線から出ます — 登録、キー発行、検証は変わりません。
* **スクリーニングが本作業です。** 各アカウントは、パネルホストに対して `GET /api/status` を証明した最初の exit を固定し（プールがない場合、固定された「exit」は直接ルートです）、検証は*別の*証明済み exit を固定します — 実行中に死んだ exit は自身を退役させ、アカウントは次の exit で続行します。
* BAN された exit は `403 IP banned` を返します。キーを消費する前にフィルタリングされ、後で発生した場合は退役させられます。
* メールボックス（[Emailnator](https://www.emailnator.com)）はパネルではなくサードパーティの一時メールサービスです。その API もあなたの exit 経由で読み取られます。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | ライブ検証済みのキーを 1 行に 1 つ — git 無視 |
| `accounts.json` | メールボックス、ステップ、チェックイン、アカウントごとの両方の検証 exit — git 無視 |
| `models.json` | 実行ごとの新しい `/v1/models` キャプチャ — git 無視 |
| `proxies.txt` | あなたの exit、1 行に 1 つ — git 無視 |
| `out/pinned-<date>.log` | 実行ごとのログ（exit、タイミング、正確なサーバー応答） — git 無視 |
| `src/mint.js` · `src/verify.js` | CLI がディスパッチする 2 つのエンジン |
| `src/connect-9router.js` | `keys.txt` のキーを 9Router 接続として登録 |

## 🔌 9Router に接続

[9Router](https://9router.com) はセルフホスト型の OpenAI 互換ルーターです。CaMeL AI は OpenAI 互換なので、一度登録すればすべてのキーを使えます:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
# or: node src/cli.js 9router
```

`keys.txt` のすべてのキーが `camelhub` プロバイダノードの 1 接続になります（`--api-key <key>` は代わりに単一のキーを登録し、`--model <id>` はデフォルトを上書きします）。その後、9Router 内でモデルを選択してください:

```
camelhub/claude-haiku-4-5
camelhub/deepseek-chat
camelhub/glm-4.5
```

デフォルト: `--base http://localhost:20128`、`--password 123456`、`--prefix camelhub`、`--base-url https://api.camel-hub.com/v1`、デフォルトモデル `claude-haiku-4-5`。コネクタを更新された `keys.txt` に向けてさらにアカウントを追加してください。ノードとそのモデルリストは同じままです。

## 🔌 OmniRoute に接続

[OmniRoute](https://omniroute.online) はセルフホスト型の OpenAI 互換ルーターです。CaMeL AI は OpenAI 互換なので、一度登録すればすべてのキーを使えます:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
# or: node src/cli.js omniroute
```

`keys.txt` のすべてのキーが `camelhub` プロバイダノードの 1 接続になります（`--api-key <key>` は代わりに単一のキーを登録し、`--model <id>` はデフォルトを上書きします）。その後、OmniRoute 内でモデルを選択してください:

```
camelhub/claude-haiku-4-5
camelhub/deepseek-chat
camelhub/glm-4.5
```

デフォルト: `--base http://localhost:20128`、`--password 123456`、`--prefix camelhub`、`--base-url https://api.camel-hub.com/v1`、デフォルトモデル `claude-haiku-4-5`。コネクタを更新された `keys.txt` に向けてさらにアカウントを追加してください。ノードとそのモデルリストは同じままです。

## 🔑 1 つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダ | **CaMeL AI** — [camel-hub.cn](https://camel-hub.cn) |
| 🎁 プロバイダが提供するもの | 469 個の一覧モデル · 登録時に $1.00 クレジット + デイリーチェックイン · すべてのキーを検証済み |
| 🔑 1 つのキーで得られるもの | 自身のアカウントにスコープされた 1 つの API キー: 下記エンドポイントの 469 個のモデル id を、あなたのプランの制限で。クォータは**アカウント**に存在するため、このツールがキーごとに 1 アカウントを作成するのはまさにそのためです |
| 🌐 API の形 | OpenAI 互換: `POST https://api.camel-hub.com/v1/chat/completions` |
| 🔒 あなたのデータ | 接触するのは camel-hub.cn と、あなたが設定した受信箱バックエンドのみ。キーはあなたのマシンに留まります |

## 🐞 問題報告

失敗したステップと実行ログの末尾（`out/pinned-<date>.log`）を添えて issue を開いてください — そこには exit、タイミング、正確なサーバー応答が含まれており、失敗を再現するために必要なすべてが揃っています。キーは決して添付しないでください。**[issue を開く](../../issues)** と PR を歓迎します。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照。

<div align="center">

**[MIT](LICENSE)** © 2026 camelhub-bulk-apikey contributors

</div>