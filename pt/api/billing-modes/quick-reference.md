---
title: "Referência Rápida de Faturamento"
sidebar_label: "Referência de Faturamento"
---

# Referência rápida dos modos de cobrança

Um guia de comparação rápida para escolher entre os modos de faturamento Preenchimentos do usuário e Uso por modelo.

## Comparação Rápida

| Recurso | Conclusões do usuário | Uso por modelo |
|--------|------------------|----------------|
| **Modo padrão** | ✅ Sim | ❌ Não |
| **Estrutura de custos** | Fixo (cota de licença) | Variável (por token) |
| **Permissão do usuário** | Não obrigatório | Deve estar habilitado |
| **Acompanhamento de custos** | Contagens de conclusão | Contagens de tokens + custos |
| **Melhor para** | Custos previsíveis | Uso de alto volume |
| **Suporte substituto** | ✅ Sim | ❌Não |

## Quando usar cada modo

### Modo de conclusão do usuário

**Escolha isto quando:**
- ✅ Você quer custos fixos e previsíveis
- ✅ Você está dentro dos limites de licença existentes
- ✅ Você está construindo ferramentas internas
- ✅ Você deseja usar as alocações de cotas existentes
- ✅ Você precisa de um gerenciamento de custos simples

**Exemplos de casos de uso:**
- Chatbots internos
- Desenvolvimento e testes
- Aplicações de baixo volume
- Projetos com orçamento fixo

### Uso por modo de modelo

**Escolha isto quando:**
- ✅ Você precisa de rastreamento detalhado de custos
- ✅ Você usa modelos caros com frequência
- ✅ Você deseja pagar apenas pelo uso real
- ✅ Você precisa de análises granulares de uso
- ✅ Você tem requisitos de alto volume

**Exemplos de casos de uso:**
- Aplicações de produção
- Serviços de IA de alto volume
- Projetos sensíveis ao custo
- Aplicações multimodelos

## Uso da API

Ao usar a API externa com modos de faturamento:

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "prompt": "Hello, world!",
    "user_id": "optional-user-id-for-billing"
  }'
```

## Limites de taxa

### Limites de taxa padrão
- **Solicitações por minuto**: 60 (configurável)
- **Solicitações por hora**: 1.000 (configurável)
- **Limites diários**: 100 solicitações (configuráveis)
- **Limites mensais**: 10.000 solicitações (configuráveis)

### Limites Específicos do Modo de Faturamento
- **Conclusões do usuário**: com base na cota de licença
- **Uso por modelo**: limites adicionais baseados em dólares

## Integração de políticas SMLTP

Ambos os modos de cobrança oferecem suporte à aplicação da política SMLTP:

| Política | Descrição | Caso de uso |
|--------|-------------|----------|
| `public` | Para dados não sensíveis | Aplicativos voltados ao público |
| `internal` | Para dados da empresa | Ferramentas e processos internos |
| `confidential` | Para informações confidenciais | Aplicações de acesso restrito |

### Exemplo de configuração SMLTP

```json
{
  "billingMode": "usage-by-model",
  "allowedSMLTPPolicies": ["public", "internal"],
  "enforceSMLTPPolicies": true,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"]
}
```

## Exemplos de configuração

### Configuração de conclusões do usuário

```json
{
  "billingMode": "user-completions",
  "dailyLimit": 100,
  "monthlyLimit": 1000,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"],
  "allowedSMLTPPolicies": ["public", "internal"],
  "rateLimit": {
    "requestsPerMinute": 60,
    "requestsPerHour": 1000
  }
}
```

### Uso por configuração de modelo

```json
{
  "billingMode": "usage-by-model",
  "dailyLimit": 500,
  "monthlyLimit": 5000,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"],
  "allowedSMLTPPolicies": ["public", "internal", "confidential"],
  "rateLimit": {
    "requestsPerMinute": 120,
    "requestsPerHour": 2000
  },
  "usageByModel": {
    "enabled": true,
    "dollarLimit": 100.00
  }
}
```

## Cenários de erro

### Erros de conclusão do usuário

| Erro | Causa | Solução |
|-------|-------|----------|
| `Completion limit exceeded` | Cota mensal atingida | Habilite o uso por modelo ou aumente a cota |
| `Daily limit exceeded` | Limite diário atingido | Aguarde reinicialização ou aumento do limite |
| `User not found` | ID de usuário inválido | Verifique se o usuário existe |

### Uso por erros de modelo

| Erro | Causa | Solução |
|-------|-------|----------|
| `Usage by Model required` | O usuário não está habilitado | Habilitar uso por modelo para usuário |
| `Usage by Model budget exceeded` | Orçamento mensal alcançado | Aumentar limite em dólares |
| `Invalid billing mode` | Modo inválido especificado | Use `"usage-by-model"` ou `"user-completions"` |

## Guia de migração

### Das conclusões do usuário ao uso por modelo

1. **Ativar uso por modelo para o usuário**
   ```bash
   # Admin panel: Users > Edit User > Enable Usage by Model
   ```

2. **Atualizar configuração da chave API**
   ```json
   {
     "billingMode": "usage-by-model",
     "usageByModel": {
       "enabled": true,
       "dollarLimit": 100.00
     }
   }
   ```

3. **Monitore o uso e os custos**
   - Rastrear o uso de tokens
   - Monitorar gastos mensais
   - Ajuste os limites conforme necessário

### Do uso por modelo às conclusões do usuário

1. **Verifique se o usuário tem cota suficiente**
   - Verifique o nível de licença
   - Verifique os limites mensais

2. **Atualizar configuração da chave API**
   ```json
   {
     "billingMode": "user-completions",
     "dailyLimit": 100,
     "monthlyLimit": 1000
   }
   ```

3. **Monitore o uso da conclusão**
   - Acompanhar contagens de conclusão
   - Garantir que o comportamento de fallback funcione

## Estimativa de custos

### Custos de conclusão do usuário

- **Custo fixo**: com base no nível de licença
- **Sem custos adicionais**: além da licença existente
- **Previsível**: igual ao uso da interface web

### Custos de uso por modelo

- **Custo variável**: com base no uso do token
- **Preços específicos do modelo**: taxas diferentes por modelo
- **Exemplos de custos**:
  - GPT-5.1: aplica-se o preço do provedor
  - Claude Sonnet 4.6: aplica-se o preço do fornecedor
  - GPT-5 Nano: aplica-se o preço do provedor

## Dicas de monitoramento

### Monitoramento de conclusões do usuário

- Acompanhe contagens de conclusão diariamente
- Monitorar o consumo de cotas
- Definir alertas para limites próximos
- Revise os padrões de uso mensalmente

### Uso por monitoramento de modelo

- Acompanhe o uso e os custos do token
- Monitorar gastos mensais
- Definir alertas de limite em dólares
- Revise o detalhamento dos custos por modelo

## Considerações de segurança

### Ambos os modos

- Use restrições de IP para aplicativos confidenciais
- Gire as chaves de API regularmente
- Monitore atividades incomuns
- Implementar tratamento adequado de erros

### Uso por modelo específico

- Definir limites de dólares apropriados
- Monitore picos de custos
- Revise os padrões de uso do modelo
- Rastreie o uso de modelos caros

## Recursos de suporte

### Documentação
- [Visão geral dos modos de faturamento](../billing-modes.md)
- [Limites e Cotas](/pt/api/limits-and-quotas) - Entenda os limites da plataforma

### Painel de administração
- **Seção APIs**: Criar e gerenciar chaves de API
- **Seção Usuários**: Habilitar uso por modelo

### Problemas comuns
1. **O uso por modelo não funciona**: verifique as permissões do usuário
2. **Cota excedida**: Habilite o uso por modelo ou aumente os limites
3. **Picos de custos**: analise o uso do modelo e defina limites
4. **Erros de autenticação**: verifique a chave e as permissões da API