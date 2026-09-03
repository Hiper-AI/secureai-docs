---
sidebar_position: 2
title: "시스코 우산"
sidebar_label: "시스코 우산"
description: "Reporting API v2를 통해 Cisco Umbrella DNS 활동에서 섀도우 AI를 감지합니다."
---
# 시스코 우산

Cisco Umbrella를 연결하면 SecureAI가 Umbrella의 **Reporting API v2**를 사용하여 LLM/AI 도메인을 확인하는 기업 소스를 감지할 수 있습니다. Umbrella는 DNS 계층 소스입니다. 이는 장치가 AI 도메인(전체 TLS 페이로드가 아님)을 *확인*했는지 확인합니다. 이는 정확히 Shadow AI 검색에 필요한 것입니다.

SecureAI는 최대 적용 범위를 위해 두 가지 패스를 실행합니다.

1. 알려진 LLM/AI 도메인의 선별된 목록.
2. Umbrella의 **컨텐츠 카테고리 `212` ("Generative AI")**, 새로 인기 있는 AI 서비스가 선별된 목록에 포함되기도 전에 포착됩니다.

## 전제 조건

- **보고 API** 및 DNS 활동 로그가 포함된 Umbrella 패키지입니다.
- **Umbrella API 자격 증명**(API 키 + 비밀) 및 **조직 ID**.

## 자격 증명

| 필드 | 필수 | 설명 |
|-------|----------|------------|
| `apiKey` | 예 | Umbrella Reporting API 키입니다. |
| `apiSecret` | 예 | Umbrella Reporting API 비밀번호입니다. 저장 시 암호화됩니다. |
| `orgId` | 예 | 귀하의 Umbrella 조직 ID입니다. |

### 어디서 구할 수 있나요?

1. [Umbrella 대시보드](https://dashboard.umbrella.com/)에 로그인합니다.
2. **관리자 → API 키**로 이동하여 **보고** 범위의 키를 생성합니다. 키와 비밀을 복사합니다(한 번 표시됨).
3. 귀하의 **조직 ID**는 대시보드 URL(`.../o/<orgId>/#/...`)에 있는 숫자 ID입니다.

SecureAI는 `POST https://api.umbrella.com/auth/v2/token`(기본 `apiKey:apiSecret`, `client_credentials`)로 인증하고 `GET /reports/v2/activity/dns`을 읽습니다.

## 연결

1. **관리 → 통합 → 네트워크 → Cisco Umbrella → 연결.**
2. API 키, 비밀번호, 조직 ID를 입력하세요.
3. **테스트**하고 **저장**합니다.
4. **동기화** — 첫 번째 동기화는 백그라운드에서 최근 DNS 활동을 백필합니다.

## 메모

- Umbrella는 **DNS 레이어**입니다. 일치는 완료된 API 호출이 아니라 도메인 확인을 확인합니다. 이는 범위(Umbrella 뒤의 모든 장치)에 이상적이지만 요청 페이로드를 전달하지 않습니다.
- Umbrella 송신이 프록시를 통과해야 하는 경우 SecureAI 백엔드에서 `UMBRELLA_PROXY_URL`(또는 표준 `HTTPS_PROXY`)를 설정합니다.

## 확인

첫 번째 동기화 후 [네트워크 소스](/ko/en/discovery/network-sources)를 엽니다. AI 도메인을 해결한 소스는 해당 공급자, 호출 횟수 및 심각도와 함께 표시됩니다.

## 관련

- [CASB 및 네트워크 개요](/ko/ko/integrations/casb/overview)
- [네트워크 소스](/ko/ko/discovery/network-sources)