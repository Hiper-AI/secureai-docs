---
sidebar_position: 1
title: "Defesa Contra Ameaças de IA"
sidebar_label: "Defesa Contra Ameaças"
---

# Defesa contra ameaças

O Threat Defense fornece proteção em tempo real contra ataques maliciosos, jailbreaks, vazamentos de instruções e manipulação de saída.

---

## Vetores de ameaças protegidos

| Ameaça | Descrição |
|---|---|
| **Injeção imediata** | Tentativas de substituir ou ignorar instruções e restrições do sistema. |
| **Jailbreaks** | Alertas adversários projetados para contornar as grades de segurança. |
| **Instrução/Vazamento de prompt do sistema** | Ataques de extração que tentam revelar instruções proprietárias. |
| **Desvio de função/seqüestro** | Manipular o assistente para se desviar do domínio de negócios pretendido. |
| **Ataques de extração de dados** | Tentativas automatizadas de coletar dados confidenciais de treinamento ou índice. |
| **Vazamentos de token canário** | Detecção de strings canário ocultas sinalizando exposição de instruções. |

---

## Módulos principais

### 1. Mecanismo de escudo de alerta
Avalia cada prompt recebido antes de chegar ao modelo de linguagem:
- **Permitir**: a solicitação passa em todas as verificações de segurança.
- **Sinalizador**: a solicitação é permitida, mas registrada como um evento de segurança para análise administrativa.
- **Bloquear**: a solicitação é bloqueada imediatamente com um evento de negação assinado.

### 2. Protetores de saída
Monitora os resultados do modelo antes da entrega ao cliente para capturar:
- Alerta do sistema e vazamento de contexto interno.
- Vazamento de token canário.
- Desvio de função não intencional ou resultados perigosos.

### 3. Tokens Canário
Os tokens canários são marcadores criptográficos ocultos exclusivos inseridos nas instruções do chatbot:
- **Como funciona**: Se um invasor conseguir extrair instruções, o marcador canário na resposta aciona um alerta de segurança imediato de alta prioridade.
- **Configuração**: Vá para **Admin ? Defesa contra ameaças? Canary Tokens** para gerar, girar ou monitorar tokens.

---

## Configuração de políticas e gerenciamento de incidentes

1. **Configurar políticas**: Vá para **Admin ? Defesa contra ameaças? Políticas**. Selecione entre **Estrito** (chatbots públicos), **Equilibrado** (uso empresarial padrão) ou **Permissivo** (ambientes de teste).
2. **Revisar Incidentes**: Inspecione eventos sinalizados ou bloqueados em **Admin ? Defesa contra ameaças? Incidentes** para analisar cargas de ataque e ajustar a sensibilidade.