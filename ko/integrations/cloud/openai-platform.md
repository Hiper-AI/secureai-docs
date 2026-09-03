---
sidebar_position: 2
title: "오픈AI 플랫폼"
sidebar_label: "오픈AI 플랫폼"
description: "SecureAI가 프로젝트, 모델, 키, 사용량 및 비용을 인벤토리화할 수 있도록 OpenAI 플랫폼을 연결하세요."
---
# 오픈AI 플랫폼

OpenAI 조직을 연결하면 SecureAI가 프로젝트, 모델, 구성원, API 키, 서비스 계정, 지출 및 감사 활동을 인벤토리화하고 수정을 위해 유출되거나 과도한 권한이 부여된 키를 표면화할 수 있습니다.

## SecureAI가 가져오는 것

- **프로젝트, 모델, 멤버, 역할 및 그룹**
- **NHIs** — API 키 및 서비스 계정(취소 가능 — [NHI 인벤토리](/ko/en/discovery/nhi-inventory) 참조)
- **지출 알림, 비율 제한, 인증서 및 데이터 보존 설정**
- **감사 로그**
- 사용자당 지출을 포함한 지난 30일간의 **사용량 및 비용**

## 전제 조건

- OpenAI Platform의 **조직 소유자**(또는 관리자).
- **관리 API 키** (`sk-admin-…`). 조직 전체의 프로젝트, 구성원 및 사용량을 읽으려면 관리자 키가 필요합니다.

## 자격 증명

| 필드 | 필수 | 설명 |
|-------|----------|------------|
| `adminApiKey` | 예 | 조직 **관리자** 키, 형식 `sk-admin-…`. 저장 시 암호화됩니다. |
| `projectApiKey` | 아니요 | 하나 이상의 프로젝트 키(한 줄에 하나씩). 레거시 어시스턴트 인벤토리에만 필요합니다. |
| `organizationId` | 아니요 | 귀하의 `org-…` ID; 키가 여러 조직에 걸쳐 있는 경우를 명확하게 합니다. |

### 관리자 키를 얻을 수 있는 곳

1. [OpenAI Platform](https://platform.openai.com/)에 조직 소유자로 로그인합니다.
2. **설정 → 조직 → 관리자 키**로 이동합니다.
3. 새 관리자 키를 생성하고 복사합니다(한 번 표시됨).

## 연결

1. **관리자 → 통합 → 클라우드 → OpenAI Platform → 연결.**
2. 관리 API 키(및 선택적 필드)를 붙여넣습니다.
3. **테스트**하고 **저장**합니다.
4. **동기화**.

## 확인

첫 번째 동기화 후 [클라우드 센서](/ko/en/discovery/cloud-sensors)를 열어 검색된 모델/어시스턴트를 확인하고, [NHI 인벤토리](/ko/en/discovery/nhi-inventory)를 열어 키와 서비스 계정을 확인하세요. 공급자별 **Insights**에는 사용량, 비용, 사용자별 지출이 표시됩니다.

## 철회

OpenAI API 키는 [NHI Inventory](/ko/en/discovery/nhi-inventory)에서 **취소 가능**합니다. SecureAI는 소스에서 키를 비활성화할 수 있습니다. (서비스 계정의 경우 OpenAI ID는 모니터링 전용입니다.)

## 관련

- [클라우드 AI 제공업체 개요](/ko/ko/integrations/cloud/overview)
- [NHI 인벤토리](/ko/en/discovery/nhi-inventory)