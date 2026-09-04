---
sidebar_position: 3
title: "Pacotes de Instalação e Registro"
sidebar_label: "Pacotes e Registro"
description: "Como funcionam os pacotes de instalação do SecureAI OS Agent, chaves de registro e tokens de dispositivo"
---

# Pacotes de inscrição e instalação

Um **pacote de instalação** é a unidade que você cria para implementar o agente. Ele agrupa a plataforma, as tags e o grupo ao qual um dispositivo deve ingressar e uma chave de registro dedicada – portanto, o comando de instalação é independente.

## Criando um pacote

Em **Admin → Agent Registry → OS Agents**, crie um pacote com:

| Campo | Descrição |
|-------|------------|
| **Nome/descrição** | Identifique o pacote (por exemplo, "Laptops de engenharia"). |
| **Plataforma** | Windows/Linux/macOS. |
| **Tipo de pacote** | `standalone`. |
| **Tags de endpoint** | Etiquetas aplicadas a dispositivos inscritos neste pacote. |
| **Grupo de inscrição** | O [grupo](/pt/agent/policies-and-groups) ao qual um dispositivo é fixado na primeira inscrição. |

Ao salvar, SecureAI **gera automaticamente uma chave de API dedicada com escopo para `agent:enroll`** e a armazena como a chave de inscrição do pacote, portanto, o comando de instalação não precisa de credencial separada. Excluir o pacote desativa essa chave.

## Grupos de inscrição (fixação automática)

O **grupo de inscrição** do pacote é um hard pin: um dispositivo que se inscreve no pacote é vinculado a esse grupo no primeiro contato. A associação ao grupo determina qual [política](/pt/agent/policies-and-groups) o dispositivo resolve.

## O handshake de inscrição

Quando o agente é executado pela primeira vez, ele chama `POST /enroll` usando a chave de inscrição e envia seu ID de máquina, nome de host, sistema operacional, arquitetura, versão, impressão digital e recursos. O back-end:

1. Registra (ou corresponde) o dispositivo.
2. Emite um **token por dispositivo**, mostrado uma vez, que autentica todas as chamadas subsequentes.
3. Retorna a **configuração** do tempo de execução (política resolvida, configurações de saída, roteamento, etc.).

O token por dispositivo **rotaciona a cada inscrição**. Um dispositivo que foi **revogado** não pode ser registrado novamente — a resposta de inscrição informa `revoked: true` e o dispositivo permanece desligado até que um administrador o reative.

## Resolução de URL de back-end

O agente liga para casa para `BACKEND_URL`. No lado do servidor, o URL efetivo é resolvido a partir de cabeçalhos encaminhados/de origem da solicitação e pode ser substituído pela variável de ambiente `SECUREAI_AGENT_URL`, que é útil por trás de proxies reversos.

## Gerenciando dispositivos inscritos

Na guia Agentes de SO, você pode, por dispositivo: enviar um comando, **revogar** / **reativar**, excluir, atribuir um grupo e vincular/desvincular um usuário proprietário. Operações em massa são suportadas. A entrega do comando é feita por meio de um canal WebSocket com um fallback de fila de pulsação (comandos enfileirados enquanto um dispositivo está offline são entregues em sua próxima pulsação, com um TTL de 1 hora).

## Relacionado

- [Instalando o Agente](/pt/agent/installation)
- [Políticas e Grupos](/pt/agent/policies-and-groups)
- [Autoatualização e anti-adulteração](/pt/agent/quarantine-and-fleet-ops#self-update--anti-tamper)