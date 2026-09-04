---
sidebar_position: 1
title: "Descoberta de IA e Shadow AI"
sidebar_label: "Visão Geral"
description: "Como a SecureAI descobre e inventaria cada agente, modelo, identidade e fonte de IA sombra em sua organização"
---

# Descoberta e inventário de IA

SecureAI cria um inventário único e continuamente atualizado da IA em sua organização – os agentes e modelos que você executa, as identidades por trás deles e a IA sombra que você não conhecia. Isso é feito a partir de **três sinais de descoberta complementares**, todos exibidos em **Admin → Registro do agente**.

## Os três sinais

| Sinal | Vê | Alimentado por |
|----|------|--------|
| **APIs de nuvem** | Agentes, modelos, implantações e identidades dentro de suas plataformas de IA. | Conectores [Provedor de IA em nuvem](/pt/integrations/cloud/overview) → [Sensores de nuvem](/pt/discovery/cloud-sensors) |
| **Rede / CASB** | IPs de origem corporativos chamando APIs LLM, sem nenhum agente instalado. | Conectores [CASB / SWG](/pt/integrations/casb/overview) → [Fontes de rede](/pt/discovery/network-sources) |
| **Agente de endpoint** | Atividade de AI/MCP em laptops e servidores gerenciados. | [Agente SO](/pt/agent/overview) |

As identidades descobertas em todos os sinais são acumuladas no [NHI Inventário](/pt/discovery/nhi-inventory), e os agentes/chatbots lógicos que você controla ficam no [Registro de Agente](/pt/discovery/agent-registry).

## As guias de inventário

Em **Administrador → Registro do agente** você encontrará:

- **[Cloud Sensors](/pt/discovery/cloud-sensors)** — agentes e modelos descobertos na nuvem.
- **[Fontes de rede](/pt/discovery/network-sources)** — fontes shadow-AI encontradas em logs CASB/SWG.
- **[NHI Inventário](/pt/discovery/nhi-inventory)** — identidades não humanas (chaves, contas de serviço) com controles de bloqueio/revogação.
- **[Registro de Agente](/pt/discovery/agent-registry)** — metadados de governança para seus agentes lógicos de IA e chatbots.

## Por que é importante

Você não pode governar o que não pode ver. O Discovery fornece o denominador: cada endpoint do modelo, cada chave, cada dispositivo ou carga de trabalho que toca a IA — portanto, a política, o controle de custos e a resposta a incidentes se aplicam a todo o seu patrimônio, não apenas às partes que foram declaradas.

## Relacionado

- [Provedores de IA em nuvem](/pt/integrations/cloud/overview)
- [CASB & Rede (SWG)](/pt/integrations/casb/overview)
- [Agente Endpoint](/pt/agent/overview)