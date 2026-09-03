---
id: elastic-security
title: "탄력적인 보안 통합"
sidebar_label: "탄력적 보안"
description: "고급 위협 탐지 및 보안 분석을 위해 HiperAI를 Elastic Security와 통합"
---
# SecureAI를 Elastic SIEM과 통합

이 가이드는 SecureAI를 Elastic SIEM 인스턴스와 통합하는 방법에 대한 단계별 지침을 제공합니다. 이 통합을 통해 모니터링, 분석 및 알림을 위해 SecureAI의 이벤트 로그를 Elasticsearch로 전달할 수 있습니다.

## 1단계: Elastic Cloud 엔드포인트 확보

먼저 Elastic Cloud 배포에서 엔드포인트 URL을 가져와야 합니다.

1. Elastic Cloud 계정에 로그인하세요.
2. 홈페이지에서 원하는 배포를 찾습니다.
3. Elasticsearch 엔드포인트 URL을 찾아서 복사하세요. 나중에 SecureAI 구성에 이 정보가 필요합니다.

<div class="mac-window">
  ![Elastic Cloud 엔드포인트](/img/elastic%20images/Elastic%20-%201.png)
</div>

## 2단계: Elasticsearch에서 API 키 생성

SecureAI가 Elasticsearch 클러스터에 데이터를 안전하게 전송하려면 API 키가 필요합니다.

1. Kibana 대시보드에서 **관리** > **API 키**로 이동합니다.
2. **API 키 생성** 버튼을 클릭합니다.

<div class="mac-window">
  ![API 키 버튼 생성](/img/elastic%20images/Elastic%20-%202.png)
</div>

3. 다음 세부 정보로 API 키를 구성합니다.

<div class="mac-window">
  ![API 키 구성](/img/elastic%20images/Elastic%20-%203.png)
</div>

   - **이름**: `secureai-siem-integration`(또는 다른 설명이 포함된 이름).
   - **역할**: 인덱스에 쓰기 위해 필요한 권한을 가진 역할을 할당합니다. 이 가이드에서는 단순화를 위해 만료 날짜나 특정 역할 제한을 설정하지 않습니다.
4. **API 키 생성**을 클릭합니다.

<div class="mac-window">
  ![API 키 생성 클릭](/img/elastic%20images/Elastic%20-%204.png)
</div>

5. 키가 생성되어 표시됩니다. Base64로 인코딩된 API 키를 복사하여 안전한 위치에 저장하세요. 이 화면을 벗어나면 다시 볼 수 없습니다.

<div class="mac-window">
  ![API 키 생성](/img/elastic%20images/Elastic%20-%205.png)
</div>

## 3단계: Elasticsearch에서 대상 인덱스 생성

SecureAI 이벤트가 저장될 Elasticsearch에서 인덱스를 생성하고 매핑해야 합니다.

1. Kibana에서 **개발자 도구**로 이동합니다.
2. 콘솔에서 다음 명령을 실행하여 적절한 필드 매핑이 포함된 `secureai-events` 인덱스를 생성합니다.

```json
PUT /secureai-events
{
  "mappings": {
    "properties": {
      "timestamp": { "type": "date" },
      "event_type": { "type": "keyword" },
      "source": { "type": "keyword" },
      "severity": { "type": "keyword" },
      "category": { "type": "keyword" },
      "user": { "type": "keyword" },
      "ip": { "type": "ip" },
      "action": { "type": "keyword" },
      "message": { "type": "text" }
    }
  }
}
```

<div class="mac-window">
  ![개발자 도구에서 인덱스 생성](/img/elastic%20images/Elastic%20-%206.png)
</div>

## 4단계: SecureAI에서 Elastic SIEM 통합 구성

이제 SecureAI 통합 패널에 Elastic 세부 정보를 입력하세요.

1. SecureAI 대시보드에서 **통합**으로 이동합니다.
2. **Elastic SIEM** 통합 카드를 찾고 **구성**을 클릭합니다.
3. 다음과 같이 구성 필드를 채웁니다.
   - **통합 이름**: `secureai-app-elastic`
   - **탄력적 URL**: 1단계에서 복사한 엔드포인트를 붙여넣습니다.
   - **탄력적 API 키**: 2단계에서 생성한 Base64로 인코딩된 API 키를 붙여넣습니다.
   - **탄력적 지수**: `secureai-events`
   - **이벤트 카테고리 선택**: 사용 가능한 모든 이벤트 유형을 Elastic SIEM으로 전달하려면 모든 상자를 선택하세요.
4. **업데이트**를 클릭하여 구성을 저장합니다.

<div class="mac-window">
  ![구성을 저장하려면 업데이트를 클릭하세요](/img/elastic%20images/Elastic%20-%207.png)
</div>

## 5단계: 연결 테스트 및 확인

구성을 저장한 후 연결을 테스트하여 SecureAI가 Elastic 인스턴스와 통신할 수 있는지 확인하세요.

1. 통합 설정 모달에서 **연결 테스트** 버튼을 클릭합니다.
2. "테스트 성공! 연결이 확인되었습니다."라는 성공 메시지가 표시됩니다.

<div class="mac-window">
  ![테스트 성공 메시지](/img/elastic%20images/Elastic%20-%208.png)
</div>

3. 테스트 데이터가 수신되었는지 확인하려면 Kibana의 **Discover**로 이동하세요.
4. `secureai-events` 데이터 보기(인덱스 패턴)를 선택합니다.
5. 통합이 올바르게 작동하는지 확인하는 SecureAI의 테스트 이벤트 로그가 표시되어야 합니다.

<div class="mac-window">
  ![테스트 이벤트 로그 확인](/img/elastic%20images/Elastic%20-%209.png)
</div>

이제 SecureAI와 Elastic SIEM 통합이 활성화되었습니다. 이벤트가 발생하면 `secureai-events` 인덱스에 기록됩니다.

## 완료!

이러한 단계를 통해 Elastic 인스턴스는 SecureAI와 통합되도록 완전히 구성됩니다 8.