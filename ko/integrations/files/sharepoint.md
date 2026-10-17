---
sidebar_position: 2
title: "SharePoint & OneDrive — Add from SharePoint"
sidebar_label: "SharePoint & OneDrive"
description: "사용자가 SecureAI 채팅에서 SharePoint 사이트와 OneDrive의 파일을 첨부할 수 있도록 설정합니다. 귀사의 Microsoft Entra ID 앱 등록을 사용하는 셀프서비스 방식입니다."
---

# SharePoint & OneDrive — Add from SharePoint

이 연동을 사용하면 사용자가 첨부 버튼의 **Add from SharePoint** 옵션을 통해 **SharePoint 사이트**(Teams 사이트 포함), **OneDrive**, **나와 공유됨**의 파일을 채팅에서 바로 첨부할 수 있습니다.

설정은 **셀프서비스**입니다. 귀사의 관리자가 **귀사의 Microsoft Entra ID 디렉터리**에 SecureAI를 애플리케이션으로 등록하고 식별자를 **Admin → Integrations → Files**에 등록합니다. 티켓을 열거나 Hiper AI를 기다릴 필요가 없습니다. 설정을 저장하는 즉시 채팅에 옵션이 표시됩니다.

예상 소요 시간: 10분.

## 작동 방식

1. 사용자가 **Attach → Add from SharePoint**를 클릭합니다. 처음에는 Microsoft가 **본인의 Microsoft 365 계정**으로 로그인하도록 요청합니다.
2. Microsoft Graph 기반의 SecureAI 탐색기가 열리며 사이트, 라이브러리, 폴더, 검색, 사용자와 공유된 파일이 표시됩니다. 사용자가 파일을 하나 이상 선택합니다.
3. 사용자의 브라우저가 사용자 본인의 토큰으로 **선택한 파일만** 다운로드하여 메시지에 첨부합니다.
4. 파일은 다른 첨부 파일과 동일한 경로를 따릅니다. 모델에 도달하기 전에 **DLP**와 귀사의 정책을 거칩니다.

<Info>
**위임된 권한만 사용하며, 애플리케이션 권한은 사용하지 않습니다.** SecureAI는 항상 **로그인한 사용자를 대신하여** 동작합니다. 사용자는 SharePoint에서 이미 열 수 있는 항목만 보고 첨부할 수 있습니다. 이 애플리케이션은 클라이언트 비밀이 없는 "단일 페이지 애플리케이션"(SPA)이며, SecureAI는 백그라운드에서 아무것도 읽지 않습니다.
</Info>

## 사전 요구 사항

- 애플리케이션을 등록하고 Microsoft Graph 권한에 대해 **관리자 동의를 부여**할 수 있는 Entra ID 역할(예: **클라우드 애플리케이션 관리자** 또는 **전역 관리자**).
- SecureAI 관리자 액세스 권한(**Integrations** 섹션에 대한 **Administrator** 권한).
- **Attach from Drive / SharePoint**가 포함된 SecureAI 요금제. 포함되어 있지 않아도 설정은 미리 해 둘 수 있지만, 사용자에게는 옵션이 표시되지 않습니다.

## 1단계: SecureAI에서 리디렉션 URI 복사

1. 관리자로 SecureAI에 로그인합니다.
2. **Admin → Integrations**로 이동하여 **Files** 카테고리로 필터링합니다.
3. **SharePoint & OneDrive** 카드에서 **Connect integration**을 클릭합니다.
4. **1. Register SecureAI in Microsoft Entra ID** 섹션에서 **Redirect URI** 옆의 **Copy**를 클릭합니다.

<div class="mac-window">
  ![SecureAI 사이드 패널의 리디렉션 URI](/img/files/sharepoint/1%20-%20SharePoint.png)
</div>

URI는 귀사 인스턴스의 주소입니다. 예: `https://<회사명>.hiperai.ai`. 항상 귀사의 인스턴스에 표시되는 값을 사용하십시오. 정확히 일치해야 합니다.

## 2단계: Entra ID에 애플리케이션 등록

1. [Microsoft Entra 관리 센터](https://entra.microsoft.com)를 열고 **ID → 애플리케이션 → 앱 등록**(Identity → Applications → App registrations)으로 이동합니다.
2. **새 등록**(New registration)을 클릭합니다.

<div class="mac-window">
  ![앱 등록 → 새 등록](/img/files/sharepoint/2%20-%20SharePoint.jpg)
</div>

3. 다음 항목을 입력합니다.
   - **이름**(Name): 예: `SecureAI — Add from SharePoint`
   - **지원되는 계정 유형**(Supported account types): **이 조직 디렉터리의 계정만**(Accounts in this organizational directory only, 단일 테넌트)
   - **리디렉션 URI**(Redirect URI): 드롭다운에서 **단일 페이지 애플리케이션(SPA)**(Single-page application)을 선택하고 1단계에서 복사한 URI를 붙여넣습니다.
4. **등록**(Register)을 클릭합니다.


<Warning>
플랫폼은 **웹**이 아니라 **단일 페이지 애플리케이션(SPA)**이어야 합니다. **웹**으로 등록하면 로그인이 `AADSTS9002326` 오류로 실패합니다. 이미 웹으로 등록했다면 **인증**(Authentication)으로 이동하여 같은 URI로 **단일 페이지 애플리케이션** 플랫폼을 추가하고 웹 플랫폼은 제거하십시오.
</Warning>

5. 애플리케이션의 **개요**(Overview)에서 **애플리케이션(클라이언트) ID**(Application (client) ID)와 **디렉터리(테넌트) ID**(Directory (tenant) ID)를 복사합니다. 클라이언트 비밀을 만들 필요는 없습니다.

<div class="mac-window">
  ![애플리케이션 ID와 디렉터리 ID](/img/files/sharepoint/4%20-%20SharePoint.jpg)
</div>

## 3단계: Microsoft Graph 권한 추가

1. 애플리케이션에서 **API 권한 → 권한 추가 → Microsoft Graph → 위임된 권한**(API permissions → Add a permission → Microsoft Graph → Delegated permissions)으로 이동합니다.
2. 다음을 검색하여 선택합니다.
   - `Files.Read.All` — 사용자가 액세스할 수 있는 파일을 읽습니다.
   - `Sites.Read.All` — 사용자가 액세스할 수 있는 SharePoint 사이트를 나열하고 검색합니다.
3. **권한 추가**(Add permissions)를 클릭합니다. `User.Read`는 기본으로 이미 추가되어 있으므로 그대로 두십시오.

<div class="mac-window">
  ![Microsoft Graph 위임된 권한](/img/files/sharepoint/5%20-%20SharePoint.jpg)
</div>

## 4단계: 관리자 동의 부여

1. **API 권한**에서 **&lt;조직 이름&gt;에 대한 관리자 동의 허용**(Grant admin consent for &lt;org&gt;)을 클릭하고 **예**로 확인합니다.
2. 세 가지 권한의 상태가 모두 **&lt;조직 이름&gt;에 허용됨**이어야 합니다.

<div class="mac-window">
  ![부여된 관리자 동의](/img/files/sharepoint/6%20-%20SharePoint.jpg)
</div>

이 단계를 건너뛰면 각 사용자에게 동의 요청이 표시됩니다(조직에서 사용자 동의를 허용하지 않는 경우 `AADSTS65001` 오류가 표시됩니다).

## 5단계: SecureAI에 입력, 테스트 및 활성화

1. SecureAI의 **SharePoint & OneDrive** 사이드 패널로 돌아갑니다.
2. **2. Paste the identifiers**에서 **Directory (tenant) ID**와 **Application (client) ID**를 붙여넣습니다.
3. **3. Test it**에서 다음을 수행합니다.
   - **Test connection**은 SecureAI 서버에서 디렉터리가 존재하는지 확인합니다.
   - **Try signing in**은 사용자에게 표시되는 것과 동일한 Microsoft 창을 엽니다. 본인 계정으로 로그인하십시오. SecureAI가 리디렉션 URI가 SPA 유형인지, `Files.Read.All`과 `Sites.Read.All`에 동의가 부여되었는지, Microsoft Graph가 응답하는지 확인합니다.

<div class="mac-window">
  ![SecureAI 사이드 패널에서 통과한 테스트](/img/files/sharepoint/7%20-%20SharePoint.png)
</div>

4. **4.**에서 **Show "Add from SharePoint" to users**를 켠 상태로 두고 **Save**를 클릭합니다.

카드가 **Available in the chat**으로 바뀝니다.

## 6단계: 사용자의 사용 방법

1. 채팅에서 사용자가 **첨부** 버튼을 클릭하고 **Add from SharePoint**를 선택합니다.

<div class="mac-window">
  ![첨부 메뉴의 Add from SharePoint](/img/files/sharepoint/8%20-%20SharePoint.png)
</div>

2. 처음에는 **Sign in with Microsoft**를 클릭하고 조직 계정을 선택합니다.
3. **Sites**, **Shared** 또는 검색으로 이동하여 파일을 하나 이상 선택하고 **Add**를 클릭합니다.


4. 파일이 SharePoint 아이콘과 함께 메시지에 첨부됩니다.

## 사용 가능한 사용자 제한(선택 사항)

일부 사용자 또는 그룹만 **Add from SharePoint**를 사용할 수 있도록 하려면 다음과 같이 합니다.

1. Entra에서 **엔터프라이즈 애플리케이션**(Enterprise applications)으로 이동하여 등록한 애플리케이션을 엽니다.
2. **속성**(Properties)에서 **할당 필요?**(Assignment required?)를 켜고 저장합니다.
3. **사용자 및 그룹**(Users and groups)에서 사용을 허용할 사용자 또는 그룹을 할당합니다.

할당되지 않은 사용자는 로그인 시 `AADSTS50105` 오류가 표시되며 파일을 첨부할 수 없습니다.

## 문제 해결

| 표시되는 내용 | 원인 | 조치 방법 |
|---|---|---|
| `AADSTS50011` — 리디렉션 URI가 일치하지 않음 | 1단계의 URI가 등록되어 있지 않음 | **인증 → 단일 페이지 애플리케이션**에 추가합니다 |
| `AADSTS9002326` | URI가 **웹**으로 등록되어 있음 | **단일 페이지 애플리케이션**으로 옮깁니다 |
| `AADSTS65001` — 동의 누락 | 관리자 동의가 부여되지 않음 | 4단계 |
| `AADSTS700016` — 애플리케이션을 찾을 수 없음 | 애플리케이션 ID 또는 디렉터리 ID가 잘못됨 | **개요**에서 다시 복사합니다 |
| `AADSTS50105` | 사용자가 애플리케이션에 할당되어 있지 않음 | 사용자를 할당하거나 **할당 필요?**를 끕니다 |
| **Try signing in**: "These delegated permissions are missing"(다음 위임된 권한이 누락되었습니다) | `Files.Read.All` 또는 `Sites.Read.All`, 또는 해당 동의가 누락됨 | 3단계 및 4단계 |
| 사용자에게 사이트가 보이지 않고 "Shared"만 보임 | 사용자가 어떤 사이트의 구성원도 아님 | 정상 동작입니다. 사용자는 이미 열 수 있는 항목만 봅니다 |
| 사용자에게 **Add from SharePoint**가 표시되지 않음 | 연동이 꺼져 있거나, 저장되지 않았거나, 요금제에 포함되어 있지 않음 | **Admin → Integrations → Files**의 카드를 확인합니다 |

## 자주 묻는 질문

**SecureAI는 무엇을 읽을 수 있나요?** 로그인한 사용자가 이미 읽을 수 있는 항목만, 그리고 사용자가 탐색기에서 파일을 선택할 때만 읽을 수 있습니다. 권한은 위임된 것이며, SecureAI가 "애플리케이션으로서" 귀사의 SharePoint에 접근하는 경로는 없습니다.

**조건부 액세스 정책이 적용되나요?** 예. 로그인은 일반적인 Microsoft 365 로그인이며 MFA, 관리되는 디바이스 및 기타 정책을 준수합니다.

**어떻게 비활성화하나요?** **Show "Add from SharePoint" to users**를 끄고 저장하거나, **Remove configuration**을 클릭합니다. 이미 발급된 토큰도 취소하려면 Entra ID에서 앱 등록을 삭제하거나 엔터프라이즈 애플리케이션의 로그인을 비활성화하십시오.

**Hiper AI가 이미 SharePoint를 설정해 주었습니다. 따로 해야 할 일이 있나요?** 아니요. 자체 설정을 저장하지 않는 한 카드에는 **Configured by Hiper AI**가 표시되며 모든 것이 그대로 작동합니다. 자체 설정을 저장하면 기존 설정을 대체합니다.
