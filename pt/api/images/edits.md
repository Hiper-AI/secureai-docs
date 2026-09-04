---
sidebar_position: 2
title: "Edição de Imagens"
openapi: "POST /images/edits"
sidebar_label: "Editar Imagens"
---

# Editar imagens

Edite imagens existentes usando a imagem Flash do Google Gemini 2.5 com instruções de texto.

## Ponto final

```
POST /images/edits
```

## Descrição

Edite imagens existentes usando a imagem Flash do Google Gemini 2.5 com instruções de texto. Este endpoint foi projetado especificamente para **edição imagem a imagem** onde:

- Um arquivo de imagem é **obrigatório** (ao contrário de `/images/generations` onde é opcional)
- Um prompt de texto descreve como editar ou transformar a imagem
- A imagem editada é retornada com as mesmas opções de qualidade e formato

Todos os prompts e respostas são processados automaticamente por meio do SMLTP para registro de auditoria e conformidade.

## Autenticação

Obrigatório: Chave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Corpo da solicitação

Este endpoint aceita o formato `multipart/form-data`.

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `prompt` | corda | Sim | Instruções de texto que descrevem como editar ou transformar a imagem carregada (1-4000 caracteres) |
| `image` | binário | Sim | Arquivo de imagem para editar (JPEG, PNG, WEBP ou GIF, máximo de 10 MB) |
| `smltp_policy` | corda | Não | Política de segurança SMLTP (padrão: "interno") |
| `response_format` | corda | Não | Formato de resposta: "url" ou "b64_json" (padrão: "url") |

## Exemplos de solicitação

###cURL

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/images/edits" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F "prompt=Add dramatic sunset colors to the sky and enhance the overall atmosphere" \
  -F "image=@/path/to/image.jpg" \
  -F "smltp_policy=internal" \
  -F "response_format=url"
```

###JavaScript/Node.js

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

###Píton

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

## Resposta

### Resposta de sucesso (200)

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

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Sempre verdadeiro para solicitações bem-sucedidas |
| `id` | corda | Identificador único do pedido |
| `object` | corda | Tipo de objeto: "image.edit" |
| `created` | inteiro | Carimbo de data e hora Unix de quando a imagem foi editada |
| `data` | matriz | Matriz de imagens editadas |
| `metadata` | objeto | Metadados adicionais, incluindo rastreamento SMLTP |

### Objeto de imagem

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `url` | corda | URL para acessar a imagem editada (quando response_format for "url") |
| `b64_json` | corda | Dados de imagem codificados em Base64 (quando response_format é "b64_json") |
| `revised_prompt` | corda | O prompt realmente usado para edição (pode ser diferente da entrada) |

### Objeto de metadados

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `model` | corda | Modelo usado: "google/gemini-2.5-flash-image-preview" |
| `provider` | corda | Provedor: "Google" |
| `total_images` | inteiro | Número total de imagens (sempre 1 para edições) |
| `is_image_to_image` | booleano | Sempre verdadeiro para este endpoint |
| `text_response` | string\|nulo | Resposta de texto opcional do modelo |
| `smltp_trace_id` | corda | SMLTP ID de rastreamento para rastreamento de auditoria |
| `smltp_bundle_id` | corda | ID do pacote SMLTP para rastreamento de auditoria |
| `smltp_policy` | corda | Política SMLTP que foi aplicada |

## Respostas de erro

### 400 Solicitação incorreta

```json
{
  "success": false,
  "error": "Missing image",
  "message": "An image file is required for image-to-image editing",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
}
```

### 401 Não autorizado

```json
{
  "success": false,
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

### 403 Proibido

```json
{
  "success": false,
  "error": "Access denied",
  "message": "SMLTP policy not allowed"
}
```

### 413 Carga útil muito grande

```json
{
  "success": false,
  "error": "File too large",
  "message": "Maximum image size is 10MB",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
}
```

### 500 Erro interno do servidor

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Image editing failed"
}
```

### 503 Serviço indisponível

```json
{
  "success": false,
  "error": "Service unavailable",
  "message": "Image generation service is not configured",
  "request_id": "f55bb4aa-ad9a-4b5a-9c94-511bf6fce806"
}
```

## Notas

- Formatos de imagem suportados: JPEG, PNG, WEBP, GIF
- Tamanho máximo do arquivo: 10 MB por imagem
- O arquivo de imagem é **obrigatório** para este endpoint (diferentemente de `/images/generations`)
- O prompt descreve como editar ou transformar a imagem enviada
- Todas as solicitações são processadas através de SMLTP para segurança e conformidade
- Use `response_format: "b64_json"` para receber dados de imagem codificados em base64 em vez de URLs