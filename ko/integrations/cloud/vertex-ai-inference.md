---
sidebar_position: 7
title: "Google Vertex AI — 내 계정에서 추론"
sidebar_label: "Vertex AI — 추론"
description: "SecureAI의 LLM 트래픽을 자체 Google Cloud 계정에서 실행하세요: 약정 사용(CUD)으로 Google에 비용을 지불하면서 SecureAI는 계속 DLP, 정책, 서명된 영수증을 적용합니다."
---

# Google Vertex AI — 내 계정에서 추론

이 통합을 사용하면 SecureAI의 대규모 언어 모델(LLM) 호출이 SecureAI 관리 공급자 대신 **자체 Google Cloud 프로젝트**에서 실행됩니다. 사용량은 Google 계정에 직접 청구되므로 약정 사용(CUD)과 협상된 할인을 활용할 수 있습니다.

SecureAI는 모든 요청의 경로에 그대로 남아 있습니다. **DLP, 모델 정책, 데이터 상주, 서명된 영수증**은 다른 공급자와 똑같이 적용됩니다.

<Info>
**다른 Google Cloud 카드와 혼동하지 마세요.** 이 페이지는 Vertex AI를 **추론 공급자**로 연결합니다(Admin → Integrations → **AI providers**). **Google Cloud — 검색** 카드(**Cloud** 카테고리)는 프로젝트를 읽기 전용으로 인벤토리화할 뿐 프롬프트를 보내지 않으며, [Google Cloud — 디스커버리](/ko/integrations/cloud/gcp-vertex-ai)에서 설명합니다. 같은 프로젝트에서 둘 다 사용할 수 있지만, 서로 독립적이며 요구하는 권한도 다릅니다.
</Info>

## Vertex에서 실행되는 것과 실행되지 않는 것

| 내 Vertex에서 실행 | SecureAI 관리 공급자에 남음 |
|---|---|
| 채팅 및 에이전트(선택한 제품군의 모델) | 임베딩(문서 및 인덱스 검색) |
| Teams 회의 요약(Gemini 모델) | 검색 재순위화 |
| 문법 검사, 번역 및 기타 내부 백그라운드 작업(**Remap everything**을 선택한 경우) | 문서 OCR |
| | 관리자 어시스턴트 |
| | 이미지 생성 및 실시간 음성 |
| | 자체 호스팅 모델 및 Claude Code 프록시 |

현재 사용할 수 있는 모델: **Gemini** 및 Vertex에서 MaaS로 제공되는 개방형 모델(**gpt-oss, DeepSeek, Llama, Qwen**). **Vertex의 Claude와 Mistral은 아직 지원되지 않습니다**. 이 모델들은 폴백 설정에 따라 처리됩니다(아래 참조).

## 사용할 수 있는 클라우드 공급자 수

| 플랜 | 동시에 사용 설정할 수 있는 추론 공급자 |
|------|----------------------------------------|
| **Scale** | 1개(Google Vertex AI, Azure AI Foundry, **또는** Amazon Bedrock) |
| **Enterprise** | 최대 3개 — 예: Gemini에는 Vertex AI, GPT에는 Foundry, Claude에는 Bedrock |

둘 이상의 공급자를 사용 설정하면 각 공급자는 **서로 다른** 모델 제품군을 처리합니다. 하나의 제품군은 사용 설정된 공급자 하나만 맡을 수 있으며, **Remap everything**도 공급자 하나만 사용할 수 있습니다. 통합을 켠 상태로 저장할 때 SecureAI는 다음 두 경우에 저장을 거부하고 패널에 이유를 설명합니다.

| 경우 | 패널 메시지 |
|------|-------------|
| 라우팅이 사용 설정된 다른 공급자와 겹침(다른 공급자가 이미 맡은 제품군, 또는 두 번째 **Remap everything**) | *This routing overlaps another enabled cloud provider: …* 다음에 충돌하는 제품군이나 모드가 표시됩니다. |
| 플랜에서 공급자를 더 사용 설정할 수 없음 | *Your plan's BYO-cloud provider limit is reached (… of … in use). Disable another provider or upgrade the plan.* |

## 전제 조건

- 결제가 사용 설정된 **Google Cloud 프로젝트**.
- 해당 프로젝트에서 사용 설정된 **Agent Platform API(Vertex AI API)**(`aiplatform.googleapis.com` 서비스).
- 프로젝트에 있는 **서비스 계정**으로, **Agent Platform User** 역할(`roles/aiplatform.user`)을 가지고 있어야 하며, SecureAI가 이 계정으로 작업할 수 있는 다음 두 방법 중 하나가 필요합니다.
  - **옵션 A — 해당 서비스 계정의 JSON 키**.
  - **옵션 B — 키 없음(가장)**: 패널에 표시되는 SecureAI 서비스 계정에 서비스 계정에 대한 **Service Account Token Creator** 역할(`roles/iam.serviceAccountTokenCreator`)을 부여하며, 키는 저장되지 않습니다. 이 옵션은 SecureAI 배포에서 제공하는 경우에만 사용할 수 있습니다. 그렇지 않으면 패널에 *Keyless access is not enabled on this deployment.* 안내와 함께 비활성 상태로 표시됩니다.
- SecureAI의 Integrations 섹션에 대한 **관리자** 권한. 읽기 권한으로는 구성을 볼 수 있지만 변경할 수는 없습니다.

## 1단계. Google Cloud에서 프로젝트 준비

명령줄(빠름) 또는 콘솔(스크린샷 포함)에서 할 수 있습니다. 1~3단계는 두 인증 옵션 모두 동일하며, 4단계(JSON 키)는 옵션 A에만 해당합니다.

<Tabs>
<Tab title="gcloud(Cloud Shell)">

[Cloud Shell](https://shell.cloud.google.com/)에서 또는 `gcloud`를 설치한 환경에서 실행합니다. `MY_PROJECT`를 실제 프로젝트 ID로 바꾸세요.

```bash
gcloud config set project MY_PROJECT

# 1. Agent Platform API(Vertex AI API) 사용 설정
gcloud services enable aiplatform.googleapis.com

# 2. SecureAI 전용 서비스 계정 만들기
gcloud iam service-accounts create secureai-vertex --display-name="SecureAI Vertex"

# 3. 모델 호출에 필요한 최소 역할 부여
gcloud projects add-iam-policy-binding MY_PROJECT \
  --member="serviceAccount:secureai-vertex@MY_PROJECT.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# 4. 옵션 A만 해당: JSON 키 생성
gcloud iam service-accounts keys create key.json \
  --iam-account=secureai-vertex@MY_PROJECT.iam.gserviceaccount.com
```

</Tab>
<Tab title="Google Cloud 콘솔">

1. [Google Cloud 콘솔](https://console.cloud.google.com/)에서 프로젝트를 선택하고 **API 및 서비스 → 라이브러리**를 엽니다. **Agent Platform API**(이전 이름 **Vertex AI API**)를 검색하고 **사용**을 클릭합니다. 이미 **API 사용 설정됨**으로 표시되면 할 일이 없습니다.

   <div class="mac-window">
   ![Google Cloud에서 사용 설정된 Agent Platform API](/img/cloud/vertex-ai-inference/1%20-%20Vertex%20AI%20Inference.png)
   </div>

2. **IAM 및 관리자 → 서비스 계정 → 서비스 계정 만들기**로 이동합니다. 이름을 지정합니다(예: `secureai-vertex`).

   <div class="mac-window">
   ![서비스 계정 만들기](/img/cloud/vertex-ai-inference/2%20-%20Vertex%20AI%20Inference.png)
   </div>

3. **권한**에서 프로젝트에 대해 **Agent Platform User** 역할(`roles/aiplatform.user`)을 부여하고 **완료**를 클릭합니다. 추론에는 다른 역할이 필요하지 않습니다.

   <div class="mac-window">
   ![Agent Platform User 역할 부여](/img/cloud/vertex-ai-inference/3%20-%20Vertex%20AI%20Inference.png)
   </div>

4. **옵션 A만 해당.** 서비스 계정을 열고 **키** 탭 → **키 추가 → 새 키 만들기**로 이동하여 **JSON** 키 유형을 선택하고 **만들기**를 클릭합니다. 파일은 한 번만 다운로드됩니다.

   <div class="mac-window">
   ![JSON 키 만들기](/img/cloud/vertex-ai-inference/4%20-%20Vertex%20AI%20Inference.png)
   </div>

</Tab>
</Tabs>

<Warning>
JSON 파일은 비밀번호처럼 다루세요. SecureAI는 이 파일을 **암호화**하여 저장하고 다시 표시하지 않지만, 다운로드한 파일(`key.json`)은 컴퓨터에 남습니다. 내용을 SecureAI에 붙여넣은 다음 **삭제**하거나, 보안 비밀 관리자에 보관하세요.
</Warning>

<Warning>
**키를 만들 수 없는 경우.** 4단계가 `iam.disableServiceAccountKeyCreation`으로 실패하면 Google Cloud 조직의 정책이 서비스 계정 키를 금지하는 것입니다(새 조직의 기본값). 배포에서 제공한다면 **옵션 B, 키 없음**을 사용하세요. 그렇지 않으면 조직 정책 관리자에게 해당 프로젝트에 대한 `iam.disableServiceAccountKeyCreation` 제약 조건의 예외를 요청하세요.
</Warning>

### 옵션 B 키 없이 SecureAI 승인

옵션 B에서는 키를 만들지 않습니다. 대신 다음을 수행합니다.

1. SecureAI에서 Vertex AI 패널을 열고(2단계 참조) **Keyless (impersonation)** 옵션을 선택한 다음 **Your service account to impersonate**에 서비스 계정의 이메일을 입력합니다.
2. 패널에 배포의 SecureAI 서비스 계정이 이미 채워진, 실행할 명령이 표시됩니다. **Copy**로 복사하여 Cloud Shell에서 실행합니다. 명령은 다음과 같습니다.

   ```bash
   gcloud iam service-accounts add-iam-policy-binding secureai-vertex@MY_PROJECT.iam.gserviceaccount.com \
     --member="serviceAccount:SECUREAI_ACCOUNT" \
     --role="roles/iam.serviceAccountTokenCreator"
   ```

   역할은 프로젝트가 아니라 **서비스 계정에 대해** 부여됩니다. SecureAI는 해당 계정으로만 작업할 수 있으며, 그 계정은 `roles/aiplatform.user`만 보유합니다.

### 개방형 모델 Llama DeepSeek Qwen gpt-oss

**Gemini는 추가 작업이 필요 없습니다.** Llama, DeepSeek, Qwen 또는 gpt-oss도 사용하려면 먼저 **Vertex AI → Model Garden**에서 각 모델의 약관에 동의하세요. 이러한 개방형 모델은 특정 **리전**(예: `us-central1`)이 필요하며, `global`에서는 사용하지 못할 수 있습니다.

## 2단계. SecureAI에서 프로젝트 연결

1. **Admin → Integrations**로 이동하여 **AI providers** 카테고리를 열고 **Google Vertex AI — Inference on your account** 카드를 클릭합니다.
2. **Connection**에서 다음을 입력합니다.

   | 필드 | 입력할 내용 |
   |------|-------------|
   | **Google Cloud project ID** | 표시 이름이 아닌 프로젝트 ID(예: `my-project-123`). |
   | **Vertex AI location** | 처음에는 `global`로 두세요. Gemini 3 *preview* 기본 모델이 있는 곳입니다. **데이터 상주**가 필요하면 리전(`us-central1`, `europe-west4` 등)을 입력하세요. SecureAI는 각 요청을 선택한 리전 엔드포인트로 보내며, Google이 요청을 어디에서 처리하는지는 Google의 데이터 상주 약정에 따라 다릅니다. `global`을 사용하면 Google이 리전을 선택합니다. 개방형 모델에는 리전이 필요합니다. |
   | **Authentication** | **옵션 A:** **Service-account key (JSON)** 옵션을 선택한 상태로 두고 `key.json`의 **전체** 내용을 **Service-account key JSON**에 붙여넣습니다. **옵션 B:** **Keyless (impersonation)** 옵션을 선택하고 **Your service account to impersonate**에 서비스 계정의 이메일을 입력한 다음, 패널에 표시되는 명령을 실행합니다(위의 **옵션 B 키 없이 SecureAI 승인** 참조). |

   <div class="mac-window">
   ![Vertex AI 패널의 Connection 섹션](/img/cloud/vertex-ai-inference/5%20-%20Vertex%20AI%20Inference.png)
   </div>

3. **Save**를 클릭합니다. 아직 트래픽은 라우팅되지 않습니다. 먼저 테스트할 수 있도록 통합은 꺼진 상태로 저장됩니다.

<Info>
**첫날 권장 설정:** **Only these model families** 모드에서 **Gemini**만 선택하고, 기본 모델은 변경하지 않으며, 폴백과 시트별 지출 한도는 모두 꺼 두세요. 가장 예측 가능한 설정입니다. **Remap everything**은 이 설정이 검증된 뒤에 사용하세요.
</Info>

<Info>
옵션 A에서는 붙여넣은 키가 다시 표시되지 않습니다. 키를 교체하려면 새 키를 붙여넣으세요. 저장할 때 필드를 비워 두면 현재 키가 유지됩니다.
</Info>

## 3단계. Vertex에서 실행할 항목 선택

**What runs on Vertex**에는 두 가지 모드가 있습니다.

- **Only these model families** — 선택한 제품군(Gemini, gpt-oss, DeepSeek, Llama, Qwen)은 내 Vertex에서 실행되고, 나머지 모든 모델은 계속 SecureAI의 공급자에서 실행됩니다. 가장 보수적으로 시작하는 방법입니다(기본값: Gemini만).
- **Remap everything to Vertex** — 모든 LLM 호출이 내 Vertex에서 실행됩니다. Vertex에 대응 모델이 없는 모델은 **기본 모델**이 처리합니다.

**Default Vertex models**(편집 가능):

| 등급 | 용도 | 기본값 |
|------|------|--------|
| **Fast** | 백그라운드 작업 및 유틸리티(문법, 번역, Teams) | `google/gemini-2.5-flash` |
| **Standard** | 대응 모델이 없는 모델 | `google/gemini-3-flash-preview` |
| **Reasoning** | 대응 모델이 없는 추론 모델 | `google/gemini-3.1-pro-preview` |
| **Vision** | 이미지나 PDF가 포함된 요청 | `google/gemini-3-flash-preview` |

옵션도 두 가지 있습니다.

| 옵션 | 끔(권장) | 켬 |
|------|----------|----|
| **Allow fallback to SecureAI-managed models** | Vertex가 실패하거나 모델에 대응 모델이 없으면 요청을 다른 공급자로 보내지 않고 **거부**합니다. | 해당 요청은 SecureAI 관리 공급자에서 **한 번** 재시도됩니다. 재시도는 감사됩니다. |
| **Apply each seat's spend cap to turns served in your account** | 내 Vertex에서 처리된 턴은 각 사용자의 시트 지출 한도에 포함되지 않습니다. | 해당 턴은 SecureAI가 처리하는 턴과 마찬가지로 정가 기준으로 시트의 지출 한도(월간 한도와 4시간 버스트 한도 모두)에 포함됩니다. |

<div class="mac-window">

![What runs on Vertex 섹션](/img/cloud/vertex-ai-inference/6%20-%20Vertex%20AI%20Inference.png)

</div>

<Info>
사용할 수 있는 모델은 **위치**에 따라 다릅니다. 기본 모델(그중 여러 개가 *preview*)은 일부 리전에 없을 수 있습니다. 연결 테스트에서 **Model not available in this location**이 반환되면 다른 리전을 선택하거나 기본 모델을 해당 리전에서 제공하는 모델로 바꾸세요. 개방형 모델(MaaS)은 Vertex AI Model Garden에서 약관에 동의해야 하며 특정 리전이 필요합니다.
</Info>

## 4단계. 연결 테스트

1. 통합을 저장한 상태에서 **Connection test** 아래의 **Test connection**을 클릭합니다.
2. SecureAI는 **실제 트래픽이 사용할 것과 같은 경로로**(게이트웨이, 정책, 영수증 포함) 각 기본 모델에 최소한의 요청을 보내고, 각 결과를 지연 시간과 함께 표시합니다.

   <div class="mac-window">
   ![연결 테스트 결과](/img/cloud/vertex-ai-inference/7%20-%20Vertex%20AI%20Inference.png)
   </div>

3. 모델이 실패하면 패널에 이유가 표시됩니다. 이 페이지 끝의 **문제 해결** 섹션을 참조하세요.

### ID가 할 수 있는 다른 작업

테스트는 연결의 ID가 프로젝트에서 그 밖에 무엇을 할 수 있는지도 `projects:testIamPermissions`와 추론 경로와 같은 토큰으로 확인합니다. 추가 역할이 필요 없으며 아무것도 변경하지 않습니다. 패널에는 다음 알림 중 하나가 표시됩니다.

| 패널 알림 | 의미 |
|-----------|------|
| *Permissions: roles/aiplatform.user — it can call models and also deploy or delete Vertex AI resources, and none of the permissions outside AI that SecureAI checks.* | `roles/aiplatform.user`라면 예상된 결과입니다. |
| *Least privilege: this identity can call models and nothing else that SecureAI checked.* | `roles/aiplatform.user`의 배포 권한조차 없습니다(예: 커스텀 역할). |
| *This identity can do much more than call models: …* (경고, 권한 목록 포함) | IAM 정책 변경, 서비스 계정 키 생성, Storage·BigQuery·Secret Manager 데이터 읽기 등 AI 외부의 권한이 있습니다. 활동 로그에 테스트가 경고로 기록됩니다. 서비스 계정에는 `roles/aiplatform.user`만 부여하세요. |
| *Could not check what else this identity can do in the project …* | Google이 응답하지 않았습니다. 예를 들어 Cloud Resource Manager API가 사용 중지되어 있습니다. |

<Info>
테스트는 1토큰짜리 요청을 몇 개 보내며, **Google 계정에 청구됩니다**(몇 센트).
</Info>

## 5단계. 라우팅 검토 및 사용 설정

1. **Routing preview → Show which lane serves each model**을 엽니다. 카탈로그의 모든 모델에 대해 **내 Vertex**가 처리할지(어떤 Vertex 모델로 처리하는지 포함) **SecureAI**가 처리할지, 그리고 어떤 모델이 **사용자에게 숨겨지는지** 보여 줍니다. 미리보기는 통합이 켜진 상태를 시뮬레이션하므로 사용 설정하기 전에 효과를 검토할 수 있습니다.
2. 테스트를 통과하면 **Route traffic to Vertex AI**를 켜고 **Save**를 다시 클릭합니다. **저장하지 않으면 스위치가 켜진 상태로 유지되지 않습니다.** 켜려면 프로젝트와 자격 증명이 구성되어 있어야 합니다. 플랜에서 클라우드 공급자를 더 허용하지 않거나 라우팅이 다른 공급자와 겹치면 SecureAI는 이를 거부하고 이유를 설명합니다(위의 **사용할 수 있는 클라우드 공급자 수** 참조).

   <div class="mac-window">
   ![켜진 Route traffic to Vertex AI 스위치](/img/cloud/vertex-ai-inference/8%20-%20Vertex%20AI%20Inference.png)
   </div>
3. 카드가 녹색 **Routing to Vertex**로 바뀝니다. 저장되었지만 꺼져 있으면 황색 **Configured · not routing to Vertex**가 표시됩니다.

변경 사항은 저장한 서버에 즉시 적용되고, 다른 서버에는 최대 30초 이내에 적용됩니다.

## 6단계. 모델 선택기에서 확인

통합이 활성화되면 내 Vertex에서 실행되는 모델은 채팅 모델 선택기에서 이름 옆에 **Google Cloud 로고**가 표시됩니다. 로고 위에 마우스를 올리면 해당 모델이 조직의 Vertex AI 계정에서 실행된다고 안내합니다.

<div class="mac-window">

![Google Cloud 로고가 표시된 모델 선택기](/img/cloud/vertex-ai-inference/9%20-%20Vertex%20AI%20Inference.png)

</div>

폴백 없이 **Remap everything** 모드를 사용하면 선택기는 내 Vertex가 처리하는 모델**만** 제공합니다. 대응 모델이 없는 모델은 선택한 모델과 다른 모델이 응답하게 되므로 숨겨집니다.

## 청구되는 항목과 청구 대상

- **LLM 사용량은 SecureAI가 아니라 Google이 내 계정에 청구합니다.** 할인과 CUD가 적용된 요금이 Google Cloud 결제에 표시됩니다.
- SecureAI는 Vertex에서 처리된 턴의 비용을 분석 용도로만 **정가 기준 추정치**로 표시합니다. 참고용이며 할인이 **포함되지 않으므로** Google의 실제 금액은 더 낮을 수 있습니다.
- 내 Vertex에서 처리된 턴은 **Apply each seat's spend cap to turns served in your account**를 켜지 않는 한 **각 사용자의 시트 지출 한도에 포함되지 않습니다**. **시트 수준**은 계속 적용됩니다. 내 Vertex가 처리하더라도 사용자는 자신의 수준 이하의 모델만 사용할 수 있습니다.
- **Govern BYO** 시트는 조직 자체 인프라에서 처리되는 모델만 사용할 수 있습니다. 즉, 내 Vertex(또는 연결된 다른 클라우드 공급자)가 처리하는 모델과 자체 서버의 자체 호스팅 모델입니다. 그 밖의 모델은 거부되며, 선택기도 이 시트에 **Auto**를 제공하지 않습니다.

## 보안 및 컴플라이언스

- **암호화된 자격 증명, 또는 자격 증명 없음.** 옵션 A에서는 서비스 계정 키가 암호화(AES-256-GCM)되어 저장되며, 관리자에게도 브라우저로 반환되지 않습니다. 화면에는 계정의 이메일만 표시됩니다. 옵션 B에서는 키가 저장되지 않습니다. SecureAI가 서비스 계정으로 작업하는 단기 토큰을 Google에 요청합니다.
- **경로는 계속 보호됩니다.** 모든 호출은 SecureAI의 SMLTP 게이트웨이를 거칩니다. DLP, 요청별 서명된 승인 토큰, 검증 가능한 **서명된 영수증**이 적용됩니다.
- **데이터 상주.** 리전을 고정하면(예: `europe-west4`) SecureAI는 각 요청을 해당 리전의 엔드포인트로 보내고 조직의 상주 정책을 적용합니다. Google이 요청을 어디에서 처리하는지는 Google의 데이터 상주 약정에 따라 다릅니다.
- **실패 시 차단.** 구성을 읽을 수 없거나 Google의 토큰을 얻을 수 없으면 요청이 거부됩니다. 폴백을 허용하지 않은 한 다른 공급자로 보내지 않습니다.
- **감사.** 통합을 저장, 테스트 또는 연결 해제하면 변경된 필드 이름과 함께 활동 로그에 기록되며, 키는 절대 기록되지 않습니다.
- **최소 권한 확인.** 연결 테스트는 연결의 ID가 프로젝트에서 그 밖에 무엇을 할 수 있는지 확인하고, AI 외부의 권한이 있으면 경고합니다(4단계의 **ID가 할 수 있는 다른 작업** 참조).
- **최소 권한.** 추론에는 `roles/aiplatform.user`로 충분하며, 통합은 IAM이나 결제를 읽을 필요가 없습니다.

## 연결 해제

**Disconnect**(패널 하단)는 구성과 저장된 키를 삭제합니다. 그 순간부터 **모든 트래픽이 SecureAI 관리 공급자로 돌아갑니다**. 연결을 유지한 채 라우팅만 일시 중지하려면 **Route traffic to Vertex AI** 스위치만 끌 수도 있습니다.

그런 다음 Google Cloud에서도 액세스를 제거하세요.

- **옵션 A:** 키를 더 이상 사용하지 않는다면 **취소**하세요(서비스 계정 → 키).
- **옵션 B:** 서비스 계정에서 SecureAI 서비스 계정에 부여한 `roles/iam.serviceAccountTokenCreator` 역할을 제거하세요(서비스 계정 → 내 계정 → **권한**).

## 문제 해결

**Test connection**에 표시될 수 있는 이유는 다음과 같습니다.

| 이유 | 가능한 원인 | 해결 방법 |
|------|-------------|-----------|
| Credential rejected or not usable | JSON이 불완전하거나 잘못되었거나 키가 취소되었습니다. 키 없음: SecureAI 계정에 서비스 계정에 대한 `roles/iam.serviceAccountTokenCreator`가 없거나 이메일에 오타가 있습니다 | JSON 전체를 다시 붙여넣거나 새 키를 만드세요. 키 없음: 패널에 표시되는 명령을 실행하고 이메일을 확인하세요. |
| Not authenticated | Google이 토큰을 거부했습니다 | 서비스 계정이 존재하고 활성 상태인지 확인하세요. |
| Vertex AI API is not enabled on the project | 1단계의 1번 항목이 누락되었습니다 | 프로젝트에서 **Agent Platform API(Vertex AI API)**(`aiplatform.googleapis.com`)를 사용 설정하세요. |
| Missing roles/aiplatform.user | 권한이 부족합니다 | 해당 프로젝트에서 서비스 계정에 **Agent Platform User** 역할(`roles/aiplatform.user`)을 부여하세요. |
| Model not available in this location | 선택한 리전에 모델이 없거나, Model Garden에서 약관에 동의하지 않은 개방형 모델입니다 | 리전이나 해당 기본 모델을 변경하세요. 개방형 모델은 Model Garden에서 약관에 동의하세요. |
| Quota exceeded | Vertex 할당량이 소진되었습니다 | 프로젝트의 할당량을 검토하거나 Google에 할당량 증가를 요청하세요. |
| Google returned an error | Google 측 장애입니다 | 다시 시도하세요. 계속되면 Google Cloud 상태를 확인하세요. |
| Blocked by your SMLTP model policy | SecureAI의 정책이 해당 모델을 허용하지 않습니다 | 허용 정책에 모델을 추가하세요. |
| SMLTP Vertex gateway unreachable / TLS error | SecureAI 인프라 문제입니다 | 지원팀에 문의하세요. Google 프로젝트와는 관계가 없습니다. |
| Unexpected error | SecureAI가 분류할 수 없는 장애입니다 | 다시 시도하세요. 계속되면 패널에 표시된 메시지와 함께 지원팀에 문의하세요. |
| No default models configured | 기본 모델 네 개가 모두 비어 있어 테스트할 대상이 없습니다 | **Default Vertex models**에서 하나 이상을 입력하고 저장한 다음 다시 테스트하세요. |

사용자가 채팅에서 볼 수 있는 오류:

| 코드 | 의미 |
|------|------|
| `SAI-VERTEX-001` | 선택한 모델에 Vertex 대응 모델이 없고 폴백이 꺼져 있습니다. 다른 모델을 선택하거나 폴백을 허용하세요. |
| `SAI-VERTEX-002` | Google 액세스를 얻을 수 없습니다(키가 잘못되었거나 취소되었거나, 키 없음 방식에서 가장 권한이 제거됨). 자격 증명을 갱신하세요. |
| `SAI-VERTEX-005` | 구성을 읽을 수 없어 안전을 위해 요청이 거부되었습니다. 몇 초 후에 다시 시도하세요. |

## 현재 제한 사항

- **Vertex의 Claude와 Mistral**은 지원되지 않습니다(다른 API를 사용함).
- **임베딩, 재순위화, OCR, 관리자 어시스턴트, 이미지 생성, 실시간 음성**은 SecureAI 관리 공급자에 남습니다.
- 조직당 **Vertex 프로젝트와 위치는 하나**입니다.
- 동시에 사용 설정할 수 있는 추론 공급자 수는 플랜에 따라 다릅니다(Scale: 1개, Enterprise: 최대 3개). [Azure AI Foundry — Inference on your account](/en/integrations/cloud/azure-ai-foundry-inference) 및 [Amazon Bedrock — Inference on your account](/en/integrations/cloud/aws-bedrock-inference)를 참조하세요.
- **Claude Code** 프록시는 Anthropic을 직접 사용하며 Vertex를 거치지 않습니다.

## 관련

- [Google Cloud — 디스커버리](/ko/integrations/cloud/gcp-vertex-ai) — 프로젝트의 에이전트, 모델, ID, 비용 인벤토리.
- [Azure AI Foundry — Inference on your account](/en/integrations/cloud/azure-ai-foundry-inference)
- [Amazon Bedrock — Inference on your account](/en/integrations/cloud/aws-bedrock-inference)
- [클라우드 AI 제공업체 개요](/ko/integrations/cloud/overview)
- [서명된 영수증](/ko/api/receipts)
