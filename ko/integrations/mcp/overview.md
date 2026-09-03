---
sidebar_position: 1
title: "MCP 커넥터 개요"
sidebar_label: "개요"
description: "MCP(모델 컨텍스트 프로토콜) 서버를 연결하여 SecureAI의 보조자에게 도구에 대한 통제된 액세스 권한을 부여합니다."
---
# MCP 커넥터

SecureAI는 **MCP(Model Context Protocol)** 서버에 연결할 수 있으므로 보조자는 거버넌스 하에서 데이터베이스 쿼리, 티켓 읽기, 클라우드 운영 실행 등 외부 도구를 호출할 수 있습니다. 커넥터는 내장된 마켓플레이스에서 선택되고 사용자별로 구성됩니다. 모든 도구 호출은 여전히 ​​SecureAI의 정책과 안전 계층을 통과합니다.

커넥터는 **관리 → 통합 → MCP**(API 기반 `/api/connectors`)에서 관리됩니다.

## 전송 및 인증 패턴

각 커넥터는 SecureAI가 커넥터에 도달하는 방법과 인증하는 방법을 선언합니다. 세 가지 패턴이 지원됩니다.

| 패턴 | 교통 | 인증 | 예 |
|---------|------------|------|----------|
| 로컬 프로세스 | `stdio` | API 키(env 내) | Notion, Cloudflare(로컬 빈), Azure(`npx @azure/mcp`), AWS(`uvx awslabs.aws-api-mcp-server`), 참조 서버(Sequential Thinking, Web Fetch, Time). |
| 원격(토큰) | `streamable_http` | API 키/전달자(env 내) | GitHub 공식 MCP, Google Cloud 제품군(BigQuery, Compute, Logging, Vertex AI, Cloud Run, GKE 등), Microsoft Learn. |
| 원격(OAuth) | `streamable_http` | OAuth 2.1 + PKCE(동적 클라이언트 등록 포함) | Cloudflare(공식 원격 MCP). [OAuth 및 DCR을 사용하는 원격 MCP](/ko/en/integrations/mcp/remote-oauth-dcr)를 참조하세요. |

일부 토큰 기반 원격 커넥터(예: Google Cloud 제품군)도 OAuth 흐름을 제공하므로 사용자는 정적 토큰을 붙여넣는 대신 팝업을 통해 자체 Google OAuth 클라이언트로 인증할 수 있습니다.

## 커넥터 연결하기

1. **관리자 → 통합 → MCP.**
2. 마켓플레이스에서 커넥터를 선택하세요.
3. API 키/토큰 등 필수 구성을 제공하거나 OAuth 커넥터에 대한 OAuth 팝업을 통해 승인합니다.
4. 저장합니다. 보조자의 도구 라우터에서 커넥터를 사용할 수 있게 됩니다.

## 도구 안전

모든 커넥터는 **차단된 도구 패턴**, 즉 MCP 서버가 이를 노출하더라도 SecureAI가 호출을 거부하는 파괴적인 작업(예: `delete`, `destroy`, `terminate`)을 선언합니다. 이 가드레일은 중앙에서 시행되므로 연결된 도구 서버가 보조자를 통해 파괴적인 작업을 강제로 수행할 수 없습니다.

## 관련

- [OAuth 및 DCR을 사용한 원격 MCP](/ko/ko/integrations/mcp/remote-oauth-dcr)
- [AI 게이트웨이 - 원격 엔드포인트](/ko/en/ai-gateway/remote-endpoints)