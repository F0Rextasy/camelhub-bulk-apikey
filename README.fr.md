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

**Créez en masse des comptes CaMeL AI avec des clés API générées automatiquement — inférence compatible OpenAI (469 modèles : Claude, Gemini, DeepSeek, GLM, Qwen) + connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-469%20served-412991?style=for-the-badge)](https://camel-hub.cn)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Offre gratuite](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-469-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Fonctionnement](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Offre gratuite — ce que vous obtenez

**Chaque nouveau compte dispose d'un crédit réel et utilisable : 1,00 $ à l'inscription, plus un bonus de connexion quotidienne rémunéré — sans carte, sans captcha.**

| Élément | Mesuré |
| --- | --- |
| Bonus d'inscription | **500 000 de quota = 1,00 $** (`quota_per_unit: 500000`, `usd_exchange_rate: 1`) |
| Connexion quotidienne | **activée**, a rapporté **0,56 $ – 1,86 $** le premier jour sur trois comptes |
| Solde après inscription + une connexion le même jour | **1,556 $ · 2,062 $ · 2,856 $** |
| Captcha à l'inscription | **aucun** (`turnstile_check: false`) |
| E-mail accepté par le panneau | un simple `@gmail.com` (un alias avec points est refusé : `邮箱地址别名限制`) ; `@qq.com` fonctionne sur le mur de messagerie propre au panneau |
| Limite de débit sur une clé | **aucune mesurée** — voir la note sur les canaux de modèles ci-dessous |
| L'unité qui compte | **un compte = une clé** → `--count N` signifie en réalité « N comptes gratuits » |

**Le crédit est réel ; tous les canaux de modèles ne sont pas opérationnels.** Un modèle *listé* peut tout de même répondre `404 当前模型暂时不可用` lorsque son canal est en panne — mesuré sur un lot : `ERNIE-Lite-8K` et `claude-3-haiku-20240307` en panne, `claude-haiku-4-5` répondant `200` sur la même clé quelques secondes plus tard. C'est pourquoi l'outil parcourt les identifiants listés les moins chers plutôt que de faire confiance au premier.

> 💡 L'offre gratuite est définie par CaMeL AI et peut changer. Vérifiez les chiffres en direct sur [camel-hub.cn](https://camel-hub.cn) — et laissez la vérification de l'outil décider :

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modèles — les 469

`GET https://api.camel-hub.com/v1/models` renvoie **469 identifiants de modèles** pour une clé générée, par exemple :

```
claude-haiku-4-5 · claude-opus-4-5 · gemini-2.5-flash · deepseek-chat
deepseek-r1-250528 · qwen-flash · glm-4.5 · kimi-k2.5
grok-4 · gpt-3.5-turbo · llama-3.1-405b
```

|Modèle|✓|
|---|---|
|`claude-haiku-4-5`|✓|

Un canal listé peut répondre `404 当前模型暂时不可用` même lorsque votre clé est valide, donc seul l'identifiant pour lequel le vérificateur a réellement obtenu une complétion est coché ; `--model <id>` fixe celui qui vous intéresse.

```bash
curl https://api.camel-hub.com/v1/models -H "Authorization: Bearer <one of your keys>"
```

## 🧪 Comment utiliser l'API

L'URL de base est **`https://api.camel-hub.com/v1`** — compatible OpenAI, donc tout ce qui parle OpenAI fonctionne (SDK, Cursor, OpenCode, Kilo Code, …).

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

Le panneau exploite plusieurs hôtes API ; `https://api.camel-hub.com` est celui sur lequel ce lot a été mesuré, et `--base URL` pointe les outils vers un autre (les propres portes du panneau désignent `https://api.camel-hub.cn` comme ligne principale actuelle).

## 🛠 Démarrage rapide

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

Les clés sont ajoutées à `keys.txt`, une par ligne, une fois qu'une clé a répondu `GET /v1/models` 200 *et* qu'un appel de modèle a abouti (une complétion, ou un refus pour crédit insuffisant — seule une erreur retient la clé). Les comptes s'enchaînent ; `--count 30` est une longue exécution, et `out/pinned-<date>.log` en est le journal continu. Rien n'est envoyé au panneau sans passer par une sortie de `proxies.txt` — un appel sans sortie restante lève une erreur au lieu de se connecter directement.

### 🖱️ Le lanceur

```bash
node src/launcher.js
```

Un menu au-dessus des modules de tâches : **mint**, **verify**, **9Router**. Il demande `count` (clés par exécution) et `conc` (sondes de sorties en parallèle), les conserve dans `launcher.config.json`, et lance `node src/cli.js <task>` avec les bons drapeaux. `node src/launcher.js --connect-9router` exécute directement l'enregistrement 9Router et demande d'abord l'URL de base et le mot de passe.

## ✅ Vérifié fonctionnel — chaque clé est testée

Mesuré le **2026-10-15** : **4 comptes → 4 clés, une clé par compte**. Chaque clé a été vérifiée après sa création, via une sortie *indépendante* de la génération — et chaque clé a été revérifiée plus tard, car le panneau bannit par sortie *et* par compte.

| Modèle | Live (models) | Appel de chat réel | Mesuré |
| --- | --- | --- | --- |
| `claude-haiku-4-5` | **200** · 469 modèles | **200** · `claude-haiku-4-5` · `<chat-id>` · revérifié 12:05 · ✔ **live** | 2026-10-15 11:08 |

`GET /v1/models` 200 prouve qu'une clé est *authentique* ; une complétion 200 avec un corps de chat-completion prouve que le compte derrière peut *dépenser*. `verify.js` (et chaque mint) enregistre le statut exact, le corps et la sortie d'observation des deux appels pour chaque clé dans `accounts.json` — `verify` contient le verdict actuel, `verify.atMint` la mesure prise au moment de la génération de la clé.

**Le filtrage des sorties fait le travail.** Ce panneau bloque par IP source, donc une sortie qui répondait il y a une minute peut commencer à répondre `403 IP banned`. La vérification filtre les sorties bannies avant d'y dépenser une clé, retire celles bannies par la suite, et les compte — une clé qui n'a pas pu être mesurée indique `unmeasured` plutôt que d'être lue comme morte. Le bannissement de compte du panneau (`403 auth.user_banned`) est enregistré comme tel, afin qu'une sortie bloquée ou un compte banni ne puisse être confondu avec une clé défaillante.

## 🧭 Fonctionnement

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: CaMeL AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.camel-hub.com/v1/chat/completions → real content = the key is live
```

| Étape | Appel | Notes |
| --- | --- | --- |
| portes | configuration propre au panneau | `turnstile_check: false`, `email_verification: true` |
| boîte mail | [Emailnator](https://www.emailnator.com) | une adresse gmail fraîche par compte, lue via vos sorties |
| e-mail de vérification | envoi du panneau | le code n'est accepté que si l'expéditeur du mail correspond à `camelbot@kr777.top` / `CaMeL AI` |
| inscription | route d'inscription du panneau | HTTP simple, sans captcha |
| connexion | route de connexion quotidienne | crédite le solde |
| clé | route de clé du panneau | une clé par compte |
| preuve | `GET /v1/models` + une vraie complétion | les deux enregistrées, avec la sortie d'observation |

Une sortie bannie n'est jamais lue comme une mauvaise clé : l'outil retire cette sortie et remesure ailleurs. La boîte mail peut être remplacée par `--mail imap --imap-user … --imap-pass …` lorsque vous possédez les adresses (le panneau refuse les alias, chaque compte a donc alors besoin de la sienne).

## ⚙️ Options de la CLI

Tout le code se trouve dans `src/` — exécutez-le depuis la racine du dépôt avec `node src/<file>.js` ; les fichiers de données (`keys.txt`, `proxies.txt`, `accounts.json`, `out/`) restent à la racine du dépôt.

| Outil | Drapeaux |
| --- | --- |
| `src/mint.js` | `--count N` (5) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (ou `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--base URL` · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, max 8) · `--budget` (2400 s) |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | interactif : mint / verify / paramètres — `count` et `conc` sont conservés dans `launcher.config.json` |

```bash
node src/cli.js mint --count 30
node src/cli.js verify
node src/cli.js 9router
```

`--count` contrôle combien de clés une exécution produit ; le bonus du panneau est par compte, donc N clés correspondent à N comptes. `--scan` / `--scan-conc` contrôlent la portion de votre liste de sorties sondée par sortie épinglée — augmentez `--scan` sur une liste périmée, diminuez-la sur une liste courte.

## 🛰️ Derrière un proxy

* Les sorties proviennent de `proxies.txt` (une ligne par sortie, `scheme://host:port`, `user:pass@` pris en charge, commentaires `#` ignorés). Le même pool alimente les appels au panneau, la vérification des clés et la lecture de la boîte mail ; les outils ne contactent jamais le fournisseur en direct.
* **Le filtrage fait le travail.** Chaque compte épingle la première sortie qui valide `GET /api/status` auprès de l'hôte du panneau, et la vérification épingle une sortie validée *différente* — une sortie qui meurt en cours d'exécution se retire et le compte continue sur la suivante.
* Une sortie bannie répond `403 IP banned` ; elle est filtrée avant qu'une clé n'y soit dépensée et retirée lorsqu'elle est bannie plus tard.
* La boîte mail ([Emailnator](https://www.emailnator.com)) est un service de temp-mail tiers plutôt que le panneau ; son API est également lue via vos sorties.

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé vérifiée en direct par ligne — ignoré par git |
| `accounts.json` | boîte mail, étapes, connexion, les deux sorties de vérification par compte — ignoré par git |
| `models.json` | une capture fraîche de `/v1/models` par exécution — ignoré par git |
| `proxies.txt` | vos sorties, une par ligne — ignoré par git |
| `out/pinned-<date>.log` | le journal par exécution (sortie, timing, réponse exacte du serveur) — ignoré par git |
| `src/mint.js` · `src/verify.js` | les deux moteurs vers lesquels la CLI redirige |
| `src/connect-9router.js` | enregistre les clés de `keys.txt` comme connexions 9Router |

## 🔌 Connexion à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé compatible OpenAI. CaMeL AI est compatible OpenAI, inscrivez-le donc une fois et utilisez toutes les clés :

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
# or: node src/cli.js 9router
```

Chaque clé de `keys.txt` devient une connexion du nœud de fournisseur `camelhub` (`--api-key <key>` enregistre une seule clé à la place, `--model <id>` remplace la valeur par défaut). Choisissez ensuite un modèle dans 9Router :

```
camelhub/claude-haiku-4-5
camelhub/deepseek-chat
camelhub/glm-4.5
```

Valeurs par défaut : `--base http://localhost:20128`, `--password 123456`, `--prefix camelhub`, `--base-url https://api.camel-hub.com/v1`, modèle par défaut `claude-haiku-4-5`. Pointez le connecteur sur un `keys.txt` actualisé pour ajouter plus de comptes ; le nœud et sa liste de modèles restent les mêmes.

## 🔑 Ce que vous apporte une clé

| | |
| --- | --- |
| 🏢 Fournisseur | **CaMeL AI** — [camel-hub.cn](https://camel-hub.cn) |
| 🎁 Ce que le fournisseur offre | 469 modèles listés · 1,00 $ de crédit à l'inscription plus une connexion quotidienne · chaque clé vérifiée en direct |
| 🔑 Ce que vous apporte une clé | une clé API liée à son propre compte : les 469 identifiants de modèles sur le point de terminaison ci-dessous, selon les limites de votre offre. Le quota réside sur le **compte**, ce qui explique précisément pourquoi cet outil crée un compte par clé |
| 🌐 Forme de l'API | Compatible OpenAI : `POST https://api.camel-hub.com/v1/chat/completions` |
| 🔒 Vos données | seuls camel-hub.cn et le backend de boîte mail que vous configurez sont contactés ; les clés restent sur votre machine |

## 🐞 Problèmes

Ouvrez un ticket avec l'étape en échec et la fin du journal d'exécution (`out/pinned-<date>.log`) — il contient la sortie, le timing et la réponse exacte du serveur, soit tout le nécessaire pour reproduire un échec. Ne joignez jamais de clé. **[Ouvrir un ticket](../../issues)** et les PR sont les bienvenues.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 camelhub-bulk-apikey contributors

</div>