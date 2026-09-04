---
sidebar_position: 2
title: "Instalación del Endpoint Agent"
sidebar_label: "Instalación"
description: "Instale SecureAI OS Agent en terminales Windows, Linux y macOS"
---

# Instalación del agente

SecureAI OS Agent se instala desde un **paquete de instalación** que usted crea en **Admin → Agent Registry → OS Agents**. El paquete produce un comando listo para ejecutar (Windows) o un script (Linux/macOS) que lleva dos valores: la **URL de backend** y una **clave de inscripción** con alcance. Para conocer el creador de paquetes completo y los mecanismos de inscripción, consulte [Paquetes de instalación e inscripción](/agent/enrollment-and-packages).

##Windows (MSI)

Windows utiliza un **MSI con código firmado**. El MSI nunca se modifica cuando se descarga, por lo que su firma Authenticode sigue siendo válida: la configuración se pasa en el momento de la instalación en la línea de comando `msiexec` en lugar de incorporarse al archivo.

```powershell
msiexec /i "secureai-agent.msi" /qb BACKEND_URL=https://{customer.name}.hiperai.ai ENROLL_KEY=sk-...
```

| Propiedad | Descripción |
|----------|-------------|
| `BACKEND_URL` | Su origen de backend de SecureAI (el endpoint llama a casa aquí). |
| `ENROLL_KEY` | La clave `agent:enroll` con alcance del paquete de instalación. |

El panel del instalador muestra el comando exacto con sus valores precargados; cópielo directamente.

<Tip>
**Implementar a escala**

Ejecute el mismo comando `msiexec` a través de su MDM/RMM existente (Intune, GPO, SCCM, etc.). Dado que la URL y la clave son propiedades de la línea de comandos, un MSI firmado funciona para cada inquilino y grupo.
</Tip>

## Linux/macOS (guión)

Descargue el script de shell independiente del paquete de instalación y ejecútelo. El script extrae el `.deb`/`.pkg` apropiado y escribe la configuración del agente (por ejemplo, `/etc/secureai-agent.toml` en Linux, un plist de LaunchAgent en macOS).

```bash
sudo ./secureai-agent-install.sh
```

La URL de backend y la clave de inscripción ya están integradas en el script generado para su paquete.

## ¿Qué sucede en la primera ejecución?

En el primer lanzamiento, el agente se **inscribe**: presenta la clave de inscripción, registra el dispositivo y recibe un token por dispositivo y su configuración de tiempo de ejecución. Luego comienza a latir y a aplicar su [política] resuelta (/agente/políticas-y-grupos). Consulte [Paquetes de instalación y de inscripción](/agent/enrollment-and-packages) para obtener más detalles, incluido cómo se resuelve la URL de backend y cómo rotan los tokens de dispositivo.

## Relacionado

- [Paquetes de inscripción e instalación](/agent/enrollment-and-packages)
- [Políticas y grupos](/agent/policies-and-groups)
- [Descripción general del agente de endpoint](/agent/overview)