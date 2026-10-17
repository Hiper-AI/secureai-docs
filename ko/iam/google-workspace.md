---
sidebar_position: 2
title: "Google Workspace (SSO)"
sidebar_label: "Google Workspace (SSO)"
---

# Google Workspace (SSO) 통합

이 통합을 사용하면 조직의 사용자가 Google Workspace 계정으로 SecureAI에 로그인할 수 있습니다(**Continue with Google** 버튼). 설정은 **셀프 서비스** 방식입니다. 조직의 관리자가 자체 Google Cloud 프로젝트에 OAuth 클라이언트를 만들고 **관리자 → 통합**에서 세부 정보를 입력합니다. 티켓을 열 필요도, Hiper AI의 처리를 기다릴 필요도 없습니다. 저장하는 즉시 로그인 페이지에 버튼이 표시됩니다.

예상 소요 시간: 10분.

## 사전 요구 사항

- **Google Workspace 조직 내**의 Google Cloud 프로젝트와, 해당 프로젝트에서 Google 인증 플랫폼(Google Auth Platform)을 구성하고 OAuth 클라이언트를 만들 수 있는 권한(예: 프로젝트 **소유자**(Owner) 또는 **편집자**(Editor) 역할).
- SecureAI 관리자 액세스 권한 및 **통합** 섹션에 대한 **Admin** 권한.

## 작동 방식

1. Google Cloud에서 **유형이 "웹 애플리케이션"인 OAuth 2.0 클라이언트**를 만듭니다. SecureAI는 `openid`, `email`, `profile` 범위를 사용하는 OpenID Connect를 사용합니다.
2. SecureAI에 **클라이언트 ID**, **클라이언트 보안 비밀번호** 및 **Google Workspace 도메인**을 입력합니다. 보안 비밀번호는 암호화되어 저장되며 다시 표시되지 않습니다.
3. 사용자가 **Continue with Google**을 클릭하면 Google이 사용자를 인증하고, SecureAI는 다음 조건을 모두 충족하는 경우에만 로그인을 허용합니다.
   - Google이 사용자의 이메일을 인증했을 것
   - 계정이 **자사 Workspace 도메인 중 하나에서 관리**될 것(`hd` 클레임)
   - 이메일이 SecureAI의 **활성** 계정과 일치할 것

개인 Google 계정(예: @gmail.com 계정 또는 회사 이메일로 만든 개인 계정)은 SecureAI 사용자와 이메일이 같더라도 로그인할 수 **없습니다**.

## 1단계: SecureAI에서 리디렉션 URI 복사

1. 관리자로 SecureAI에 로그인합니다.
2. **관리자 → 통합**으로 이동하여 **IAM** 카테고리로 필터링합니다.
3. **Google Workspace (SSO)** 카드에서 **통합 연결**을 클릭합니다(카드에 **Configured by Hiper AI**(Hiper AI가 구성함)가 표시되어 있으면 **재구성**을 클릭합니다).
4. **1. Create an OAuth client in Google Cloud** 섹션에서 **Redirect URI** 옆의 **Copy**를 클릭합니다.

URI는 다음과 같은 형식입니다(도메인은 사용 중인 인스턴스의 도메인).

```
https://<your-company>.hiperai.ai/api/auth/google/callback
```

항상 인스턴스에 표시되는 URI를 사용하세요. `https://`를 포함하여 정확히 일치해야 합니다.

## 2단계: Google Cloud 프로젝트 선택 또는 만들기

1. [Google Cloud 콘솔](https://console.cloud.google.com)을 엽니다.
2. 상단 바의 프로젝트 선택기에서 조직의 프로젝트를 선택하거나 **새 프로젝트**(New Project)를 클릭합니다.

<div class="mac-window">
  ![New project](/img/google%20sso%20images/google%20-%201.png)
</div>

3. 새로 만드는 경우: 이름을 지정하고(예: `SecureAI SSO`), **조직**(Organization)이 자사 Google Workspace 조직인지 확인한 다음 **만들기**(Create)를 클릭합니다.

<div class="mac-window">
  ![Create project](/img/google%20sso%20images/google%20-%202.png)
</div>

로그인을 위해 API를 사용 설정할 필요는 없습니다.

## 3단계: Google 인증 플랫폼(동의 화면) 구성

1. 메뉴에서 **API 및 서비스 → OAuth 동의 화면**(APIs & Services → OAuth consent screen)으로 이동합니다(새 콘솔에서는 **Google 인증 플랫폼**(Google Auth Platform)이라고 합니다). 처음인 경우 **시작하기**(Get started)를 클릭합니다.

<div class="mac-window">
  ![OAuth consent screen](/img/google%20sso%20images/google%20-%203.png)
</div>

2. **앱 정보**(App information): 앱 이름(예: `SecureAI`)과 사용자 지원 이메일.
3. **대상**(Audience): **내부**(Internal)를 선택합니다. Google Workspace 조직의 계정만 앱을 사용할 수 있으며, Google의 앱 인증이 필요하지 않습니다.
4. **연락처 정보**(Contact information): Google의 알림을 받을 이메일.
5. 사용자 데이터 정책에 동의하고 **만들기**(Create)를 클릭합니다.

<div class="mac-window">
  ![Create the OAuth configuration](/img/google%20sso%20images/google%20-%204.png)
</div>

`openid`, `email`, `profile` 범위는 민감한 범위가 아니므로 **데이터 액세스**(Data access)에 추가할 필요가 없습니다.

<Note>
**외부**(External)를 선택하는 경우 앱은 "테스트"가 아닌 **프로덕션 단계**(In production)여야 합니다. 테스트 모드에서는 등록한 테스트 사용자만 로그인할 수 있습니다. 외부를 선택하더라도 SecureAI는 5단계에서 구성한 Workspace 도메인의 계정만 허용합니다.
</Note>

## 4단계: OAuth 클라이언트 만들기

1. Google 인증 플랫폼에서 **클라이언트**(Clients)로 이동합니다(또는 **API 및 서비스 → 사용자 인증 정보 → + 사용자 인증 정보 만들기 → OAuth 클라이언트 ID**).

<div class="mac-window">
  ![Create OAuth client ID](/img/google%20sso%20images/google%20-%207.png)
</div>

2. **+ 클라이언트 만들기**(Create client)를 클릭합니다.
3. **애플리케이션 유형**(Application type): **웹 애플리케이션**(Web application).
4. **이름**(Name): 예: `SecureAI SSO`.
5. **승인된 리디렉션 URI**(Authorized redirect URIs)에서 **+ URI 추가**(Add URI)를 클릭하고 1단계의 URI를 붙여 넣습니다(**승인된 JavaScript 원본**(Authorized JavaScript origins)은 필요하지 않습니다).

<div class="mac-window">
  ![Authorized redirect URIs](/img/google%20sso%20images/google%20-%208.png)
</div>

6. **AI 기반 에이전트에 이 클라이언트 사용**(Use this client for an AI-powered agent)은 선택하지 않은 상태로 둡니다. 다른 유형의 클라이언트를 위한 옵션이며 SecureAI에는 필요하지 않습니다.
7. **만들기**(Create)를 클릭합니다.
8. 표시되는 대화상자에서 **클라이언트 ID**(`.apps.googleusercontent.com`으로 끝남)와 **클라이언트 보안 비밀번호**(`GOCSPX-`로 시작)를 복사합니다. 백업용으로 JSON을 다운로드할 수도 있습니다. 복사를 마칠 때까지 대화상자를 닫지 마세요.

<div class="mac-window">
  ![OAuth client created](/img/google%20sso%20images/google%20-%209.png)
</div>

<Warning>
Google은 보안 비밀번호 전체를 생성 시에만 표시합니다. 안전한 곳에 보관하세요. 분실한 경우 클라이언트에 새 보안 비밀번호를 추가하세요.
</Warning>

Google은 새 클라이언트나 클라이언트의 URI 변경 사항이 적용되기까지 5분에서 몇 시간까지 걸릴 수 있다고 안내합니다. 5단계에서 **Test connection**이 방금 만든 리디렉션 URI나 클라이언트 ID를 문제로 표시하면, 아무것도 변경하지 말고 몇 분 기다린 후 다시 테스트하세요.

## 5단계: SecureAI에 세부 정보 입력 및 테스트

**관리자 → 통합 → Google Workspace (SSO)**로 돌아갑니다.

1. **2. Paste the OAuth client details**에서 다음 항목을 입력합니다.
   - **Client ID**(클라이언트 ID): 4단계에서 복사한 값.
   - **Client secret**(클라이언트 보안 비밀번호): 4단계에서 복사한 값.
   - **Allowed email domains**(허용된 이메일 도메인, 필수): Google Workspace 기본 도메인과, 사용하는 경우 보조 도메인을 쉼표로 구분하여 입력합니다. 예: `contoso.com, contoso.co.uk`.
2. **3. Test the connection**에서 **Test connection**(연결 테스트)을 클릭합니다. SecureAI는 (누구도 로그인시키지 않고) Google에 확인하여 다음 항목을 검사합니다.

   | 검사 항목 | 실패한 경우 |
   |---|---|
   | 클라이언트 ID | Google이 해당 클라이언트를 알지 못합니다(`invalid_client`). ID 전체를 복사했는지, 클라이언트가 삭제되거나 사용 중지되지 않았는지 확인하세요. |
   | 클라이언트에 등록된 리디렉션 URI | 1단계의 URI가 **승인된 리디렉션 URI**에 없습니다(`redirect_uri_mismatch`). 정확히 추가하고 몇 분 기다리세요. |
   | 클라이언트 보안 비밀번호 | 보안 비밀번호가 해당 클라이언트의 것이 아닙니다(`invalid_client`). 다시 붙여 넣거나 새 보안 비밀번호를 추가하세요. |

   테스트는 양식에 입력된 내용을 사용하므로 저장하기 전에 테스트할 수 있습니다.
3. **Show "Continue with Google" on the login page**(로그인 페이지에 "Continue with Google" 표시)가 켜져 있는지 확인합니다(처음에는 기본적으로 켜져 있습니다). 도메인을 입력하지 않으면 SecureAI에서 켜진 상태로 저장할 수 없습니다.
4. **Save**(저장)를 클릭합니다.

이후 카드에 **Active on the login page**(로그인 페이지에서 활성)가 표시되고, 인스턴스의 로그인 페이지에 **Continue with Google** 버튼이 나타납니다.

## 6단계: 사용자 추가

SecureAI는 처음 로그인할 때 **계정을 자동으로 만들지 않습니다**. Google로 로그인할 모든 사용자가 SecureAI에 존재하고 활성 상태여야 하며, Google Workspace 계정과 **동일한 이메일**을 사용해야 합니다(대소문자는 구분하지 않으며, `+` 별칭은 허용되지 않습니다).

- **기존 사용자**: 이미 SecureAI 계정이 있는 사용자(비밀번호를 사용하는 경우 포함)는 다시 만들어지지 않습니다. 계속 비밀번호로 로그인할 수 있으며 Google로도 로그인할 수 있습니다.
- **SSO 전용 신규 사용자**: **관리자 → IAM 관리 → 사용자 관리 → 사용자 추가**에서 인증 방법으로 **비즈니스 계정 / SSO**를 선택합니다. 사용자는 비밀번호 생성 이메일을 받지 않으며 **Continue with Google**로 바로 로그인합니다.

SecureAI에서 사용자가 비활성화되면 해당 사용자는 SSO로도 로그인할 수 없습니다.

## 로그인 테스트

1. 시크릿(비공개) 창에서 인스턴스의 로그인 페이지를 엽니다.
2. **Continue with Google**을 클릭합니다.
3. Google Workspace 계정을 선택합니다.
4. Google이 SecureAI로 다시 보내며 로그인된 상태가 됩니다.

비밀번호 로그인은 계속 작동합니다. SSO를 활성화해도 비밀번호 로그인이 꺼지지 않습니다.

## 통합 비활성화 또는 제거

- 구성을 유지하면서 버튼을 숨기려면 스위치를 끄고 저장합니다.
- 구성을 삭제하려면 **Remove configuration**(구성 제거)을 사용합니다. 이전에 Hiper AI가 SSO를 구성한 인스턴스에서는 해당 구성이 다시 적용됩니다.

## 클라이언트 보안 비밀번호 교체

1. Google Cloud에서 OAuth 클라이언트를 열고 **보안 비밀 추가**(Add secret)를 클릭합니다(이전 보안 비밀번호는 계속 작동합니다).
2. SecureAI에서 **Client secret**에 새 값을 붙여 넣은 다음 **Test connection**을 클릭하고 **Save**를 클릭합니다. 필드를 비워 두면 현재 보안 비밀번호가 유지됩니다.
3. 로그인이 작동하는 것을 확인한 후 Google Cloud에서 이전 보안 비밀번호를 사용 중지하고 삭제합니다.

변경 사항은 활성 세션을 종료하지 않고 즉시 적용됩니다.

## 인스턴스에 Hiper AI가 구성한 SSO가 이미 있는 경우

요청에 따라 Hiper AI가 Google SSO를 구성한 인스턴스에서는 카드에 **Configured by Hiper AI**(Hiper AI가 구성함)가 표시됩니다. 해당 구성은 계속 작동합니다. 통합에서 자체 구성을 저장하면 기존 구성을 대체하며, 나중에 자체 구성을 제거하면 이전 구성이 다시 적용됩니다.

## 문제 해결

로그인 오류는 SecureAI 로그인 페이지에 표시됩니다.

| SecureAI 메시지 | 원인 및 해결 방법 |
|---|---|
| "User not found in SecureAI database." | 해당 이메일의 SecureAI 계정이 없습니다. 계정을 만드세요(6단계). |
| "This account is not allowed to sign in here…" | 계정이 **Allowed email domains** 중 어디에도 속하지 않거나, 개인 Google 계정(Workspace 아님)입니다. 도메인을 추가하거나 회사 계정을 사용하세요. |
| "Your identity provider has not verified this email address." | Google이 이메일을 인증된 것으로 표시하지 않았거나, 이메일에 SecureAI가 허용하지 않는 문자(예: `+` 별칭)가 포함되어 있습니다. |
| "This sign-in method is not enabled for your organization." | 통합이 비활성화되었거나 구성이 완료되지 않았습니다. 통합에서 카드를 확인하세요. |
| "Your identity provider did not complete the sign-in…" | Google이 오류를 반환했습니다(예: 사용자가 취소한 경우). |
| "Single sign-on could not be completed…" | 코드 교환에 실패했습니다. 일반적으로 보안 비밀번호가 교체되었거나 삭제되었기 때문입니다. **Test connection**을 사용하세요. |
| "The sign-in session expired or was not started from this browser…" | 10분 이상 지났거나 다른 탭/브라우저에서 로그인이 시작되었습니다. 로그인 페이지에서 다시 시도하세요. |

Google에서 표시하는 오류(SecureAI로 돌아오기 전):

- **Error 400: redirect_uri_mismatch**: 클라이언트의 리디렉션 URI가 1단계의 URI와 정확히 일치하지 않습니다. (JavaScript 원본이 아닌) **승인된 리디렉션 URI**에서 수정하세요.
- **Error 403: org_internal**: 앱이 **내부**로 설정되어 있으며 계정이 프로젝트를 소유한 Google Cloud 조직에 속하지 않습니다. 회사에 Google 조직이 둘 이상 있고(예: `company.com`과 `company.ai`) OAuth 클라이언트가 다른 조직의 프로젝트에서 생성된 경우에도 발생합니다. 사용자가 속한 조직의 프로젝트에서 생성하세요(콘솔의 프로젝트 선택기에 각 프로젝트의 조직이 표시됩니다).
- **Error 401: invalid_client / deleted_client**: OAuth 클라이언트가 없거나 삭제되었습니다. 새 클라이언트를 만들고 SecureAI를 업데이트하세요.
- **"액세스 차단됨: 관리자가 이 앱을 신뢰하지 않음"**("Access blocked: your administrator has not trusted this app"): Workspace의 앱 액세스 제어가 서드 파티 앱을 차단하고 있습니다. Google 관리 콘솔(**보안 → 액세스 및 데이터 관리 → API 관리 → 서드 파티 앱 액세스 관리**)에서 클라이언트 ID를 **신뢰할 수 있음**(Trusted)으로 설정하세요.

도움이 필요하면 프로필 메뉴의 **지원 받기**에서 지원팀에 문의하고 클라이언트 ID와 오류 메시지를 포함하세요. **클라이언트 보안 비밀번호는 절대 보내지 마세요.**

## 추가 자료

- [Google Cloud에서 OAuth 2.0 설정하기](https://support.google.com/cloud/answer/6158849)
- [Google의 OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect)
- [Google Workspace 데이터에 액세스하는 서드 파티 앱 관리](https://support.google.com/a/answer/7281227)