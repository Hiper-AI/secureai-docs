---
sidebar_position: 1
title: "利用可能なモデル"
openapi: "GET /models"
---
# 利用可能なモデルを取得する

API キーの権限とユーザー ライセンスに基づいて、利用可能な AI モデルを取得します。

## エンドポイント

```
GET /models
```

## 説明

API キーの権限とユーザー ライセンスに基づいて、利用可能な AI モデルを取得します。

## 認証

必須: API キー

```bash
Authorization: Bearer sk-your-api-key-here
```

## パラメータ

|パラメータ |タイプ |必須 |説明 |例 |
|----------|------|----------|---------------|----------|
| `provider` |文字列 |いいえ |プロバイダーごとにモデルをフィルターする | `"openai"` |

## リクエスト

### 基本的なリクエスト

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

### プロバイダーによるフィルター

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models?provider=openai" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## 応答

### 成功の応答 (200)

```json
{
  "success": true,
  "models": [
    {
      "id": "openai/gpt-5-nano",
      "name": "openai/gpt-5-nano",
      "provider": "openai"
    },
    {
      "id": "anthropic/claude-sonnet-4.6",
      "name": "anthropic/claude-sonnet-4.6",
      "provider": "anthropic"
    }
  ],
  "user_license": "Pro",
  "restrictions": {
    "allowed_models": "all"
  },
  "filters": {
    "provider": "openai"
  }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |例 |
|----------|------|---------------|----------|
| `success` |ブール値 |リクエストが成功した場合は常に true | `true` |
| `models` |配列 |利用可能なモデルのリスト |例を参照 |
| `user_license` |文字列 |ユーザーのライセンス層 | `"Pro"` |
| `restrictions` |オブジェクト |モデルのアクセス制限 |例を参照 |
| `filters` |オブジェクト |適用されたフィルター |例を参照 |

### モデルオブジェクト

|フィールド |タイプ |説明 |例 |
|----------|------|---------------|----------|
| `id` |文字列 |一意のモデル識別子 | `"openai/gpt-5-nano"` |
| `name` |文字列 |モデル表示名 | `"openai/gpt-5-nano"` |
| `provider` |文字列 |モデルプロバイダー | `"openai"` |

### 制限対象

|フィールド |タイプ |説明 |例 |
|----------|------|---------------|----------|
| `allowed_models` |文字列 |モデルのアクセス レベル | `"all"` |

### フィルタオブジェクト

|フィールド |タイプ |説明 |例 |
|----------|------|---------------|----------|
| `provider` |文字列 |適用されたプロバイダー フィルター | `"openai"` |

## エラー応答

### 401 不正

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 429 レート制限を超えました

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Please reduce your request rate",
  "reset_time": "2024-01-15T11:00:00.000Z"
}
```

## 使用例

### JavaScript/Node.js

```javascript
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/models', {
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Available Models:', data.models);
console.log('User License:', data.user_license);
```

### パイソン

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/models', headers=headers)
data = response.json()

print('Available Models:', data['models'])
print('User License:', data['user_license'])
```

### プロバイダーによるフィルター

```python
import requests

headers = {
    'Authorization': 'Bearer sk-your-api-key-here'
}

params = {
    'provider': 'openai'
}

response = requests.get('https://{customer.name}.hiperai.ai/api/external/models', 
                      headers=headers, params=params)
data = response.json()

print('OpenAI Models:', data['models'])
```

### cURL

```bash
# Get all models
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models" \
  -H "Authorization: Bearer sk-your-api-key-here"

# Filter by provider
curl -X GET "https://{customer.name}.hiperai.ai/api/external/models?provider=openai" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## LLM バケット (現在)

チャット システムはモデルを 2 つの実行バケットに分類します。

- `standard` バケット
- `premium` バケット

この参照は、アクティブなバックエンド バケット マッピングに基づいています。

### 標準バケット

- `openai/gpt-oss-120b`
- `openai/gpt-5-nano`
- `google/gemini-3.1-flash-lite-preview`
- `google/gemini-3-flash-preview`
- `deepseek/deepseek-r1-distill-llama-70b`
- `deepseek/deepseek-r1`
- `deepseek/deepseek-v3.2`
- `meta-llama/llama-3.3-70b-instruct`
- `meta-llama/llama-4-maverick`
- `meta-llama/llama-4-scout`
- `mistralai/mistral-7b-instruct`
- `mistralai/mistral-nemo`
- `mistralai/ministral-14b-2512`
- `mistralai/mistral-large-2512`
- `x-ai/grok-3-mini`
- `qwen/qwen3-235b-a22b-2507`
- `qwen/qwen3-coder`
- `qwen/qwen3-coder-next`
- `qwen/qwen3.5-397b-a17b`

### プレミアムバケット

- `anthropic/claude-3.7-sonnet`
- `anthropic/claude-sonnet-4.6`
- `anthropic/claude-opus-4.6`
- `openai/o4-mini-high`
- `openai/o4-mini`
- `openai/gpt-5.2`
- `openai/gpt-5.3-codex`
- `openai/gpt-5.1`
- `google/gemini-3.1-pro-preview`
- `x-ai/grok-4`

## 利用可能なプロバイダー

- **OpenAI**
- **人類学**
- **Google**
- **メタ**
- **ミストラル**
- **ディープシーク**
- **xAI**
- **クウェン**

## 注意事項

- 利用可能なモデルはサブスクリプション層によって異なります
- 一部のモデルはライセンスに基づいて制限される場合があります
- プロバイダー フィルターを使用して、特定のプロバイダーからモデルを取得します
- 応答には、現在のライセンス層と制限事項が含まれます 
- API キー制限 (`allowedModels`) により、モデル リストがさらに削減される可能性があります