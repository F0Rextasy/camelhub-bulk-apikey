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
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Offre gratuite](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-469-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Comment ça marche](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Offre gratuite — ce que vous obtenez

**Chaque nouveau compte détient un crédit réel et dépensable : 1,00 $ à l'inscription plus un check-in quotidien rémunéré — sans carte, sans captcha.**

| Élément | Mesuré |
| --- | --- |
| Crédit d'inscription | **500 000 quota = 1,00 $** (`quota_per_unit: 500000`, `usd_exchange_rate: 1`) |
| Check-in quotidien | **activé**, rémunéré **0,56 $ – 1,86 $** le premier jour sur trois comptes |
| Solde après inscription + un check-in le même jour | **1,556 $ · 2,062 $ · 2,856 $** |
| Captcha à l'inscription | **aucun** (`turnstile_check: false`) |
| E-mail accepté par le panel | un simple `@gmail.com` (un alias avec point est refusé : `邮箱地址别名限制`) ; `@qq.com` fonctionne sur le mur de messagerie du panel |
| Limite de débit sur une clé | **aucune mesurée** — voir la note sur les canaux de modèles ci-dessous |
| L'unité qui s'échelonne | **un compte = une clé** → `--count N` signifie en réalité « N comptes gratuits » |

**Le crédit est réel ; tous les canaux de modèles ne sont pas opérationnels.** Un modèle *listé* peut quand même répondre `404 当前模型暂时不可用` pendant que son canal est en panne — mesuré sur un lot : `ERNIE-Lite-8K` et `claude-3-haiku-20240307` en panne, `claude-haiku-4-5` répondant `200` sur la même clé quelques secondes plus tard. C'est pourquoi l'outil parcourt les identifiants listés les moins chers au lieu de faire confiance au premier.

> 💡 L'offre gratuite est définie par CaMeL AI et peut changer. Consultez les chiffres en direct sur [camel-hub.cn](https://camel-hub.cn) — et laissez le propre filtre de l'outil décider :

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

| Appel | Statut | Corps |
| --- | --- | --- |
| `claude-haiku-4-5` | **200** | `{"id":"<chat-id>","object":"chat.completion",…}` |
| `ERNIE-Lite-8K` | **404** | `当前模型暂时不可用` (canal en panne) |
| `claude-3-haiku-20240307` | **404** | `当前模型暂时不可用` (canal en panne) |

Les deux 404 provenaient de la même clé qui a répondu 200 pour `claude-haiku-4-5` quelques secondes plus tard, donc un canal en panne est une propriété du modèle, pas de votre clé. `verify` parcourt les identifiants listés les moins chers pour cette raison, et `--model <id>` épingle celui qui vous intéresse.

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

Le panel exploite plusieurs hôtes d'API ; `https://api.camel-hub.com` est celui sur lequel ce lot a été mesuré, et `--base URL` pointe les outils vers un autre (les propres filtres du panel désignent `https://api.camel-hub.cn` comme la ligne principale actuelle).

## 🛠 Démarrage rapide

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

Les clés sont ajoutées à `keys.txt`, une par ligne, une fois qu'une clé a répondu `GET /v1/models` 200 *et* qu'un appel de modèle est revenu (une complétion, ou un refus de crédit — seul une erreur la retient). Les comptes s'exécutent l'un après l'autre ; `--count 30` est une longue exécution, et `out/pinned-<date>.log` en est le journal continu. Le pool de proxys est OPTIONNEL : avec des sorties dans `proxies.txt`, chaque appel au panel passe par l'une d'elles, et sans aucune liste l'exécution se fait en direct (recommandé à grande échelle, jamais obligatoire).

### 🖱️ Le lanceur

```bash
node src/launcher.js
```

Un menu au-dessus des modules de tâches : **mint**, **verify**, **9Router**. Il demande `count` (clés par exécution) et `conc` (sondes de sortie parallèles), les conserve dans `launcher.config.json`, et lance `node src/cli.js <task>` avec les bons drapeaux. `node src/launcher.js --connect-9router` exécute directement l'enregistrement 9Router et demande d'abord l'URL de base et le mot de passe.

## ✅ Vérifié et fonctionnel — chaque clé est testée

Mesuré le **2026-10-15** : **chaque compte a généré sa propre clé, une clé par compte**. Chaque clé a été vérifiée après son existence, sur une sortie *indépendante* de la génération — et chaque clé a été revérifiée plus tard, car le panel bannit par sortie *et* par compte.

| Modèle | En direct (models) | Véritable appel de chat | Mesuré |
| --- | --- | --- | --- |
| `claude-haiku-4-5` | **200** · 469 modèles | **200** · `claude-haiku-4-5` · `<chat-id>` | 2026-10-15 09:57 |
| `claude-haiku-4-5` | **200** · 469 modèles | **200** · `claude-haiku-4-5` · `<chat-id>` | 2026-10-15 09:55 |
| `claude-haiku-4-5` | **200** · 469 modèles | **200** · `claude-haiku-4-5` · `<chat-id>` | 2026-10-15 09:56 |
| `claude-haiku-4-5` | **200** · 469 modèles | **200** · `claude-haiku-4-5` · `<chat-id>` · revérifié 12:05 · ✔ **en direct** | 2026-10-15 11:08 |

`GET /v1/models` 200 prouve qu'une clé est *authentique* ; une complétion 200 portant un corps de chat-completion prouve que le compte derrière peut *dépenser*. `verify.js` (et chaque génération) enregistre le statut exact, le corps et la sortie d'observation des deux appels par clé dans `accounts.json` — `verify` contient le verdict actuel, `verify.atMint` la mesure prise au moment de la génération de la clé.

**Le filtrage des sorties, c'est le travail.** Ce panel bloque par IP source, donc une sortie qui répondait il y a une minute peut commencer à répondre `403 IP banned`. La vérification filtre les sorties bannies avant de dépenser une clé dessus, retire celles qui sont bannies plus tard, et les compte — une clé qui n'a pas pu être mesurée indique `unmeasured` au lieu d'être lue comme morte. Le propre bannissement de compte du panel (`403 auth.user_banned`) est enregistré comme tel, afin qu'une sortie bloquée ou un compte banni ne puisse pas être confondu avec une clé cassée.

> **Filtres de qualité.** Chaque clé ici a passé un `chat-200` en direct avant d'être écrite dans `keys.txt`
> (les clés mortes ne sont jamais livrées). Les combinaisons du routeur suivent la même règle au niveau du modèle : une entrée est
> ajoutée **uniquement si le modèle répond `chat-200` et peut appeler des outils** — un modèle sans support des outils,
> une clé morte ou un fournisseur mort est écarté au lieu d'être ajouté. Relancez l'étape de vérification à tout moment ;
> les échecs sont signalés, jamais cachés.

## 🧭 Comment ça marche

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
| filtres | la propre config du panel | `turnstile_check: false`, `email_verification: true` |
| boîte mail | [Emailnator](https://www.emailnator.com) | une nouvelle adresse gmail par compte, lue via vos sorties |
| mail de vérification | envoi du panel | le code n'est accepté que lorsque l'expéditeur du mail correspond à `noreply@<panel-mail>` / `CaMeL AI` |
| inscription | route d'inscription du panel | HTTP simple, sans captcha |
| check-in | route de check-in quotidien | verse sur le solde |
| clé | route de clé du panel | une clé par compte |
| preuve | `GET /v1/models` + une vraie complétion | les deux enregistrés, avec la sortie d'observation |

Une sortie bannie n'est jamais lue comme une mauvaise clé : l'outil retire cette sortie et remesure ailleurs. La boîte mail peut être remplacée par `--mail imap --imap-user … --imap-pass …` lorsque vous possédez les adresses (le panel refuse les alias, donc chaque compte a alors besoin de la sienne).

## ⚙️ Options CLI

Tout le code vit dans `src/` — exécutez-le depuis la racine du dépôt avec `node src/<file>.js` ; les fichiers de données (`keys.txt`, `proxies.txt`, `accounts.json`, `out/`) restent à la racine du dépôt.

| Outil | Drapeaux |
| --- | --- |
| `src/mint.js` | `--count N` (5) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (ou `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--base URL` · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, max 8) · `--budget` (2400 s) |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | interactif : mint / verify / settings — `count` et `conc` persistent dans `launcher.config.json` |

```bash
node src/cli.js mint --count 30
node src/cli.js verify
node src/cli.js 9router
```

`--count` contrôle combien de clés une exécution produit ; le crédit du panel est par compte, donc N clés correspondent à N comptes. `--scan` / `--scan-conc` contrôlent la part de votre liste de sorties sondée par sortie épinglée — augmentez `--scan` sur une liste obsolète, diminuez-le sur une petite liste.

## 🛰️ Derrière un proxy

* Les sorties proviennent de `proxies.txt` (une ligne par sortie, `scheme://host:port`, `user:pass@` pris en charge, commentaires `#` ignorés). Le même pool alimente les appels au panel, la vérification des clés et les lectures de la boîte mail.
* **Optionnel — recommandé à grande échelle (limites par IP, bannissements).** L'outil fonctionne aussi sans proxy : sans liste de sorties (ou avec une liste vide), le CLI affiche `running WITHOUT a proxy (direct)` et chaque requête part de votre propre ligne — inscription, génération de clés et vérification sont inchangées.
* **Le filtrage, c'est le travail.** Chaque compte épingle la première sortie qui prouve `GET /api/status` contre l'hôte du panel (sans pool, la « sortie » épinglée est la route directe), et la vérification épingle une sortie prouvée *différente* — une sortie qui meurt en cours d'exécution se retire elle-même et le compte continue sur la suivante.
* Une sortie bannie répond `403 IP banned` ; elle est filtrée avant qu'une clé ne soit dépensée dessus et retirée lorsqu'elle survient plus tard.
* La boîte mail ([Emailnator](https://www.emailnator.com)) est un service de temp-mail tiers plutôt que le panel ; son API est également lue via vos sorties.

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé vérifiée en direct par ligne — ignoré par git |
| `accounts.json` | boîte mail, étapes, check-in, les deux sorties de vérification par compte — ignoré par git |
| `models.json` | une capture fraîche de `/v1/models` par exécution — ignoré par git |
| `proxies.txt` | vos sorties, une par ligne — ignoré par git |
| `out/pinned-<date>.log` | le journal par exécution (sortie, timing, réponse exacte du serveur) — ignoré par git |
| `src/mint.js` · `src/verify.js` | les deux moteurs vers lesquels le CLI dispatche |
| `src/connect-9router.js` | enregistre les clés de `keys.txt` comme connexions 9Router |

## 🔌 Se connecter à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé compatible OpenAI. CaMeL AI est compatible OpenAI, donc enregistrez-le une fois et utilisez chaque clé :

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
# or: node src/cli.js 9router
```

Chaque clé de `keys.txt` devient une connexion du nœud fournisseur `camelhub` (`--api-key <key>` enregistre une seule clé à la place, `--model <id>` remplace la valeur par défaut). Choisissez ensuite un modèle dans 9Router :

```
camelhub/claude-haiku-4-5
camelhub/deepseek-chat
camelhub/glm-4.5
```

Valeurs par défaut : `--base http://localhost:20128`, `--password 123456`, `--prefix camelhub`, `--base-url https://api.camel-hub.com/v1`, modèle par défaut `claude-haiku-4-5`. Pointez le connecteur vers un `keys.txt` actualisé pour ajouter d'autres comptes ; le nœud et sa liste de modèles restent les mêmes.

## 🔌 Se connecter à OmniRoute

[OmniRoute](https://omniroute.online) est un routeur auto-hébergé compatible OpenAI. CaMeL AI est compatible OpenAI, donc enregistrez-le une fois et utilisez chaque clé :

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
# or: node src/cli.js omniroute
```

Chaque clé de `keys.txt` devient une connexion du nœud fournisseur `camelhub` (`--api-key <key>` enregistre une seule clé à la place, `--model <id>` remplace la valeur par défaut). Choisissez ensuite un modèle dans OmniRoute :

```
camelhub/claude-haiku-4-5
camelhub/deepseek-chat
camelhub/glm-4.5
```

Valeurs par défaut : `--base http://localhost:20128`, `--password 123456`, `--prefix camelhub`, `--base-url https://api.camel-hub.com/v1`, modèle par défaut `claude-haiku-4-5`. Pointez le connecteur vers un `keys.txt` actualisé pour ajouter d'autres comptes ; le nœud et sa liste de modèles restent les mêmes.

## 🔑 Ce qu'une clé vous apporte

| | |
| --- | --- |
| 🏢 Fournisseur | **CaMeL AI** — [camel-hub.cn](https://camel-hub.cn) |
| 🎁 Ce que le fournisseur offre | 469 modèles listés · 1,00 $ de crédit à l'inscription plus un check-in quotidien · chaque clé vérifiée |
| 🔑 Ce qu'une clé vous apporte | une clé API limitée à son propre compte : les 469 identifiants de modèles sur l'endpoint ci-dessous, selon les limites de votre offre. Le quota vit sur le **compte**, ce qui explique précisément pourquoi cet outil crée un compte par clé |
| 🌐 Forme de l'API | compatible OpenAI : `POST https://api.camel-hub.com/v1/chat/completions` |
| 🔒 Vos données | seuls camel-hub.cn et le backend de boîte mail que vous configurez sont contactés ; les clés restent sur votre machine |

## 🐞 Problèmes

Ouvrez un ticket avec l'étape en échec et la fin du journal d'exécution (`out/pinned-<date>.log`) — il contient la sortie, le timing et la réponse exacte du serveur, soit tout ce qu'il faut pour reproduire un échec. Ne joignez jamais de clé. **[Ouvrir un ticket](../../issues)** et les PR sont les bienvenues.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 camelhub-bulk-apikey contributors

</div>