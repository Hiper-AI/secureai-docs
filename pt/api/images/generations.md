---
sidebar_position: 1
title: "Geração de Imagens"
openapi: "POST /images/generations"
sidebar_label: "Gerar Imagens"
---

# Gerar imagens

Gere novas imagens a partir de prompts de texto ou transforme imagens existentes usando o Google Gemini 2.5 Flash Image.

## Ponto final

```
POST /images/generations
```

## Descrição

Gere novas imagens a partir de descrições de texto ou transforme imagens existentes. Este ponto de extremidade suporta:

- **Text-to-Image**: Gere imagens a partir de descrições de texto
- **Image-to-Image**: Transforme ou edite imagens existentes (faça upload de um arquivo de imagem)

Todos os prompts e respostas são processados automaticamente por meio do SMLTP para registro de auditoria e conformidade.

## Autenticação

Obrigatório: Chave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Corpo da solicitação

Este endpoint aceita os formatos `multipart/form-data` (para uploads de arquivos) e `application/json`.

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `prompt` | corda | Sim | Prompt de texto descrevendo a imagem a ser gerada ou como transformar a imagem enviada (1-4000 caracteres) |
| `image` | binário | Não | Arquivo de imagem para geração de imagem para imagem (JPEG, PNG, WEBP ou GIF, máximo de 10 MB) |
| `smltp_policy` | corda | Não | Política de segurança SMLTP (padrão: "interno") |
| `response_format` | corda | Não | Formato de resposta: "url" ou "b64_json" (padrão: "url") |
| `size` | corda | Não | Tamanho da imagem (padrão: "1024x1024") |
| `n` | inteiro | Não | Número de imagens a serem geradas (1-4, padrão: 1) |

## Exemplos de solicitação

### Texto para imagem (JSON)

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

### Imagem para imagem (dados de formulário multipartes)

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/images/generations" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F "prompt=Add dramatic sunset colors to the sky" \
  -F "image=@/path/to/image.jpg" \
  -F "smltp_policy=internal" \
  -F "response_format=url"
```

###JavaScript/Node.js

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

###Píton

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

## Resposta

### Resposta de sucesso (200)

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

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Sempre verdadeiro para solicitações bem-sucedidas |
| `id` | corda | Identificador único do pedido |
| `object` | corda | Tipo de objeto: "image.generação" |
| `created` | inteiro | Carimbo de data e hora Unix de quando as imagens foram criadas |
| `data` | matriz | Matriz de imagens geradas |
| `metadata` | objeto | Metadados adicionais, incluindo rastreamento SMLTP |

### Objeto de imagem

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `url` | corda | URL para acessar a imagem gerada (quando response_format for "url") |
| `b64_json` | corda | Dados de imagem codificados em Base64 (quando response_format é "b64_json") |
| `revised_prompt` | corda | O prompt realmente usado para geração (pode ser diferente da entrada) |

### Objeto de metadados

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `model` | corda | Modelo usado: "google/gemini-2.5-flash-image-preview" |
| `provider` | corda | Provedor: "Google" |
| `total_images` | inteiro | Número total de imagens geradas |
| `is_image_to_image` | booleano | Se esta foi uma geração imagem a imagem |
| `text_response` | string\|nulo | Resposta de texto opcional do modelo |
| `smltp_trace_id` | corda | SMLTP ID de rastreamento para rastreamento de auditoria |
| `smltp_bundle_id` | corda | ID do pacote SMLTP para rastreamento de auditoria |
| `smltp_policy` | corda | Política SMLTP que foi aplicada |

## Respostas de erro

### 400 Solicitação incorreta

```json
{
  "success": false,
  "error": "Invalid prompt",
  "message": "Prompt is required and must be a non-empty string",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
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
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

### 500 Erro interno do servidor

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Image generation failed"
}
```

### 503 Serviço indisponível

```json
{
  "success": false,
  "error": "Service unavailable",
  "message": "Image generation service is not configured",
  "request_id": "90d3756f-41c3-4f86-a18d-e257bfbc33a3"
}
```

## Notas

- Formatos de imagem suportados para upload: JPEG, PNG, WEBP, GIF
- Tamanho máximo do arquivo: 10 MB por imagem
- Ao fazer upload de uma imagem, o prompt descreve como transformá-la
- Gemini normalmente gera de 1 a 4 imagens por solicitação
- Todas as solicitações são processadas através de SMLTP para segurança e conformidade
- Use `response_format: "b64_json"` para receber dados de imagem codificados em base64 em vez de URLs