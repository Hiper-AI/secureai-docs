---
sidebar_position: 4
title: "Políticas e Grupos de Dispositivos"
sidebar_label: "Políticas e Grupos"
description: "Configure o que o SecureAI OS Agent impõe com políticas, grupos, predefinições de proteção e implementações seguras"
---

# Políticas e grupos

Uma **política** define o que o agente impõe; um **grupo** atribui uma política a um conjunto de dispositivos. Cada dispositivo resolve sua política efetiva a cada pulsação, de modo que as alterações se propagam rapidamente.

## Políticas

Uma política (`AgentPolicy`) contém:

| Configuração | Descrição |
|--------|-------------|
| **Modo** | `monitor` (observar apenas) ou `block` (aplicar). |
| **Conjuntos de regras** | Listas de permissão/negação para `mcps`, `apps`, `providers` e `models`. |
| **Feed de ameaças** | Se o dispositivo consome o feed de ameaças da organização. |
| **Aplicação de saída** | `off` / `kill` / `block` / `lockdown` (+ lista de permissões, bloco remoto-MCP). Consulte [Aplicação de saída](/pt/agent/egress-enforcement). |
| **Guarda de comportamento** | Supervisão comportamental de IA: habilitada, sensibilidade e ação padrão (`alert`, `quarantine`, `kill`, `block`, `require_approval`), para endpoint e/ou gateway. |
| **Roteamento do Claude Code** | Configurações de proxy transparente. Veja [Proxy Transparente](/pt/agent/transparent-proxy). |
| **Proteção contra adulteração** | Requisito de chave de desinstalação (veja abaixo). |
| **Lançamento** | Configuração de implementação gradual (consulte [Lançamentos seguros](#safe-rollouts)). |

### Predefinições de proteção

Em vez de ajustar cada botão, você pode escolher uma única predefinição de proteção que agrupa a proteção de comportamento com o modo de saída:

| Predefinido | Comportamento |
|--------|----------|
| **Passivo** | Observar e alertar; aplicação mínima. |
| **Normal** | Aplicação equilibrada. |
| **Agressivo** | Aplicação forte (por exemplo, bloqueio/quarentena, saída mais rígida). |

As combinações fora da predefinição são mostradas como **Personalizadas**.

## Grupos

Um **grupo** (`AgentGroup`) tem um `policyId` mais **regras de associação** dinâmicas — correspondentes ao sistema operacional, padrão glob do nome do host e prioridade. A política efetiva de um dispositivo é resolvida **dispositivo → grupo → política**, reavaliada a cada pulsação, portanto, mover um dispositivo entre grupos (ou editar as regras de um grupo) o redireciona automaticamente.

## Lançamentos seguros

As alterações nas políticas são enviadas por meio de um fluxo de trabalho controlado para que você possa validar antes da aplicação em toda a frota:

- **Revisões e reversão** — todas as alterações de política são versionadas; reverter para uma revisão anterior a qualquer momento.
- **Anéis de lançamento** — avance uma mudança através de anéis escalonados (pausar/retomar/avançar) em vez de todos de uma vez.
- **Simulação de simulação** — visualize o que uma política *iria* detectar ou bloquear em relação ao inventário atual, sem salvar ou impor nada.
- **Exceções** — um fluxo de trabalho de aprovação para exceções por dispositivo/por regra; aprovar um anexa uma exclusão gerenciada. A aprovação requer a função de administrador.

## Proteção contra adulteração e chave de desinstalação

Uma política pode exigir uma **chave de desinstalação** (`tamperProtection.uninstallRequiresKey`) para que o agente não possa ser removido por um usuário local sem ela. O requisito (e uma chave com hash com salt/hash offline) é entregue ao endpoint para que ele possa validar mesmo fora da rede. As tentativas de desinstalação são validadas por meio de um endpoint público de validação de token (primeiro a chave por política e depois um substituto para toda a frota); as falhas são auditadas. Consulte [Autoatualização e anti-tamper](/pt/agent/quarantine-and-fleet-ops#self-update--anti-tamper).

## Relacionado

- [Aplicação de saída](/pt/agent/egress-enforcement)
- [Quarentena e operações de frota](/pt/agent/quarantine-and-fleet-ops)
- [Proxy Transparente](/pt/agent/transparent-proxy)