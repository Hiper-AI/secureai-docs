---
sidebar_position: 1
title: "型号"
---
# 型号

SecureAI 中的可用模型。

SecureAI 提供对所有主要提供商的最新 AI 模型的访问，为您提供满足您特定需求的最佳工具。

要获取 API 密钥的实时模型可用性，请使用外部端点 `GET /api/external/models`。

## 型号对比

|桶|当前型号 |
|--------|----------------|
|标准| openai/gpt-oss-120b、openai/gpt-5-nano、google/gemini-3.1-flash-lite-preview、google/gemini-3-flash-preview、deepseek/deepseek-r1-distill-llama-70b、deepseek/deepseek-r1、deepseek/deepseek-v3.2、 meta-llama/llama-3.3-70b-instruct、meta-llama/llama-4-maverick、meta-llama/llama-4-scout、mistralai/mistral-7b-instruct、mistralai/mistral-nemo、mistralai/ministral-14b-2512、mistralai/mistral-large-2512、x-ai/grok-3-mini、 qwen/qwen3-235b-a22b-2507、qwen/qwen3-coder、qwen/qwen3-coder-next、qwen/qwen3.5-397b-a17b |
|高级| anthropic/claude-3.7-sonnet、anthropic/claude-sonnet-4.6、anthropic/claude-opus-4.6、openai/o4-mini-high、openai/o4-mini、openai/gpt-5.2、openai/gpt-5.3-codex、openai/gpt-5.1、google/gemini-3.1-pro-preview、x-ai/grok-4 |

## 铲斗类型

### 标准桶
- **用法**：日常任务和一般对话
- **成本**：常规使用更具成本效益
- **速度**：优化以实现更快的响应
- **最适合**：快速提问、简单任务和日常工作

### 优质桶
- **用法**：复杂推理和高级分析
- **成本**：增强功能的成本更高
- **速度**：可能需要更长的时间，但提供卓越的结果
- **最适合**：复杂的问题解决、详细的分析和专门的任务

## 选型指南

### 对于复杂推理
- **anthropic/claude-opus-4.6** - 最适合深度分析任务
- **openai/gpt-5.2** - 强大的推理和综合
- **google/gemini-3.1-pro-preview** - 高级推理功能

### 为了快速开发
- **openai/gpt-5-nano** - 快速响应简单的任务
- **google/gemini-3-flash-preview** - 强大的速度/成本平衡
- **x-ai/grok-3-mini** - 快速迭代和原型设计

### 用于代码生成
- **openai/gpt-5.3-codex** - 专业编码工作流程
- **qwen/qwen3-coder-next** - 强大的代码生成和编辑
- **deepseek/deepseek-r1** - 推理型代码分析

### 对于大上下文
- **openai/gpt-5.1** - 大上下文分析任务
- **anthropic/claude-sonnet-4.6** - 强大的长格式上下文处理
- **google/gemini-3.1-pro-preview** - 全面的文档分析

## 模型能力

### 上下文窗口
- **标准上下文**：大多数型号支持 16k-200k 令牌
- **扩展上下文**：某些型号支持无限上下文
- **优化处理**：模型针对您的特定用例进行了优化

### 能力特点
- **🧠 标准人工智能**：文本生成、推理、编码
- **📊分析**：数据分析和解释
- **💻代码**：专门的代码生成和审查
- **🎯 专业**：特定于任务的优化

## 自动选择

SecureAI 包含 **自动选择** 功能，可自动为您的特定任务选择最佳模型，并针对以下方面进行优化：
- **任务复杂性**：将模型功能与您的需求相匹配
- **响应速度**：平衡速度与质量
- **成本效率**：优化您的预算
- **上下文要求**：选择具有适当上下文窗口的模型

## 后续步骤

- [API参考](/zh/api) - 了解如何通过API使用模型
- [快速入门](/zh/quickstart) - 开始使用您的第一个模型
- [安全概述](/zh/security/overview) - 了解模型安全特性