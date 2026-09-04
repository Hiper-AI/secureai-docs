---
sidebar_position: 1
title: "Gestión de Usuarios y Accesos"
sidebar_label: "Usuarios y Accesos"
---

# Gestión de usuarios y accesos

SecureAI proporciona administración de usuarios de nivel empresarial, control de acceso basado en roles (RBAC), niveles de permisos y asignación de licencias.

---

## Roles del sistema

SecureAI incluye funciones de sistema integradas para controlar el acceso a la plataforma:

| Rol | Nivel de acceso | Descripción |
|---|---|---|
| **Administrador** | Control total | Privilegios administrativos completos: administre usuarios, cree roles personalizados, configure políticas de puerta de enlace SMLTP/AI, vea registros y configure SSO. |
| **Usuario** | Estándar | Acceso de usuario habitual: chatee con modelos de IA, cree y administre índices personales, cargue documentos. |
| **Lector global** | Sólo lectura | Mismas capacidades que el usuario estándar más visibilidad de solo lectura de los paneles de administración y el estado del sistema. No se puede modificar la configuración. |

### Roles personalizados y permisos granulares
Los administradores pueden crear roles personalizados con niveles de permisos personalizados (**Ninguno**, **Lector**, **Administrador**) en módulos específicos:
- **Gestión de usuarios y grupos**: creación de usuarios, edición, asignación de grupos.
- **Gestión de índices**: carga de documentos, creación de índices, formación de índices.
- **Seguridad y SMLTP**: Políticas de seguridad, respuesta a incidentes, verificación de auditorías.
- **Integraciones y puerta de enlace AI**: conexión de proveedores de nube, claves API y endpoints.

---

## Gestión de licencias

Las cuentas de usuario se aprovisionan bajo niveles de licencia organizacional:

| Nivel | Funciones incluidas |
|---|---|
| **Ultra** | Funciones completas de la plataforma, índices ilimitados, rendimiento del modelo prioritario, políticas de cumplimiento SMLTP personalizadas y soporte dedicado. |
| **Crecimiento** | Herramientas de colaboración en equipo, índices de grupo, políticas de seguridad SMLTP estándar, soporte estándar. |
| **Esencial** | Interfaz de chat central, índices personales, acceso al modelo básico, soporte comunitario. |

---

## Tareas administrativas comunes

- **Crear un usuario**: Ir a **¿Administrador? ¿Usuarios? Crear usuario**. Establezca el correo electrónico, la función y el nivel de licencia.
- **Asignar a grupos**: navegar a **¿Administrador? Grupos** para organizar a los usuarios en equipos colaborativos con índices de grupo compartidos.
- **Configurar SSO**: conecte su proveedor de identidad empresarial (Google Workspace o Microsoft Entra ID) en la configuración de **Autenticación**.