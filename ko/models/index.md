---
sidebar_position: 1
title: "모델"
---
# 모델

SecureAI에서 사용 가능한 모델.

SecureAI는 모든 주요 제공업체의 최신 AI 모델에 대한 액세스를 제공하여 특정 요구 사항에 가장 적합한 도구를 제공합니다.

API 키에 대한 실시간 모델 가용성을 얻으려면 외부 엔드포인트 `GET /api/external/models`를 사용하세요.

## 모델 비교

| 버킷 | 현재 모델 |
|---------|---|
| 표준 | openai/gpt-oss-120b, openai/gpt-5-nano, google/gemini-3.1-flash-lite-preview, google/gemini-3-flash-preview, deepseek/deepseek-r1-distill-llama-70b, deepseek/deepseek-r1, deepseek/deepseek-v3.2, 메타-라마/라마-3.3-70b-명령, 메타-라마/라마-4-매버릭, 메타-라마/라마-4-스카우트, mistralai/mistral-7b-instruct, mistralai/mistral-nemo, mistralai/ministral-14b-2512, mistralai/mistral-large-2512, x-ai/grok-3-mini, qwen/qwen3-235b-a22b-2507, qwen/qwen3-coder, qwen/qwen3-coder-next, qwen/qwen3.5-397b-a17b |
| 프리미엄 | anthropic/claude-3.7-sonnet, anthropic/claude-sonnet-4.6, anthropic/claude-opus-4.6, openai/o4-mini-high, openai/o4-mini, openai/gpt-5.2, openai/gpt-5.3-codex, openai/gpt-5.1, google/gemini-3.1-pro-preview, x-ai/grok-4 |

## 버킷 유형

### 표준 버킷
- **용도**: 일상 업무 및 일반적인 대화
- **비용**: 정기적으로 사용하는 경우 비용 효율성이 더 높습니다.
- **속도**: 더 빠른 응답을 위해 최적화되었습니다.
- **최적의 용도**: 빠른 질문, 간단한 작업, 일상적인 작업

### 프리미엄 버킷
- **용도**: 복잡한 추론 및 고급 분석
- **비용**: 기능 향상에 따른 비용 증가
- **속도**: 시간이 더 오래 걸릴 수 있지만 뛰어난 결과를 제공합니다.
- **최적의 용도**: 복잡한 문제 해결, 세부 분석, 전문 작업

## 모델 선택 가이드

### 복잡한 추론의 경우
- **anthropic/claude-opus-4.6** - 심층 분석 작업에 가장 적합
- **openai/gpt-5.2** - 강력한 추론 및 종합
- **google/gemini-3.1-pro-preview** - 고급 추론 기능

### 빠른 개발을 위해
- **openai/gpt-5-nano** - 간단한 작업에 대한 빠른 응답
- **google/gemini-3-flash-preview** - 강력한 속도/비용 균형
- **x-ai/grok-3-mini** - 빠른 반복 및 프로토타입 제작

### 코드 생성용
- **openai/gpt-5.3-codex** - 전문 코딩 워크플로
- **qwen/qwen3-coder-next** - 강력한 코드 생성 및 편집
- **deepseek/deepseek-r1** - 추론 중심의 코드 분석

### 대규모 컨텍스트의 경우
- **openai/gpt-5.1** - 대규모 컨텍스트 분석 작업
- **anthropic/claude-sonnet-4.6** - 강력한 긴 형식의 컨텍스트 처리
- **google/gemini-3.1-pro-preview** - 종합적인 문서 분석

## 모델 기능

### 컨텍스트 창
- **표준 컨텍스트**: 대부분의 모델은 16,000~200,000개의 토큰을 지원합니다.
- **확장된 컨텍스트**: 일부 모델은 무제한 컨텍스트를 지원합니다.
- **최적화된 처리**: 특정 사용 사례에 맞게 모델이 최적화되었습니다.

### 기능 특징
- **🧠 표준 AI**: 텍스트 생성, 추론, 코딩
- **📊 분석**: 데이터 분석 및 해석
- **💻 코드**: 전문 코드 생성 및 검토
- **🎯 전문**: 작업별 최적화

## 자동 선택

SecureAI에는 특정 작업에 가장 적합한 모델을 자동으로 선택하여 다음을 최적화하는 **자동 선택** 기능이 포함되어 있습니다.
- **작업 복잡성**: 필요에 따라 모델 기능을 일치시킵니다.
- **응답 속도**: 속도와 품질의 균형을 유지합니다.
- **비용 효율성**: 예산에 맞게 최적화됩니다.
- **컨텍스트 요구사항**: 적절한 컨텍스트 창이 있는 모델을 선택합니다.

## 다음 단계

- [API 레퍼런스](/ko/en/api) - API를 통해 모델 사용 방법 알아보기
- [빠른 시작](/ko/en/quickstart) - 첫 번째 모델 시작하기
- [보안 개요](/ko/ko/security/overview) - 모델 보안 기능 이해