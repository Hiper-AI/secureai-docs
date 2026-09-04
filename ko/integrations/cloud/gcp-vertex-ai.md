---
sidebar_position: 6
title: "구글 버텍스 AI"
sidebar_label: "구글 버텍스 AI"
description: "SecureAI가 에이전트, 모델, 서비스 계정, IAM, 사용량, 비용에 대한 인벤토리를 작성할 수 있도록 Google Vertex AI를 연결하세요."
---
# 구글 버텍스 AI

SecureAI가 Vertex AI 에이전트, 엔드포인트, 모델과 함께 서비스 계정, IAM 바인딩, 감사 로그, 사용량, 청구에 대한 인벤토리를 조사할 수 있도록 Google Cloud 프로젝트를 연결하세요.

## SecureAI가 가져오는 것

- **Vertex AI 에이전트, 엔드포인트 및 모델**
- **NHIs** — 서비스 계정, 서비스 계정 키, API 키(취소 가능 — [NHI 인벤토리](/ko/discovery/nhi-inventory) 참조)
- **IAM** 역할 결합
- **클라우드 감사 로그**
- 지난 30일 동안의 **요청, 토큰, 비용**(BigQuery 결제 내보내기의 실제 또는 예상)

## 전제 조건

- 프로젝트에 대한 읽기 역할이 부여된 JSON 키가 있는 **서비스 계정**:
  - `roles/aiplatform.viewer`
  - `roles/monitoring.viewer`
  - `roles/iam.securityReviewer`
  - `roles/logging.viewer`
  - `roles/billing.viewer`
  - **실제** 비용으로 결제 내보내기를 사용하는 경우 BigQuery 역할(예: `roles/bigquery.dataViewer`, `roles/bigquery.jobUser`)
  - *(선택 사항)* SecureAI가 소스에서 ID를 취소하도록 원하는 경우 키/서비스 계정 관리자 역할.

## 자격 증명

| 필드 | 필수 | 설명 |
|-------|----------|------------|
| `projectId` | 예 | GCP 프로젝트 ID. |
| `location` | 예 | 정점 영역(예: `us-central1`). |
| `serviceAccountJson` | 예 | 서비스 계정 키 JSON입니다. 저장 시 암호화됩니다. |
| `billingExportTable` | 아니요 | 실제 청구를 위한 BigQuery 테이블(예: `dataset.gcp_billing_export_v1_XXXX`) |
| `billingProjectId` | 아니요 | 결제 내보내기를 호스팅하는 프로젝트(다른 경우) |

### 어디서 구할 수 있나요?

1. [구글 클라우드 콘솔](https://console.cloud.google.com/)에서 **IAM 및 관리자 → 서비스 계정 → 서비스 계정 생성**으로 이동합니다.
2. 위에 나열된 역할을 부여합니다.
3. **키 → 키 추가 → JSON**에서 키 파일을 다운로드합니다.
4. **전체** JSON을 `serviceAccountJson` 필드에 붙여넣습니다.

## 연결

1. **관리자 → 통합 → 클라우드 → Google Vertex AI → 연결.**
2. 프로젝트, 위치, 서비스 계정 JSON(선택적 청구 필드 포함)을 입력합니다.
3. **테스트**하고 **저장**합니다.
4. **동기화**.

## 확인

검색된 에이전트/엔드포인트/모델은 [클라우드 센서](/ko/discovery/cloud-sensors)를 열고 서비스 계정 및 키는 [NHI 인벤토리](/ko/discovery/nhi-inventory)를 엽니다. 통찰력에는 IAM 바인딩, 사용량, 비용이 표시됩니다.

## 철회

커넥터에 선택적 키/SA 관리자 역할이 있는 경우 GCP 서비스 계정, SA 키, API 키는 [NHI 인벤토리](/ko/discovery/nhi-inventory)에서 **취소 가능**합니다.

## 관련

- [클라우드 AI 제공업체 개요](/ko/integrations/cloud/overview)
- [Google Workspace SSO](/ko/iam/google-workspace)
- [NHI 인벤토리](/ko/discovery/nhi-inventory)