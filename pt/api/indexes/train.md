---
sidebar_position: 3
title: "Treinar Índice com Documentos"
openapi: "POST /indexes/{indexName}/train"
sidebar_label: "Treinar Índice"
---

# Treine Índice com Documentos

Treine um índice fazendo upload de documentos (arquivos) ou fornecendo entradas de texto.

## Ponto final

```
POST /indexes/{indexName}/train
```

## Descrição

Treine um índice fazendo upload de documentos (arquivos) ou fornecendo entradas de texto. Este endpoint oferece suporte a vários formatos de arquivo e pode processar até 20 arquivos de uma vez.

### Formatos de arquivo suportados

-Texto
-PDF
- DOCX
- DOC
- JSON
-CSV
- XLS
-XLSX

## Autenticação

Obrigatório: Chave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Parâmetros de caminho

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `indexName` | corda | Sim | Nome do índice a treinar |

## Corpo da solicitação

Este endpoint aceita o formato `multipart/form-data`.

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `files` | matriz de binário | Não | Arquivos de documentos para upload (até 20 arquivos de 50 MB cada) |
| `text_inputs` | corda | Não | Matriz de string JSON de entradas de texto. Cada item deverá ter: nome, tipo, conteúdo, tamanho |

### Formato de entrada de texto

Ao usar `text_inputs`, forneça uma matriz de string JSON com objetos contendo:

```json
[
  {
    "name": "doc1.txt",
    "type": "text/plain",
    "content": "Document content here",
    "size": 20
  }
]
```

## Exemplos de solicitação

### Fazer upload de arquivos (dados de formulário multipartes)

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F "files=@document1.pdf" \
  -F "files=@document2.docx" \
  -F "files=@document3.txt"
```

###JavaScript/Node.js

```javascript
const formData = new FormData();
formData.append('files', fileInput1.files[0]);
formData.append('files', fileInput2.files[0]);
formData.append('files', fileInput3.files[0]);

const response = await fetch('https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  },
  body: formData
});

const data = await response.json();
console.log('Files processed:', data.results.files_processed);
console.log('Documents indexed:', data.results.documents_indexed);
```

###Píton

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train"
headers = {
    "Authorization": "Bearer sk-your-api-key-here"
}

files = [
    ('files', open('document1.pdf', 'rb')),
    ('files', open('document2.docx', 'rb')),
    ('files', open('document3.txt', 'rb'))
]

response = requests.post(url, headers=headers, files=files)
result = response.json()
print('Files processed:', result['results']['files_processed'])
print('Documents indexed:', result['results']['documents_indexed'])
```

### Usando entradas de texto

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/train" \
  -H "Authorization: Bearer sk-your-api-key-here" \
  -F 'text_inputs=[{"name":"doc1.txt","type":"text/plain","content":"Document content here","size":20}]'
```

## Resposta

### Resposta de sucesso (200)

```json
{
  "success": true,
  "message": "Index trained successfully",
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "results": {
    "files_processed": 3,
    "documents_extracted": 3,
    "documents_indexed": 3,
    "total_vectors": 11,
    "total_chunks": 3,
    "index_name": "my-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-my-knowledge-base"
  }
}
```

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Sempre verdadeiro para solicitações bem-sucedidas |
| `message` | corda | Mensagem de sucesso |
| `request_id` | corda | Solicitar ID para rastreamento |
| `results` | objeto | Resultados do treinamento |

### Objeto de resultados

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `files_processed` | inteiro | Número de ficheiros processados ​​|
| `documents_extracted` | inteiro | Número de documentos extraídos dos ficheiros |
| `documents_indexed` | inteiro | Número de documentos indexados com êxito |
| `total_vectors` | inteiro | Número total de vetores armazenados em Pinecone |
| `total_chunks` | inteiro | Número total de blocos de texto criados |
| `index_name` | corda | Nome do índice treinado |
| `namespace` | corda | Namespace do índice |

## Respostas de erro

### 400 Solicitação incorreta

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Missing files or text_inputs"
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
  "message": "User doesn't have access to this index"
}
```

### 404 não encontrado

```json
{
  "success": false,
  "error": "Index not found",
  "message": "The specified index does not exist"
}
```

### 413 Carga útil muito grande

```json
{
  "success": false,
  "error": "File too large",
  "message": "Maximum file size is 50MB per file"
}
```

### 500 Erro interno do servidor

```json
{
  "success": false,
  "error": "Index training failed",
  "message": "Vector database unavailable or training failed"
}
```

## Notas

- Máximo de 20 arquivos por solicitação
- Máximo 50MB por arquivo
- Os arquivos podem ser carregados como multipart/form-data
- As entradas de texto podem ser fornecidas como uma matriz de string JSON
- Os documentos são automaticamente fragmentados e vetorizados para pesquisa semântica
- O índice deve existir antes do treino
- Os resultados do treinamento mostram quantos documentos foram indexados com sucesso