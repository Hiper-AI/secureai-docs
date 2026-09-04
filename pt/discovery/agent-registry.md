---
sidebar_position: 5
title: "Registro de Agentes e Modelos Locais"
sidebar_label: "Registro de Agentes"
description: "Controle seus agentes lógicos de IA e chatbots — proprietários, finalidade, nível de autonomia, risco e vínculos"
---

# Registro de Agente

O **Registro de Agentes** (Administrador → Registro de Agentes → **Agentes de IA**) é o inventário de governança de seus agentes e chatbots de IA **lógicos** — os aplicativos e assistentes que sua organização cria e executa. Ele registra os metadados necessários para governar cada um: quem é o proprietário, para que serve, quão autônomo é e a que está conectado.

<Info>
**Não é a frota de endpoints**

O Agent Registry é sobre agentes de IA *lógicos* (um chatbot de suporte, um copiloto interno). É diferente da frota de **OS Agents**: o software SecureAI instalado em endpoints, documentado em [Endpoint Agent](/pt/agent/overview).
</Info>

## O que é registrado por agente

| Campo | Descrição |
|-------|------------|
| **Proprietário** | O usuário/equipe responsável. |
| **Objetivo** | O que o agente faz. |
| **Autonomia** | Nível **L1–L3**, de assistencial a totalmente autônomo. |
| **Risco** | Classificação de risco de governança. |
| **Encadernações** | Servidores MCP conectados e conjuntos de dados/bases de conhecimento. |
| **Monitoramento** | Para chatbots, a configuração de monitoramento/Prompt-Shield. |

## Trabalhando com o registro

- **Importar** agentes para inicializar o inventário.
- Revise **relacionamentos** entre agentes, suas ferramentas e seus dados.
- **Aplicar autonomia sugerida** — aceite um nível de autonomia recomendado para um agente.
- Cadastrar chatbots para monitoramento; um chatbot visto pela primeira vez por meio da [API Prompt Shield](/pt/api/threat-defense/prompt-shield) é registrado automaticamente aqui como `observed` para sua análise.

## Relacionado

- [Endpoint Agent](/pt/agent/overview) — a frota de agentes no nível do sistema operacional (diferente desta).
- [NHI Inventário](/pt/discovery/nhi-inventory) — as identidades com as quais os agentes se autenticam.
- [API Prompt Shield](/pt/api/threat-defense/prompt-shield) — registra automaticamente chatbots.
- [Visão geral do inventário e descoberta de IA](/pt/discovery/overview)