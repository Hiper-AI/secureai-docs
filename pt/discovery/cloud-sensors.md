---
sidebar_position: 2
title: "Sensores Cloud para IA"
sidebar_label: "Sensores Cloud"
description: "O inventário somente leitura de agentes e modelos descobertos em suas plataformas de nuvem de IA conectadas"
---

# Sensores de nuvem

**Cloud Sensors** (Admin → Agent Registry → **Cloud**) é o inventário de agentes, modelos e implantações descobertos dentro de suas plataformas de IA em nuvem conectadas — **Azure AI Foundry, AWS Bedrock, GCP Vertex AI, OpenAI Platform e Anthropic Console**. É somente leitura: você configura os conectores em [Integrações](/pt/integrations/cloud/overview) e o Cloud Sensors mostra o que encontrou.

## KPIs

| KPI | Significado |
|-----|---------|
| **Provedores Conectados** | Quantos provedores de nuvem estão configurados e conectados. |
| **Agentes Descobertos** | Total de agentes/modelos atualmente visíveis em todos os provedores. |
| **Agentes de nuvem ativos** | Agentes ainda presentes na última descoberta. |
| **Aposentado automaticamente** | Agentes removidos por uma descoberta recente (desapareceram do provedor). |

Cada KPI carrega um minigráfico de 30 dias criado a partir do histórico de sincronização.

## A tabela de inventário

| Coluna | Descrição |
|--------|------------|
| **Agente** | Nome do agente/modelo descoberto. |
| **Provedor** | Azure/AWS/GCP/OpenAI/Anthropic. |
| **Espaço de trabalho/implantação** | Onde ele mora no provedor. |
| **Modelo** | Modelo subjacente. |
| **Status** | `observed`, `active` ou `retired` (com um sufixo `· auto` quando desativado automaticamente por descoberta). |
| **Última descoberta** | Quando foi visto pela última vez. |

Filtre por provedor, status ou pesquisa de texto livre; exporte as linhas visíveis para CSV.

## Sincronizando

Execute **Sincronizar** para um único provedor ou **Sincronizar tudo**. Cada provedor também expõe uma caixa de diálogo **Insights** (uso, custo e detalhes de governança específicos desse provedor). As credenciais e a configuração do conector ficam em **Administrador → Integrações → Nuvem** — esta guia está vinculada a ele e o estado vazio aponta para lá.

## Relacionado

- [Provedores de IA em nuvem](/pt/integrations/cloud/overview) — conecte e configure os provedores.
- [NHI Inventário](/pt/discovery/nhi-inventory) — identidades descobertas pelos mesmos conectores.
- [Visão geral do inventário e descoberta de IA](/pt/discovery/overview)