---
sidebar_position: 7
title: "Google Vertex AI — Inferência na sua conta"
sidebarTitle: "Google Vertex AI"
icon: "/img/icons/google-cloud.svg"
sidebar_label: "Vertex AI — Inferência"
description: "Execute o tráfego de LLM da SecureAI na sua própria conta do Google Cloud: pague ao Google com seu gasto comprometido (CUDs) enquanto a SecureAI continua aplicando DLP, políticas e recibos assinados."
---

# Google Vertex AI — Inferência na sua conta

Com esta integração, as chamadas de modelos de linguagem de grande porte (LLM) da SecureAI são executadas no **seu próprio projeto do Google Cloud**, em vez de nos provedores gerenciados pela SecureAI. O uso é cobrado diretamente na sua conta do Google, para que você possa usar seu gasto comprometido (CUDs) e os descontos negociados.

A SecureAI continua no caminho de cada solicitação: **DLP, políticas de modelos, residência de dados e recibos assinados** se aplicam exatamente como com qualquer outro provedor.

<Info>
**Não confunda com o outro cartão do Google Cloud.** Esta página conecta a Vertex AI como **provedor de inferência** (Admin → Integrations → **AI providers**). O cartão **Google Cloud — Descoberta** (categoria **Cloud**) apenas inventaria o projeto em modo somente leitura e nunca envia um prompt; ele é descrito em [Google Cloud — Discovery](/pt/integrations/cloud/gcp-vertex-ai). Você pode usar os dois no mesmo projeto, mas eles são independentes e pedem permissões diferentes.
</Info>

## O que é executado na Vertex e o que não é

| É executado na sua Vertex | Permanece nos provedores gerenciados pela SecureAI |
|---|---|
| Chat e agentes (modelos das famílias que você escolher) | Embeddings (pesquisa de documentos e de índices) |
| Resumos de reuniões do Teams (modelo Gemini) | Reclassificação (re-ranking) da pesquisa |
| Revisão gramatical, tradução e outras tarefas internas em segundo plano, quando você escolhe **Remap everything** | OCR de documentos |
| | Assistente de administração |
| | Geração de imagens e voz em tempo real |
| | Modelos auto-hospedados e o proxy do Claude Code |

Modelos disponíveis hoje: **Gemini** e os modelos abertos servidos como MaaS na Vertex (**gpt-oss, DeepSeek, Llama e Qwen**). **Claude e Mistral na Vertex ainda não são compatíveis**; esses modelos são tratados de acordo com a configuração de fallback (veja abaixo).

## Quantos provedores de nuvem você pode usar

| Plano | Provedores de inferência ativados ao mesmo tempo |
|-------|---------------------------------------------------|
| **Scale** | 1 (Google Vertex AI, Azure AI Foundry **ou** Amazon Bedrock) |
| **Enterprise** | Até 3 — por exemplo, Vertex AI para Gemini, Foundry para GPT e Bedrock para Claude |

Com mais de um provedor ativado, cada um atende famílias de modelos **diferentes**: uma família só pode ser assumida por um provedor ativado, e só um provedor pode estar em **Remap everything**. Quando você salva a integração ativada, a SecureAI a recusa em dois casos e explica o motivo no painel:

| Caso | Mensagem do painel |
|------|--------------------|
| O roteamento se sobrepõe a outro provedor ativado (uma família que outro já assume, ou um segundo **Remap everything**) | *This routing overlaps another enabled cloud provider: …*, seguida da família ou do modo que colide. |
| Seu plano não permite outro provedor ativado | *Your plan's BYO-cloud provider limit is reached (… of … in use). Disable another provider or upgrade the plan.* |

## Pré-requisitos

- Um **projeto do Google Cloud** com o faturamento ativado.
- A **Agent Platform API (Vertex AI API)** ativada nesse projeto (o serviço `aiplatform.googleapis.com`).
- Uma **conta de serviço** no seu projeto com o papel **Agent Platform User** (`roles/aiplatform.user`), e uma destas duas formas de a SecureAI atuar como ela:
  - **Opção A — uma chave JSON** dessa conta de serviço.
  - **Opção B — sem chave (personificação)**: você concede à conta de serviço da SecureAI mostrada no painel o papel **Service Account Token Creator** (`roles/iam.serviceAccountTokenCreator`) na sua conta de serviço, e nenhuma chave é armazenada. Esta opção só está disponível se sua implantação da SecureAI a oferece; caso contrário, o painel a mostra desativada com o aviso *Keyless access is not enabled on this deployment.*
- Permissão de **administrador** na seção Integrations da SecureAI. Com permissão de leitura, você pode ver a configuração, mas não alterá-la.

## Passo 1. Prepare o projeto no Google Cloud

Você pode fazer isso pela linha de comando (rápido) ou pelo console (com capturas de tela). Os passos 1 a 3 são os mesmos para as duas opções de autenticação; o passo 4 (a chave JSON) é somente para a opção A.

<Tabs>
<Tab title="gcloud (Cloud Shell)">

No [Cloud Shell](https://shell.cloud.google.com/) ou com o `gcloud` instalado. Substitua `MY_PROJECT` pelo ID real do projeto:

```bash
gcloud config set project MY_PROJECT

# 1. Ative a Agent Platform API (Vertex AI API)
gcloud services enable aiplatform.googleapis.com

# 2. Crie uma conta de serviço dedicada para a SecureAI
gcloud iam service-accounts create secureai-vertex --display-name="SecureAI Vertex"

# 3. Conceda a ela o papel mínimo para invocar modelos
gcloud projects add-iam-policy-binding MY_PROJECT \
  --member="serviceAccount:secureai-vertex@MY_PROJECT.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# 4. Somente opção A: gere a chave JSON
gcloud iam service-accounts keys create key.json \
  --iam-account=secureai-vertex@MY_PROJECT.iam.gserviceaccount.com
```

</Tab>
<Tab title="Console do Google Cloud">

1. No [console do Google Cloud](https://console.cloud.google.com/), selecione seu projeto e abra **APIs e serviços → Biblioteca**. Pesquise **Agent Platform API** (antes **Vertex AI API**) e clique em **Ativar**. Se já aparecer **API ativada**, não há nada a fazer.

   <div class="mac-window">
   ![Agent Platform API ativada no Google Cloud](/img/cloud/vertex-ai-inference/1%20-%20Vertex%20AI%20Inference.png)
   </div>

2. Acesse **IAM e administrador → Contas de serviço → Criar conta de serviço**. Dê um nome a ela (por exemplo, `secureai-vertex`).

   <div class="mac-window">
   ![Criar a conta de serviço](/img/cloud/vertex-ai-inference/2%20-%20Vertex%20AI%20Inference.png)
   </div>

3. Em **Permissões**, conceda o papel **Agent Platform User** (`roles/aiplatform.user`) no projeto e clique em **Concluir**. Nenhum outro papel é necessário para a inferência.

   <div class="mac-window">
   ![Conceder o papel Agent Platform User](/img/cloud/vertex-ai-inference/3%20-%20Vertex%20AI%20Inference.png)
   </div>

4. **Somente opção A.** Abra a conta de serviço, vá até a guia **Chaves** → **Adicionar chave → Criar nova chave**, escolha o tipo de chave **JSON** e clique em **Criar**. O arquivo é baixado uma única vez.

   <div class="mac-window">
   ![Criar a chave JSON](/img/cloud/vertex-ai-inference/4%20-%20Vertex%20AI%20Inference.png)
   </div>

</Tab>
</Tabs>

<Warning>
Trate o arquivo JSON como uma senha. A SecureAI o armazena **criptografado** e nunca o mostra novamente, mas o arquivo baixado (`key.json`) permanece no seu computador: cole o conteúdo dele na SecureAI e depois **exclua-o**, ou guarde-o em um gerenciador de secrets.
</Warning>

<Warning>
**Se você não conseguir criar a chave.** Se o passo 4 falhar com `iam.disableServiceAccountKeyCreation`, a política da sua organização do Google Cloud proíbe chaves de conta de serviço (é o padrão nas organizações novas). Use a **opção B, sem chave**, se sua implantação a oferece; caso contrário, peça a um administrador de políticas da organização uma exceção à restrição `iam.disableServiceAccountKeyCreation` nesse projeto.
</Warning>

### Opção B: autorize a SecureAI sem chave

Com a opção B, nenhuma chave é criada. Em vez disso:

1. Na SecureAI, abra o painel da Vertex AI (veja o passo 2), escolha **Keyless (impersonation)** e insira o e-mail da sua conta de serviço em **Your service account to impersonate**.
2. O painel mostra o comando a executar, já preenchido com a conta de serviço da SecureAI da sua implantação. Copie-o com **Copy** e execute-o no Cloud Shell. Ele tem esta forma:

   ```bash
   gcloud iam service-accounts add-iam-policy-binding secureai-vertex@MY_PROJECT.iam.gserviceaccount.com \
     --member="serviceAccount:SECUREAI_ACCOUNT" \
     --role="roles/iam.serviceAccountTokenCreator"
   ```

   O papel é concedido **na sua conta de serviço**, não no projeto: a SecureAI só pode atuar como essa conta, que por sua vez só tem `roles/aiplatform.user`.

### Modelos abertos (Llama, DeepSeek, Qwen, gpt-oss)

**O Gemini não precisa de mais nada.** Para usar também Llama, DeepSeek, Qwen ou gpt-oss, primeiro aceite os termos de cada modelo em **Vertex AI → Model Garden**. Esses modelos abertos precisam de uma **região** específica (por exemplo, `us-central1`); com `global`, eles podem não estar disponíveis.

## Passo 2. Conecte o projeto na SecureAI

1. Acesse **Admin → Integrations**, abra a categoria **AI providers** e clique no cartão **Google Vertex AI — Inference on your account**.
2. Em **Connection**, preencha:

   | Campo | O que inserir |
   |-------|---------------|
   | **Google Cloud project ID** | O ID do projeto (por exemplo, `my-project-123`), não o nome de exibição. |
   | **Vertex AI location** | Para começar, deixe `global`: é onde estão os modelos padrão Gemini 3 *preview*. Se você precisa de **residência de dados**, insira uma região (`us-central1`, `europe-west4`…): a SecureAI envia cada solicitação ao endpoint regional que você escolheu, e onde o Google a processa depende dos compromissos de residência de dados do Google. Com `global`, o Google escolhe a região. Os modelos abertos precisam de uma região. |
   | **Authentication** | **Opção A:** mantenha **Service-account key (JSON)** selecionado e cole o conteúdo **completo** de `key.json` em **Service-account key JSON**. **Opção B:** escolha **Keyless (impersonation)**, insira o e-mail da sua conta de serviço em **Your service account to impersonate** e execute o comando que o painel mostra (consulte **Opção B: autorize a SecureAI sem chave**, acima). |

   <div class="mac-window">
   ![Seção Connection do painel da Vertex AI](/img/cloud/vertex-ai-inference/5%20-%20Vertex%20AI%20Inference.png)
   </div>

3. Clique em **Save**. Nenhum tráfego é roteado ainda: a integração é salva desativada para que você possa testá-la primeiro.

<Info>
**Recomendação para o primeiro dia:** mantenha o modo **Only these model families** apenas com **Gemini**, os modelos padrão sem alterações, e tanto o fallback quanto o limite de gasto por assento desativados. É a configuração mais previsível. Deixe **Remap everything** para quando isso estiver validado.
</Info>

<Info>
Com a opção A, a chave colada nunca é mostrada novamente. Para substituí-la, cole uma nova; se você deixar o campo vazio ao salvar, a chave atual é mantida.
</Info>

## Passo 3. Escolha o que é executado na Vertex

Em **What runs on Vertex** há dois modos:

- **Only these model families** — as famílias que você marcar (Gemini, gpt-oss, DeepSeek, Llama, Qwen) são executadas na sua Vertex; todos os outros modelos continuam sendo executados nos provedores da SecureAI. Esta é a forma mais conservadora de começar (padrão: apenas Gemini).
- **Remap everything to Vertex** — todas as chamadas de LLM são executadas na sua Vertex. Os modelos sem equivalente na Vertex são atendidos por um **modelo padrão**.

**Default Vertex models** (editáveis):

| Nível | Usado para | Padrão |
|-------|------------|--------|
| **Fast** | Tarefas em segundo plano e utilitários (gramática, tradução, Teams) | `google/gemini-2.5-flash` |
| **Standard** | Modelos sem equivalente | `google/gemini-3-flash-preview` |
| **Reasoning** | Modelos de raciocínio sem equivalente | `google/gemini-3.1-pro-preview` |
| **Vision** | Solicitações com imagens ou PDFs | `google/gemini-3-flash-preview` |

Há também duas opções:

| Opção | Desativada (recomendado) | Ativada |
|-------|--------------------------|---------|
| **Allow fallback to SecureAI-managed models** | Se a Vertex falhar ou um modelo não tiver equivalente, a solicitação é **recusada** em vez de ser enviada a outro provedor. | Essas solicitações são repetidas **uma vez** nos provedores gerenciados pela SecureAI. A nova tentativa é auditada. |
| **Apply each seat's spend cap to turns served in your account** | Os turnos atendidos na sua Vertex não contam para o limite de gasto do assento de cada usuário. | Esses turnos contam para o limite de gasto do assento (tanto o limite mensal quanto o limite de pico de 4 horas), pelo preço de tabela, assim como os turnos que a SecureAI atende. |

<div class="mac-window">

![Seção What runs on Vertex](/img/cloud/vertex-ai-inference/6%20-%20Vertex%20AI%20Inference.png)

</div>

<Info>
Os modelos disponíveis dependem do **local**. Os modelos padrão (vários deles *preview*) podem não existir em todas as regiões. Se o teste de conexão retornar **Model not available in this location**, escolha outra região ou substitua os modelos padrão por outros que sua região atenda. Os modelos abertos (MaaS) exigem aceitar seus termos no Model Garden da Vertex AI e uma região específica.
</Info>

## Passo 4. Teste a conexão

1. Com a integração salva, em **Connection test**, clique em **Test connection**.
2. A SecureAI envia uma solicitação mínima a cada modelo padrão, **pelo mesmo caminho que o tráfego real usará** (gateway, políticas e recibos incluídos), e mostra cada resultado com sua latência.

   <div class="mac-window">
   ![Resultado do teste de conexão](/img/cloud/vertex-ai-inference/7%20-%20Vertex%20AI%20Inference.png)
   </div>

3. Se um modelo falhar, o painel mostra o motivo. Consulte a seção **Solução de problemas** no final desta página.

### O que mais a identidade pode fazer

O teste também verifica o que mais a identidade da conexão pode fazer no projeto, com `projects:testIamPermissions` e o mesmo token do fluxo de inferência: não é necessário nenhum papel extra e nada é alterado. O painel mostra um destes avisos:

| Aviso do painel | O que significa |
|-----------------|-----------------|
| *Permissions: roles/aiplatform.user — it can call models and also deploy or delete Vertex AI resources, and none of the permissions outside AI that SecureAI checks.* | É o esperado com `roles/aiplatform.user`. |
| *Least privilege: this identity can call models and nothing else that SecureAI checked.* | Ela nem sequer tem as permissões de implantação de `roles/aiplatform.user` (por exemplo, um papel personalizado). |
| *This identity can do much more than call models: …* (aviso, com a lista de permissões) | Ela tem permissões fora de IA, por exemplo alterar a política do IAM, criar chaves de contas de serviço ou ler dados do Storage, do BigQuery ou do Secret Manager. O log de atividades registra o teste como aviso. Dê à conta de serviço apenas `roles/aiplatform.user`. |
| *Could not check what else this identity can do in the project …* | O Google não respondeu; por exemplo, a API Cloud Resource Manager está desativada. |

<Info>
O teste envia algumas solicitações de um token e **é cobrado na sua conta do Google** (centavos).
</Info>

## Passo 5. Revise o roteamento e ative-o

1. Abra **Routing preview → Show which lane serves each model**. Para cada modelo do catálogo, ele mostra se **sua Vertex** vai atendê-lo (e com qual modelo da Vertex) ou se a **SecureAI** vai, e quais ficarão **ocultos para os usuários**. A prévia simula a integração ativada, para que você possa revisar o efeito antes de ativá-la.
2. Quando o teste passar, ative **Route traffic to Vertex AI** e clique em **Save** novamente. **Se você não salvar, o interruptor não permanece ativado.** Para ativá-lo, é preciso ter um projeto e uma credencial configurados. Se seu plano não permitir outro provedor de nuvem ou o roteamento se sobrepuser a outro, a SecureAI recusa e explica o motivo (consulte **Quantos provedores de nuvem você pode usar**, acima).

   <div class="mac-window">
   ![Interruptor Route traffic to Vertex AI ativado](/img/cloud/vertex-ai-inference/8%20-%20Vertex%20AI%20Inference.png)
   </div>
3. O cartão fica verde: **Routing to Vertex**. Se estiver salvo, mas desativado, ele mostra em âmbar **Configured · not routing to Vertex**.

A alteração se aplica imediatamente no servidor em que foi salva e em no máximo 30 segundos nos demais.

## Passo 6. Verifique no seletor de modelos

Quando a integração está ativa, os modelos executados na sua Vertex mostram o **logotipo do Google Cloud** ao lado do nome no seletor de modelos do chat. Ao passar o cursor sobre ele, é indicado que o modelo é executado na conta da Vertex AI da sua organização.

<div class="mac-window">

![Seletor de modelos com o logotipo do Google Cloud](/img/cloud/vertex-ai-inference/9%20-%20Vertex%20AI%20Inference.png)

</div>

No modo **Remap everything** sem fallback, o seletor **só oferece** os modelos que sua Vertex atende. Um modelo sem equivalente seria respondido por um modelo diferente do escolhido, por isso ele fica oculto.

## O que é cobrado e de quem

- **O uso de LLM é cobrado pelo Google na sua conta**, não pela SecureAI. Você verá a cobrança no faturamento do Google Cloud, com seus descontos e CUDs aplicados.
- A SecureAI mostra o custo dos turnos atendidos na Vertex como uma **estimativa pelo preço de tabela**, apenas para análise. É uma referência: **não inclui** seus descontos, então o valor real do Google pode ser menor.
- Os turnos atendidos na sua Vertex **não contam para o limite de gasto do assento de cada usuário**, a menos que você ative **Apply each seat's spend cap to turns served in your account**. O **nível do assento** continua se aplicando: um usuário só pode usar modelos do seu nível ou inferiores, mesmo quando sua Vertex os atende.
- Um assento **Govern BYO** só pode usar modelos servidos na infraestrutura da própria organização: os que sua Vertex (ou outro provedor de nuvem conectado) atende e os modelos auto-hospedados nos seus servidores. Qualquer outro modelo é recusado, e o seletor não oferece **Auto** a ele.

## Segurança e conformidade

- **Credenciais criptografadas, ou nenhuma.** Com a opção A, a chave da conta de serviço é armazenada criptografada (AES-256-GCM) e nunca é devolvida ao navegador, nem mesmo a um administrador; a tela mostra apenas o e-mail da conta. Com a opção B, nenhuma chave é armazenada: a SecureAI pede ao Google tokens de curta duração que atuam como sua conta de serviço.
- **O caminho continua protegido.** Cada chamada passa pelo gateway SMLTP da SecureAI: DLP, um token de autorização assinado por solicitação e um **recibo assinado** verificável.
- **Residência de dados.** Com uma região fixada (por exemplo, `europe-west4`), a SecureAI envia cada solicitação ao endpoint dessa região e aplica as políticas de residência da sua organização. Onde o Google processa a solicitação depende dos compromissos de residência de dados do Google.
- **Falha fechada.** Se a configuração não puder ser lida ou o token do Google não puder ser obtido, a solicitação é recusada; ela não é enviada a outro provedor, a menos que você tenha permitido o fallback.
- **Auditoria.** Salvar, testar ou desconectar a integração fica registrado no log de atividades, com os nomes dos campos alterados e nunca a chave.
- **Privilégio mínimo à vista.** O teste de conexão verifica o que mais a identidade da conexão pode fazer no projeto e avisa se ela tem permissões fora de IA (consulte **O que mais a identidade pode fazer**, no passo 4).
- **Permissões mínimas.** `roles/aiplatform.user` é suficiente para a inferência; a integração não precisa ler seu IAM nem seu faturamento.

## Desconectar

**Disconnect** (rodapé do painel) exclui a configuração e a chave armazenada. A partir desse momento, **todo o tráfego volta aos provedores gerenciados pela SecureAI**. Você também pode desativar apenas o interruptor **Route traffic to Vertex AI** para pausar o roteamento mantendo a conexão.

Depois, remova o acesso também no Google Cloud:

- **Opção A:** se você deixar de usar a chave, **revogue-a** (Contas de serviço → Chaves).
- **Opção B:** remova o papel `roles/iam.serviceAccountTokenCreator` que você concedeu à conta de serviço da SecureAI na sua conta de serviço (Contas de serviço → sua conta → **Permissões**).

## Solução de problemas

Estes são os motivos que **Test connection** pode mostrar:

| Motivo | Causa provável | O que fazer |
|--------|----------------|-------------|
| Credential rejected or not usable | JSON incompleto ou inválido, ou uma chave revogada. Sem chave: falta à conta da SecureAI o papel `roles/iam.serviceAccountTokenCreator` na sua conta de serviço, ou o e-mail foi digitado errado | Cole novamente o JSON completo ou crie uma nova chave. Sem chave: execute o comando que o painel mostra e verifique o e-mail. |
| Not authenticated | O Google rejeitou o token | Verifique se a conta de serviço existe e está ativa. |
| Vertex AI API is not enabled on the project | Falta o passo 1.1 | Ative a **Agent Platform API (Vertex AI API)** (`aiplatform.googleapis.com`) no projeto. |
| Missing roles/aiplatform.user | Permissão insuficiente | Conceda o papel **Agent Platform User** (`roles/aiplatform.user`) à conta de serviço nesse projeto. |
| Model not available in this location | O modelo não existe na região escolhida, ou é um modelo aberto cujos termos não foram aceitos no Model Garden | Altere a região ou esse modelo padrão; para modelos abertos, aceite os termos no Model Garden. |
| Quota exceeded | Cota da Vertex esgotada | Revise as cotas do projeto ou peça um aumento ao Google. |
| Google returned an error | Falha do lado do Google | Tente novamente; se persistir, verifique o status do Google Cloud. |
| Blocked by your SMLTP model policy | A política da SecureAI não permite o modelo | Adicione o modelo à política permitida. |
| SMLTP Vertex gateway unreachable / TLS error | Problema na infraestrutura da SecureAI | Entre em contato com o suporte. Não depende do seu projeto do Google. |
| Unexpected error | Uma falha que a SecureAI não conseguiu classificar | Tente novamente. Se persistir, entre em contato com o suporte com a mensagem que o painel mostra. |
| No default models configured | Os quatro modelos padrão estão vazios, então não há nada para testar | Preencha pelo menos um em **Default Vertex models**, salve e teste novamente. |

Erros que os usuários podem ver no chat:

| Código | Significado |
|--------|-------------|
| `SAI-VERTEX-001` | O modelo escolhido não tem equivalente na Vertex e o fallback está desativado. Escolha outro modelo ou permita o fallback. |
| `SAI-VERTEX-002` | Não foi possível obter acesso ao Google (chave inválida ou revogada ou, sem chave, a permissão de personificação foi removida). Renove a credencial. |
| `SAI-VERTEX-005` | A configuração não pôde ser lida e a solicitação foi recusada por segurança. Tente novamente em alguns segundos. |

## Limitações atuais

- **Claude e Mistral na Vertex** não são compatíveis (usam uma API diferente).
- **Embeddings, reclassificação, OCR, o assistente de administração, a geração de imagens e a voz em tempo real** permanecem nos provedores gerenciados pela SecureAI.
- **Um projeto e um local da Vertex** por organização.
- O número de provedores de inferência que você pode ativar ao mesmo tempo depende do seu plano (Scale: 1, Enterprise: até 3). Consulte [Azure AI Foundry — Inference on your account](/en/integrations/cloud/azure-ai-foundry-inference) e [Amazon Bedrock — Inference on your account](/en/integrations/cloud/aws-bedrock-inference).
- O proxy do **Claude Code** usa a Anthropic diretamente e não passa pela Vertex.

## Relacionado

- [Google Cloud — Discovery](/pt/integrations/cloud/gcp-vertex-ai) — inventário dos agentes, modelos, identidades e custos do projeto.
- [Azure AI Foundry — Inference on your account](/en/integrations/cloud/azure-ai-foundry-inference)
- [Amazon Bedrock — Inference on your account](/en/integrations/cloud/aws-bedrock-inference)
- [Visão geral dos provedores de IA em nuvem](/pt/integrations/cloud/overview)
- [Recibos assinados](/pt/api/receipts)
