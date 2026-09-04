---
sidebar_position: 1
title: "Proteção de Dados (DLP e PII)"
sidebar_label: "Proteção de Dados (DLP)"
---

# Proteção de Dados

A proteção de dados evita o vazamento acidental ou malicioso de informações comerciais confidenciais e informações de identificação pessoal (PII) durante interações de IA.

---

## Principais recursos de proteção

### 1. DLP Gerenciamento (Prevenção contra perda de dados comerciais)
Protege ativos comerciais proprietários em prompts, arquivos carregados e respostas de modelo:
- **Chaves e credenciais de API**: evita vazamento de chaves AWS, tokens OpenAI, senhas e certificados privados.
- **Código Fonte e Arquitetura**: Detecta repositórios internos e trechos de código.
- **Contratos e Finanças**: Identifica minutas de acordos confidenciais e dados financeiros.

### 2. Redação de PII (Privacidade e Conformidade)
Detecta e mascara automaticamente identificadores pessoais para atender aos padrões GDPR, HIPAA e CCPA:
- **Identificadores**: Nomes, endereços de e-mail, números de telefone, identidades nacionais (SSN, DNI, números de passaporte), cartões de crédito.
- **Modos de redação**:
  - **Máscara**: Ofusca strings confidenciais (por exemplo, user@*****.com, ****-****-****-1234).
  - **Remover**: Remove totalmente o texto confidencial.
  - **Tokenize / Hash**: Substitui dados confidenciais por pseudônimos determinísticos para processamento interno.

### 3. Verificador Semântico
Auxilia em investigações legais e de segurança, determinando se um texto suspeito foi gerado pelo seu locatário SecureAI:
- **Níveis de confiança**: *Verificado*, *Correspondência provável*, *Ambíguo*, *Sem correspondência*.
- **Uso**: Vá para **Admin ? Proteção de dados? Verificador Semântico** e cole o trecho de texto para analisar a probabilidade de origem.

---

## Configuração e configuração

1. **Configurações globais**: Vá para **Admin ? Proteção de dados** para permitir verificação em tempo real de entradas, saídas e anexos de arquivos.
2. **Modelos e regras personalizadas**: carregue modelos iniciais regionais/do setor ou adicione padrões regex personalizados.
3. **Modo de simulação**: teste políticas em conjuntos de dados de amostra antes de aplicá-las na produção.
4. **Monitoramento de incidentes**: revise as métricas de redação e bloqueio nos registros de incidentes de proteção de dados.