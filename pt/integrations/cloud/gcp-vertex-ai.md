---
sidebar_position: 6
title: "Google Cloud — Discovery"
sidebar_label: "Google Cloud — Discovery"
description: "Conecte o Google Cloud para que a SecureAI possa inventariar agentes, modelos, contas de serviço, chaves, IAM, uso e custo da Vertex AI"
---

# Google Cloud — Discovery

Conecte seu projeto do Google Cloud para que a SecureAI possa inventariar agentes, endpoints e modelos da Vertex AI, juntamente com as contas de serviço, chaves, vinculações do IAM, registros de auditoria, uso e custo que os cercam.

<Info>
Este cartão **apenas lê** o projeto e nunca envia um prompt. Se você quer executar o tráfego de LLM da SecureAI na sua própria conta do Google Cloud, consulte [Google Vertex AI — Inferência na sua conta](/en/integrations/cloud/vertex-ai-inference).
</Info>

## O que a SecureAI importa

- **Vertex AI**: agentes (Agent Engine), endpoints de serving, jobs de batch e de tuning em execução, e modelos — o Model Registry mais cada modelo de publisher em uso (Gemini, Claude, modelos abertos).
- **Uso** dos últimos 30 dias, por modelo: solicitações (e quantas falharam), tokens de entrada e de saída, e tokens de cache de prompts.
- **Custo** dos últimos 30 dias: o gasto real deste projeto com IA, obtido da sua exportação de faturamento para o BigQuery, ou uma estimativa pelo preço de tabela.
- **NHIs**: contas de serviço, chaves de conta de serviço gerenciadas pelo usuário, chaves de API, pools e provedores de Workload Identity Federation, e clientes OAuth — com a última vez que cada chave e cada conta de serviço se autenticou. Revogáveis no [Inventário de NHIs](/pt/discovery/nhi-inventory).
- Vinculações de papéis do **IAM** no projeto.
- **Registros de auditoria do Cloud** dos serviços de IA e de identidade (Vertex AI, IAM, IAM Credentials, STS, API Keys, Resource Manager): os 200 eventos mais recentes dos últimos 30 dias.

## Pré-requisitos

Uma conta de serviço com a qual a SecureAI atua. Conceda a ela estes papéis **no projeto** (**IAM e administrador → IAM → Conceder acesso**):

| Papel | O que ele libera | |
|-------|------------------|---|
| `roles/aiplatform.viewer` | Agentes, endpoints, jobs e modelos da Vertex AI | Obrigatório |
| `roles/iam.securityReviewer` | Contas de serviço, chaves, chaves de API, Workload Identity, clientes OAuth, vinculações do IAM | Obrigatório |
| `roles/monitoring.viewer` | Solicitações e tokens por modelo | Recomendado |
| `roles/logging.viewer` | Registros de auditoria do Cloud | Recomendado |
| `roles/policyanalyzer.activityAnalysisViewer` | Último uso de cada chave e conta de serviço | Opcional |

Para o **custo real**, seus dados do Cloud Billing precisam estar [exportados para o BigQuery](https://cloud.google.com/billing/docs/how-to/export-data-bigquery?hl=pt-br), e a conta de serviço precisa de `roles/bigquery.dataViewer` no dataset da exportação e de `roles/bigquery.jobUser` no projeto que executa a consulta.

Para **revogar a partir da SecureAI** (opcional), conceda também o papel de cada ação que você quer permitir:

| Ação | Papel |
|------|-------|
| Desativar uma conta de serviço | `roles/iam.serviceAccountAdmin` |
| Excluir uma chave de conta de serviço | `roles/iam.serviceAccountKeyAdmin` |
| Excluir uma chave de API | `roles/serviceusage.apiKeysAdmin` |
| Desativar um pool ou provedor de Workload Identity | `roles/iam.workloadIdentityPoolAdmin` |
| Desativar um cliente OAuth | `roles/iam.oauthClientAdmin` |

<Note>
Você **não** precisa de `roles/billing.viewer`: é um papel de conta de faturamento, não pode ser concedido em um projeto e o conector não o usa.
</Note>

Nada é ignorado em silêncio: o que a SecureAI não consegue ler aparece com o papel que resolve o problema — ao conectar, após cada sincronização e no painel do GCP.

## Credenciais

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| `projectId` | Sim | O **ID** do projeto (por exemplo, `my-project-123`) — não o nome nem o número. |
| `location` | Sim | Local da Vertex AI onde estão seus agentes e endpoints (por exemplo, `us-central1`, `europe-west4`, `global`). O uso e o custo cobrem todos os locais. |
| `locations` | Não | Vários locais, separados por vírgulas (até 10). Substitui `location`. |
| `serviceAccountJson` | Um dos dois | A chave JSON da conta de serviço. Criptografada em repouso. |
| `impersonateServiceAccount` | Um dos dois | Sem chave: o e-mail da conta de serviço cuja identidade a SecureAI personifica. Aparece apenas quando sua implantação oferece acesso sem chave. |
| `billingExportTable` | Não | `project.dataset.table` da sua exportação de faturamento (por exemplo, `my-billing.billing_export.gcp_billing_export_v1_XXXXXX`). |
| `billingProjectId` | Não | Projeto que executa a consulta do BigQuery. Por padrão, o projeto da tabela; um nome `dataset.table` é procurado neste projeto (ou em `projectId`, se estiver vazio). |

### Onde obtê-los

**Opção A — chave JSON**

1. No [console do Google Cloud](https://console.cloud.google.com/), acesse **IAM e administrador → Contas de serviço → Criar conta de serviço** (por exemplo, `secureai-discovery`).
2. Acesse **IAM e administrador → IAM → Conceder acesso**, insira o e-mail da conta de serviço como principal e adicione os papéis de [Pré-requisitos](#pré-requisitos).
3. De volta em **Contas de serviço**, abra a conta → **Chaves → Adicionar chave → Criar nova chave → JSON** e baixe o arquivo.
4. Cole o JSON **inteiro** em `serviceAccountJson` e depois exclua o arquivo baixado.

O mesmo com `gcloud`:

```bash
PROJECT=my-project-123
gcloud iam service-accounts create secureai-discovery --project=$PROJECT --display-name="SecureAI discovery"
SA=secureai-discovery@$PROJECT.iam.gserviceaccount.com
for ROLE in roles/aiplatform.viewer roles/iam.securityReviewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud iam service-accounts keys create secureai-discovery.json --iam-account=$SA
```

<Warning>
Se o Google responder que a criação de chaves de conta de serviço está desativada, sua organização aplica a política `iam.disableServiceAccountKeyCreation` — o padrão nas organizações criadas desde 2024. Use a opção B ou peça ao administrador da sua organização uma exceção para este projeto.
</Warning>

**Opção B — sem chave (personificação)**

1. Crie a conta de serviço e conceda os papéis a ela (passos 1 e 2 acima).
2. No formulário de conexão da SecureAI, o campo **Service account to impersonate** indica qual conta da SecureAI deve ser autorizada. No Google Cloud, abra sua conta de serviço → **Permissões → Conceder acesso**, insira essa conta como principal e atribua a ela `roles/iam.serviceAccountTokenCreator`.
3. Insira o e-mail da sua conta de serviço no campo e deixe o JSON vazio.

Se o campo não aparecer, sua implantação não oferece acesso sem chave: use a opção A.

## Conectar

1. **Administrador → Integrações → Nuvem → Google Cloud — Discovery → Conectar.**
2. Insira o ID do projeto, o local (ou vários em **More Vertex AI Locations**) e a chave JSON ou a conta de serviço a personificar. Adicione os campos de faturamento se você usa a exportação.
3. Clique em **Conectar**. Antes de salvar, a SecureAI verifica as credenciais com uma leitura real do projeto — leva alguns segundos. Se não conseguir ler o projeto (ID incorreto, sem papéis, local digitado errado), ela mostra o motivo e não salva nada; o que você inseriu permanece no formulário.
4. Se salvar, mas faltarem papéis, um aviso os lista. Conceda-os e sincronize novamente.
5. Sincronize agora com o botão de atualizar do cartão. Depois disso, a SecureAI sincroniza automaticamente a cada 6 horas.

Para alterar as credenciais mais tarde, use **Conectar** novamente. Os campos deixados vazios mantêm o valor armazenado; inserir uma chave JSON substitui uma personificação armazenada, e vice-versa.

## Verifique

- [Sensores Cloud](/pt/discovery/cloud-sensors) lista os agentes descobertos. Clique no cartão do Google Cloud para abrir o painel do GCP: uso e custo (solicitações, falhas, tokens, cache, custo e sua origem), modelos e implantações, identidade e acesso (contas de serviço e chaves com seu último uso, vinculações do IAM) e auditoria.
- Se o painel disser **Discovery could not read everything**, conceda os papéis que ele lista e sincronize novamente.
- O [Inventário de NHIs](/pt/discovery/nhi-inventory) mostra as contas de serviço e as chaves.

Se uma sincronização falhar (por exemplo, porque a chave foi excluída ou os papéis foram removidos), o cartão mostra o erro e a SecureAI tenta novamente com espera progressiva, mantendo o último inventário. Uma leitura parcial nunca desativa agentes nem remove identidades.

## Custo

- **Com `billingExportTable`**: o gasto real deste projeto com serviços de IA (Vertex AI, Gemini API, Agent Builder, Dialogflow, …), descontados os créditos, na moeda da sua conta de faturamento. Quando os créditos cobrem o uso, o valor líquido pode ser zero; nesse caso o painel mostra ao lado o valor antes dos créditos. O Google atualiza a exportação com um atraso de várias horas.
- **Sem ela**: uma estimativa — tokens do Cloud Monitoring × preço de tabela, incluindo Claude e os tokens de cache de prompts. Não reflete descontos nem contratos de uso comprometido.

## Revogação

As identidades do GCP são revogáveis no [Inventário de NHIs](/pt/discovery/nhi-inventory) (cadeado) quando o conector tem o papel daquela ação (consulte [Pré-requisitos](#pré-requisitos)). O que cada uma faz no Google:

| Identidade | O que acontece no Google | Reversível |
|------------|--------------------------|------------|
| Conta de serviço | Desativada | Sim — reative-a no Google Cloud |
| Chave de conta de serviço | Excluída | Não |
| Chave de API | Excluída | Pode ser restaurada por 30 dias no Google Cloud |
| Pool / provedor de Workload Identity, cliente OAuth | Desativado | Sim |

Proteções:

- A conta de serviço que o conector usa, e as chaves dela, não podem ser revogadas a partir da SecureAI — isso interromperia a descoberta. Faça a rotação delas no Google Cloud.
- As contas de serviço padrão do Google (a padrão do Compute Engine, App Engine, Cloud Build, agentes de serviço) pedem uma segunda confirmação: desativar uma delas interrompe cada VM, aplicativo ou build que é executado com ela.
- Se faltar ao conector o papel de uma ação, o erro indica qual é.

## Relacionado

- [Google Vertex AI — Inferência na sua conta](/en/integrations/cloud/vertex-ai-inference)
- [Visão geral dos provedores de IA em nuvem](/pt/integrations/cloud/overview)
- [Google Workspace SSO](/pt/iam/google-workspace)
- [Inventário de NHIs](/pt/discovery/nhi-inventory)
