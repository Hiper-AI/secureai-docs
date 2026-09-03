---
sidebar_position: 1
title: "Models"
---


# Models

Available models in SecureAI.

SecureAI provides access to the latest AI models from all major providers, giving you the best tools for your specific needs.

To get real-time model availability for your API key, use the external endpoint `GET /api/external/models`.

## Model Comparison

| Bucket | Current Models |
|--------|----------------|
| Standard | openai/gpt-oss-120b, openai/gpt-5-nano, google/gemini-3.1-flash-lite-preview, google/gemini-3-flash-preview, deepseek/deepseek-r1-distill-llama-70b, deepseek/deepseek-r1, deepseek/deepseek-v3.2, meta-llama/llama-3.3-70b-instruct, meta-llama/llama-4-maverick, meta-llama/llama-4-scout, mistralai/mistral-7b-instruct, mistralai/mistral-nemo, mistralai/ministral-14b-2512, mistralai/mistral-large-2512, x-ai/grok-3-mini, qwen/qwen3-235b-a22b-2507, qwen/qwen3-coder, qwen/qwen3-coder-next, qwen/qwen3.5-397b-a17b |
| Premium | anthropic/claude-3.7-sonnet, anthropic/claude-sonnet-4.6, anthropic/claude-opus-4.6, openai/o4-mini-high, openai/o4-mini, openai/gpt-5.2, openai/gpt-5.3-codex, openai/gpt-5.1, google/gemini-3.1-pro-preview, x-ai/grok-4 |

## Bucket Types

### Standard Bucket
- **Usage**: Everyday tasks and general conversations
- **Cost**: More cost-effective for regular use
- **Speed**: Optimized for faster responses
- **Best For**: Quick questions, simple tasks, and routine work

### Premium Bucket
- **Usage**: Complex reasoning and advanced analysis
- **Cost**: Higher cost for enhanced capabilities
- **Speed**: May take longer but provides superior results
- **Best For**: Complex problem-solving, detailed analysis, and specialized tasks

## Model Selection Guide

### For Complex Reasoning
- **anthropic/claude-opus-4.6** - Best for deep analytical tasks
- **openai/gpt-5.2** - Strong reasoning and synthesis
- **google/gemini-3.1-pro-preview** - Advanced reasoning capabilities

### For Fast Development
- **openai/gpt-5-nano** - Quick responses for straightforward tasks
- **google/gemini-3-flash-preview** - Strong speed/cost balance
- **x-ai/grok-3-mini** - Fast iteration and prototyping

### For Code Generation
- **openai/gpt-5.3-codex** - Specialized coding workflows
- **qwen/qwen3-coder-next** - Strong code generation and edits
- **deepseek/deepseek-r1** - Reasoning-heavy code analysis

### For Large Context
- **openai/gpt-5.1** - Large-context analysis tasks
- **anthropic/claude-sonnet-4.6** - Strong long-form context handling
- **google/gemini-3.1-pro-preview** - Comprehensive document analysis

## Model Capabilities

### Context Windows
- **Standard Context**: Most models support 16k-200k tokens
- **Extended Context**: Some models support unlimited context
- **Optimized Processing**: Models are optimized for your specific use cases

### Capability Features
- **🧠 Standard AI**: Text generation, reasoning, coding
- **📊 Analysis**: Data analysis and interpretation
- **💻 Code**: Specialized code generation and review
- **🎯 Specialized**: Task-specific optimizations

## Auto-Selection

SecureAI includes an **Auto-Select** feature that automatically chooses the best model for your specific task, optimizing for:
- **Task Complexity**: Matches model capabilities to your needs
- **Response Speed**: Balances speed with quality
- **Cost Efficiency**: Optimizes for your budget
- **Context Requirements**: Selects models with appropriate context windows

## Next Steps

- [API Reference](/zh/api) - Learn how to use models via API
- [Quickstart](/zh/quickstart) - Get started with your first model
- [Security Overview](/zh/security/overview) - Understand model security features 
