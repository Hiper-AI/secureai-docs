---
sidebar_position: 1
title: "Google Drive — Add from Drive"
sidebarTitle: "Google Drive"
icon: "/img/icons/google-drive.svg"
sidebar_label: "Google Drive"
description: "사용자가 SecureAI 채팅에서 Google 드라이브와 공유 드라이브의 파일을 첨부할 수 있도록 설정합니다. 귀사의 Google Cloud OAuth 클라이언트를 사용하는 셀프서비스 방식입니다."
---

# Google Drive — Add from Drive

이 연동을 사용하면 사용자가 첨부 버튼의 **Add from Drive** 옵션을 통해 **Google 드라이브**(내 드라이브, 나와 공유됨, **공유 드라이브**)의 파일을 채팅에서 바로 첨부할 수 있습니다.

설정은 **셀프서비스**입니다. 귀사의 관리자가 **귀사의 Google Cloud 프로젝트**에서 OAuth 클라이언트와 API 키를 만들고 **Admin → Integrations → Files**에 등록합니다. 티켓을 열거나 Hiper AI를 기다릴 필요가 없습니다. 설정을 저장하는 즉시 채팅에 옵션이 표시됩니다.

예상 소요 시간: 10분.

## 작동 방식

1. 사용자가 **Attach → Add from Drive**를 클릭합니다. 처음에는 Google이 **본인 계정**으로 로그인하고 SecureAI를 승인하도록 요청합니다.
2. **Google 드라이브 공식 선택기**(Google Picker)가 열립니다. 사용자가 파일을 하나 이상 선택합니다.
3. 사용자의 브라우저가 사용자 본인의 토큰으로 **선택한 파일만** 다운로드하여 메시지에 첨부합니다. Google 문서는 Office 형식으로 내보내집니다(Docs → `.docx`, Sheets → `.xlsx`, Slides → `.pptx`, 그 외는 PDF).
4. 파일은 다른 첨부 파일과 동일한 경로를 따릅니다. 모델에 도달하기 전에 **DLP**와 귀사의 정책을 거칩니다.

<Info>
**SecureAI는 귀사의 드라이브 전체를 볼 수 없습니다.** `drive.file` 범위를 사용합니다. SecureAI는 각 사용자가 선택기에서 선택한 파일만 읽을 수 있으며, 그 외에는 읽을 수 없습니다. 서비스 계정, 도메인 전체 위임, 백그라운드 읽기가 없습니다. 사용자는 드라이브에서 이미 열 수 있는 파일만 첨부할 수 있습니다.
</Info>

## 사전 요구 사항

- **Google Workspace 조직 내**의 Google Cloud 프로젝트와, 해당 프로젝트에서 API를 사용 설정하고 Google Auth Platform을 구성하며 사용자 인증 정보를 만들 수 있는 권한(예: 프로젝트의 **소유자** 또는 **편집자** 역할).
- SecureAI 관리자 액세스 권한(**Integrations** 섹션에 대한 **Administrator** 권한).
- **Attach from Drive / SharePoint**가 포함된 SecureAI 요금제. 포함되어 있지 않아도 설정은 미리 해 둘 수 있지만, 사용자에게는 옵션이 표시되지 않습니다.

## 1단계: SecureAI에서 주소 복사

1. 관리자로 SecureAI에 로그인합니다.
2. **Admin → Integrations**로 이동하여 **Files** 카테고리로 필터링합니다.
3. **Google Drive** 카드에서 **Connect integration**을 클릭합니다.

<div class="mac-window">
  ![Files 카테고리의 카드](/img/files/google-drive/1%20-%20Google%20Drive.png)
</div>

4. **1. Set up Google Cloud** 섹션에 Google Cloud에서 필요한 두 가지 값이 있으며, 각각 **Copy** 버튼이 있습니다.
   - **Authorized JavaScript origin**: 귀사 인스턴스의 주소입니다. 예: `https://<회사명>.hiperai.ai`
   - **Website restriction for the API key**: 같은 주소 끝에 `/*`를 붙인 값입니다.

<div class="mac-window">
  ![SecureAI 사이드 패널의 출처와 제한 값](/img/files/google-drive/2%20-%20Google%20Drive.png)
</div>

항상 귀사의 인스턴스에 표시되는 값을 사용하십시오. `https://`를 포함하여 정확히 일치해야 하며, 출처 끝에는 `/`를 붙이지 않습니다.

## 2단계: 프로젝트 선택 및 API 사용 설정

1. [Google Cloud 콘솔](https://console.cloud.google.com)을 열고 상단 표시줄의 프로젝트 선택기에서 귀사 조직의 프로젝트를 선택합니다(또는 `SecureAI Drive` 같은 이름으로 새로 만듭니다).
2. **API 및 서비스 → 라이브러리**(APIs & Services → Library)로 이동하여 **Google Drive API**를 검색하고 **사용**(Enable)을 클릭합니다.

<div class="mac-window">
  ![Google Drive API 사용 설정](/img/files/google-drive/3%20-%20Google%20Drive.jpg)
</div>

3. **Google Picker API**에 대해서도 같은 작업을 반복합니다.

<div class="mac-window">
  ![Google Picker API 사용 설정](/img/files/google-drive/4%20-%20Google%20Drive.jpg)
</div>

## 3단계: 동의 화면 구성

1. **Google Auth Platform**으로 이동합니다(메뉴 **API 및 서비스 → OAuth 동의 화면**, 영문 "OAuth consent screen"). 프로젝트에 아직 구성되어 있지 않다면 **시작하기**(Get started)를 클릭합니다.
2. **앱 이름**(App name, 예: `SecureAI`)과 **사용자 지원 이메일**(User support email)을 입력합니다.
3. **대상**(Audience)에서 **내부**(Internal)를 선택합니다. 귀사 Google Workspace 조직의 계정만 앱을 승인할 수 있으며, Google의 인증 절차가 필요하지 않습니다.
4. 연락처 이메일을 입력하고 사용자 데이터 정책에 동의한 후 **만들기**(Create)를 클릭합니다.

<div class="mac-window">
  ![Google Auth Platform의 내부 대상](/img/files/google-drive/5%20-%20Google%20Drive.jpg)
</div>

범위를 수동으로 추가할 필요는 없습니다. SecureAI는 민감하지 않은 범위인 `drive.file`만 요청합니다.

## 4단계: OAuth 클라이언트 만들기

1. **Google Auth Platform → 클라이언트**(Clients)에서 **클라이언트 만들기**(Create client)를 클릭합니다.
2. **애플리케이션 유형**(Application type)에서 **웹 애플리케이션**(Web application)을 선택하고 이름을 지정합니다(예: `SecureAI — Add from Drive`).
3. **승인된 JavaScript 원본**(Authorized JavaScript origins)에서 **URI 추가**(Add URI)를 클릭하고, 1단계에서 복사한 **Authorized JavaScript origin**을 붙여넣습니다.
4. **승인된 리디렉션 URI**(Authorized redirect URIs)는 비워 둡니다. 선택기는 이 값을 사용하지 않습니다.
5. **만들기**를 클릭합니다.

<div class="mac-window">
  ![SecureAI 출처가 설정된 웹 애플리케이션 유형의 OAuth 클라이언트](/img/files/google-drive/6%20-%20Google%20Drive.jpg)
</div>

6. **클라이언트 ID**(Client ID, `.apps.googleusercontent.com`으로 끝남)를 복사합니다. 이 클라이언트에는 보안 비밀이 필요하지 않습니다. 복사하거나 어디에도 입력하지 마십시오.

<div class="mac-window">
  ![생성된 클라이언트 ID](/img/files/google-drive/7%20-%20Google%20Drive.jpg)
</div>

<Note>
귀사가 이미 SecureAI의 [Google Workspace 로그인](/ko/iam/google-workspace)에 Google 웹 클라이언트를 사용하고 있다면 이를 재사용할 수 있습니다. 해당 클라이언트에 JavaScript 원본을 추가하십시오.
</Note>

## 5단계: API 키 만들기 및 제한

1. **API 및 서비스 → 사용자 인증 정보**(Credentials)로 이동하여 **사용자 인증 정보 만들기 → API 키**(Create credentials → API key)를 클릭합니다.
2. 방금 만든 키를 엽니다(**API 키 수정**, "Edit API key").
   - **애플리케이션 제한사항**(Application restrictions)에서 **웹사이트**(Websites)를 선택하고, 1단계에서 복사한 **Website restriction**(끝에 `/*`가 붙은 주소)을 추가합니다.
   - **API 제한사항**(API restrictions)에서 **키 제한**(Restrict key)을 선택하고 **Google Picker API**만 선택합니다.
3. **저장**(Save)을 클릭하고 키(`AIza`로 시작)를 복사합니다.

<div class="mac-window">
  ![웹사이트와 Google Picker API로 제한된 API 키](/img/files/google-drive/8%20-%20Google%20Drive.jpg)
</div>

<Warning>
API 키는 **설계상 공개되는 값입니다**. 각 사용자의 브라우저가 선택기를 열기 위해 이 키를 받습니다. 따라서 SecureAI 사이트와 Google Picker API로 제한하는 것이 필수입니다. SecureAI에서 **Test connection**을 사용하기 **전에** 제한하십시오. 이미 다른 API에서 사용 기록이 있는 키에는 Google이 제한 추가를 허용하지 않을 수 있습니다.
</Warning>

## 6단계: SecureAI에 입력, 테스트 및 활성화

1. SecureAI의 **Google Drive** 사이드 패널로 돌아갑니다.
2. **2. Paste the identifiers**에서 **Client ID**와 **API key**를 붙여넣습니다.
3. **3. Test it**에서 다음을 수행합니다.
   - **Test connection**은 SecureAI 서버에서 API 키가 유효한지, 귀사 인스턴스의 요청을 허용하는지, OAuth 클라이언트와 **같은 프로젝트**에 속하는지 확인합니다.
   - **Try signing in**은 사용자에게 표시되는 것과 동일한 Google 창을 엽니다. 본인 계정으로 로그인하십시오. SecureAI가 출처가 승인되었는지와 Google Drive API가 응답하는지 확인합니다.

<div class="mac-window">
  ![SecureAI 사이드 패널에서 통과한 테스트](/img/files/google-drive/9%20-%20Google%20Drive.png)
</div>

4. **4.**에서 **Show "Add from Drive" to users**를 켠 상태로 두고 **Save**를 클릭합니다.

카드가 **Available in the chat**으로 바뀝니다.

## 7단계: 사용자의 사용 방법

1. 채팅에서 사용자가 **첨부** 버튼을 클릭하고 **Add from Drive**를 선택합니다.

<div class="mac-window">
  ![첨부 메뉴의 Add from Drive](/img/files/google-drive/10%20-%20Google%20Drive.png)
</div>

2. 처음에는 Google이 계정을 선택하고, 선택한 파일을 SecureAI가 볼 수 있도록 승인하라고 요청합니다.
3. Google 드라이브 선택기가 열리며 내 드라이브, 공유 드라이브, 이미지 탭이 표시됩니다. 파일을 하나 이상 선택하고 **Select**를 클릭합니다.


4. 파일이 Google 드라이브 아이콘과 함께 메시지에 첨부됩니다.

## 문제 해결

| 표시되는 내용 | 원인 | 조치 방법 |
|---|---|---|
| **Test connection**: "The API key's website restrictions do not include this address"(API 키의 웹사이트 제한에 이 주소가 포함되어 있지 않습니다) | API 키에 SecureAI 사이트가 설정되어 있지 않음 | 1단계의 제한 값을 그대로(끝에 `/*`) 추가합니다 |
| **Test connection**: "The API key belongs to a different project than the OAuth client"(API 키가 OAuth 클라이언트와 다른 프로젝트의 것입니다) | 사용자 인증 정보가 서로 다른 프로젝트에서 생성됨 | OAuth 클라이언트와 같은 프로젝트에서 API 키를 만듭니다 |
| **Test connection**: "The Google Drive API is not enabled"(Google Drive API가 사용 설정되어 있지 않습니다) | API가 사용 설정되지 않음 | 2단계 |
| Google 창에 **Error 400: origin_mismatch** 또는 **redirect_uri_mismatch**가 표시됨 | JavaScript 원본이 OAuth 클라이언트에 없음 | 추가합니다(4단계). 반영에 몇 분이 걸릴 수 있습니다 |
| Google 창에 **Error 403: org_internal**이 표시됨 | 사용자가 Workspace 외부의 계정을 사용함 | 조직 계정으로 로그인해야 합니다 |
| 선택기에 "The API developer key is invalid"가 표시됨 | API 키를 잘못 복사했거나 Google Picker API가 포함되지 않음 | 5단계를 확인합니다 |
| "SecureAI did not receive access to this file"(SecureAI가 이 파일에 대한 액세스 권한을 받지 못했습니다) | 선택기에서 파일을 선택하지 않음 | 드라이브 창에서 파일을 선택합니다 |
| "Its owner does not allow downloading it"(소유자가 다운로드를 허용하지 않습니다) | 소유자가 다운로드를 비활성화함 | 소유자에게 다운로드를 활성화하도록 요청합니다 |
| 사용자에게 **Add from Drive**가 표시되지 않음 | 연동이 꺼져 있거나, 저장되지 않았거나, 요금제에 포함되어 있지 않음 | **Admin → Integrations → Files**의 카드를 확인합니다 |

## 자주 묻는 질문

**공유 드라이브에서도 작동하나요?** 예. 선택기에 공유 드라이브 탭이 있으며, 사용자는 자신이 구성원인 드라이브를 볼 수 있습니다.

**각 사용자는 SecureAI에 어떤 권한을 부여하나요?** `drive.file`만 부여합니다. 사용자가 선택기에서 선택한 파일에 대한 액세스입니다. SecureAI는 귀사 드라이브의 다른 파일을 나열, 검색, 읽을 수 없습니다.

**어떻게 비활성화하나요?** **Show "Add from Drive" to users**를 끄고 저장하거나, **Remove configuration**을 클릭합니다. 사용자가 이미 부여한 액세스도 차단하려면 Google Cloud에서 OAuth 클라이언트를 삭제하십시오.

**Hiper AI가 이미 Drive를 설정해 주었습니다. 따로 해야 할 일이 있나요?** 아니요. 자체 설정을 저장하지 않는 한 카드에는 **Configured by Hiper AI**가 표시되며 모든 것이 그대로 작동합니다. 자체 설정을 저장하면 기존 설정을 대체합니다.

**이전 버전의 "Google Drive 서비스 계정"은 어떻게 되나요?** 더 이상 사용하지 않습니다. 모든 다운로드는 사용자 본인의 토큰으로 이루어지므로 더 안전합니다. 사용자가 열 수 없는 파일은 첨부할 수 없기 때문입니다.
