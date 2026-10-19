---
sidebar_position: 2
title: "SharePoint & OneDrive — Add from SharePoint"
sidebarTitle: "SharePoint"
icon: "/img/icons/sharepoint.svg"
sidebar_label: "SharePoint & OneDrive"
description: "Permita que seus usuários anexem arquivos de sites do SharePoint e do OneDrive no chat do SecureAI. Configuração self-serve com o seu próprio registro de aplicativo do Microsoft Entra ID."
---

# SharePoint & OneDrive — Add from SharePoint

Com esta integração, seus usuários anexam arquivos de **sites do SharePoint** (incluindo sites do Teams), do **OneDrive** e de **Compartilhados comigo** diretamente pelo chat, com a opção **Add from SharePoint** do botão de anexar.

A configuração é **self-serve**: um administrador da sua organização registra o SecureAI como aplicativo no **seu próprio diretório do Microsoft Entra ID** e informa os identificadores em **Admin → Integrations → Files**. Não é preciso abrir um chamado nem esperar pela Hiper AI: a opção aparece no chat assim que você salva a configuração.

Tempo estimado: 10 minutos.

## Como funciona

1. O usuário clica em **Attach → Add from SharePoint**. Na primeira vez, a Microsoft pede que ele faça login com **a própria conta do Microsoft 365**.
2. Abre-se o navegador de arquivos do SecureAI sobre o Microsoft Graph: sites, bibliotecas, pastas, pesquisa e arquivos compartilhados com o usuário. O usuário escolhe um ou mais arquivos.
3. O navegador do usuário baixa **somente os arquivos escolhidos**, com o token do próprio usuário, e os anexa à mensagem.
4. O arquivo segue o caminho de qualquer anexo: **passa pelo DLP** e pelas políticas da sua organização antes de chegar a um modelo.

<Info>
**Permissões delegadas, nunca de aplicativo.** O SecureAI atua sempre **em nome do usuário que fez login**: um usuário só vê e anexa o que já consegue abrir no SharePoint. O aplicativo é um "aplicativo de página única" (SPA) sem segredo do cliente, e o SecureAI não lê nada em segundo plano.
</Info>

## Pré-requisitos

- Uma função do Entra ID que permita registrar aplicativos e **conceder consentimento do administrador** para permissões do Microsoft Graph (por exemplo, **Administrador de Aplicativos na Nuvem** ou **Administrador Global**).
- Acesso de administrador ao SecureAI, com permissão de **Administrator** na seção **Integrations**.
- Um plano do SecureAI que inclua **Attach from Drive / SharePoint**. Sem ele, você pode deixar a configuração pronta, mas os usuários não verão a opção.

## Etapa 1: Copiar o URI de redirecionamento do SecureAI

1. Faça login no SecureAI como administrador.
2. Vá a **Admin → Integrations** e filtre pela categoria **Files**.
3. No cartão **SharePoint & OneDrive**, clique em **Connect integration**.
4. Na seção **1. Register SecureAI in Microsoft Entra ID**, clique em **Copy** ao lado do **Redirect URI**.

<div class="mac-window">
  ![Redirect URI no painel lateral do SecureAI](/img/files/sharepoint/1%20-%20SharePoint.png)
</div>

O URI é o endereço da sua instância, por exemplo `https://<sua-empresa>.hiperai.ai`. Use sempre o que a sua instância exibe: ele precisa coincidir exatamente.

## Etapa 2: Registrar o aplicativo no Entra ID

1. Abra o [centro de administração do Microsoft Entra](https://entra.microsoft.com) e vá a **Identidade → Aplicativos → Registros de aplicativo** (Identity → Applications → App registrations).
2. Clique em **Novo registro** (New registration).

<div class="mac-window">
  ![Registros de aplicativo → Novo registro](/img/files/sharepoint/2%20-%20SharePoint.jpg)
</div>

3. Preencha:
   - **Nome** (Name): por exemplo `SecureAI — Add from SharePoint`.
   - **Tipos de conta com suporte** (Supported account types): **Somente contas neste diretório organizacional** (Accounts in this organizational directory only; locatário único).
   - **URI de redirecionamento** (Redirect URI): na lista suspensa, escolha **Aplicativo de página única (SPA)** (Single-page application) e cole o URI que você copiou na etapa 1.
4. Clique em **Registrar** (Register).


<Warning>
A plataforma precisa ser **Aplicativo de página única (SPA)**, não **Web**. Com **Web**, o login falha com o erro `AADSTS9002326`. Se você já a registrou como Web, vá a **Autenticação** (Authentication), adicione uma plataforma **Aplicativo de página única** com o mesmo URI e remova a de Web.
</Warning>

5. Na **Visão geral** (Overview) do aplicativo, copie a **ID do aplicativo (cliente)** (Application (client) ID) e a **ID do diretório (locatário)** (Directory (tenant) ID). Não é preciso criar nenhum segredo do cliente.

<div class="mac-window">
  ![ID do aplicativo e do diretório](/img/files/sharepoint/4%20-%20SharePoint.jpg)
</div>

## Etapa 3: Adicionar as permissões do Microsoft Graph

1. No aplicativo, vá a **Permissões de API → Adicionar uma permissão → Microsoft Graph → Permissões delegadas** (API permissions → Add a permission → Microsoft Graph → Delegated permissions).
2. Procure e marque:
   - `Files.Read.All` — ler os arquivos aos quais o usuário tem acesso.
   - `Sites.Read.All` — listar e pesquisar os sites do SharePoint aos quais o usuário tem acesso.
3. Clique em **Adicionar permissões** (Add permissions). `User.Read` já vem adicionada por padrão; deixe-a.

<div class="mac-window">
  ![Permissões delegadas do Microsoft Graph](/img/files/sharepoint/5%20-%20SharePoint.jpg)
</div>

## Etapa 4: Conceder o consentimento do administrador

1. Em **Permissões de API**, clique em **Conceder consentimento do administrador para &lt;sua organização&gt;** (Grant admin consent for &lt;org&gt;) e confirme com **Sim**.
2. As três permissões devem ficar com o status **Concedido para &lt;sua organização&gt;**.

<div class="mac-window">
  ![Consentimento do administrador concedido](/img/files/sharepoint/6%20-%20SharePoint.jpg)
</div>

Sem esta etapa, cada usuário veria uma solicitação de consentimento (ou um erro `AADSTS65001`, se a sua organização não permitir que os usuários deem consentimento).

## Etapa 5: Informar, testar e ativar no SecureAI

1. Volte ao painel lateral do **SharePoint & OneDrive** no SecureAI.
2. Em **2. Paste the identifiers**, cole o **Directory (tenant) ID** e o **Application (client) ID**.
3. Em **3. Test it**:
   - **Test connection** verifica, a partir dos servidores do SecureAI, se o diretório existe.
   - **Try signing in** abre a mesma janela da Microsoft que seus usuários verão: faça login com a sua conta. O SecureAI confirma que o URI de redirecionamento é do tipo SPA, que `Files.Read.All` e `Sites.Read.All` têm consentimento e que o Microsoft Graph responde.

<div class="mac-window">
  ![Testes em verde no painel lateral do SecureAI](/img/files/sharepoint/7%20-%20SharePoint.png)
</div>

4. Em **4.**, deixe ativada a opção **Show "Add from SharePoint" to users** e clique em **Save**.

O cartão passa a exibir **Available in the chat**.

## Etapa 6: Como os usuários utilizam

1. No chat, o usuário clica no botão de **anexar** e escolhe **Add from SharePoint**.

<div class="mac-window">
  ![Add from SharePoint no menu de anexar](/img/files/sharepoint/8%20-%20SharePoint.png)
</div>

2. Na primeira vez, clica em **Sign in with Microsoft** e escolhe a conta da sua organização.
3. Navega por **Sites**, **Shared** ou pela pesquisa, escolhe um ou mais arquivos e clica em **Add**.


4. Os arquivos aparecem anexados à mensagem, com o ícone do SharePoint.

## Restringir quem pode usar (opcional)

Para que somente alguns usuários ou grupos possam usar **Add from SharePoint**:

1. No Entra, vá a **Aplicativos empresariais** (Enterprise applications) e abra o aplicativo que você registrou.
2. Em **Propriedades** (Properties), ative **Atribuição obrigatória?** (Assignment required?) e salve.
3. Em **Usuários e grupos** (Users and groups), atribua os usuários ou grupos autorizados.

Um usuário não atribuído recebe o erro `AADSTS50105` ao fazer login e não pode anexar arquivos.

## Solução de problemas

| O que você vê | Causa | O que fazer |
|---|---|---|
| `AADSTS50011` — o URI de redirecionamento não coincide | O URI da etapa 1 não está registrado | Adicione-o em **Autenticação → Aplicativo de página única** |
| `AADSTS9002326` | O URI está registrado como **Web** | Mova-o para **Aplicativo de página única** |
| `AADSTS65001` — falta consentimento | O consentimento do administrador não foi concedido | Etapa 4 |
| `AADSTS700016` — aplicativo não encontrado | ID do aplicativo ou do diretório incorreto | Copie-os novamente da **Visão geral** |
| `AADSTS50105` | O usuário não está atribuído ao aplicativo | Atribua-o ou desative **Atribuição obrigatória?** |
| **Try signing in**: "These delegated permissions are missing" (faltam estas permissões delegadas) | Falta `Files.Read.All` ou `Sites.Read.All`, ou o consentimento delas | Etapas 3 e 4 |
| O usuário não vê sites, apenas "Shared" | O usuário não é membro de nenhum site | Esperado: ele só vê o que já consegue abrir |
| O usuário não vê **Add from SharePoint** | A integração está desativada, sem salvar, ou o plano não a inclui | Revise o cartão em **Admin → Integrations → Files** |

## Perguntas frequentes

**O que o SecureAI pode ler?** Somente o que o usuário que fez login já pode ler, e apenas quando ele escolhe um arquivo no navegador de arquivos. As permissões são delegadas: não existe acesso do SecureAI "como aplicativo" ao seu SharePoint.

**As políticas de acesso condicional funcionam?** Sim. O login é um login normal do Microsoft 365 e respeita MFA, dispositivos gerenciados e o restante das suas políticas.

**Como desativo?** Desative **Show "Add from SharePoint" to users** e salve, ou clique em **Remove configuration**. Para revogar também os tokens já emitidos, exclua o registro do aplicativo no Entra ID ou desabilite o login do seu aplicativo empresarial.

**A Hiper AI já havia configurado o SharePoint para mim. Preciso fazer algo?** Não. Enquanto você não salvar uma configuração própria, o cartão mostra **Configured by Hiper AI** e tudo continua funcionando igual. Se você salvar a sua, ela substitui a anterior.
