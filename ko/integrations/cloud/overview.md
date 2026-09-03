---
sidebar_position: 1
title: "클라우드 AI 제공업체 개요"
sidebar_label: "개요"
description: "OpenAI, Anthropic, Azure, AWS 및 GCP AI 플랫폼을 연결하면 SecureAI가 에이전트, 모델, ID, 사용량 및 비용을 인벤토리화할 수 있습니다."
---
# 클라우드 AI 제공업체

Cloud AI Provider 커넥터를 사용하면 SecureAI가 조직에서 이미 사용하고 있는 AI 플랫폼(**OpenAI Platform, Anthropic Console, Azure AI Foundry 및 Google Vertex AI**)에 접근하고 그곳에서 실행되는 모든 항목을 자동으로 목록화할 수 있습니다. 공급자 측에는 에이전트나 SDK를 배포할 필요가 없습니다. SecureAI는 사용자가 제공하는 읽기 전용 자격 증명을 사용하여 각 공급자의 관리 API를 폴링합니다.

연결되면 커넥터는 다음을 검색하고 지속적으로 동기화합니다.

- 플랫폼에서 실행되는 **에이전트, 모델 및 배포** → [클라우드 센서](/ko/en/discovery/cloud-sensors)에 표시됩니다.
- **NHI(Non-Human Identities)** — API 키, 서비스 계정 및 (지원되는 경우) BYOK 키 → [NHI Inventory](/ko/en/discovery/nhi-inventory)에 표시되며 차단/해지 제어가 가능합니다.
- 지난 30일 동안의 **사용량, 토큰 및 비용**입니다.
- **거버넌스 신호** — 공급자별 통찰력에 표시되는 IAM/RBAC 바인딩, 지출 한도 및 감사 로그입니다.

## 설정 루프

모든 공급자는 동일한 4단계를 따릅니다.

1. **관리 → 통합**을 열고 **클라우드** 카테고리를 선택합니다.
2. 공급자 카드를 **연결**하고 해당 자격 증명을 입력합니다(각 공급자의 페이지 참조).
3. 자격 증명을 확인하기 위해 연결을 **테스트**합니다.
4. **동기화** — 첫 번째 동기화에서는 전체 가져오기를 실행합니다. 후속 동기화는 증분식이며 일정에 따라 실행됩니다.

<Info>
**사물이 나타나는 곳**

커넥터 **설정**은 **관리 → 통합**에 있습니다. 생성된 **인벤토리**는 **관리자 → 에이전트 레지스트리**에 표시됩니다. [클라우드 센서](/ko/en/discovery/cloud-sensors)에서 검색된 에이전트/모델, [NHI 인벤토리](/ko/en/discovery/nhi-inventory)에서 검색된 ID입니다. 어느 위치에서든 동기화를 다시 실행할 수 있습니다.
</Info>

## 자격 증명 선택

가능하면 **읽기 전용/뷰어** 자격 증명을 사용하세요. SecureAI는 그림을 작성하기 위해 인벤토리를 *읽기만* 하면 됩니다. 일부 선택적 기능(유출된 키 취소, 지출 알림 생성)에는 추가 쓰기 권한이 필요합니다. 각 공급자 페이지에서는 이를 명시적으로 호출하며 항상 선택 사항입니다.

입력한 모든 비밀(클라이언트 비밀, 서비스 계정 JSON, 관리 API 키)은 **저장 시 암호화됩니다**.

## 제공업체 가이드

| 공급자 | 자격 증명 유형 |
|------------|----|
| [OpenAI 플랫폼](/ko/ko/integrations/cloud/openai-platform) | 조직 관리자 API 키 |
| [인트로픽 콘솔](/ko/ko/integrations/cloud/anthropic-console) | 관리 API 키(+ 선택적 작업공간/규정 준수 키) |
| [Azure AI Foundry](/ko/en/integrations/cloud/azure-ai-foundry) | Entra 서비스 주체(테넌트/클라이언트/비밀) |
| [구글 버텍스 AI](/ko/en/integrations/cloud/gcp-vertex-ai) | 서비스 계정 JSON |

## 관련

- [클라우드 센서](/ko/en/discovery/cloud-sensors) — 검색된 에이전트/모델 인벤토리입니다.
- [NHI 인벤토리](/ko/en/discovery/nhi-inventory) — 발견된 ID 인벤토리 및 취소 제어.
- [AI 발견 및 인벤토리 개요](/ko/ko/discovery/overview)