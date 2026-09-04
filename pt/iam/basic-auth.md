---
sidebar_position: 4
title: "Autenticação Básica (Usuário e Senha)"
sidebar_label: "Autenticação Básica"
---

# Autenticação Básica

A autenticação básica fornece um método simples de autenticação de nome de usuário e senha para SecureAI. Os usuários se autenticam em nosso banco de dados usando suas credenciais, com suporte opcional de autenticação multifator.

## O que é autenticação básica?

**Autenticação básica** é um método de autenticação simples que usa credenciais de nome de usuário e senha para autenticar usuários em nosso banco de dados. É o método de autenticação mais simples disponível no SecureAI.

## Principais recursos

### **Login simples**
- **Nome de usuário e senha**: os usuários fornecem suas credenciais para fazer login
- **Autenticação de banco de dados**: as credenciais são verificadas em nosso banco de dados
- **Armazenamento seguro**: as senhas são criptografadas e armazenadas com segurança

### **Autenticação multifator (MFA)**
- **Google Authenticator**: os usuários podem registrar seu aplicativo Google Authenticator
- **Microsoft Authenticator**: suporte para aplicativo Microsoft Authenticator
- **Configuração do código QR**: Processo de inscrição fácil com códigos QR
- **Códigos de backup**: códigos de recuperação para acesso à conta

### **Configuração OTP de e-mail**
- **OTP de email padrão**: OTP de email é ativado por padrão como segundo fator
- **Desativação por usuário**: os administradores podem desativar a OTP de e-mail para usuários específicos
- **Alternativa MFA**: os usuários podem mudar de OTP de e-mail para aplicativos autenticadores

## Como funciona

### **Fluxo de autenticação**
1. **Login do usuário**: o usuário insere nome de usuário e senha
2. **Verificação de credenciais**: o sistema verifica as credenciais no banco de dados
3. **Segundo Fator**: Email OTP enviado ou código do aplicativo MFA necessário
4. **Acesso concedido**: o usuário obtém acesso à plataforma SecureAI

### **Comportamento do segundo fator**
- **Antes da configuração do MFA**: OTP de e-mail é sempre necessário como segundo fator
- **Após a configuração do MFA**: o usuário pode escolher entre e-mail OTP ou código MFA
- **Opções de login**: o usuário seleciona o método de segundo fator preferido durante o login
- **Fallback**: Email OTP permanece disponível como opção de backup

## Experiência do usuário

### **Primeiro login (antes da MFA)**
- Digite nome de usuário e senha
- Receba email OTP como segundo fator
- Acesse a plataforma SecureAI

### **Processo de configuração de MFA**
1. **Navegar para Chat**: Vá para "/chat-ai/new-chat" ou qualquer página de chat
2. **Abrir menu de perfil**: Clique na imagem do perfil no canto superior direito
3. **Configurações de acesso**: selecione "Configurações" no menu suspenso
4. **Vá para Segurança**: Clique na aba "Segurança"
5. **Ativar MFA**: Clique em "Ativar autenticação multifator"
6. **Leitura do código QR**: use o Google ou Microsoft Authenticator para ler o código QR
7. **Insira o código**: Insira o código de 6 dígitos do seu aplicativo autenticador
8. **Salvar códigos de backup**: armazene os códigos de backup gerados com segurança

### **Login após configuração do MFA**
- Digite nome de usuário e senha
- Escolha o método do segundo fator:
  - **E-mail OTP**: Receba o código por e-mail
  - **Código MFA**: Insira o código do aplicativo autenticador
- Acesse a plataforma SecureAI

### **Uso de código de backup**
- Use códigos de backup se o aplicativo autenticador não estiver disponível
- Cada código de backup só pode ser usado uma vez
- Gere novos códigos de backup, se necessário

## Recursos de segurança

### **Segurança de senha**
- **Hashing forte**: as senhas são criptografadas com segurança
- **Armazenamento de banco de dados**: Credenciais armazenadas em nosso banco de dados
- **Transmissão segura**: todos os dados de autenticação criptografados

### **Segurança MFA**
- **Códigos baseados em tempo**: aplicativos autenticadores geram códigos baseados em tempo
- **Inscrição segura**: configuração segura baseada em código QR
- **Recuperação de backup**: códigos de backup para recuperação de conta

### **Gerenciamento de sessão**
- **Sessões seguras**: gerenciamento de sessões criptografadas
- **Proteção de tempo limite**: tempo limite automático da sessão
- **Controle de sessão simultânea**: gerencie várias sessões ativas

## Primeiros passos

1. **Ativar autenticação básica**: configurar no painel de administração
2. **Criar contas de usuário**: configure credenciais de usuário
3. **Configurar MFA**: ativar autenticação multifator
4. **Treinamento de usuários**: instrua os usuários sobre o processo de login
5. **Monitore o uso**: rastreie padrões de autenticação

## Próximas etapas

- [Google Workspace](/pt/iam/google-workspace) - Integrar com o Google Workspace
- [Microsoft Entra ID](/pt/iam/microsoft-entra-id) - Conecte-se com o Microsoft Entra ID
- [IAM Visão geral](/pt/iam/overview) - Aprenda sobre gerenciamento de identidade