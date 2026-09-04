---
sidebar_position: 2
title: "Google Workspace (SSO)"
sidebar_label: "Google Workspace (SSO)"
---

# Integração com o Google Workspace (SSO)

Este guia orientará você no processo de configuração do Google Workspace para login único (SSO) com SecureAI. Você aprenderá como obter as credenciais necessárias do Console do Google Cloud e enviá-las para concluir a integração.

## Pré-requisitos

- Acesso de administrador ao Console do Google Cloud
- Uma conta do Google Workspace para sua organização
- Acesso ao Admin Console do Google Workspace da sua organização (se estiver usando restrições de domínio)
- Acesso de administrador ao SecureAI

## Etapa 1: Crie um projeto no Console do Google Cloud

1. Faça login no [Console do Google Cloud](https://console.cloud.google.com)
2. Clique no menu suspenso do projeto na parte superior da página
3. Clique em **Novo Projeto**

<div class="mac-window">
  ![Novo projeto](/img/google%20sso%20images/google%20-%201.png)
</div>

4. Insira um nome de projeto (por exemplo, "SecureAI SSO")
5. Clique em **Criar**

<div class="mac-window">
  ![Criar projeto](/img/google%20sso%20images/google%20-%202.png)
</div>

## Etapa 2: ativar a API do Google+ (se necessário)

1. No seu projeto, vá para **APIs e serviços** > **Biblioteca**
2. Pesquise "API do Google+" ou "Identidade do Google"
3. Clique nele e clique em **Ativar** (se ainda não estiver ativado)
4. **Observação**: o Google OAuth moderno pode não exigir isso, mas ativá-lo garante compatibilidade

## Etapa 3: Configurar a tela de consentimento do OAuth

1. Vá para **APIs e serviços** > **Tela de consentimento do OAuth**

<div class="mac-window">
  ![Tela de consentimento do OAuth](/img/google%20sso%20images/google%20-%203.png)
</div>

2. Preencha as informações necessárias:
   - **Nome do aplicativo**: insira um nome (por exemplo, "SecureAI")
   - **E-mail de suporte ao usuário**: selecione um endereço de e-mail de suporte
   - **Informações de contato**: adicione um endereço de e-mail de contato

3. Escolha **Tipo de usuário**:
   - **Interno**: somente para usuários da sua organização do Google Workspace (recomendado para uso empresarial)
   - **Externo**: para usuários fora da sua organização

4. Clique em **Criar**

<div class="mac-window">
  ![Criar consentimento OAuth](/img/google%20sso%20images/google%20-%204.png)
</div>

5. **Marca**:
   - Vá para a seção **Branding** no menu esquerdo
   - Encontre **Domínios autorizados** e adicione o domínio da sua empresa
   - Isso permite que os usuários façam login com o endereço de e-mail da empresa
   - (Além disso, você pode adicionar o URL da sua página inicial, política de privacidade e termos de serviço, se desejar)

<div class="mac-window">
  ![Domínios autorizados](/img/google%20sso%20images/google%20-%205.png)
</div>

6. **Escopos**:
   - No menu esquerdo, clique na seção **Acesso a dados**
   - Na seção Acesso a dados, clique em **Adicionar ou remover escopos**
   - Uma janela será aberta no lado esquerdo onde você pode procurar funções
   - Procure a função **"openid"** e selecione-a
   - Clique em **Atualizar**
   - Em seguida, clique em **Salvar** na seção Acesso a dados
   - **Nota**: O escopo `openid` inclui automaticamente o acesso `profile` e `email` - você não precisa adicioná-los separadamente
   - Se você vir outras opções de escopo, precisará apenas do **OpenID** para SecureAI SSO

<div class="mac-window">
  ![Seleção de escopo OpenID](/img/google%20sso%20images/google%20-%206.png)
</div>

   - **Importante**: o escopo OpenID fornece acesso a:
     - Endereço de e-mail do usuário
     - Informações básicas do perfil
     - Isso é tudo o que é necessário para autenticação SecureAI

7. **Usuários de teste** (se estiver usando externo):
   - Adicione usuários de teste, se necessário, durante o teste
   - Clique em **Salvar e continuar**

8. **Resumo**:
   - Revise sua configuração
   - Clique em **Voltar ao painel**

## Etapa 4: Criar credenciais OAuth 2.0

1. Acesse **APIs e serviços** > **Credenciais**
2. Clique em **+ Criar credenciais** > **ID do cliente OAuth**

<div class="mac-window">
  ![Criar ID do cliente OAuth](/img/google%20sso%20images/google%20-%207.png)
</div>
3. **Tipo de aplicativo**: Selecione **Aplicativo Web**
4. **Nome**: Insira um nome descritivo (por exemplo, "SecureAI SSO Cliente")
5. **URIs de redirecionamento autorizados**: Clique em **+ Adicionar URI** e digite:
   - `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`
   - **Importante**: O URL deve corresponder exatamente (incluindo `https://` e `/api/auth/google/callback`)

<div class="mac-window">
  ![URIs de redirecionamento autorizados](/img/google%20sso%20images/google%20-%208.png)
</div>

6. Clique em **Criar**

## Etapa 5: Obtenha suas credenciais

Depois de criar o cliente OAuth:

1. Um pop-up aparecerá com suas credenciais

<div class="mac-window">
  ![Pop-up de credenciais OAuth](/img/google%20sso%20images/google%20-%209.png)
</div>
2. **ID do cliente**:
   - Parece: `123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com`
   - **Copie este valor** - você precisará dele mais tarde
3. **Segredo do cliente**:
   - Parece: `GOCSPX-abcdefghijklmnopqrstuvwxyz`
   - **Copie este valor imediatamente**
   - **AVISO**: Este segredo só é mostrado uma vez no pop-up. Se você perdê-lo, precisará criar um novo cliente OAuth

## Etapa 6: Enviar variáveis para a equipe do Hiper AI

Depois de criar o cliente OAuth no Console do Google Cloud e seguir as etapas acima, você terá obtido as seguintes informações críticas:

1. **ID do cliente** (da Etapa 5)
2. **Segredo do cliente** (da Etapa 5)
3. **URI de redirecionamento**: `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`

Você deve enviar esses valores para a equipe do Hiper AI para concluir a integração do SSO.

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

   - **Assunto**: Insira **"Integração do Google Workspace SSO"**
   - **Descrição**: Cole os valores que você copiou durante o processo de configuração:
     - ID do cliente
     - Segredo do cliente
     - URI de redirecionamento: `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`
4. Clique no botão **"Enviar solicitação"**

### C. Aguarde a confirmação

- Você receberá um e-mail de confirmação dentro de **24 a 72 horas** (dependendo da disponibilidade)
- O e-mail confirmará que seu SSO foi configurado com sucesso
- Depois de configurado, você poderá acessar sua instância do SecureAI usando o botão de login **"Continuar com o Google"** na página de login

**Importante**: mantenha suas credenciais seguras até que a integração seja concluída. Não os compartilhe por meio de canais inseguros.

## Configuração do usuário

### Usuários existentes

Os usuários que já possuem contas no SecureAI (independentemente de usarem autenticação básica) **não precisam ser recriados**. Eles poderão continuar usando as contas existentes e também poderão fazer login usando o Google Workspace SSO depois de configurado.

**Importante**: o e-mail do usuário no Google Workspace deve corresponder exatamente ao e-mail no SecureAI para que SSO funcione.

### Criando novos usuários SSO

Para novos usuários que devem acessar SecureAI exclusivamente através de SSO:

1. Navegue até **Gerenciamento de usuários** no painel de administração do SecureAI
2. Clique para criar um novo usuário
3. Ao criar o usuário, selecione a opção **"Conta Empresarial / SSO"**
4. Esta configuração garante que:
   - O novo usuário **não receberá email** para geração de senha
   - O usuário poderá acessar o SecureAI **diretamente usando o botão de login do Google Workspace SSO**
   - O e-mail do usuário no Google Workspace deve corresponder exatamente ao e-mail inserido no SecureAI

## Solução de problemas

### Erro: "redirect_uri_mismatch"

- Verifique se o URI de redirecionamento no Console do Google Cloud corresponde exatamente ao que está configurado no servidor
- Certifique-se de incluir `https://` (não `http://` na produção)
- O URI de redirecionamento deve ser exatamente: `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`
- Verifique se há barras ou erros de digitação

### Erro: "Usuário não encontrado no banco de dados SecureAI"

- O usuário deve estar previamente cadastrado no SecureAI
- Entre em contato com o administrador do SecureAI para criar a conta de usuário
- Verifique se o endereço de e-mail no Google Workspace corresponde exatamente ao e-mail no SecureAI

### Erro: "Domínio de e-mail não permitido para login no Google Workspace"

- O domínio de e-mail do usuário não está na lista de domínios permitidos
- Entre em contato com sua equipe de desenvolvimento para adicionar seu domínio à lista de permitidos
- Ou verifique se a configuração de restrição de domínio está correta

### Erro: "access_denied" ou "unauthorized_client"

- Verifique se a tela de consentimento do OAuth está configurada corretamente
- Verifique se sua inscrição foi aprovada (se estiver usando o tipo de usuário externo)
- Certifique-se de que o ID do cliente e o segredo do cliente estejam corretos

### Erro: "cliente_inválido"

- O segredo do cliente pode ter sido redefinido ou está incorreto
- Verifique o segredo do cliente no Google Cloud Console
- Crie um novo segredo do cliente, se necessário, e forneça o novo valor à sua equipe de desenvolvimento

## Práticas recomendadas de segurança de segredo do cliente

1. **Nunca envie segredos para repositórios de código**
2. **Alterne os segredos periodicamente** (recomendado: a cada 90 dias)
3. **Limitar o acesso** à página de credenciais do Console do Google Cloud
4. **Use canais seguros** ao compartilhar segredos com sua equipe de desenvolvimento
5. **Monitore o uso** no Console do Google Cloud em busca de atividades suspeitas

## Renovação do segredo do cliente

Para alternar seu segredo do cliente (recomendado a cada 90 dias):

1. Acesse **APIs e serviços** > **Credenciais**
2. Encontre seu ID de cliente OAuth 2.0
3. Clique no **ícone de lápis** (Editar)
4. Na seção **Segredo do cliente**, clique em **Redefinir segredo**
5. **Copie imediatamente** o novo valor secreto
6. Forneça o novo segredo à sua equipe de desenvolvimento por meio da solicitação de suporte do painel de administração
7. Eles atualizarão a configuração sem interromper o serviço
8. Depois de confirmar que o novo segredo funciona, você pode opcionalmente excluir o antigo segredo

**Observação**: Há um breve período de sobreposição durante a rotação em que ambos os segredos funcionam, permitindo uma transição suave.

## Testando SSO Login

Após a conclusão da configuração:

1. Vá para sua página de login do SecureAI
2. Clique em **Continuar com o Google**
3. Selecione sua conta do Google Workspace
4. Conceda permissões se solicitado
5. Você deve ser redirecionado para SecureAI e conectado

Se você encontrar problemas:
- Limpe os cookies do seu navegador e tente novamente
- Verifique se você está usando a conta correta do Google Workspace
- Verifique se o seu e-mail existe no SecureAI

## Suporte

Se você encontrar problemas durante a configuração:

1. Verifique se você tem permissões de administrador no Console do Google Cloud
2. Verifique se você tem acesso de administrador do Google Workspace (se forem usadas restrições de domínio)
3. Entre em contato com sua equipe de desenvolvimento por meio da solicitação de suporte do painel de administração com:
   - Capturas de tela dos erros
   - O ID do cliente (você pode compartilhá-lo - não é confidencial)
   - A mensagem de erro completa
   - Quaisquer erros relevantes no console do navegador

**Nunca compartilhe seu segredo do cliente em solicitações de suporte** – compartilhe-o apenas por meio de canais seguros após estabelecer a verificação de identidade.

## Recursos Adicionais

- [Documentação do Console do Google Cloud](https://cloud.google.com/docs)
- [Documentação do Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Ajuda do administrador do Google Workspace](https://support.google.com/a)