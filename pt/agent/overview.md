---
sidebar_position: 1
title: "Endpoint Agent — Governança no Dispositivo"
sidebar_label: "Endpoint Agent"
description: "O SecureAI OS Agent — governança de IA de endpoint, DLP e controle de saída para laptops e servidores"
---

# Agente de terminal

O SecureAI **OS Agent** é executado em seus endpoints (laptops Windows, servidores Linux, máquinas macOS) e impõe governança de IA onde o trabalho realmente acontece. Ele descobre atividades de IA/MCP no dispositivo, aplica proteções comportamentais e contra perda de dados e pode controlar ou bloquear a saída para provedores de IA de acordo com a política.

A frota de agentes é gerenciada em **Admin → Registro de Agente → Agentes de SO**.

## O que o agente faz

- **Descobre o uso de IA no dispositivo** — SDKs/processos de IA instalados, servidores MCP e chamadas de rede sombra para provedores de IA.
- **Aplica política** — monitora ou bloqueia provedores/modelos/aplicativos de IA/MCPs, aplica supervisão comportamental de IA e impõe controle de saída (consulte [Aplicação de saída](/pt/agent/egress-enforcement)).
- **Protege dados** — inspeção de endpoint DLP/PII.
- **Responde a ameaças** — coloca em quarentena arquivos maliciosos e pode isolar um endpoint comprometido (consulte [Quarentena e operações de frota](/pt/agent/quarantine-and-fleet-ops)).
- **Opcionalmente roteia o tráfego de IA do desenvolvedor** através do gateway da SecureAI (consulte [Proxy Transparente](/pt/agent/transparent-proxy)).

## Saúde e postura do dispositivo

Cada dispositivo registrado informa um status de integridade e uma postura de segurança:

| Sinal | Valores |
|--------|--------|
| **Status** | `healthy`, `stale` (sem batimento cardíaco por aproximadamente 5 minutos), `enrolled`, `paused`, `revoked` |
| **Postura** | `protected`, `at_risk`, `infected` |
| **Pontuação de risco** | 0–100, calculado a partir de violações, ameaças e configuração |

A guia **Agentes de SO** lista cada dispositivo com seu status, postura, risco, SO/versão, grupo, política ativa e proprietário vinculado. A expansão de um dispositivo mostra observações recentes da rede sombra, inventário MCP, processos AI-SDK, violações de políticas, conexões bloqueadas, itens de quarentena, ameaças e histórico de comandos.

## Como começar

1. **[Instalar o agente](/pt/agent/installation)** em endpoints (MSI assinado no Windows; script no Linux/macOS).
2. Entenda **[pacotes de inscrição e instalação](/pt/agent/enrollment-and-packages)** — como os dispositivos se juntam e obtêm sua configuração.
3. Configure **[políticas e grupos](/pt/agent/policies-and-groups)** para decidir o que cada dispositivo impõe.
4. Ajuste **[aplicação de saída](/pt/agent/egress-enforcement)** e **[operações de quarentena e frota](/pt/agent/quarantine-and-fleet-ops)** para resposta.

## Funções

O acesso geral ao painel de administração permite visualizar e configurar a frota. **Ações destrutivas** — quarentena, processo/MCP/eliminação de rede, isolamento e revogação — exigem a função elevada de **administrador** do sistema. Consulte [Quarentena e operações de frota](/pt/agent/quarantine-and-fleet-ops).

## Relacionado

- [AI Discovery & Inventory](/pt/discovery/overview) — o agente é um dos três sinais de descoberta.
- [Defesa contra ameaças](/pt/threat-defense/overview)