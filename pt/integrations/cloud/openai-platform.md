---
sidebar_position: 2
title: "Integração com OpenAI Platform"
sidebar_label: "OpenAI Platform"
description: "Conecte a plataforma OpenAI para que a SecureAI possa inventariar projetos, modelos, chaves, uso e custos"
---

#Plataforma OpenAI

Conecte sua organização OpenAI para que a SecureAI possa inventariar projetos, modelos, membros, chaves de API, contas de serviço, gastos e atividades de auditoria — e revelar chaves vazadas ou com privilégios excessivos para correção.

## O que o SecureAI importa

- **Projetos, modelos, membros, funções e grupos**
- **NHIs** — Chaves de API e contas de serviço (revogáveis — consulte [NHI Inventário](/pt/discovery/nhi-inventory))
- **Alertas de gastos, limites de taxas, certificados e configurações de retenção de dados**
- **Registros de auditoria**
- **Uso e custo** dos últimos 30 dias, incluindo gastos por usuário

## Pré-requisitos

- Um **proprietário da organização** (ou administrador) na plataforma OpenAI.
- Uma **chave de API de administrador** (`sk-admin-…`). As chaves de administrador são necessárias para ler projetos, membros e uso em toda a organização.

## Credenciais

| Campo | Obrigatório | Descrição |
|-------|----------|------------|
| `adminApiKey` | Sim | Chave **admin** da organização, formato `sk-admin-…`. Criptografado em repouso. |
| `projectApiKey` | Não | Uma ou mais chaves de projeto (uma por linha), necessárias apenas para inventário legado de Assistentes. |
| `organizationId` | Não | Seu `org-…` id; elimina a ambiguidade quando uma chave abrange várias organizações. |

### Onde obter a chave de administrador

1. Faça login na [Plataforma OpenAI](https://platform.openai.com/) como proprietário da organização.
2. Vá para **Configurações → Organização → Chaves de administrador**.
3. Crie uma nova chave de administrador e copie-a (mostrada uma vez).

## Conectar

1. **Administrador → Integrações → Nuvem → Plataforma OpenAI → Conectar.**
2. Cole a chave API do administrador (e os campos opcionais).
3. **Teste** e **Salve**.
4. **Sincronizar**.

## Verifique

Após a primeira sincronização, abra [Cloud Sensors](/pt/discovery/cloud-sensors) para ver modelos/assistentes descobertos e [NHI Inventory](/pt/discovery/nhi-inventory) para ver chaves e contas de serviço. **Insights** por provedor mostram uso, custo e gasto por usuário.

## Revogação

As chaves da API OpenAI são **revogáveis** do [NHI Inventário](/pt/discovery/nhi-inventory): SecureAI pode desabilitar uma chave na origem. (Para contas de serviço, as identidades OpenAI são apenas para monitores.)

## Relacionado

- [Visão geral dos provedores de IA em nuvem](/pt/integrations/cloud/overview)
- [NHI Inventário](/pt/discovery/nhi-inventory)