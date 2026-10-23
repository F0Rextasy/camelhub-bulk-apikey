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

**Crie contas CaMeL AI em massa com chaves de API geradas automaticamente — inferência compatível com OpenAI (469 modelos: Claude, Gemini, DeepSeek, GLM, Qwen) + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-469%20served-412991?style=for-the-badge)](https://camel-hub.cn)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Início rápido](#-quick-start) · [🎁 Nível gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-469-of-them) · [🧪 Use a API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Como funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Opções](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 Nível gratuito — quanto você recebe

**Cada nova conta possui um crédito real e utilizável: $1,00 no cadastro mais um check-in diário pago — sem cartão, sem captcha.**

| Item | Medido |
| --- | --- |
| Concessão de cadastro | **500.000 de cota = $1,00** (`quota_per_unit: 500000`, `usd_exchange_rate: 1`) |
| Check-in diário | **habilitado**, pagou **$0,56 – $1,86** no primeiro dia em três contas |
| Saldo após cadastro + um check-in no mesmo dia | **$1,556 · $2,062 · $2,856** |
| Captcha no cadastro | **nenhum** (`turnstile_check: false`) |
| E-mail que o painel aceita | `@gmail.com` simples (um alias com pontos é recusado: `邮箱地址别名限制`); `@qq.com` funciona no próprio muro de e-mail do painel |
| Limite de taxa em uma chave | **nenhum medido** — veja a nota sobre canal de modelo abaixo |
| A unidade que escala | **uma conta = uma chave** → `--count N` é, na verdade, "N contas gratuitas" |

**O crédito é real; nem todo canal de modelo está no ar.** Um modelo *listado* ainda pode responder `404 当前模型暂时不可用` enquanto seu canal está fora do ar — medido em um lote: `ERNIE-Lite-8K` e `claude-3-haiku-20240307` fora do ar, `claude-haiku-4-5` respondendo `200` na mesma chave segundos depois. É por isso que a ferramenta percorre os ids listados mais baratos em vez de confiar no primeiro.

> 💡 O nível gratuito é definido pela CaMeL AI e pode mudar. Confira os números ao vivo em [camel-hub.cn](https://camel-hub.cn) — e deixe o próprio portão da ferramenta decidir:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — todos os 469

`GET https://api.camel-hub.com/v1/models` retorna **469 ids de modelo** para uma chave emitida, por exemplo:

```
claude-haiku-4-5 · claude-opus-4-5 · gemini-2.5-flash · deepseek-chat
deepseek-r1-250528 · qwen-flash · glm-4.5 · kimi-k2.5
grok-4 · gpt-3.5-turbo · llama-3.1-405b
```

| Chamada | Status | Corpo |
| --- | --- | --- |
| `claude-haiku-4-5` | **200** | `{"id":"<chat-id>","object":"chat.completion",…}` |
| `ERNIE-Lite-8K` | **404** | `当前模型暂时不可用` (canal fora do ar) |
| `claude-3-haiku-20240307` | **404** | `当前模型暂时不可用` (canal fora do ar) |

Ambos os 404 vieram da mesma chave que respondeu 200 para `claude-haiku-4-5` segundos depois, então um canal fora do ar é uma propriedade do modelo, não da sua chave. `verify` percorre os ids listados mais baratos por esse motivo, e `--model <id>` fixa o que você quer.

```bash
curl https://api.camel-hub.com/v1/models -H "Authorization: Bearer <one of your keys>"
```

## 🧪 Como usar a API

A URL base é **`https://api.camel-hub.com/v1`** — compatível com OpenAI, então qualquer coisa que fale OpenAI funciona (SDKs, Cursor, OpenCode, Kilo Code, …).

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

O painel opera vários hosts de API; `https://api.camel-hub.com` é aquele contra o qual este lote foi medido, e `--base URL` aponta as ferramentas para outro (os próprios portões do painel indicam `https://api.camel-hub.cn` como a linha principal atual).

## 🛠 Início rápido

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

As chaves são anexadas a `keys.txt`, uma por linha, depois que uma chave respondeu `GET /v1/models` 200 *e* uma chamada de modelo retornou (uma conclusão, ou uma recusa de crédito — apenas um erro retém a chave). As contas rodam uma após a outra; `--count 30` é uma execução longa, e `out/pinned-<date>.log` é o registro contínuo dela. O pool de proxies é OPCIONAL: com saídas em `proxies.txt` cada chamada ao painel usa uma delas, e sem nenhuma lista a execução sai direto (recomendado em escala, nunca obrigatório).

### 🖱️ O launcher

```bash
node src/launcher.js
```

Um menu sobre os módulos de tarefas: **mint**, **verify**, **9Router**. Ele pergunta `count` (chaves por execução) e `conc` (sondagens de saída em paralelo), mantém-nos em `launcher.config.json` e executa `node src/cli.js <task>` com os flags corretos. `node src/launcher.js --connect-9router` executa o registro no 9Router diretamente e pergunta primeiro a URL base e a senha.

## ✅ Verificado e funcionando — toda chave é testada

Medido em **2026-10-15**: **cada conta emitiu sua própria chave, uma chave por conta**. Cada chave foi verificada depois de existir, em uma saída *independente* da emissão — e cada chave foi reverificada depois, porque o painel bane por saída *e* por conta.

| Modelo | Ao vivo (models) | Chamada de chat real | Medido |
| --- | --- | --- | --- |
| `claude-haiku-4-5` | **200** · 469 modelos | **200** · `claude-haiku-4-5` · `<chat-id>` | 2026-10-15 09:57 |
| `claude-haiku-4-5` | **200** · 469 modelos | **200** · `claude-haiku-4-5` · `<chat-id>` | 2026-10-15 09:55 |
| `claude-haiku-4-5` | **200** · 469 modelos | **200** · `claude-haiku-4-5` · `<chat-id>` | 2026-10-15 09:56 |
| `claude-haiku-4-5` | **200** · 469 modelos | **200** · `claude-haiku-4-5` · `<chat-id>` · reverificado 12:05 · ✔ **ao vivo** | 2026-10-15 11:08 |

`GET /v1/models` 200 prova que uma chave é *autêntica*; uma conclusão 200 carregando um corpo de chat-completion prova que a conta por trás dela pode *gastar*. `verify.js` (e cada emissão) registra o status exato, o corpo e a saída observadora de ambas as chamadas por chave em `accounts.json` — `verify` contém o veredito atual, `verify.atMint` a medição feita quando a chave foi emitida.

**A triagem de saídas é o trabalho.** Este painel bloqueia por IP de origem, então uma saída que respondeu há um minuto pode começar a responder `403 IP banned`. A verificação filtra saídas banidas antes de gastar uma chave nelas, aposenta qualquer uma que seja banida depois e as conta — uma chave que não pôde ser medida diz `unmeasured` em vez de ser lida como morta. O próprio banimento de conta do painel (`403 auth.user_banned`) é registrado exatamente como tal, então nem uma saída bloqueada nem uma conta banida podem ser confundidas com uma chave quebrada.

> **Portões de qualidade.** Toda chave aqui passou por um `chat-200` ao vivo antes de ser escrita em `keys.txt`
> (chaves mortas nunca são entregues). As combinações do roteador seguem a mesma regra no nível do modelo: uma entrada é
> adicionada **somente se o modelo responder `chat-200` e puder chamar ferramentas** — um modelo sem suporte a ferramentas,
> uma chave morta ou um provedor morto é descartado em vez de adicionado. Reexecute a etapa de verificação a qualquer momento;
> as falhas são relatadas, nunca ocultadas.

## 🧭 Como funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: CaMeL AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.camel-hub.com/v1/chat/completions → real content = the key is live
```

| Etapa | Chamada | Notas |
| --- | --- | --- |
| portões | a própria configuração do painel | `turnstile_check: false`, `email_verification: true` |
| caixa de correio | [Emailnator](https://www.emailnator.com) | um endereço gmail novo por conta, lido através das suas saídas |
| e-mail de verificação | envio do painel | o código só é aceito quando o remetente do e-mail corresponde a `noreply@<panel-mail>` / `CaMeL AI` |
| registro | rota de registro do painel | HTTP simples, sem captcha |
| check-in | rota de check-in diário | paga para o saldo |
| chave | rota de chave do painel | uma chave por conta |
| provar | `GET /v1/models` + uma conclusão real | ambos registrados, com a saída observadora |

Uma saída banida nunca é lida como uma chave ruim: a ferramenta aposenta essa saída e mede novamente em outro lugar. A caixa de correio pode ser trocada com `--mail imap --imap-user … --imap-pass …` quando você possui os endereços (o painel recusa aliases, então cada conta precisa do seu próprio).

## ⚙️ Opções de CLI

Todo o código fica em `src/` — execute-o a partir da raiz do repositório como `node src/<file>.js`; os arquivos de dados (`keys.txt`, `proxies.txt`, `accounts.json`, `out/`) permanecem na raiz do repositório.

| Ferramenta | Flags |
| --- | --- |
| `src/mint.js` | `--count N` (5) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (ou `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--base URL` · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, máx 8) · `--budget` (2400 s) |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | interativo: mint / verify / settings — `count` e `conc` persistem em `launcher.config.json` |

```bash
node src/cli.js mint --count 30
node src/cli.js verify
node src/cli.js 9router
```

`--count` controla quantas chaves uma execução produz; a concessão do painel é por conta, então N chaves são N contas. `--scan` / `--scan-conc` controlam quanto da sua lista de saídas é sondado por saída fixada — aumente `--scan` em uma lista obsoleta, diminua em uma pequena.

## 🛰️ Atrás de um proxy

* As saídas vêm de `proxies.txt` (uma linha por saída, `scheme://host:port`, `user:pass@` suportado, comentários com `#` ignorados). O mesmo pool alimenta as chamadas ao painel, a verificação de chaves e as leituras da caixa de correio.
* **Opcional — recomendado em escala (limites por IP, banimentos).** A ferramenta funciona sem proxy também: sem lista de saídas (ou com uma vazia) a CLI imprime `running WITHOUT a proxy (direct)` e toda requisição sai pela sua própria linha — cadastro, emissão de chaves e verificação permanecem inalterados.
* **A triagem é o trabalho.** Cada conta fixa a primeira saída que prova `GET /api/status` contra o host do painel (sem pool, a "saída" fixada é a rota direta), e a verificação fixa uma saída provada *diferente* — uma saída que morre no meio da execução se aposenta e a conta continua na próxima.
* Uma saída banida responde `403 IP banned`; ela é filtrada antes de uma chave ser gasta nela e aposentada quando isso acontece depois.
* A caixa de correio ([Emailnator](https://www.emailnator.com)) é um serviço de e-mail temporário de terceiros, e não o painel; sua API também é lida através das suas saídas.

## 📄 Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `keys.txt` | uma chave verificada ao vivo por linha — ignorado pelo git |
| `accounts.json` | caixa de correio, etapas, check-in, ambas as saídas de verificação por conta — ignorado pelo git |
| `models.json` | uma captura nova de `/v1/models` por execução — ignorado pelo git |
| `proxies.txt` | suas saídas, uma por linha — ignorado pelo git |
| `out/pinned-<date>.log` | o log por execução (saída, tempo, resposta exata do servidor) — ignorado pelo git |
| `src/mint.js` · `src/verify.js` | os dois motores para os quais a CLI despacha |
| `src/connect-9router.js` | registra as chaves em `keys.txt` como conexões do 9Router |

## 🔌 Conectar ao 9Router

[9Router](https://9router.com) é um roteador auto-hospedado e compatível com OpenAI. A CaMeL AI é compatível com OpenAI, então registre-a uma vez e use todas as chaves:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
# or: node src/cli.js 9router
```

Cada chave em `keys.txt` se torna uma conexão do nó provedor `camelhub` (`--api-key <key>` registra uma única chave em vez disso, `--model <id>` substitui o padrão). Depois escolha um modelo dentro do 9Router:

```
camelhub/claude-haiku-4-5
camelhub/deepseek-chat
camelhub/glm-4.5
```

Padrões: `--base http://localhost:20128`, `--password 123456`, `--prefix camelhub`, `--base-url https://api.camel-hub.com/v1`, modelo padrão `claude-haiku-4-5`. Aponte o conector para um `keys.txt` atualizado para adicionar mais contas; o nó e sua lista de modelos permanecem os mesmos.

## 🔌 Conectar ao OmniRoute

[OmniRoute](https://omniroute.online) é um roteador auto-hospedado e compatível com OpenAI. A CaMeL AI é compatível com OpenAI, então registre-a uma vez e use todas as chaves:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
# or: node src/cli.js omniroute
```

Cada chave em `keys.txt` se torna uma conexão do nó provedor `camelhub` (`--api-key <key>` registra uma única chave em vez disso, `--model <id>` substitui o padrão). Depois escolha um modelo dentro do OmniRoute:

```
camelhub/claude-haiku-4-5
camelhub/deepseek-chat
camelhub/glm-4.5
```

Padrões: `--base http://localhost:20128`, `--password 123456`, `--prefix camelhub`, `--base-url https://api.camel-hub.com/v1`, modelo padrão `claude-haiku-4-5`. Aponte o conector para um `keys.txt` atualizado para adicionar mais contas; o nó e sua lista de modelos permanecem os mesmos.

## 🔑 O que uma chave lhe dá

| | |
| --- | --- |
| 🏢 Provedor | **CaMeL AI** — [camel-hub.cn](https://camel-hub.cn) |
| 🎁 O que o provedor dá | 469 modelos listados · $1,00 de crédito no cadastro mais um check-in diário · toda chave verificada |
| 🔑 O que uma chave lhe dá | uma chave de API vinculada à sua própria conta: os 469 ids de modelo no endpoint abaixo, nos limites do seu plano. A cota fica na **conta**, que é exatamente por isso que esta ferramenta cria uma conta por chave |
| 🌐 Formato da API | Compatível com OpenAI: `POST https://api.camel-hub.com/v1/chat/completions` |
| 🔒 Seus dados | apenas camel-hub.cn e o backend de caixa de entrada que você configurar são contatados; as chaves permanecem na sua máquina |

## 🐞 Problemas

Abra uma issue com a etapa que falhou e o final do log da execução (`out/pinned-<date>.log`) — ele carrega a saída, o tempo e a resposta exata do servidor, que é tudo o que é necessário para reproduzir uma falha. Nunca anexe uma chave. **[Abra uma issue](../../issues)** e PRs são bem-vindos.

## 📄 Licença

MIT © 2026 — veja [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 camelhub-bulk-apikey contributors

</div>