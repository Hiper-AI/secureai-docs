---
id: splunk-security
title: "Splunk 보안 통합"
sidebar_label: "스플렁크 보안"
description: "통합 가이드: HEC(HTTP Event Collector)를 통해 Splunk SIEM을 HiperAI와 연결"
---
# Splunk 보안 통합

통합 가이드: Splunk SIEM을 HiperAI와 연결

이 가이드에서는 HEC(HTTP Event Collector)를 통해 HiperAI에서 보안 로그를 수신하도록 Splunk를 구성하는 데 필요한 단계를 설명합니다.

## 1단계: 새 인덱스 만들기

먼저, 애플리케이션의 로그를 저장할 전용 공간을 만듭니다.

### A. Splunk 홈 화면에서 설정 > 인덱스로 이동합니다.

<div class="mac-window">
  ![Splunk 설정 인덱스](/img/splunk%20images/1%20-%20Splunk%20Integration.png)
</div>

### B. 오른쪽 상단에 있는 새 색인 버튼을 클릭합니다.

### C. 인덱스를 구성합니다.

- **인덱스 이름**: `secureai_events`
- 다른 모든 옵션은 표준 구성의 기본값으로 둡니다.
- **저장**을 클릭합니다.

<div class="mac-window">
  ![Splunk 인덱스 구성](/img/splunk%20images/2%20-%20Splunk%20Integration.png)
</div>

이제 새 인덱스가 생성되어 데이터를 수신할 준비가 되었습니다.

## 2단계: HTTP 이벤트 수집기(HEC) 활성화

다음으로 Splunk가 수신 데이터 요청을 수신하는지 확인하겠습니다.

### A. 설정 > 데이터 입력으로 이동합니다.

<div class="mac-window">
  ![Splunk 데이터 입력](/img/splunk%20images/3%20-%20Splunk%20Integration.png)
</div>

### B. '로컬 입력'에서 HTTP 이벤트 수집기를 클릭합니다.

<div class="mac-window">
  ![Splunk HTTP 이벤트 수집기](/img/splunk%20images/4%20-%20Splunk%20Integration.png)
</div>

### C. 오른쪽 상단에서 전역 설정을 클릭합니다.

### D. 다음 구성을 확인합니다.

- **모든 토큰**: 활성화되어야 합니다.
- **SSL 활성화**: (선택 사항) 프로덕션 환경에 권장되지만 초기 테스트에서는 비활성화할 수 있습니다.
- **HTTP 포트 번호**: 포트가 8088인지 확인하세요.
- **저장**을 클릭합니다.

<div class="mac-window">
  ![Splunk HEC 전역 설정](/img/splunk%20images/5%20-%20Splunk%20Integration.png)
</div>

## 3단계: HEC 토큰 생성

토큰은 애플리케이션이 Splunk를 인증하는 데 사용할 보안 액세스 키입니다.

### A. HTTP 이벤트 수집기 페이지(설정 > 데이터 입력 > HTTP 이벤트 수집기)로 돌아갑니다.

### B. 새 토큰 버튼을 클릭합니다.

<div class="mac-window">
  ![Splunk 새 토큰 버튼](/img/splunk%20images/6%20-%20Splunk%20Integration.png)
</div>

### C. 토큰 구성(탭 1):

- **이름**: `token_secureai_app`
- **설명**: (선택사항) 간단한 설명을 추가합니다.
- **인덱서 승인 활성화**: **중요**: 이 확인란이 선택 해제되어 있는지 확인하세요.
- **다음**을 클릭합니다.

<div class="mac-window">
  ![Splunk 토큰 구성](/img/splunk%20images/7%20-%20Splunk%20Integration.png)
</div>

### D. 입력 설정(탭 2):

- **소스 유형**: 선택을 클릭합니다. 검색 필드에 `_json`를 입력하고 목록에서 선택합니다. 이는 Splunk가 JSON 형식의 데이터를 예상하도록 지시합니다.
- **허용된 인덱스**: "사용 가능한 인덱스" 열에서 생성한 인덱스(`secureai_events`)를 찾아 클릭하여 "선택한 인덱스" 열로 이동합니다.
- **기본 인덱스**: 드롭다운 메뉴에서 `secureai_events`를 선택합니다.

<div class="mac-window">
  ![Splunk 입력 설정](/img/splunk%20images/8%20-%20Splunk%20Integration.png)
</div>

- **검토**를 클릭한 다음 **제출**을 클릭하세요.

<div class="mac-window">
  ![Splunk 검토 및 제출](/img/splunk%20images/9%20-%20Splunk%20Integration.png)
</div>

### E. 토큰 값을 복사하세요!

이제 Splunk에 토큰 값이 표시됩니다. 즉시 복사하여 안전한 장소에 저장하세요. 이는 애플리케이션에서 구성해야 하는 토큰입니다.

<div class="mac-window">
  ![Splunk 토큰 값](/img/splunk%20images/10%20-%20Splunk%20Integration.png)
</div>

## 4단계: 정보 마무리 및 공유

거의 다 끝났습니다. 마지막 단계만 남았습니다.

### A. 정보 수집

통합을 완료하려면 애플리케이션에 다음 세 가지 정보가 필요합니다.

1. **HEC URL**: Splunk 서버의 주소와 HEC 포트(예: `http://splunk.yourcompany.com:8088/services/collector`)입니다.
2. **HEC 토큰**: 이전 단계에서 복사한 값입니다.
3. **인덱스 이름**: 생성한 인덱스의 이름(`secureai_events`)입니다.

<div class="mac-window">
  ![Splunk 인덱스 정보](/img/splunk%20images/11%20-%20Splunk%20Integration.png)
</div>

### B. 방화벽 규칙 검토

애플리케이션 서버와 Splunk 서버 사이의 방화벽이 HEC 포트(일반적으로 TCP 8088)의 트래픽을 허용하는지 확인하십시오.

## 4단계: 데이터 형식에 대한 참고 사항(Sourcetype)

데이터가 올바르게 식별되고 구문 분석되었는지 확인하기 위해 우리 애플리케이션은 구조화된 특정 JSON 형식으로 로그를 보냅니다.

**중요**: SecureAI에서 전송된 모든 이벤트의 소스 유형은 `secureai:json`입니다.

이 값은 애플리케이션에서 전송한 데이터 페이로드에 직접 설정되므로 토큰에 대해 선택한 기본 소스 유형(`_json`)을 자동으로 재정의합니다. 추가 조치는 필요하지 않지만 검색 시 sourcetype="secureai:json" 아래에서 데이터를 찾을 수 있다는 점을 아는 것이 중요합니다.

## 6단계: 통합 확인

SecureAI 애플리케이션에 통합 세부정보를 입력하면 연결이 올바르게 작동하는지 확인할 수 있습니다.

### A. 연결 테스트

애플리케이션 내에서 "연결 테스트" 버튼을 사용하세요. 그러면 Splunk 인덱스로 테스트 이벤트가 전송됩니다.

<div class="mac-window">
  ![Splunk 테스트 연결](/img/splunk%20images/12%20-%20Splunk%20Integration.png)
</div>

이벤트가 올바르게 전송되면 성공 메시지가 표시되고 제공된 데이터가 올바르지 않으면 오류 메시지가 표시됩니다.

### B. Splunk에서 테스트 이벤트 찾기

이벤트가 Splunk에 도착했는지 확인하려면 검색 및 보고 앱으로 이동하세요.

검색 창에서 색인 검색을 실행합니다(예: `index="secureai_events"`).

시간 범위를 "지난 24시간"으로 설정합니다. 결과에 테스트 로그가 나타나는 것을 볼 수 있습니다.

<div class="mac-window">
  ![Splunk 검색 결과](/img/splunk%20images/13%20-%20Splunk%20Integration.png)
</div>

**참고**: 네트워크 트래픽 및 시스템 로드에 따라 Splunk에 로그가 표시되는 데 최대 10분이 걸릴 수 있습니다.

## 완료!

이러한 단계를 통해 Splunk 인스턴스는 SecureAI와 통합되도록 완전히 구성됩니다 8.