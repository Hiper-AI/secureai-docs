---
sidebar_position: 4
title: "Busca Semântica no Índice"
openapi: "GET /indexes/{indexName}/search"
sidebar_label: "Buscar no Índice"
---

# Índice de pesquisa de documentos

Pesquise documentos em um índice usando pesquisa semântica.

## Ponto final

```
GET /indexes/{indexName}/search
```

## Descrição

Pesquise documentos em um índice usando pesquisa semântica. Retorna documentos correspondentes com pontuações de relevância, classificados por relevância.

## Autenticação

Obrigatório: Chave API

```bash
Authorization: Bearer sk-your-api-key-here
```

## Parâmetros de caminho

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `indexName` | corda | Sim | Nome do índice a pesquisar |

## Parâmetros de consulta

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|------------|
| `query` | corda | Sim | Texto da consulta de pesquisa |
| `top_k` | inteiro | Não | Número máximo de resultados a devolver (1-50, predefinição: 10) |
| `min_score` | flutuar | Não | Limite mínimo de pontuação de relevância (0,0-1,0, padrão: 0,0) |

## Exemplo de solicitação

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/search?query=What%20is%20machine%20learning?&top_k=10&min_score=0.5" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

###JavaScript/Node.js

```javascript
const query = encodeURIComponent('What is machine learning?');
const response = await fetch(`https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/search?query=${query}&top_k=10&min_score=0.5`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sk-your-api-key-here'
  }
});

const data = await response.json();
console.log('Total matches:', data.results.total);
data.results.matches.forEach(match => {
  console.log(`Rank ${match.rank}: ${match.content.substring(0, 100)}... (score: ${match.score})`);
});
```

###Píton

```python
import requests

url = "https://{customer.name}.hiperai.ai/api/external/indexes/my-knowledge-base/search"
headers = {
    "Authorization": "Bearer sk-your-api-key-here"
}
params = {
    "query": "What is machine learning?",
    "top_k": 10,
    "min_score": 0.5
}

response = requests.get(url, headers=headers, params=params)
result = response.json()
print('Total matches:', result['results']['total'])
for match in result['results']['matches']:
    print(f"Rank {match['rank']}: {match['content'][:100]}... (score: {match['score']})")
```

## Resposta

### Resposta de sucesso (200)

```json
{
  "success": true,
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "query": "What is machine learning?",
  "results": {
    "matches": [
      {
        "rank": 1,
        "score": 0.85,
        "source": "training",
        "content": "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed...",
        "metadata": {
          "page": 1,
          "chunkIndex": 0,
          "title": "Introduction to ML",
          "documentId": "60a7c8f5e8b4f5001f7a8c26"
        }
      },
      {
        "rank": 2,
        "score": 0.78,
        "source": "training",
        "content": "Machine learning algorithms build mathematical models based on training data to make predictions or decisions...",
        "metadata": {
          "page": 2,
          "chunkIndex": 1,
          "title": "Introduction to ML",
          "documentId": "60a7c8f5e8b4f5001f7a8c26"
        }
      }
    ],
    "total": 5,
    "top_k": 10
  },
  "index": {
    "name": "my-knowledge-base",
    "namespace": "user-60a7c8f5e8b4f5001f7a8c24-index-my-knowledge-base"
  }
}
```

### Campos de resposta

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `success` | booleano | Sempre verdadeiro para solicitações bem-sucedidas |
| `request_id` | corda | Solicitar ID para rastreamento |
| `query` | corda | A consulta de pesquisa usada |
| `results` | objeto | Resultados da pesquisa |
| `index` | objeto | Informações do índice |

### Objeto de resultados

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `matches` | matriz | Matriz de documentos correspondentes, classificados por relevância |
| `total` | inteiro | Número total de correspondências encontradas |
| `top_k` | inteiro | Valor top_k solicitado |

### Corresponder objeto

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `rank` | inteiro | Classificação do resultado (com base em 1) |
| `score` | flutuar | Pontuação de relevância (0,0-1,0, quanto maior, mais relevante) |
| `source` | corda | Identificador da origem do documento |
| `content` | corda | Visualização do conteúdo (truncado para 500 caracteres) |
| `metadata` | objeto | Metadados adicionais |

### Objeto de metadados

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `page` | inteiro\|nulo | Número da página (se for PDF) |
| `chunkIndex` | inteiro\|nulo | Índice de pedaços no documento |
| `title` | string\|nulo | Título do documento |
| `documentId` | string\|nulo | ID do documento |

## Respostas de erro

### 400 Solicitação incorreta

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Missing or invalid query parameter"
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

### 500 Erro interno do servidor

```json
{
  "success": false,
  "error": "Search failed",
  "message": "An error occurred during search"
}
```

## Notas

- A pesquisa semântica usa similaridade vetorial para encontrar documentos relevantes
- Os resultados são classificados por pontuação de relevância (o mais alto primeiro)
- Use `min_score` para filtrar resultados de baixa relevância
- As visualizações de conteúdo são truncadas para 500 caracteres
- O parâmetro `top_k` limita o número de resultados retornados
- Os metadados incluem informações sobre a origem e localização do documento