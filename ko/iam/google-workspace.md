---
sidebar_position: 2
title: "Google Workspace(SSO)"
---
# Google Workspace(SSO) 통합

이 가이드에서는 SecureAI를 사용하여 싱글 사인온(SSO)을 위해 Google Workspace를 구성하는 과정을 안내합니다. Google Cloud Console에서 필요한 사용자 인증 정보를 얻고 이를 제출하여 통합을 완료하는 방법을 알아봅니다.

## 전제 조건

- Google Cloud Console에 대한 관리자 액세스
- 조직의 Google Workspace 계정
- 조직의 Google Workspace 관리 콘솔에 액세스합니다(도메인 제한을 사용하는 경우)
- SecureAI에 대한 관리자 액세스

## 1단계: Google Cloud Console에서 프로젝트 만들기

1. [구글 클라우드 콘솔](https://console.cloud.google.com)에 로그인합니다.
2. 페이지 상단의 프로젝트 드롭다운을 클릭하세요.
3. **새 프로젝트**를 클릭합니다.

<div class="mac-window">
  ![새 프로젝트](/img/google%20sso%20images/google%20-%201.png)
</div>

4. 프로젝트 이름을 입력하세요(예: "SecureAI SSO")
5. **만들기**를 클릭하세요.

<div class="mac-window">
  ![프로젝트 만들기](/img/google%20sso%20images/google%20-%202.png)
</div>

## 2단계: Google+ API 활성화(필요한 경우)

1. 프로젝트에서 **API 및 서비스** > **라이브러리**로 이동합니다.
2. 'Google+ API' 또는 'Google ID'를 검색하세요.
3. 해당 항목을 클릭하고 **활성화**를 클릭합니다(아직 활성화되지 않은 경우).
4. **참고**: 최신 Google OAuth는 이를 요구하지 않을 수도 있지만 활성화하면 호환성이 보장됩니다.

## 3단계: OAuth 동의 화면 구성

1. **API 및 서비스** > **OAuth 동의 화면**으로 이동합니다.

<div class="mac-window">
  ![OAuth 동의 화면](/img/google%20sso%20images/google%20-%203.png)
</div>

2. 필수 정보를 입력하세요.
   - **앱 이름**: 이름을 입력하세요(예: "SecureAI")
   - **사용자 지원 이메일**: 지원 이메일 주소를 선택하세요.
   - **연락처 정보**: 연락처 이메일 주소를 추가하세요.

3. **사용자 유형**을 선택합니다.
   - **내부**: Google Workspace 조직의 사용자에게만 해당(회사용으로 권장)
   - **외부**: 조직 외부 사용자의 경우

4. **만들기**를 클릭하세요.

<div class="mac-window">
  ![OAuth 동의 생성](/img/google%20sso%20images/google%20-%204.png)
</div>

5. **브랜딩**:
   - 왼쪽 메뉴의 **브랜딩** 섹션으로 이동합니다.
   - **승인된 도메인**을 찾아 회사 도메인을 추가하세요.
   - 이를 통해 사용자는 회사 이메일 주소로 로그인할 수 있습니다.
   - (추가로 원하는 경우 홈페이지 URL, 개인정보취급방침, 서비스 약관을 추가할 수 있습니다.)

<div class="mac-window">
  ![승인된 도메인](/img/google%20sso%20images/google%20-%205.png)
</div>

6. **범위**:
   - 왼쪽 메뉴에서 **데이터 액세스** 섹션을 클릭합니다.
   - 데이터 액세스 섹션 내에서 **범위 추가 또는 제거**를 클릭합니다.
   - 역할을 검색할 수 있는 창이 왼쪽에 열립니다.
   - **"openid"** 역할을 검색하여 선택합니다.
   - **업데이트**를 클릭하세요.
   - 그런 다음 데이터 액세스 섹션에서 **저장**을 클릭합니다.
   - **참고**: `openid` 범위에는 `profile` 및 `email` 액세스가 자동으로 포함되므로 별도로 추가할 필요가 없습니다.
   - 다른 범위 옵션이 표시되면 SecureAI SSO용 **OpenID**만 필요합니다.

<div class="mac-window">
  ![OpenID 범위 선택](/img/google%20sso%20images/google%20-%206.png)
</div>

   - **중요**: OpenID 범위는 다음에 대한 액세스를 제공합니다.
     - 이용자의 이메일 주소
     - 기본 프로필 정보
     - SecureAI 인증에 필요한 전부입니다.

7. **사용자 테스트**(외부를 사용하는 경우):
   - 테스트 중에 필요한 경우 테스트 사용자를 추가하세요.
   - **저장하고 계속하기**를 클릭하세요.

8. **요약**:
   - 구성을 검토하세요
   - **대시보드로 돌아가기**를 클릭하세요.

## 4단계: OAuth 2.0 자격 증명 만들기

1. **API 및 서비스** > **자격 증명**으로 이동합니다.
2. **+ 자격 증명 만들기** > **OAuth 클라이언트 ID**를 클릭합니다.

<div class="mac-window">
  ![OAuth 클라이언트 ID 생성](/img/google%20sso%20images/google%20-%207.png)
</div>
3. **애플리케이션 유형**: **웹 애플리케이션**을 선택합니다.
4. **이름**: 설명적인 이름을 입력합니다(예: "SecureAI SSO 클라이언트")
5. **승인된 리디렉션 URI**: **+ URI 추가**를 클릭하고 다음을 입력합니다.
   - `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`
   - **중요**: URL은 정확히 일치해야 합니다(`https://` 및 `/api/auth/google/callback` 포함).

<div class="mac-window">
  ![승인된 리디렉션 URI](/img/google%20sso%20images/google%20-%208.png)
</div>

6. **만들기**를 클릭하세요.

## 5단계: 자격 증명 받기

OAuth 클라이언트를 생성한 후:

1. 자격 증명이 포함된 팝업이 나타납니다.

<div class="mac-window">
  ![OAuth 자격 증명 팝업](/img/google%20sso%20images/google%20-%209.png)
</div>
2. **클라이언트 ID**:
   - 다음과 같습니다: `123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com`
   - **이 값을 복사하세요** - 나중에 필요합니다.
3. **클라이언트 비밀번호**:
   - 다음과 같습니다: `GOCSPX-abcdefghijklmnopqrstuvwxyz`
   - **이 값을 즉시 복사하세요**
   - **경고**: 이 비밀은 팝업에 한 번만 표시됩니다. 분실한 경우 새 OAuth 클라이언트를 만들어야 합니다.

## 6단계: Hiper AI 팀에 변수 보내기

Google Cloud Console에서 OAuth 클라이언트를 만들고 위 단계를 수행하면 다음과 같은 중요한 정보를 얻게 됩니다.

1. **클라이언트 ID**(5단계)
2. **클라이언트 비밀번호**(5단계에서)
3. **리디렉션 URI**: `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`

SSO 통합을 완료하려면 이러한 값을 Hiper AI 팀에 보내야 합니다.

### A. 관리자 패널에 액세스합니다.

1. SecureAI 인스턴스에 관리자로 로그인합니다.
2. `https://{enterprise.name}.hiperai.ai/admin/home`로 이동합니다.
3. 오른쪽 상단에서 관리자 프로필 사진을 클릭하세요.
4. 다양한 옵션이 포함된 드롭다운 메뉴가 열립니다.

### B. 지원 요청 제출

1. 드롭다운 메뉴에서 **"지원 받기"**를 클릭하세요.

<div class="mac-window">
  ![지원 받기 메뉴](/img/microsoft%20entraid%20sso%20images/10%20-%20azure.png)
</div>

2. 지원 티켓 양식이 포함된 팝업창이 나타납니다.
3. 다음 정보로 양식을 작성하십시오.
   - **범주**: **"통합 및 구현"**을 선택합니다.

<div class="mac-window">
  ![지원 양식 카테고리](/img/microsoft%20entraid%20sso%20images/11%20-%20azure.png)
</div>

   - **제목**: **'Google Workspace SSO 통합'**을 입력하세요.
   - **설명**: 설정 과정에서 복사한 값을 붙여넣습니다.
     - 클라이언트 ID
     - 클라이언트 비밀
     - 리디렉션 URI: `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`
4. **"요청 제출"** 버튼을 클릭하세요

### C. 확인을 기다립니다.

- **24~72시간** 이내에 확인 이메일을 받게 됩니다(이용 가능 여부에 따라 다름).
- SSO가 성공적으로 구성되었음을 확인하는 이메일이 전송됩니다.
- 일단 구성되면 로그인 페이지의 **"Google로 계속하기"** 로그인 버튼을 사용하여 SecureAI 인스턴스에 액세스할 수 있습니다.

**중요**: 통합이 완료될 때까지 자격 증명을 안전하게 유지하세요. 안전하지 않은 채널을 통해 공유하지 마세요.

## 사용자 구성

### 기존 사용자

SecureAI에 이미 계정이 있는 사용자는 (기본 인증 사용 여부와 관계없이) **다시 생성할 필요가 없습니다**. 기존 계정을 계속 사용할 수 있으며 Google Workspace SSO가 구성되면 이를 사용하여 로그인할 수도 있습니다.

**중요**: SSO가 작동하려면 Google Workspace의 사용자 이메일이 SecureAI의 이메일과 정확히 일치해야 합니다.

### 새 SSO 사용자 만들기

SSO를 통해서만 SecureAI에 액세스해야 하는 신규 사용자의 경우:

1. SecureAI 관리자 패널에서 **사용자 관리**로 이동합니다.
2. 새 사용자를 생성하려면 클릭하세요.
3. 사용자 생성 시 **"비즈니스 계정 / SSO"** 옵션을 선택하세요.
4. 이 구성은 다음을 보장합니다.
   - 신규 사용자는 비밀번호를 생성하라는 이메일을 받지 않습니다**
   - 사용자는 **Google Workspace SSO** 로그인 버튼을 사용하여 SecureAI에 직접 액세스할 수 있습니다.
   - Google Workspace의 사용자 이메일은 SecureAI에 입력한 이메일과 정확히 일치해야 합니다.

## 문제 해결

### 오류: "redirect_uri_mismatch"

- Google Cloud Console의 리디렉션 URI가 서버에 구성된 것과 정확히 일치하는지 확인하세요.
- `https://`을 포함해야 합니다(프로덕션에는 `http://` 아님).
- 리디렉션 URI는 정확히 `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`이어야 합니다.
- 후행 슬래시나 오타가 있는지 확인하세요.

### 오류: "SecureAI 데이터베이스에서 사용자를 찾을 수 없습니다."

- 사용자는 SecureAI에 사전 등록되어 있어야 합니다.
- 사용자 계정 생성은 SecureAI 관리자에게 문의하세요.
- Google Workspace의 이메일 주소가 SecureAI의 이메일과 정확히 일치하는지 확인하세요.

### 오류: 'Google Workspace 로그인에 이메일 도메인이 허용되지 않습니다.'

- 사용자의 이메일 도메인이 허용 도메인 목록에 없습니다.
- 허용 목록에 도메인을 추가하려면 개발팀에 문의하세요.
- 또는 도메인 제한 구성이 올바른지 확인하십시오.

### 오류: "access_denied" 또는 "unauthorized_client"

- OAuth 동의 화면이 올바르게 구성되었는지 확인하세요.
- 신청이 승인되었는지 확인하세요. (외부 사용자 유형을 사용하는 경우)
- 클라이언트 ID와 클라이언트 비밀번호가 올바른지 확인하세요.

### 오류: "invalid_client"

- 클라이언트 비밀번호가 재설정되었거나 올바르지 않을 수 있습니다.
- Google Cloud Console에서 클라이언트 비밀번호 확인
- 필요한 경우 새 클라이언트 비밀번호를 생성하고 개발팀에 새로운 가치를 제공하세요.

## 클라이언트 비밀 보안 모범 사례

1. **코드 저장소에 비밀을 커밋하지 마세요**
2. **비밀번호를 주기적으로 순환**(권장: 90일마다)
3. Google Cloud Console 사용자 인증 정보 페이지에 대한 **액세스 제한**
4. 개발팀과 비밀을 공유할 때 **보안 채널을 사용**하세요.
5. 의심스러운 활동이 있는지 Google Cloud Console에서 **사용량 모니터링**

## 클라이언트 비밀 갱신

클라이언트 비밀번호를 교체하려면(90일마다 권장):

1. **API 및 서비스** > **자격 증명**으로 이동합니다.
2. OAuth 2.0 클라이언트 ID 찾기
3. **연필 아이콘**(편집)을 클릭합니다.
4. **클라이언트 비밀번호** 섹션에서 **비밀 재설정**을 클릭합니다.
5. 새 비밀 값을 **즉시 복사**
6. 관리자 패널 지원 요청을 통해 개발팀에 새로운 비밀을 제공하세요.
7. 서비스를 중단하지 않고 구성을 업데이트합니다.
8. 새 비밀이 작동하는지 확인한 후 선택적으로 이전 비밀을 삭제할 수 있습니다.

**참고**: 순환 중에 두 보안 비밀이 모두 작동하는 짧은 중첩 기간이 있으므로 원활한 전환이 가능합니다.

## SSO 로그인 테스트

구성이 완료된 후:

1. SecureAI 로그인 페이지로 이동합니다.
2. **Google로 계속하기**를 클릭하세요.
3. Google Workspace 계정을 선택하세요.
4. 메시지가 표시되면 권한 부여
5. SecureAI로 리디렉션되어 로그인되어야 합니다.

문제가 발생하는 경우:
- 브라우저 쿠키를 삭제하고 다시 시도해 보세요.
- 올바른 Google Workspace 계정을 사용하고 있는지 확인하세요.
- SecureAI에 이메일이 있는지 확인하세요.

## 지원

구성 중에 문제가 발생하는 경우:

1. Google Cloud Console에서 관리자 권한이 있는지 확인하세요.
2. Google Workspace 관리자 액세스 권한이 있는지 확인하세요(도메인 제한이 사용되는 경우).
3. 관리자 패널 지원 요청을 통해 개발팀에 문의하세요.
   - 오류 스크린샷
   - 클라이언트 ID(공유 가능 - 민감하지 않음)
   - 전체 오류 메시지
   - 관련 브라우저 콘솔 오류

**지원 요청 시 클라이언트 비밀번호를 절대 공유하지 마세요** - 신원 확인이 완료된 후 보안 채널을 통해서만 공유하세요.

## 추가 리소스

- [Google Cloud 콘솔 문서](https://cloud.google.com/docs)
- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2)
- [Google Workspace 관리자 도움말](https://support.google.com/a)