---
sidebar_position: 6
title: "Google Cloud — 디스커버리"
sidebar_label: "Google Cloud — 디스커버리"
description: "SecureAI가 Vertex AI 에이전트, 모델, 서비스 계정, 키, IAM, 사용량, 비용을 인벤토리화할 수 있도록 Google Cloud를 연결하세요."
---

# Google Cloud — 디스커버리

SecureAI가 Vertex AI 에이전트, 엔드포인트, 모델과 함께 이를 둘러싼 서비스 계정, 키, IAM 바인딩, 감사 로그, 사용량, 비용을 인벤토리화할 수 있도록 Google Cloud 프로젝트를 연결하세요.

<Info>
이 카드는 프로젝트를 **읽기만** 하며 프롬프트를 보내지 않습니다. SecureAI의 LLM 트래픽을 자체 Google Cloud 계정에서 실행하려면 [Google Vertex AI — 내 계정에서 추론](/en/integrations/cloud/vertex-ai-inference)을 참조하세요.
</Info>

## SecureAI가 가져오는 것

- **Vertex AI**: 에이전트(Agent Engine), 서빙 엔드포인트, 실행 중인 배치 및 튜닝 작업, 모델 — Model Registry와 사용 중인 모든 게시자 모델(Gemini, Claude, 개방형 모델).
- 최근 30일간 모델별 **사용량**: 요청 수(및 실패한 요청 수), 입력 및 출력 토큰, 프롬프트 캐시 토큰.
- 최근 30일간 **비용**: BigQuery 결제 내보내기에서 가져온 이 프로젝트의 실제 AI 지출, 또는 정가 기준 추정치.
- **NHI**: 서비스 계정, 사용자 관리 서비스 계정 키, API 키, Workload Identity Federation 풀 및 공급자, OAuth 클라이언트 — 각 키와 서비스 계정이 마지막으로 인증한 시간 포함. [NHI 인벤토리](/ko/discovery/nhi-inventory)에서 취소할 수 있습니다.
- 프로젝트의 **IAM** 역할 바인딩.
- AI 및 ID 서비스(Vertex AI, IAM, IAM Credentials, STS, API Keys, Resource Manager)의 **Cloud 감사 로그**: 최근 30일간의 최신 이벤트 200개.

## 전제 조건

SecureAI가 사용하는 서비스 계정이 필요합니다. 이 계정에 **프로젝트에 대해** 다음 역할을 부여하세요(**IAM 및 관리자 → IAM → 액세스 권한 부여**).

| 역할 | 사용할 수 있게 되는 것 | |
|------|------------------------|---|
| `roles/aiplatform.viewer` | Vertex AI 에이전트, 엔드포인트, 작업, 모델 | 필수 |
| `roles/iam.securityReviewer` | 서비스 계정, 키, API 키, Workload Identity, OAuth 클라이언트, IAM 바인딩 | 필수 |
| `roles/monitoring.viewer` | 모델별 요청 및 토큰 | 권장 |
| `roles/logging.viewer` | Cloud 감사 로그 | 권장 |
| `roles/policyanalyzer.activityAnalysisViewer` | 각 키와 서비스 계정의 마지막 사용 | 선택 |

**실제 비용**을 확인하려면 Cloud Billing 데이터가 [BigQuery로 내보내기](https://cloud.google.com/billing/docs/how-to/export-data-bigquery?hl=ko)되어 있어야 하며, 서비스 계정에는 내보내기 데이터 세트에 대한 `roles/bigquery.dataViewer`와 쿼리를 실행하는 프로젝트에 대한 `roles/bigquery.jobUser`가 필요합니다.

**SecureAI에서 취소**하려면(선택 사항) 허용하려는 각 작업의 역할도 부여하세요.

| 작업 | 역할 |
|------|------|
| 서비스 계정 사용 중지 | `roles/iam.serviceAccountAdmin` |
| 서비스 계정 키 삭제 | `roles/iam.serviceAccountKeyAdmin` |
| API 키 삭제 | `roles/serviceusage.apiKeysAdmin` |
| Workload Identity 풀 또는 공급자 사용 중지 | `roles/iam.workloadIdentityPoolAdmin` |
| OAuth 클라이언트 사용 중지 | `roles/iam.oauthClientAdmin` |

<Note>
`roles/billing.viewer`는 **필요하지 않습니다**. 이 역할은 결제 계정 역할이므로 프로젝트에 부여할 수 없으며, 커넥터도 사용하지 않습니다.
</Note>

어떤 것도 조용히 건너뛰지 않습니다. SecureAI가 읽을 수 없는 항목은 이를 해결하는 역할과 함께 표시됩니다 — 연결할 때, 각 동기화 후, 그리고 GCP 패널에서.

## 자격 증명

| 필드 | 필수 | 설명 |
|------|------|------|
| `projectId` | 예 | 프로젝트 **ID**(예: `my-project-123`) — 프로젝트 이름이나 번호가 아닙니다. |
| `location` | 예 | 에이전트와 엔드포인트가 있는 Vertex AI 위치(예: `us-central1`, `europe-west4`, `global`). 사용량과 비용은 모든 위치를 포함합니다. |
| `locations` | 아니요 | 쉼표로 구분한 여러 위치(최대 10개). `location`보다 우선합니다. |
| `serviceAccountJson` | 둘 중 하나 | 서비스 계정 키 JSON. 저장 시 암호화됩니다. |
| `impersonateServiceAccount` | 둘 중 하나 | 키 없음: SecureAI가 가장하는 서비스 계정의 이메일. 배포에서 키 없는 액세스를 제공하는 경우에만 표시됩니다. |
| `billingExportTable` | 아니요 | 결제 내보내기의 `project.dataset.table`(예: `my-billing.billing_export.gcp_billing_export_v1_XXXXXX`). |
| `billingProjectId` | 아니요 | BigQuery 쿼리를 실행하는 프로젝트. 기본값은 테이블의 프로젝트이며, `dataset.table` 형식의 이름은 이 프로젝트(비어 있으면 `projectId`)에서 찾습니다. |

### 얻는 방법

**옵션 A — JSON 키**

1. [Google Cloud 콘솔](https://console.cloud.google.com/)에서 **IAM 및 관리자 → 서비스 계정 → 서비스 계정 만들기**로 이동합니다(예: `secureai-discovery`).
2. **IAM 및 관리자 → IAM → 액세스 권한 부여**로 이동하여 서비스 계정의 이메일을 주 구성원으로 입력하고 [전제 조건](#전제-조건)의 역할을 추가합니다.
3. 다시 **서비스 계정**에서 계정을 열고 **키 → 키 추가 → 새 키 만들기 → JSON**을 선택해 파일을 다운로드합니다.
4. JSON **전체**를 `serviceAccountJson`에 붙여넣은 다음, 다운로드한 파일을 삭제합니다.

`gcloud`로 하는 방법:

```bash
PROJECT=my-project-123
gcloud iam service-accounts create secureai-discovery --project=$PROJECT --display-name="SecureAI discovery"
SA=secureai-discovery@$PROJECT.iam.gserviceaccount.com
for ROLE in roles/aiplatform.viewer roles/iam.securityReviewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud iam service-accounts keys create secureai-discovery.json --iam-account=$SA
```

<Warning>
Google에서 서비스 계정 키 생성이 사용 중지되었다고 응답하면, 조직에 `iam.disableServiceAccountKeyCreation` 정책이 적용되어 있는 것입니다 — 2024년 이후 생성된 조직의 기본값입니다. 옵션 B를 사용하거나 조직 관리자에게 이 프로젝트에 대한 예외를 요청하세요.
</Warning>

**옵션 B — 키 없음(가장)**

1. 서비스 계정을 만들고 역할을 부여합니다(위의 1단계와 2단계).
2. SecureAI 연결 양식의 **Service account to impersonate** 필드에 승인해야 할 SecureAI 계정이 표시됩니다. Google Cloud에서 서비스 계정을 열고 **권한 → 액세스 권한 부여**에서 해당 계정을 주 구성원으로 입력한 뒤 `roles/iam.serviceAccountTokenCreator`를 부여합니다.
3. 필드에 서비스 계정의 이메일을 입력하고 JSON은 비워 둡니다.

필드가 표시되지 않으면 배포에서 키 없는 액세스를 제공하지 않는 것입니다. 옵션 A를 사용하세요.

## 연결

1. **관리자 → 통합 → 클라우드 → Google Cloud — Discovery → 연결.**
2. 프로젝트 ID, 위치(또는 **More Vertex AI Locations**에 여러 위치), 그리고 JSON 키 또는 가장할 서비스 계정 중 하나를 입력합니다. 내보내기를 사용하는 경우 결제 필드도 추가합니다.
3. **연결**을 클릭합니다. SecureAI는 저장하기 전에 프로젝트를 실제로 읽어 자격 증명을 확인하며, 몇 초 정도 걸립니다. 프로젝트를 읽을 수 없으면(잘못된 ID, 역할 없음, 위치 오타) 이유를 표시하고 아무것도 저장하지 않습니다. 입력한 내용은 양식에 그대로 남습니다.
4. 저장되었지만 일부 역할이 없으면 경고에 해당 역할이 나열됩니다. 역할을 부여하고 다시 동기화하세요.
5. 카드의 새로고침 버튼으로 지금 동기화합니다. 이후 SecureAI는 6시간마다 자동으로 동기화합니다.

나중에 자격 증명을 변경하려면 **연결**을 다시 사용하세요. 비워 둔 필드는 저장된 값을 유지하며, JSON 키를 입력하면 저장된 가장 설정이 대체되고 그 반대도 마찬가지입니다.

## 확인

- [클라우드 센서](/ko/discovery/cloud-sensors)에 검색된 에이전트가 나열됩니다. Google Cloud 카드를 클릭하면 GCP 패널이 열립니다: 사용량 및 비용(요청, 실패, 토큰, 캐시, 비용과 그 출처), 모델 및 배포, ID 및 액세스(서비스 계정과 키 및 마지막 사용, IAM 바인딩), 감사.
- 패널에 **Discovery could not read everything**이 표시되면 나열된 역할을 부여하고 다시 동기화하세요.
- [NHI 인벤토리](/ko/discovery/nhi-inventory)에 서비스 계정과 키가 표시됩니다.

동기화가 실패하면(예: 키가 삭제되었거나 역할이 제거된 경우) 카드에 오류가 표시되고, SecureAI는 마지막 인벤토리를 유지한 채 백오프로 재시도합니다. 부분적인 읽기로 인해 에이전트가 폐기되거나 ID가 제거되는 일은 없습니다.

## 비용

- **`billingExportTable` 사용 시**: AI 서비스(Vertex AI, Gemini API, Agent Builder, Dialogflow 등)에 대한 이 프로젝트의 실제 지출로, 크레딧을 차감한 금액이며 결제 계정의 통화로 표시됩니다. 크레딧이 사용량을 충당하면 순액이 0일 수 있으며, 이 경우 패널에 크레딧 적용 전 금액이 함께 표시됩니다. Google은 몇 시간의 지연을 두고 내보내기를 업데이트합니다.
- **사용하지 않을 시**: 추정치 — Cloud Monitoring의 토큰 × 정가이며, Claude와 프롬프트 캐시 토큰도 포함합니다. 할인이나 약정 사용 계약은 반영되지 않습니다.

## 취소

커넥터에 해당 작업의 역할이 있으면([전제 조건](#전제-조건) 참조) GCP ID를 [NHI 인벤토리](/ko/discovery/nhi-inventory)(자물쇠)에서 취소할 수 있습니다. 각 항목이 Google에서 어떻게 처리되는지는 다음과 같습니다.

| ID | Google에서 일어나는 일 | 되돌릴 수 있음 |
|----|------------------------|----------------|
| 서비스 계정 | 사용 중지됨 | 예 — Google Cloud에서 다시 사용 설정 |
| 서비스 계정 키 | 삭제됨 | 아니요 |
| API 키 | 삭제됨 | Google Cloud에서 30일 동안 복원 가능 |
| Workload Identity 풀 / 공급자, OAuth 클라이언트 | 사용 중지됨 | 예 |

보호 장치:

- 커넥터가 사용하는 서비스 계정과 그 키는 SecureAI에서 취소할 수 없습니다 — 취소하면 디스커버리가 중단되기 때문입니다. Google Cloud에서 순환하세요.
- Google의 기본 서비스 계정(Compute Engine 기본 계정, App Engine, Cloud Build, 서비스 에이전트)은 두 번째 확인을 요청합니다. 이 중 하나를 사용 중지하면 해당 계정으로 실행되는 모든 VM, 앱, 빌드가 중지됩니다.
- 커넥터에 어떤 작업의 역할이 없으면 오류에 해당 역할이 표시됩니다.

## 관련

- [Google Vertex AI — 내 계정에서 추론](/en/integrations/cloud/vertex-ai-inference)
- [클라우드 AI 제공업체 개요](/ko/integrations/cloud/overview)
- [Google Workspace SSO](/ko/iam/google-workspace)
- [NHI 인벤토리](/ko/discovery/nhi-inventory)
