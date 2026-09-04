---
sidebar_position: 6
title: "Operações de Quarentena e Gestão de Frota"
sidebar_label: "Quarentena e Frota"
description: "Responda a ameaças de endpoint — quarentena, restauração, isolamento, incidentes e operações em toda a frota"
---

# Quarentena e operações de frota

Além da fiscalização, a frota de agentes possui uma camada de resposta e operações: quarentena e restauração, isolamento de endpoint, sala de guerra de incidentes, cofre de quarentena, ajuste de ameaças e painel de frota.

## Comandos e funções do dispositivo

Comandos de dispositivos destrutivos exigem a função elevada **admin** do sistema (mais restrita que o acesso geral ao painel de administração):

| Comando | Efeito |
|--------|--------|
| `quarantine` | Move e criptografa um arquivo malicioso e elimina sua árvore de processos. **Destrutivo.** |
| `kill_process` / `kill_mcp` / `kill_network` | Encerre um processo, um servidor MCP ou uma conexão de rede. |
| `isolate` / `unisolate` | Corte o endpoint da rede/restaure-o. |
| `revoke` | Revogar o dispositivo (ele não pode mais registrar ou ligar para casa). |

`restore` (recuperar um arquivo em quarentena) é uma ação de recuperação e está disponível para qualquer operador administrativo. O agente confirma os resultados da quarentena/restauração no back-end.

## Cofre de quarentena

Os itens em quarentena são retidos em um **cofre** com um período de retenção configurável (**30 dias** por padrão). No cofre, você pode filtrar por máquina, gravidade, estado restaurado/revisado, marcar itens como revisados ​​e **restaurar** itens em massa.

## Ajuste de ameaças

A **fila de revisão** coleta arquivos em quarentena e eliminações automáticas de políticas recentes aguardando revisão humana de falsos positivos, cada linha contendo a política resolvida do dispositivo para que você possa ajustar a regra correta. A partir de um incidente, você pode **colocar na lista de bloqueios** ou **colocar na lista de permissões** uma detecção, globalmente no catálogo da organização ou com escopo definido para uma política.

## Incidentes (Sala de Guerra)

Os incidentes de endpoint são triados na War Room como runbooks. As ações no nível do dispositivo incluem **ack-clear** (limpar violações registradas, recalcular a postura e fechar os runbooks de ameaças relacionados) e lista de bloqueio/lista de permissões de ameaças.

## Painel da frota

O painel resume toda a frota: cobertura, contagens on-line/obsoletas por sistema operacional, distribuição de postura, risco médio, facetas de incidentes ativos, mapa de calor por dispositivo, cronograma de ameaças por dia, principais ameaças e principais riscos.

## Autoatualização e anti-adulteração

- **Autoatualização** — o agente se atualiza por meio de um comando `update` mais um manifesto de lançamento assinado (versão + soma de verificação + assinatura); a versão mais recente pode ser sincronizada automaticamente com a frota.
- **Chave anti-adulteração/desinstalação** — uma [política](/pt/agent/policies-and-groups#tamper-protection--uninstall-key) pode exigir uma chave de desinstalação para que o agente não possa ser removido silenciosamente. A validação funciona mesmo fora da rede (um salt/hash offline é transportado para o endpoint), com uma chave para toda a frota como substituto; tentativas malsucedidas de desinstalação são auditadas.

## Relacionado

- [Políticas e Grupos](/pt/agent/policies-and-groups)
- [Aplicação de saída](/pt/agent/egress-enforcement)
- [Defesa contra ameaças](/pt/threat-defense/overview)