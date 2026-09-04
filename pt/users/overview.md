---
sidebar_position: 1
title: "Gestão de Usuários e Acessos"
sidebar_label: "Usuários e Acessos"
---

# Gerenciamento de usuários e acesso

SecureAI fornece administração de usuários de nível empresarial, controle de acesso baseado em funções (RBAC), níveis de permissão e alocação de licenças.

---

## Funções do sistema

SecureAI inclui funções de sistema integradas para controlar o acesso à plataforma:

| Função | Nível de acesso | Descrição |
|---|---|---|
| **Administrador** | Controle total | Privilégios administrativos completos: gerenciar usuários, criar funções personalizadas, configurar políticas do SMLTP/AI Gateway, visualizar registros e configurar o SSO. |
| **Usuário** | Padrão | Acesso regular do usuário: converse com modelos de IA, crie e gerencie índices pessoais, carregue documentos. |
| **Leitor Global** | Somente leitura | Os mesmos recursos do usuário padrão, além de visibilidade somente leitura nos painéis de administração e no status do sistema. Não é possível modificar as configurações. |

### Funções personalizadas e permissões granulares
Os administradores podem criar funções personalizadas com níveis de permissão personalizados (**Nenhum**, **Leitor**, **Administrador**) em módulos específicos:
- **Gerenciamento de usuários e grupos**: criação de usuários, edição, atribuição de grupos.
- **Gerenciamento de índices**: upload de documentos, criação de índices, treinamento de índices.
- **Segurança e SMLTP**: Políticas de segurança, resposta a incidentes, verificação de auditoria.
- **Integrações e gateway de IA**: conectando provedores de nuvem, chaves de API e endpoints.

---

## Gerenciamento de licenças

As contas de usuário são provisionadas sob níveis de licença organizacional:

| Nível | Recursos incluídos |
|---|---|
| **Ultra** | Recursos completos da plataforma, índices ilimitados, taxa de transferência de modelo prioritário, políticas de conformidade SMLTP personalizadas, suporte dedicado. |
| **Crescimento** | Ferramentas de colaboração em equipe, índices de grupo, políticas de segurança padrão SMLTP, suporte padrão. |
| **Essencial** | Interface central de chat, índices pessoais, acesso ao modelo básico, suporte da comunidade. |

---

## Tarefas Administrativas Comuns

- **Crie um usuário**: Vá para **Admin ? Usuários ? Criar usuário**. Defina e-mail, função e nível de licença.
- **Atribuir a grupos**: Navegue até **Admin ? Grupos** para organizar usuários em equipes colaborativas com índices de grupo compartilhados.
- **Configurar SSO**: conecte seu provedor de identidade empresarial (Google Workspace ou Microsoft Entra ID) nas configurações de **Autenticação**.