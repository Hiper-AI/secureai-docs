---
sidebar_position: 1
title: Knowledge Bases & RAG
---

# Knowledge Bases & RAG System

SecureAI uses **Retrieval-Augmented Generation (RAG)** to connect AI models with your private data and documents, ensuring secure, accurate, and context-aware responses.

---

## What is RAG?

**Retrieval-Augmented Generation (RAG)** is an AI technique that combines language models with external knowledge sources. Instead of relying solely on the model's pre-trained data:

1. **Query Processing**: The system analyzes the user prompt to identify relevant knowledge requirements.
2. **Knowledge Retrieval**: Semantic search retrieves relevant document chunks from your index.
3. **Context Augmentation**: Retrieved context is injected into the model prompt.
4. **Response Generation**: The AI generates a factual, grounded response citing your documents.

---

## Index Types in SecureAI

Indexes are structured knowledge bases categorized by accessibility:

| Index Type | Scope | Access & Privacy | Best For |
|---|---|---|---|
| **Personal Indexes** | Individual user | End-to-end encrypted; zero-knowledge storage (even admins cannot read contents) | Personal notes, private research, individual project documents |
| **Group Indexes** | Teams / Departments | Role-based access controlled by group membership | Department wikis, team project documentation, shared SOPs |
| **Global Indexes** | Organization-wide | Read access for all company users | Company policies, HR guidelines, company-wide manuals |

### 1. Personal Indexes
- **Zero-Knowledge Privacy**: Your files and conversations are encrypted with tenant/user keys.
- **Creation**: 
  - **Users**: Open the chat interface, click the index selector next to the model picker, switch to the *Personal* tab, and click **+**.
  - **Admins**: Go to **Admin ? Index Management ? Create Index** and assign it to a specific user.

### 2. Group Indexes
- **Collaboration**: Multiple team members can query and contribute documents to the same knowledge base.
- **Creation**:
  - Go to **Admin ? Group Management ? Create Group**, assign members, and link a shared Group Index.

### 3. Global Indexes
- **Company-wide Standards**: Centralized repositories for enterprise compliance, legal terms, and operational guidelines.
- **Creation**: Go to **Admin ? Index Management ? Create Index** and set scope to **Global**.

---

## How Indexing Works

When you upload files (PDFs, Word docs, CSV, JSON, Markdown, or plain text):

`
Raw Document  --?  Text Extraction  --?  Semantic Chunking  --?  Vector Embeddings  --?  Vector Storage (Index)
`

1. **Document Processing**: Text and metadata (timestamps, file names) are extracted and cleaned.
2. **Chunking**: Content is split into optimized semantic chunks with overlap to maintain contextual continuity.
3. **Embedding Generation**: Chunks are converted into high-dimensional vector embeddings.
4. **Vector Storage**: Embeddings are stored in high-performance vector databases for instant similarity retrieval.

---

## Best Practices

- **Naming**: Use clear, descriptive names for indexes and uploaded files (e.g., HR-Policy-2026 instead of doc1).
- **File Preparation**: Ensure uploaded documents are clear text; clean up low-quality scans before uploading.
- **File Limits**: Standard uploads support files up to 10MB per batch.
- **Scope Appropriately**: Keep sensitive personal notes in Personal Indexes; move team resources into Group Indexes.
