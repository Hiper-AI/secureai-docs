---
sidebar_position: 3
title: "Microsoft Entra ID (SSO)"
sidebar_label: "Microsoft Entra ID (SSO)"
---

# Integração Microsoft Entra ID (SSO)

Este guia orientará você no processo de configuração do Microsoft Entra ID (anteriormente Azure Active Directory) para logon único (SSO) com SecureAI. Você aprenderá como obter as credenciais necessárias do Azure e enviá-las para concluir a integração.

## Pré-requisitos

- Acesso de administrador ao Portal do Azure
- Um locatário do Azure Entra ID (Azure AD)
- Acesso de administrador ao SecureAI

## Etapa 1: Criar um aplicativo no Portal do Azure

1. Faça login no [Portal do Azure](https://portal.azure.com)
2. Procure e selecione **Azure Active Directory** ou **Microsoft Entra ID**

<div class="mac-window">
  ![Pesquisa do Portal do Azure](/img/microsoft%20entraid%20sso%20images/1%20-%20azure.png)
</div>

3. No menu lateral, selecione **Registros de aplicativos**

<div class="mac-window">
  ![Menu de registros de aplicativos](/img/microsoft%20entraid%20sso%20images/2%20-%20azure.png)
</div>

4. Clique em **+ Novo cadastro**

<div class="mac-window">
  ![Novo botão de registro](/img/microsoft%20entraid%20sso%20images/3%20-%20azure.png)
</div>

## Etapa 2: Configurar o aplicativo

1. **Nome**: Insira um nome descritivo (por exemplo, "SecureAI SSO")
2. **Tipos de contas compatíveis**:
   - Selecione **Contas apenas neste diretório organizacional**
   - Ou **Contas em qualquer diretório organizacional** se você precisar oferecer suporte a várias organizações
3. **URI de redirecionamento**:
   - Plataforma: **Web**
   -URI: `https://your-backend-domain.com/api/auth/azure/callback`
   - **Observação**: você obterá este URL com sua equipe de desenvolvimento
4. Clique em **Registrar**

<div class="mac-window">
  ![Botão Registrar](/img/microsoft%20entraid%20sso%20images/4%20-%20azure.png)
</div>

## Etapa 3: Obtenha o ID do aplicativo (cliente)

1. Na página **Visão geral** da sua inscrição
2. Copie o valor **ID do aplicativo (cliente)**
   - Este é um GUID parecido com este: `b96ee19f-5a15-4a85-b936-****-****`
   - **Salve este valor** - você precisará dele mais tarde

## Etapa 4: Obtenha o ID do diretório (locatário)

1. Na mesma página **Visão geral**
2. Copie o valor **ID do diretório (locatário)**
   - Este é um GUID parecido com este: `155812d2-1112-46c8-bf52-****-****`
   - **Salve este valor** - você precisará dele mais tarde

## Etapa 5: Crie um segredo do cliente

1. No menu lateral do seu aplicativo, selecione **Certificados e segredos**

<div class="mac-window">
  ![Menu Certificados e Segredos](/img/microsoft%20entraid%20sso%20images/5%20-%20azure.png)
</div>

2. Na seção **Segredos do cliente**, clique em **+ Novo segredo do cliente**
3. **Descrição**: Insira uma descrição (por exemplo, "SecureAI SSO Segredo")
4. **Expira**:
   - Selecione um período de validade (recomendado: 24 meses)
   - **IMPORTANTE**: certifique-se de renovar o segredo antes que ele expire
5. Clique em **Adicionar**

<div class="mac-window">
  ![Botão Adicionar segredo do cliente](/img/microsoft%20entraid%20sso%20images/6%20-%20azure.png)
</div>

6. **IMEDIATAMENTE** copie o **Valor** do segredo
   - Ficará assim: `plm8Q~************************************`

<div class="mac-window">
  ![Valor secreto do cliente](/img/microsoft%20entraid%20sso%20images/7%20-%20azure.png)
</div>
   - **AVISO**: Este valor é mostrado apenas uma vez. Se você perdê-lo, precisará criar um novo segredo
   - **Armazene este valor com segurança**

## Etapa 6: Configurar permissões de API

1. No menu lateral, selecione **Permissões de API**
2. Clique em **+ Adicionar uma permissão**
3. Selecione **Microsoft Graph**
4. Selecione **Permissões delegadas**
5. Verifique as seguintes permissões:
   - `openid` (incluído automaticamente)
   - `profile`
   - `email`
6. Clique em **Adicionar permissões**

<div class="mac-window">
  ![Botão Adicionar permissões](/img/microsoft%20entraid%20sso%20images/8%20-%20azure.png)
</div>

7. Se a sua organização exigir consentimento do administrador:
   - Clique em **Conceder consentimento do administrador**

<div class="mac-window">
  ![Botão conceder consentimento do administrador](/img/microsoft%20entraid%20sso%20images/9%20-%20azure.png)
</div>

## Etapa 7: Enviar variáveis para a equipe Hiper AI

Depois de criar o aplicativo no Azure e seguir as etapas acima, você terá obtido três informações críticas:

1. **ID do cliente** (da Etapa 3)
2. **ID do locatário** (da Etapa 4)
3. **Valor secreto do cliente** (da Etapa 5)

Você deve enviar esses três valores para a equipe do Hiper AI para concluir a integração do SSO.

### A. Acesse o painel de administração

1. Faça login em sua instância SecureAI como administrador
2. Navegue para `https://{enterprise.name}.hiperai.ai/admin/home`
3. No canto superior direito, clique na foto do seu perfil de administrador
4. Isso abrirá um menu suspenso com várias opções

### B. Envie a solicitação de suporte

1. Clique em **"Obter suporte"** no menu suspenso

<div class="mac-window">
  ![Menu Obter suporte](/img/microsoft%20entraid%20sso%20images/10%20-%20azure.png)
</div>

2. Uma janela pop-up aparecerá com um formulário de ticket de suporte
3. Preencha o formulário com as seguintes informações:
   - **Categoria**: Selecione **"Integrações e Implementações"**

<div class="mac-window">
  ![Categoria do formulário de suporte](/img/microsoft%20entraid%20sso%20images/11%20-%20azure.png)
</div>

   - **Assunto**: Digite **"Microsoft Entra ID SSO Integração"**
   - **Descrição**: Cole os três valores que você copiou durante o processo de configuração:
     - ID do cliente (ID do aplicativo)
     - ID do locatário (ID do diretório)
     - Valor secreto do cliente
4. Clique no botão **"Enviar solicitação"**

### C. Aguarde a confirmação

- Você receberá um e-mail de confirmação dentro de **24 a 72 horas** (dependendo da disponibilidade)
- O e-mail confirmará que seu SSO foi configurado com sucesso
- Depois de configurado, você poderá acessar sua instância SecureAI usando o botão de login **"Continuar com Azure EntraID"** na página de entrada

**Importante**: mantenha suas credenciais seguras até que a integração seja concluída. Não os compartilhe por meio de canais inseguros.

## Configuração do usuário

### Usuários existentes

Os usuários que já possuem contas no SecureAI (independentemente de usarem autenticação básica) **não precisam ser recriados**. Eles poderão continuar usando suas contas existentes e também poderão entrar usando o Azure Entra ID SSO depois de configurado.

**Importante**: o email do usuário no Azure deve corresponder exatamente ao email no SecureAI para que SSO funcione.

### Criando novos usuários SSO

Para novos usuários que devem acessar SecureAI exclusivamente através de SSO:

1. Navegue até **Gerenciamento de usuários** no painel de administração do SecureAI
2. Clique para criar um novo usuário
3. Ao criar o usuário, selecione a opção **"Conta Empresarial / SSO"**
4. Esta configuração garante que:
   - O novo usuário **não receberá email** para geração de senha
   - O usuário poderá acessar o SecureAI **diretamente usando o botão de login do Azure Entra ID SSO**
   - O email do usuário no Azure deve corresponder exatamente ao email informado no SecureAI

## Solução de problemas

### Erro: "o valor de redireccionamento_uri deve ser um URI absoluto válido"
- Verifique se o URI de redirecionamento no Azure corresponde exatamente ao que está configurado no servidor
- Certifique-se de incluir `https://` ou `http://` conforme apropriado

### Erro: "Usuário não encontrado no banco de dados SecureAI"
- O usuário deve estar previamente cadastrado no SecureAI
- Entre em contato com o administrador do SecureAI para criar a conta de usuário

### Erro: "Segredo do cliente inválido"
- O segredo pode ter expirado
- Crie um novo segredo do cliente e atualize a configuração

## Renovação do segredo do cliente

O segredo do cliente tem uma data de validade. Antes de expirar:

1. Crie um novo segredo do cliente seguindo a Etapa 5
2. Forneça o novo valor à sua equipe de desenvolvimento
3. Eles atualizarão a configuração sem interromper o serviço

## Suporte

Se você encontrar problemas durante a configuração:
1. Verifique se você tem permissões de administrador no Azure
2. Entre em contato com sua equipe de desenvolvimento com:
   - Capturas de tela dos erros
   - Os IDs que você obteve (sem o segredo)
   - A mensagem de erro completa