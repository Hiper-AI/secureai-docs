---
sidebar_position: 3
title: "Microsoft Entra ID (SSO)"
sidebar_label: "Microsoft Entra ID (SSO)"
---

# Microsoft Entra ID (SSO) 통합

이 통합을 사용하면 조직의 사용자가 Microsoft 회사 계정으로 SecureAI에 로그인할 수 있습니다(**Continue with Microsoft** 버튼). 설정은 **셀프 서비스** 방식입니다. 조직의 관리자가 자체 Microsoft Entra ID 테넌트(이전 명칭: Azure Active Directory)에 SecureAI를 등록하고 **관리자 → 통합**에서 세부 정보를 입력합니다. 티켓을 열 필요도, Hiper AI의 처리를 기다릴 필요도 없습니다. 저장하는 즉시 로그인 페이지에 버튼이 표시됩니다.

예상 소요 시간: 10분.

## 사전 요구 사항

- 앱 등록을 만들 수 있는 Microsoft Entra 역할(예: **애플리케이션 개발자**(Application Developer) 또는 **애플리케이션 관리자**(Application Administrator)). 관리자 동의를 부여하려면(4단계) **클라우드 애플리케이션 관리자**(Cloud Application Administrator), **애플리케이션 관리자** 또는 **전역 관리자**(Global Administrator) 역할이 필요합니다.
- SecureAI 관리자 액세스 권한 및 **통합** 섹션에 대한 **Admin** 권한.

## 작동 방식

1. Entra ID 테넌트에 **앱 등록**을 만듭니다. SecureAI는 **클라이언트 비밀**을 사용하는 OpenID Connect(인증 코드 흐름)를 사용합니다.
2. SecureAI에 **디렉터리(테넌트) ID**, **애플리케이션(클라이언트) ID** 및 **클라이언트 비밀 값**을 입력합니다. 비밀은 암호화되어 저장되며 다시 표시되지 않습니다.
3. 사용자가 **Continue with Microsoft**를 클릭하면 Microsoft가 사용자를 인증하고(조직의 MFA 및 조건부 액세스 정책 적용), 이메일이 SecureAI의 **활성** 계정과 일치하면 SecureAI가 로그인을 허용합니다.

SecureAI는 **자사** 테넌트에서 발급한 토큰만 허용합니다. 로그인은 자사 디렉터리로 고정되며, 다중 테넌트 엔드포인트(`common` / `organizations`)는 절대 사용되지 않습니다.

## 1단계: SecureAI에서 리디렉션 URI 복사

1. 관리자로 SecureAI에 로그인합니다.
2. **관리자 → 통합**으로 이동하여 **IAM** 카테고리로 필터링합니다.
3. **Microsoft Entra ID (SSO)** 카드에서 **통합 연결**을 클릭합니다.
4. **1. Register SecureAI in Microsoft Entra ID** 섹션에서 **Redirect URI** 옆의 **Copy**를 클릭합니다.

URI는 다음과 같은 형식입니다(도메인은 사용 중인 인스턴스의 도메인).

```
https://<your-company>.hiperai.ai/api/auth/azure/callback
```

항상 인스턴스에 표시되는 URI를 사용하세요. `https://`를 포함하여 한 글자도 빠짐없이 정확히 일치해야 합니다.

이 창은 열어 두세요. 나중에 돌아와서 세부 정보를 붙여 넣습니다.

## 2단계: Microsoft Entra ID에 애플리케이션 등록

1. [Microsoft Entra 관리 센터](https://entra.microsoft.com)(또는 [Azure Portal](https://portal.azure.com) → **Microsoft Entra ID**)를 엽니다.

<div class="mac-window">
  ![Searching for Microsoft Entra ID in the Azure portal](/img/microsoft%20entraid%20sso%20images/1%20-%20azure.png)
</div>

2. **애플리케이션 → 앱 등록**(Applications → App registrations)으로 이동합니다.

<div class="mac-window">
  ![App registrations menu](/img/microsoft%20entraid%20sso%20images/2%20-%20azure.png)
</div>

3. **+ 새 등록**(New registration)을 클릭합니다.

<div class="mac-window">
  ![New registration button](/img/microsoft%20entraid%20sso%20images/3%20-%20azure.png)
</div>

4. 양식을 작성합니다.
   - **이름**: 알아보기 쉬운 이름(예: `SecureAI SSO`). 사용자에게 동의 화면에서 이 이름이 표시됩니다.
   - **지원되는 계정 유형**: **이 조직 디렉터리의 계정만(단일 테넌트)**(Accounts in this organizational directory only).
   - **리디렉션 URI**: 플랫폼으로 **웹**(Web)을 선택하고("단일 페이지 애플리케이션"이 아님) 1단계에서 복사한 URI를 붙여 넣습니다.
5. **등록**(Register)을 클릭합니다.

<div class="mac-window">
  ![Application registration form](/img/microsoft%20entraid%20sso%20images/4%20-%20azure.png)
</div>

6. 애플리케이션의 **개요**(Overview) 페이지에서 다음 값을 복사합니다.
   - **애플리케이션(클라이언트) ID** — `b96ee19f-5a15-4a85-b936-xxxxxxxxxxxx`와 같은 GUID.
   - **디렉터리(테넌트) ID** — `155812d2-1112-46c8-bf52-xxxxxxxxxxxx`와 같은 또 다른 GUID.

## 3단계: 클라이언트 비밀 만들기

1. 애플리케이션 메뉴에서 **인증서 및 비밀**(Certificates & secrets)을 엽니다.

<div class="mac-window">
  ![Certificates & secrets menu](/img/microsoft%20entraid%20sso%20images/5%20-%20azure.png)
</div>

2. **클라이언트 비밀**(Client secrets)에서 **+ 새 클라이언트 비밀**(New client secret)을 클릭합니다.
3. 설명(예: `SecureAI SSO`)을 입력하고 만료 기간을 선택합니다(Microsoft는 12개월 미만을 권장하며, 최대 24개월입니다).
4. **추가**(Add)를 클릭합니다.

<div class="mac-window">
  ![Add a client secret](/img/microsoft%20entraid%20sso%20images/6%20-%20azure.png)
</div>

5. **즉시** **값**(Value) 열을 복사합니다(`plm8Q~xxxxxxxx…`와 같은 형식). 이 값은 한 번만 표시됩니다.

<div class="mac-window">
  ![Client secret value](/img/microsoft%20entraid%20sso%20images/7%20-%20azure.png)
</div>

<Warning>
**비밀 ID**(Secret ID, GUID 형식)가 아니라 **값**(Value)을 복사하세요. 비밀 ID를 붙여 넣으면 SecureAI가 저장 시 이를 거부합니다.
</Warning>

만료 날짜를 기록해 두세요. 비밀이 만료되면 새 비밀을 입력할 때까지 Microsoft 로그인이 작동하지 않습니다([클라이언트 비밀 교체](#클라이언트-비밀-교체) 참조).

## 4단계: API 권한 검토

SecureAI는 Microsoft Graph 위임된 권한 `openid`, `profile`, `email` 및 `User.Read`를 요청합니다(`User.Read`는 사용자의 프로필 사진을 읽는 데 사용). `User.Read`는 새 앱 등록에 기본적으로 추가되어 있습니다.

1. 애플리케이션 메뉴에서 **API 권한**(API permissions)을 엽니다.
2. **Microsoft Graph → 위임된 권한**(Delegated permissions)에 `User.Read`가 포함되어 있는지 확인합니다. 목록에 명시적으로 표시하려면 `openid`, `profile`, `email`도 추가합니다(**+ 권한 추가 → Microsoft Graph → 위임된 권한**).

<div class="mac-window">
  ![Add delegated permissions](/img/microsoft%20entraid%20sso%20images/8%20-%20azure.png)
</div>

3. **＜조직 이름＞에 대한 관리자 동의 허용**(Grant admin consent)을 클릭하고 확인합니다.

<div class="mac-window">
  ![Grant admin consent](/img/microsoft%20entraid%20sso%20images/9%20-%20azure.png)
</div>

테넌트에서 사용자가 애플리케이션에 동의하는 것을 허용하지 않는 경우(기업에서 흔한 설정) 이 단계는 필수입니다. 이 단계를 수행하지 않으면 사용자가 로그인할 때 "관리자 승인 필요"(Need admin approval)가 표시됩니다.

## 5단계: SecureAI에 세부 정보 입력 및 테스트

**관리자 → 통합 → Microsoft Entra ID (SSO)**로 돌아갑니다.

1. **2. Paste the app registration details**에서 다음 항목을 입력합니다.
   - **Directory (tenant) ID**(디렉터리(테넌트) ID): 2단계의 GUID(`contoso.onmicrosoft.com`과 같은 테넌트의 확인된 도메인도 사용 가능).
   - **Application (client) ID**(애플리케이션(클라이언트) ID): 2단계의 GUID.
   - **Client secret value**(클라이언트 비밀 값): 3단계의 값.
   - **Allowed email domains**(허용된 이메일 도메인, 선택 사항, 권장): 조직의 이메일 도메인을 쉼표로 구분하여 입력합니다(예: `contoso.com, contoso.co.uk`). 이 주소만 Microsoft로 로그인할 수 있습니다. 비워 두면 SecureAI에 존재하는 테넌트의 모든 계정이 허용됩니다.
2. **3. Test the connection**에서 **Test connection**(연결 테스트)을 클릭합니다. SecureAI는 (누구도 로그인시키지 않고) Microsoft에 확인하여 다음 항목을 검사합니다.

   | 검사 항목 | 실패한 경우 |
   |---|---|
   | 디렉터리(테넌트) ID | Microsoft가 해당 테넌트를 알지 못합니다(`AADSTS90002`). 개요 페이지에서 디렉터리 ID를 복사하세요. |
   | 애플리케이션(클라이언트) ID | 테넌트에 해당 애플리케이션이 없습니다(`AADSTS700016`). 클라이언트 ID와 앱이 같은 테넌트에 있는지 확인하세요. |
   | 클라이언트 비밀 | 비밀이 유효하지 않거나(`AADSTS7000215`) 만료되었습니다(`AADSTS7000222`). **값**(Value)을 붙여 넣거나 새 비밀을 만드세요. |

   테스트는 양식에 입력된 내용을 사용하므로 저장하기 전에 테스트할 수 있습니다. 테넌트에 앱 전용 토큰을 차단하는 조건부 액세스 정책이 있는 경우 비밀이 "could not be verified automatically"(자동으로 확인할 수 없음)로 표시될 수 있습니다. 이는 오류가 아니므로 실제 로그인으로 확인하세요.

3. **Show "Continue with Microsoft" on the login page**(로그인 페이지에 "Continue with Microsoft" 표시)를 켭니다.
4. **Save**(저장)를 클릭합니다.

이후 카드에 **Active on the login page**(로그인 페이지에서 활성)가 표시되고, 인스턴스의 로그인 페이지에 **Continue with Microsoft** 버튼이 나타납니다.

## 6단계: 사용자 추가

SecureAI는 처음 로그인할 때 **계정을 자동으로 만들지 않습니다**. Microsoft로 로그인할 모든 사용자가 SecureAI에 존재하고 활성 상태여야 합니다. SecureAI 계정의 이메일은 Entra ID의 사용자 이메일(**메일** 특성, 비어 있으면 **사용자 계정 이름(UPN)**)과 일치해야 합니다. 대소문자는 구분하지 않습니다.

- **기존 사용자**: 이미 SecureAI 계정이 있는 사용자(비밀번호를 사용하는 경우 포함)는 다시 만들어지지 않습니다. 계속 비밀번호로 로그인할 수 있으며 Microsoft로도 로그인할 수 있습니다.
- **SSO 전용 신규 사용자**: **관리자 → IAM 관리 → 사용자 관리 → 사용자 추가**에서 인증 방법으로 **비즈니스 계정 / SSO**를 선택합니다. 사용자는 비밀번호 생성 이메일을 받지 않으며 **Continue with Microsoft**로 바로 로그인합니다.
- **다수의 사용자**: SCIM을 사용하여 Entra ID에서 사용자를 자동으로 프로비저닝 및 프로비저닝 해제할 수 있습니다.

SecureAI에서 사용자가 비활성화되면(수동 또는 SCIM을 통해) 해당 사용자는 SSO로도 로그인할 수 없습니다.

## 로그인 테스트

1. 시크릿(비공개) 창에서 인스턴스의 로그인 페이지를 엽니다.
2. **Continue with Microsoft**를 클릭합니다.
3. 회사 계정을 선택하고 메시지가 표시되면 MFA를 완료합니다.
4. Microsoft가 SecureAI로 다시 보내며 로그인된 상태가 됩니다.

비밀번호 로그인은 계속 작동합니다. SSO를 활성화해도 비밀번호 로그인이 꺼지지 않습니다.

## 통합 비활성화 또는 제거

- 구성을 유지하면서 버튼을 숨기려면 스위치를 끄고 저장합니다.
- 구성을 삭제하려면 **Remove configuration**(구성 제거)을 사용합니다. 이전에 Hiper AI가 SSO를 구성한 인스턴스에서는 해당 구성이 다시 적용됩니다.

## 클라이언트 비밀 교체

비밀이 만료되기 전에 다음을 수행합니다.

1. Entra ID에서 이전 비밀을 삭제하지 않고 새 클라이언트 비밀을 만듭니다(3단계).
2. SecureAI에서 통합을 열고 **Client secret value**에 새 값을 붙여 넣은 다음 **Test connection**을 클릭하고 **Save**를 클릭합니다. 필드를 비워 두면 현재 비밀이 유지됩니다.
3. 로그인이 작동하는 것을 확인한 후 Entra ID에서 이전 비밀을 삭제합니다.

변경 사항은 활성 세션을 종료하지 않고 즉시 적용됩니다.

## 인스턴스에 Hiper AI가 구성한 SSO가 이미 있는 경우

요청에 따라 Hiper AI가 Microsoft SSO를 구성한 인스턴스에서는 카드에 **Configured by Hiper AI**(Hiper AI가 구성함)가 표시됩니다. 해당 구성은 계속 작동합니다. 통합에서 자체 구성을 저장하면 기존 구성을 대체하며, 나중에 자체 구성을 제거하면 이전 구성이 다시 적용됩니다.

## 문제 해결

로그인 오류는 SecureAI 로그인 페이지에 표시됩니다.

| SecureAI 메시지 | 원인 및 해결 방법 |
|---|---|
| "User not found in SecureAI database." | 해당 이메일의 SecureAI 계정이 없습니다. 계정을 만들거나(6단계) 이메일이 Entra ID의 메일/UPN과 일치하는지 확인하세요. |
| "This account is not allowed to sign in here…" | 이메일의 도메인이 **Allowed email domains**에 없거나, 토큰이 다른 테넌트에서 발급되었습니다. |
| "This sign-in method is not enabled for your organization." | 통합이 비활성화되었거나 구성이 완료되지 않았습니다. 통합에서 카드를 확인하세요. |
| "Your identity provider did not complete the sign-in…" | Microsoft가 오류를 반환했습니다. 사용자가 취소했거나, 관리자 동의가 없거나(4단계), 사용자가 애플리케이션에 할당되지 않았을 수 있습니다. |
| "Single sign-on could not be completed…" | 코드 교환에 실패했습니다. 일반적으로 비밀이 만료되었거나 교체되었기 때문입니다. **Test connection**을 사용하세요. |
| "Your account is inactive…" | SecureAI에서 계정이 비활성화되었습니다. |
| "The sign-in session expired or was not started from this browser…" | 10분 이상 지났거나 다른 탭/브라우저에서 로그인이 시작되었습니다. 로그인 페이지에서 다시 시도하세요. |

Microsoft에서 표시하는 오류(SecureAI로 돌아오기 전):

- **AADSTS50011 – 리디렉션 URI가 일치하지 않음**: Entra ID에 등록된 URI가 1단계에서 SecureAI에 표시되는 URI와 정확히 일치하지 않거나, **웹**이 아닌 "단일 페이지 애플리케이션"으로 등록되었습니다.
- **AADSTS65001 / "관리자 승인 필요"**: 관리자 동의를 부여하세요(4단계).
- **AADSTS50105 – 로그인한 사용자가 애플리케이션의 역할에 할당되지 않음**: 엔터프라이즈 애플리케이션의 **할당 필요?**(Assignment required?)가 **예**로 설정되어 있습니다. **엔터프라이즈 애플리케이션 → SecureAI SSO → 사용자 및 그룹**(Enterprise applications → SecureAI SSO → Users and groups)에서 사용자 또는 그룹을 할당하세요.
- **AADSTS7000215 / AADSTS7000222**: 비밀이 유효하지 않거나 만료되었습니다. 새 비밀을 입력하세요.

도움이 필요하면 프로필 메뉴의 **지원 받기**에서 지원팀에 문의하고 애플리케이션(클라이언트) ID, 디렉터리 ID 및 오류 메시지를 포함하세요. **클라이언트 비밀은 절대 보내지 마세요.**