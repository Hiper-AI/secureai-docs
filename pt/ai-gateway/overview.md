---
sidebar_position: 1
title: "AI Gateway — Plano de Controle Centralizado"
sidebar_label: "AI Gateway"
---

# Gateway de IA

O **AI Gateway** é o plano de controle centralizado para governar, proteger, rotear e inspecionar todo o tráfego do modelo de IA em toda a organização.

---

## Capacidades principais

### 1. Políticas de segurança
Defina regras de aplicação para toda a organização:
- **Listas de permissões de modelos**: restrinja quais modelos e provedores com os quais os funcionários e aplicativos podem interagir.
- **Geofencing de residência de dados**: garanta que os prompts e respostas permaneçam nas jurisdições designadas.
- **Modos de aplicação**: executado em **Modo de monitoramento** (registrar e atestar sem bloqueio) ou **Modo de aplicação** (fechamento com falha, bloqueando tráfego não compatível com recibos criptográficos).

### 2. Painel e observabilidade
Monitore métricas em tempo real em toda a sua empresa:
- **Total de interações seguras** e pacotes SMLTP ativos.
- **Taxas de redação e bloqueio**: rastreie dados confidenciais interceptados por mecanismos DLP/PII.
- **Status do protocolo**: verifique a integridade do gateway ativo e o status de rotação de chaves.

### 3. Gerenciamento de chave criptográfica
Gerencie chaves de assinatura Ed25519 e chaves de criptografia AES-256:
- **Rotação com tempo de inatividade zero**: alterne as chaves de assinatura periodicamente, preservando a verificação off-line para recibos assinados com chaves anteriores.
- **Config**: Vá para **Admin ? Gateway de IA? Chaves**.

### 4. Portal de Transparência e Auditoria
Valide a integridade da interação usando provas criptográficas:
- Pesquise qualquer interação por undle_id para inspecionar sua cadeia de hash L1, árvore Merkle L2 e âncora de transparência L3 Sigstore Rekor.
- Gere links de verificação pública compartilháveis ​​para auditores de conformidade terceirizados.

### 5. Gerenciamento de extensões
Gerencie e aplique políticas de segurança em toda a frota de extensões de navegador SecureAI para evitar o uso de Shadow AI em navegadores clientes.