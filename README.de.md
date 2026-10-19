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

**CaMeL-KI-Konten im großen Stil mit automatisch generierten API-Schlüsseln erstellen — OpenAI-kompatible Inferenz (469 Modelle: Claude, Gemini, DeepSeek, GLM, Qwen) + 9Router-Connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-469%20served-412991?style=for-the-badge)](https://camel-hub.cn)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Gratis-Tarif](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-469-of-them) · [🧪 API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 Funktionsweise](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Gratis-Tarif — wie viel du bekommst

**Jedes neue Konto enthält ein echtes, ausgabefähiges Guthaben: 1,00 $ bei der Anmeldung plus einen bezahlten täglichen Check-in — keine Karte, kein Captcha.**

| Posten | Gemessen |
| --- | --- |
| Anmeldebonus | **500.000 Quota = 1,00 $** (`quota_per_unit: 500000`, `usd_exchange_rate: 1`) |
| Täglicher Check-in | **aktiviert**, bezahlt am ersten Tag **0,56 $ – 1,86 $** über drei Konten |
| Guthaben nach Anmeldung + einem Check-in am selben Tag | **1,556 $ · 2,062 $ · 2,856 $** |
| Captcha bei der Anmeldung | **keines** (`turnstile_check: false`) |
| E-Mail, die das Panel akzeptiert | einfache `@gmail.com` (ein gepunktetes Alias wird abgelehnt: `邮箱地址别名限制`); `@qq.com` funktioniert auf der eigenen Mail-Wall des Panels |
| Ratenlimit pro Schlüssel | **keines gemessen** — siehe den Hinweis zum Modellkanal unten |
| Die skalierende Einheit | **ein Konto = ein Schlüssel** → `--count N` bedeutet eigentlich „N kostenlose Konten" |

**Das Guthaben ist echt; nicht jeder Modellkanal ist verfügbar.** Ein *gelistetes* Modell kann trotzdem `404 当前模型暂时不可用` antworten, während sein Kanal ausgefallen ist — gemessen in einem Batch: `ERNIE-Lite-8K` und `claude-3-haiku-20240307` ausgefallen, `claude-haiku-4-5` antwortete Sekunden später mit `200` auf demselben Schlüssel. Deshalb durchläuft das Tool die günstigsten gelisteten IDs, statt der ersten zu vertrauen.

> 💡 Der Gratis-Tarif wird von CaMeL AI festgelegt und kann sich ändern. Prüfe die aktuellen Zahlen auf [camel-hub.cn](https://camel-hub.cn) — und lass das Gate des Tools selbst entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle 469

`GET https://api.camel-hub.com/v1/models` liefert **469 Modell-IDs** für einen erzeugten Schlüssel, zum Beispiel:

```
claude-haiku-4-5 · claude-opus-4-5 · gemini-2.5-flash · deepseek-chat
deepseek-r1-250528 · qwen-flash · glm-4.5 · kimi-k2.5
grok-4 · gpt-3.5-turbo · llama-3.1-405b
```

|Modell|✓|
|---|---|
|`claude-haiku-4-5`|✓|

Ein gelisteter Kanal kann `404 当前模型暂时不可用` antworten, auch wenn dein Schlüssel in Ordnung ist. Daher wird nur die ID abgehakt, von der der Verifier tatsächlich eine Completion erhalten hat; `--model <id>` legt die eine fest, die dich interessiert.

```bash
curl https://api.camel-hub.com/v1/models -H "Authorization: Bearer <one of your keys>"
```

## 🧪 So verwendest du die API

Die Basis-URL ist **`https://api.camel-hub.com/v1`** — OpenAI-kompatibel, also funktioniert alles, was OpenAI spricht (SDKs, Cursor, OpenCode, Kilo Code, …).

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

Das Panel betreibt mehrere API-Hosts; `https://api.camel-hub.com` ist derjenige, gegen den dieser Batch gemessen wurde, und `--base URL` richtet die Tools auf einen anderen (die eigenen Gates des Panels nennen `https://api.camel-hub.cn` als aktuelle Hauptlinie).

## 🛠 Schnellstart

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

Schlüssel werden an `keys.txt` angehängt, einer pro Zeile, sobald ein Schlüssel `GET /v1/models` mit 200 beantwortet hat *und* ein Modellaufruf zurückgekommen ist (eine Completion oder eine Guthaben-Ablehnung — nur ein Fehler hält ihn zurück). Konten laufen nacheinander; `--count 30` ist ein langer Lauf, und `out/pinned-<date>.log` ist das laufende Protokoll dazu. Nichts wird an das Panel gesendet, was nicht über einen Exit aus `proxies.txt` läuft — ein Aufruf ohne verbleibenden Exit löst einen Fehler aus, statt direkt zu wählen.

### 🖱️ Der Launcher

```bash
node src/launcher.js
```

Ein Menü über die Aufgabenmodule: **mint**, **verify**, **9Router**. Es fragt nach `count` (Schlüssel pro Lauf) und `conc` (parallele Exit-Proben), speichert sie in `launcher.config.json` und startet `node src/cli.js <task>` mit den richtigen Flags. `node src/launcher.js --connect-9router` führt die 9Router-Registrierung direkt aus und fragt zuvor nach Basis-URL und Passwort.

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

Gemessen am **2026-10-15**: **4 Konten → 4 Schlüssel, ein Schlüssel pro Konto**. Jeder Schlüssel wurde nach seiner Erstellung über einen vom Mint *unabhängigen* Exit geprüft — und jeder Schlüssel wurde später erneut geprüft, weil das Panel nach Exit *und* nach Konto sperrt.

| Modell | Live (Modelle) | Echter Chat-Aufruf | Gemessen |
| --- | --- | --- | --- |
| `claude-haiku-4-5` | **200** · 469 Modelle | **200** · `claude-haiku-4-5` · `<chat-id>` · erneut geprüft 12:05 · ✔ **live** | 2026-10-15 11:08 |

`GET /v1/models` 200 beweist, dass ein Schlüssel *authentisch* ist; eine Completion 200 mit einem Chat-Completion-Body beweist, dass das dahinterstehende Konto *ausgeben* kann. `verify.js` (und jeder Mint) zeichnet den genauen Status, Body und beobachtenden Exit beider Aufrufe pro Schlüssel in `accounts.json` auf — `verify` enthält das aktuelle Urteil, `verify.atMint` die Messung zum Zeitpunkt der Schlüsselerstellung.

**Exit-Screening ist die Arbeit.** Dieses Panel blockiert nach Quell-IP, sodass ein Exit, der vor einer Minute geantwortet hat, mit `403 IP banned` zu antworten beginnen kann. Die Verifikation filtert gesperrte Exits heraus, bevor ein Schlüssel an ihnen verschwendet wird, zieht später gesperrte aus dem Verkehr und zählt sie — ein Schlüssel, der nicht gemessen werden konnte, wird als `unmeasured` gemeldet, statt als tot zu gelten. Die Kontosperre des Panels selbst (`403 auth.user_banned`) wird genau als solche erfasst, sodass weder ein blockierter Exit noch ein gesperrtes Konto als defekter Schlüssel missverstanden werden kann.

## 🧭 Funktionsweise

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: CaMeL AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.camel-hub.com/v1/chat/completions → real content = the key is live
```

| Schritt | Aufruf | Hinweise |
| --- | --- | --- |
| Gates | die eigene Konfiguration des Panels | `turnstile_check: false`, `email_verification: true` |
| Mailbox | [Emailnator](https://www.emailnator.com) | eine frische Gmail-Adresse pro Konto, gelesen über deine Exits |
| Bestätigungsmail | Versand durch das Panel | der Code wird nur akzeptiert, wenn der Absender der Mail `camelbot@kr777.top` / `CaMeL AI` entspricht |
| Registrierung | Registrierungsroute des Panels | einfaches HTTP, kein Captcha |
| Check-in | tägliche Check-in-Route | zahlt auf das Guthaben ein |
| Schlüssel | Schlüsselroute des Panels | ein Schlüssel pro Konto |
| Nachweis | `GET /v1/models` + eine echte Completion | beides aufgezeichnet, mit dem beobachtenden Exit |

Ein gesperrter Exit wird nie als schlechter Schlüssel gelesen: Das Tool zieht diesen Exit aus dem Verkehr und misst anderswo erneut. Die Mailbox kann mit `--mail imap --imap-user … --imap-pass …` ausgetauscht werden, wenn dir die Adressen gehören (das Panel lehnt Aliase ab, sodass jedes Konto dann seine eigene braucht).

## ⚙️ CLI-Optionen

Der gesamte Code liegt in `src/` — führe ihn vom Repository-Stamm als `node src/<file>.js` aus; die Datendateien (`keys.txt`, `proxies.txt`, `accounts.json`, `out/`) bleiben im Repository-Stamm.

| Tool | Flags |
| --- | --- |
| `src/mint.js` | `--count N` (5) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (oder `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--base URL` · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, max 8) · `--budget` (2400 s) |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | interaktiv: mint / verify / settings — `count` und `conc` bleiben in `launcher.config.json` erhalten |

```bash
node src/cli.js mint --count 30
node src/cli.js verify
node src/cli.js 9router
```

`--count` steuert, wie viele Schlüssel ein Lauf erzeugt; die Zuweisung des Panels erfolgt pro Konto, also sind N Schlüssel N Konten. `--scan` / `--scan-conc` steuern, wie viel deiner Exit-Liste pro gepinntem Exit geprüft wird — erhöhe `--scan` bei einer veralteten Liste, senke es bei einer kleinen.

## 🛰️ Hinter einem Proxy

* Exits stammen aus `proxies.txt` (eine Zeile pro Exit, `scheme://host:port`, `user:pass@` unterstützt, `#`-Kommentare werden ignoriert). Derselbe Pool speist die Panel-Aufrufe, die Schlüsselverifikation und die Mailbox-Lesevorgänge; die Tools wählen nie direkt zum Anbieter.
* **Screening ist die Arbeit.** Jedes Konto pinnt den ersten Exit, der `GET /api/status` gegen den Panel-Host nachweist, und die Verifikation pinnt einen *anderen* nachgewiesenen Exit — ein Exit, der mitten im Lauf ausfällt, zieht sich selbst aus dem Verkehr und das Konto fährt mit dem nächsten fort.
* Ein gesperrter Exit antwortet mit `403 IP banned`; er wird herausgefiltert, bevor ein Schlüssel an ihm verschwendet wird, und aus dem Verkehr gezogen, wenn es später passiert.
* Die Mailbox ([Emailnator](https://www.emailnator.com)) ist ein Temp-Mail-Dienst eines Drittanbieters und nicht das Panel; ihre API wird ebenfalls über deine Exits gelesen.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein live-verifizierter Schlüssel pro Zeile — von Git ignoriert |
| `accounts.json` | Mailbox, Schritte, Check-in, beide Verifikations-Exits pro Konto — von Git ignoriert |
| `models.json` | eine frische `/v1/models`-Erfassung pro Lauf — von Git ignoriert |
| `proxies.txt` | deine Exits, einer pro Zeile — von Git ignoriert |
| `out/pinned-<date>.log` | das Protokoll pro Lauf (Exit, Timing, exakte Serverantwort) — von Git ignoriert |
| `src/mint.js` · `src/verify.js` | die beiden Engines, an die die CLI weiterleitet |
| `src/connect-9router.js` | registriert die Schlüssel in `keys.txt` als 9Router-Verbindungen |

## 🔌 Verbindung mit 9Router

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router. CaMeL AI ist OpenAI-kompatibel, also registriere es einmal und nutze jeden Schlüssel:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
# or: node src/cli.js 9router
```

Jeder Schlüssel in `keys.txt` wird zu einer Verbindung des Provider-Knotens `camelhub` (`--api-key <key>` registriert stattdessen einen einzelnen Schlüssel, `--model <id>` überschreibt den Standard). Wähle dann ein Modell innerhalb von 9Router:

```
camelhub/claude-haiku-4-5
camelhub/deepseek-chat
camelhub/glm-4.5
```

Standardwerte: `--base http://localhost:20128`, `--password 123456`, `--prefix camelhub`, `--base-url https://api.camel-hub.com/v1`, Standardmodell `claude-haiku-4-5`. Richte den Connector auf eine aktualisierte `keys.txt`, um weitere Konten hinzuzufügen; der Knoten und seine Modellliste bleiben gleich.

## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| 🏢 Anbieter | **CaMeL AI** — [camel-hub.cn](https://camel-hub.cn) |
| 🎁 Was der Anbieter gibt | 469 gelistete Modelle · 1,00 $ Guthaben bei der Anmeldung plus ein täglicher Check-in · jeder Schlüssel live-verifiziert |
| 🔑 Was ein Schlüssel dir bringt | einen API-Schlüssel, der auf sein eigenes Konto beschränkt ist: die 469 Modell-IDs am Endpunkt unten, innerhalb der Limits deines Tarifs. Das Kontingent liegt beim **Konto**, und genau deshalb erstellt dieses Tool ein Konto pro Schlüssel |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://api.camel-hub.com/v1/chat/completions` |
| 🔒 Deine Daten | nur camel-hub.cn und das von dir konfigurierte Inbox-Backend werden kontaktiert; Schlüssel bleiben auf deiner Maschine |

## 🐞 Probleme

Eröffne ein Issue mit dem fehlschlagenden Schritt und dem Ende des Laufprotokolls (`out/pinned-<date>.log`) — es enthält den Exit, das Timing und die exakte Serverantwort, also alles, was zur Reproduktion eines Fehlschlags benötigt wird. Hänge niemals einen Schlüssel an. **[Eröffne ein Issue](../../issues)** und PRs sind willkommen.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 camelhub-bulk-apikey contributors

</div>