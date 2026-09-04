---
sidebar_position: 1
title: "AI 발견 및 인벤토리 개요"
sidebar_label: "개요"
description: "SecureAI가 조직 전체의 모든 AI 에이전트, 모델, ID 및 섀도우 AI 소스를 검색하고 목록화하는 방법"
---
# AI 발견 및 인벤토리

SecureAI는 실행하는 에이전트와 모델, 그 뒤에 있는 신원, 사용자가 알지 못했던 섀도우 AI 등 조직에서 지속적으로 업데이트되는 단일 AI 인벤토리를 구축합니다. **관리자 → 에이전트 레지스트리** 아래에 모두 표시되는 **세 가지 보완적인 검색 신호**를 통해 이 작업을 수행합니다.

## 세 가지 신호

| 신호 | 본다 | 공급 |
|---------|------|---------|
| **클라우드 API** | AI 플랫폼 내부의 에이전트, 모델, 배포 및 ID. | [클라우드 AI 공급자](/ko/integrations/cloud/overview) 커넥터 → [클라우드 센서](/ko/discovery/cloud-sensors) |
| **네트워크 / CASB** | 에이전트가 설치되지 않은 상태에서 LLM API를 호출하는 회사 소스 IP입니다. | [CASB/SWG](/ko/integrations/casb/overview) 커넥터 → [네트워크 소스](/ko/discovery/network-sources) |
| **엔드포인트 에이전트** | 관리형 노트북 및 서버의 AI/MCP 활동. | [OS 에이전트](/ko/agent/개요) |

모든 신호에서 발견된 신원은 [NHI 인벤토리](/ko/discovery/nhi-inventory)에 롤업되며, 귀하가 관리하는 논리적 에이전트/챗봇은 [에이전트 레지스트리](/ko/discovery/agent-registry)에 있습니다.

## 인벤토리 탭

**관리자 → 에이전트 레지스트리**에서 다음을 찾을 수 있습니다.

- **[클라우드 센서](/ko/discovery/cloud-sensors)** — 클라우드에서 검색된 에이전트 및 모델.
- **[네트워크 소스](/ko/discovery/network-sources)** — CASB/SWG 로그에서 발견된 Shadow AI 소스입니다.
- **[NHI 인벤토리](/ko/discovery/nhi-inventory)** — 차단/취소 제어 기능이 있는 비인간 ID(키, 서비스 계정)입니다.
- **[에이전트 레지스트리](/ko/discovery/agent-registry)** — 논리적 AI 에이전트 및 챗봇에 대한 거버넌스 메타데이터입니다.

## 그것이 중요한 이유

보이지 않는 것을 통제할 수는 없습니다. Discovery는 AI와 관련된 모든 모델 엔드포인트, 모든 키, 모든 장치 또는 워크로드라는 분모를 제공합니다. 따라서 정책, 비용 제어 및 사고 대응은 선언된 부분뿐만 아니라 *전체* 자산에 적용됩니다.

## 관련

- [클라우드 AI 제공업체](/ko/integrations/cloud/overview)
- [CASB 및 네트워크(SWG)](/ko/integrations/casb/개요)
- [엔드포인트 에이전트](/ko/agent/overview)