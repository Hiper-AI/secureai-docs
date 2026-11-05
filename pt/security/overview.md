---
sidebar_position: 1
title: "Visão Geral de Segurança"
sidebar_label: "Visão Geral"
---

# Visão geral da segurança

Saiba mais sobre os recursos e a arquitetura de segurança do SecureAI.

## Recursos de segurança

SecureAI implementa medidas de segurança de nível empresarial para proteger seus dados e aplicativos, com SMLTP (Secure Model Language Transfer Protocol) como a base de nossa arquitetura de segurança.

### SMLTP (Protocolo de transferência de linguagem de modelo seguro)

**SMLTP** é um protocolo de segurança com um rascunho de especificação pública que torna a comunicação com
Grandes Modelos de Linguagem (LLMs) governados, contidos e demonstráveis. Ele fornece:

- **Tokens de direitos assinados**: cada solicitação governada carrega uma ligação de token assinado **Ed25519**
  identidade, modelo autorizado, hash de política e bytes de solicitação exatos (SHA-256)
- **Recibos de conformidade assinados**: cada interação roteada pelo gateway produz um recibo que pode ser
  verificado offline em relação à chave pública do gateway
- **Aplicação de políticas**: listas de permissões de modelos, verificações de residência de dados e controles de saída — no monitor
  ou modo de execução, com recibos de negação assinados
- **Registro de auditoria inviolável**: registros encadeados por hash e selados por Merkle, opcionalmente ancorados em um
  log de transparência externo (Sigstore Rekor)
- **Rotação de Chaves**: rotação de chaves de assinatura Ed25519; os recibos emitidos com chaves anteriores permanecem
  verificável
- **Criptografia de pacote**: criptografia AES-256-GCM opcional de pacotes de solicitação entre cliente e
  porta de entrada

### Proteção de Dados

- **Chaves por organização**: o SecureAI criptografa as conversas e as credenciais de conectores armazenadas no nível do campo com AES-256-GCM, com chaves exclusivas da sua organização protegidas por um serviço de gerenciamento de chaves na nuvem.
- **Criptografia em repouso**: os bancos de dados e os backups ficam em discos do Google Cloud, que o Google criptografa em repouso.
- **Criptografia em trânsito**: as conexões usam TLS 1.2 ou TLS 1.3 com suítes de cifra AEAD com sigilo direto.
- **Sua própria chave para a evidência**: se você ativar a retenção de evidência (desligada por padrão), pode criptografá-la com uma chave do seu próprio serviço de gerenciamento de chaves na AWS, Azure ou Google Cloud.

### Controle de acesso

- **Controle de acesso baseado em função (RBAC)**: permissões granulares para diferentes tipos de usuários
- **Gerenciamento de chaves de API**: autenticação segura para todas as solicitações de API
- **Limitação de Taxa**: Limitação de taxa inteligente para evitar abusos
- **Registros de auditoria**: rastreamento completo de atividades para conformidade e segurança

### Políticas de Segurança

SMLTP oferece suporte a vários modelos de política integrados:

- **Interno**: política padrão para dados internos da empresa
- **Estrito Interno**: Maior segurança para dados internos confidenciais
- **Público**: política menos restritiva para dados públicos não confidenciais
- **HIPAA, GDPR e PCI-DSS**: nomes do catálogo que aplicam os mesmos controles que Estrito Interno. Escolher um não torna o seu uso conforme a essa regulamentação. Para aplicar regras próprias de uma regulamentação, defina uma política personalizada com o mesmo nome: ela substitui a integrada na sua organização.

### Suporte à conformidade

- **Mapeamento de estruturas**: o SecureAI mapeia suas verificações a controles de estruturas como NIST AI RMF, ISO/IEC 42001 e a Lei de IA da UE. O mapeamento é parcial e ajuda a reunir evidências. Não é uma certificação.
- **Certificações**: a Hiper AI não tem hoje um relatório SOC 2 nem um certificado ISO/IEC 27001.
- **Trilha de auditoria**: registros encadeados por hash das interações com IA e das ações administrativas, para suas revisões de conformidade e segurança.
- **Aplicação de políticas**: o SecureAI aplica suas políticas de segurança a cada solicitação que passa pelo gateway.
- **Monitoramento em tempo real**: os eventos de segurança aparecem no console à medida que acontecem.

## Como SMLTP funciona

1. **Direito**: o plano de controle emite um token assinado autorizando este chamador, este modelo,
   sob esta política, para esses bytes de solicitação exatos
2. **Verificação**: o gateway SMLTP verifica o token — assinatura, expiração, correspondência de modelo, corpo
   hash, repetição e revogação – antes que a solicitação chegue a qualquer lugar
3. **Aplicação de políticas**: as regras de lista de permissões, residência e saída do modelo são avaliadas no
   porta de entrada; no modo de aplicação, uma chamada não conforme é bloqueada com um recibo de negação assinado
4. **Inspeção e atestado**: a inspeção DLP/PII é executada no caminho governado (melhor esforço,
   probabilístico), e seu veredicto é registrado no recibo assinado
5. **Registro de auditoria**: cada interação chega a uma trilha de auditoria selada por Merkle e encadeada por hash

## Benefícios

- **Provável, não apenas registrado**: recibos assinados permitem que os auditores verifiquem as interações de forma independente
- **Evidência para auditorias**: os recibos assinados e o mapeamento de estruturas dão aos seus auditores material que eles podem verificar por conta própria.
- **Contenção**: um agente que passa pelo gateway não pode exceder as permissões do seu token assinado, mesmo que esteja comprometido.
- **Revogação Determinística**: o corte de um usuário, chave ou agente entra em vigor no gateway em
  segundos – sem esperar por nenhum provedor de IA
- **Políticas**: aplicação automatizada de suas políticas de segurança

## Próximas etapas

- [SMLTP Aprofundamento](/pt/security/smltp) - Saiba mais sobre SMLTP
- [Autenticação](/pt/iam/overview) - Compreender os métodos de autenticação
- [Segurança de API](/pt/api) - Diretrizes de uso seguro de API