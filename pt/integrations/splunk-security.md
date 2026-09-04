---
id: splunk-security
title: "Integração com Splunk Security (HEC)"
sidebar_label: "Splunk Security"
description: "Guia de integração: conectando Splunk SIEM com HiperAI via HTTP Event Collector (HEC)"
---

# Integração de segurança Splunk

Guia de Integração: Conectando Splunk SIEM com HiperAI

Este guia descreve as etapas necessárias para configurar o Splunk para receber logs de segurança do HiperAI através do HTTP Event Collector (HEC).

## Etapa 1: Crie um novo índice

Primeiramente, criaremos um espaço dedicado para armazenar os logs da aplicação.

### A. Na tela inicial do Splunk, navegue até Configurações > Índices.

<div class="mac-window">
  ![Índices de configurações do Splunk](/img/splunk%20images/1%20-%20Splunk%20Integration.png)
</div>

### B. Clique no botão Novo índice no canto superior direito.

### C. Configure o índice:

- **Nome do índice**: `secureai_events`
- Deixe todas as outras opções com seus valores padrão para uma configuração padrão.
- Clique em **Salvar**.

<div class="mac-window">
  ![Configuração do índice Splunk](/img/splunk%20images/2%20-%20Splunk%20Integration.png)
</div>

Seu novo índice agora está criado e pronto para receber dados.

## Etapa 2: ativar o coletor de eventos HTTP (HEC)

A seguir, garantiremos que o Splunk esteja escutando as solicitações de dados recebidas.

### A. Vá para Configurações > Entradas de dados.

<div class="mac-window">
  ![Entradas de dados do Splunk](/img/splunk%20images/3%20-%20Splunk%20Integration.png)
</div>

### B. Em "Entradas locais", clique em HTTP Event Collector.

<div class="mac-window">
  ![Coletor de eventos HTTP do Splunk](/img/splunk%20images/4%20-%20Splunk%20Integration.png)
</div>

### C. No canto superior direito, clique em Configurações globais.

### D. Verifique a seguinte configuração:

- **Todos os tokens**: devem estar habilitados.
- **Ativar SSL**: (opcional) recomendado para ambientes de produção, mas pode ser desativado para testes iniciais.
- **Número da porta HTTP**: certifique-se de que a porta seja 8088.
- Clique em **Salvar**.

<div class="mac-window">
  ![Configurações globais do Splunk HEC](/img/splunk%20images/5%20-%20Splunk%20Integration.png)
</div>

## Etapa 3: Crie o token HEC

O token é a chave de acesso segura que nosso aplicativo usará para autenticar no Splunk.

### A. Retorne à página do Coletor de Eventos HTTP (Configurações > Entradas de Dados > Coletor de Eventos HTTP).

### B. Clique no botão Novo token.

<div class="mac-window">
  ![Botão Novo Token do Splunk](/img/splunk%20images/6%20-%20Splunk%20Integration.png)
</div>

### C. Configuração do token (guia 1):

- **Nome**: `token_secureai_app`
- **Descrição**: (Opcional) Adicione uma breve descrição.
- **Ativar reconhecimento do indexador**: **IMPORTANTE**: certifique-se de que esta caixa de seleção esteja desmarcada.
- Clique em **Avançar**.

<div class="mac-window">
  ![Configuração do token Splunk](/img/splunk%20images/7%20-%20Splunk%20Integration.png)
</div>

### D. Configurações de entrada (guia 2):

- **Tipo de fonte**: Clique em Selecionar. No campo de pesquisa, digite `_json` e selecione-o na lista. Isso diz ao Splunk para esperar dados no formato JSON.
- **Índices permitidos**: Na coluna "Índices disponíveis", encontre o índice que criamos (`secureai_events`) e clique nele para movê-lo para a coluna "Índices selecionados".
- **Índice padrão**: Selecione `secureai_events` no menu suspenso.

<div class="mac-window">
  ![Configurações de entrada do Splunk](/img/splunk%20images/8%20-%20Splunk%20Integration.png)
</div>

- Clique em **Revisar** e depois em **Enviar**.

<div class="mac-window">
  ![Revisão e envio do Splunk](/img/splunk%20images/9%20-%20Splunk%20Integration.png)
</div>

### E. Copie o valor do token!

O Splunk agora exibirá o valor do token. Copie-o imediatamente e salve-o em um local seguro. Este é o token que você precisará configurar em nossa aplicação.

<div class="mac-window">
  ![Valor do token Splunk](/img/splunk%20images/10%20-%20Splunk%20Integration.png)
</div>

## Etapa 4: finalizar e compartilhar informações

Você está quase terminando. Apenas uma etapa final.

### A. Reúna as informações

Para completar a integração, o aplicativo precisa das três informações a seguir:

1. **HEC URL**: O endereço do seu servidor Splunk e a porta HEC (por exemplo, `http://splunk.yourcompany.com:8088/services/collector`).
2. **O token HEC**: O valor que você copiou na etapa anterior.
3. **O nome do índice**: O nome do índice que você criou (`secureai_events`).

<div class="mac-window">
  ![Informações do índice do Splunk](/img/splunk%20images/11%20-%20Splunk%20Integration.png)
</div>

### B. Revise as regras de firewall

Certifique-se de que qualquer firewall entre o servidor de aplicativos e o servidor Splunk permita tráfego na porta HEC (normalmente TCP 8088).

## Etapa 4: Nota sobre o formato dos dados (tipo de origem)

Para garantir que os dados sejam identificados e analisados corretamente, nosso aplicativo envia logs em um formato JSON estruturado específico.

**Importante**: Todos os eventos enviados do SecureAI terão o tipo de origem `secureai:json`.

Este valor é definido diretamente na carga de dados enviada por nosso aplicativo, portanto, ele substituirá automaticamente o tipo de fonte padrão (`_json`) que você selecionou para o token. Nenhuma ação adicional é necessária, mas é importante que você saiba que encontrará os dados em sourcetype="secureai:json" em suas pesquisas.

## Etapa 6: Verifique a integração

Depois de inserir os detalhes de integração no aplicativo SecureAI, você poderá verificar se a conexão está funcionando corretamente.

### A. Teste a conexão

Use o botão "Testar Conexão" em nosso aplicativo. Isso enviará um evento de teste para o seu índice do Splunk.

<div class="mac-window">
  ![Conexão de teste do Splunk](/img/splunk%20images/12%20-%20Splunk%20Integration.png)
</div>

Você verá uma mensagem de sucesso se o evento foi enviado corretamente ou uma mensagem de erro se algum dos dados fornecidos estiver incorreto.

### B. Encontre o evento de teste no Splunk

Para ver se o evento chegou ao Splunk, acesse o aplicativo Search & Reporting.

Na barra de pesquisa, faça uma pesquisa pelo seu índice (por exemplo, `index="secureai_events"`).

Defina o intervalo de tempo para "Últimas 24 horas". Você deverá ver o log de teste aparecer nos resultados.

<div class="mac-window">
  ![Resultados da pesquisa do Splunk](/img/splunk%20images/13%20-%20Splunk%20Integration.png)
</div>

**Observação**: Dependendo do tráfego de rede e da carga do sistema, às vezes pode levar até 10 minutos para que os logs apareçam no Splunk.

## Feito!

Com essas etapas, sua instância do Splunk está totalmente configurada para integração com SecureAI 😎.