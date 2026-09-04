---
id: custom-siem-webhook
title: "Integração com SIEM Personalizado via Webhook"
sidebar_label: "SIEM / Webhook Custom"
description: "Integração genérica de SIEM (HTTP/Webhook) para enviar logs de segurança SecureAI para qualquer endpoint HTTP personalizado"
---

# Integração genérica SIEM (HTTP/Webhook)

## Visão geral

A integração genérica SIEM (HTTP/Webhook) permite enviar logs de segurança SecureAI para qualquer endpoint HTTP personalizado. Isso é perfeito para integração com sistemas SIEM que não possuem suporte nativo, ferramentas de segurança personalizadas ou qualquer sistema de registro baseado em HTTP.

## Casos de uso

- **Sistemas SIEM personalizados**: envie logs para suas ferramentas internas de monitoramento de segurança
- **Plataformas de segurança de terceiros**: integração com ferramentas de segurança que aceitam webhooks
- **Painéis personalizados**: crie sua própria visualização de eventos de segurança
- **Teste e desenvolvimento**: use serviços de teste de webhook para verificar a entrega de logs
- **Sistemas legados**: conecte-se a ferramentas de segurança mais antigas que suportam apenas endpoints HTTP

## Etapas de configuração

### 1. Obtenha um endpoint de teste

Para fins de teste, recomendamos usar webhook.site:

1. Visite [https://webhook.site](https://webhook.site)
2. Copie seu URL exclusivo (por exemplo, `https://webhook.site/ae0761ed-7939-4d86-be2f-ed58d0e65dd3`)
3. Mantenha esta página aberta para monitorar webhooks recebidos

<div class="mac-window">
  ![Ponto final de teste Webhook.site](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%201.png)
</div>

### 2. Configure a integração

1. Navegue até **Integrações** no painel de administração do SecureAI
2. Encontre **"Generic SIEM (HTTP/Webhook)"** na categoria SIEM
3. Clique em **"Conectar Integração"**

### 3. Preencha a configuração

#### Configurações básicas

- **Nome da integração**: `Test Generic SIEM` (ou qualquer nome descritivo)
- **URL do terminal**: `https://webhook.site/ae0761ed-7939-4d86-be2f-ed58d0e65dd3`
- **Método HTTP**: `POST` (recomendado para a maioria das plataformas SIEM)
- **Cabeçalhos HTTP**: `{"Content-Type": "application/json"}`

<div class="mac-window">
  ![Configuração de cabeçalhos HTTP](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%202.png)
</div>

#### Categorias de eventos

Selecione quais tipos de eventos serão encaminhados:

✅ **Recomendado para teste:**
- Autenticação e login
- API e uso de modelo
- Acesso a dados e PHI
- SMLTP e políticas
- Limites de faturamento e uso
- Análise

⚠️ **Opcional (pode gerar alto volume):**
- Segurança e violações
- Sistema e Infraestrutura
- Mudanças de configuração

### 4. Teste a conexão

1. Clique em **"Testar conexão"** para verificar a conectividade

<div class="mac-window">
  ![Botão de teste de conexão](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%203.png)
</div>

2. Verifique webhook.site - você deverá ver uma solicitação de teste
3. Verifique se a resposta mostra sucesso

<div class="mac-window">
  ![Verificação de resposta de sucesso](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%204.png)
</div>

### 5. Salvar e monitorar

1. Clique em **"Conectar"** para salvar a configuração
2. Execute ações em seu sistema SecureAI (login, chamadas de API, etc.)
3. Monitore webhook.site para ver logs em tempo real

## Configuração avançada

### Cabeçalhos personalizados

Você pode adicionar cabeçalhos personalizados para autenticação ou requisitos específicos:

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer your-api-key",
  "X-Custom-Header": "custom-value"
}
```

### Quando usar SIEM personalizado

A integração personalizada SIEM é particularmente útil nestes cenários:

- **Sem sistema SIEM**: se você não usa nenhuma plataforma SIEM, isso fornece uma maneira simples de começar a coletar logs de segurança
- **Destinos de dados adicionais**: envie dados para vários locais simultaneamente (por exemplo, seu SIEM principal + um sistema de backup)
- **Ferramentas personalizadas**: integre-se a ferramentas de segurança especializadas, data centers ou painéis personalizados
- **Plataformas de comunicação**: envie alertas para canais do Teams, Slack ou outras ferramentas de colaboração
- **Sistemas legados**: conecte-se a ferramentas de segurança mais antigas que suportam apenas endpoints HTTP
- **Teste e desenvolvimento**: use serviços de teste de webhook para verificar a entrega de logs antes da implantação em produção

**Observação**: Se você já tem um SIEM compatível (Splunk, Microsoft Sentinel, Elastic), recomendamos usar nossas integrações nativas para desempenho e recursos ideais.

## Solução de problemas

### Problemas comuns

1. **Tempo limite de conexão**: verifique se o endpoint está acessível e respondendo
2. **Erros de autenticação**: verifique as chaves de API e os cabeçalhos de autenticação
3. **Problemas de SSL/TLS**: Garanta a validação adequada do certificado para endpoints HTTPS

### Monitoramento

- Verifique o status da integração no painel de administração do SecureAI
- Monitore as taxas de sucesso de entrega de webhook
- Revise as tentativas malsucedidas de webhook nos logs
- Verifique a disponibilidade do endpoint e os tempos de resposta

## Considerações de segurança

- **Somente HTTPS**: sempre use endpoints HTTPS na produção
- **Autenticação**: implemente a autenticação adequada para seus endpoints de webhook
- **Limite de taxa**: configure limites de taxa apropriados em seus endpoints
- **Retenção de logs**: implemente políticas adequadas de retenção de logs para conformidade
- **Controle de acesso**: restrinja o acesso aos endpoints do webhook apenas a sistemas autorizados

## Melhores práticas

1. **Comece aos poucos**: comece com categorias de eventos essenciais e expanda gradualmente
2. **Teste Completamente**: Use webhook.site ou serviços semelhantes para testes iniciais
3. **Monitore o desempenho**: observe atrasos ou falhas na entrega do webhook
4. **Configuração do documento**: mantenha registros detalhados da configuração do seu webhook
5. **Revisão regular**: revise e atualize periodicamente as configurações do webhook
6. **Planos de backup**: tenha métodos de registro alternativos caso os webhooks falhem

## Feito! 

Com essas etapas, sua instância do Custom Webhook está totalmente configurada para integração com SecureAI 😎.