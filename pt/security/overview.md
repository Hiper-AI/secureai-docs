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

- **Postura de conhecimento zero**: chaves gerenciadas pelo cliente (BYOK), processamento efêmero na memória e
  o registro local de implantação mantém os dados confidenciais sob seu controle
- **Criptografia em repouso**: todos os dados armazenados são criptografados usando algoritmos padrão do setor
- **Criptografia em trânsito**: criptografia TLS 1.3 para todas as comunicações API
- **Chaves gerenciadas pelo cliente**: você controla suas chaves de criptografia

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
- **HIPAA**: Em conformidade com os regulamentos de dados de saúde
- **GDPR**: Em conformidade com os regulamentos europeus de proteção de dados
**PCI-DSS**: compatível com os padrões da indústria de cartões de pagamento

### Conformidade e Certificações

**Enterprise Ready**: projetado para requisitos de segurança empresarial
- **Trilha de auditoria**: registro completo para auditorias de conformidade e segurança
- **Aplicação de políticas**: aplicação automatizada de políticas de segurança
- **Monitoramento em tempo real**: monitoramento contínuo de eventos de segurança

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
- **Compliance Ready**: suporte integrado para as principais estruturas de conformidade
- **Contenção**: mesmo um agente comprometido não pode exceder suas permissões assinadas criptograficamente
- **Revogação Determinística**: o corte de um usuário, chave ou agente entra em vigor no gateway em
  segundos – sem esperar por nenhum provedor de IA
- **Políticas**: aplicação automatizada de suas políticas de segurança

## Próximas etapas

- [SMLTP Aprofundamento](/pt/security/smltp) - Saiba mais sobre SMLTP
- [Autenticação](/pt/iam/overview) - Compreender os métodos de autenticação
- [Segurança de API](/pt/api) - Diretrizes de uso seguro de API