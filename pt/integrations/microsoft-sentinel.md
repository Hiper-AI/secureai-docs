---
id: microsoft-sentinel
title: "Integração com Microsoft Sentinel"
sidebar_label: "Microsoft Sentinel"
description: "Guia de integração: conectando o Microsoft Sentinel ao HiperAI por meio das regras de coleta de dados do Azure (DCR)"
---

# Integração Microsoft Sentinel

Guia de integração: conectando o Microsoft Sentinel ao HiperAI

Este guia descreve as etapas necessárias para configurar o Microsoft Sentinel para receber logs de segurança do SecureAI por meio das Regras de Coleta de Dados do Azure (DCR).

## Etapa 1: Crie a identidade do aplicativo (registro do aplicativo)

Primeiro, criaremos uma identidade para seu aplicativo no Azure, permitindo que ele seja autenticado com segurança.

### A. Vá para o Azure Active Directory

No portal do Azure, procure e selecione **Azure Active Directory**.

<div class="mac-window">
  ![Pesquisa do Azure Active Directory](/img/ms%20sentinel%20-%20images/Sentinel%20-%201.png)
</div>

### B. Novo registro

No menu esquerdo, navegue até **Registros de aplicativos** e clique em **+ Novo registro**.

<div class="mac-window">
  ![Menu de registros de aplicativos](/img/ms%20sentinel%20-%20images/Sentinel%20-%202.png)
</div>

### C. Nomeie o aplicativo

Forneça um nome claro, como `SecureAI-Log-Ingester` e deixe as outras opções como padrão. Clique em **Registrar**.

<div class="mac-window">
  ![Formulário de registro de aplicativo](/img/ms%20sentinel%20-%20images/Sentinel%20-%203.png)
</div>

### D. Copie os IDs

Na página Visão geral do novo aplicativo, copie e armazene com segurança os seguintes valores:
- **ID do aplicativo (cliente)**
- **ID do diretório (locatário)**

<div class="mac-window">
  ![Visão geral do aplicativo com IDs](/img/ms%20sentinel%20-%20images/Sentinel%20-%204.png)
</div>

### E. Crie o segredo do cliente

No menu esquerdo, acesse **Certificados e segredos** e clique em **+ Novo segredo do cliente**. Forneça uma descrição (por exemplo, "SentinelLogKey") e clique em **Adicionar**.

<div class="mac-window">
  ![Criar segredo do cliente](/img/ms%20sentinel%20-%20images/Sentinel%20-%205.png)
</div>

**ETAPA CRÍTICA**: Copie imediatamente o **Valor** do segredo. Esta é a única vez que estará totalmente visível. Armazene-o de forma segura com os outros IDs.

<div class="mac-window">
  ![Valor secreto do cliente](/img/ms%20sentinel%20-%20images/Sentinel%20-%206.png)
</div>

## Etapa 2: Criar a infraestrutura de ingestão do Azure

Agora, construiremos o “caminho” e o “armazenamento” para seus logs.

### A. Criar o ponto final de coleta de dados (DCE)

#### 1. Encontre o serviço

Na barra de pesquisa do Azure, procure e selecione **Pontos Finais de Coleta de Dados**.

<div class="mac-window">
  ![Pesquisar pontos finais de coleta de dados](/img/ms%20sentinel%20-%20images/Sentinel%20-%207.png)
</div>

#### 2. Crie um novo DCE

Clique em **+ Criar**.

<div class="mac-window">
  ![Criar ponto final de coleta de dados](/img/ms%20sentinel%20-%20images/Sentinel%20-%208.png)
</div>

#### 3. Configure o DCE

- **Nome**: `dce-secureai-integration`
- **Região**: escolha a mesma região do seu espaço de trabalho do Log Analytics
- Clique em **Revisar + criar** e depois em **Criar**

<div class="mac-window">
  ![Revisar e criar DCE](/img/ms%20sentinel%20-%20images/Sentinel%20-%209.png)
</div>

#### 4. Copie o URI

Depois de implantado, navegue até o recurso. Na página Visão geral, copie o **URI de ingestão de logs** e salve-o.

<div class="mac-window">
  ![Visão geral do DCE com URI](/img/ms%20sentinel%20-%20images/Sentinel%20-%2010.png)
</div>

### B. Criar a tabela personalizada e a regra de coleta de dados (DCR)

#### 1. Vá para Log Analytics

Navegue até seu **Espaço de trabalho do Log Analytics**.

#### 2. Crie uma tabela personalizada

No menu esquerdo, clique em **Tabelas**, depois em **+ Criar** e selecione **Novo log personalizado (baseado em DCR)**.

<div class="mac-window">
  ![Criar tabela personalizada](/img/ms%20sentinel%20-%20images/Sentinel%20-%2011.png)
</div>

#### 3. Guia "Básico"

- **Nome da tabela**: `secureaitosiem` (o Azure anexará automaticamente `_CL`, tornando o nome completo `secureaitosiem_CL`)
- **Regra de coleta de dados**: Selecione "Criar um novo..." e nomeie-o `dcr-secureai-events`

<div class="mac-window">
  ![Configuração da regra de coleta de dados](/img/ms%20sentinel%20-%20images/Sentinel%20-%2012.png)
</div>

- **Endpoint de coleta de dados**: Selecione o DCE que você criou anteriormente (`dce-secureai-integration`)
- Clique em **Próximo: Esquema e transformação**

<div class="mac-window">
  ![Próximo esquema e transformação](/img/ms%20sentinel%20-%20images/Sentinel%20-%2013.png)
</div>

#### 4. Guia "Esquema e transformação"

**Carregue um arquivo de amostra**: o sistema irá avisá-lo. Crie um arquivo `.json` com o seguinte conteúdo e carregue-o:

```json
[
  {
    "time": "2025-08-30T21:34:29.013Z",
    "level": "Info",
    "message": "SecureAI platform started successfully",
    "component": "SystemService",
    "correlationId": "test-001"
  },
  {
    "time": "2025-08-30T21:34:30.013Z",
    "level": "Warning",
    "message": "High memory usage detected on server",
    "component": "MonitoringService",
    "correlationId": "test-002"
  },
  {
    "time": "2025-08-30T21:34:31.013Z",
    "level": "Error",
    "message": "Database connection timeout after 30 seconds",
    "component": "DatabaseService",
    "correlationId": "test-003"
  },
  {
    "time": "2025-08-30T21:34:32.013Z",
    "level": "Info",
    "message": "User admin@secureai.com logged in successfully",
    "component": "AuthService",
    "correlationId": "test-004"
  },
  {
    "time": "2025-08-30T21:34:33.013Z",
    "level": "Warning",
    "message": "API rate limit approaching threshold",
    "component": "APIGateway",
    "correlationId": "test-005"
  },
  {
    "time": "2025-08-30T21:34:34.013Z",
    "level": "Info",
    "message": "Security scan completed - 0 threats found",
    "component": "SecurityScanner",
    "correlationId": "test-006"
  },
  {
    "time": "2025-08-30T21:34:35.013Z",
    "level": "Error",
    "message": "Failed to sync with external SIEM system",
    "component": "SIEMSync",
    "correlationId": "test-007"
  },
  {
    "time": "2025-08-30T21:34:36.013Z",
    "level": "Info",
    "message": "Backup job completed successfully",
    "component": "BackupService",
    "correlationId": "test-008"
  }
]
```

**Baixar arquivo de amostra**: você também pode baixar o arquivo JSON de amostra completo para usar diretamente:

<a href="/pt/sample-json.json" download>📥 amostra.json</a>

#### 5. Aplique a transformação

O sistema poderá mostrar um aviso sobre o campo TimeGenerated. Clique no botão **Editor de transformação**, exclua todo o conteúdo existente e cole a seguinte consulta KQL completa:

```kql
source
| extend TimeGenerated = todatetime(['time'])
| project
    TimeGenerated,
    Level_s = tostring(['level']),
    Message_s = tostring(['message']),
    Component_s = tostring(['component']),
    CorrelationId_s = tostring(['correlationId'])
```

<div class="mac-window">
  ![Consulta de transformação KQL](/img/ms%20sentinel%20-%20images/Sentinel%20-%2014.png)
</div>

Clique em **Aplicar**. Você deverá ver uma prévia da tabela com todas as colunas e tipos de dados corretos.

<div class="mac-window">
  ![Aplicar transformação](/img/ms%20sentinel%20-%20images/Sentinel%20-%2015.png)
</div>

#### 6. Finalizar a criação

Clique em **Próximo: revisar + criar** e depois em **Criar**.

<div class="mac-window">
  ![Revisar e criar DCR](/img/ms%20sentinel%20-%20images/Sentinel%20-%2016.png)
</div>

## Etapa 3: Conecte a identidade à infraestrutura (permissões)

Esta etapa crucial concede ao nosso aplicativo permissão para usar a regra de coleta de dados que acabamos de criar.

### A. Vá para o seu novo DCR

Procure e abra sua Regra de Coleta de Dados, `dcr-secureai-events` e em "Visão Geral", copie o ID imutável e salve-o para integração.

<div class="mac-window">
  ![Visão geral do DCR com ID imutável](/img/ms%20sentinel%20-%20images/Sentinel%20-%2017.png)
</div>

### B. Atribuir a função

No menu esquerdo, vá para **Controle de acesso (IAM)** e clique em **+ Adicionar** → **Adicionar atribuição de função**.

<div class="mac-window">
  ![Adicionar atribuição de função](/img/ms%20sentinel%20-%20images/Sentinel%20-%2018.png)
</div>

**Função**: pesquise e selecione **Monitoring Metrics Publisher**.

<div class="mac-window">
  ![Selecione a função de editor de métricas de monitoramento](/img/ms%20sentinel%20-%20images/Sentinel%20-%2019.png)
</div>

**Membros**: clique em **Selecionar membros** e pesquise o nome de registro do seu aplicativo (`SecureAI-Log-Ingester`). Selecione-o.

<div class="mac-window">
  ![Selecionar membro de registro do aplicativo](/img/ms%20sentinel%20-%20images/Sentinel%20-%2020.png)
</div>

Clique em **Revisar + atribuir**.

## Etapa 4: finalizar e compartilhar informações

Você está quase terminando. Apenas uma etapa final.

### A. Reúna as informações

Para completar a integração, o aplicativo precisa das seis informações a seguir:

1. **ID do locatário**: (da etapa 1)
2. **ID do cliente**: (da etapa 1)
3. **Segredo do cliente**: (da etapa 1)
4. **DCE URI**: (da Etapa 2A)
5. **DCR Immutable ID**: (Navegue até seu DCR `dcr-secureai-events` e copie-o da visualização JSON)
6. **Nome do fluxo**: Este é um valor construído. O formato é `Custom-{TableName}`. No nosso caso, será: `Custom-secureaitosiem_CL`

### B. Configurar o aplicativo

Insira esses 6 valores nas definições de configuração do seu aplicativo.

<div class="mac-window">
  ![Configurações de configuração do aplicativo](/img/ms%20sentinel%20-%20images/Sentinel%20-%2021.png)
</div>

## Etapa 5: Verifique a integração

Depois de inserir os detalhes de integração no aplicativo SecureAI, você poderá verificar se a conexão está funcionando corretamente.

### A. Teste a conexão

Use o botão "Testar Conexão" em nosso aplicativo. Isso enviará um evento de teste para seu espaço de trabalho do Microsoft Sentinel.

### B. Encontre o evento de teste no Log Analytics

Para ver se o evento chegou ao Microsoft Sentinel, acesse seu Log Analytics Workspace e clique em **Logs**.

Execute a seguinte consulta para ver os dados recebidos:

```kql
secureaitosiem_CL
| order by TimeGenerated desc
```

Você deverá ver seus dados de log aparecendo com todas as colunas (`TimeGenerated`, `Level_s`, `Message_s`, etc.) preenchidas corretamente. Se sim, sua integração é um sucesso! ✅

<div class="mac-window">
  ![Verificação de integração bem-sucedida](/img/ms%20sentinel%20-%20images/Sentinel%20-%2022.png)
</div>

**Observação**: Dependendo do tráfego de rede e da carga do sistema, às vezes pode levar até 10 minutos para que os logs apareçam no Microsoft Sentinel.

## Feito!

Com essas etapas, sua instância do Microsoft Sentinel está totalmente configurada para integração com SecureAI 😎.