---
sidebar_position: 4
title: "Azure AI 파운드리"
sidebar_label: "Azure AI 파운드리"
description: "SecureAI가 에이전트, 모델, ID, RBAC, 사용량 및 비용을 인벤토리할 수 있도록 Azure AI Foundry/Azure OpenAI를 연결하세요."
---
# Azure AI 파운드리

SecureAI가 Azure OpenAI/AI Foundry 에이전트, AI 검색, Bot Service 및 ML 엔드포인트와 이를 관리하는 Entra ID 및 RBAC를 인벤토리화할 수 있도록 Azure 테넌트를 연결하세요.

## SecureAI가 가져오는 것

- **Azure OpenAI/AI Foundry 에이전트, AI 검색, Bot Service 및 ML 엔드포인트**
- **NHIs** — Entra 서비스 주체, 앱 비밀 및 인증서, 관리 ID(취소 가능 — [NHI 인벤토리](/ko/en/discovery/nhi-inventory) 참조)
- **Azure RBAC** 역할 할당
- **활동 로그**
- 지난 30일 동안의 **사용량, 토큰 및 지출**

## 전제 조건

- 클라이언트 암호를 사용한 **Entra ID(Azure AD) 앱 등록**(서비스 주체).
- 관리자 동의 하에 부여되는 **Microsoft Graph 애플리케이션 권한**:
  - `Application.Read.All`, `Directory.Read.All`, `AuditLog.Read.All` (읽기).
  - `Application.ReadWrite.All` — **SecureAI가 소스에서 ID를 취소하도록 원하는 경우에만**.
- 서비스 주체는 관련 구독/리소스 그룹에 **읽기** 역할을 할당했습니다.

## 자격 증명

| 필드 | 필수 | 설명 |
|-------|----------|------------|
| `tenantId` | 예 | 디렉터리(테넌트) ID입니다. |
| `clientId` | 예 | 앱 등록의 애플리케이션(클라이언트) ID입니다. |
| `clientSecret` | 예 | 클라이언트 비밀. 저장 시 암호화됩니다. |
| `subscriptionId` | 아니요 | 특정 구독에 대한 범위 검색입니다. |

SecureAI는 OAuth2(클라이언트-자격 증명 서비스-주체 흐름)를 통해 인증합니다.

### 어디서 구할 수 있나요?

1. [Azure Portal](https://portal.azure.com/)에서 **Microsoft Entra ID → 앱 등록 → 신규 등록**으로 이동합니다.
2. 앱 개요에서 **디렉터리(테넌트) ID** 및 **애플리케이션(클라이언트) ID**를 복사합니다.
3. **인증서 및 비밀**에서 **클라이언트 비밀**을 생성하고 해당 값을 복사합니다.
4. **API 권한**에서 위의 Microsoft Graph 권한과 **관리자 동의 부여**를 추가합니다.
5. 앱에 대상 구독에 대한 **읽기** 역할을 할당합니다(**구독 → 액세스 제어(IAM)**).

## 연결

1. **관리자 → 통합 → 클라우드 → Azure AI Foundry → 연결.**
2. 테넌트, 클라이언트, 비밀(및 선택적 구독)을 입력합니다.
3. **테스트**하고 **저장**합니다.
4. **동기화**(Azure 동기화는 몇 분 정도 걸릴 수 있습니다 - 다중 서비스 + 그래프 + 활동 로그 스윕).

## 확인

검색된 에이전트/엔드포인트에 대해서는 [클라우드 센서](/ko/en/discovery/cloud-sensors)를 열고 서비스 주체, 비밀 및 관리 ID에 대해서는 [NHI Inventory](/ko/en/discovery/nhi-inventory)를 엽니다. 통찰력에는 RBAC, 사용량 및 지출이 표시됩니다.

## 철회

Entra 서비스 주체, 앱 비밀/인증서 및 관리 ID는 [NHI Inventory](/ko/en/discovery/nhi-inventory)에서 Microsoft Graph를 통해 **취소 가능**합니다. 이를 위해서는 위의 `Application.ReadWrite.All` 권한이 필요합니다.

## 관련

- [클라우드 AI 제공업체 개요](/ko/ko/integrations/cloud/overview)
- [마이크로소프트 엔트라 ID SSO](/ko/ko/iam/microsoft-entra-id)
- [NHI 인벤토리](/ko/en/discovery/nhi-inventory)