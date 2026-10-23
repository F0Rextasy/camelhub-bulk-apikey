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

**Массовое создание аккаунтов CaMeL AI с автоматически сгенерированными API-ключами — инференс, совместимый с OpenAI (469 моделей: Claude, Gemini, DeepSeek, GLM, Qwen) + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-469%20served-412991?style=for-the-badge)](https://camel-hub.cn)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-469-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Бесплатный тариф — сколько вы получаете

**Каждый новый аккаунт получает реальный, расходуемый кредит: $1.00 при регистрации плюс платный ежедневный чек-ин — без карты, без капчи.**

| Пункт | Измерено |
| --- | --- |
| Бонус при регистрации | **500,000 квоты = $1.00** (`quota_per_unit: 500000`, `usd_exchange_rate: 1`) |
| Ежедневный чек-ин | **включён**, выплачено **$0.56 – $1.86** в первый день по трём аккаунтам |
| Баланс после регистрации + одного чек-ина в тот же день | **$1.556 · $2.062 · $2.856** |
| Капча при регистрации | **отсутствует** (`turnstile_check: false`) |
| E-mail, который принимает панель | обычный `@gmail.com` (адрес с точкой отклоняется: `邮箱地址别名限制`); `@qq.com` работает на собственной почтовой стене панели |
| Ограничение скорости на ключ | **не обнаружено** — см. примечание о каналах моделей ниже |
| Единица масштабирования | **один аккаунт = один ключ** → `--count N` на самом деле означает «N бесплатных аккаунтов» |

**Кредит реальный; но не все каналы моделей работают.** *Указанная* в списке модель всё ещё может отвечать `404 当前模型暂时不可用`, пока её канал недоступен — измерено на одной партии: `ERNIE-Lite-8K` и `claude-3-haiku-20240307` недоступны, `claude-haiku-4-5` отвечает `200` на том же ключе секундами позже. Именно поэтому инструмент перебирает самые дешёвые из перечисленных id, а не доверяет первому.

> 💡 Бесплатный тариф устанавливается CaMeL AI и может измениться. Проверяйте актуальные цифры на [camel-hub.cn](https://camel-hub.cn) — и пусть собственный контроль инструмента решает:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Модели — все 469

`GET https://api.camel-hub.com/v1/models` возвращает **469 id моделей** для созданного ключа, например:

```
claude-haiku-4-5 · claude-opus-4-5 · gemini-2.5-flash · deepseek-chat
deepseek-r1-250528 · qwen-flash · glm-4.5 · kimi-k2.5
grok-4 · gpt-3.5-turbo · llama-3.1-405b
```

| Запрос | Статус | Тело |
| --- | --- | --- |
| `claude-haiku-4-5` | **200** | `{"id":"<chat-id>","object":"chat.completion",…}` |
| `ERNIE-Lite-8K` | **404** | `当前模型暂时不可用` (канал недоступен) |
| `claude-3-haiku-20240307` | **404** | `当前模型暂时不可用` (канал недоступен) |

Оба 404 пришли с того же ключа, который ответил 200 для `claude-haiku-4-5` секундами позже, так что недоступный канал — это свойство модели, а не вашего ключа. `verify` перебирает самые дешёвые из перечисленных id именно по этой причине, а `--model <id>` фиксирует ту, которая вам нужна.

```bash
curl https://api.camel-hub.com/v1/models -H "Authorization: Bearer <one of your keys>"
```

## 🧪 Как использовать API

Базовый URL — **`https://api.camel-hub.com/v1`** — совместим с OpenAI, поэтому работает всё, что говорит на OpenAI (SDK, Cursor, OpenCode, Kilo Code, …).

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

Панель использует несколько API-хостов; `https://api.camel-hub.com` — тот, на котором измерялась эта партия, а `--base URL` направляет инструменты на другой (собственные шлюзы панели называют `https://api.camel-hub.cn` текущей основной линией).

## 🛠 Быстрый старт

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

Ключи добавляются в `keys.txt`, по одному в строке, после того как ключ ответил `GET /v1/models` 200 *и* вернулся вызов модели (завершение или отказ по кредиту — только ошибка удерживает ключ). Аккаунты обрабатываются один за другим; `--count 30` — это долгий прогон, и `out/pinned-<date>.log` — его текущий журнал. Пул прокси НЕОБЯЗАТЕЛЕН: с выходами в `proxies.txt` каждый вызов панели идёт через один из них, а без списка вообще прогон идёт напрямую (рекомендуется при масштабе, но никогда не обязателен).

### 🖱️ Лаунчер

```bash
node src/launcher.js
```

Меню над модулями задач: **mint**, **verify**, **9Router**. Он запрашивает `count` (ключей за прогон) и `conc` (параллельных проверок выходов), сохраняет их в `launcher.config.json` и запускает `node src/cli.js <task>` с нужными флагами. `node src/launcher.js --connect-9router` запускает регистрацию 9Router напрямую и сначала запрашивает базовый URL и пароль.

## ✅ Проверено в работе — каждый ключ протестирован

Измерено **2026-10-15**: **каждый аккаунт создал свой собственный ключ, один ключ на аккаунт**. Каждый ключ был проверен после его создания, через выход, *независимый* от создания — и каждый ключ был перепроверен позже, потому что панель банит по выходу *и* по аккаунту.

| Модель | Живой (models) | Реальный вызов чата | Измерено |
| --- | --- | --- | --- |
| `claude-haiku-4-5` | **200** · 469 моделей | **200** · `claude-haiku-4-5` · `<chat-id>` | 2026-10-15 09:57 |
| `claude-haiku-4-5` | **200** · 469 моделей | **200** · `claude-haiku-4-5` · `<chat-id>` | 2026-10-15 09:55 |
| `claude-haiku-4-5` | **200** · 469 моделей | **200** · `claude-haiku-4-5` · `<chat-id>` | 2026-10-15 09:56 |
| `claude-haiku-4-5` | **200** · 469 моделей | **200** · `claude-haiku-4-5` · `<chat-id>` · перепроверено 12:05 · ✔ **живой** | 2026-10-15 11:08 |

`GET /v1/models` 200 доказывает, что ключ *подлинный*; завершение 200 с телом chat-completion доказывает, что стоящий за ним аккаунт может *тратить*. `verify.js` (и каждое создание) записывает точный статус, тело и наблюдающий выход обоих вызовов для каждого ключа в `accounts.json` — `verify` хранит текущий вердикт, `verify.atMint` — измерение, сделанное при создании ключа.

**Отсеивание выходов — это и есть работа.** Эта панель блокирует по исходному IP, поэтому выход, который отвечал минуту назад, может начать отвечать `403 IP banned`. Верификация отфильтровывает забаненные выходы до того, как потратить на них ключ, выводит из эксплуатации любые, которые забанены позже, и подсчитывает их — ключ, который не удалось измерить, помечается как `unmeasured`, а не читается как мёртвый. Собственный бан аккаунта панелью (`403 auth.user_banned`) записывается именно так, поэтому ни заблокированный выход, ни забаненный аккаунт не могут быть приняты за сломанный ключ.

> **Контроль качества.** Каждый ключ здесь прошёл живой `chat-200` до того, как был записан в `keys.txt`
> (мёртвые ключи никогда не поставляются). Комбинации роутера следуют тому же правилу на уровне модели: запись
> добавляется **только если модель отвечает `chat-200` и умеет вызывать инструменты** — модель без поддержки инструментов,
> мёртвый ключ или мёртвый провайдер отбрасывается, а не добавляется. Перезапускайте шаг проверки в любое время;
> сбои сообщаются, но никогда не скрываются.

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: CaMeL AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.camel-hub.com/v1/chat/completions → real content = the key is live
```

| Шаг | Вызов | Примечания |
| --- | --- | --- |
| шлюзы | собственная конфигурация панели | `turnstile_check: false`, `email_verification: true` |
| почтовый ящик | [Emailnator](https://www.emailnator.com) | свежий gmail-адрес на каждый аккаунт, читается через ваши выходы |
| письмо верификации | отправка панелью | код принимается только когда отправитель письма совпадает с `noreply@<panel-mail>` / `CaMeL AI` |
| регистрация | маршрут регистрации панели | обычный HTTP, без капчи |
| чек-ин | маршрут ежедневного чек-ина | зачисляется на баланс |
| ключ | маршрут ключа панели | один ключ на аккаунт |
| доказательство | `GET /v1/models` + реальное завершение | оба записаны, с наблюдающим выходом |

Забаненный выход никогда не читается как плохой ключ: инструмент выводит этот выход из эксплуатации и переизмеряет в другом месте. Почтовый ящик можно заменить на `--mail imap --imap-user … --imap-pass …`, когда адреса принадлежат вам (панель отклоняет псевдонимы, поэтому каждому аккаунту тогда нужен свой собственный).

## ⚙️ Опции CLI

Весь код находится в `src/` — запускайте его из корня репозитория как `node src/<file>.js`; файлы данных (`keys.txt`, `proxies.txt`, `accounts.json`, `out/`) остаются в корне репозитория.

| Инструмент | Флаги |
| --- | --- |
| `src/mint.js` | `--count N` (5) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (или `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--base URL` · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, макс. 8) · `--budget` (2400 с) |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | интерактивно: mint / verify / settings — `count` и `conc` сохраняются в `launcher.config.json` |

```bash
node src/cli.js mint --count 30
node src/cli.js verify
node src/cli.js 9router
```

`--count` управляет тем, сколько ключей производит один прогон; бонус панели начисляется на аккаунт, поэтому N ключей — это N аккаунтов. `--scan` / `--scan-conc` управляют тем, какая часть вашего списка выходов проверяется на закреплённый выход — увеличивайте `--scan` для устаревшего списка, уменьшайте для небольшого.

## 🛰️ За прокси

* Выходы берутся из `proxies.txt` (одна строка на выход, `scheme://host:port`, поддерживается `user:pass@`, комментарии `#` игнорируются). Тот же пул питает вызовы панели, верификацию ключей и чтение почтового ящика.
* **Необязательно — рекомендуется при масштабе (лимиты на IP, баны).** Инструмент работает и без прокси: без списка выходов (или с пустым) CLI печатает `running WITHOUT a proxy (direct)`, и каждый запрос уходит с вашей собственной линии — регистрация, создание ключей и верификация не меняются.
* **Отсеивание — это и есть работа.** Каждый аккаунт закрепляет первый выход, который подтвердил `GET /api/status` против хоста панели (без пула закреплённый «выход» — это прямой маршрут), а верификация закрепляет *другой* подтверждённый выход — выход, который умирает в середине прогона, выводит себя из эксплуатации, и аккаунт продолжает на следующем.
* Забаненный выход отвечает `403 IP banned`; он отфильтровывается до того, как на него потратят ключ, и выводится из эксплуатации, когда это происходит позже.
* Почтовый ящик ([Emailnator](https://www.emailnator.com)) — это сторонний сервис временной почты, а не панель; его API также читается через ваши выходы.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | один проверенный вживую ключ на строку — игнорируется git |
| `accounts.json` | почтовый ящик, шаги, чек-ин, оба выходы верификации на аккаунт — игнорируется git |
| `models.json` | свежий снимок `/v1/models` за прогон — игнорируется git |
| `proxies.txt` | ваши выходы, по одному на строку — игнорируется git |
| `out/pinned-<date>.log` | журнал за прогон (выход, тайминг, точный ответ сервера) — игнорируется git |
| `src/mint.js` · `src/verify.js` | два движка, к которым обращается CLI |
| `src/connect-9router.js` | регистрирует ключи из `keys.txt` как подключения 9Router |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельно размещаемый роутер, совместимый с OpenAI. CaMeL AI совместим с OpenAI, поэтому зарегистрируйте его один раз и используйте каждый ключ:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
# or: node src/cli.js 9router
```

Каждый ключ в `keys.txt` становится одним подключением узла провайдера `camelhub` (`--api-key <key>` регистрирует один ключ вместо этого, `--model <id>` переопределяет значение по умолчанию). Затем выберите модель внутри 9Router:

```
camelhub/claude-haiku-4-5
camelhub/deepseek-chat
camelhub/glm-4.5
```

Значения по умолчанию: `--base http://localhost:20128`, `--password 123456`, `--prefix camelhub`, `--base-url https://api.camel-hub.com/v1`, модель по умолчанию `claude-haiku-4-5`. Направьте коннектор на обновлённый `keys.txt`, чтобы добавить больше аккаунтов; узел и его список моделей остаются теми же.

## 🔌 Подключение к OmniRoute

[OmniRoute](https://omniroute.online) — это самостоятельно размещаемый роутер, совместимый с OpenAI. CaMeL AI совместим с OpenAI, поэтому зарегистрируйте его один раз и используйте каждый ключ:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
# or: node src/cli.js omniroute
```

Каждый ключ в `keys.txt` становится одним подключением узла провайдера `camelhub` (`--api-key <key>` регистрирует один ключ вместо этого, `--model <id>` переопределяет значение по умолчанию). Затем выберите модель внутри OmniRoute:

```
camelhub/claude-haiku-4-5
camelhub/deepseek-chat
camelhub/glm-4.5
```

Значения по умолчанию: `--base http://localhost:20128`, `--password 123456`, `--prefix camelhub`, `--base-url https://api.camel-hub.com/v1`, модель по умолчанию `claude-haiku-4-5`. Направьте коннектор на обновлённый `keys.txt`, чтобы добавить больше аккаунтов; узел и его список моделей остаются теми же.

## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **CaMeL AI** — [camel-hub.cn](https://camel-hub.cn) |
| 🎁 Что даёт провайдер | 469 перечисленных моделей · кредит $1.00 при регистрации плюс ежедневный чек-ин · каждый ключ проверен |
| 🔑 Что даёт один ключ | один API-ключ, привязанный к своему аккаунту: 469 id моделей на эндпоинте ниже, в пределах лимитов вашего тарифа. Квота живёт на **аккаунте**, именно поэтому этот инструмент создаёт один аккаунт на ключ |
| 🌐 Форма API | Совместим с OpenAI: `POST https://api.camel-hub.com/v1/chat/completions` |
| 🔒 Ваши данные | связывается только camel-hub.cn и настроенный вами бэкенд почтового ящика; ключи остаются на вашей машине |

## 🐞 Проблемы

Откройте issue с указанием сбойного шага и хвоста журнала прогона (`out/pinned-<date>.log`) — он содержит выход, тайминг и точный ответ сервера, то есть всё необходимое для воспроизведения промаха. Никогда не прикрепляйте ключ. **[Открыть issue](../../issues)**, и PR приветствуются.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 camelhub-bulk-apikey contributors

</div>