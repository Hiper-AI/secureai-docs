---
id: ide-claude-code
title: "클로드 코드"
sidebar_label: "클로드 코드"
description: "SecureAI와 함께 Claude Code 사용 — AI 지원 개발을 위한 완전한 SMLTP, DLP 및 PII 시행"
---
# 클로드 코드 - IDE 통합

[Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview)는 Anthropic의 에이전트 코딩 도우미입니다. SecureAI의 Anthropic 호환 프록시를 가리키면 개발자가 보내는 모든 프롬프트는 개발자의 워크플로를 변경하지 않고도 **SMLTP, DLP, PII 스캐닝, Prompt Shield, 속도 제한 및 모델 거버넌스**를 통과합니다.

---

## 작동 방식

SecureAI는 다음 위치에 Anthropic Messages API 호환 엔드포인트를 노출합니다.

```
https://<your-host>/api/claude-code
```

Claude Code는 기본적으로 `ANTHROPIC_BASE_URL` 환경 변수를 통해 모든 트래픽을 사용자 정의 기본 URL로 리디렉션하는 것을 지원합니다. 구성되면 기본 Anthropic 프로토콜을 SecureAI에 직접 전달하므로 로컬 프록시나 래퍼 스크립트가 필요하지 않습니다.

```
Developer machine
    │
    │  Anthropic Messages API (POST /v1/messages)
    ▼
SecureAI  (/api/claude-code)
    │
    ├── API key auth
    ├── SMLTP bundle + policy hash
    ├── DLP scan (input)
    ├── PII scan + graduated enforcement
    ├── Prompt Shield (injection detection)
    ├── Model governance & rate limiting
    │
    ▼
OpenRouter / Self-Hosted LLM
```

모든 활동은 개발자의 API 키에 따라 **AI 게이트웨이 → 감사 로그** 아래의 SecureAI 관리 대시보드에 표시됩니다.

---

## 1단계 - Claude Code 설치


<Tabs>
  <Tab title="macOS/리눅스/WSL">

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

  </Tab>
  <Tab title="윈도우 파워셸">

```powershell
irm https://claude.ai/install.ps1 | iex
```

  </Tab>
</Tabs>

---

## 2단계 — API 키 생성

1. **관리자 → API 키** (`https://<your-host>/admin/apis`)로 이동합니다.
2. **API 키 생성**을 클릭하세요.
3. 이름을 설정합니다(예: `claude-code-dev-jane`)
4. 구성:
   - **허용 모델** — 키가 사용할 수 있는 LLM을 선택합니다([사용 가능한 모델](#available-models) 참조).
   - **SMLTP 정책** — 규정 준수 정책(`internal`, `confidential`, `hipaa` 등)을 선택합니다.
   - 필요에 따라 **비율 제한**
5. `sk-…` 값을 복사합니다. 이 값은 한 번만 표시됩니다.

---

## 3단계 - 클로드 코드 구성

권장되는 접근 방식은 기본적으로 git 무시되는 **프로젝트 수준 로컬 설정 파일**(`.claude/settings.local.json`)에 설정을 추가하는 것입니다.

```json title=".claude/settings.local.json"
{
  "env": {
    "ANTHROPIC_BASE_URL":  "https://<your-host>/api/claude-code",
    "ANTHROPIC_AUTH_TOKEN": "sk-<your-secureai-api-key>",
    "ANTHROPIC_API_KEY":   "",

    "ANTHROPIC_DEFAULT_OPUS_MODEL":   "anthropic/claude-opus-4.6",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "anthropic/claude-sonnet-4.6",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL":  "google/gemini-3-flash-preview",
    "CLAUDE_CODE_SUBAGENT_MODEL":     "anthropic/claude-sonnet-4.6",

    "CLAUDE_CODE_SKIP_FAST_MODE_ORG_CHECK": "1"
  }
}
```

<Warning>
`ANTHROPIC_API_KEY`은 Claude Code가 Anthropic으로 직접 인증을 시도하는 것을 방지하기 위해 **명시적으로 빈 문자열로 설정**되어야 합니다.
</Warning>

<Tip>
**셸 프로필(대체)**

설정 파일 대신 `~/.zshrc`, `~/.bashrc` 또는 PowerShell `$PROFILE`에 변수를 추가할 수도 있습니다. 설정 파일은 팀 프로젝트에 선호되므로 모든 개발자가 동일한 구성을 자동으로 상속합니다.
</Tip>

---

## 4단계 - 연결 확인

프로젝트 디렉터리에서 Claude Code를 시작합니다.

```bash
cd /path/to/your/project
claude
```

세션 내에서 `/status`를 실행합니다. 다음을 확인해야 합니다.

```
Auth token:          ANTHROPIC_AUTH_TOKEN
Anthropic base URL:  https://<your-host>/api/claude-code
```

이는 모든 트래픽이 SecureAI를 통해 라우팅되고 있음을 확인합니다.

---

## 사용 가능한 모델

SecureAI는 채팅 인터페이스에서 사용할 수 있는 동일한 모델 카탈로그를 공개합니다. 위의 환경 변수에 아래 표의 `id` 값을 사용하세요.

### 인류학(클로드)
| 모델 ID | 표시 이름 |
|---|---|
| `anthropic/claude-sonnet-4.6` | 클로드 소네트 4.6 |
| `anthropic/claude-opus-4.6` | 클로드 오푸스 4.6 |

### 오픈AI
| 모델 ID | 표시 이름 |
|---|---|
| `openai/gpt-5-mini` | GPT-5 미니 |
| `openai/gpt-5.1-codex` | GPT-5.1-코덱스 |
| `openai/gpt-5.1` | GPT-5.1 |
| `openai/gpt-5.2` | GPT-5.2 |
| `openai/gpt-5.3-codex` | GPT-5.3-Codex |

### 구글(제미니)
| 모델 ID | 표시 이름 |
|---|---|
| `google/gemini-3-flash-preview` | Gemini 3 플래시 미리보기 |
| `google/gemini-3.1-pro-preview` | Gemini 3.1 Pro 미리보기 |

### 메타(라마)
| 모델 ID | 표시 이름 |
|---|---|
| `meta-llama/llama-4-maverick` | 라마 4 매버릭 |
| `meta-llama/llama-4-scout` | 라마 4 스카우트 |
| `meta-llama/llama-3.3-70b-instruct` | 라마 3.3 70B 교육 |

### 미스트랄
| 모델 ID | 표시 이름 |
|---|---|
| `mistralai/mistral-large-2512` | 미스트랄 라지 3 2512 |
| `mistralai/ministral-14b-2512` | 미니스트럴 14B 2512 |
| `mistralai/mistral-nemo` | 미스트랄 네모 |
| `mistralai/mistral-7b-instruct` | 미스트랄 7B 교육 |

### 딥시크
| 모델 ID | 표시 이름 |
|---|---|
| `deepseek/deepseek-r1-0528` | DeepSeek R1 0528 |
| `deepseek/deepseek-v3.2` | DeepSeek V3.2 |

### xAI(그록)
| 모델 ID | 표시 이름 |
|---|---|
| `x-ai/grok-4` | 그록 4 |
| `x-ai/grok-code-fast-1` | Grok 코드 패스트 1 |
| `x-ai/grok-4.1-fast` | Grok 4.1 빠른 |

### 퀀
| 모델 ID | 표시 이름 |
|---|---|
| `qwen/qwen3-coder` | Qwen3-코더 |
| `qwen/qwen3-coder-next` | Qwen3 코더 다음 |
| `qwen/qwen3-235b-a22b-2507` | Qwen3 235B A22B 2507 |
| `qwen/qwen3.5-397b-a17b` | Qwen3.5 397B A17B |

### 자체 호스팅(원격 SMLTP 끝점)

활성 원격 SMLTP 엔드포인트로 등록된 자체 호스팅 모델을 자동으로 사용할 수 있습니다. 해당 ID는 `self-hosted/<model-name>` 패턴을 따릅니다. Claude Code에서 `/status`을 실행하거나 `GET /api/claude-code/v1/models`을 호출하여 실시간 목록을 확인하세요.

---

## 클로드 코드 모델 역할

Claude Code는 다양한 내부 작업에 대해 다양한 모델을 사용합니다. 위 카탈로그의 모델에 각 역할을 매핑합니다.

| 환경 변수 | 역할 | 추천 |
|---|---|---|
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | 복잡한 추론, 주요 에이전트 루프 | `anthropic/claude-opus-4.6` |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | 일반 코딩 작업 | `anthropic/claude-sonnet-4.6` |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | 빠른 완료, 도구 호출 | `google/gemini-3-flash-preview` |
| `CLAUDE_CODE_SUBAGENT_MODEL` | 생성된 하위 에이전트 작업 | `anthropic/claude-sonnet-4.6` |

공급자를 자유롭게 혼합할 수 있습니다. 예를 들어 빠르고 저렴한 하위 작업에는 Gemini를 사용하고 주요 추론 루프에는 Claude를 사용합니다.

```json
"ANTHROPIC_DEFAULT_OPUS_MODEL":   "anthropic/claude-opus-4.6",
"ANTHROPIC_DEFAULT_SONNET_MODEL": "x-ai/grok-code-fast-1",
"ANTHROPIC_DEFAULT_HAIKU_MODEL":  "google/gemini-3-flash-preview",
"CLAUDE_CODE_SUBAGENT_MODEL":     "deepseek/deepseek-v3.2"
```

---

## 보안 시행

프록시를 통한 모든 요청에는 전체 SecureAI 보안 스택이 적용됩니다.

| 레이어 | 그것이 하는 일 |
|---|---|
| **SMLTP** | 모든 호출에 번들 ID, 정책 해시, 추적 ID 및 송신 실행을 첨부 |
| **민주당** | 데이터 손실 패턴(비밀, 자격 증명, 기밀 문서)에 대한 검사 프롬프트 |
| **개인 식별 정보** | 개인 식별 정보를 탐지하고 수정합니다. 졸업된 집행 단계 |
| **프롬프트 쉴드** | 즉각적인 주입 시도 감지 |
| **모델 거버넌스** | 허용된 모델, 공급자 허용 목록 및 상주 규칙 시행 |
| **속도 제한** | Redis를 통해 시행되는 키별 및 사용자별 제한 |
| **감사 로그** | **AI 게이트웨이 → 감사 로그**의 전체 요청별 감사 추적 |

SMLTP 정책은 API 키 구성에서 상속됩니다. 키 정책을 변경하려면 **관리 → API 키**로 이동하여 키를 편집하고 다른 **SMLTP 정책**을 선택하세요.

---

## 문제 해결

### `/status`에는 여전히 `api.anthropic.com`이 표시됩니다.

Claude Code에는 이전 로그인의 자격 증명이 캐시되어 있습니다. Claude Code 세션 내에서 `/logout`를 실행한 후 다시 시작하세요.

```bash
claude
❯ /logout
```

### `401 Unauthorized`

- **관리자 → API 키**에서 `sk-…` 키가 활성화되어 있는지 확인하세요.
- `ANTHROPIC_API_KEY`가 빈 문자열(`""`)로 설정되어 있는지 확인하세요.

### 사용할 수 없는 모델

- **관리자 → API 키**에서 API 키의 **허용 모델** 목록을 확인하세요.
- `GET /api/claude-code/v1/models`(`Bearer sk-…` 토큰 사용)을 호출하여 키가 액세스할 수 있는 항목을 정확히 확인하세요.

### DLP/PII 차단

프롬프트가 차단되면 Claude Code는 위반을 설명하는 메시지와 함께 오류 응답을 받게 됩니다. 인시던트는 **관리 → 인시던트**에 기록되고 **AI Gateway → 감사 로그**에 표시됩니다.