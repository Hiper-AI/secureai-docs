---
sidebar_position: 4
title: "Azure — Descoberta"
sidebar_label: "Azure — Descoberta"
description: "Conecte o Azure e o Microsoft Entra ID para que o SecureAI faça o inventário dos seus recursos Azure OpenAI e Foundry, projetos e agentes do Foundry, AI Search, Bot Service e de cada identidade não humana (entidades de serviço, identidades de agente, identidades gerenciadas, segredos, certificados e credenciais federadas) com suas permissões, além de RBAC, atividade, uso e custo."
---

# Azure — Descoberta

Conecte o seu locatário do Azure para que o SecureAI faça o inventário dos seus recursos de IA no Azure e de **cada identidade não humana (NHI)** no Microsoft Entra ID, com as funções e as permissões de cada uma.

<Info>
Esta conexão **apenas lê** e nunca envia um prompt. Para executar o tráfego de LLM do SecureAI no seu próprio recurso Foundry, consulte [Azure AI Foundry — Inference in your account](/en/integrations/cloud/azure-ai-foundry-inference). São duas conexões independentes, com entidades de serviço e permissões diferentes; você pode usar as duas na mesma assinatura.
</Info>

## O que o SecureAI importa

Para cada assinatura que a entidade de serviço consegue ler:

- **Recursos de IA**: cada conta de Azure AI Services, Azure OpenAI e outros Cognitive Services (Content Safety, Speech, Language, Document Intelligence…), com sua região e estado.
- **Implantações de modelos** do Azure OpenAI e do Foundry, com sua capacidade e o uso dos últimos 30 dias (solicitações, tokens de entrada e de saída, do Azure Monitor).
- **Projetos e agentes do Foundry**: os agentes do Foundry Agent Service e os assistentes clássicos de cada projeto, com o modelo que cada um usa. Também hubs e projetos baseados em hub (Azure Machine Learning), com seus endpoints online e serverless.
- **Azure AI Search** e **Azure Bot Service**.
- **Custo** do mês atual, por serviço (Cost Management).
- **Atividade**: eventos de gerenciamento do Cognitive Services e do Machine Learning dos últimos 30 dias (Log de Atividades).
- **NHIs**, listadas no [Inventário de NHIs](/pt/discovery/nhi-inventory):
  - **Entidades de serviço** de aplicativos empresariais.
  - **Identidades de agente** do Microsoft Entra, as que o Foundry cria para cada agente (classificadas como *agente*).
  - **Identidades gerenciadas**, atribuídas pelo sistema e pelo usuário.
  - **Segredos do cliente** e **certificados** dos registros de aplicativo, com a data de expiração.
  - **Credenciais federadas** (federação de identidade de carga de trabalho). Por exemplo, uma relação de confiança OIDC do GitHub Actions permite que esse repositório obtenha tokens como o aplicativo, sem nenhum segredo.
  - O **último login** de cada aplicativo, quando o seu locatário expõe esse relatório.
- **Permissões de cada identidade**: suas funções do Azure RBAC em qualquer escopo da assinatura (assinatura, grupo de recursos ou recurso), suas permissões de aplicativo do Microsoft Graph e suas funções de diretório do Entra.
- **Atribuições de função do RBAC**: cada função pelo nome, com os usuários, grupos e aplicativos que a possuem.

Uma identidade é marcada como **privilegiada** quando possui qualquer um destes itens:

- uma das funções **Owner**, **Contributor**, **User Access Administrator** ou **Role Based Access Control Administrator**;
- uma permissão de gravação do Graph, como `Application.ReadWrite.All`, `Directory.ReadWrite.All`, `Mail.Send` ou `Files.ReadWrite.All`;
- uma função de administrador de diretório, como Global Administrator ou Application Administrator.

Os segredos, certificados e credenciais federadas de um aplicativo privilegiado também são marcados como privilegiados.

O SecureAI não importa as cerca de 130 entidades de serviço que a Microsoft cria em todo locatário (Azure Portal, Microsoft Graph etc.) nem as conexões de login social: não são identidades suas para governar.

## Pré-requisitos

Um **registro de aplicativo** do Microsoft Entra ID (entidade de serviço) com um **segredo do cliente** e estas permissões:

| Onde | Permissão | Obrigatória? | O que habilita |
|------|-----------|--------------|----------------|
| Assinatura | Função **Reader** | Sim | Recursos, implantações, projetos, identidades gerenciadas, atribuições de função, uso e atividade |
| Assinatura | Função **Cost Management Reader** | Recomendada | Custo acumulado do mês por serviço |
| Recurso Foundry | Função **Cognitive Services Data Reader** | Recomendada | Os agentes de cada projeto do Foundry |
| Microsoft Graph | `Application.Read.All` (permissão de aplicativo) | Sim | Entidades de serviço, identidades de agente, aplicativos, segredos, certificados, credenciais federadas e permissões do Graph |
| Microsoft Graph | `Directory.Read.All` (permissão de aplicativo) | Sim | Funções de diretório e os nomes dos membros de cada função |
| Microsoft Graph | `AuditLog.Read.All` (permissão de aplicativo) | Recomendada | Último login de cada aplicativo |
| Microsoft Graph | `Application.ReadWrite.All` (permissão de aplicativo) | Somente para revogar | Desabilitar entidades de serviço e excluir segredos, certificados e credenciais federadas a partir do SecureAI |

As permissões do Graph precisam de **consentimento do administrador**. Para ler **todas** as suas assinaturas, atribua **Reader** em cada uma, ou em um grupo de gerenciamento que as contenha.

<Note>
Os agentes do Foundry ficam no plano de dados do projeto, não no Azure Resource Manager: **Reader não basta para vê-los**. Sem **Cognitive Services Data Reader** (ou **Foundry User**) no recurso Foundry, a sincronização continua funcionando, mas a lista de agentes fica vazia e o SecureAI a informa como uma lacuna. Cognitive Services Data Reader é a função mais restrita que permite isso: somente leitura do plano de dados.
</Note>

## Passo 1. Criar a entidade de serviço

### Com a CLI do Azure

No [Azure Cloud Shell](https://shell.azure.com/) ou na CLI `az`. Substitua `SUB_ID` pela sua assinatura e, se usar o Foundry, `MY_RESOURCE` e `MY_RG` pelo seu recurso e grupo de recursos:

```bash
SUB_ID=00000000-0000-0000-0000-000000000000

# 1. App registration + service principal
APP_ID=$(az ad app create --display-name "SecureAI Discovery" --query appId -o tsv)
az ad sp create --id "$APP_ID"

# 2. Client secret (shown only once: copy it now)
az ad app credential reset --id "$APP_ID" --display-name secureai --years 1 \
  --query "{tenantId:tenant, clientId:appId, clientSecret:password}" -o json

# 3. Microsoft Graph application permissions + admin consent
#    Application.Read.All, Directory.Read.All, AuditLog.Read.All
az ad app permission add --id "$APP_ID" --api 00000003-0000-0000-c000-000000000000 \
  --api-permissions 9a5d68dd-52b0-4cc2-bd40-abcf44ac3a30=Role \
                    7ab1d382-f21e-4acd-a863-ba3e13f7da61=Role \
                    b0afded3-3588-46d8-8b3d-9842eff778da=Role
az ad app permission admin-consent --id "$APP_ID"

# 4. Azure RBAC on the subscription
az role assignment create --assignee "$APP_ID" --role "Reader" --scope "/subscriptions/$SUB_ID"
az role assignment create --assignee "$APP_ID" --role "Cost Management Reader" --scope "/subscriptions/$SUB_ID"

# 5. (Recommended) read the agents of your Foundry resource
RID=$(az cognitiveservices account show -n MY_RESOURCE -g MY_RG --query id -o tsv)
az role assignment create --assignee "$APP_ID" --role "Cognitive Services Data Reader" --scope "$RID"
```

O passo 2 imprime os três valores que você colará no SecureAI. Para **revogar a partir do SecureAI**, adicione também `1bfefb4e-e0b5-418b-a88f-73c46d2cc8e9=Role` (`Application.ReadWrite.All`) no passo 3 e conceda o consentimento novamente.

### Com o portal do Azure

1. No [portal do Azure](https://portal.azure.com/), acesse **Microsoft Entra ID → Registros de aplicativo → Novo registro**, dê um nome (por exemplo, `SecureAI Discovery`) e registre.
2. Em **Visão geral**, copie a **ID do diretório (locatário)** e a **ID do aplicativo (cliente)**.
3. Em **Certificados e segredos → Segredos do cliente → Novo segredo do cliente**, crie um e copie o **Valor** (ele é exibido apenas uma vez).
4. Em **Permissões de API → Adicionar uma permissão → Microsoft Graph → Permissões de aplicativo**, adicione `Application.Read.All`, `Directory.Read.All` e `AuditLog.Read.All` (e `Application.ReadWrite.All` se quiser revogar a partir do SecureAI). Depois clique em **Conceder consentimento do administrador**.
5. Em **Assinaturas → sua assinatura → Controle de acesso (IAM) → Adicionar atribuição de função**, atribua **Reader** e **Cost Management Reader** ao aplicativo.
6. No seu **recurso Foundry → Controle de acesso (IAM)**, atribua **Cognitive Services Data Reader** ao aplicativo.

<Info>
As funções do Azure podem levar **até 5 minutos** para entrar em vigor, e o consentimento do Graph alguns minutos a mais. Se a primeira sincronização mostrar lacunas para permissões que você acabou de conceder, aguarde e sincronize novamente.
</Info>

<Warning>
Trate o segredo como uma senha. O SecureAI o armazena **criptografado** e nunca o exibe novamente. Os segredos **expiram** (após um ano com o comando acima): faça a rotação antes disso, ou a sincronização deixará de funcionar nesse dia.
</Warning>

## Passo 2. Conectar o Azure no SecureAI

1. Acesse **Administrador → Integrações**, filtre por **Cloud** e, no card **Azure — Descoberta**, clique em **Conectar Integração**.
2. Preencha os campos:

   | Campo | O que informar |
   |-------|----------------|
   | **Azure Tenant ID (Directory ID)** | `tenantId` do passo 1 |
   | **App Registration Client ID** | `clientId` do passo 1 |
   | **App Registration Client Secret** | `clientSecret` do passo 1. Armazenado criptografado. |
   | **Subscription ID** (opcional) | Limita a leitura a essa assinatura. Vazio: todas as assinaturas em que a entidade tem **Reader**. |

3. Clique em **Conectar**. Antes de salvar, o SecureAI testa as credenciais com uma leitura real: se o segredo estiver errado ou a entidade não conseguir ler a assinatura, nada é armazenado e a mensagem informa o que está faltando. Se a conexão for feita, mas faltar uma permissão do Graph, o aviso indica qual é.
4. **Sincronize** com o botão de atualizar do card. Uma sincronização do Azure pode levar vários minutos (ela percorre o Azure Resource Manager, o Microsoft Graph, o Azure Monitor e o Cost Management). Depois disso, o SecureAI sincroniza sozinho a cada 6 horas.

## Passo 3. Verificar

- [Cloud Sensors](/pt/discovery/cloud-sensors) lista as implantações, agentes e serviços descobertos. Clique no card do Azure para abrir seus Insights:
  - **Usage & Costs**: uso e custo;
  - **Models & Deployments**: implantações e agentes;
  - **Identity & Access**: identidades com suas funções e a marca *Privileged*; segredos, certificados e credenciais federadas; funções do RBAC com seus membros;
  - **Audit & Logs**: a atividade.
- O [Inventário de NHIs](/pt/discovery/nhi-inventory) mostra entidades de serviço, identidades de agente, identidades gerenciadas, segredos, certificados e credenciais federadas, com suas permissões e se são privilegiadas.

Se uma sincronização falhar (por exemplo, porque o segredo expirou), o card mostra o erro e o SecureAI tenta novamente com backoff, mantendo o último inventário.

## Lacunas de cobertura

Nada que o SecureAI não conseguiu ler é ignorado em silêncio: ao conectar ou sincronizar, o aviso indica a permissão que falta.

| Superfície | Permissão que resolve |
|------------|-----------------------|
| Identidades do Entra (entidades de serviço, registros de aplicativo) | `Application.Read.All` com consentimento do administrador |
| Permissões do Graph de cada identidade | `Application.Read.All` |
| Funções de diretório | `Directory.Read.All` |
| Atribuições de função e identidades gerenciadas | **Reader** na assinatura |
| Agentes do Foundry | **Cognitive Services Data Reader** no recurso Foundry |

Uma leitura parcial (uma permissão ausente, uma página que o Azure não retornou, limitação de taxa) **nunca retira agentes nem exclui identidades** do inventário: o SecureAI só trata algo como excluído quando a listagem em que apareceria foi respondida por completo. Sem atribuições de função, as permissões de uma identidade permanecem *desconhecidas*, nunca "nenhuma".

## Revogação

A partir do [Inventário de NHIs](/pt/discovery/nhi-inventory) (cadeado), com `Application.ReadWrite.All`:

| Identidade | O que acontece no Azure | Reversível? |
|------------|-------------------------|-------------|
| Entidade de serviço | É **desabilitada** (`accountEnabled: false`) | Sim: habilite-a novamente no Entra ID |
| Segredo do cliente | É **excluído** do aplicativo | Não: crie um novo |
| Certificado | É **removido** do aplicativo | Não: carregue-o novamente |
| Credencial federada | A relação de confiança é **excluída** | Não: crie-a novamente |
| Identidade gerenciada atribuída pelo usuário | O recurso é **excluído** (também exige **Managed Identity Contributor** nele) | Não |

Salvaguardas:

- O SecureAI **não oferece revogar** a entidade de serviço com a qual se conecta, nem seus segredos, porque isso interromperia a descoberta. Faça a rotação deles no Entra ID.
- As identidades gerenciadas **atribuídas pelo sistema** não são revogadas a partir do SecureAI: o ciclo de vida delas é o do recurso do Azure.
- As credenciais federadas que o **Foundry** mantém no *blueprint* da identidade de um agente também não são revogadas a partir do SecureAI: removê-las interrompe o agente.
- As políticas automáticas de NHI (revogação por idade ou desuso) ainda não se aplicam ao Azure: a revogação é manual.

## Desconectar

Em **Administrador → Integrações → Cloud → Azure — Descoberta**, excluir a conexão remove as credenciais armazenadas. Para remover o acesso do SecureAI no lado do Azure, exclua o registro de aplicativo ou o segredo dele.

## Relacionado

- [Azure AI Foundry — Inference in your account](/en/integrations/cloud/azure-ai-foundry-inference)
- [Provedores Cloud de IA — Visão Geral](/pt/integrations/cloud/overview)
- [Cloud Sensors](/pt/discovery/cloud-sensors)
- [Inventário de NHIs](/pt/discovery/nhi-inventory)
- [Microsoft Entra ID (SSO)](/pt/iam/microsoft-entra-id)
