---
sidebar_position: 4
title: "Integração com Azure AI Foundry"
sidebar_label: "Azure AI Foundry"
description: "Conecte o Azure AI Foundry/Azure OpenAI para que a SecureAI possa inventariar agentes, modelos, identidades, RBAC, uso e custo"
---

# Azure AI Foundry

Conecte seu locatário do Azure para que a SecureAI possa inventariar agentes Azure OpenAI/AI Foundry, AI Search, Bot Service e endpoints de ML, juntamente com as identidades Entra e RBAC que os governam.

## O que o SecureAI importa

- **Agentes Azure OpenAI/AI Foundry, AI Search, Bot Service e endpoints de ML**
- **NHIs** — Entras de serviço, segredos e certificados de aplicativos e identidades gerenciadas (revogáveis — consulte [NHI Inventário](/pt/discovery/nhi-inventory))
- **Azure RBAC** atribuições de função
- **Registros de atividades**
- **Uso, tokens e gastos** nos últimos 30 dias

## Pré-requisitos

- Um **registro de aplicativo Entra ID (Azure AD)** (principal de serviço) com um segredo do cliente.
- **Permissões do aplicativo Microsoft Graph** concedidas com consentimento do administrador:
  - `Application.Read.All`, `Directory.Read.All`, `AuditLog.Read.All` (ler).
  - `Application.ReadWrite.All` — **somente** se você deseja que o SecureAI revogue identidades na origem.
- A entidade de serviço atribuiu uma função de **Leitor** nas assinaturas/grupos de recursos relevantes.

## Credenciais

| Campo | Obrigatório | Descrição |
|-------|----------|------------|
| `tenantId` | Sim | ID do diretório (locatário). |
| `clientId` | Sim | ID do aplicativo (cliente) do registro do aplicativo. |
| `clientSecret` | Sim | Segredo do cliente. Criptografado em repouso. |
| `subscriptionId` | Não | Escopo a descoberta para uma assinatura específica. |

SecureAI autentica via OAuth2 (fluxo principal de serviço de credenciais de cliente).

### Onde obtê-los

1. No [portal do Azure](https://portal.azure.com/), acesse **Microsoft Entra ID → Registros de aplicativos → Novo registro**.
2. Copie o **ID do diretório (locatário)** e o **ID do aplicativo (cliente)** da Visão geral do aplicativo.
3. Em **Certificados e segredos**, crie um **segredo do cliente** e copie seu valor.
4. Em **Permissões de API**, adicione as permissões do Microsoft Graph acima e **Conceda consentimento do administrador**.
5. Atribua ao aplicativo a função **Leitor** na assinatura de destino (**Assinaturas → Controle de acesso (IAM)**).

## Conectar

1. **Administrador → Integrações → Nuvem → Azure AI Foundry → Conectar.**
2. Insira inquilino, cliente, segredo (e assinatura opcional).
3. **Teste** e **Salve**.
4. **Sincronização** (as sincronizações do Azure podem levar vários minutos — multisserviço + gráfico + varreduras de log de atividades).

## Verifique

Abra [Cloud Sensors](/pt/discovery/cloud-sensors) para agentes/endpoints descobertos e [NHI Inventário](/pt/discovery/nhi-inventory) para entidades de serviço, segredos e identidades gerenciadas. Os insights mostram RBAC, uso e gastos.

## Revogação

Entras de serviço, segredos/certificados de aplicativos e identidades gerenciadas são **revogáveis** via Microsoft Graph do [NHI Inventário](/pt/discovery/nhi-inventory) — isso requer a permissão `Application.ReadWrite.All` acima.

## Relacionado

- [Visão geral dos provedores de IA em nuvem](/pt/integrations/cloud/overview)
- [ID de entrada da Microsoft SSO](/pt/iam/microsoft-entra-id)
- [NHI Inventário](/pt/discovery/nhi-inventory)