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
**Otomatik oluşturulan API anahtarlarıyla toplu CaMeL AI hesabı açın — OpenAI uyumlu çıkarım (469 model: Claude, Gemini, DeepSeek, GLM, Qwen) + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-469%20served-412991?style=for-the-badge)](https://camel-hub.cn)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-469-of-them) · [🧪 API'yi kullanma](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Ücretsiz katman — ne kadar alıyorsunuz

**Her yeni hesap gerçek, harcanabilir bir kredi taşır: kayıtta $1.00 artı ücretli günlük giriş — kart yok, captcha yok.**

| Öğe | Ölçülen |
| --- | --- |
| Kayıt hediyesi | **500.000 kota = $1.00** (`quota_per_unit: 500000`, `usd_exchange_rate: 1`) |
| Günlük giriş | **etkin**, ilk gün üç hesapta **$0.56 – $1.86** ödedi |
| Kayıt + aynı gün bir giriş sonrası bakiye | **$1.556 · $2.062 · $2.856** |
| Kayıtta captcha | **yok** (`turnstile_check: false`) |
| Panelin kabul ettiği e-posta | düz `@gmail.com` (noktalı takma ad reddedilir: `邮箱地址别名限制`); `@qq.com` panelin kendi posta duvarında çalışır |
| Bir anahtarda hız sınırı | **ölçülmedi** — aşağıdaki model kanalı notuna bakın |
| Ölçeklenen birim | **bir hesap = bir anahtar** → `--count N` aslında "N ücretsiz hesap" demektir |

**Kredi gerçek; ancak her model kanalı ayakta değil.** *Listelenen* bir model, kanalı kapalıyken yine de `404 当前模型暂时不可用` yanıtı verebilir — bir partide ölçüldü: `ERNIE-Lite-8K` ve `claude-3-haiku-20240307` kapalı, `claude-haiku-4-5` aynı anahtarla saniyeler sonra `200` yanıtı veriyor. Bu yüzden araç, ilkine güvenmek yerine en ucuz listelenen kimlikleri dolaşır.

> 💡 Ücretsiz katman CaMeL AI tarafından belirlenir ve değişebilir. Canlı sayıları [camel-hub.cn](https://camel-hub.cn) adresinden kontrol edin — ve kararı aracın kendi kapısına bırakın:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modeller — 469 tanesinin tamamı

`GET https://api.camel-hub.com/v1/models`, oluşturulmuş bir anahtar için **469 model kimliği** döndürür, örneğin:

```

claude-haiku-4-5 · claude-opus-4-5 · gemini-2.5-flash · deepseek-chat
deepseek-r1-250528 · qwen-flash · glm-4.5 · kimi-k2.5
grok-4 · gpt-3.5-turbo · llama-3.1-405b
```

|Model|✓|
|---|---|
|`claude-haiku-4-5`|✓|

Listelenen bir kanal, anahtarınız sağlam olsa bile `404 当前模型暂时不可用` yanıtı verebilir; bu yüzden yalnızca doğrulayıcının gerçekten bir tamamlama aldığı kimlik işaretlenir; `--model <id>` önemsediğiniz modeli sabitler.

```bash
curl https://api.camel-hub.com/v1/models -H "Authorization: Bearer <one of your keys>"
```

## 🧪 API nasıl kullanılır

Temel URL **`https://api.camel-hub.com/v1`** — OpenAI uyumlu, yani OpenAI konuşan her şey çalışır (SDK'lar, Cursor, OpenCode, Kilo Code, …).

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

Panel birkaç API sunucusu işletir; `https://api.camel-hub.com` bu partinin ölçüldüğü sunucudur ve `--base URL` araçları başka bir sunucuya yönlendirir (panelin kendi kapıları `https://api.camel-hub.cn` adresini güncel ana hat olarak belirtir).

## 🛠 Hızlı başlangıç

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

Anahtarlar, bir anahtar `GET /v1/models` 200 yanıtı verdiğinde *ve* bir model çağrısı geri döndüğünde (bir tamamlama ya da bir kredi reddi — yalnızca bir hata anahtarı alıkoyar) `keys.txt` dosyasına her satırda bir tane olacak şekilde eklenir. Hesaplar birbiri ardına çalışır; `--count 30` uzun bir çalışmadır ve `out/pinned-<date>.log` bunun sürekli kaydıdır. `proxies.txt` içindeki bir çıkıştan geçmeyen hiçbir şey panele gönderilmez — çıkışı kalmayan bir çağrı doğrudan bağlanmak yerine hata verir.

### 🖱️ Başlatıcı

```bash
node src/launcher.js
```

Görev modülleri üzerinde bir menü: **mint**, **verify**, **9Router**. `count` (çalışma başına anahtar) ve `conc` (paralel çıkış yoklamaları) değerlerini sorar, bunları `launcher.config.json` içinde tutar ve `node src/cli.js <task>` komutunu doğru bayraklarla başlatır. `node src/launcher.js --connect-9router` doğrudan 9Router kaydını çalıştırır ve önce temel URL ile parolayı sorar.

## ✅ Çalıştığı doğrulandı — her anahtar test edilir

Ölçüm **2026-10-15**: **4 hesap → 4 anahtar, hesap başına bir anahtar**. Her anahtar var olduktan sonra, oluşturmadan *bağımsız* bir çıkış üzerinden kontrol edildi — ve her anahtar daha sonra yeniden kontrol edildi, çünkü panel hem çıkışa *hem de* hesaba göre yasaklama uygular.

| Model | Canlı (modeller) | Gerçek sohbet çağrısı | Ölçüldü |
| --- | --- | --- | --- |
| `claude-haiku-4-5` | **200** · 469 model | **200** · `claude-haiku-4-5` · `<chat-id>` · 12:05'te yeniden kontrol edildi · ✔ **canlı** | 2026-10-15 11:08 |

`GET /v1/models` 200 yanıtı bir anahtarın *gerçek* olduğunu kanıtlar; sohbet tamamlama gövdesi taşıyan bir tamamlama 200 yanıtı ise arkasındaki hesabın *harcayabildiğini* kanıtlar. `verify.js` (ve her oluşturma) her anahtar için her iki çağrının tam durumunu, gövdesini ve gözlemleyen çıkışını `accounts.json` içine kaydeder — `verify` güncel kararı, `verify.atMint` ise anahtar oluşturulduğunda alınan ölçümü tutar.

**Asıl iş çıkış taramasıdır.** Bu panel kaynak IP'ye göre engeller, yani bir dakika önce yanıt veren bir çıkış `403 IP banned` yanıtı vermeye başlayabilir. Doğrulama, yasaklı çıkışları üzerlerinde bir anahtar harcamadan önce filtreler, sonradan yasaklananları devre dışı bırakır ve sayar — ölçülemeyen bir anahtar ölü olarak okunmak yerine `unmeasured` der. Panelin kendi hesap yasağı (`403 auth.user_banned`) tam olarak bu şekilde kaydedilir, böylece ne engellenmiş bir çıkış ne de yasaklanmış bir hesap bozuk bir anahtarla karıştırılabilir.

## 🧭 Nasıl çalışır

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: CaMeL AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.camel-hub.com/v1/chat/completions → real content = the key is live
```

| Adım | Çağrı | Notlar |
| --- | --- | --- |
| kapılar | panelin kendi yapılandırması | `turnstile_check: false`, `email_verification: true` |
| posta kutusu | [Emailnator](https://www.emailnator.com) | hesap başına taze bir gmail adresi, çıkışlarınız üzerinden okunur |
| doğrulama postası | panel gönderimi | kod yalnızca postanın göndericisi `<panel-mail>` / `CaMeL AI` ile eşleştiğinde kabul edilir |
| kayıt | panel kayıt rotası | düz HTTP, captcha yok |
| giriş | günlük giriş rotası | bakiyeye ödeme yapar |
| anahtar | panel anahtar rotası | hesap başına bir anahtar |
| kanıt | `GET /v1/models` + gerçek bir tamamlama | her ikisi de gözlemleyen çıkışla birlikte kaydedilir |

Yasaklı bir çıkış asla kötü bir anahtar olarak okunmaz: araç o çıkışı devre dışı bırakır ve başka bir yerde yeniden ölçer. Adreslere siz sahipseniz posta kutusu `--mail imap --imap-user … --imap-pass …` ile değiştirilebilir (panel takma adları reddeder, bu yüzden her hesabın kendi adresi olması gerekir).

## ⚙️ CLI seçenekleri

Tüm kod `src/` içinde bulunur — depo kökünden `node src/<file>.js` olarak çalıştırın; veri dosyaları (`keys.txt`, `proxies.txt`, `accounts.json`, `out/`) depo kökünde kalır.

| Araç | Bayraklar |
| --- | --- |
| `src/mint.js` | `--count N` (5) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (veya `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--base URL` · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, en fazla 8) · `--budget` (2400 s) |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | etkileşimli: mint / verify / settings — `count` ve `conc` `launcher.config.json` içinde kalıcıdır |

```bash
node src/cli.js mint --count 30
node src/cli.js verify
node src/cli.js 9router
```

`--count` bir çalışmanın kaç anahtar ürettiğini kontrol eder; panelin hediyesi hesap başına olduğundan N anahtar N hesap demektir. `--scan` / `--scan-conc` çıkış listenizin ne kadarının sabitlenmiş çıkış başına yoklanacağını kontrol eder — eski bir listede `--scan` değerini yükseltin, küçük bir listede düşürün.

## 🛰️ Proxy arkasında

* Çıkışlar `proxies.txt` dosyasından gelir (çıkış başına bir satır, `scheme://host:port`, `user:pass@` desteklenir, `#` yorumları yok sayılır). Aynı havuz panel çağrılarını, anahtar doğrulamasını ve posta kutusu okumalarını besler; araçlar sağlayıcıya asla doğrudan bağlanmaz.
* **Asıl iş taramadır.** Her hesap, panel sunucusuna karşı `GET /api/status` kanıtlayan ilk çıkışı sabitler ve doğrulama *farklı* bir kanıtlanmış çıkışı sabitler — çalışma ortasında ölen bir çıkış kendini devre dışı bırakır ve hesap bir sonrakiyle devam eder.
* Yasaklı bir çıkış `403 IP banned` yanıtı verir; üzerinde bir anahtar harcanmadan önce filtrelenir ve sonradan olduğunda devre dışı bırakılır.
* Posta kutusu ([Emailnator](https://www.emailnator.com)) panel yerine üçüncü taraf bir geçici posta servisidir; API'si de çıkışlarınız üzerinden okunur.

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | satır başına bir canlı doğrulanmış anahtar — git tarafından yok sayılır |
| `accounts.json` | hesap başına posta kutusu, adımlar, giriş, her iki doğrulama çıkışı — git tarafından yok sayılır |
| `models.json` | çalışma başına taze bir `/v1/models` kaydı — git tarafından yok sayılır |
| `proxies.txt` | çıkışlarınız, satır başına bir tane — git tarafından yok sayılır |
| `out/pinned-<date>.log` | çalışma başına günlük (çıkış, zamanlama, sunucunun tam yanıtı) — git tarafından yok sayılır |
| `src/mint.js` · `src/verify.js` | CLI'nin yönlendirdiği iki motor |
| `src/connect-9router.js` | `keys.txt` içindeki anahtarları 9Router bağlantıları olarak kaydeder |

## 🔌 9Router'a bağlanma

[9Router](https://9router.com) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir. CaMeL AI OpenAI uyumlu olduğundan bir kez kaydedin ve tüm anahtarları kullanın:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt

```

## 🔌 OmniRoute'a bağlanma

[OmniRoute](https://omniroute.online) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir. CaMeL AI OpenAI uyumlu olduğundan bir kez kaydedin ve tüm anahtarları kullanın:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456 --keys-file keys.txt

# or: node src/cli.js 9router
```

`keys.txt` içindeki her anahtar `camelhub` sağlayıcı düğümünün bir bağlantısı olur (`--api-key <key>` bunun yerine tek bir anahtar kaydeder, `--model <id>` varsayılanı geçersiz kılar). Ardından 9Router içinde bir model seçin:

```
camelhub/claude-haiku-4-5
camelhub/deepseek-chat
camelhub/glm-4.5
```

Varsayılanlar: `--base http://localhost:20128`, `--password 123456`, `--prefix camelhub`, `--base-url https://api.camel-hub.com/v1`, varsayılan model `claude-haiku-4-5`. Daha fazla hesap eklemek için bağlayıcıyı yenilenmiş bir `keys.txt` dosyasına yönlendirin; düğüm ve model listesi aynı kalır.

## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| 🏢 Sağlayıcı | **CaMeL AI** — [camel-hub.cn](https://camel-hub.cn) |
| 🎁 Sağlayıcının verdikleri | 469 listelenen model · kayıtta $1.00 kredi artı günlük giriş · her anahtar canlı doğrulanmış |
| 🔑 Bir anahtarın size kazandırdıkları | kendi hesabına kapsanmış bir API anahtarı: aşağıdaki uç noktada 469 model kimliği, planınızın sınırlarında. Kota **hesapta** yaşar, bu aracın anahtar başına bir hesap oluşturmasının nedeni tam da budur |
| 🌐 API biçimi | OpenAI uyumlu: `POST https://api.camel-hub.com/v1/chat/completions` |
| 🔒 Verileriniz | yalnızca camel-hub.cn ve yapılandırdığınız posta kutusu arka ucuna bağlanılır; anahtarlar makinenizde kalır |

## 🐞 Sorunlar

Başarısız adımı ve çalışma günlüğünün sonunu (`out/pinned-<date>.log`) içeren bir sorun açın — günlük çıkışı, zamanlamayı ve sunucunun tam yanıtını taşır, ki bu bir hatayı yeniden üretmek için gereken her şeydir. Asla bir anahtar eklemeyin. **[Sorun açın](../../issues)** ve PR'lar memnuniyetle karşılanır.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 camelhub-bulk-apikey contributors

</div>