---
sidebar_position: 3
title: "인류 콘솔"
sidebar_label: "인류 콘솔"
description: "SecureAI가 작업 공간, 키, 사용량, 비용 및 감사 활동을 인벤토리화할 수 있도록 Anthropic 콘솔을 연결하세요."
---
# 인류 콘솔

SecureAI가 작업 공간, API 키, 서비스 계정, 지출 한도 및 (Enterprise의 경우) 감사 로그 및 Claude Code 분석을 인벤토리할 수 있도록 Anthropic 조직을 연결하세요.

## SecureAI가 가져오는 것

- **작업공간**, 사용량 및 비용
- **NHIs** — API 키, 서비스 계정 및 BYOK 키(취소 가능 — [NHI 인벤토리](/ko/en/discovery/nhi-inventory) 참조)
- **지출 한도**
- **감사 로그**(기업/규정 준수 API)
- **클로드 코드 분석**

## 전제 조건

- Anthropic 콘솔의 **관리자**.
- **관리 API 키** (`sk-ant-admin…`).
- *(선택 사항)* 에이전트 플랫폼 데이터의 잠금을 해제하는 **작업 공간 키** 및 감사 로그의 잠금을 해제하는 **규정 준수 API 키**(Enterprise).

## 자격 증명

| 필드 | 필수 | 설명 |
|-------|----------|------------|
| `adminApiKey` | 예 | 조직 관리자 키, 형식 `sk-ant-admin…`. 저장 시 암호화됩니다. |
| `apiKey` | 아니요 | 작업 공간 키 - 에이전트 플랫폼 인벤토리를 잠금 해제합니다. |
| `complianceApiKey` | 아니요 | 엔터프라이즈 규정 준수 API 키 - 감사 로그를 잠금 해제합니다. |

### 관리자 키를 얻을 수 있는 곳

1. [Anthropic Console](https://console.anthropic.com/)에 관리자로 로그인합니다.
2. **설정 → 관리자 키**(조직 수준)로 이동합니다.
3. 관리자 키를 생성하고 복사합니다.

## 연결

1. **관리자 → 통합 → 클라우드 → Anthropic 콘솔 → 연결.**
2. 관리자 키(및 선택적 키)를 붙여넣습니다.
3. **테스트**하고 **저장**합니다.
4. **동기화**.

## 확인

검색된 작업 공간/에이전트의 경우 [클라우드 센서](/ko/en/discovery/cloud-sensors)를 열고 키 및 서비스 계정의 경우 [NHI 인벤토리](/ko/en/discovery/nhi-inventory)를 엽니다. 통찰력에는 사용량, 비용, 지출 한도가 표시됩니다.

## 철회

Anthropic API 키, 서비스 계정, BYOK 키는 [NHI 인벤토리](/ko/en/discovery/nhi-inventory)에서 **취소 가능**합니다.

## 관련

- [클라우드 AI 제공업체 개요](/ko/ko/integrations/cloud/overview)
- [NHI 인벤토리](/ko/en/discovery/nhi-inventory)