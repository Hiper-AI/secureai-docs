---
sidebar_position: 1
title: "Provedores Cloud de IA — Visão Geral"
sidebar_label: "Visão Geral Cloud"
description: "Conecte suas plataformas OpenAI, Anthropic, Azure, AWS e GCP AI para que a SecureAI possa inventariar agentes, modelos, identidades, uso e custos"
---

# Provedores de IA em nuvem

Os conectores Cloud AI Provider permitem que a SecureAI alcance as plataformas de IA que sua organização já usa — **OpenAI Platform, Anthropic Console, Azure AI Foundry e Google Vertex AI** — e inventariar automaticamente tudo o que é executado lá. Nenhum agente ou SDK precisa ser implantado no lado do provedor; SecureAI pesquisa a API de gerenciamento de cada provedor com as credenciais de leitura que você fornece.

Uma vez conectado, um conector descobre e sincroniza continuamente:

- **Agentes, modelos e implantações** em execução na plataforma → mostrados em [Cloud Sensors](/pt/discovery/cloud-sensors).
- **Identidades não humanas (NHIs)** — chaves de API, contas de serviço e (quando suportado) chaves BYOK → mostradas em [NHI Inventário](/pt/discovery/nhi-inventory), com controles de bloqueio/revogação.
- **Uso, tokens e custo** nos últimos 30 dias.
- **Sinais de governança** — vinculações IAM/RBAC, limites de gastos e registros de auditoria, exibidos em insights por provedor.

## O ciclo de configuração

Cada provedor segue as mesmas quatro etapas:

1. **Abra Admin → Integrações** e selecione a categoria **Nuvem**.
2. **Conecte** o cartão da operadora e insira suas credenciais (veja a página de cada operadora).
3. **Teste** a conexão para validar as credenciais.
4. **Sincronização** — a primeira sincronização executa uma importação completa; as sincronizações subsequentes são incrementais e também executadas de acordo com uma programação.

<Info>
**Onde as coisas aparecem**

A **configuração** do conector fica em **Administrador → Integrações**. O **inventário** que ele produz aparece em **Admin → Registro de Agente**: agentes/modelos descobertos em [Sensores de Nuvem](/pt/discovery/cloud-sensors) e identidades descobertas em [NHI Inventário](/pt/discovery/nhi-inventory). Você pode executar novamente uma sincronização em qualquer lugar.
</Info>

## Escolhendo credenciais

Use credenciais **somente leitura/visualizador** sempre que possível — o SecureAI só precisa *ler* seu inventário para construir a imagem. Alguns recursos opcionais (revogar uma chave vazada, criar um alerta de gasto) exigem permissões de gravação adicionais; cada página do provedor os destaca explicitamente e são sempre opcionais.

Todos os segredos inseridos (segredos do cliente, JSON da conta de serviço, chaves de API do administrador) são **criptografados em repouso**.

## Guias do provedor

| Provedor | Tipo de credencial |
|----------|-----------------|
| [Plataforma OpenAI](/pt/integrations/cloud/openai-platform) | Chave de API do administrador da organização |
| [Console Antrópico](/pt/integrations/cloud/anthropic-console) | Chave de API Admin (+ espaço de trabalho opcional/chaves de conformidade) |
| [Azure AI Foundry](/pt/integrations/cloud/azure-ai-foundry) | Entrar entidade de serviço (locatário/cliente/segredo) |
| [Google Vertex AI](/pt/integrations/cloud/gcp-vertex-ai) | JSON da conta de serviço |

## Relacionado

- [Cloud Sensors](/pt/discovery/cloud-sensors) — o inventário de agente/modelo descoberto.
- [NHI Inventário](/pt/discovery/nhi-inventory) — o inventário de identidade descoberto e controles de revogação.
- [Visão geral do inventário e descoberta de IA](/pt/discovery/overview)