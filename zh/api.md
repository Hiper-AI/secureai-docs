---
sidebar_position: 5
title: "API参考"
---
# API 参考

SecureAI 外部 API 提供 AI 聊天完成功能，包括知识库检索、安全策略和全面的使用情况跟踪。此 API 专为使用 API 密钥身份验证的外部开发人员和集成而设计。

## 主要特点

- **RAG（检索增强生成）**：自动搜索知识库中的相关上下文
- **多模型支持**：OpenAI、Anthropic、Google、Meta 和其他 AI 模型
- **模型冗余和故障转移**：调用者定义的故障转移链（主要 + 后备）以及每次尝试超时
- **OpenAI 兼容端点**：将任何 OpenAI SDK 指向 `/api/external/v1` — 无需更改代码
- **图像生成**：使用 Google Gemini 2.5 Flash Image 生成和编辑图像
- **语音到语音 (S2S)**：使用 OpenAI Realtime API 和 WebRTC 进行实时语音对话
- **安全策略**：SMLTP 策略执行、每次调用 Prompt Shield 以及签署的合规收据
- **Webhooks**：安全和平台事件的签名实时交付
- **使用情况跟踪**：全面的使用情况监控、自助配额和速率限制
- **知识库集成**：访问个人和共享知识库
- **用户管理**：完整的用户、组和角色管理功能
- **审核日志记录**：全面的活动和安全审核日志

## 身份验证

所有端点（健康检查除外）都需要使用不记名令牌进行 API 密钥身份验证：

```bash
Authorization: Bearer sk-your-api-key-here
```

## 基本网址

```
https://{customer.name}.hiperai.ai/api/external
```

对于 OpenAI 兼容表面，请将 SDK 的基本 URL 指向：

```
https://{customer.name}.hiperai.ai/api/external/v1
```

## 计费和使用

默认情况下，API 请求将记入拥有 API 密钥的用户帐户。您可以通过在请求中包含 `user_id` 参数来指定要计费的不同用户。这允许：

- 具有按用户计费的多租户应用程序
- 灵活的完成限额管理
- 每个用户的“按模型使用情况”设置

## 速率限制

- **默认**：每分钟 60 个请求，每小时 1000 个请求
- **每日限制**：100 个请求（可配置）
- **每月限制**：10,000 个请求（可配置）

## 快速入门

### 1.健康检查

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/health"
```

### 2. 获取可用型号

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 3. 获取可用的知识库

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 4. 创建聊天完成

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000,
    "stream": false
  }'
```

## API 端点

###系统
- [健康检查](/zh/api/system/health) - 检查API状态

### 发现
- [获取可用模型](/zh/api/discovery/models) - 列出可用的AI模型
- [获取可用的知识库](/zh/api/discovery/indexes) - 列出可访问的知识库
- [获取安全策略](/zh/api/discovery/smltp-policies) - 列出可用的 SMLTP 策略

### 聊天
- [聊天完成](/zh/api/chat/completions) - 主要 AI 聊天端点 RAG
- [OpenAI 兼容端点](/zh/api/chat/openai-兼容) - OpenAI SDK 的插入 `/v1/chat/completions`
- [冗余和故障转移](/zh/api/redundancy) - 模型故障转移链
- [Policy Check](/zh/api/policy-check) - 试运行安全管道而不调用模型
- [使用情况](/zh/api/usage) - 自助服务配额、预算和速率限制
- [收据](/zh/api/receipts) - 获取签名的 SMLTP 合规收据

### 网络钩子
- [Webhooks 概述](/zh/api/webhooks/overview) - 签名实时事件传递
- [Webhook 事件](/zh/api/webhooks/events) - 事件目录和负载

### 图片
- [生成图像](/zh/api/images/ Generations) - 从文本生成图像或编辑现有图像
- [编辑图像](/zh/api/images/edits) - 使用文本指令进行图像到图像的编辑

### 语音/S2S
- [发起S2S WebRTC会话](/zh/api/speech/webrtc) - 建立实时语音对话
- [获取S2S时间状态](/zh/api/speech/status) - 查看剩余S2S时间配额
- [记录S2S会话时长](/zh/api/speech/log-session) - 记录会话时长并扣除时间

### 用户管理
- [获取所有用户](/zh/api/users/list) - 分页检索用户
- [创建用户](/zh/api/users/create) - 创建新用户帐户
- [更新用户](/zh/api/users/update) - 更新现有用户
- [获取许可证可用性](/zh/api/billing-modes/licenses-availability) - 检索许可证池限制和使用情况

### 指数管理
- [获取所有索引](/zh/api/indexes/list) - 检索所有知识库
- [创建索引](/zh/api/indexes/create) - 创建新的知识库
- [更新索引](/zh/api/indexes/update) - 更新现有索引
- [通过文档训练索引](/zh/api/indexes/train) - 通过上传文档训练索引
- [文档搜索索引](/zh/api/indexes/search) - 使用语义搜索来搜索文档

### 集团管理
- [获取所有组](/zh/api/groups/list) - 检索所有组
- [创建组](/zh/api/groups/create) - 创建新组
- [更新组](/zh/api/groups/update) - 更新现有组

### SMLTP 安全
- [获取所有SMLTP策略](/zh/api/smltp/policies) - 列出所有安全策略
- [获取活动策略](/zh/api/smltp/active) - 获取当前活动策略
- [创建自定义策略](/zh/api/smltp/create) - 创建自定义 SMLTP 策略
- [审核日志](/zh/api/smltp/audit-logs) - 检索 SMLTP 审核日志

### 角色管理
- [获取所有角色](/zh/api/roles/list) - 检索所有角色
- [创建角色](/zh/api/roles/create) - 创建新的自定义角色

## 错误处理

### 错误响应格式

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### 速率限制错误

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

### 常见 HTTP 状态代码

|代码|描述 |
|------|-------------|
| `200` |成功|
| `201` |创建成功 |
| `400` |错误请求 - 无效参数 |
| `401` |未经授权 - API 密钥无效 |
| `403` |禁止-权限不足|
| `404` |没有找到|
| `409` |冲突 - 资源已存在 |
| `413` |有效负载太大 - 文件大小超出 |
| `429` |超出速率限制 |
| `500` |内部服务器错误 |
| `503` |服务不可用-服务未配置|

## SDK 示例

### JavaScript/Node.js

```javascript
// Using fetch
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/gpt-5-nano',
    index: 'my-knowledge-base',
    smltp_policy: 'internal',
    prompt: 'What is the company policy on remote work?',
    temperature: 0.7,
    max_tokens: 1000
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

###Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/chat/completions"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
  "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result['choices'][0]['message']['content'])
```

### 卷曲

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
```

### 2. 获取可用型号

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 3. 获取可用的知识库

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### 4. 创建聊天完成

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000,
    "stream": false
  }'
```

## API 端点

###系统
- [健康检查](/zh/api/system/health) - 检查API状态

### 发现
- [获取可用模型](/zh/api/discovery/models) - 列出可用的AI模型
- [获取可用的知识库](/zh/api/discovery/indexes) - 列出可访问的知识库
- [获取安全策略](/zh/api/discovery/smltp-policies) - 列出可用的 SMLTP 策略

### 聊天
- [聊天完成](/zh/api/chat/completions) - 主要 AI 聊天端点 RAG
- [OpenAI 兼容端点](/zh/api/chat/openai-兼容) - OpenAI SDK 的插入 `/v1/chat/completions`
- [冗余和故障转移](/zh/api/redundancy) - 模型故障转移链
- [Policy Check](/zh/api/policy-check) - 试运行安全管道而不调用模型
- [使用情况](/zh/api/usage) - 自助服务配额、预算和速率限制
- [收据](/zh/api/receipts) - 获取签名的 SMLTP 合规收据

### 网络钩子
- [Webhooks 概述](/zh/api/webhooks/overview) - 签名实时事件传递
- [Webhook 事件](/zh/api/webhooks/events) - 事件目录和负载

### 图片
- [生成图像](/zh/api/images/ Generations) - 从文本生成图像或编辑现有图像
- [编辑图像](/zh/api/images/edits) - 使用文本指令进行图像到图像的编辑

### 语音/S2S
- [发起S2S WebRTC会话](/zh/api/speech/webrtc) - 建立实时语音对话
- [获取S2S时间状态](/zh/api/speech/status) - 查看剩余S2S时间配额
- [记录S2S会话时长](/zh/api/speech/log-session) - 记录会话时长并扣除时间

### 用户管理
- [获取所有用户](/zh/api/users/list) - 分页检索用户
- [创建用户](/zh/api/users/create) - 创建新用户帐户
- [更新用户](/zh/api/users/update) - 更新现有用户
- [获取许可证可用性](/zh/api/billing-modes/licenses-availability) - 检索许可证池限制和使用情况

### 指数管理
- [获取所有索引](/zh/api/indexes/list) - 检索所有知识库
- [创建索引](/zh/api/indexes/create) - 创建新的知识库
- [更新索引](/zh/api/indexes/update) - 更新现有索引
- [通过文档训练索引](/zh/api/indexes/train) - 通过上传文档训练索引
- [文档搜索索引](/zh/api/indexes/search) - 使用语义搜索来搜索文档

### 集团管理
- [获取所有组](/zh/api/groups/list) - 检索所有组
- [创建组](/zh/api/groups/create) - 创建新组
- [更新组](/zh/api/groups/update) - 更新现有组

### SMLTP 安全
- [获取所有SMLTP策略](/zh/api/smltp/policies) - 列出所有安全策略
- [获取活动策略](/zh/api/smltp/active) - 获取当前活动策略
- [创建自定义策略](/zh/api/smltp/create) - 创建自定义 SMLTP 策略
- [审核日志](/zh/api/smltp/audit-logs) - 检索SMLTP审核日志

### 角色管理
- [获取所有角色](/zh/api/roles/list) - 检索所有角色
- [创建角色](/zh/api/roles/create) - 创建新的自定义角色

## 错误处理

### 错误响应格式

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked",
  "request_id": "req-abc123"
}
```

### 速率限制错误

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

### 常见 HTTP 状态代码

|代码|描述 |
|------|-------------|
| `200` |成功|
| `201` |创建成功 |
| `400` |错误请求 - 无效参数 |
| `401` |未经授权 - API 密钥无效 |
| `403` |禁止-权限不足|
| `404` |没有找到|
| `409` |冲突 - 资源已存在 |
| `413` |有效负载太大 - 文件大小超出 |
| `429` |超出速率限制 |
| `500` |内部服务器错误 |
| `503` |服务不可用-服务未配置|

## SDK 示例

### JavaScript/Node.js

```javascript
// Using fetch
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/gpt-5-nano',
    index: 'my-knowledge-base',
    smltp_policy: 'internal',
    prompt: 'What is the company policy on remote work?',
    temperature: 0.7,
    max_tokens: 1000
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

###Python

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/chat/completions"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
  "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result['choices'][0]['message']['content'])
```

### 卷曲

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "index": "my-knowledge-base",
    "smltp_policy": "internal",
    "prompt": "What is the company policy on remote work?",
    "temperature": 0.7,
    "max_tokens": 1000
  }'
```

## 后续步骤

- [知识库和RAG](/zh/indexes/overview) - 了解知识库和RAG
````