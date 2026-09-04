---
sidebar_position: 7
title: "투명 프록시(AI 라우팅)"
sidebar_label: "투명 프록시"
description: "엔드포인트에서 SecureAI 게이트웨이를 통해 개발자 AI 트래픽(예: Claude Code) 라우팅"
---
# 투명 프록시(AI 라우팅)

에이전트는 SecureAI 게이트웨이를 통해 개발자의 AI 트래픽(예: [Claude Code](/ko/integrations/ide-claude-code))을 투명하게 라우팅할 수 있습니다. 이를 통해 개발자가 도구를 변경하지 않고도 나머지 AI 자산과 동일한 거버넌스, 비용 추적 및 정책에 따라 코딩 지원을 사용할 수 있습니다.

## 작동 방식

라우팅은 `claudeCodeRouting`을 통해 [정책](/ko/agent/policies-and-groups)별로 구성됩니다.

| 설정 | 설명 |
|---------|-------------|
| **활성화됨** | 이 정책에 따라 장치에 대한 라우팅을 켜십시오. |
| **잠금** | `user`(개발자가 전환할 수 있음), `force_on`(항상 라우팅됨) 또는 `force_off`(라우팅되지 않음). |
| **모델 매핑** | `opus` / `sonnet` / `haiku`에 대한 제품군별 매핑을 실제로 제공되는 모델에 적용합니다. |
| **모델 잠금** | `user` 또는 `force` — 개발자가 매핑을 변경할 수 있는지 여부입니다. |

라우팅이 활성화되면 SecureAI는 **장치별 API 키를 생성**하고 이를 투명 프록시 구성을 통해 엔드포인트 환경(예: `ANTHROPIC_AUTH_TOKEN`)에 삽입합니다. 사용량은 **연결된 개발자의 포인트 버킷으로 청구**되므로 기기가 소유자 사용자에게 연결되어 있는지 확인하세요([등록 및 패키지](/ko/agent/enrollment-and-packages) 참조).

## 함대 전체 기본값

게이트웨이 기본값은 플릿(`anthropicBaseUrl`, `openaiBaseUrl`, 인증 토큰 및 잠금)에 대해 한 번 설정될 수 있으며 장치에서 상속됩니다. 에이전트는 프록시가 현재 켜져 있는지 꺼져 있는지 보고하고 해당 전환을 감사합니다.

## 차단 대신 라우팅하는 이유

승인된 개발자 AI의 경우 게이트웨이를 통한 라우팅은 일반적으로 [송신 차단](/ko/agent/egress-enforcement)보다 바람직합니다. 개발자는 계속 작업하는 동시에 정책 시행, 비용 귀속 및 해당 트래픽에 대한 감사를 받습니다. 승인되지 않은 제공업체에 대한 차단/잠금을 예약하세요.

## 관련

- [송신 집행](/ko/agent/egress-enforcement)
- [정책 및 그룹](/ko/agent/policies-and-groups)
- [AI 게이트웨이 개요](/ko/ai-gateway/overview)
- [클로드코드 IDE 통합](/ko/integrations/ide-claude-code)