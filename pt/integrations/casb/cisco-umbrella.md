---
sidebar_position: 2
title: "Integração com Cisco Umbrella"
sidebar_label: "Cisco Umbrella"
description: "Detecte shadow AI da atividade de DNS do Cisco Umbrella por meio da API de relatórios v2"
---

# Guarda-chuva Cisco

Conecte o Cisco Umbrella para que o SecureAI possa detectar quais fontes corporativas estão resolvendo domínios LLM/AI, usando a **Reporting API v2** da Umbrella. O Umbrella é uma fonte da camada DNS: ele confirma que um dispositivo *resolveu* um domínio de IA (não a carga útil TLS completa), que é exatamente o que a descoberta de IA sombra precisa.

SecureAI executa duas passagens para cobertura máxima:

1. Uma lista selecionada de domínios LLM/AI conhecidos.
2. **categoria de conteúdo `212` ("IA generativa")** da Umbrella, para que os serviços de IA recentemente populares sejam detectados antes mesmo de estarem na lista selecionada.

## Pré-requisitos

- Um pacote Umbrella que inclui a **API de relatórios** e registros de atividades de DNS.
- **Credenciais da API Umbrella** (chave de API + segredo) e seu **ID da organização**.

## Credenciais

| Campo | Obrigatório | Descrição |
|-------|----------|------------|
| `apiKey` | Sim | Chave da API de relatórios guarda-chuva. |
| `apiSecret` | Sim | Segredo da API de relatórios guarda-chuva. Criptografado em repouso. |
| `orgId` | Sim | Seu ID da organização guarda-chuva. |

### Onde obtê-los

1. Faça login no [painel do Umbrella](https://dashboard.umbrella.com/).
2. Vá para **Admin → Chaves de API** e crie uma chave com escopo **Relatórios**. Copie a chave e o segredo (mostrado uma vez).
3. Seu **ID da organização** é o ID numérico na URL do painel (`.../o/<orgId>/#/...`).

SecureAI autentica com `POST https://api.umbrella.com/auth/v2/token` (Básico `apiKey:apiSecret`, `client_credentials`) e lê `GET /reports/v2/activity/dns`.

## Conectar

1. **Administrador → Integrações → Rede → Cisco Umbrella → Conectar.**
2. Insira a chave de API, o segredo e o ID da organização.
3. **Teste** e **Salve**.
4. **Sincronização** — a primeira sincronização preenche a atividade DNS recente em segundo plano.

## Notas

- O guarda-chuva é **camada DNS**: uma correspondência confirma a resolução do domínio, não uma chamada de API concluída. É ideal para amplitude (todos os dispositivos atrás do Umbrella), mas não carrega cargas úteis de solicitação.
- Se a saída do Umbrella precisar passar por um proxy, defina `UMBRELLA_PROXY_URL` (ou o padrão `HTTPS_PROXY`) no backend SecureAI.

## Verifique

Após a primeira sincronização, abra [Fontes de rede](/pt/discovery/network-sources) — as fontes que resolveram domínios de IA aparecem com seus provedores, contagens de chamadas e gravidade.

## Relacionado

- [CASB e visão geral da rede](/pt/integrations/casb/overview)
- [Fontes de rede](/pt/discovery/network-sources)