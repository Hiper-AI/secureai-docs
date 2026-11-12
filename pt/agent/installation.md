---
sidebar_position: 2
title: "Instalação do Endpoint Agent"
sidebar_label: "Instalação"
description: "Instale o SecureAI OS Agent em endpoints Windows"
---

# Instalando o Agente

O SecureAI OS Agent é instalado a partir de um **pacote de instalação** que você cria em **Admin → Agent Registry → OS Agents**. O pacote produz um comando pronto para execução que carrega dois valores: o **URL de back-end** e uma **chave de inscrição** com escopo definido. Para o construtor completo de pacotes e a mecânica de inscrição, consulte [Pacotes de inscrição e instalação](/pt/agent/enrollment-and-packages).

## Windows (MSI)

O Windows usa um **MSI assinado por código**. O MSI nunca é modificado quando é baixado, portanto sua assinatura Authenticode permanece válida - a configuração é passada no momento da instalação na linha de comando `msiexec` em vez de ser inserida no arquivo.

```powershell
msiexec /i "secureai-agent.msi" /qb BACKEND_URL=https://{customer.name}.hiperai.ai ENROLL_KEY=sk-...
```

| Propriedade | Descrição |
|----------|------------|
| `BACKEND_URL` | Sua origem de back-end SecureAI (o endpoint chama home aqui). |
| `ENROLL_KEY` | A chave `agent:enroll` com escopo do pacote do instalador. |

O painel do instalador mostra o comando exato com seus valores pré-preenchidos – copie-o diretamente.

<Tip>
**Implante em escala**

Envie o mesmo comando `msiexec` por meio de seu MDM/RMM existente (Intune, GPO, SCCM, etc.). Como a URL e a chave são propriedades de linha de comando, um MSI assinado funciona para cada locatário e grupo.
</Tip>

## macOS (em breve)

Por enquanto, o agente só pode ser instalado no Windows. A versão para macOS está em desenvolvimento e ainda não tem instalador, por isso o construtor de pacotes oferece apenas Windows.

## O que acontece na primeira execução

Na primeira inicialização o agente **se inscreve**: apresenta a chave de inscrição, registra o dispositivo e recebe um token por dispositivo e sua configuração de tempo de execução. Em seguida, ele começa a pulsar e a aplicar sua [política](/pt/agent/policies-and-groups) resolvida. Consulte [Pacotes de inscrição e instalação](/pt/agent/enrollment-and-packages) para obter detalhes, incluindo como o URL de back-end é resolvido e como os tokens do dispositivo são alternados.

## Relacionado

- [Pacotes de inscrição e instalação](/pt/agent/enrollment-and-packages)
- [Políticas e Grupos](/pt/agent/policies-and-groups)
- [Visão geral do agente endpoint](/pt/agent/overview)