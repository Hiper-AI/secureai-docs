---
sidebar_position: 6
title: "Google Cloud — Discovery"
sidebarTitle: "Google Cloud"
icon: "/img/icons/google-cloud.svg"
sidebar_label: "Google Cloud — Discovery"
description: "Conecte o Google Cloud para que a SecureAI possa inventariar agentes, modelos, contas de serviço, chaves, IAM, uso e custo da Vertex AI — em um projeto ou em toda uma organização"
---

# Google Cloud — Discovery

Conecte seu projeto do Google Cloud (ou uma organização ou pasta inteira) para que a SecureAI possa inventariar agentes, endpoints e modelos da Vertex AI, juntamente com as contas de serviço, chaves, vinculações do IAM, registros de auditoria, uso e custo que os cercam.

<Info>
Este cartão **apenas lê** o projeto e nunca envia um prompt. Se você quer executar o tráfego de LLM da SecureAI na sua própria conta do Google Cloud, consulte [Google Vertex AI — Inferência na sua conta](/pt/integrations/cloud/vertex-ai-inference).
</Info>

## O que a SecureAI importa

- **Vertex AI**: agentes (Agent Engine), endpoints de serving, jobs de batch e de tuning em execução, e modelos — o Model Registry mais cada modelo de publisher em uso (Gemini, Claude, modelos abertos).
- **Agent Builder / Gemini Enterprise e Dialogflow CX** (opcional): os engines do Agent Builder (Discovery Engine) com seus data stores, consultados nos locais `global`, `us` e `eu`; e os agentes do Dialogflow CX, consultados em `global` e nos locais da Vertex AI que você configurar.
- **Uso por modelo** dos últimos 30 dias: solicitações (e quantas falharam), tokens de entrada e de saída, e tokens de cache de prompts.
- **Uso por credencial** dos últimos 30 dias (Cloud Monitoring): total de solicitações e solicitações às APIs de IA (Vertex AI, Gemini API, Agent Builder, Dialogflow) de cada conta de serviço e de cada chave de API. O tráfego de clientes OAuth (pessoas e ferramentas como o console ou o `gcloud`) é somado à parte. Também fornece o último uso dessas contas e chaves.
- **Uso por modelo e identidade** (opcional): qual conta de serviço ou pessoa chamou qual modelo da Vertex AI, obtido dos registros de auditoria de acesso a dados (Data Access) se você os tiver ativados. Consulte [Uso por modelo e identidade](#uso-por-modelo-e-identidade).
- **Vertex AI usada fora da SecureAI**: as identidades que chamaram a Vertex AI ou o Gemini diretamente, sem passar pela conexão de inferência da SecureAI. Consulte [Vertex AI usada fora da SecureAI](#vertex-ai-usada-fora-da-secureai).
- **Custo** dos últimos 30 dias: o gasto real deste projeto com IA, obtido da sua exportação de faturamento para o BigQuery, ou uma estimativa pelo preço de tabela.
- **NHIs**: contas de serviço, chaves de conta de serviço gerenciadas pelo usuário, chaves de API, pools e provedores de Workload Identity Federation, e clientes OAuth — com seu último uso (do Policy Analyzer e do uso por credencial) e seu [risco de privilégio](#risco-de-privilégio). Revogáveis e restauráveis no [Inventário de NHIs](/pt/discovery/nhi-inventory), manualmente ou com [políticas automáticas](#políticas-automáticas-de-nhi).
- Vinculações de papéis do **IAM** no projeto.
- **Registros de auditoria do Cloud** dos serviços de IA e de identidade (Vertex AI, IAM, IAM Credentials, STS, API Keys, Resource Manager): os 200 eventos mais recentes dos últimos 30 dias.

Por padrão, o conector lê **um projeto**. Com o campo **Organization or folder**, ele lê todos os projetos ativos de uma organização ou pasta: consulte [Modo organização ou pasta](#modo-organização-ou-pasta).

## Pré-requisitos

### APIs ativadas

A SecureAI lê cada superfície com a API do Google correspondente. Ative-as no projeto (**APIs e serviços → Biblioteca**, ou com `gcloud services enable`):

| API | Para quê | |
|-----|----------|---|
| `cloudresourcemanager.googleapis.com` | O projeto e suas vinculações do IAM | Obrigatória |
| `iam.googleapis.com` | Contas de serviço, chaves, Workload Identity, clientes OAuth | Obrigatória |
| `aiplatform.googleapis.com` | Agentes, endpoints, jobs e modelos da Vertex AI | Obrigatória |
| `apikeys.googleapis.com` | Chaves de API | Recomendada |
| `monitoring.googleapis.com` | Uso por modelo e por credencial | Recomendada |
| `logging.googleapis.com` | Registros de auditoria e registros de acesso a dados (Data Access) | Recomendada |
| `policyanalyzer.googleapis.com` | Último uso de chaves e contas de serviço (Policy Analyzer) | Opcional |
| `bigquery.googleapis.com` | Custo real, se você usa a exportação de faturamento (no projeto que executa a consulta) | Opcional |
| `cloudasset.googleapis.com` | Modo organização ou pasta (no projeto da conta de serviço) | Somente nesse modo |
| `discoveryengine.googleapis.com` | Agent Builder / Gemini Enterprise | Se você usa esse produto |
| `dialogflow.googleapis.com` | Agentes do Dialogflow CX | Se você usa esse produto |

Uma API desativada não faz a sincronização falhar: ela aparece como uma lacuna, **API disabled in the project — enable it**, com o nome do serviço. Agent Builder e Dialogflow são a exceção: se a API deles estiver desativada, a SecureAI entende que o projeto não usa esse produto e não a marca como lacuna.

### Papéis

Uma conta de serviço com a qual a SecureAI atua. Conceda a ela estes papéis **no projeto** (**IAM e administrador → IAM → Conceder acesso**):

| Papel | O que ele libera | |
|-------|------------------|---|
| `roles/aiplatform.viewer` | Agentes, endpoints, jobs e modelos da Vertex AI | Obrigatório |
| `roles/iam.securityReviewer` | Contas de serviço, chaves, chaves de API, Workload Identity, clientes OAuth, vinculações do IAM | Obrigatório |
| `roles/monitoring.viewer` | Uso por modelo (solicitações e tokens) e uso por credencial | Recomendado |
| `roles/logging.viewer` | Registros de auditoria do Cloud | Recomendado |
| `roles/policyanalyzer.activityAnalysisViewer` | Último uso de cada chave e conta de serviço | Opcional |
| `roles/logging.privateLogViewer` | Uso por modelo e identidade: os registros de acesso a dados (Data Access) são registros privados, e `roles/logging.viewer` não os lê | Opcional |
| `roles/discoveryengine.viewer` | Engines do Agent Builder / Gemini Enterprise | Opcional |
| `roles/dialogflow.reader` | Agentes do Dialogflow CX | Opcional |

Para o **custo real**, seus dados do Cloud Billing precisam estar [exportados para o BigQuery](https://cloud.google.com/billing/docs/how-to/export-data-bigquery?hl=pt-br), e a conta de serviço precisa de `roles/bigquery.dataViewer` no dataset da exportação e de `roles/bigquery.jobUser` no projeto que executa a consulta.

Para **revogar e restaurar a partir da SecureAI** (opcional), você precisa do papel de cada ação que quer permitir. Se sua implantação oferece acesso sem chave, conceda-os a uma [conta de serviço separada, só para revogação](#conta-de-serviço-separada-para-revogação), e mantenha a conta de leitura com papéis somente de leitura; caso contrário, conceda-os à conta de serviço do conector:

| Ação | Papel |
|------|-------|
| Desativar (ou reativar) uma conta de serviço | `roles/iam.serviceAccountAdmin` |
| Excluir uma chave de conta de serviço | `roles/iam.serviceAccountKeyAdmin` |
| Excluir (ou restaurar) uma chave de API | `roles/serviceusage.apiKeysAdmin` |
| Desativar (ou reativar) um pool ou provedor de Workload Identity | `roles/iam.workloadIdentityPoolAdmin` |
| Desativar (ou reativar) um cliente OAuth | `roles/iam.oauthClientAdmin` |

<Note>
Você **não** precisa de `roles/billing.viewer`: é um papel de conta de faturamento, não pode ser concedido em um projeto e o conector não o usa.
</Note>

Nada é ignorado em silêncio: o que a SecureAI não consegue ler aparece com o papel que resolve o problema — ao conectar, após cada sincronização e no painel do GCP.

## Credenciais

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| **Google Cloud Project ID** (`projectId`) | Sim | O **ID** do projeto (por exemplo, `my-project-123`) — não o nome nem o número. No modo organização, é o projeto de cota e de faturamento. |
| **Vertex AI Location** (`location`) | Sim | Local da Vertex AI onde estão seus agentes e endpoints (por exemplo, `us-central1`, `europe-west4`, `global`). O uso e o custo cobrem todos os locais. |
| **More Vertex AI Locations** (`locations`) | Não | Vários locais, separados por vírgulas (até 10). Substitui o local acima. |
| **Service Account JSON** (`serviceAccountJson`) | Um dos dois | A chave JSON da conta de serviço. Criptografada em repouso. |
| **Service account to impersonate** (`impersonateServiceAccount`) | Um dos dois | Sem chave: o e-mail da conta de serviço cuja identidade a SecureAI personifica. Aparece apenas quando sua implantação oferece acesso sem chave. |
| **Service account for revocation** (`revokeImpersonateServiceAccount`) | Não | Uma segunda conta de serviço usada apenas para revogar ou restaurar identidades, nunca para ler. Aparece apenas quando sua implantação oferece acesso sem chave. |
| **Organization or folder** (`scope`) | Não | `organizations/<número>` ou `folders/<número>`: lê todos os projetos ativos que ela contém. |
| **BigQuery Billing Export Table** (`billingExportTable`) | Não | `project.dataset.table` da sua exportação de faturamento (por exemplo, `my-billing.billing_export.gcp_billing_export_v1_XXXXXX`). |
| **BigQuery Billing Project ID** (`billingProjectId`) | Não | Projeto que executa a consulta do BigQuery. Por padrão, o projeto da tabela; um nome `dataset.table` é procurado neste projeto (ou no ID do projeto, se estiver vazio). |

### Onde obtê-los

**Opção A — chave JSON**

1. No [console do Google Cloud](https://console.cloud.google.com/), acesse **IAM e administrador → Contas de serviço → Criar conta de serviço** (por exemplo, `secureai-discovery`).
2. Acesse **IAM e administrador → IAM → Conceder acesso**, insira o e-mail da conta de serviço como principal e adicione os papéis de [Pré-requisitos](#pré-requisitos).
3. De volta em **Contas de serviço**, abra a conta → **Chaves → Adicionar chave → Criar nova chave → JSON** e baixe o arquivo.
4. Cole o JSON **inteiro** em **Service Account JSON** e depois exclua o arquivo baixado.

O mesmo com `gcloud`:

```bash
PROJECT=my-project-123
gcloud services enable cloudresourcemanager.googleapis.com iam.googleapis.com aiplatform.googleapis.com \
  apikeys.googleapis.com monitoring.googleapis.com logging.googleapis.com policyanalyzer.googleapis.com \
  --project=$PROJECT
gcloud iam service-accounts create secureai-discovery --project=$PROJECT --display-name="SecureAI discovery"
SA=secureai-discovery@$PROJECT.iam.gserviceaccount.com
for ROLE in roles/aiplatform.viewer roles/iam.securityReviewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
# Opcional: último uso, uso por modelo e identidade, Agent Builder e Dialogflow CX
for ROLE in roles/policyanalyzer.activityAnalysisViewer roles/logging.privateLogViewer roles/discoveryengine.viewer roles/dialogflow.reader; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud iam service-accounts keys create secureai-discovery.json --iam-account=$SA
```

Se você usa o Agent Builder ou o Dialogflow CX, as APIs deles já estão ativadas no projeto; não é preciso ativá-las para a SecureAI.

<Warning>
Se o Google responder que a criação de chaves de conta de serviço está desativada, sua organização aplica a política `iam.disableServiceAccountKeyCreation` — o padrão nas organizações criadas desde 2024. Use a opção B ou peça ao administrador da sua organização uma exceção para este projeto.
</Warning>

**Opção B — sem chave (personificação)**

1. Crie a conta de serviço e conceda os papéis a ela (passos 1 e 2 acima).
2. No formulário de conexão da SecureAI, o texto de ajuda do campo **Service account to impersonate (keyless — instead of the JSON)** indica qual conta da SecureAI deve ser autorizada. No Google Cloud, abra sua conta de serviço → **Permissões → Conceder acesso**, insira essa conta como principal e atribua a ela `roles/iam.serviceAccountTokenCreator`. Com `gcloud`:

   ```bash
   gcloud iam service-accounts add-iam-policy-binding $SA \
     --member=serviceAccount:SECUREAI_ACCOUNT --role=roles/iam.serviceAccountTokenCreator
   ```

3. Insira o e-mail da sua conta de serviço no campo e deixe o JSON vazio.

Se o campo não aparecer, sua implantação não oferece acesso sem chave — use a opção A.

### Conta de serviço separada para revogação

Se sua implantação oferece acesso sem chave, você pode manter a leitura e a revogação separadas. Isso é recomendado em vez de dar os papéis de revogação à conta de serviço que lê:

1. Crie uma segunda conta de serviço (por exemplo, `secureai-revoke`) e conceda a ela **apenas** os papéis de revogação de [Pré-requisitos](#pré-requisitos).
2. Nessa conta, conceda `roles/iam.serviceAccountTokenCreator` à conta da SecureAI indicada no texto de ajuda do campo **Service account for revocation (optional — separate from reading)**.
3. Insira o e-mail dela nesse campo.

A SecureAI solicita um token de 1 hora a essa conta somente enquanto revoga ou restaura uma identidade; a sincronização nunca a usa. A conta de serviço de leitura mantém papéis somente de leitura. A SecureAI também se recusa a revogar a conta de revogação a partir do inventário.

## Modo organização ou pasta

Para inventariar vários projetos com um único conector, preencha **Organization or folder** com `organizations/<número>` ou `folders/<número>` (por exemplo, `organizations/123456789012`).

- A SecureAI encontra os projetos ativos com o **Cloud Asset Inventory** e lê cada um como se fosse um conector de projeto único. O **Google Cloud Project ID** continua sendo o projeto de cota e de faturamento.
- Conceda à conta de serviço, **na organização ou pasta**: `roles/cloudasset.viewer`, `roles/iam.securityReviewer` e `roles/aiplatform.viewer`, mais `roles/monitoring.viewer` e `roles/logging.viewer` para uso e auditoria.
- Ative `cloudasset.googleapis.com` no projeto da conta de serviço.

```bash
ORG=123456789012
for ROLE in roles/cloudasset.viewer roles/iam.securityReviewer roles/aiplatform.viewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud organizations add-iam-policy-binding $ORG --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud services enable cloudasset.googleapis.com --project=$PROJECT
```

Para uma pasta, use `gcloud resource-manager folders add-iam-policy-binding <número>` em vez de `gcloud organizations add-iam-policy-binding`.

Para que uma sincronização termine em um tempo razoável, cada uma tem limites. O projeto de cota vem primeiro, depois os projetos com recursos da Vertex AI:

| O quê | Limite por sincronização |
|-------|--------------------------|
| Projetos inventariados | 200 |
| Uso por modelo (Cloud Monitoring) fora do escopo de métricas do projeto de cota | 15 projetos com Vertex AI |
| Registros de auditoria | 25 projetos |
| Uso por modelo e identidade (registros de acesso a dados) | 10 projetos |

O que ficar fora de um limite aparece como uma lacuna parcial, com quanto foi lido. Um projeto que não pode ser lido também é listado como lacuna, e **nada dele é retirado nem eliminado**. Ao conectar, o teste neste modo apenas enumera a primeira página de projetos e verifica o projeto de cota: ler cada projeto é tarefa da sincronização.

## Conectar

1. **Admin → Integrations → Cloud → Google Cloud — Descoberta → Conectar Integração.**
2. Insira o ID do projeto, o local (ou vários em **More Vertex AI Locations**) e a chave JSON ou a conta de serviço a personificar. Se você os usa, adicione a conta de serviço para revogação, a organização ou pasta e os campos de faturamento.
3. Clique em **Conectar**. Antes de salvar, a SecureAI verifica as credenciais com uma leitura real do projeto — leva alguns segundos. Se não conseguir ler o projeto, ela mostra o motivo e não salva nada; o que você inseriu permanece no formulário. As mensagens possíveis estão em [Solução de problemas](#solução-de-problemas).
4. Se salvar, mas faltarem papéis, um aviso os lista. Conceda-os e sincronize novamente.
5. Sincronize agora com o botão de atualizar do cartão. Depois disso, a SecureAI sincroniza automaticamente a cada 6 horas.

Para alterar as credenciais mais tarde, use **Conectar** novamente. Os campos deixados vazios mantêm o valor armazenado; inserir uma chave JSON substitui uma personificação armazenada, e vice-versa.

## Verifique

- [Sensores Cloud](/pt/discovery/cloud-sensors) lista os agentes descobertos. Clique no cartão do Google Cloud para abrir o painel do GCP: uso e custo (solicitações, falhas, tokens, cache, custo e sua origem), modelos e implantações, identidade e acesso (contas de serviço e chaves com seu último uso, vinculações do IAM) e auditoria.
- Se o painel disser **Discovery could not read everything**, revise cada linha (consulte [Solução de problemas](#solução-de-problemas)) e sincronize novamente.
- O [Inventário de NHIs](/pt/discovery/nhi-inventory) mostra as contas de serviço e as chaves.

Se uma sincronização falhar (por exemplo, porque a chave foi excluída ou os papéis foram removidos), o cartão mostra o erro e a SecureAI tenta novamente com espera progressiva, mantendo o último inventário. Uma leitura parcial nunca desativa agentes nem remove identidades.

## Uso por modelo e identidade

O Cloud Monitoring informa quantas solicitações cada credencial fez, mas não a qual modelo. Para saber **qual identidade chamou qual modelo**, a SecureAI lê os registros de auditoria de **acesso a dados (Data Access)** da Vertex AI. É opcional e depende de você:

- A SecureAI só os lê se os registros **DATA_READ** ou **DATA_WRITE** estiverem ativados para `aiplatform.googleapis.com` (ou para todos os serviços). A SecureAI detecta isso na política do IAM; ela nunca os ativa.
- Ativá-los tem um **custo de ingestão do Cloud Logging**, pelas tarifas do Google. Você os ativa em **IAM e administrador → Registros de auditoria → Vertex AI API → Leitura de dados**.
- A conta de serviço precisa de `roles/logging.privateLogViewer`.
- Por projeto e por sincronização, a SecureAI lê até 5.000 entradas ou durante 20 segundos, o que ocorrer primeiro.
- Se estiverem desativados, o painel mostra uma lacuna opcional explicando como ativá-los. Se você os ativou na organização ou pasta, mas conecta um único projeto, a SecureAI não consegue ver isso pela política do projeto e mostra a lacuna mesmo assim.

## Risco de privilégio

Com a política do IAM lida, a SecureAI marca uma conta de serviço como **privilegiada** quando ela tem algum destes papéis:

- Proprietário (`roles/owner`) ou Editor (`roles/editor`);
- qualquer papel de administrador (`roles/<serviço>.admin` ou terminado em `Admin`);
- `roles/iam.serviceAccountTokenCreator` ou `roles/iam.serviceAccountUser`, que permitem a quem os tem atuar como outras contas de serviço.

Uma chave gerenciada pelo usuário de uma conta de serviço privilegiada herda a marcação: quem tem a chave tem esse privilégio. Chaves de API **sem restrições** (sem destino de API e sem restrição de aplicativo) também são marcadas. No [Inventário de NHIs](/pt/discovery/nhi-inventory), elas aparecem entre os fatores de risco como **Privileged (admin role or impersonation)** e **API key without restrictions**. Se a política do IAM não puder ser lida, a SecureAI não marca nada, em vez de tratar uma conta como não privilegiada.

## Vertex AI usada fora da SecureAI

No painel do GCP, a guia **Identity & Access** inclui **Vertex AI used outside SecureAI**: as identidades que chamaram a Vertex AI ou o Gemini diretamente nos últimos 30 dias, sem passar pela [conexão de inferência da Vertex AI](/pt/integrations/cloud/vertex-ai-inference). Esses prompts não passaram por DLP, políticas nem recibos assinados.

- Com os registros de auditoria de acesso a dados (Data Access) ativados (consulte [Uso por modelo e identidade](#uso-por-modelo-e-identidade)), cada linha diz quais modelos foram chamados e quantas vezes, e só são contadas chamadas de inferência.
- Sem eles, o número vem do Cloud Monitoring por credencial (conta de serviço ou chave de API) e inclui toda chamada a uma API de IA (Vertex AI, Gemini API, Agent Builder, Dialogflow), não só inferência.
- A conta de serviço da conexão de inferência e a do conector nunca são contadas. As pessoas não são listadas uma a uma: as chamadas delas ficam em uma única linha agregada (**People (Google accounts)**, ou **People and tools (OAuth)**: console, gcloud, apps).
- Se a SecureAI não conseguiu ler a conexão de inferência nessa sincronização, ela não classifica nada, indica isso como lacuna opcional e mantém o resultado da sincronização anterior.
- Gera a constatação do Insights **Google Vertex AI / Gemini is being used outside SecureAI**: moderada, e crítica se quem chama é uma chave de API (uma credencial de longa duração). É mapeada para OWASP LLM02, ISO/IEC 42001 A.4.2 e A.6.2.6, e NIST AI RMF MAP-1.1 e GOVERN-6.1.

## Custo

- **Com a tabela de exportação de faturamento**: o gasto real deste projeto com serviços de IA (Vertex AI, Gemini API, Agent Builder, Dialogflow, …), descontados os créditos, na moeda da sua conta de faturamento. Quando os créditos cobrem o uso, o valor líquido pode ser zero; nesse caso o painel mostra ao lado o valor antes dos créditos. O Google atualiza a exportação com um atraso de várias horas.
- **Sem ela**: uma estimativa — tokens do Cloud Monitoring × preço de tabela, incluindo Claude e os tokens de cache de prompts. Não reflete descontos nem contratos de uso comprometido.

## Revogação e restauração

As identidades do GCP são revogáveis no [Inventário de NHIs](/pt/discovery/nhi-inventory) (cadeado) quando o conector, ou a conta de serviço para revogação, tem o papel daquela ação (consulte [Pré-requisitos](#pré-requisitos)). O que cada uma faz no Google:

| Identidade | O que acontece no Google | Reversível |
|------------|--------------------------|------------|
| Conta de serviço | Desativada | Sim — **Restore** a reativa |
| Chave de conta de serviço | Excluída | Não — o Google a destrói. Crie uma nova chave |
| Chave de API | Excluída | Sim, por 30 dias — **Restore** a traz de volta; depois disso o Google não a guarda mais |
| Pool / provedor de Workload Identity, cliente OAuth | Desativado | Sim — **Restore** o reativa |

Para desfazer uma revogação, abra o menu da identidade no Inventário de NHIs e escolha **Restore** (*Undo the revocation at Google Cloud*). A identidade é ativada novamente no Google Cloud e, na SecureAI, é desbloqueada e permanece **In remediation** até que você a revise.

- Só pode ser restaurado o que **a SecureAI revogou no Google Cloud**, manualmente ou por uma política automática. Não é oferecido para um bloqueio apenas no gateway da SecureAI, nem para uma identidade que sua equipe desativou diretamente no Google Cloud.
- Uma chave de conta de serviço excluída não pode ser restaurada: a SecureAI recusa sem chamar o Google.
- Restaurar usa os mesmos papéis que revogar.

Proteções:

- A conta de serviço que o conector usa, e as chaves dela, não podem ser revogadas a partir da SecureAI — isso interromperia a descoberta. O mesmo vale para a conta de serviço para revogação. Faça a rotação delas no Google Cloud.
- Também não podem ser revogadas a conta de serviço com que a conexão de [inferência da Vertex AI](/pt/integrations/cloud/vertex-ai-inference) se autentica, nem a chave com que ela assina: isso interromperia todas as chamadas governadas. Com a opção sem chave (personificação), só a conta de serviço fica protegida: as chaves dela podem ser revogadas, porque a SecureAI não assina com nenhuma delas. Se a SecureAI não conseguir verificar qual identidade a conexão de inferência usa, ela não revoga nenhuma conta de serviço nem chave de conta de serviço (as chaves de API não são afetadas).
- As contas de serviço padrão do Google (a padrão do Compute Engine, App Engine, Cloud Build, agentes de serviço) pedem uma segunda confirmação: desativar uma delas interrompe cada VM, aplicativo ou build que é executado com ela.
- Se faltar ao conector o papel de uma ação, o erro indica qual é.

## Políticas automáticas de NHI

As **políticas automáticas de NHI** (Inventário de NHIs → **Automatic policies**) alertam sobre identidades do Google Cloud ou as revogam por regra, sem revisá-las uma a uma. Elas são avaliadas ao final de cada sincronização bem-sucedida do conector, apenas sobre as identidades dele.

| Regra | No Google Cloud | Limite padrão |
|-------|-----------------|---------------|
| **Unused SA key / IAM access key** | Chave de conta de serviço que não se autentica há N dias. Só age sobre um último uso conhecido: uma chave sem uso registrado não é afetada. | 90 dias |
| **Old SA key / IAM access key** | Chave de conta de serviço criada há mais de N dias, usada ou não. | 365 dias |
| **Unrestricted API key** | Chave de API sem restrição de aplicativo e sem destino de API. | — |
| **Privileged SA with a user key** | Chave gerenciada pelo usuário de uma conta de serviço [privilegiada](#risco-de-privilégio). | — |

Cada regra tem três modos: **Off**, **Alert** e **Revoke**. Todas começam desativadas. As proteções:

- O **Simulation mode (dryRun)** vem ativado por padrão: com ele, nenhuma regra em **Revoke** corta nada; apenas lista o que faria. Desativá-lo é a única coisa que habilita cortes reais. **Simulate with this configuration** mostra o efeito antes de você salvar.
- **Revocation cap per run**: 5 por padrão (de 1 a 50). Se, em uma execução, as regras em **Revoke** corresponderem a mais identidades do que o limite, nada é cortado e um alerta é enviado.
- **Exclusions**: nenhuma regra age sobre uma identidade cujo proprietário, nome ou recurso corresponda a um padrão; `*` é o único curinga.
- Só são avaliadas listagens de chaves completas.
- Uma credencial que a SecureAI usa (a do conector, a da conta de revogação ou a da inferência da Vertex AI) nunca é cortada. As chaves das contas de serviço padrão do Google nunca são cortadas automaticamente: a regra apenas alerta, e uma pessoa decide.

No Google Cloud, revogar uma chave de conta de serviço a **exclui** (ela não pode ser restaurada), e revogar uma chave de API a exclui com 30 dias para restaurá-la. Cada ação é auditada e notificada.

## Solução de problemas

### Ao conectar

Se o teste falhar, **Conectar** mostra uma destas mensagens e não salva nada:

| Mensagem | Causa | O que fazer |
|----------|-------|-------------|
| `"My Project" is not a GCP project ID (use the ID, e.g. my-project-123 — not the project name or number).` | Você inseriu o nome ou o número do projeto | Copie o **ID** do projeto no seletor de projetos do console. |
| `<account> cannot read GCP project "<id>": it does not exist, or the service account has no role on it. Check the project ID and grant roles/aiplatform.viewer and roles/iam.securityReviewer on the project.` | O ID não existe, ou a conta de serviço não tem nenhum papel nesse projeto | Verifique o ID e conceda os dois papéis obrigatórios no projeto. |
| `Vertex AI location "mars-central9" is not reachable (no such endpoint (HTTP 404)). Check the location (e.g. us-central1, europe-west4, global).` | O local não existe (por exemplo, digitado errado) | Corrija o local. |
| `The Cloud Asset API is not enabled for <account>'s project. Enable cloudasset.googleapis.com and retry.` | Modo organização sem a Cloud Asset API | Ative `cloudasset.googleapis.com` no projeto da conta de serviço. |
| `<account> cannot list the projects of organizations/<number>. Grant roles/cloudasset.viewer and roles/iam.securityReviewer on the organization …` | Modo organização sem os papéis na organização ou pasta, ou um número errado | Conceda os papéis na organização ou pasta, ou remova o campo para ler apenas o projeto. |

### Lacunas do painel

Quando o painel do GCP diz **Discovery could not read everything**, cada linha indica a superfície e o que está faltando. As linhas marcadas como *optional* apenas enriquecem o inventário.

| O que a linha mostra | O que significa | O que fazer |
|----------------------|-----------------|-------------|
| Um papel (por exemplo, `roles/monitoring.viewer`) | Falta esse papel à conta de serviço | Conceda-o no projeto (ou na organização ou pasta) e sincronize novamente. |
| **API disabled in the project — enable it** | A API dessa superfície está desativada; o detalhe indica o serviço | Ative-a em **APIs e serviços → Biblioteca**. |
| Nenhum papel, e um detalhe dizendo que uma política da organização proíbe o local | Uma política da organização (`constraints/gcp.resourceLocations`) bloqueia esse local, então nada pode existir ali. Nenhum papel resolve isso | Remova esse local da configuração ou peça ao administrador da sua organização que o permita. |
| **Usage by model and identity** não ativado | Os registros de acesso a dados (Data Access) da Vertex AI estão desativados | Opcional: consulte [Uso por modelo e identidade](#uso-por-modelo-e-identidade). |
| Uma leitura parcial (por exemplo, um limite do modo organização) | Só uma parte foi lida; o detalhe diz quanto | Nada é retirado nem eliminado por causa disso. Se você precisa ver tudo, restrinja o escopo. |

## Relacionado

- [Google Vertex AI — Inferência na sua conta](/pt/integrations/cloud/vertex-ai-inference)
- [Visão geral dos provedores de IA em nuvem](/pt/integrations/cloud/overview)
- [Google Workspace SSO](/pt/iam/google-workspace)
- [Inventário de NHIs](/pt/discovery/nhi-inventory)
