---
sidebar_position: 6
title: "Google Cloud — 디스커버리"
sidebar_label: "Google Cloud — 디스커버리"
description: "SecureAI가 Vertex AI 에이전트, 모델, 서비스 계정, 키, IAM, 사용량, 비용을 인벤토리화할 수 있도록 Google Cloud를 연결하세요 — 단일 프로젝트 또는 조직 전체에서."
---

# Google Cloud — 디스커버리

SecureAI가 Vertex AI 에이전트, 엔드포인트, 모델과 함께 이를 둘러싼 서비스 계정, 키, IAM 바인딩, 감사 로그, 사용량, 비용을 인벤토리화할 수 있도록 Google Cloud 프로젝트(또는 조직이나 폴더 전체)를 연결하세요.

<Info>
이 카드는 프로젝트를 **읽기만** 하며 프롬프트를 보내지 않습니다. SecureAI의 LLM 트래픽을 자체 Google Cloud 계정에서 실행하려면 [Google Vertex AI — 내 계정에서 추론](/ko/integrations/cloud/vertex-ai-inference)을 참조하세요.
</Info>

## SecureAI가 가져오는 것

- **Vertex AI**: 에이전트(Agent Engine), 서빙 엔드포인트, 실행 중인 배치 및 튜닝 작업, 모델 — Model Registry와 사용 중인 모든 게시자 모델(Gemini, Claude, 개방형 모델).
- **Agent Builder / Gemini Enterprise 및 Dialogflow CX**(선택 사항): Agent Builder(Discovery Engine) 엔진과 그 데이터 스토어(`global`, `us`, `eu` 위치에서 조회), 그리고 Dialogflow CX 에이전트(`global` 및 구성한 Vertex AI 위치에서 조회).
- 최근 30일간 **모델별 사용량**: 요청 수(및 실패한 요청 수), 입력 및 출력 토큰, 프롬프트 캐시 토큰.
- 최근 30일간 **자격 증명별 사용량**(Cloud Monitoring): 각 서비스 계정과 각 API 키의 전체 요청 수 및 AI API(Vertex AI, Gemini API, Agent Builder, Dialogflow)에 대한 요청 수. OAuth 클라이언트 트래픽(사람, 그리고 콘솔이나 `gcloud` 같은 도구)은 별도로 합산됩니다. 이 데이터로 해당 계정과 키의 마지막 사용도 알 수 있습니다.
- **모델 및 ID별 사용량**(선택 사항): 어떤 서비스 계정이나 사람이 어떤 Vertex AI 모델을 호출했는지로, 데이터 액세스 감사 로그를 사용 설정한 경우 이 로그에서 가져옵니다. [모델 및 ID별 사용량](#모델-및-id별-사용량)을 참조하세요.
- **SecureAI 외부에서 사용된 Vertex AI**: SecureAI의 추론 연결을 거치지 않고 Vertex AI 또는 Gemini를 직접 호출한 ID. [SecureAI 외부에서 사용된 Vertex AI](#secureai-외부에서-사용된-vertex-ai)를 참조하세요.
- 최근 30일간 **비용**: BigQuery 결제 내보내기에서 가져온 이 프로젝트의 실제 AI 지출, 또는 정가 기준 추정치.
- **NHI**: 서비스 계정, 사용자 관리 서비스 계정 키, API 키, Workload Identity Federation 풀 및 공급자, OAuth 클라이언트 — 각각의 마지막 사용(Policy Analyzer 및 자격 증명별 사용량 기준)과 [권한 위험](#권한-위험) 포함. [NHI 인벤토리](/ko/discovery/nhi-inventory)에서 수동으로 또는 [자동 정책](#자동-nhi-정책)으로 취소하고 복원할 수 있습니다.
- 프로젝트의 **IAM** 역할 바인딩.
- AI 및 ID 서비스(Vertex AI, IAM, IAM Credentials, STS, API Keys, Resource Manager)의 **Cloud 감사 로그**: 최근 30일간의 최신 이벤트 200개.

기본적으로 커넥터는 **프로젝트 하나**를 읽습니다. **Organization or folder** 필드를 사용하면 조직이나 폴더의 모든 활성 프로젝트를 읽습니다. [조직 또는 폴더 모드](#조직-또는-폴더-모드)를 참조하세요.

## 전제 조건

### 필요한 API

SecureAI는 각 영역을 해당 Google API로 읽습니다. 프로젝트에서 다음 API를 사용 설정하세요(**API 및 서비스 → 라이브러리** 또는 `gcloud services enable`).

| API | 용도 | |
|-----|------|---|
| `cloudresourcemanager.googleapis.com` | 프로젝트와 그 IAM 바인딩 | 필수 |
| `iam.googleapis.com` | 서비스 계정, 키, Workload Identity, OAuth 클라이언트 | 필수 |
| `aiplatform.googleapis.com` | Vertex AI 에이전트, 엔드포인트, 작업, 모델 | 필수 |
| `apikeys.googleapis.com` | API 키 | 권장 |
| `monitoring.googleapis.com` | 모델별 및 자격 증명별 사용량 | 권장 |
| `logging.googleapis.com` | 감사 로그 및 데이터 액세스 로그 | 권장 |
| `policyanalyzer.googleapis.com` | 키와 서비스 계정의 마지막 사용(Policy Analyzer) | 선택 |
| `bigquery.googleapis.com` | 결제 내보내기를 사용하는 경우 실제 비용(쿼리를 실행하는 프로젝트에서) | 선택 |
| `cloudasset.googleapis.com` | 조직 또는 폴더 모드(서비스 계정의 프로젝트에서) | 해당 모드에서만 |
| `discoveryengine.googleapis.com` | Agent Builder / Gemini Enterprise | 해당 제품을 사용하는 경우 |
| `dialogflow.googleapis.com` | Dialogflow CX 에이전트 | 해당 제품을 사용하는 경우 |

사용 중지된 API가 있어도 동기화는 실패하지 않습니다. 해당 서비스 이름과 함께 **API disabled in the project — enable it** 누락 항목으로 표시됩니다. Agent Builder와 Dialogflow는 예외입니다. 이들의 API가 꺼져 있으면 SecureAI는 프로젝트가 해당 제품을 사용하지 않는 것으로 간주하고 누락 항목으로 표시하지 않습니다.

### 역할

SecureAI가 사용하는 서비스 계정이 필요합니다. 이 계정에 **프로젝트에 대해** 다음 역할을 부여하세요(**IAM 및 관리자 → IAM → 액세스 권한 부여**).

| 역할 | 사용할 수 있게 되는 것 | |
|------|------------------------|---|
| `roles/aiplatform.viewer` | Vertex AI 에이전트, 엔드포인트, 작업, 모델 | 필수 |
| `roles/iam.securityReviewer` | 서비스 계정, 키, API 키, Workload Identity, OAuth 클라이언트, IAM 바인딩 | 필수 |
| `roles/monitoring.viewer` | 모델별 사용량(요청 및 토큰)과 자격 증명별 사용량 | 권장 |
| `roles/logging.viewer` | Cloud 감사 로그 | 권장 |
| `roles/policyanalyzer.activityAnalysisViewer` | 각 키와 서비스 계정의 마지막 사용 | 선택 |
| `roles/logging.privateLogViewer` | 모델 및 ID별 사용량: 데이터 액세스 로그는 비공개 로그이며 `roles/logging.viewer`로는 읽을 수 없습니다 | 선택 |
| `roles/discoveryengine.viewer` | Agent Builder / Gemini Enterprise 엔진 | 선택 |
| `roles/dialogflow.reader` | Dialogflow CX 에이전트 | 선택 |

**실제 비용**을 확인하려면 Cloud Billing 데이터가 [BigQuery로 내보내기](https://cloud.google.com/billing/docs/how-to/export-data-bigquery?hl=ko)되어 있어야 하며, 서비스 계정에는 내보내기 데이터 세트에 대한 `roles/bigquery.dataViewer`와 쿼리를 실행하는 프로젝트에 대한 `roles/bigquery.jobUser`가 필요합니다.

**SecureAI에서 취소 및 복원**하려면(선택 사항) 허용하려는 각 작업의 역할이 필요합니다. 배포에서 키 없는 액세스를 제공한다면 이 역할을 [취소용 별도 서비스 계정](#취소용-별도-서비스-계정)에 부여하고 읽기용 계정에는 읽기 전용 역할만 유지하세요. 그렇지 않으면 커넥터의 서비스 계정에 부여하세요.

| 작업 | 역할 |
|------|------|
| 서비스 계정 사용 중지(또는 다시 사용 설정) | `roles/iam.serviceAccountAdmin` |
| 서비스 계정 키 삭제 | `roles/iam.serviceAccountKeyAdmin` |
| API 키 삭제(또는 복원) | `roles/serviceusage.apiKeysAdmin` |
| Workload Identity 풀 또는 공급자 사용 중지(또는 다시 사용 설정) | `roles/iam.workloadIdentityPoolAdmin` |
| OAuth 클라이언트 사용 중지(또는 다시 사용 설정) | `roles/iam.oauthClientAdmin` |

<Note>
`roles/billing.viewer`는 **필요하지 않습니다**. 이 역할은 결제 계정 역할이므로 프로젝트에 부여할 수 없으며, 커넥터도 사용하지 않습니다.
</Note>

어떤 것도 조용히 건너뛰지 않습니다. SecureAI가 읽을 수 없는 항목은 이를 해결하는 역할과 함께 표시됩니다 — 연결할 때, 각 동기화 후, 그리고 GCP 패널에서.

## 자격 증명

| 필드 | 필수 | 설명 |
|------|------|------|
| **Google Cloud Project ID** (`projectId`) | 예 | 프로젝트 **ID**(예: `my-project-123`) — 프로젝트 이름이나 번호가 아닙니다. 조직 모드에서는 할당량 및 결제 프로젝트입니다. |
| **Vertex AI Location** (`location`) | 예 | 에이전트와 엔드포인트가 있는 Vertex AI 위치(예: `us-central1`, `europe-west4`, `global`). 사용량과 비용은 모든 위치를 포함합니다. |
| **More Vertex AI Locations** (`locations`) | 아니요 | 쉼표로 구분한 여러 위치(최대 10개). 위의 위치보다 우선합니다. |
| **Service Account JSON** (`serviceAccountJson`) | 둘 중 하나 | 서비스 계정 키 JSON. 저장 시 암호화됩니다. |
| **Service account to impersonate** (`impersonateServiceAccount`) | 둘 중 하나 | 키 없음: SecureAI가 가장하는 서비스 계정의 이메일. 배포에서 키 없는 액세스를 제공하는 경우에만 표시됩니다. |
| **Service account for revocation** (`revokeImpersonateServiceAccount`) | 아니요 | ID를 취소하거나 복원할 때만 사용하고 읽기에는 사용하지 않는 두 번째 서비스 계정. 배포에서 키 없는 액세스를 제공하는 경우에만 표시됩니다. |
| **Organization or folder** (`scope`) | 아니요 | `organizations/<number>` 또는 `folders/<number>`: 그 안의 모든 활성 프로젝트를 읽습니다. |
| **BigQuery Billing Export Table** (`billingExportTable`) | 아니요 | 결제 내보내기의 `project.dataset.table`(예: `my-billing.billing_export.gcp_billing_export_v1_XXXXXX`). |
| **BigQuery Billing Project ID** (`billingProjectId`) | 아니요 | BigQuery 쿼리를 실행하는 프로젝트. 기본값은 테이블의 프로젝트이며, `dataset.table` 형식의 이름은 이 프로젝트(비어 있으면 프로젝트 ID)에서 찾습니다. |

### 얻는 방법

**옵션 A — JSON 키**

1. [Google Cloud 콘솔](https://console.cloud.google.com/)에서 **IAM 및 관리자 → 서비스 계정 → 서비스 계정 만들기**로 이동합니다(예: `secureai-discovery`).
2. **IAM 및 관리자 → IAM → 액세스 권한 부여**로 이동하여 서비스 계정의 이메일을 주 구성원으로 입력하고 [전제 조건](#전제-조건)의 역할을 추가합니다.
3. 다시 **서비스 계정**에서 계정을 열고 **키 → 키 추가 → 새 키 만들기 → JSON**을 선택해 파일을 다운로드합니다.
4. JSON **전체**를 **Service Account JSON**에 붙여넣은 다음, 다운로드한 파일을 삭제합니다.

`gcloud`로 하는 방법:

```bash
PROJECT=my-project-123
gcloud services enable cloudresourcemanager.googleapis.com iam.googleapis.com aiplatform.googleapis.com \
  apikeys.googleapis.com monitoring.googleapis.com logging.googleapis.com policyanalyzer.googleapis.com \
  --project=$PROJECT
gcloud iam service-accounts create secureai-discovery --project=$PROJECT --display-name="SecureAI discovery"
SA=secureai-discovery@$PROJECT.iam.gserviceaccount.com
for ROLE in roles/aiplatform.viewer roles/iam.securityReviewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
# 선택 사항: 마지막 사용, 모델 및 ID별 사용량, Agent Builder, Dialogflow CX
for ROLE in roles/policyanalyzer.activityAnalysisViewer roles/logging.privateLogViewer roles/discoveryengine.viewer roles/dialogflow.reader; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud iam service-accounts keys create secureai-discovery.json --iam-account=$SA
```

Agent Builder나 Dialogflow CX를 사용 중이라면 해당 API는 이미 프로젝트에서 사용 설정되어 있으므로 SecureAI를 위해 따로 사용 설정할 필요가 없습니다.

<Warning>
Google에서 서비스 계정 키 생성이 사용 중지되었다고 응답하면, 조직에 `iam.disableServiceAccountKeyCreation` 정책이 적용되어 있는 것입니다 — 2024년 이후 생성된 조직의 기본값입니다. 옵션 B를 사용하거나 조직 관리자에게 이 프로젝트에 대한 예외를 요청하세요.
</Warning>

**옵션 B — 키 없음(가장)**

1. 서비스 계정을 만들고 역할을 부여합니다(위의 1단계와 2단계).
2. SecureAI 연결 양식에서 **Service account to impersonate (keyless — instead of the JSON)** 필드의 도움말 텍스트에 승인해야 할 SecureAI 계정이 표시됩니다. Google Cloud에서 서비스 계정을 열고 **권한 → 액세스 권한 부여**에서 해당 계정을 주 구성원으로 입력한 뒤 `roles/iam.serviceAccountTokenCreator`를 부여합니다. `gcloud`로 하는 방법:

   ```bash
   gcloud iam service-accounts add-iam-policy-binding $SA \
     --member=serviceAccount:SECUREAI_ACCOUNT --role=roles/iam.serviceAccountTokenCreator
   ```

3. 필드에 서비스 계정의 이메일을 입력하고 JSON은 비워 둡니다.

필드가 표시되지 않으면 배포에서 키 없는 액세스를 제공하지 않는 것입니다. 옵션 A를 사용하세요.

### 취소용 별도 서비스 계정

배포에서 키 없는 액세스를 제공한다면 읽기와 취소를 분리할 수 있습니다. 읽기용 서비스 계정에 취소 역할을 부여하는 것보다 이 방법을 권장합니다.

1. 두 번째 서비스 계정(예: `secureai-revoke`)을 만들고 [전제 조건](#전제-조건)의 취소 역할**만** 부여합니다.
2. 이 계정에서 **Service account for revocation (optional — separate from reading)** 필드의 도움말 텍스트에 표시된 SecureAI 계정에 `roles/iam.serviceAccountTokenCreator`를 부여합니다.
3. 해당 필드에 이 계정의 이메일을 입력합니다.

SecureAI는 ID를 취소하거나 복원하는 동안에만 이 계정에서 1시간짜리 토큰을 요청하며, 동기화에는 절대 사용하지 않습니다. 읽기용 서비스 계정은 읽기 전용 역할을 유지합니다. 또한 SecureAI는 인벤토리에서 취소용 계정을 취소하는 것을 거부합니다.

## 조직 또는 폴더 모드

커넥터 하나로 여러 프로젝트를 인벤토리화하려면 **Organization or folder**에 `organizations/<number>` 또는 `folders/<number>`를 입력합니다(예: `organizations/123456789012`).

- SecureAI는 **Cloud Asset Inventory**로 활성 프로젝트를 찾고, 각 프로젝트를 단일 프로젝트 커넥터처럼 읽습니다. **Google Cloud Project ID**는 계속 할당량 및 결제 프로젝트로 사용됩니다.
- 서비스 계정에 **조직 또는 폴더에 대해** `roles/cloudasset.viewer`, `roles/iam.securityReviewer`, `roles/aiplatform.viewer`를 부여하고, 사용량과 감사를 위해 `roles/monitoring.viewer`와 `roles/logging.viewer`도 부여합니다.
- 서비스 계정의 프로젝트에서 `cloudasset.googleapis.com`을 사용 설정합니다.

```bash
ORG=123456789012
for ROLE in roles/cloudasset.viewer roles/iam.securityReviewer roles/aiplatform.viewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud organizations add-iam-policy-binding $ORG --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud services enable cloudasset.googleapis.com --project=$PROJECT
```

폴더의 경우 `gcloud organizations add-iam-policy-binding` 대신 `gcloud resource-manager folders add-iam-policy-binding <number>`를 사용하세요.

동기화가 적절한 시간 안에 끝나도록 동기화마다 상한이 있습니다. 할당량 프로젝트가 먼저 처리되고, 그다음 Vertex AI 리소스가 있는 프로젝트가 처리됩니다.

| 항목 | 동기화당 상한 |
|------|---------------|
| 인벤토리화되는 프로젝트 | 200 |
| 할당량 프로젝트의 측정항목 범위 밖에 있는 모델별 사용량(Cloud Monitoring) | Vertex AI가 있는 프로젝트 15개 |
| 감사 로그 | 프로젝트 25개 |
| 모델 및 ID별 사용량(데이터 액세스 로그) | 프로젝트 10개 |

상한을 벗어난 부분은 읽은 양과 함께 부분 누락 항목으로 표시됩니다. 읽을 수 없는 프로젝트도 누락 항목으로 표시되며, **그 프로젝트의 어떤 것도 폐기되거나 정리되지 않습니다**. 이 모드에서 연결할 때의 테스트는 프로젝트의 첫 페이지만 나열하고 할당량 프로젝트를 확인합니다. 각 프로젝트를 읽는 것은 동기화가 담당합니다.

## 연결

1. **Admin → Integrations → Cloud → Google Cloud — 검색 → 통합 연결**.
2. 프로젝트 ID, 위치(또는 **More Vertex AI Locations**에 여러 위치), 그리고 JSON 키 또는 가장할 서비스 계정 중 하나를 입력합니다. 사용하는 경우 취소용 서비스 계정, 조직 또는 폴더, 결제 필드도 추가합니다.
3. **연결**을 클릭합니다. SecureAI는 저장하기 전에 프로젝트를 실제로 읽어 자격 증명을 확인하며, 몇 초 정도 걸립니다. 프로젝트를 읽을 수 없으면 이유를 표시하고 아무것도 저장하지 않습니다. 입력한 내용은 양식에 그대로 남습니다. 표시될 수 있는 메시지는 [문제 해결](#문제-해결)에 있습니다.
4. 저장되었지만 일부 역할이 없으면 경고에 해당 역할이 나열됩니다. 역할을 부여하고 다시 동기화하세요.
5. 카드의 새로고침 버튼으로 지금 동기화합니다. 이후 SecureAI는 6시간마다 자동으로 동기화합니다.

나중에 자격 증명을 변경하려면 **연결**을 다시 사용하세요. 비워 둔 필드는 저장된 값을 유지하며, JSON 키를 입력하면 저장된 가장 설정이 대체되고 그 반대도 마찬가지입니다.

## 확인

- [클라우드 센서](/ko/discovery/cloud-sensors)에 검색된 에이전트가 나열됩니다. Google Cloud 카드를 클릭하면 GCP 패널이 열립니다: 사용량 및 비용(요청, 실패, 토큰, 캐시, 비용과 그 출처), 모델 및 배포, ID 및 액세스(서비스 계정과 키 및 마지막 사용, IAM 바인딩), 감사.
- 패널에 **Discovery could not read everything**이 표시되면 각 줄을 검토하고([문제 해결](#문제-해결) 참조) 다시 동기화하세요.
- [NHI 인벤토리](/ko/discovery/nhi-inventory)에 서비스 계정과 키가 표시됩니다.

동기화가 실패하면(예: 키가 삭제되었거나 역할이 제거된 경우) 카드에 오류가 표시되고, SecureAI는 마지막 인벤토리를 유지한 채 백오프로 재시도합니다. 부분적인 읽기로 인해 에이전트가 폐기되거나 ID가 제거되는 일은 없습니다.

## 모델 및 ID별 사용량

Cloud Monitoring은 각 자격 증명이 요청을 몇 번 했는지는 알려 주지만, 어떤 모델에 했는지는 알려 주지 않습니다. **어떤 ID가 어떤 모델을 호출했는지** 알기 위해 SecureAI는 Vertex AI의 **데이터 액세스** 감사 로그를 읽습니다. 이는 선택 사항이며 사용 여부는 사용자가 결정합니다.

- SecureAI는 `aiplatform.googleapis.com`(또는 모든 서비스)에 대해 **DATA_READ** 또는 **DATA_WRITE** 로그가 사용 설정된 경우에만 이 로그를 읽습니다. SecureAI는 이를 IAM 정책에서 감지하며, 직접 사용 설정하지는 않습니다.
- 사용 설정하면 Google 요금에 따른 **Cloud Logging 수집 비용**이 발생합니다. **IAM 및 관리자 → 감사 로그 → Vertex AI API → 데이터 읽기**에서 사용 설정합니다.
- 서비스 계정에 `roles/logging.privateLogViewer`가 필요합니다.
- 프로젝트 및 동기화마다 SecureAI는 최대 5,000개 항목 또는 20초 동안 읽으며, 둘 중 먼저 도달하는 쪽에서 멈춥니다.
- 로그가 꺼져 있으면 패널에 사용 설정 방법을 설명하는 선택적 누락 항목이 표시됩니다. 조직이나 폴더 수준에서 사용 설정했지만 단일 프로젝트를 연결한 경우, SecureAI는 프로젝트의 정책에서 이를 볼 수 없으므로 누락 항목을 그대로 표시합니다.

## 권한 위험

IAM 정책을 읽은 후 SecureAI는 서비스 계정이 다음 역할 중 하나라도 보유하면 **권한 있음**으로 표시합니다.

- 소유자(`roles/owner`) 또는 편집자(`roles/editor`)
- 모든 관리자 역할(`roles/<service>.admin` 또는 `Admin`으로 끝나는 역할)
- 보유자가 다른 서비스 계정으로 작업할 수 있게 해 주는 `roles/iam.serviceAccountTokenCreator` 또는 `roles/iam.serviceAccountUser`

권한 있는 서비스 계정의 사용자 관리 키는 이 표시를 상속합니다. 키를 가진 사람은 그 권한을 갖기 때문입니다. **제한 없는** API 키(API 대상 제한도, 애플리케이션 제한도 없는 키)도 표시됩니다. [NHI 인벤토리](/ko/discovery/nhi-inventory)에서는 위험 요소 중 **Privileged (admin role or impersonation)** 및 **API key without restrictions**로 나타납니다. IAM 정책을 읽을 수 없었다면 SecureAI는 계정을 권한 없음으로 취급하는 대신 아무것도 표시하지 않습니다.

## SecureAI 외부에서 사용된 Vertex AI

GCP 패널의 **Identity & Access** 탭에는 **Vertex AI used outside SecureAI**가 포함됩니다. 지난 30일 동안 [Vertex AI 추론](/ko/integrations/cloud/vertex-ai-inference) 연결을 거치지 않고 Vertex AI 또는 Gemini를 직접 호출한 ID 목록입니다. 이 프롬프트는 DLP, 정책, 서명된 영수증을 거치지 않았습니다.

- 데이터 액세스(Data Access) 감사 로그가 켜져 있으면([모델 및 ID별 사용량](#모델-및-id별-사용량) 참조) 각 행에 호출한 모델과 횟수가 표시되며, 추론 호출만 집계됩니다.
- 꺼져 있으면 숫자는 자격 증명(서비스 계정 또는 API 키)별 Cloud Monitoring 값이며, 추론뿐 아니라 AI API(Vertex AI, Gemini API, Agent Builder, Dialogflow)에 대한 모든 호출이 포함됩니다.
- 추론 연결의 서비스 계정과 커넥터의 서비스 계정은 집계하지 않습니다. 사람은 한 명씩 나열하지 않으며, 그 호출은 하나의 집계 행에 들어갑니다(**People (Google accounts)** 또는 **People and tools (OAuth)**: 콘솔, gcloud, 앱).
- 해당 동기화에서 SecureAI가 추론 연결을 읽지 못하면 아무것도 분류하지 않고, 이를 선택 사항 누락 항목으로 표시하며, 이전 동기화의 결과를 유지합니다.
- Insights 발견 사항 **Google Vertex AI / Gemini is being used outside SecureAI**를 생성합니다. 심각도는 중간이며, 호출자가 API 키(수명이 긴 자격 증명)이면 심각입니다. OWASP LLM02, ISO/IEC 42001 A.4.2 및 A.6.2.6, NIST AI RMF MAP-1.1 및 GOVERN-6.1에 매핑됩니다.

## 비용

- **결제 내보내기 테이블 사용 시**: AI 서비스(Vertex AI, Gemini API, Agent Builder, Dialogflow 등)에 대한 이 프로젝트의 실제 지출로, 크레딧을 차감한 금액이며 결제 계정의 통화로 표시됩니다. 크레딧이 사용량을 충당하면 순액이 0일 수 있으며, 이 경우 패널에 크레딧 적용 전 금액이 함께 표시됩니다. Google은 몇 시간의 지연을 두고 내보내기를 업데이트합니다.
- **사용하지 않을 시**: 추정치 — Cloud Monitoring의 토큰 × 정가이며, Claude와 프롬프트 캐시 토큰도 포함합니다. 할인이나 약정 사용 계약은 반영되지 않습니다.

## 취소 및 복원

커넥터 또는 취소용 서비스 계정에 해당 작업의 역할이 있으면([전제 조건](#전제-조건) 참조) GCP ID를 [NHI 인벤토리](/ko/discovery/nhi-inventory)(자물쇠)에서 취소할 수 있습니다. 각 항목이 Google에서 어떻게 처리되는지는 다음과 같습니다.

| ID | Google에서 일어나는 일 | 되돌릴 수 있음 |
|----|------------------------|----------------|
| 서비스 계정 | 사용 중지됨 | 예 — **Restore**로 다시 사용 설정 |
| 서비스 계정 키 | 삭제됨 | 아니요 — Google이 키를 폐기합니다. 새 키를 만드세요 |
| API 키 | 삭제됨 | 예, 30일 동안 — **Restore**로 되돌림. 이후에는 Google이 더 이상 보관하지 않습니다 |
| Workload Identity 풀 / 공급자, OAuth 클라이언트 | 사용 중지됨 | 예 — **Restore**로 다시 사용 설정 |

취소를 되돌리려면 NHI 인벤토리에서 ID의 메뉴를 열고 **Restore**(*Undo the revocation at Google Cloud*)를 선택합니다. ID는 Google Cloud에서 다시 사용 설정되고, SecureAI에서는 차단이 해제되어 검토할 때까지 **In remediation** 상태로 유지됩니다.

- **SecureAI가 Google Cloud에서 취소한** 항목만 복원할 수 있습니다(수동이든 자동 정책을 통해서든). SecureAI 게이트웨이에서만 차단한 경우나 팀이 Google Cloud에서 직접 사용 중지한 ID에는 제공되지 않습니다.
- 삭제된 서비스 계정 키는 복원할 수 없습니다. SecureAI는 Google을 호출하지 않고 거부합니다.
- 복원에는 취소와 같은 역할이 사용됩니다.

보호 장치:

- 커넥터가 사용하는 서비스 계정과 그 키는 SecureAI에서 취소할 수 없습니다 — 취소하면 디스커버리가 중단되기 때문입니다. 취소용 서비스 계정도 마찬가지입니다. Google Cloud에서 순환하세요.
- [Vertex AI 추론](/ko/integrations/cloud/vertex-ai-inference) 연결이 인증에 사용하는 서비스 계정과 서명에 사용하는 키도 취소할 수 없습니다. 취소하면 거버넌스가 적용되는 모든 호출이 중단됩니다. 키 없는(가장) 옵션에서는 서비스 계정만 보호됩니다. SecureAI는 어떤 키로도 서명하지 않으므로 해당 키는 취소할 수 있습니다. SecureAI가 추론 연결이 사용하는 ID를 확인할 수 없으면 서비스 계정이나 서비스 계정 키를 취소하지 않습니다(API 키는 영향을 받지 않습니다).
- Google의 기본 서비스 계정(Compute Engine 기본 계정, App Engine, Cloud Build, 서비스 에이전트)은 두 번째 확인을 요청합니다. 이 중 하나를 사용 중지하면 해당 계정으로 실행되는 모든 VM, 앱, 빌드가 중지됩니다.
- 커넥터에 어떤 작업의 역할이 없으면 오류에 해당 역할이 표시됩니다.

## 자동 NHI 정책

**자동 NHI 정책**(NHI 인벤토리 → **Automatic policies**)은 Google Cloud ID를 하나씩 검토하지 않고 규칙에 따라 알리거나 취소합니다. 커넥터의 동기화가 성공할 때마다 마지막에 해당 커넥터의 ID에 대해서만 평가됩니다.

| 규칙 | Google Cloud에서 | 기본 임곗값 |
|------|------------------|-------------|
| **Unused SA key / IAM access key** | N일 동안 인증하지 않은 서비스 계정 키. 마지막 사용이 알려진 경우에만 작동하며, 사용 기록이 없는 키는 건드리지 않습니다. | 90일 |
| **Old SA key / IAM access key** | 사용 여부와 관계없이 N일보다 전에 만든 서비스 계정 키. | 365일 |
| **Unrestricted API key** | 애플리케이션 제한도, API 대상 제한도 없는 API 키. | — |
| **Privileged SA with a user key** | [권한 있는](#권한-위험) 서비스 계정의 사용자 관리 키. | — |

각 규칙에는 **Off**, **Alert**, **Revoke**의 세 가지 모드가 있습니다. 모두 꺼진 상태로 시작합니다. 보호 장치는 다음과 같습니다.

- **Simulation mode (dryRun)** 모드는 기본적으로 켜져 있습니다. 켜져 있으면 **Revoke**로 설정된 규칙도 아무것도 차단하지 않고 수행할 작업을 나열하기만 합니다. 이 모드를 끄는 것만이 실제 차단을 가능하게 합니다. **Simulate with this configuration**은 저장하기 전에 효과를 보여 줍니다.
- **Revocation cap per run**: 기본값 5(1~50). 한 번의 실행에서 **Revoke** 규칙이 상한보다 많은 ID와 일치하면 아무것도 차단하지 않고 알림을 보냅니다.
- **Exclusions**: 소유자, 이름 또는 리소스가 패턴과 일치하는 ID에는 어떤 규칙도 작동하지 않습니다. 와일드카드는 `*`만 사용할 수 있습니다.
- 완전한 키 목록만 평가됩니다.
- SecureAI가 사용하는 자격 증명(커넥터의 자격 증명, 취소용 계정, Vertex AI 추론 자격 증명)은 절대 차단되지 않습니다. Google 기본 서비스 계정의 키는 자동으로 차단되지 않습니다. 규칙은 알림만 보내고 사람이 결정합니다.

Google Cloud에서 서비스 계정 키를 취소하면 키가 **삭제**되며(복원 불가), API 키를 취소하면 삭제되지만 30일 동안 복원할 수 있습니다. 모든 작업은 감사되고 알림이 전송됩니다.

## 문제 해결

### 연결할 때

테스트가 실패하면 **연결**은 다음 메시지 중 하나를 표시하고 아무것도 저장하지 않습니다.

| 메시지 | 원인 | 해결 방법 |
|--------|------|-----------|
| `"My Project" is not a GCP project ID (use the ID, e.g. my-project-123 — not the project name or number).` | 프로젝트 이름이나 번호를 입력했습니다 | 콘솔의 프로젝트 선택기에서 프로젝트 **ID**를 복사하세요. |
| `<account> cannot read GCP project "<id>": it does not exist, or the service account has no role on it. Check the project ID and grant roles/aiplatform.viewer and roles/iam.securityReviewer on the project.` | ID가 존재하지 않거나, 서비스 계정에 해당 프로젝트의 역할이 없습니다 | ID를 확인하고 프로젝트에 대해 필수 역할 두 가지를 부여하세요. |
| `Vertex AI location "mars-central9" is not reachable (no such endpoint (HTTP 404)). Check the location (e.g. us-central1, europe-west4, global).` | 위치가 존재하지 않습니다(예: 오타) | 위치를 수정하세요. |
| `The Cloud Asset API is not enabled for <account>'s project. Enable cloudasset.googleapis.com and retry.` | Cloud Asset API 없이 조직 모드를 사용했습니다 | 서비스 계정의 프로젝트에서 `cloudasset.googleapis.com`을 사용 설정하세요. |
| `<account> cannot list the projects of organizations/<number>. Grant roles/cloudasset.viewer and roles/iam.securityReviewer on the organization …` | 조직 또는 폴더에 대한 역할 없이 조직 모드를 사용했거나, 번호가 잘못되었습니다 | 조직 또는 폴더에 대해 역할을 부여하거나, 프로젝트만 읽으려면 필드를 비우세요. |

### 패널의 누락 항목

GCP 패널에 **Discovery could not read everything**이 표시되면 각 줄에 영역과 누락된 내용이 나옵니다. *optional*로 표시된 줄은 인벤토리를 보강할 뿐입니다.

| 줄에 표시되는 내용 | 의미 | 해결 방법 |
|--------------------|------|-----------|
| 역할(예: `roles/monitoring.viewer`) | 서비스 계정에 해당 역할이 없습니다 | 프로젝트(또는 조직이나 폴더)에 대해 역할을 부여하고 다시 동기화하세요. |
| **API disabled in the project — enable it** | 해당 영역의 API가 꺼져 있으며, 세부 정보에 서비스 이름이 나옵니다 | **API 및 서비스 → 라이브러리**에서 사용 설정하세요. |
| 역할 없이, 조직 정책이 해당 위치를 금지한다는 세부 정보 | 조직 정책(`constraints/gcp.resourceLocations`)이 해당 위치를 차단하므로 그곳에는 아무것도 존재할 수 없습니다. 역할로는 해결되지 않습니다 | 구성에서 해당 위치를 제거하거나, 조직 관리자에게 허용을 요청하세요. |
| **Usage by model and identity**가 사용 설정되지 않음 | Vertex AI의 데이터 액세스 로그가 꺼져 있습니다 | 선택 사항: [모델 및 ID별 사용량](#모델-및-id별-사용량)을 참조하세요. |
| 부분 읽기(예: 조직 모드 상한) | 일부만 읽었으며, 세부 정보에 읽은 양이 나옵니다 | 이 때문에 폐기되거나 정리되는 항목은 없습니다. 모든 항목을 봐야 한다면 범위를 좁히세요. |

## 관련

- [Google Vertex AI — 내 계정에서 추론](/ko/integrations/cloud/vertex-ai-inference)
- [클라우드 AI 제공업체 개요](/ko/integrations/cloud/overview)
- [Google Workspace SSO](/ko/iam/google-workspace)
- [NHI 인벤토리](/ko/discovery/nhi-inventory)
