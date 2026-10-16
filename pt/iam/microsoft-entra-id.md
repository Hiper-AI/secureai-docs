---
sidebar_position: 3
title: "Microsoft Entra ID (SSO)"
sidebar_label: "Microsoft Entra ID (SSO)"
---

# Integração com o Microsoft Entra ID (SSO)

Com esta integração, os usuários da sua organização entram no SecureAI com a conta corporativa da Microsoft (o botão **Continuar com Azure Entra**, exibido como **Continue with Microsoft** quando a interface está em inglês). A configuração é **self-service**: um administrador da sua organização registra o SecureAI no seu próprio locatário do Microsoft Entra ID (antigo Azure Active Directory) e informa os dados em **Admin → Integrações**. Não é preciso abrir chamado nem aguardar nada da Hiper AI: o botão aparece na sua página de login assim que você salva.

Tempo estimado: 10 minutos.

## Pré-requisitos

- Uma função do Microsoft Entra que permita criar registros de aplicativo (por exemplo, **Desenvolvedor de Aplicativos** ou **Administrador de Aplicativos**). Para conceder o consentimento do administrador (etapa 4), é necessária a função **Administrador de Aplicativos de Nuvem**, **Administrador de Aplicativos** ou **Administrador Global**.
- Acesso de administrador ao SecureAI, com permissão **Administrador** na seção **Integrações**.

## Como funciona

1. Você cria um **registro de aplicativo** no seu locatário do Entra ID. O SecureAI usa OpenID Connect (fluxo de código de autorização) com um **segredo do cliente**.
2. No SecureAI, você informa o **ID do diretório (locatário)**, o **ID do aplicativo (cliente)** e o **valor do segredo do cliente**. O segredo é armazenado criptografado e nunca mais é exibido.
3. Quando um usuário clica em **Continuar com Azure Entra**, a Microsoft o autentica (com as suas políticas de MFA e de Acesso Condicional) e o SecureAI libera a entrada se o e-mail dele corresponder a uma conta **ativa** do SecureAI.

O SecureAI só aceita tokens emitidos pelo **seu** locatário: o login fica vinculado ao seu diretório, e os endpoints multilocatário (`common` / `organizations`) nunca são usados.

## Etapa 1: Copiar o URI de redirecionamento do SecureAI

1. Entre no SecureAI como administrador.
2. Acesse **Admin → Integrações** e filtre pela categoria **IAM**.
3. No cartão **Microsoft Entra ID (SSO)**, clique em **Conectar Integração**.
4. Na seção **1. Register SecureAI in Microsoft Entra ID** (Registrar o SecureAI no Microsoft Entra ID), clique em **Copy** (Copiar) ao lado de **Redirect URI** (URI de redirecionamento).

O URI tem este formato (com o domínio da sua instância):

```
https://<your-company>.hiperai.ai/api/auth/azure/callback
```

Use sempre o URI exibido pela sua instância: ele precisa corresponder caractere por caractere, incluindo `https://`.

Mantenha esta janela aberta; você voltará a ela para colar os dados.

## Etapa 2: Registrar o aplicativo no Microsoft Entra ID

1. Abra o [Centro de administração do Microsoft Entra](https://entra.microsoft.com) (ou o [portal do Azure](https://portal.azure.com) → **Microsoft Entra ID**).

<div class="mac-window">
  ![Pesquisando o Microsoft Entra ID no portal do Azure](/img/microsoft%20entraid%20sso%20images/1%20-%20azure.png)
</div>

2. Acesse **Aplicativos → Registros de aplicativo** (Applications → App registrations).

<div class="mac-window">
  ![Menu Registros de aplicativo](/img/microsoft%20entraid%20sso%20images/2%20-%20azure.png)
</div>

3. Clique em **+ Novo registro** (New registration).

<div class="mac-window">
  ![Botão Novo registro](/img/microsoft%20entraid%20sso%20images/3%20-%20azure.png)
</div>

4. Preencha o formulário:
   - **Nome**: um nome descritivo, por exemplo `SecureAI SSO`. Os usuários o veem na tela de consentimento.
   - **Tipos de conta com suporte**: **Contas somente neste diretório organizacional (Locatário único)** (Accounts in this organizational directory only (Single tenant)).
   - **URI de Redirecionamento**: plataforma **Web** (não "Aplicativo de página única"); cole o URI que você copiou na etapa 1.
5. Clique em **Registrar**.

<div class="mac-window">
  ![Formulário de registro do aplicativo](/img/microsoft%20entraid%20sso%20images/4%20-%20azure.png)
</div>

6. Na página **Visão geral** do aplicativo, copie:
   - **ID do aplicativo (cliente)** — um GUID como `b96ee19f-5a15-4a85-b936-xxxxxxxxxxxx`.
   - **ID do diretório (locatário)** — outro GUID, como `155812d2-1112-46c8-bf52-xxxxxxxxxxxx`.

## Etapa 3: Criar um segredo do cliente

1. No menu do aplicativo, abra **Certificados e segredos** (Certificates & secrets).

<div class="mac-window">
  ![Menu Certificados e segredos](/img/microsoft%20entraid%20sso%20images/5%20-%20azure.png)
</div>

2. Em **Segredos do cliente**, clique em **+ Novo segredo do cliente**.
3. Insira uma descrição (por exemplo `SecureAI SSO`) e escolha a validade (a Microsoft recomenda menos de 12 meses; o máximo é 24).
4. Clique em **Adicionar**.

<div class="mac-window">
  ![Adicionar um segredo do cliente](/img/microsoft%20entraid%20sso%20images/6%20-%20azure.png)
</div>

5. Copie **imediatamente** a coluna **Valor** (algo como `plm8Q~xxxxxxxx…`). Ela é exibida apenas uma vez.

<div class="mac-window">
  ![Valor do segredo do cliente](/img/microsoft%20entraid%20sso%20images/7%20-%20azure.png)
</div>

<Warning>
Copie o **Valor**, não o **ID do segredo** (que é um GUID). Se você colar o ID do segredo, o SecureAI o rejeitará ao salvar.
</Warning>

Anote a data de validade: quando o segredo expira, o login com a Microsoft para de funcionar até que você informe um novo (consulte [Renovar o segredo do cliente](#renovar-o-segredo-do-cliente)).

## Etapa 4: Revisar as permissões de API

O SecureAI solicita as permissões delegadas do Microsoft Graph `openid`, `profile`, `email` e `User.Read` (esta última para ler a foto de perfil do usuário). `User.Read` é adicionada por padrão aos novos registros.

1. No menu do aplicativo, abra **Permissões de APIs** (API permissions).
2. Verifique se **Microsoft Graph → Permissões delegadas** inclui `User.Read` e, se quiser listá-las explicitamente, `openid`, `profile` e `email` (em **+ Adicionar uma permissão → Microsoft Graph → Permissões delegadas**).

<div class="mac-window">
  ![Adicionar permissões delegadas](/img/microsoft%20entraid%20sso%20images/8%20-%20azure.png)
</div>

3. Clique em **Conceder consentimento do administrador para [nome da sua organização]** (Grant admin consent for …) e confirme.

<div class="mac-window">
  ![Conceder consentimento do administrador](/img/microsoft%20entraid%20sso%20images/9%20-%20azure.png)
</div>

Se o seu locatário não permite que os usuários consintam com aplicativos (configuração comum em empresas), esta etapa é obrigatória: sem ela, os usuários veem "Aprovação do administrador necessária" ("Need admin approval") ao entrar.

## Etapa 5: Informar os dados no SecureAI e testar

Volte para **Admin → Integrações → Microsoft Entra ID (SSO)**:

1. Em **2. Paste the app registration details** (Colar os dados do registro de aplicativo), preencha:
   - **Directory (tenant) ID**: o GUID da etapa 2 (um domínio verificado do seu locatário, como `contoso.onmicrosoft.com`, também funciona).
   - **Application (client) ID**: o GUID da etapa 2.
   - **Client secret value**: o valor da etapa 3.
   - **Allowed email domains** (Domínios de e-mail permitidos; opcional, recomendado): os domínios de e-mail da sua organização, separados por vírgula, por exemplo `contoso.com, contoso.co.uk`. Somente esses endereços podem entrar com a Microsoft. Se o campo ficar vazio, qualquer conta do seu locatário que exista no SecureAI é aceita.
2. Em **3. Test the connection** (Testar a conexão), clique em **Test connection**. O SecureAI consulta a Microsoft (sem fazer login de ninguém) e verifica:

   | Verificação | Se falhar |
   |---|---|
   | Directory (tenant) ID | A Microsoft não conhece esse locatário (`AADSTS90002`). Copie o ID do diretório da página Visão geral. |
   | Application (client) ID | Não existe esse aplicativo no locatário (`AADSTS700016`). Verifique o ID do cliente e se o aplicativo está no mesmo locatário. |
   | Client secret | O segredo é inválido (`AADSTS7000215`) ou expirou (`AADSTS7000222`). Cole o **Valor** ou crie um novo. |

   O teste usa o que está digitado no formulário, então você pode testar antes de salvar. Se o seu locatário tiver uma política de Acesso Condicional que bloqueie tokens somente de aplicativo, o segredo pode aparecer como "Could not be verified automatically" (não foi possível verificar automaticamente): isso não é um erro — confirme com um login real.

3. Ative **Show "Continue with Microsoft" on the login page** (Mostrar o botão da Microsoft na página de login).
4. Clique em **Save** (Salvar).

A partir daí, o cartão exibe **Active on the login page** (Ativo na página de login), e o botão **Continuar com Azure Entra** aparece na página de login da sua instância.

## Etapa 6: Adicionar os usuários

O SecureAI **não cria contas automaticamente** no primeiro login: todas as pessoas que vão entrar com a Microsoft precisam existir no SecureAI e estar ativas. O e-mail da conta do SecureAI deve corresponder ao e-mail do usuário no Entra ID (o atributo **Email**/Mail; quando ele está vazio, é usado o **Nome UPN** / user principal name). Maiúsculas e minúsculas não importam.

- **Usuários existentes**: quem já tem conta no SecureAI (mesmo com senha) não é recriado. Essas pessoas podem continuar entrando com a senha e também com a Microsoft.
- **Novos usuários somente SSO**: em **Admin → Gestao IAM → Gerenciamento de usuários → Adicionar usuário**, escolha o método de autenticação **Conta Empresarial / SSO**. O usuário não recebe e-mail para criar senha e entra diretamente com **Continuar com Azure Entra**.
- **Muitos usuários**: você pode provisioná-los e desprovisioná-los automaticamente a partir do Entra ID com SCIM.

Quando um usuário é desativado no SecureAI (manualmente ou via SCIM), ele também não consegue entrar por SSO.

## Testar o login

1. Abra a página de login da sua instância em uma janela anônima.
2. Clique em **Continuar com Azure Entra**.
3. Escolha sua conta corporativa e conclua a MFA, se for solicitado.
4. A Microsoft redireciona você de volta ao SecureAI, já conectado.

O login com senha continua funcionando: ativar o SSO não o desativa.

## Desativar ou remover a integração

- Para ocultar o botão mas manter a configuração, desligue a chave e salve.
- Para excluí-la, use **Remove configuration** (Remover configuração). Se a sua instância tinha SSO configurado anteriormente pela Hiper AI, essa configuração volta a valer.

## Renovar o segredo do cliente

Antes que o segredo expire:

1. No Entra ID, crie um novo segredo do cliente (etapa 3) sem excluir o antigo.
2. No SecureAI, abra a integração, cole o novo valor em **Client secret value**, clique em **Test connection** e depois em **Save**. Deixar o campo vazio mantém o segredo atual.
3. Depois de confirmar que o login funciona, exclua o segredo antigo no Entra ID.

A alteração vale imediatamente, sem encerrar as sessões ativas.

## Se a sua instância já tinha SSO configurado pela Hiper AI

As instâncias em que a Hiper AI configurou o SSO da Microsoft sob solicitação mostram o cartão como **Configured by Hiper AI** (Configurado pela Hiper AI). Essa configuração continua funcionando. Se você salvar a sua própria configuração em Integrações, ela substitui a anterior; se depois você remover a sua, a anterior volta a valer.

## Solução de problemas

Os erros de login são exibidos na página de login do SecureAI (algumas mensagens aparecem em inglês):

| Mensagem no SecureAI | Causa e solução |
|---|---|
| "Usuário não encontrado no banco de dados do SecureAI." | Não existe conta do SecureAI com esse e-mail. Crie-a (etapa 6) ou verifique se o e-mail corresponde ao Email/UPN do Entra ID. |
| "This account is not allowed to sign in here…" | O domínio do e-mail não está em **Allowed email domains**, ou o token veio de outro locatário. |
| "This sign-in method is not enabled for your organization." | A integração está desativada ou incompleta. Verifique o cartão em Integrações. |
| "Your identity provider did not complete the sign-in…" | A Microsoft retornou um erro: o usuário cancelou, falta o consentimento do administrador (etapa 4) ou o usuário não está atribuído ao aplicativo. |
| "Single sign-on could not be completed…" | A troca do código falhou, normalmente porque o segredo expirou ou foi substituído. Use **Test connection**. |
| "Sua conta está inativa…" | A conta está desativada no SecureAI. |
| "A sessão de login expirou ou não foi iniciada neste navegador…" | Passaram-se mais de 10 minutos, ou o login foi iniciado em outra guia ou navegador. Tente novamente a partir da página de login. |

Erros exibidos pela Microsoft (antes de voltar ao SecureAI):

- **AADSTS50011 – The redirect URI does not match**: o URI registrado no Entra ID não é exatamente o que o SecureAI mostra na etapa 1, ou foi registrado como "Aplicativo de página única" em vez de **Web**.
- **AADSTS65001 / "Need admin approval"**: conceda o consentimento do administrador (etapa 4).
- **AADSTS50105 – The signed in user is not assigned to a role for the application**: o aplicativo empresarial está com **Atribuição necessária?** definido como **Sim**. Atribua o usuário ou um grupo em **Aplicativos empresariais → SecureAI SSO → Usuários e grupos**.
- **AADSTS7000215 / AADSTS7000222**: segredo inválido ou expirado. Informe um novo.

Se precisar de ajuda, entre em contato com o suporte em **Obter Suporte**, no menu do seu perfil, e inclua o ID do aplicativo (cliente), o ID do diretório e a mensagem de erro. **Nunca envie o segredo do cliente.**