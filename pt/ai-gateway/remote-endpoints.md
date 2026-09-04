---
sidebar_position: 6
title: "Endpoints Remotos e Conectividade"
sidebar_label: "Endpoints Remotos"
---

# Terminais Remotos

Os endpoints remotos permitem conectar servidores de modelos externos ou auto-hospedados ao SecureAI por meio de controles do AI Gateway.

Isto é útil quando a sua organização executa a sua própria infraestrutura de modelo e ainda pretende uma governação de segurança centralizada.

## Onde configurar

Acesse **Administrador → AI Gateway → Endpoints remotos**.

## Opções de registro

- **Instalação rápida**: assistente guiado que gera um fluxo de configuração com um comando.
- **Registro Manual**:
  - **Colar JSON**
  - **Campos de entrada manual**

## Modos de conectividade

- **Reverse Connect**: recomendado para a maioria das implantações; conexão de saída, sem portas de entrada abertas.
- **Túnel Cloudflare**: conectividade de confiança zero usando token de túnel e nome de host.

## Operações Diárias

Para cada endpoint, os administradores podem:

- execute **Verificação de integridade**
- execute **Verificar mTLS**
- inspecionar detalhes do endpoint (região, impressão digital, modelos, última verificação)
- remover endpoint quando desativado

## Fluxo de integração sugerido

1. Comece com **Instalação rápida**.
2. Escolha o modo de conectividade.
3. Selecione os modelos necessários.
4. Conclua o registro.
5. Execute a verificação de integridade e verifique o mTLS.
6. Confirme se o endpoint permanece íntegro após 5 a 10 minutos.

## Lista de verificação para solução de problemas

- Endpoint inacessível: verifique o modo de conectividade e os valores do nome do host.
- TLS aprovado, mas não íntegro: verifique o status do gateway remoto/serviço de modelo.
- Não conectado: confirme se o serviço remoto está em execução e se o registro é válido.

## Melhores práticas

- Prefira Reverse Connect, a menos que sua arquitetura exija modo túnel.
- Mantenha clara a propriedade do endpoint por organização/equipe.
- Verifique novamente a integridade do endpoint após alterações importantes ou de política.