---
sidebar_position: 1
title: "Modelos Disponíveis"
sidebar_label: "Modelos"
---

# Modelos

Modelos disponíveis no SecureAI.

SecureAI fornece acesso aos modelos de IA mais recentes de todos os principais fornecedores, oferecendo as melhores ferramentas para suas necessidades específicas.

Para obter a disponibilidade do modelo em tempo real para sua chave de API, use o endpoint externo `GET /api/external/models`.

## Comparação de modelos

| Balde | Modelos atuais |
|--------|----------------|
| Padrão | openai/gpt-oss-120b, openai/gpt-5-nano, google/gemini-3.1-flash-lite-preview, google/gemini-3-flash-preview, deepseek/deepseek-r1-distill-llama-70b, deepseek/deepseek-r1, deepseek/deepseek-v3.2, meta-llama/llama-3.3-70b-instruct, meta-llama/llama-4-maverick, meta-llama/llama-4-scout, mistralai/mistral-7b-instruct, mistralai/mistral-nemo, mistralai/ministral-14b-2512, mistralai/mistral-large-2512, x-ai/grok-3-mini, qwen/qwen3-235b-a22b-2507, qwen/qwen3-codificador, qwen/qwen3-codificador-próximo, qwen/qwen3.5-397b-a17b |
| Prémio | antrópico/claude-3.7-soneto, antrópico/claude-sonnet-4.6, antrópico/claude-opus-4.6, openai/o4-mini-high, openai/o4-mini, openai/gpt-5.2, openai/gpt-5.3-codex, openai/gpt-5.1, google/gemini-3.1-pro-preview, x-ai/grok-4 |

## Tipos de intervalo

### Balde padrão
- **Uso**: tarefas diárias e conversas gerais
- **Custo**: Mais econômico para uso regular
- **Velocidade**: Otimizado para respostas mais rápidas
- **Melhor para**: perguntas rápidas, tarefas simples e trabalho de rotina

### Balde Premium
- **Uso**: raciocínio complexo e análise avançada
- **Custo**: custo mais alto para recursos aprimorados
- **Velocidade**: pode demorar mais, mas oferece resultados superiores
- **Melhor para**: resolução de problemas complexos, análise detalhada e tarefas especializadas

## Guia de seleção de modelo

### Para raciocínio complexo
- **anthropic/claude-opus-4.6** - Melhor para tarefas analíticas profundas
- **openai/gpt-5.2** - Forte raciocínio e síntese
- **google/gemini-3.1-pro-preview** – Recursos avançados de raciocínio

### Para desenvolvimento rápido
- **openai/gpt-5-nano** - Respostas rápidas para tarefas simples
- **google/gemini-3-flash-preview** - Forte equilíbrio velocidade/custo
- **x-ai/grok-3-mini** - Iteração e prototipagem rápidas

### Para geração de código
- **openai/gpt-5.3-codex** - Fluxos de trabalho de codificação especializados
- **qwen/qwen3-coder-next** - Forte geração e edição de código
- **deepseek/deepseek-r1** - Análise de código com raciocínio pesado

### Para contexto grande
- **openai/gpt-5.1** - Tarefas de análise de grande contexto
- **anthropic/claude-sonnet-4.6** - Forte manipulação de contexto de formato longo
- **google/gemini-3.1-pro-preview** - Análise abrangente de documentos

## Capacidades do modelo

### Janelas de Contexto
- **Contexto padrão**: a maioria dos modelos suporta tokens de 16 mil a 200 mil
- **Contexto Estendido**: alguns modelos suportam contexto ilimitado
- **Processamento otimizado**: os modelos são otimizados para seus casos de uso específicos

### Recursos de capacidade
- **🧠 IA padrão**: geração de texto, raciocínio, codificação
- **📊 Análise**: Análise e interpretação de dados
- **💻 Código**: geração e revisão de código especializado
- **🎯 Especializado**: otimizações específicas de tarefas

## Seleção automática

SecureAI inclui um recurso de **Seleção automática** que escolhe automaticamente o melhor modelo para sua tarefa específica, otimizando para:
- **Complexidade da tarefa**: combina os recursos do modelo com suas necessidades
- **Velocidade de resposta**: equilibra velocidade com qualidade
- **Eficiência de custos**: otimiza seu orçamento
- **Requisitos de contexto**: seleciona modelos com janelas de contexto apropriadas

## Próximas etapas

- [Referência API](/pt/api) - Aprenda a usar modelos via API
- [Quickstart](/pt/quickstart) - Comece com seu primeiro modelo
- [Visão geral da segurança](/pt/security/overview) - Compreender os recursos de segurança do modelo