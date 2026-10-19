---
sidebar_position: 4
title: "Azure — 검색"
sidebarTitle: "Azure"
icon: "/img/icons/azure.svg"
sidebar_label: "Azure — 검색"
description: "Azure와 Microsoft Entra ID를 연결하면 SecureAI가 Azure OpenAI 및 Foundry 리소스, Foundry 프로젝트와 에이전트, AI Search, Bot Service, 그리고 모든 비인간 ID(서비스 주체, 에이전트 ID, 관리 ID, 비밀, 인증서, 페더레이션 자격 증명)를 각각의 권한, RBAC, 활동, 사용량, 비용과 함께 인벤토리로 만듭니다."
---

# Azure — 검색

Azure 테넌트를 연결하면 SecureAI가 Azure의 AI 리소스와 Microsoft Entra ID의 **모든 비인간 ID(NHI)**를, 각각이 보유한 역할과 권한과 함께 인벤토리로 만들 수 있습니다.

<Info>
이 연결은 **읽기만 하며** 프롬프트를 전송하지 않습니다. SecureAI의 LLM 트래픽을 대신 사용자의 Foundry 리소스에서 실행하려면 [Azure AI Foundry — Inference in your account](/en/integrations/cloud/azure-ai-foundry-inference)를 참조하세요. 두 연결은 서비스 주체와 권한이 서로 다른 독립적인 연결이며, 같은 구독에서 둘 다 사용할 수 있습니다.
</Info>

## SecureAI가 가져오는 것

서비스 주체가 읽을 수 있는 각 구독에 대해 다음을 가져옵니다.

- **AI 리소스**: 모든 Azure AI Services, Azure OpenAI 및 기타 Cognitive Services 계정(Content Safety, Speech, Language, Document Intelligence 등)과 해당 리전 및 상태.
- Azure OpenAI와 Foundry의 **모델 배포**: 용량과 최근 30일간의 사용량(요청 수, 입력 및 출력 토큰 수, Azure Monitor 기준)을 포함합니다.
- **Foundry 프로젝트와 에이전트**: 각 프로젝트의 Foundry Agent Service 에이전트와 기존 어시스턴트, 그리고 각각이 사용하는 모델. 허브 및 허브 기반 프로젝트(Azure Machine Learning)와 해당 온라인 엔드포인트 및 서버리스 엔드포인트도 포함됩니다.
- **Azure AI Search**와 **Azure Bot Service**.
- 서비스별 이번 달 **비용**(Cost Management).
- **활동**: 최근 30일간의 Cognitive Services 및 Machine Learning 관리 이벤트(활동 로그).
- **NHI**: [NHI 인벤토리](/ko/discovery/nhi-inventory)에 표시됩니다.
  - 엔터프라이즈 애플리케이션의 **서비스 주체**.
  - Foundry가 에이전트마다 만드는 Microsoft Entra **에이전트 ID**(*에이전트*로 분류).
  - 시스템 할당 및 사용자 할당 **관리 ID**.
  - 앱 등록의 **클라이언트 비밀**과 **인증서**(만료일 포함).
  - **페더레이션 자격 증명**(워크로드 ID 페더레이션). 예를 들어 GitHub Actions OIDC 신뢰를 설정하면 해당 리포지토리가 비밀 없이 애플리케이션으로서 토큰을 받을 수 있습니다.
  - 각 애플리케이션의 **마지막 로그인**(테넌트가 해당 보고서를 제공하는 경우).
- **각 ID의 권한**: 구독의 모든 범위(구독, 리소스 그룹 또는 리소스)에서의 Azure RBAC 역할, Microsoft Graph 애플리케이션 권한, Entra 디렉터리 역할.
- **RBAC 역할 할당**: 각 역할의 이름과 해당 역할을 보유한 사용자, 그룹, 애플리케이션.

ID가 다음 중 하나를 보유하면 **권한 있음(privileged)**으로 표시됩니다.

- **Owner**, **Contributor**, **User Access Administrator**, **Role Based Access Control Administrator** 역할 중 하나.
- `Application.ReadWrite.All`, `Directory.ReadWrite.All`, `Mail.Send`, `Files.ReadWrite.All` 같은 Graph 쓰기 권한.
- Global Administrator나 Application Administrator 같은 디렉터리 관리자 역할.

권한 있는 애플리케이션의 비밀, 인증서, 페더레이션 자격 증명도 권한 있음으로 표시됩니다.

SecureAI는 Microsoft가 모든 테넌트에 만드는 약 130개의 서비스 주체(Azure Portal, Microsoft Graph 등)와 소셜 로그인 연결은 가져오지 않습니다. 이들은 사용자가 관리해야 할 ID가 아닙니다.

## 전제 조건

**클라이언트 비밀**이 있는 Microsoft Entra ID **앱 등록**(서비스 주체)과 다음 권한이 필요합니다.

| 위치 | 권한 | 필수 여부 | 가능해지는 것 |
|------|------|-----------|---------------|
| 구독 | **Reader** 역할 | 예 | 리소스, 배포, 프로젝트, 관리 ID, 역할 할당, 사용량 및 활동 |
| 구독 | **Cost Management Reader** 역할 | 권장 | 서비스별 이번 달 누적 비용 |
| Foundry 리소스 | **Cognitive Services Data Reader** 역할 | 권장 | 각 Foundry 프로젝트의 에이전트 |
| Microsoft Graph | `Application.Read.All` (애플리케이션 권한) | 예 | 서비스 주체, 에이전트 ID, 애플리케이션, 비밀, 인증서, 페더레이션 자격 증명 및 Graph 권한 |
| Microsoft Graph | `Directory.Read.All` (애플리케이션 권한) | 예 | 디렉터리 역할과 각 역할 구성원의 이름 |
| Microsoft Graph | `AuditLog.Read.All` (애플리케이션 권한) | 권장 | 각 애플리케이션의 마지막 로그인 |
| Microsoft Graph | `Application.ReadWrite.All` (애플리케이션 권한) | 철회할 때만 | SecureAI에서 서비스 주체를 사용 중지하고 비밀, 인증서, 페더레이션 자격 증명을 삭제 |

Graph 권한에는 **관리자 동의**가 필요합니다. **모든** 구독을 읽으려면 각 구독에 **Reader**를 할당하거나, 해당 구독들을 포함하는 관리 그룹에 할당하세요.

<Note>
Foundry 에이전트는 Azure Resource Manager가 아니라 프로젝트의 데이터 평면에 있습니다. **Reader만으로는 볼 수 없습니다**. Foundry 리소스에 **Cognitive Services Data Reader**(또는 **Foundry User**)가 없으면 동기화는 계속 동작하지만 에이전트 목록은 비어 있고, SecureAI는 이를 누락(gap)으로 보고합니다. Cognitive Services Data Reader는 이를 허용하는 가장 좁은 역할로, 데이터 평면 읽기 전용입니다.
</Note>

## 1단계. 서비스 주체 만들기

### Azure CLI 사용

[Azure Cloud Shell](https://shell.azure.com/) 또는 `az` CLI에서 실행합니다. `SUB_ID`를 사용자의 구독으로 바꾸고, Foundry를 사용한다면 `MY_RESOURCE`와 `MY_RG`를 사용자의 리소스와 리소스 그룹으로 바꾸세요.

```bash
SUB_ID=00000000-0000-0000-0000-000000000000

# 1. App registration + service principal
APP_ID=$(az ad app create --display-name "SecureAI Discovery" --query appId -o tsv)
az ad sp create --id "$APP_ID"

# 2. Client secret (shown only once: copy it now)
az ad app credential reset --id "$APP_ID" --display-name secureai --years 1 \
  --query "{tenantId:tenant, clientId:appId, clientSecret:password}" -o json

# 3. Microsoft Graph application permissions + admin consent
#    Application.Read.All, Directory.Read.All, AuditLog.Read.All
az ad app permission add --id "$APP_ID" --api 00000003-0000-0000-c000-000000000000 \
  --api-permissions 9a5d68dd-52b0-4cc2-bd40-abcf44ac3a30=Role \
                    7ab1d382-f21e-4acd-a863-ba3e13f7da61=Role \
                    b0afded3-3588-46d8-8b3d-9842eff778da=Role
az ad app permission admin-consent --id "$APP_ID"

# 4. Azure RBAC on the subscription
az role assignment create --assignee "$APP_ID" --role "Reader" --scope "/subscriptions/$SUB_ID"
az role assignment create --assignee "$APP_ID" --role "Cost Management Reader" --scope "/subscriptions/$SUB_ID"

# 5. (Recommended) read the agents of your Foundry resource
RID=$(az cognitiveservices account show -n MY_RESOURCE -g MY_RG --query id -o tsv)
az role assignment create --assignee "$APP_ID" --role "Cognitive Services Data Reader" --scope "$RID"
```

2단계에서 SecureAI에 붙여넣을 세 가지 값이 출력됩니다. **SecureAI에서 철회**하려면 3단계에 `1bfefb4e-e0b5-418b-a88f-73c46d2cc8e9=Role`(`Application.ReadWrite.All`)도 추가하고 동의를 다시 부여하세요.

### Azure Portal 사용

1. [Azure Portal](https://portal.azure.com/)에서 **Microsoft Entra ID → 앱 등록 → 새 등록**으로 이동하여 이름(예: `SecureAI Discovery`)을 지정하고 등록합니다.
2. **개요**에서 **디렉터리(테넌트) ID**와 **애플리케이션(클라이언트) ID**를 복사합니다.
3. **인증서 및 비밀 → 클라이언트 비밀 → 새 클라이언트 비밀**에서 비밀을 만들고 해당 **값**을 복사합니다(한 번만 표시됩니다).
4. **API 사용 권한 → 권한 추가 → Microsoft Graph → 애플리케이션 권한**에서 `Application.Read.All`, `Directory.Read.All`, `AuditLog.Read.All`을 추가합니다(SecureAI에서 철회하려면 `Application.ReadWrite.All`도 추가). 그런 다음 **관리자 동의 허용**을 클릭합니다.
5. **구독 → 사용자의 구독 → 액세스 제어(IAM) → 역할 할당 추가**에서 애플리케이션에 **Reader**와 **Cost Management Reader**를 할당합니다.
6. **사용자의 Foundry 리소스 → 액세스 제어(IAM)**에서 애플리케이션에 **Cognitive Services Data Reader**를 할당합니다.

<Info>
Azure 역할이 적용되기까지 **최대 5분**, Graph 동의가 적용되기까지는 몇 분 더 걸릴 수 있습니다. 방금 부여한 권한에 대해 첫 동기화에서 누락이 표시되면 잠시 기다린 후 다시 동기화하세요.
</Info>

<Warning>
비밀은 비밀번호처럼 취급하세요. SecureAI는 비밀을 **암호화**하여 저장하며 다시 표시하지 않습니다. 비밀은 **만료**됩니다(위 명령에서는 1년 후). 그 전에 교체하지 않으면 해당 날짜부터 동기화가 동작하지 않습니다.
</Warning>

## 2단계. SecureAI에서 Azure 연결

1. **관리자 → 통합**으로 이동하여 **Cloud**로 필터링한 다음 **Azure — 검색** 카드에서 **통합 연결**을 클릭합니다.
2. 필드를 입력합니다.

   | 필드 | 입력할 내용 |
   |------|-------------|
   | **Azure Tenant ID (Directory ID)** | 1단계의 `tenantId` |
   | **App Registration Client ID** | 1단계의 `clientId` |
   | **App Registration Client Secret** | 1단계의 `clientSecret`. 암호화되어 저장됩니다. |
   | **Subscription ID** (선택 사항) | 읽기 범위를 해당 구독으로 제한합니다. 비워 두면 주체가 **Reader**를 가진 모든 구독. |

3. **연결**을 클릭합니다. 저장하기 전에 SecureAI는 실제 읽기로 자격 증명을 테스트합니다. 비밀이 잘못되었거나 주체가 구독을 읽을 수 없으면 아무것도 저장되지 않으며, 메시지에 부족한 항목이 표시됩니다. 연결은 되었지만 Graph 권한이 부족한 경우 알림에 해당 권한 이름이 표시됩니다.
4. 카드의 새로 고침 버튼으로 **동기화**합니다. Azure 동기화는 몇 분이 걸릴 수 있습니다(Azure Resource Manager, Microsoft Graph, Azure Monitor, Cost Management를 차례로 확인하기 때문입니다). 이후에는 SecureAI가 6시간마다 자동으로 동기화합니다.

## 3단계. 확인

- [Cloud Sensors](/ko/discovery/cloud-sensors)에 검색된 배포, 에이전트, 서비스가 나열됩니다. Azure 카드를 클릭하면 Insights가 열립니다.
  - **Usage & Costs**: 사용량과 비용
  - **Models & Deployments**: 배포와 에이전트
  - **Identity & Access**: 역할과 *Privileged* 표시가 있는 ID, 비밀, 인증서, 페더레이션 자격 증명, 구성원이 있는 RBAC 역할
  - **Audit & Logs**: 활동
- [NHI 인벤토리](/ko/discovery/nhi-inventory)에는 서비스 주체, 에이전트 ID, 관리 ID, 비밀, 인증서, 페더레이션 자격 증명이 권한 및 권한 있음 여부와 함께 표시됩니다.

동기화가 실패하면(예: 비밀이 만료된 경우) 카드에 오류가 표시되고, SecureAI는 마지막 인벤토리를 유지한 채 백오프를 적용하여 다시 시도합니다.

## 적용 범위의 누락

SecureAI가 읽지 못한 항목은 조용히 건너뛰지 않습니다. 연결하거나 동기화할 때 알림에 부족한 권한이 표시됩니다.

| 대상 | 해결하는 권한 |
|------|---------------|
| Entra ID(서비스 주체, 앱 등록) | 관리자 동의가 있는 `Application.Read.All` |
| 각 ID의 Graph 권한 | `Application.Read.All` |
| 디렉터리 역할 | `Directory.Read.All` |
| 역할 할당 및 관리 ID | 구독의 **Reader** |
| Foundry 에이전트 | Foundry 리소스의 **Cognitive Services Data Reader** |

부분적인 읽기(권한 부족, Azure가 반환하지 않은 페이지, 제한(throttling))로는 인벤토리에서 **에이전트가 제거되거나 ID가 삭제되지 않습니다**. SecureAI는 해당 항목이 나타나야 할 목록이 완전히 반환된 경우에만 삭제된 것으로 간주합니다. 역할 할당이 없으면 ID의 권한은 "없음"이 아니라 *알 수 없음*으로 유지됩니다.

## 철회

[NHI 인벤토리](/ko/discovery/nhi-inventory)(자물쇠 아이콘)에서 `Application.ReadWrite.All`을 사용하여 수행합니다.

| ID | Azure에서 일어나는 일 | 되돌릴 수 있나요? |
|----|-----------------------|-------------------|
| 서비스 주체 | **사용 중지**됨 (`accountEnabled: false`) | 예: Entra ID에서 다시 사용하도록 설정 |
| 클라이언트 비밀 | 애플리케이션에서 **삭제**됨 | 아니요: 새로 만들기 |
| 인증서 | 애플리케이션에서 **제거**됨 | 아니요: 다시 업로드 |
| 페더레이션 자격 증명 | 신뢰가 **삭제**됨 | 아니요: 다시 만들기 |
| 사용자 할당 관리 ID | 리소스가 **삭제**됨 (해당 리소스에 대한 **Managed Identity Contributor**도 필요) | 아니요 |

안전장치:

- SecureAI는 자신이 연결에 사용하는 서비스 주체와 해당 비밀은 검색이 중단되므로 **철회를 제공하지 않습니다**. Entra ID에서 교체하세요.
- **시스템 할당** 관리 ID는 SecureAI에서 철회하지 않습니다. 수명 주기가 Azure 리소스에 따르기 때문입니다.
- **Foundry**가 에이전트 ID의 *블루프린트*에 유지하는 페더레이션 자격 증명도 SecureAI에서 철회하지 않습니다. 삭제하면 에이전트가 중지됩니다.
- NHI 자동 정책(사용 기간 또는 미사용에 따른 철회)은 아직 Azure에 적용되지 않습니다. 철회는 수동으로 수행합니다.

## 연결 해제

**관리자 → 통합 → Cloud → Azure — 검색**에서 연결을 삭제하면 저장된 자격 증명이 제거됩니다. Azure 쪽에서 SecureAI의 액세스를 제거하려면 앱 등록 또는 해당 비밀을 삭제하세요.

## 관련

- [Azure AI Foundry — Inference in your account](/en/integrations/cloud/azure-ai-foundry-inference)
- [클라우드 AI 제공업체 개요](/ko/integrations/cloud/overview)
- [Cloud Sensors](/ko/discovery/cloud-sensors)
- [NHI 인벤토리](/ko/discovery/nhi-inventory)
- [Microsoft Entra ID (SSO)](/ko/iam/microsoft-entra-id)
