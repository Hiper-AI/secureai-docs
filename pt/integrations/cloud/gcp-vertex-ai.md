---
sidebar_position: 6
title: "Integração com Google Cloud Vertex AI"
sidebar_label: "Google Cloud Vertex AI"
description: "Conecte o Google Vertex AI para que o SecureAI possa inventariar agentes, modelos, contas de serviço, IAM, uso e custo"
---

# Google Vertex AI

Conecte seu projeto do Google Cloud para que a SecureAI possa inventariar agentes, endpoints e modelos da Vertex AI, juntamente com as contas de serviço, vinculações IAM, registros de auditoria, uso e faturamento que os cercam.

## O que o SecureAI importa

- **Agentes, endpoints e modelos da Vertex AI**
- **NHIs** — contas de serviço, chaves de conta de serviço e chaves de API (revogáveis — consulte [NHI Inventário](/pt/discovery/nhi-inventory))
- **IAM** vinculações de função
- **Registros de auditoria em nuvem**
- **Solicitações, tokens e custos** dos últimos 30 dias (reais da exportação de faturamento do BigQuery ou estimados)

## Pré-requisitos

- Uma **conta de serviço** com uma chave JSON, com funções de leitura concedidas no projeto:
  - `roles/aiplatform.viewer`
  - `roles/monitoring.viewer`
  - `roles/iam.securityReviewer`
  - `roles/logging.viewer`
  - `roles/billing.viewer`
  - Papéis do BigQuery (por exemplo, `roles/bigquery.dataViewer`, `roles/bigquery.jobUser`) se você usar a exportação de faturamento para o custo **real**.
  - *(Opcional)* funções de administrador de chave/conta de serviço se desejar que o SecureAI revogue identidades na origem.

## Credenciais

| Campo | Obrigatório | Descrição |
|-------|----------|------------|
| `projectId` | Sim | ID do projeto do GCP. |
| `location` | Sim | Região de vértice (por exemplo, `us-central1`). |
| `serviceAccountJson` | Sim | A chave da conta de serviço JSON. Criptografado em repouso. |
| `billingExportTable` | Não | Tabela do BigQuery para faturamento real (por exemplo, `dataset.gcp_billing_export_v1_XXXX`). |
| `billingProjectId` | Não | Projeto que hospeda a exportação de faturamento, se for diferente. |

### Onde obtê-los

1. No [console do Google Cloud](https://console.cloud.google.com/), acesse **IAM e Admin → Contas de serviço → Criar conta de serviço**.
2. Conceda as funções listadas acima.
3. Em **Chaves → Adicionar chave → JSON**, baixe o arquivo de chave.
4. Cole o JSON **inteiro** no campo `serviceAccountJson`.

## Conectar

1. **Administrador → Integrações → Nuvem → Google Vertex AI → Conectar.**
2. Insira o projeto, o local e o JSON da conta de serviço (além de campos de faturamento opcionais).
3. **Teste** e **Salve**.
4. **Sincronizar**.

## Verifique

Abra [Cloud Sensors](/pt/discovery/cloud-sensors) para agentes/endpoints/modelos descobertos e [NHI Inventário](/pt/discovery/nhi-inventory) para contas de serviço e chaves. Os insights mostram ligações, uso e custo de IAM.

## Revogação

Contas de serviço do GCP, chaves SA e chaves de API são **revogáveis** do [NHI Inventário](/pt/discovery/nhi-inventory) quando o conector tem as funções opcionais de administrador de chave/SA.

## Relacionado

- [Visão geral dos provedores de IA em nuvem](/pt/integrations/cloud/overview)
- [Google Workspace SSO](/pt/iam/google-workspace)
- [NHI Inventário](/pt/discovery/nhi-inventory)