---
sidebar_position: 2
title: "OAuth 및 DCR을 갖춘 원격 MCP"
sidebar_label: "원격 OAuth 및 DCR"
description: "SecureAI가 OAuth 2.1, PKCE 및 동적 클라이언트 등록을 사용하여 원격 MCP 서버에 연결하는 방법"
---
# OAuth 및 DCR을 갖춘 원격 MCP

일부 원격 MCP 서버는 정적 API 토큰이 아닌 **OAuth 2.1**을 사용하여 액세스를 승인합니다. SecureAI는 **PKCE** 및 **DCR(동적 클라이언트 등록)**을 포함하여 이러한 엔드투엔드를 지원하므로 OAuth 애플리케이션을 사전 등록할 필요가 없습니다. 참조 예는 **Cloudflare 공식 원격 MCP** 커넥터(`cloudflare-remote`)입니다.

## 흐름이 작동하는 방식

1. **동적 클라이언트 등록(RFC 7591).** 커넥터가 `registrationUrl`을 선언하고 정적 `clientId`가 없으면 SecureAI는 해당 URL에서 공개 PKCE 클라이언트로 자신을 등록하고 결과 `client_id`를 캐시합니다. 리디렉션 URI가 변경되면 자동으로 다시 등록됩니다. (정적 클라이언트 ID를 제공하는 커넥터의 경우 이 단계를 건너뜁니다.)
2. **인증 + PKCE(S256).** SecureAI는 PKCE 검증자/챌린지를 생성하고 `code_challenge` 및 `code_challenge_method=S256`를 사용하여 인증 URL을 구축한 후 관리자/사용자를 공급자에게 리디렉션하여 액세스 권한을 부여합니다.
3. **콜백.** 공급자가 `GET /api/connectors/oauth/callback/:slug`로 다시 리디렉션됩니다. 이 경로는 세션이 아닌 불투명한 `state` 매개변수(단기 10분 PKCE 저장소와 일치)로 보호되므로 인증 미들웨어가 필요하지 않습니다.
4. **토큰 교환 및 저장.** SecureAI는 PKCE 검증자를 통해 코드를 토큰으로 교환하고 이를 **사용자당** 저장합니다. 그런 다음 액세스 토큰은 해당 사용자의 도구 호출을 위해 MCP 전송(예: `BEARER_TOKEN`)에 주입됩니다.

## OAuth MCP 커넥터 연결

1. **관리 → 통합 → MCP** 및 OAuth 커넥터(예: Cloudflare 공식 원격 MCP)를 선택합니다.
2. **승인**을 클릭하면 공급자의 동의 화면이 팝업으로 열립니다.
3. 요청된 범위를 승인합니다.
4. 성공하면 다시 리디렉션되고 커넥터가 연결된 것으로 표시됩니다.

## 메모

- **사용자별 토큰.** 각 사용자는 개별적으로 승인합니다. 도구 호출은 공유 자격 증명이 아닌 해당 사용자 자신의 권한으로 실행됩니다.
- 이러한 커넥터(`pkceRequired: true`)에는 **PKCE가 필요**하므로 공용 클라이언트에 대해 클라이언트 암호가 저장되지 않습니다.
- **정적 클라이언트 커넥터.** 조직에서 OAuth 클라이언트를 사전 등록한 경우 해당 클라이언트 ID/비밀번호를 제공하면 SecureAI가 DCR 대신 이를 사용합니다.

## 관련

- [MCP 커넥터 개요](/ko/integrations/mcp/overview)
- [AI 게이트웨이 - 원격 엔드포인트](/ko/ai-gateway/remote-endpoints)