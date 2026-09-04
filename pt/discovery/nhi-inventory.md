---
sidebar_position: 4
title: "Inventário de NHIs (Identidades Não-Humanas)"
sidebar_label: "Inventário de NHIs"
description: "Inventariar e controlar as identidades não humanas (chaves de API e contas de serviço) por trás de seus agentes e cargas de trabalho de IA"
---

# NHI Inventário

O **NHI Inventário** (Admin → Registro do agente → **Identidades não humanas**) é o inventário das credenciais da máquina por trás de sua IA — as chaves de API, contas de serviço e chaves BYOK que agentes, servidores MCP e cargas de trabalho usam. Ele acumula identidades descobertas por cada conector de [provedor de IA em nuvem](/pt/integrations/cloud/overview), avalia seus riscos e fornece controles para bloqueá-las ou revogá-las.

## O que cada identidade mostra

- **Provedor** (SecureAI / OpenAI / Anthropic / Azure / GCP / AWS) e **tipo** (agente / mcp / carga de trabalho).
- **Pontuação de risco** (0–100) com fatores contribuintes (veja abaixo).
- Chip **SMLTP veredicto** (bloqueado/aplicado/monitorado) e contagem de recibos.
- **Usado por**, **último uso** (dias ociosos), **rotação** e uma **contagem regressiva de expiração**.
- **Status**: íntegro/correção/crítico.

## Níveis de controle

O quanto você pode *fazer* com uma identidade depende de como ela foi descoberta:

| Nível | O que significa | Ação disponível |
|-------|---------------|------------------|
| **Gerenciado** | Uma identidade emitida pela SecureAI (não na nuvem). | **Bloquear/Desbloquear** no gateway — nega ou restaura qualquer solicitação autenticada por essa identidade e envia a lista de revogação do gateway. |
| **Revogável** | Descoberto na nuvem **e** aplicável na origem. | **Revogar** — o cadeado ("candadito"): apaga/desativa a chave **no provedor**. Irreversível; marca a identidade bloqueada/crítica. |
| **Somente monitor** | Descoberto na nuvem, mas não aplicável. | Somente leitura. A dormência por si só nunca a torna crítica (ela adiciona um pequeno fator de risco exclusivo ao monitor). |

### Quais nuvens são revogáveis

| Tipo de identidade | Revogável na fonte | Somente monitor |
|---------------|---------------------|-------------|
| **Chaves de API** | OpenAI, Antrópico, GCP, Azure, AWS | — |
| **Contas de serviço/chaves BYOK** | Antrópico, GCP, Azure | OpenAI, AWS |

## Ações

| Ação | Efeito |
|--------|--------|
| **Bloquear/Desbloquear** | Solicitações de negação/restauração autenticadas pela chave SecureAI de uma identidade gerenciada (lista de revogação de gateway). |
| **Revogar** | Corte uma identidade revogável no provedor. Requer que a identidade seja executável com um ID externo; caso contrário, retornará "não revogável na fonte". |
| **Marca girada** | Registre que uma chave foi girada. |
| **Registrar/girar chave de assinatura** | Gerencie chaves de assinatura SET para a identidade. |

## Pontuação de risco

O varredor de governança calcula uma pontuação composta de 0 a 100 a partir de fatores que incluem: inativo/inativo crítico, rotação vencida/rotação crítica, expirado/expirando em breve, escopos amplos, sem proprietário, reativado e somente monitor. A reativação de uma identidade anteriormente inativa gera um alerta.

## Relacionado

- [Provedores de IA em nuvem](/pt/integrations/cloud/overview) — a fonte das identidades descobertas.
- [Sensores de Nuvem](/pt/discovery/cloud-sensors)
- [Visão geral do inventário e descoberta de IA](/pt/discovery/overview)