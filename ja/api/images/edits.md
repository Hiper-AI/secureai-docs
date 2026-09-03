---
sidebar_position: 2
title: "画像の編集"
openapi: "POST /images/edits"
---
# 画像の編集

Google Gemini 2.5 Flash Image とテキスト指示を使用して、既存の画像を編集します。

## エンドポイント

```
POST /images/edits
```

## 説明

Google Gemini 2.5 Flash Image とテキスト指示を使用して、既存の画像を編集します。このエンドポイントは、**画像間の編集**用に特別に設計されています。

- 画像ファイルは **必須** (オプションである `/images/generations` とは異なります)
- 画像の編集または変換方法を説明するテキスト プロンプト
- 編集された画像は同じ品質と形式のオプションで返されます

すべてのプロンプトと応答は、監査ログとコンプライアンスのために SMLTP を通じて自動的に処理されます。

## 認証

必須: API キー

```bash
Authorization: Bearer sk-your-api-key-here
```

## リクエスト本文

このエンドポイントは `multipart/form-data` 形式を受け入れます。

### パラメータ

|パラメータ |タイプ |必須 |説明 |
|----------|------|----------|---------------|
| `prompt` |文字列 |はい |アップロードされた画像を編集または変換する方法を説明するテキスト手順 (1 ～ 4000 文字) |
| `image` |バイナリ |はい |編集する画像ファイル (JPEG、PNG、WEBP、または GIF、最大 10MB) |
| `smltp_policy` |文字列 |いいえ | SMLTP セキュリティ ポリシー (デフォルト: "内部") |
| `response_format` |文字列 |いいえ |応答形式: "url" または "b64_json" (デフォルト: "url") |

## リクエストの例

### cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/images/edits" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F "prompt=Add dramatic sunset colors to the sky and enhance the overall atmosphere" \
  -F "image=@/path/to/image.jpg" \
  -F "smltp_policy=internal" \
  -F "response_format=url"
```

### JavaScript/Node.js

```javascript
const formData = new FormData();
formData.append('prompt', 'Add dramatic sunset colors to the sky and enhance the overall atmosphere');
formData.append('image', fileInput.files[0]);
formData.append('smltp_policy', 'internal');
formData.append('response_format', 'url');

const response = await fetch('https://{customer.name}.hiperai.ai/api/external/images/edits', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  },
  body: formData
});

const data = await response.json();
console.log('Edited image URL:', data.data[0].url);
```

### パイソン

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/images/edits"
headers = {
    "Authorization": "Bearer sk-your-api-key-here"
}

with open('image.jpg', 'rb') as f:
    files = {'image': f}
    data = {
        'prompt': 'Add dramatic sunset colors to the sky and enhance the overall atmosphere',
        'smltp_policy': 'internal',
        'response_format': 'url'
    }
    response = requests.post(url, headers=headers, files=files, data=data)
    result = response.json()
    print('Edited image URL:', result['data'][0]['url'])
```

## 応答

### 成功の応答 (200)

```json
{
  "success": true,
  "id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806",
  "object": "image.edit",
  "created": 1705312200,
  "data": [
    {
      "url": "http://localhost:5173/uploads/secureai_image_api_edit_68c5c6d2d57c85b102eb05e2_f55bb4aa_0.png",
      "revised_prompt": "Add dramatic sunset colors to the sky and enhance the overall atmosphere"
    }
  ],
  "metadata": {
    "model": "google/gemini-2.5-flash-image-preview",
    "provider": "Google",
    "total_images": 1,
    "is_image_to_image": true,
    "text_response": null,
    "smltp_trace_id": "trx-6caec994-73af-4f2c-9e13-572d53262f2a",
    "smltp_bundle_id": "jti-26464307-d455-4a3d-9ca4-8ec144cb601c",
    "smltp_policy": "internal"
  }
}
```

### 応答フィールド

|フィールド |タイプ |説明 |
|------|------|---------------|
| `success` |ブール値 |リクエストが成功した場合は常に true |
| `id` |文字列 |一意のリクエスト識別子 |
| `object` |文字列 |オブジェクトタイプ: "image.edit" |
| `created` |整数 |画像が編集されたときの Unix タイムスタンプ |
| `data` |配列 |編集された画像の配列 |
| `metadata` |オブジェクト | SMLTP 追跡を含む追加のメタデータ |

### 画像オブジェクト

|フィールド |タイプ |説明 |
|------|------|---------------|
| `url` |文字列 |編集画像にアクセスするためのURL（response_formatが「url」の場合） |
| `b64_json` |文字列 | Base64でエンコードされた画像データ（response_formatが「b64_json」の場合）
| `revised_prompt` |文字列 |実際に編集に使用されるプロンプト (入力とは異なる場合があります) |

### メタデータ オブジェクト

|フィールド |タイプ |説明 |
|------|------|---------------|
| `model` |文字列 |使用したモデル: "google/gemini-2.5-flash-image-preview" |
| `provider` |文字列 |プロバイダー: 「Google」 |
| `total_images` |整数 |画像の総数 (編集の場合は常に 1) |
| `is_image_to_image` |ブール値 |このエンドポイントでは常に true |
| `text_response` |文字列\|null |モデルからのオプションのテキスト応答 |
| `smltp_trace_id` |文字列 |監査追跡用の SMLTP トレース ID |
| `smltp_bundle_id` |文字列 |監査追跡用の SMLTP バンドル ID |
| `smltp_policy` |文字列 |適用された SMLTP ポリシー |

## エラー応答

### 400 不正なリクエスト

```json
{
  "success": false,
  "error": "Missing image",
  "message": "An image file is required for image-to-image editing",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
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
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
}
```

### 500 内部サーバーエラー

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Image editing failed"
}
```

### 503 サービスは利用できません

```json
{
  "success": false,
  "error": "Service unavailable",
  "message": "Image generation service is not configured",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
}
```

## 注意事項

- サポートされている画像形式: JPEG、PNG、WEBP、GIF
- 最大ファイルサイズ: 画像あたり 10MB
- このエンドポイントにはイメージ ファイルが **必須** (`/images/generations` とは異なります)
- プロンプトには、アップロードされた画像を編集または変換する方法が説明されています
- セキュリティとコンプライアンスのために、すべてのリクエストは SMLTP を通じて処理されます
- URL の代わりに `response_format: "b64_json"` を使用して、base64 でエンコードされた画像データを受信します