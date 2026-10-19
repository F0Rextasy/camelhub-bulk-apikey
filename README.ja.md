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

**自動生成された API キーで CaMeL AI アカウントを一括作成 — OpenAI 互換の推論（469 モデル: Claude、Gemini、DeepSeek、GLM、Qwen）＋ 9Router コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-469%20served-412991?style=for-the-badge)](https://camel-hub.cn)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-9router-への接続)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-クイックスタート) · [🎁 無料枠](#-無料枠--もらえる量) · [🤖 モデル](#-モデル--全-469-モデル) · [🧪 API の使い方](#-api-の使い方) · [✅ 検証済み](#-動作検証済み--すべてのキーをテスト済み) · [🧭 仕組み](#-仕組み) · [🔌 9Router](#-9router-への接続) · [⚙️ オプション](#️-cli-オプション) · [🛰️ プロキシ](#️-プロキシ経由) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 無料枠 — もらえる量

**新しいアカウントにはすべて、実際に使えるクレジットが付きます。登録時に $1.00、さらに毎日のチェックインでも支給されます — カード不要、キャプチャ不要。**

| 項目 | 実測値 |
| --- | --- |
| 登録時の付与 | **500,000 クォータ = $1.00**（`quota_per_unit: 500000`、`usd_exchange_rate: 1`） |
| 毎日のチェックイン | **有効**、3 アカウントの初日に **$0.56 – $1.86** を支給 |
| 登録＋同日チェックイン 1 回後の残高 | **$1.556 · $2.062 · $2.856** |
| 登録時のキャプチャ | **なし**（`turnstile_check: false`） |
| パネルが受け付けるメール | 素の `@gmail.com`（ドット付きエイリアスは拒否: `邮箱地址别名限制`）。`@qq.com` はパネル自身のメールウォールで動作 |
| キーあたりのレート制限 | **実測なし** — 下記のモデルチャネルに関する注記を参照 |
| スケールする単位 | **1 アカウント = 1 キー** → `--count N` は実質「N 個の無料アカウント」 |

**クレジットは本物です。ただし、すべてのモデルチャネルが稼働しているわけではありません。** *一覧に載っている*モデルでも、そのチャネルがダウンしていれば `404 当前模型暂时不可用` を返すことがあります — あるバッチでの実測: `ERNIE-Lite-8K` と `claude-3-haiku-20240307` はダウン、同じキーで数秒後に `claude-haiku-4-5` は `200` を返しました。だからこそ、このツールは最初の 1 つを信じるのではなく、一覧にある最も安価な id を順に試します。

> 💡 無料枠は CaMeL AI によって設定されており、変更される可能性があります。最新の数値は [camel-hub.cn](https://camel-hub.cn) で確認してください — そして最終判断はツール自身のゲートに任せましょう:

```bash
node src/cli.js --verify-only     # keys.txt 内のすべてのキーを実際のチャット呼び出しで再テスト
```

## 🤖 モデル — 全 469 モデル

`GET https://api.camel-hub.com/v1/models` は、発行されたキーに対して **469 個のモデル id** を返します。例:

```
claude-haiku-4-5 · claude-opus-4-5 · gemini-2.5-flash · deepseek-chat
deepseek-r1-250528 · qwen-flash · glm-4.5 · kimi-k2.5
grok-4 · gpt-3.5-turbo · llama-3.1-405b
```

|モデル|✓|
|---|---|
|`claude-haiku-4-5`|✓|

キーが正常でも、一覧に載っているチャネルが `404 当前模型暂时不可用` を返すことがあるため、検証ツールが実際に補完を取得できた id のみにチェックが付きます。`--model <id>` で気になる 1 つを固定できます。

```bash
curl https://api.camel-hub.com/v1/models -H "Authorization: Bearer <one of your keys>"
```

## 🧪 API の使い方

ベース URL は **`https://api.camel-hub.com/v1`** です — OpenAI 互換なので、OpenAI を扱えるものなら何でも動作します（SDK、Cursor、OpenCode、Kilo Code など）。

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

パネルは複数の API ホストを運用しています。`https://api.camel-hub.com` はこのバッチの実測に使われたホストで、`--base URL` でツールを別のホストに向けられます（パネル自身のゲートは `https://api.camel-hub.cn` が現在のメインラインであると示しています）。

## 🛠 クイックスタート

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

キーが `GET /v1/models` に 200 を返し、*かつ*モデル呼び出しが戻ってきた場合（補完、またはクレジット拒否 — エラーの場合のみ拒否）に限り、キーは 1 行ずつ `keys.txt` に追記されます。アカウントは 1 つずつ順に実行されます。`--count 30` は長時間の実行になり、`out/pinned-<date>.log` がその実行記録です。`proxies.txt` の出口を経由しないものはパネルに一切送信されません — 出口が残っていない状態での呼び出しは、直接ダイヤルするのではなく例外を発生させます。

### 🖱️ ランチャー

```bash
node src/launcher.js
```

タスクモジュール（**mint**、**verify**、**9Router**）のメニューです。`count`（1 回あたりのキー数）と `conc`（並列出口プローブ数）を尋ね、それらを `launcher.config.json` に保存し、適切なフラグを付けて `node src/cli.js <task>` を起動します。`node src/launcher.js --connect-9router` は 9Router の登録を直接実行し、最初にベース URL とパスワードを尋ねます。

## ✅ 動作検証済み — すべてのキーをテスト済み

実測日 **2026-10-15**: **4 アカウント → 4 キー、1 アカウントあたり 1 キー**。各キーは作成後に、ミントとは*独立*の出口で検証され、さらにパネルは出口*と*アカウントの両方で BAN するため、すべてのキーが後で再検証されました。

| モデル | ライブ（モデル） | 実際のチャット呼び出し | 実測日時 |
| --- | --- | --- | --- |
| `claude-haiku-4-5` | **200** · 469 モデル | **200** · `claude-haiku-4-5` · `<chat-id>` · 12:05 に再検証 · ✔ **ライブ** | 2026-10-15 11:08 |

`GET /v1/models` の 200 はキーが*本物*であることを証明し、チャット補完の本文を伴う補完 200 は、その背後のアカウントが*消費*できることを証明します。`verify.js`（およびすべてのミント）は、キーごとに両方の呼び出しの正確なステータス、本文、観測した出口を `accounts.json` に記録します — `verify` には現在の判定が、`verify.atMint` にはキー作成時に取得した測定値が保持されます。

**出口のスクリーニングが要となります。** このパネルは送信元 IP でブロックするため、1 分前に応答していた出口が `403 IP banned` を返し始めることがあります。検証では、BAN された出口をキーの消費に使う前に除外し、後から BAN された出口を退役させ、その数を計上します — 測定できなかったキーは「死んでいる」ではなく `unmeasured` と表示されます。パネル自体のアカウント BAN（`403 auth.user_banned`）はまさにそのとおりに記録されるため、ブロックされた出口も BAN されたアカウントも、壊れたキーと誤認されることはありません。

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
| メールボックス | [Emailnator](https://www.emailnator.com) | アカウントごとに新しい gmail アドレスを、あなたの出口経由で読み取り |
| 認証メール | パネル送信 | コードは、メールの送信元が `camelbot@kr777.top` / `CaMeL AI` と一致する場合にのみ受け付けられます |
| 登録 | パネルの登録ルート | 素の HTTP、キャプチャなし |
| チェックイン | 毎日のチェックインルート | 残高に支給 |
| キー | パネルのキールート | アカウントあたり 1 キー |
| 証明 | `GET /v1/models` ＋ 実際の補完 | 両方を記録、観測した出口も併記 |

BAN された出口は決して不良キーとして扱われません。ツールはその出口を退役させ、別の場所で再測定します。アドレスを自身で所有している場合は、メールボックスを `--mail imap --imap-user … --imap-pass …` で切り替えられます（パネルはエイリアスを拒否するため、各アカウントに個別のアドレスが必要です）。

## ⚙️ CLI オプション

すべてのコードは `src/` にあります — リポジトリのルートから `node src/<file>.js` として実行してください。データファイル（`keys.txt`、`proxies.txt`、`accounts.json`、`out/`）はリポジトリのルートに置かれます。

| ツール | フラグ |
| --- | --- |
| `src/mint.js` | `--count N`（5）· `--pool FILE`（`proxies.txt`）· `--mail emailnator\|imap` · `--imap-user` / `--imap-pass`（または `IMAP_USER` / `IMAP_PASS`）· `--mail-address` · `--base URL` · `--model ID` · `--poll-ms`（2000）· `--code-wait`（300000）· `--max-cycle`（3）· `--scan`（200）· `--scan-conc`（8、最大 8）· `--budget`（2400 秒） |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens`（8）· `--want`（3）· `--pool FILE` · `--base URL` |
| `src/launcher.js` | 対話式: mint / verify / settings — `count` と `conc` は `launcher.config.json` に保存されます |

```bash
node src/cli.js mint --count 30
node src/cli.js verify
node src/cli.js 9router
```

`--count` は 1 回の実行で生成するキー数を制御します。パネルの付与はアカウント単位なので、N キーは N アカウントです。`--scan` / `--scan-conc` は、固定した出口ごとに出口リストのどれだけをプローブするかを制御します — 古いリストでは `--scan` を上げ、小さいリストでは下げてください。

## 🛰️ プロキシ経由

* 出口は `proxies.txt` から取得されます（1 行に 1 出口、`scheme://host:port`, `user:pass@` 対応、`#` コメントは無視）。同じプールがパネル呼び出し、キー検証、メールボックス読み取りに使われ、ツールがプロバイダへ直接ダイヤルすることは決してありません。
* **スクリーニングが要となります。** 各アカウントは、パネルホストに対して `GET /api/status` を証明した最初の出口を固定し、検証では*別の*証明済み出口を固定します — 実行中に落ちた出口は自身を退役させ、アカウントは次の出口で続行します。
* BAN された出口は `403 IP banned` を返します。キーの消費前に除外され、後から発生した場合は退役されます。
* メールボックス（[Emailnator](https://www.emailnator.com)）はパネルではなくサードパーティの一時メールサービスで、その API もあなたの出口経由で読み取られます。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 1 行に 1 つのライブ検証済みキー — git 管理外 |
| `accounts.json` | アカウントごとのメールボックス、ステップ、チェックイン、2 つの検証出口 — git 管理外 |
| `models.json` | 実行ごとの新しい `/v1/models` キャプチャ — git 管理外 |
| `proxies.txt` | あなたの出口、1 行に 1 つ — git 管理外 |
| `out/pinned-<date>.log` | 実行ごとのログ（出口、タイミング、正確なサーバー応答） — git 管理外 |
| `src/mint.js` · `src/verify.js` | CLI がディスパッチする 2 つのエンジン |
| `src/connect-9router.js` | `keys.txt` のキーを 9Router 接続として登録 |

## 🔌 9Router への接続

[9Router](https://9router.com) はセルフホスト型の OpenAI 互換ルーターです。CaMeL AI は OpenAI 互換なので、1 回登録すればすべてのキーを使えます:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
# or: node src/cli.js 9router
```

`keys.txt` 内のすべてのキーが、`camelhub` プロバイダノードの 1 接続になります（`--api-key <key>` では単一のキーのみを登録、`--model <id>` はデフォルトを上書きします）。その後、9Router 内でモデルを選んでください:

```
camelhub/claude-haiku-4-5
camelhub/deepseek-chat
camelhub/glm-4.5
```

デフォルト: `--base http://localhost:20128`、`--password 123456`、`--prefix camelhub`、`--base-url https://api.camel-hub.com/v1`、デフォルトモデル `claude-haiku-4-5`。コネクタを更新後の `keys.txt` に向ければアカウントを追加できます。ノードとそのモデルリストは変わりません。

## 🔑 1 つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダ | **CaMeL AI** — [camel-hub.cn](https://camel-hub.cn) |
| 🎁 プロバイダが提供するもの | 一覧の 469 モデル · 登録時に $1.00 クレジット＋毎日のチェックイン · すべてのキーをライブ検証 |
| 🔑 1 つのキーで得られるもの | 自身のアカウントにスコープされた 1 つの API キー: 下記エンドポイントの 469 モデル id を、プランの制限内で利用。クォータは**アカウント**に紐づき、まさにそれがこのツールがキーごとに 1 アカウントを作成する理由です |
| 🌐 API 形式 | OpenAI 互換: `POST https://api.camel-hub.com/v1/chat/completions` |
| 🔒 あなたのデータ | 接続されるのは camel-hub.cn と、設定した受信箱バックエンドのみ。キーはあなたのマシンに留まります |

## 🐞 Issues

失敗したステップと実行ログの末尾（`out/pinned-<date>.log`）を添えて issue を開いてください — 出口、タイミング、正確なサーバー応答が含まれており、不具合を再現するのに必要なすべてが揃っています。キーは決して添付しないでください。**[issue を開く](../../issues)** — PR も歓迎します。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照。

<div align="center">

**[MIT](LICENSE)** © 2026 camelhub-bulk-apikey contributors

</div>