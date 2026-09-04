---
sidebar_position: 3
title: "Integração com Anthropic Console"
sidebar_label: "Anthropic Console"
description: "Conecte o Anthropic Console para que a SecureAI possa inventariar espaços de trabalho, chaves, uso, custo e atividades de auditoria"
---

#Console Antrópico

Conecte sua organização Anthropic para que a SecureAI possa inventariar espaços de trabalho, chaves de API, contas de serviço, limites de gastos e (no Enterprise) o log de auditoria e análises do Claude Code.

## O que o SecureAI importa

- **Espaços de trabalho**, uso e custo
- **NHIs** — Chaves de API, contas de serviço e chaves BYOK (revogáveis — consulte [NHI Inventário](/pt/discovery/nhi-inventory))
- **Limites de gastos**
- **Registro de auditoria** (API Corporativa/Conformidade)
- **Análise do Claude Code **

## Pré-requisitos

- **Administrador** no Console Antrópico.
- Uma **chave de API de administrador** (`sk-ant-admin…`).
- *(Opcional)* uma **chave de espaço de trabalho** para desbloquear dados da plataforma do agente e uma **chave de API de conformidade** (Enterprise) para desbloquear o log de auditoria.

## Credenciais

| Campo | Obrigatório | Descrição |
|-------|----------|------------|
| `adminApiKey` | Sim | Chave de administração da organização, formato `sk-ant-admin…`. Criptografado em repouso. |
| `apiKey` | Não | Chave do espaço de trabalho — desbloqueia o inventário da Agent Platform. |
| `complianceApiKey` | Não | Chave de API de conformidade empresarial — desbloqueia o log de auditoria. |

### Onde obter a chave de administrador

1. Faça login no [Anthropic Console](https://console.anthropic.com/) como administrador.
2. Vá para **Configurações → Chaves de administrador** (nível da organização).
3. Crie uma chave de administrador e copie-a.

## Conectar

1. **Admin → Integrações → Nuvem → Anthropic Console → Connect.**
2. Cole a chave admin (e quaisquer chaves opcionais).
3. **Teste** e **Salve**.
4. **Sincronizar**.

## Verifique

Abra [Cloud Sensors](/pt/discovery/cloud-sensors) para espaços de trabalho/agentes descobertos e [NHI Inventário](/pt/discovery/nhi-inventory) para chaves e contas de serviço. Os insights mostram limites de uso, custo e gastos.

## Revogação

As chaves de API, contas de serviço e chaves BYOK da Anthropic são **revogáveis** do [NHI Inventário](/pt/discovery/nhi-inventory).

## Relacionado

- [Visão geral dos provedores de IA em nuvem](/pt/integrations/cloud/overview)
- [NHI Inventário](/pt/discovery/nhi-inventory)