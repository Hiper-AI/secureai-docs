---
id: elastic-security
title: "Integração com Elastic Security"
sidebar_label: "Elastic Security"
description: "Integre o HiperAI ao Elastic Security para detecção avançada de ameaças e análise de segurança"
---

# Integrando SecureAI com Elastic SIEM

Este guia fornece instruções passo a passo sobre como integrar o SecureAI à sua instância do Elastic SIEM. Essa integração permite encaminhar logs de eventos do SecureAI para o Elasticsearch para monitoramento, análise e alertas.

## Etapa 1: Obtenha seu endpoint do Elastic Cloud

Primeiro, você precisa obter o URL do endpoint da sua implantação do Elastic Cloud.

1. Faça login em sua conta do Elastic Cloud.
2. Na página inicial, localize a implantação desejada.
3. Encontre o URL do endpoint do Elasticsearch e copie-o. Você precisará disso para a configuração do SecureAI posteriormente.

<div class="mac-window">
  ![Ponto final da nuvem elástica](/img/elastic%20images/Elastic%20-%201.png)
</div>

## Etapa 2: Crie uma chave de API no Elasticsearch

Uma chave de API é necessária para que o SecureAI envie dados com segurança para seu cluster Elasticsearch.

1. No painel do Kibana, navegue até **Gerenciamento** > **Chaves de API**.
2. Clique no botão **Criar chave de API**.

<div class="mac-window">
  ![Botão Criar chave de API](/img/elastic%20images/Elastic%20-%202.png)
</div>

3. Configure a chave API com os seguintes detalhes:

<div class="mac-window">
  ![Configurar chave de API](/img/elastic%20images/Elastic%20-%203.png)
</div>

   - **Nome**: `secureai-siem-integration` (ou outro nome descritivo).
   - **Role**: Atribua uma função que tenha os privilégios necessários para gravar em índices. Para simplificar neste guia, não definimos uma data de expiração ou restrições de funções específicas.
4. Clique em **Criar chave de API**.

<div class="mac-window">
  ![Clique em Criar chave de API](/img/elastic%20images/Elastic%20-%204.png)
</div>

5. Sua chave será gerada e exibida. Copie a chave API codificada em Base64 e salve-a em um local seguro. Você não poderá vê-lo novamente depois de sair desta tela.

<div class="mac-window">
  ![Chave de API gerada](/img/elastic%20images/Elastic%20-%205.png)
</div>

## Etapa 3: Crie o índice de destino no Elasticsearch

Você deve criar e mapear um índice no Elasticsearch onde os eventos SecureAI serão armazenados.

1. No Kibana, navegue até **Ferramentas do desenvolvedor**.
2. No console, execute o seguinte comando para criar o índice `secureai-events` com os mapeamentos de campo apropriados:

```json
PUT /secureai-events
{
  "mappings": {
    "properties": {
      "timestamp": { "type": "date" },
      "event_type": { "type": "keyword" },
      "source": { "type": "keyword" },
      "severity": { "type": "keyword" },
      "category": { "type": "keyword" },
      "user": { "type": "keyword" },
      "ip": { "type": "ip" },
      "action": { "type": "keyword" },
      "message": { "type": "text" }
    }
  }
}
```

<div class="mac-window">
  ![Criar índice nas ferramentas do desenvolvedor](/img/elastic%20images/Elastic%20-%206.png)
</div>

## Etapa 4: Configurar a integração do Elastic SIEM no SecureAI

Agora, insira os detalhes do Elastic no painel de integrações SecureAI.

1. No painel do SecureAI, navegue até **Integrações**.
2. Localize a placa de integração **Elastic SIEM** e clique em **Configurar**.
3. Preencha os campos de configuração da seguinte forma:
   - **Nome da integração**: `secureai-app-elastic`
   - **URL elástico**: cole o endpoint que você copiou na Etapa 1.
   - **Chave de API Elastic**: cole a chave de API codificada em Base64 que você criou na Etapa 2.
   - **Índice Elástico**: `secureai-events`
   - **Selecionar categorias de eventos**: marque todas as caixas para encaminhar todos os tipos de eventos disponíveis para seu Elastic SIEM.
4. Clique em **Atualizar** para salvar a configuração.

<div class="mac-window">
  ![Clique em Atualizar para salvar a configuração](/img/elastic%20images/Elastic%20-%207.png)
</div>

## Etapa 5: teste e verifique a conexão

Depois de salvar a configuração, teste a conexão para garantir que o SecureAI possa se comunicar com sua instância Elastic.

1. No modal de configurações de integração, clique no botão **Testar Conexão**.
2. Você deverá ver uma mensagem de sucesso: "Teste bem-sucedido! Conexão verificada."

<div class="mac-window">
  ![Mensagem de teste bem-sucedido](/img/elastic%20images/Elastic%20-%208.png)
</div>

3. Para confirmar que os dados do teste foram recebidos, acesse **Discover** no Kibana.
4. Selecione a visualização de dados `secureai-events` (padrão de índice).
5. Você deverá ver um log de eventos de teste do SecureAI, que confirma que a integração está funcionando corretamente.

<div class="mac-window">
  ![Confirmação do log de eventos de teste](/img/elastic%20images/Elastic%20-%209.png)
</div>

Sua integração SecureAI e Elastic SIEM agora está ativa. Os eventos serão registrados em seu índice `secureai-events` à medida que ocorrerem.

## Feito!

Com essas etapas, sua instância Elastic está totalmente configurada para integração com SecureAI 😎.