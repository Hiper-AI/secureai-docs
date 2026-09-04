---
sidebar_position: 1
title: "Bases de Conhecimento e RAG"
sidebar_label: "Bases de Conhecimento & RAG"
---

# Bases de conhecimento e sistema RAG

SecureAI usa **Retrieval-Augmented Generation (RAG)** para conectar modelos de IA com seus dados e documentos privados, garantindo respostas seguras, precisas e conscientes do contexto.

---

## O que é RAG?

**Retrieval-Augmented Generation (RAG)** é uma técnica de IA que combina modelos de linguagem com fontes de conhecimento externas. Em vez de confiar apenas nos dados pré-treinados do modelo:

1. **Processamento de consulta**: o sistema analisa a solicitação do usuário para identificar requisitos de conhecimento relevantes.
2. **Recuperação de conhecimento**: a pesquisa semântica recupera partes relevantes do documento do seu índice.
3. **Aumento de contexto**: o contexto recuperado é injetado no prompt do modelo.
4. **Geração de Resposta**: A IA gera uma resposta factual e fundamentada citando seus documentos.

---

## Tipos de índice em SecureAI

Os índices são bases de conhecimento estruturadas categorizadas por acessibilidade:

| Tipo de índice | Escopo | Acesso e privacidade | Melhor para |
|---|---|---|---|
| **Índices Pessoais** | Usuário individual | Criptografado de ponta a ponta; armazenamento de conhecimento zero (mesmo os administradores não conseguem ler o conteúdo) | Notas pessoais, pesquisas privadas, documentos de projetos individuais |
| **Índices de grupo** | Equipes/Departamentos | Acesso baseado em função controlado por associação ao grupo | Wikis do departamento, documentação do projeto da equipe, SOPs compartilhados |
| **Índices globais** | Em toda a organização | Acesso de leitura para todos os usuários da empresa | Políticas da empresa, diretrizes de RH, manuais para toda a empresa |

### 1. Índices pessoais
- **Privacidade de conhecimento zero**: seus arquivos e conversas são criptografados com chaves de locatário/usuário.
- **Criação**: 
  - **Usuários**: abra a interface de bate-papo, clique no seletor de índice ao lado do seletor de modelo, alterne para a guia *Pessoal* e clique em **+**.
  - **Administradores**: Vá para **Administrador? Gerenciamento de índice? Crie um índice** e atribua-o a um usuário específico.

### 2. Índices de grupo
- **Colaboração**: vários membros da equipe podem consultar e contribuir com documentos para a mesma base de conhecimento.
- **Criação**:
  - Vá para **Administrador? Gerenciamento de grupo? Crie um grupo**, atribua membros e vincule um índice de grupo compartilhado.

### 3. Índices Globais
- **Padrões para toda a empresa**: repositórios centralizados para conformidade empresarial, termos legais e diretrizes operacionais.
- **Criação**: Vá para **Admin ? Gerenciamento de índice? Crie Índice** e defina o escopo como **Global**.

---

## Como funciona a indexação

Ao fazer upload de arquivos (PDFs, documentos do Word, CSV, JSON, Markdown ou texto simples):

`
Documento bruto -?  Extração de texto -?  Segmentação semântica -?  Incorporações de vetores -?  Armazenamento vetorial (índice)
`

1. **Processamento de documentos**: Texto e metadados (carimbos de data e hora, nomes de arquivos) são extraídos e limpos.
2. **Chunking**: o conteúdo é dividido em blocos semânticos otimizados com sobreposição para manter a continuidade contextual.
3. **Geração de incorporação**: os pedaços são convertidos em incorporações vetoriais de alta dimensão.
4. **Armazenamento vetorial**: os embeddings são armazenados em bancos de dados vetoriais de alto desempenho para recuperação instantânea de similaridade.

---

## Melhores práticas

- **Nomeação**: use nomes claros e descritivos para índices e arquivos carregados (por exemplo, HR-Policy-2026 em vez de doc1).
- **Preparação de arquivo**: certifique-se de que os documentos carregados sejam em texto não criptografado; limpe digitalizações de baixa qualidade antes de fazer upload.
- **Limites de arquivos**: uploads padrão suportam arquivos de até 10 MB por lote.
- **Escopo Adequadamente**: Mantenha notas pessoais confidenciais em Índices Pessoais; mover recursos da equipe para índices de grupo.