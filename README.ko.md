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

**자동 생성된 API 키로 CaMeL AI 계정을 대량 생성 — OpenAI 호환 추론 (469개 모델: Claude, Gemini, DeepSeek, GLM, Qwen) + 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-469%20served-412991?style=for-the-badge)](https://camel-hub.cn)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-469-of-them) · [🧪 API 사용하기](#-how-to-use-the-api) · [✅ 검증 완료](#-verified-working--every-key-is-tested) · [🧭 동작 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## 🎁 무료 티어 — 무엇을 얼마나 받을 수 있나

**모든 신규 계정에는 실제로 사용 가능한 크레딧이 지급됩니다: 가입 시 $1.00에 더해 매일 유료 출석 체크 — 카드도, 캡차도 필요 없습니다.**

| 항목 | 측정 결과 |
| --- | --- |
| 가입 지급 | **500,000 할당량 = $1.00** (`quota_per_unit: 500000`, `usd_exchange_rate: 1`) |
| 일일 출석 체크 | **활성화됨**, 첫날 세 계정에서 **$0.56 – $1.86** 지급 |
| 가입 후 + 같은 날 출석 체크 1회 후 잔액 | **$1.556 · $2.062 · $2.856** |
| 가입 시 캡차 | **없음** (`turnstile_check: false`) |
| 패널이 허용하는 이메일 | 일반 `@gmail.com` (점이 들어간 별칭은 거부됨: `邮箱地址别名限制`); `@qq.com`은 패널 자체 메일 월에서 작동 |
| 키에 대한 속도 제한 | **측정된 바 없음** — 아래 모델 채널 관련 참고 사항 참조 |
| 확장되는 단위 | **계정 하나 = 키 하나** → `--count N`은 사실상 "무료 계정 N개"를 뜻함 |

**크레딧은 실제입니다; 다만 모든 모델 채널이 살아 있는 것은 아닙니다.** *목록에 있는* 모델이라도 채널이 다운된 상태라면 `404 当前模型暂时不可用`로 응답할 수 있습니다 — 한 배치에서 측정한 결과: `ERNIE-Lite-8K`와 `claude-3-haiku-20240307`은 다운, `claude-haiku-4-5`는 몇 초 뒤 같은 키로 `200` 응답. 그래서 이 도구는 첫 번째 항목을 신뢰하는 대신 가장 저렴한 목록 id들을 순회합니다.

> 💡 무료 티어는 CaMeL AI가 정하며 변경될 수 있습니다. 실시간 수치는 [camel-hub.cn](https://camel-hub.cn)에서 확인하세요 — 그리고 도구 자체의 게이트가 판단하게 하세요:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 모델 — 469개 모두

`GET https://api.camel-hub.com/v1/models`는 발급된 키에 대해 **469개의 모델 id**를 반환합니다. 예를 들어:

```
claude-haiku-4-5 · claude-opus-4-5 · gemini-2.5-flash · deepseek-chat
deepseek-r1-250528 · qwen-flash · glm-4.5 · kimi-k2.5
grok-4 · gpt-3.5-turbo · llama-3.1-405b
```

|모델|✓|
|---|---|
|`claude-haiku-4-5`|✓|

목록에 있는 채널이라도 키가 멀쩡한데도 `404 当前模型暂时不可用`로 응답할 수 있으므로, 검증기가 실제로 완료 응답을 받은 id만 체크 표시됩니다; `--model <id>`로 원하는 모델 하나를 고정할 수 있습니다.

```bash
curl https://api.camel-hub.com/v1/models -H "Authorization: Bearer <one of your keys>"
```

## 🧪 API 사용 방법

기본 URL은 **`https://api.camel-hub.com/v1`** — OpenAI 호환이므로 OpenAI를 지원하는 모든 도구(SDK, Cursor, OpenCode, Kilo Code 등)에서 작동합니다.

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

패널은 여러 API 호스트를 운영합니다; `https://api.camel-hub.com`은 이 배치가 측정 기준으로 삼은 호스트이며, `--base URL`로 도구를 다른 호스트로 지정할 수 있습니다 (패널 자체 게이트는 `https://api.camel-hub.cn`을 현재 메인 라인으로 명시합니다).

## 🛠 빠른 시작

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

키는 `GET /v1/models` 200 응답 *그리고* 모델 호출 응답(완료 응답, 또는 크레딧 거부 — 오류일 때만 키를 보류함)을 받은 뒤에만 `keys.txt`에 한 줄씩追加됩니다. 계정은 순차적으로 실행됩니다; `--count 30`은 긴 실행이며, `out/pinned-<date>.log`가 그 실행 기록입니다. `proxies.txt`의 exit를 거치지 않는 것은 패널에 전송되지 않습니다 — 남은 exit가 없는 호출은 직접 다이얼하는 대신 예외를 발생시킵니다.

### 🖱️ 런처

```bash
node src/launcher.js
```

작업 모듈 위에 펼쳐지는 메뉴: **mint**, **verify**, **9Router**. `count`(실행당 키 수)와 `conc`(병렬 exit 프로브)를 물어보고 이를 `launcher.config.json`에 저장하며, 적절한 플래그로 `node src/cli.js <task>`를 실행합니다. `node src/launcher.js --connect-9router`는 9Router 등록을 바로 실행하며 먼저 기본 URL과 비밀번호를 물어봅니다.

## ✅ 검증 완료 — 모든 키가 테스트됨

**2026-10-15** 측정: **계정 4개 → 키 4개, 계정당 키 하나**. 모든 키는 생성된 뒤 *민팅과 독립적인* exit에서 검사되었고, 나중에 다시 검사되었습니다 — 패널은 exit *그리고* 계정 기준으로 차단하기 때문입니다.

| 모델 | 실시간 (models) | 실제 채팅 호출 | 측정 시각 |
| --- | --- | --- | --- |
| `claude-haiku-4-5` | **200** · 469개 모델 | **200** · `claude-haiku-4-5` · `<chat-id>` · 12:05 재검사 · ✔ **실시간** | 2026-10-15 11:08 |

`GET /v1/models` 200은 키가 *정품임*을 증명하고, 채팅 완료 본문을 담은 완료 응답 200은 그 뒤의 계정이 *지출할 수 있음*을 증명합니다. `verify.js`(그리고 모든 민트)는 키별로 두 호출의 정확한 상태, 본문, 관측 exit를 `accounts.json`에 기록합니다 — `verify`는 현재 판정을, `verify.atMint`는 키가 민팅될 때의 측정치를 담습니다.

**exit 스크리닝이 핵심 작업입니다.** 이 패널은 소스 IP로 차단하므로, 1분 전에 응답하던 exit가 `403 IP banned`로 응답하기 시작할 수 있습니다. 검증은 키를 소비하기 전에 차단된 exit를 걸러내고, 나중에 차단되는 exit는 은퇴시키며, 그 수를 집계합니다 — 측정할 수 없었던 키는 죽은 것으로 읽히는 대신 `unmeasured`로 표시됩니다. 패널 자체의 계정 차단(`403 auth.user_banned`)은 정확히 그렇게 기록되므로, 차단된 exit도 차단된 계정도 고장 난 키로 오인될 수 없습니다.

## 🧭 동작 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: CaMeL AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.camel-hub.com/v1/chat/completions → real content = the key is live
```

| 단계 | 호출 | 비고 |
| --- | --- | --- |
| 게이트 | 패널 자체 구성 | `turnstile_check: false`, `email_verification: true` |
| 메일함 | [Emailnator](https://www.emailnator.com) | 계정당 새 gmail 주소, 당신의 exit를 통해 읽음 |
| 인증 메일 | 패널 발송 | 메일 발신자가 `camelbot@kr777.top` / `CaMeL AI`와 일치할 때만 코드가 허용됨 |
| 등록 | 패널 등록 경로 | 일반 HTTP, 캡차 없음 |
| 출석 체크 | 일일 출석 체크 경로 | 잔액으로 지급 |
| 키 | 패널 키 경로 | 계정당 키 하나 |
| 증명 | `GET /v1/models` + 실제 완료 응답 | 둘 다 기록되며, 관측 exit 포함 |

차단된 exit는 결코 나쁜 키로 읽히지 않습니다: 도구는 그 exit를 은퇴시키고 다른 곳에서 다시 측정합니다. 주소를 직접 소유한 경우 `--mail imap --imap-user … --imap-pass …`로 메일함을 교체할 수 있습니다 (패널이 별칭을 거부하므로, 그때는 각 계정이 고유 주소를 가져야 합니다).

## ⚙️ CLI 옵션

모든 코드는 `src/`에 있습니다 — 저장소 루트에서 `node src/<file>.js`로 실행하세요; 데이터 파일(`keys.txt`, `proxies.txt`, `accounts.json`, `out/`)은 저장소 루트에 남습니다.

| 도구 | 플래그 |
| --- | --- |
| `src/mint.js` | `--count N` (5) · `--pool FILE` (`proxies.txt`) · `--mail emailnator\|imap` · `--imap-user` / `--imap-pass` (또는 `IMAP_USER` / `IMAP_PASS`) · `--mail-address` · `--base URL` · `--model ID` · `--poll-ms` (2000) · `--code-wait` (300000) · `--max-cycle` (3) · `--scan` (200) · `--scan-conc` (8, 최대 8) · `--budget` (2400 s) |
| `src/verify.js` | `--key K` · `--all` · `--model ID` · `--max-tokens` (8) · `--want` (3) · `--pool FILE` · `--base URL` |
| `src/launcher.js` | 대화형: mint / verify / settings — `count`와 `conc`는 `launcher.config.json`에 유지됨 |

```bash
node src/cli.js mint --count 30
node src/cli.js verify
node src/cli.js 9router
```

`--count`는 한 실행이 생성할 키 수를 제어합니다; 패널의 지급은 계정 단위이므로 N개의 키는 N개의 계정입니다. `--scan` / `--scan-conc`은 고정된 exit당 exit 목록 중 얼마나 많이 프로브할지 제어합니다 — 오래된 목록에서는 `--scan`을 올리고, 작은 목록에서는 내리세요.

## 🛰️ 프록시 사용

* exit는 `proxies.txt`에서 가져옵니다 (exit당 한 줄, `scheme://host:port`, `user:pass@` 지원, `#` 주석 무시). 동일한 풀이 패널 호출, 키 검증, 메일함 읽기에 사용됩니다; 도구는 절대 프로바이더에 직접 접속하지 않습니다.
* **스크리닝이 핵심 작업입니다.** 각 계정은 패널 호스트에 대해 `GET /api/status`를 증명하는 첫 번째 exit를 고정하고, 검증은 *다른* 증명된 exit를 고정합니다 — 실행 중에 죽는 exit는 스스로 은퇴하고 계정은 다음 exit에서 계속됩니다.
* 차단된 exit는 `403 IP banned`로 응답합니다; 키를 소비하기 전에 걸러지고, 나중에 발생하면 은퇴됩니다.
* 메일함([Emailnator](https://www.emailnator.com))은 패널이 아닌 서드파티 임시 메일 서비스입니다; 그 API 역시 당신의 exit를 통해 읽힙니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 실시간 검증된 키 한 줄당 하나 — git-ignored |
| `accounts.json` | 계정별 메일함, 단계, 출석 체크, 두 검증 exit — git-ignored |
| `models.json` | 실행당 새로 캡처한 `/v1/models` — git-ignored |
| `proxies.txt` | exit 목록, 한 줄당 하나 — git-ignored |
| `out/pinned-<date>.log` | 실행별 로그 (exit, 타이밍, 정확한 서버 응답) — git-ignored |
| `src/mint.js` · `src/verify.js` | CLI가 디스패치하는 두 엔진 |
| `src/connect-9router.js` | `keys.txt`의 키를 9Router 연결로 등록 |

## 🔌 9Router 연결

[9Router](https://9router.com)는 셀프 호스팅, OpenAI 호환 라우터입니다. CaMeL AI는 OpenAI 호환이므로, 한 번 등록하면 모든 키를 사용할 수 있습니다:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456 --keys-file keys.txt
# or: node src/cli.js 9router
```

`keys.txt`의 모든 키가 `camelhub` 프로바이더 노드의 연결 하나씩이 됩니다 (`--api-key <key>`는 단일 키만 등록, `--model <id>`는 기본값 재정의). 그런 다음 9Router 안에서 모델을 선택하세요:

```
camelhub/claude-haiku-4-5
camelhub/deepseek-chat
camelhub/glm-4.5
```

기본값: `--base http://localhost:20128`, `--password 123456`, `--prefix camelhub`, `--base-url https://api.camel-hub.com/v1`, 기본 모델 `claude-haiku-4-5`. 커넥터를 갱신된 `keys.txt`로 지정하여 계정을 더 추가하세요; 노드와 그 모델 목록은 그대로 유지됩니다.

## 🔑 키 하나로 무엇을 얻나

| | |
| --- | --- |
| 🏢 프로바이더 | **CaMeL AI** — [camel-hub.cn](https://camel-hub.cn) |
| 🎁 프로바이더가 제공하는 것 | 469개 목록 모델 · 가입 시 $1.00 크레딧 + 일일 출석 체크 · 모든 키 실시간 검증 |
| 🔑 키 하나로 얻는 것 | 자체 계정에 한정된 API 키 하나: 아래 엔드포인트의 469개 모델 id를, 당신의 플랜 한도 내에서. 할당량은 **계정**에 있으므로, 이 도구가 계정당 키 하나를 생성하는 것입니다 |
| 🌐 API 형태 | OpenAI 호환: `POST https://api.camel-hub.com/v1/chat/completions` |
| 🔒 당신의 데이터 | camel-hub.cn과 당신이 구성한 메일함 백엔드만 접촉됩니다; 키는 당신의 머신에 남습니다 |

## 🐞 이슈

실패한 단계와 실행 로그 꼬리(`out/pinned-<date>.log`)를 첨부하여 이슈를 여세요 — 로그에는 exit, 타이밍, 정확한 서버 응답이 담겨 있어 실패를 재현하는 데 필요한 모든 것이 있습니다. 키는 절대 첨부하지 마세요. **[이슈 열기](../../issues)** 및 PR 환영합니다.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 camelhub-bulk-apikey 기여자들

</div>