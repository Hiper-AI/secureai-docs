---
sidebar_position: 1
title: "Modelos Disponibles"
sidebar_label: "Modelos"
---

# Modelos

Modelos disponibles en SecureAI.

SecureAI brinda acceso a los últimos modelos de IA de los principales proveedores, brindándole las mejores herramientas para sus necesidades específicas.

Para obtener disponibilidad del modelo en tiempo real para su clave API, utilice el endpoint externo `GET /api/external/models`.

## Comparación de modelos

| Cubo | Modelos actuales |
|--------|----------------|
| Estándar | openai/gpt-oss-120b, openai/gpt-5-nano, google/gemini-3.1-flash-lite-preview, google/gemini-3-flash-preview, deepseek/deepseek-r1-distill-llama-70b, deepseek/deepseek-r1, deepseek/deepseek-v3.2, meta-llama/llama-3.3-70b-instruct, meta-llama/llama-4-maverick, meta-llama/llama-4-scout, mistralai/mistral-7b-instruct, mistralai/mistral-nemo, mistralai/ministral-14b-2512, mistralai/mistral-large-2512, x-ai/grok-3-mini, qwen/qwen3-235b-a22b-2507, qwen/qwen3-coder, qwen/qwen3-coder-next, qwen/qwen3.5-397b-a17b |
| Prémium | antrópico/claude-3.7-soneto, antrópico/claude-soneto-4.6, antrópico/claude-opus-4.6, openai/o4-mini-high, openai/o4-mini, openai/gpt-5.2, openai/gpt-5.3-codex, openai/gpt-5.1, google/gemini-3.1-pro-preview, x-ai/grok-4 |

## Tipos de cubos

### Cucharón estándar
- **Uso**: Tareas cotidianas y conversaciones generales.
- **Costo**: Más rentable para uso regular
- **Velocidad**: optimizado para respuestas más rápidas
- **Mejor para**: preguntas rápidas, tareas sencillas y trabajo rutinario

### Cubo premium
- **Uso**: razonamiento complejo y análisis avanzado
- **Costo**: mayor costo para capacidades mejoradas
- **Velocidad**: puede llevar más tiempo pero proporciona resultados superiores
- **Mejor para**: resolución de problemas complejos, análisis detallado y tareas especializadas

## Guía de selección de modelos

### Para razonamiento complejo
- **anthropic/claude-opus-4.6** - Ideal para tareas analíticas profundas
- **openai/gpt-5.2** - Fuerte razonamiento y síntesis
- **google/gemini-3.1-pro-preview** - Capacidades de razonamiento avanzadas

### Para un desarrollo rápido
- **openai/gpt-5-nano** - Respuestas rápidas para tareas sencillas
- **google/gemini-3-flash-preview** - Fuerte equilibrio entre velocidad y costos
- **x-ai/grok-3-mini** - Iteración y creación de prototipos rápidas

### Para generación de código
- **openai/gpt-5.3-codex** - Flujos de trabajo de codificación especializados
- **qwen/qwen3-coder-next** - Fuerte generación y edición de código
- **deepseek/deepseek-r1** - Análisis de código con mucho razonamiento

### Para contexto amplio
- **openai/gpt-5.1** - Tareas de análisis de contexto grande
- **anthropic/claude-sonnet-4.6** - Fuerte manejo del contexto de formato largo
- **google/gemini-3.1-pro-preview** - Análisis completo de documentos

## Capacidades del modelo

### Ventanas de contexto
- **Contexto estándar**: la mayoría de los modelos admiten entre 16.000 y 200.000 tokens
- **Contexto extendido**: algunos modelos admiten contexto ilimitado
- **Procesamiento optimizado**: los modelos están optimizados para sus casos de uso específicos

### Funciones de capacidad
- **🧠 IA estándar**: generación de texto, razonamiento, codificación
- **📊 Análisis**: Análisis e interpretación de datos
- **💻 Código**: generación y revisión de código especializado
- **🎯 Especializado**: optimizaciones específicas de tareas

## Selección automática

SecureAI incluye una función de **Selección automática** que elige automáticamente el mejor modelo para su tarea específica, optimizando para:
- **Complejidad de la tarea**: adapta las capacidades del modelo a sus necesidades
- **Velocidad de respuesta**: equilibra la velocidad con la calidad
- **Eficiencia de costos**: optimiza su presupuesto
- **Requisitos de contexto**: selecciona modelos con ventanas de contexto apropiadas

## Próximos pasos

- [Referencia de API](/api) - Aprenda a utilizar modelos a través de API
- [Inicio rápido](/quickstart) - Comience con su primer modelo
- [Descripción general de seguridad](/security/overview) - Comprender las características de seguridad del modelo