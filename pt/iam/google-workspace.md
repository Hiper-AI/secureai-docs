---
sidebar_position: 2
title: "Google Workspace (SSO)"
sidebar_label: "Google Workspace (SSO)"
---

# Integração com o Google Workspace (SSO)

Com esta integração, os usuários da sua organização entram no SecureAI com a conta do Google Workspace (o botão **Continuar com Google**, exibido como **Continue with Google** quando a interface está em inglês). A configuração é **self-service**: um administrador da sua organização cria um cliente OAuth no seu próprio projeto do Google Cloud e informa os dados em **Admin → Integrações**. Não é preciso abrir chamado nem aguardar nada da Hiper AI: o botão aparece na sua página de login assim que você salva.

Tempo estimado: 10 minutos.

## Pré-requisitos

- Um projeto do Google Cloud **dentro da organização do seu Google Workspace**, com permissão para configurar o Google Auth Platform e criar clientes OAuth nele (por exemplo, o papel **Proprietário** ou **Editor** do projeto).
- Acesso de administrador ao SecureAI, com permissão **Administrador** na seção **Integrações**.

## Como funciona

1. Você cria um **cliente OAuth 2.0 do tipo "Aplicativo da Web"** no Google Cloud. O SecureAI usa OpenID Connect com os escopos `openid`, `email` e `profile`.
2. No SecureAI, você informa o **ID do cliente**, a **chave secreta do cliente** e os seus **domínios do Google Workspace**. A chave secreta é armazenada criptografada e nunca mais é exibida.
3. Quando um usuário clica em **Continuar com Google**, o Google o autentica e o SecureAI só libera a entrada se:
   - o Google tiver verificado o e-mail dele,
   - a conta for **gerenciada por um dos seus domínios do Workspace** (a claim `hd`), e
   - o e-mail corresponder a uma conta **ativa** do SecureAI.

Uma conta pessoal do Google (por exemplo, uma conta @gmail.com ou uma conta pessoal criada com o e-mail da empresa) **não consegue** entrar, mesmo que tenha o mesmo e-mail de um usuário do SecureAI.

## Etapa 1: Copiar o URI de redirecionamento do SecureAI

1. Entre no SecureAI como administrador.
2. Acesse **Admin → Integrações** e filtre pela categoria **IAM**.
3. No cartão **Google Workspace (SSO)**, clique em **Conectar Integração** (ou em **Reconfigurar**, se o cartão mostrar **Configured by Hiper AI** (Configurado pela Hiper AI)).
4. Na seção **1. Create an OAuth client in Google Cloud** (Criar um cliente OAuth no Google Cloud), clique em **Copy** (Copiar) ao lado de **Redirect URI** (URI de redirecionamento).

O URI tem este formato (com o domínio da sua instância):

```
https://<your-company>.hiperai.ai/api/auth/google/callback
```

Use sempre o URI exibido pela sua instância: ele precisa corresponder exatamente, incluindo `https://`.

## Etapa 2: Escolher ou criar um projeto do Google Cloud

1. Abra o [console do Google Cloud](https://console.cloud.google.com).
2. No seletor de projetos da barra superior, escolha um projeto da sua organização ou clique em **Novo projeto**.

<div class="mac-window">
  ![Novo projeto](/img/google%20sso%20images/google%20-%201.png)
</div>

3. Se for criar um: dê um nome a ele (por exemplo `SecureAI SSO`), verifique se a **Organização** é a do seu Google Workspace e clique em **Criar**.

<div class="mac-window">
  ![Criar projeto](/img/google%20sso%20images/google%20-%202.png)
</div>

Nenhuma API precisa ser ativada para o login.

## Etapa 3: Configurar o Google Auth Platform (tela de consentimento)

1. No menu, acesse **APIs e serviços → Tela de consentimento OAuth** (OAuth consent screen), chamada de **Google Auth Platform** no novo console. Se for a primeira vez, clique em **Começar** (Get started).

<div class="mac-window">
  ![Tela de consentimento OAuth](/img/google%20sso%20images/google%20-%203.png)
</div>

2. **Informações do app**: um nome para o app (por exemplo `SecureAI`) e um e-mail de suporte ao usuário.
3. **Público-alvo**: escolha **Interno**. Somente contas da organização do seu Google Workspace podem usar o app, e o Google não exige a verificação do app.
4. **Dados de contato**: um e-mail para receber avisos do Google.
5. Aceite a política de dados do usuário e clique em **Criar**.

<div class="mac-window">
  ![Criar a configuração OAuth](/img/google%20sso%20images/google%20-%204.png)
</div>

Os escopos `openid`, `email` e `profile` não são sensíveis: não é necessário adicioná-los em **Acesso a dados**.

<Note>
Se você escolher **Externo**, o app precisa estar **Em produção** (e não em "Teste"); no modo de teste, só os usuários de teste que você listar conseguem entrar. Mesmo com Externo, o SecureAI só aceita contas dos domínios do Workspace que você configurar na etapa 5.
</Note>

## Etapa 4: Criar o cliente OAuth

1. No Google Auth Platform, acesse **Clientes** (ou **APIs e serviços → Credenciais → + Criar credenciais → ID do cliente OAuth**).

<div class="mac-window">
  ![Criar ID do cliente OAuth](/img/google%20sso%20images/google%20-%207.png)
</div>

2. Clique em **+ Criar cliente**.
3. **Tipo de aplicativo**: **Aplicativo da Web**.
4. **Nome**: por exemplo `SecureAI SSO`.
5. Em **URIs de redirecionamento autorizados** (Authorized redirect URIs), clique em **+ Adicionar URI** e cole o URI da etapa 1. (As **Origens JavaScript autorizadas** não são necessárias.)

<div class="mac-window">
  ![URIs de redirecionamento autorizados](/img/google%20sso%20images/google%20-%208.png)
</div>

6. Deixe desmarcada a opção **Usar este cliente para um agente com tecnologia de IA** (Use this client for an AI-powered agent): ela é para outro tipo de cliente e o SecureAI não precisa dela.
7. Clique em **Criar**.
8. Na caixa de diálogo exibida, copie o **ID do cliente** (termina em `.apps.googleusercontent.com`) e a **Chave secreta do cliente** (começa com `GOCSPX-`). Você pode baixar o JSON como backup. Não feche a caixa de diálogo até tê-la copiado.

<div class="mac-window">
  ![Cliente OAuth criado](/img/google%20sso%20images/google%20-%209.png)
</div>

<Warning>
O Google mostra a chave secreta completa apenas no momento da criação. Guarde-a em local seguro; se você a perder, adicione uma nova chave secreta ao cliente.
</Warning>

O Google avisa que um cliente novo, ou uma alteração nos URIs dele, pode levar de 5 minutos a algumas horas para entrar em vigor. Se na etapa 5 o **Test connection** apontar o URI de redirecionamento ou o ID do cliente recém-criados, aguarde alguns minutos e teste de novo antes de alterar qualquer coisa.

## Etapa 5: Informar os dados no SecureAI e testar

Volte para **Admin → Integrações → Google Workspace (SSO)**:

1. Em **2. Paste the OAuth client details** (Colar os dados do cliente OAuth), preencha:
   - **Client ID**: o ID do cliente da etapa 4.
   - **Client secret**: a chave secreta do cliente da etapa 4.
   - **Allowed email domains** (Domínios de e-mail permitidos; obrigatório): o domínio principal do seu Google Workspace e, se você os usar, os domínios secundários, separados por vírgula. Por exemplo `contoso.com, contoso.co.uk`.
2. Em **3. Test the connection** (Testar a conexão), clique em **Test connection**. O SecureAI consulta o Google (sem fazer login de ninguém) e verifica:

   | Verificação | Se falhar |
   |---|---|
   | Client ID | O Google não conhece esse cliente (`invalid_client`). Verifique se você copiou o ID completo e se o cliente não foi excluído nem desativado. |
   | Redirect URI registered on the client | O URI da etapa 1 não está em **URIs de redirecionamento autorizados** (`redirect_uri_mismatch`). Adicione-o exatamente e aguarde alguns minutos. |
   | Client secret | A chave secreta não pertence a esse cliente (`invalid_client`). Cole-a novamente ou adicione uma nova. |

   O teste usa o que está digitado no formulário, então você pode testar antes de salvar.
3. Verifique se **Show "Continue with Google" on the login page** (Mostrar o botão do Google na página de login) está ativado (ele já vem ativado na primeira vez). Sem domínios informados, o SecureAI não deixa salvá-lo ativado.
4. Clique em **Save** (Salvar).

A partir daí, o cartão exibe **Active on the login page** (Ativo na página de login), e o botão **Continuar com Google** aparece na página de login da sua instância.

## Etapa 6: Adicionar os usuários

O SecureAI **não cria contas automaticamente** no primeiro login: todas as pessoas que vão entrar com o Google precisam existir no SecureAI e estar ativas, com o **mesmo e-mail** da conta do Google Workspace (maiúsculas e minúsculas não importam; aliases com `+` não são aceitos).

- **Usuários existentes**: quem já tem conta no SecureAI (mesmo com senha) não é recriado. Essas pessoas podem continuar entrando com a senha e também com o Google.
- **Novos usuários somente SSO**: em **Admin → Gestao IAM → Gerenciamento de usuários → Adicionar usuário**, escolha o método de autenticação **Conta Empresarial / SSO**. O usuário não recebe e-mail para criar senha e entra diretamente com **Continuar com Google**.

Quando um usuário é desativado no SecureAI, ele também não consegue entrar por SSO.

## Testar o login

1. Abra a página de login da sua instância em uma janela anônima.
2. Clique em **Continuar com Google**.
3. Escolha sua conta do Google Workspace.
4. O Google redireciona você de volta ao SecureAI, já conectado.

O login com senha continua funcionando: ativar o SSO não o desativa.

## Desativar ou remover a integração

- Para ocultar o botão mas manter a configuração, desligue a chave e salve.
- Para excluí-la, use **Remove configuration** (Remover configuração). Se a sua instância tinha SSO configurado anteriormente pela Hiper AI, essa configuração volta a valer.

## Renovar a chave secreta do cliente

1. No Google Cloud, abra o cliente OAuth e clique em **Adicionar chave secreta** (a antiga continua funcionando).
2. No SecureAI, cole o novo valor em **Client secret**, clique em **Test connection** e depois em **Save**. Deixar o campo vazio mantém a chave secreta atual.
3. Depois de confirmar que o login funciona, desative e exclua a chave secreta antiga no Google Cloud.

A alteração vale imediatamente, sem encerrar as sessões ativas.

## Se a sua instância já tinha SSO configurado pela Hiper AI

As instâncias em que a Hiper AI configurou o SSO do Google sob solicitação mostram o cartão como **Configured by Hiper AI** (Configurado pela Hiper AI). Essa configuração continua funcionando. Se você salvar a sua própria configuração em Integrações, ela substitui a anterior; se depois você remover a sua, a anterior volta a valer.

## Solução de problemas

Os erros de login são exibidos na página de login do SecureAI (algumas mensagens aparecem em inglês):

| Mensagem no SecureAI | Causa e solução |
|---|---|
| "Usuário não encontrado no banco de dados do SecureAI." | Não existe conta do SecureAI com esse e-mail. Crie-a (etapa 6). |
| "This account is not allowed to sign in here…" | A conta não pertence a um dos **Allowed email domains**, ou é uma conta pessoal do Google (sem Workspace). Adicione o domínio ou use a conta corporativa. |
| "Seu provedor de identidade não verificou este endereço de e-mail." | O Google não marcou o e-mail como verificado, ou o e-mail contém caracteres que o SecureAI não aceita (por exemplo, um alias com `+`). |
| "This sign-in method is not enabled for your organization." | A integração está desativada ou incompleta. Verifique o cartão em Integrações. |
| "Your identity provider did not complete the sign-in…" | O Google retornou um erro, por exemplo porque o usuário cancelou. |
| "Single sign-on could not be completed…" | A troca do código falhou, normalmente porque a chave secreta foi substituída ou excluída. Use **Test connection**. |
| "A sessão de login expirou ou não foi iniciada neste navegador…" | Passaram-se mais de 10 minutos, ou o login foi iniciado em outra guia ou navegador. Tente novamente a partir da página de login. |

Erros exibidos pelo Google (antes de voltar ao SecureAI):

- **Erro 400: redirect_uri_mismatch**: o URI de redirecionamento do cliente não é exatamente o da etapa 1. Corrija-o em **URIs de redirecionamento autorizados** (e não em Origens JavaScript).
- **Erro 403: org_internal**: o app é **Interno** e a conta não pertence à organização do Google Cloud proprietária do projeto. Isso também acontece quando sua empresa tem mais de uma organização Google (por exemplo, `company.com` e `company.ai`) e o cliente OAuth foi criado em um projeto da outra: crie-o em um projeto da organização à qual seus usuários pertencem (o seletor de projetos do console mostra a organização de cada projeto).
- **Erro 401: invalid_client / deleted_client**: o cliente OAuth não existe ou foi excluído. Crie um novo e atualize o SecureAI.
- **"Access blocked: your administrator has not trusted this app"** (ou a mensagem equivalente em português, indicando que o administrador não confiou no app): os controles de acesso a apps do seu Workspace bloqueiam apps de terceiros. No Google Admin Console (**Segurança → Controle de acesso e dados → Controles de API → Gerenciar o acesso de apps de terceiros**), marque o ID do cliente como **Confiável**.

Se precisar de ajuda, entre em contato com o suporte em **Obter Suporte**, no menu do seu perfil, e inclua o ID do cliente e a mensagem de erro. **Nunca envie a chave secreta do cliente.**

## Recursos adicionais

- [Como configurar o OAuth 2.0 no Google Cloud](https://support.google.com/cloud/answer/6158849)
- [OpenID Connect no Google](https://developers.google.com/identity/openid-connect/openid-connect)
- [Controlar quais apps de terceiros acessam os dados do Google Workspace](https://support.google.com/a/answer/7281227)