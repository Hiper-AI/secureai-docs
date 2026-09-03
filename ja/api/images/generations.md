---
sidebar_position: 1
title: "画像の生成"
openapi: "POST /images/generations"
---
# 画像を生成する

テキスト プロンプトから新しい画像を生成するか、Google Gemini 2.5 Flash Image を使用して既存の画像を変換します。

## エンドポイント

```
POST /images/generations
```

## 説明

テキストの説明から新しい画像を生成するか、既存の画像を変換します。このエンドポイントは以下をサポートします。

- **Text-to-Image**: テキストの説明から画像を生成します
- **画像から画像**: 既存の画像を変換または編集します (画像ファイルをアップロードします)

すべてのプロンプトと応答は、監査ログとコンプライアンスのために SMLTP を通じて自動的に処理されます。

## 認証

必須: API キー

```bash
Authorization: Bearer sk-your-api-key-here
```

## リクエスト本文

このエンドポイントは、`multipart/form-data` (ファイルのアップロード用) と `application/json` の両方の形式を受け入れます。

### パラメータ

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `prompt` |文字列 |はい |生成する画像、またはアップロードした画像の変換方法を説明するテキスト プロンプト (1 ～ 4000 文字) |
| `image` |バイナリ |いいえ |画像から画像を生成するための画像ファイル (JPEG、PNG、WEBP、または GIF、最大 10MB) |
| `smltp_policy` |文字列 |いいえ | SMLTP セキュリティ ポリシー (デフォルト: "内部") |
| `response_format` |文字列 |いいえ |応答形式: "url" または "b64_json" (デフォルト: "url") |
| `size` |文字列 |いいえ |画像サイズ (デフォルト: "1024x1024") |
| `n` |整数 |いいえ |生成する画像の数 (1 ～ 4、デフォルト: 1) |

## リクエストの例

### テキストから画像への変換 (JSON)

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/images/generations" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over the ocean with mountains in the background, digital art style",
    "smltp_policy": "internal",
    "response_format": "url",
    "n": 1
  }'
```

### 画像から画像 (マルチパート フォーム データ)

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/images/generations" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F "prompt=Add dramatic sunset colors to the sky" \
  -F "image=@/path/to/image.jpg" \
  -F "smltp_policy=internal" \
  -F "response_format=url"
```

### JavaScript/Node.js

```javascript
// Text-to-Image
const response = await fetch('https://{customer.name}.hiperai.ai/api/external/images/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'A beautiful sunset over the ocean with mountains in the background, digital art style',
    smltp_policy: 'internal',
    response_format: 'url',
    n: 1
  })
});

const data = await response.json();
console.log('Generated image URL:', data.data[0].url);

// Image-to-Image
const formData = new FormData();
formData.append('prompt', 'Add dramatic sunset colors to the sky');
formData.append('image', fileInput.files[0]);
formData.append('smltp_policy', 'internal');
formData.append('response_format', 'url');

const response2 = await fetch('https://{customer.name}.hiperai.ai/api/external/images/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  },
  body: formData
});

const data2 = await response2.json();
console.log('Edited image URL:', data2.data[0].url);
```

### パイソン

```python
import requests

# Text-to-Image
url = "https://{customer.name}.hiperai.ai/api/external/images/generations"
headers = {
    "Authorization": "Bearer sk-your-api-key-here",
    "Content-Type": "application/json"
}
data = {
    "prompt": "A beautiful sunset over the ocean with mountains in the background, digital art style",
    "smltp_policy": "internal",
    "response_format": "url",
    "n": 1
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print('Generated image URL:', result['data'][0]['url'])

# Image-to-Image
with open('image.jpg', 'rb') as f:
    files = {'image': f}
    data = {
        'prompt': 'Add dramatic sunset colors to the sky',
        'smltp_policy': 'internal',
        'response_format': 'url'
    }
    response = requests.post(url, headers={'Authorization': 'Bearer sk-your-api-key-here'}, files=files, data=data)
    result = response.json()
    print('Edited image URL:', result['data'][0]['url'])
```

## 応答

### 成功の応答 (200)

```json
{
  "success": true,
  "id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3",
  "object": "image.generation",
  "created": 1705312200,
  "data": [
    {
      "url": "http://localhost:5173/uploads/secureai_image_api_68c5c6d2d57c85b102eb05e2_90d3756f_0.png",
      "revised_prompt": "A beautiful sunset over the ocean with mountains in the background, digital art style"
    }
  ],
  "metadata": {
    "model": "google/gemini-2.5-flash-image-preview",
    "provider": "Google",
    "total_images": 1,
    "is_image_to_image": false,
    "text_response": null,
    "smltp_trace_id": "trx-220eca66-5e3a-4a72-886b-e6ba8cde18a6",
    "smltp_bundle_id": "jti-bb850e61-fbfe-412a-8b0d-d180d4a36d22",
    "smltp_policy": "internal"
  }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |リクエストが成功した場合は常に true |
| `id` |文字列 |一意のリクエスト識別子 |
| `object` |文字列 |オブジェクトタイプ: "image.generation" |
| `created` |整数 |イメージが作成されたときの Unix タイムスタンプ |
| `data` |配列 |生成された画像の配列 |
| `metadata` |オブジェクト | SMLTP 追跡を含む追加のメタデータ |

### 画像オブジェクト

|フィールド |タイプ |説明 |
|------|------|---------------|
| `url` |文字列 |生成された画像にアクセスするための URL (response_format が "url" の場合) |
| `b64_json` |文字列 | Base64でエンコードされた画像データ（response_formatが「b64_json」の場合）
| `revised_prompt` |文字列 |実際に生成に使用されるプロンプト (入力とは異なる場合があります) |

### メタデータ オブジェクト

|フィールド |タイプ |説明 |
|------|------|---------------|
| `model` |文字列 |使用したモデル: "google/gemini-2.5-flash-image-preview" |
| `provider` |文字列 |プロバイダー: 「Google」 |
| `total_images` |整数 |生成された画像の総数 |
| `is_image_to_image` |ブール値 |これがイメージ間の生成かどうか |
| `text_response` |文字列\|null |モデルからのオプションのテキスト応答 |
| `smltp_trace_id` |文字列 |監査追跡用の SMLTP トレース ID |
| `smltp_bundle_id` |文字列 |監査追跡用の SMLTP バンドル ID |
| `smltp_policy` |文字列 |適用された SMLTP ポリシー |

## エラー応答

### 400 不正なリクエスト

```json
{
  "success": false,
  "error": "Invalid prompt",
  "message": "Prompt is required and must be a non-empty string",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

### 401 不正

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 禁止

```json
{
  "success": false,
  "error": "Access denied",
  "message": "SMLTP policy not allowed"
}
```

### 413 ペイロードが大きすぎます

```json
{
  "success": false,
  "error": "File too large",
  "message": "Maximum image size is 10MB",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

### 500 内部サーバーエラー

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Image generation failed"
}
```

### 503 サービスは利用できません

```json
{
  "success": false,
  "error": "Service unavailable",
  "message": "Image generation service is not configured",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

## 注意事項

- アップロードでサポートされている画像形式: JPEG、PNG、WEBP、GIF
- 最大ファイルサイズ: 画像あたり 10MB
- 画像をアップロードするときに、画像を変換する方法について説明するプロンプトが表示されます
- Gemini は通常、リクエストごとに 1 ～ 4 つのイメージを生成します
- セキュリティとコンプライアンスのために、すべてのリクエストは SMLTP を通じて処理されます
- URL の代わりに `response_format: "b64_json"` を使用して、base64 でエンコードされた画像データを受信します