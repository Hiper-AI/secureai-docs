---
sidebar_position: 3
title: "Paquetes de Instalación y Enrolamiento"
sidebar_label: "Paquetes y Enrolamiento"
description: "Cómo funcionan los paquetes de instalación, las claves de inscripción y los tokens de dispositivo de SecureAI OS Agent"
---

# Paquetes de inscripción e instalación

Un **paquete de instalación** es la unidad que usted construye para implementar el agente. Incluye la plataforma, las etiquetas y el grupo al que debe unirse un dispositivo, y una clave de inscripción dedicada, por lo que el comando de instalación es autónomo.

## Creando un paquete

En **Admin → Registro de agentes → Agentes del sistema operativo**, cree un paquete con:

| Campo | Descripción |
|-------|-------------|
| **Nombre / descripción** | Identifique el paquete (por ejemplo, "Portátiles de ingeniería"). |
| **Plataforma** | Windows/Linux/macOS. |
| **Tipo de paquete** | `standalone`. |
| **Etiquetas de endpoint** | Etiquetas aplicadas a los dispositivos inscritos en este paquete. |
| **Grupo de inscripción** | El [grupo](/agent/policies-and-groups) al que está anclado un dispositivo en el primer registro. |

Al guardar, SecureAI **genera automáticamente una clave API dedicada con alcance `agent:enroll`** y la almacena como clave de inscripción del paquete, por lo que el comando de instalación no necesita una credencial separada. Al eliminar el paquete se desactiva esa clave.

## Grupos de inscripción (pin automático)

El **grupo de inscripción** del paquete es un pin fijo: un dispositivo que se inscribe en el paquete está vinculado a ese grupo en el primer contacto. La pertenencia al grupo determina qué [política](/agent/policies-and-groups) resuelve el dispositivo.

## El apretón de manos de inscripción

Cuando el agente se ejecuta por primera vez, llama a `POST /enroll` usando la clave de inscripción y envía la identificación de su máquina, nombre de host, sistema operativo, arquitectura, versión, huella digital y capacidades. El backend:

1. Registra (o coincide) el dispositivo.
2. Emite un **token por dispositivo**, que se muestra una vez, que autentica todas las llamadas posteriores.
3. Devuelve la **configuración** del tiempo de ejecución (política resuelta, configuración de salida, enrutamiento, etc.).

El token por dispositivo **rota en cada inscripción**. Un dispositivo que ha sido **revocado** no puede volver a inscribirse: la respuesta de inscripción informa `revoked: true` y el dispositivo permanece desconectado hasta que un administrador lo vuelve a habilitar.

## Resolución de URL de backend

El agente llama a casa de `BACKEND_URL`. En el lado del servidor, la URL efectiva se resuelve a partir de encabezados de origen de solicitud/reenviados y se puede anular con la variable de entorno `SECUREAI_AGENT_URL`, que es útil detrás de servidores proxy inversos.

## Administrar dispositivos registrados

Desde la pestaña Agentes del sistema operativo, puede, por dispositivo: enviar un comando, **revocar**/**volver a habilitar**, eliminar, asignar un grupo y vincular/desvincular un usuario propietario. Se admiten operaciones masivas. La entrega de comandos se realiza a través de un canal WebSocket con una cola de latidos alternativa (los comandos en cola mientras un dispositivo está fuera de línea se entregan en el siguiente latido, con un TTL de 1 hora).

## Relacionado

- [Instalación del agente](/agent/installation)
- [Políticas y grupos](/agent/policies-and-groups)
- [Autoactualización y antimanipulación](/agent/quarantine-and-fleet-ops#self-update--anti-manipulación)