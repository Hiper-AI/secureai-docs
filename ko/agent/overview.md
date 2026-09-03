---
sidebar_position: 1
title: "엔드포인트 에이전트 개요"
sidebar_label: "개요"
description: "SecureAI OS 에이전트 — 엔드포인트 AI 거버넌스, DLP 및 랩탑과 서버에 대한 송신 제어"
---
# 엔드포인트 에이전트

SecureAI **OS 에이전트**는 Windows 노트북, Linux 서버, macOS 시스템 등 엔드포인트에서 실행되며 작업이 실제로 발생하는 곳에 AI 거버넌스를 적용합니다. 장치에서 AI/MCP 활동을 검색하고 데이터 손실 및 행동 보호를 적용하며 정책에 따라 AI 공급자에 대한 송신을 제어하거나 차단할 수 있습니다.

에이전트 플릿은 **관리 → 에이전트 레지스트리 → OS 에이전트**에서 관리됩니다.

## 에이전트가 하는 일

- **기기에서 AI 사용을 검색** — 설치된 AI SDK/프로세스, MCP 서버 및 AI 공급자에 대한 섀도우 네트워크 호출.
- **정책 시행** — AI 공급자/모델/앱/MCP를 모니터링 또는 차단하고, 행동 AI 감독을 적용하고, 송신 제어를 시행합니다([송신 집행](/ko/en/agent/egress-enforcement) 참조).
- **데이터 보호** — 엔드포인트 DLP/PII 검사.
- **위협에 대응** — 악성 파일을 격리하고 손상된 엔드포인트를 격리할 수 있습니다([격리 및 함대 작전](/ko/en/agent/quarantine-and-fleet-ops) 참조).
- **선택적으로 개발자 AI 트래픽을 SecureAI의 게이트웨이를 통해 라우팅**합니다([투명 프록시](/ko/en/agent/transparent-proxy) 참조).

## 기기 상태 및 상태

등록된 각 장치는 상태 및 보안 상태를 보고합니다.

| 신호 | 가치 |
|---------|---------|
| **상태** | `healthy`, `stale` (~5분 동안 하트비트 없음), `enrolled`, `paused`, `revoked` |
| **자세** | `protected`, `at_risk`, `infected` |
| **위험 점수** | 0–100, 위반, 위협 및 구성으로 계산됨 |

**OS 에이전트** 탭에는 상태, 상태, 위험, OS/버전, 그룹, 활성 정책 및 연결된 소유자와 함께 모든 장치가 나열됩니다. 장치를 확장하면 최근 섀도우 네트워크 관찰, MCP 인벤토리, AI-SDK 프로세스, 정책 위반, 차단된 연결, 격리 항목, 위협 및 명령 기록이 표시됩니다.

## 시작하는 방법

1. 엔드포인트(Windows에서는 서명된 MSI, Linux/macOS에서는 스크립트)에 **[에이전트를 설치](/ko/en/agent/installation)**합니다.
2. **[등록 및 설치 프로그램 패키지](/ko/en/agent/enrollment-and-packages)** — 장치가 가입하고 구성을 가져오는 방법을 이해합니다.
3. **[정책 및 그룹](/ko/en/agent/policies-and-groups)**을 구성하여 각 장치에서 시행할 사항을 결정합니다.
4. 대응을 위해 **[송신 시행](/ko/en/agent/egress-enforcement)** 및 **[격리 및 함대 작전](/ko/en/agent/quarantine-and-fleet-ops)**을 조정합니다.

## 역할

일반 관리 패널 액세스를 통해 플릿을 보고 구성할 수 있습니다. **파괴적 작업**(격리, 프로세스/MCP/네트워크 종료, 격리 및 취소)에는 높은 시스템 **관리자** 역할이 필요합니다. [검역 및 함대 작전](/ko/en/agent/quarantine-and-fleet-ops)을 참조하세요.

## 관련

- [AI 발견 및 인벤토리](/ko/ko/discovery/overview) — 에이전트는 세 가지 발견 신호 중 하나입니다.
- [위협방어](/ko/ko/threat-defense/overview)