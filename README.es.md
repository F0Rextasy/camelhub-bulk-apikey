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

**Crea cuentas de CaMeL AI en lote con claves de API autogeneradas — inferencia compatible con OpenAI (469 modelos: Claude, Gemini, DeepSeek, GLM, Qwen) + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-469%20served-412991?style=for-the-badge)](https://camel-hub.cn)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-469-of-them) · [🧪 Usar la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Nivel gratuito — cuánto obtienes

**Cada cuenta nueva incluye un crédito real y utilizable: $1.00 al registrarte más un check-in diario remunerado — sin tarjeta, sin captcha.**

| Elemento | Medido |
| --- | --- |
| Bonificación por registro | **500,000 de cuota = $1.00** (`quota_per_unit: 500000`, `usd_exchange_rate: 1`) |
| Check-in diario | **habilitado**, pagó **$0.56 – $1.86** el primer día en tres cuentas |
| Saldo tras el registro + un check-in el mismo día | **$1.556 · $2.062 · $2.856** |
| Captcha al registrarse | **ninguno** (`turnstile_check: false`) |
| Correo electrónico que acepta el panel | `@gmail.com` simple (un alias con puntos se rechaza: `邮箱地址别名限制`); `@qq.com` funciona en el propio muro de correo del panel |
| Límite de velocidad en una clave | **ninguno medido** — véase la nota sobre canales de modelos más abajo |
| La unidad que escala | **una cuenta = una clave** → `--count N` significa realmente "N cuentas gratuitas" |

**El crédito es real; no todos los canales de modelos están activos.** Un modelo *listado* puede responder `404 当前模型暂时不可用` mientras su canal está caído — medido en un lote: `ERNIE-Lite-8K` y `claude-3-haiku-20240307` caídos, `claude-haiku-4-5` respondiendo `200` en la misma clave segundos después. Por eso la herramienta recorre los ids listados más baratos en lugar de confiar en el primero.

> 💡 El nivel gratuito lo define CaMeL AI y puede cambiar. Consulta las cifras en vivo en [camel-hub.cn](https://camel-hub.cn) — y deja que la propia compuerta de la herramienta decida:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — los 469

`GET https://api.camel-hub.com/v1/models` devuelve **469 ids de modelos** para una clave generada, por ejemplo:

```
claude-haiku-4-5 · claude-opus-4-5 · gemini-2.5-flash · deepseek-chat
deepseek-r1-250528 · qwen-flash · glm-4.5 · kimi-k2.5
grok-4 · gpt-3.5-turbo · llama-3.1-405b
```

|Modelo|✓|
|---|---|
|`claude-haiku-4-5`|✓|

Un canal listado puede responder `404 当前模型暂时不可用` aunque tu clave esté bien, por lo que solo se marca el id del que el verificador obtuvo realmente una respuesta; `--model <id>` fija el que te interesa.

```bash
curl https://api.camel-hub.com/v1/models -H "Authorization: Bearer <one of your keys>"
```

## 🧪 Cómo usar la API

La URL base es **`https://api.camel-hub.com/v1`** — compatible con OpenAI, así que funciona cualquier cosa que hable OpenAI (SDKs, Cursor, OpenCode, Kilo Code, …).

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

El panel ejecuta varios hosts de API; `https://api.camel-hub.com` es contra el que se midió este lote, y `--base URL` apunta las herramientas a otro (las propias compuertas del panel nombran `https://api.camel-hub.cn` como la línea principal actual).

## 🛠 Inicio rápido

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

Las claves se añaden a `keys.txt`, una por línea, una vez que una clave ha respondido `GET /v1/models` 200 *y* ha regresado una llamada a un modelo (una respuesta completa, o un rechazo por crédito — solo un error la retiene). Las cuentas se ejecutan una tras otra; `--count 30` es una ejecución larga, y `out/pinned-<date>.log` es el registro continuo de esta. Nada se envía al panel que no pase por una salida de `proxies.txt` — una llamada sin salida disponible lanza un error en lugar de marcar directamente.

### 🖱️ El lanzador

```bash
node src/launcher.js
```

Un menú sobre los módulos de tareas: **mint**, **verify**, **9Router**. Pide `count` (claves por ejecución) y `conc` (sondeos de salida en paralelo), los guarda en `launcher.config.json` y lanza `node src/cli.js <tarea>` con las marcas adecuadas. `node src/launcher.js --connect-9router` ejecuta el registro en 9Router directamente y pide primero la URL base y la contraseña.

## ✅ Verificado funcionando — cada clave se prueba

Medido el **2026-10-15**: **4 cuentas → 4 claves, una clave por cuenta**. Cada clave se comprobó después de existir, en una salida *independiente* de la de generación — y cada clave se volvió a comprobar más tarde, porque el panel banea por salida *y* por cuenta.

| Modelo | En vivo (modelos) | Llamada de chat real | Medido |
| --- | --- | --- | --- |
| `claude-haiku-4-5` | **200** · 469 modelos | **200** · `claude-haiku-4-5` · `<chat-id>` · recomprobado 12:05 · ✔ **en vivo** | 2026-10-15 11:08 |

`GET /v1/models` 200 demuestra que una clave es *auténtica*; una respuesta completa 200 que lleva un cuerpo de chat-completion demuestra que la cuenta detrás puede *gastar*. `verify.js` (y cada generación) registra el estado exacto, el cuerpo y la salida observadora de ambas llamadas por clave en `accounts.json` — `verify` contiene el veredicto actual, `verify.atMint` la medición tomada cuando se generó la clave.

**El filtrado de salidas es la parte importante.** Este panel bloquea por IP de origen, así que una salida que respondió hace un minuto puede empezar a responder `403 IP banned`. La verificación filtra las salidas baneadas antes de gastar una clave en ellas, retira cualquiera que sea baneada más tarde y las cuenta — una clave que no se pudo medir dice `unmeasured` en lugar de leerse como muerta. El propio baneo de cuentas del panel (`403 auth.user_banned`) se registra como tal, de modo que ni una salida bloqueada ni una cuenta baneada pueden confundirse con una clave rota.

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: CaMeL AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.camel-hub.com/v1/chat/completions → real content = the key is live
```

| Paso | Llamada | Notas |
| --- | --- | --- |
| compuertas | la propia configuración del panel | `turnstile_check: false`, `email_verification: true` |
| buzón | [Emailnator](https://www.emailnator.com) | una dirección gmail nueva por cuenta, leída a través de tus salidas |
| correo de verificación | envío del panel | el código solo se acepta cuando el remitente del correo coincide con `camelbot@kr777.top` / `CaMeL AI` |
| registro | ruta de registro del panel | HTTP simple, sin captcha |
| check-in | ruta de check-in diario | abona al saldo |
| clave | ruta de claves del panel | una clave por cuenta |
| probar | `GET /v1/models` + una respuesta completa real | ambas registradas, con la salida observadora |

Una salida baneada nunca se interpreta como una clave mala: la herramienta retira esa salida y vuelve a medir en otro lugar. El buzón puede cambiarse con `--mail imap --imap-user … --imap-pass …` cuando posees las direcciones (el panel rechaza alias, así que entonces cada cuenta necesita la suya).

## ⚙️ Opciones de la CLI

Todo el código vive en `src/` — ejecútalo desde la raíz del repositorio como `node src/<file>.js`; los archivos de datos (`keys.txt`, `proxies.txt`, `accounts.json`, `out/`) permanecen en la raíz del repositorio.

| Herramienta | Marcas |
| --- | --- |
| `src/mint.js` | `--count N` (5) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (o `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--base URL` · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, max 8) · `--budget` (2400 s) |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | interactivo: mint / verify / settings — `count` y `conc` persisten en `launcher.config.json` |

```bash
node src/cli.js mint --count 30
node src/cli.js verify
node src/cli.js 9router
```

`--count` controla cuántas claves produce una ejecución; la bonificación del panel es por cuenta, así que N claves son N cuentas. `--scan` / `--scan-conc` controlan cuánto de tu lista de salidas se sondea por salida fijada — sube `--scan` en una lista desactualizada, bájalo en una pequeña.

## 🛰️ Detrás de un proxy

* Las salidas provienen de `proxies.txt` (una línea por salida, `scheme://host:port`, se admite `user:pass@`, los comentarios `#` se ignoran). El mismo pool alimenta las llamadas al panel, la verificación de claves y las lecturas del buzón; las herramientas nunca marcan directamente al proveedor.
* **El filtrado es la parte importante.** Cada cuenta fija la primera salida que supera `GET /api/status` contra el host del panel, y la verificación fija una salida *diferente* ya probada — una salida que muere a mitad de ejecución se retira y la cuenta continúa con la siguiente.
* Una salida baneada responde `403 IP banned`; se filtra antes de gastar una clave en ella y se retira cuando ocurre más tarde.
* El buzón ([Emailnator](https://www.emailnator.com)) es un servicio de correo temporal de terceros en lugar del panel; su API también se lee a través de tus salidas.

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `keys.txt` | una clave verificada en vivo por línea — ignorada por git |
| `accounts.json` | buzón, pasos, check-in, ambas salidas de verificación por cuenta — ignorado por git |
| `models.json` | una captura fresca de `/v1/models` por ejecución — ignorada por git |
| `proxies.txt` | tus salidas, una por línea — ignorado por git |
| `out/pinned-<date>.log` | el registro por ejecución (salida, tiempos, respuesta exacta del servidor) — ignorado por git |
| `src/mint.js` · `src/verify.js` | los dos motores a los que despacha la CLI |
| `src/connect-9router.js` | registra las claves de `keys.txt` como conexiones de 9Router |

## 🔌 Conectar con 9Router

[9Router](https://9router.com) es un router autohospedado compatible con OpenAI. CaMeL AI es compatible con OpenAI, así que regístralo una vez y usa todas las claves:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
# or: node src/cli.js 9router
```

Cada clave en `keys.txt` se convierte en una conexión del nodo del proveedor `camelhub` (`--api-key <key>` registra una sola clave en su lugar, `--model <id>` sobrescribe el predeterminado). Luego elige un modelo dentro de 9Router:

```
camelhub/claude-haiku-4-5
camelhub/deepseek-chat
camelhub/glm-4.5
```

Valores predeterminados: `--base http://localhost:20128`, `--password 123456`, `--prefix camelhub`, `--base-url https://api.camel-hub.com/v1`, modelo predeterminado `claude-haiku-4-5`. Apunta el conector a un `keys.txt` actualizado para añadir más cuentas; el nodo y su lista de modelos permanecen iguales.

## 🔑 Qué te da una clave

| | |
| --- | --- |
| 🏢 Proveedor | **CaMeL AI** — [camel-hub.cn](https://camel-hub.cn) |
| 🎁 Qué da el proveedor | 469 modelos listados · $1.00 de crédito al registrarte más un check-in diario · cada clave verificada en vivo |
| 🔑 Qué te da una clave | una clave de API limitada a su propia cuenta: los 469 ids de modelos en el endpoint de abajo, con los límites de tu plan. La cuota vive en la **cuenta**, y por eso precisamente esta herramienta crea una cuenta por clave |
| 🌐 Forma de la API | compatible con OpenAI: `POST https://api.camel-hub.com/v1/chat/completions` |
| 🔒 Tus datos | solo se contacta con camel-hub.cn y el backend de buzón que configures; las claves permanecen en tu máquina |

## 🐞 Problemas

Abre una incidencia con el paso fallido y el final del registro de la ejecución (`out/pinned-<date>.log`) — contiene la salida, los tiempos y la respuesta exacta del servidor, que es todo lo necesario para reproducir un fallo. Nunca adjuntes una clave. **[Abre un issue](../../issues)** y los PRs son bienvenidos.

## 📄 Licencia

MIT © 2026 — véase [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 camelhub-bulk-apikey contributors

</div>