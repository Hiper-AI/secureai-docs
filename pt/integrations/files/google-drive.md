---
sidebar_position: 1
title: "Google Drive — Add from Drive"
sidebarTitle: "Google Drive"
icon: "/img/icons/google-drive.svg"
sidebar_label: "Google Drive"
description: "Permita que seus usuários anexem arquivos do Google Drive e de drives compartilhados no chat do SecureAI. Configuração self-serve com o seu próprio cliente OAuth do Google Cloud."
---

# Google Drive — Add from Drive

Com esta integração, seus usuários anexam arquivos do **Google Drive** (Meu Drive, Compartilhados comigo e **drives compartilhados**) diretamente pelo chat, com a opção **Add from Drive** do botão de anexar.

A configuração é **self-serve**: um administrador da sua organização cria um cliente OAuth e uma API key no **seu próprio projeto do Google Cloud** e os informa em **Admin → Integrations → Files**. Não é preciso abrir um chamado nem esperar pela Hiper AI: a opção aparece no chat assim que você salva a configuração.

Tempo estimado: 10 minutos.

## Como funciona

1. O usuário clica em **Attach → Add from Drive**. Na primeira vez, o Google pede que ele faça login com **a própria conta** e autorize o SecureAI.
2. Abre-se o **seletor oficial do Google Drive** (Google Picker). O usuário escolhe um ou mais arquivos.
3. O navegador do usuário baixa **somente os arquivos escolhidos**, com o token do próprio usuário, e os anexa à mensagem. Os documentos do Google são exportados para o Office (Docs → `.docx`, Sheets → `.xlsx`, Slides → `.pptx`; os demais, para PDF).
4. O arquivo segue o caminho de qualquer anexo: **passa pelo DLP** e pelas políticas da sua organização antes de chegar a um modelo.

<Info>
**O SecureAI nunca vê todo o seu Drive.** Usa-se o escopo `drive.file`: o SecureAI só pode ler os arquivos que cada usuário escolhe no seletor, e nada mais. Não há conta de serviço, nem delegação em todo o domínio, nem leitura em segundo plano: um usuário só pode anexar o que já consegue abrir no Drive.
</Info>

## Pré-requisitos

- Um projeto do Google Cloud **dentro da organização do seu Google Workspace**, e permissões para ativar APIs, configurar o Google Auth Platform e criar credenciais nele (por exemplo, o papel de **Proprietário** ou **Editor** do projeto).
- Acesso de administrador ao SecureAI, com permissão de **Administrator** na seção **Integrations**.
- Um plano do SecureAI que inclua **Attach from Drive / SharePoint**. Sem ele, você pode deixar a configuração pronta, mas os usuários não verão a opção.

## Etapa 1: Copiar os endereços do SecureAI

1. Faça login no SecureAI como administrador.
2. Vá a **Admin → Integrations** e filtre pela categoria **Files**.
3. No cartão **Google Drive**, clique em **Connect integration**.

<div class="mac-window">
  ![Cartões da categoria Files](/img/files/google-drive/1%20-%20Google%20Drive.png)
</div>

4. Na seção **1. Set up Google Cloud** você encontrará os dois valores de que precisa no Google Cloud, cada um com seu botão **Copy**:
   - **Authorized JavaScript origin**: o endereço da sua instância, por exemplo `https://<sua-empresa>.hiperai.ai`.
   - **Website restrictions for the API key**: duas linhas, o endereço da sua instância terminado em `/*` e `https://docs.google.com/*`.

<div class="mac-window">
  ![Origem e restrição no painel lateral do SecureAI](/img/files/google-drive/2%20-%20Google%20Drive.png)
</div>

Use sempre os valores exibidos pela sua instância: eles precisam coincidir exatamente, incluindo `https://` e sem `/` no final na origem.

<Note>
`https://docs.google.com/*` é o próprio seletor do Google: ele abre como um frame de `docs.google.com` e apresenta a API key a partir dali. Sem essa linha, o seletor abre com o erro **"The API developer key is invalid"**.
</Note>

## Etapa 2: Escolher o projeto e ativar as APIs

1. Abra o [console do Google Cloud](https://console.cloud.google.com) e, no seletor de projetos da barra superior, escolha um projeto da sua organização (ou crie um novo, por exemplo `SecureAI Drive`).
2. Vá a **APIs e serviços → Biblioteca** (APIs & Services → Library), procure **Google Drive API** e clique em **Ativar** (Enable).

<div class="mac-window">
  ![Ativar a Google Drive API](/img/files/google-drive/3%20-%20Google%20Drive.jpg)
</div>

3. Repita com a **Google Picker API**.

<div class="mac-window">
  ![Ativar a Google Picker API](/img/files/google-drive/4%20-%20Google%20Drive.jpg)
</div>

## Etapa 3: Configurar a tela de consentimento

1. Vá a **Google Auth Platform** (menu **APIs e serviços → Tela de permissão OAuth**, ou "OAuth consent screen"). Se o projeto ainda não a tiver configurada, clique em **Começar** (Get started).
2. Preencha **Nome do app** (App name; por exemplo `SecureAI`) e o **E-mail de suporte do usuário** (User support email).
3. Em **Público-alvo** (Audience), escolha **Interno** (Internal): somente as contas da sua organização do Google Workspace poderão autorizar o app, e o Google não exige verificação.
4. Preencha o e-mail de contato, aceite a política de dados do usuário e clique em **Criar** (Create).

<div class="mac-window">
  ![Público-alvo Interno no Google Auth Platform](/img/files/google-drive/5%20-%20Google%20Drive.jpg)
</div>

Não é preciso adicionar escopos manualmente: o SecureAI solicita apenas `drive.file`, um escopo não sensível.

## Etapa 4: Criar o cliente OAuth

1. Em **Google Auth Platform → Clientes** (Clients), clique em **Criar cliente** (Create client).
2. Em **Tipo de aplicativo** (Application type), escolha **Aplicativo da Web** (Web application) e dê um nome a ele (por exemplo `SecureAI — Add from Drive`).
3. Em **Origens JavaScript autorizadas** (Authorized JavaScript origins), clique em **Adicionar URI** (Add URI) e cole a **Authorized JavaScript origin** que você copiou na etapa 1.
4. Deixe vazios os **URIs de redirecionamento autorizados** (Authorized redirect URIs): o seletor não os usa.
5. Clique em **Criar**.

<div class="mac-window">
  ![Cliente OAuth do tipo Aplicativo da Web com a origem do SecureAI](/img/files/google-drive/6%20-%20Google%20Drive.jpg)
</div>

6. Copie o **ID do cliente** (Client ID; ele termina em `.apps.googleusercontent.com`). Este cliente não precisa de segredo: não o copie nem o informe em lugar nenhum.

<div class="mac-window">
  ![ID do cliente criado](/img/files/google-drive/7%20-%20Google%20Drive.jpg)
</div>

<Note>
Se a sua organização já usa um cliente web do Google para o [login com Google Workspace](/pt/iam/google-workspace) no SecureAI, você pode reutilizá-lo: adicione a origem JavaScript a esse mesmo cliente.
</Note>

## Etapa 5: Criar e restringir a API key

1. Vá a **APIs e serviços → Credenciais** (Credentials) e clique em **Criar credenciais → Chave de API** (Create credentials → API key).
2. Abra a chave recém-criada (**Editar chave de API**, ou "Edit API key"):
   - Em **Restrições de aplicativos** (Application restrictions), escolha **Sites** (Websites) e use **Adicionar** (Add) para adicionar as **duas** restrições que você copiou na etapa 1: o endereço da sua instância terminado em `/*` e `https://docs.google.com/*`.
   - Em **Restrições de API** (API restrictions), escolha **Restringir chave** (Restrict key) e marque somente **Google Picker API**.
3. Clique em **Salvar** (Save) e copie a chave (começa com `AIza`). As alterações em uma API key podem levar até 5 minutos para entrar em vigor.

<div class="mac-window">
  ![API key restrita a Sites e à Google Picker API](/img/files/google-drive/8%20-%20Google%20Drive.jpg)
</div>

<Warning>
A API key **é pública por design**: o navegador de cada usuário a recebe para abrir o seletor. Por isso é obrigatório restringi-la ao site do SecureAI, a `docs.google.com` e à Google Picker API.
</Warning>

Se você editar a chave depois de usar **Test connection**, o Google pode mostrar **"Warning: Potential breakage due to active usage"** com `drive.googleapis.com` na lista. Esse uso foi gerado pelo teste do SecureAI, que consulta a Google Drive API com a chave para verificá-la: digite `UPDATE` e confirme.

## Etapa 6: Informar, testar e ativar no SecureAI

1. Volte ao painel lateral do **Google Drive** no SecureAI.
2. Em **2. Paste the identifiers**, cole o **Client ID** e a **API key**.
3. Em **3. Test it**:
   - **Test connection** verifica, a partir dos servidores do SecureAI, se a API key é válida, se aceita requisições da sua instância e do seletor do Google (`docs.google.com`) e se pertence ao **mesmo projeto** que o cliente OAuth.
   - **Try signing in** abre a mesma janela do Google que seus usuários verão: faça login com a sua conta. O SecureAI confirma que a origem está autorizada e que a Google Drive API responde.

<div class="mac-window">
  ![Testes em verde no painel lateral do SecureAI](/img/files/google-drive/9%20-%20Google%20Drive.png)
</div>

4. Em **4.**, deixe ativada a opção **Show "Add from Drive" to users** e clique em **Save**.

O cartão passa a exibir **Available in the chat**.

## Etapa 7: Como os usuários utilizam

1. No chat, o usuário clica no botão de **anexar** e escolhe **Add from Drive**.

<div class="mac-window">
  ![Add from Drive no menu de anexar](/img/files/google-drive/10%20-%20Google%20Drive.png)
</div>

2. Abre-se uma janela do Google para escolher a conta e autorizar o SecureAI a ver os arquivos que ele escolher. Se o navegador bloquear pop-ups, é preciso permiti-los para o site do SecureAI.
3. Abre-se o seletor do Google Drive, com as abas Meu Drive, drives compartilhados e imagens. O usuário escolhe um ou mais arquivos e clica em **Select**.


4. Os arquivos aparecem anexados à mensagem, com o ícone do Google Drive. Ao enviá-la, eles passam pelas políticas de DLP da sua organização: se um arquivo tiver dados que uma política bloqueia (por exemplo, endereços de e-mail), a mensagem é bloqueada como com qualquer anexo.

## Solução de problemas

| O que você vê | Causa | O que fazer |
|---|---|---|
| **Test connection**: "The API key's website restrictions do not include this address" (as restrições de sites da API key não incluem este endereço) | A API key não tem o site do SecureAI | Adicione a restrição exata da etapa 1, terminada em `/*` |
| **Test connection**: "The API key's website restrictions do not include https://docs.google.com/*" (as restrições de sites da API key não incluem https://docs.google.com/*) | Falta a segunda restrição da etapa 1 | Adicione-a (etapa 5) e aguarde alguns minutos |
| **Test connection**: "The API key belongs to a different project than the OAuth client" (a API key é de um projeto diferente do cliente OAuth) | As credenciais foram criadas em projetos diferentes | Crie a API key no mesmo projeto do cliente OAuth |
| **Test connection**: "The Google Drive API is not enabled" (a Google Drive API não está ativada) | A API não foi ativada | Etapa 2 |
| A janela do Google mostra **Error 400: origin_mismatch** ou **redirect_uri_mismatch** | A origem JavaScript não está no cliente OAuth | Adicione-a (etapa 4). As alterações podem levar alguns minutos |
| A janela do Google mostra **Error 403: org_internal** | O usuário está usando uma conta de fora do seu Workspace | Ele deve fazer login com a conta da organização |
| O seletor mostra "The API developer key is invalid" | A API key não tem `https://docs.google.com/*` entre seus sites ou não permite a Google Picker API | Revise a etapa 5 e use **Test connection**; as alterações na chave levam até 5 minutos |
| O Google pede para digitar `UPDATE` ao salvar a API key ("Potential breakage due to active usage") | O teste do SecureAI consultou a Drive API com a chave | Digite `UPDATE` e confirme |
| "Your browser blocked the Google sign-in window" (o navegador bloqueou a janela de login do Google) | Os pop-ups estão bloqueados para o site | Permita-os para o endereço do SecureAI |
| A mensagem é bloqueada ao ser enviada com o arquivo anexado | Uma política de DLP detectou dados no arquivo | É o comportamento esperado; revise o incidente em **Data Protection** |
| "SecureAI did not receive access to this file" (o SecureAI não recebeu acesso a este arquivo) | O arquivo não foi escolhido no seletor | Escolha-o pela janela do Drive |
| "Its owner does not allow downloading it" (o proprietário não permite o download) | O proprietário desativou o download | Peça ao proprietário que o ative |
| O usuário não vê **Add from Drive** | A integração está desativada, sem salvar, ou o plano não a inclui | Revise o cartão em **Admin → Integrations → Files** |

## Perguntas frequentes

**Funciona com drives compartilhados?** Sim. O seletor tem uma aba para drives compartilhados; o usuário vê os drives dos quais é membro.

**Que permissões cada usuário concede ao SecureAI?** Somente `drive.file`: acesso aos arquivos que o usuário escolheu no seletor. O SecureAI não pode listar, pesquisar nem ler nenhum outro arquivo do seu Drive.

**Como desativo?** Desative **Show "Add from Drive" to users** e salve, ou clique em **Remove configuration**. Para cortar também o acesso já concedido pelos usuários, exclua o cliente OAuth no Google Cloud.

**A Hiper AI já havia configurado o Drive para mim. Preciso fazer algo?** Não. Enquanto você não salvar uma configuração própria, o cartão mostra **Configured by Hiper AI** e tudo continua funcionando igual. Se você salvar a sua, ela substitui a anterior.

**E a "conta de serviço do Google Drive" da versão anterior?** Ela não é mais usada: cada download é feito com o token do próprio usuário, o que é mais seguro, porque um usuário nunca pode anexar um arquivo que não consegue abrir.
