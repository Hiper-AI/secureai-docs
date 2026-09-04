---
sidebar_position: 6
title: "Integración con Google Cloud Vertex AI"
sidebar_label: "Google Cloud Vertex AI"
description: "Conecte Google Vertex AI para que SecureAI pueda inventariar agentes, modelos, cuentas de servicio, IAM, uso y costos."
---

# Google Vértice AI

Conecte su proyecto de Google Cloud para que SecureAI pueda inventariar los agentes, endpoints y modelos de Vertex AI, junto con las cuentas de servicio, enlaces de IAM, registros de auditoría, uso y facturación que los rodean.

## Qué importa SecureAI

- **Agentes, endpoints y modelos de Vertex AI**
- **NHI**: cuentas de servicio, claves de cuenta de servicio y claves API (revocables; consulte [Inventario de NHI](/discovery/nhi-inventory))
- Enlaces de roles **IAM**
- **Registros de auditoría de la nube**
- **Solicitudes, tokens y costos** de los últimos 30 días (real de la exportación de facturación de BigQuery o estimado)

## Requisitos previos

- Una **cuenta de servicio** con una clave JSON, a la que se le otorgan roles de lectura en el proyecto:
  - `roles/aiplatform.viewer`
  - `roles/monitoring.viewer`
  - `roles/iam.securityReviewer`
  - `roles/logging.viewer`
  - `roles/billing.viewer`
  - Roles de BigQuery (por ejemplo, `roles/bigquery.dataViewer`, `roles/bigquery.jobUser`) si usas la exportación de facturación para el costo **real**.
  - *(Opcional)* roles de administrador de cuenta de servicio/clave si desea que SecureAI revoque las identidades en la fuente.

## Credenciales

| Campo | Requerido | Descripción |
|-------|----------|-------------|
| `projectId` | Sí | ID del proyecto de GCP. |
| `location` | Sí | Región de vértice (por ejemplo, `us-central1`). |
| `serviceAccountJson` | Sí | La clave de cuenta de servicio JSON. Cifrado en reposo. |
| `billingExportTable` | No | Tabla de BigQuery para la facturación real (por ejemplo, `dataset.gcp_billing_export_v1_XXXX`). |
| `billingProjectId` | No | Proyecto que aloja la exportación de facturación, si es diferente. |

### Dónde conseguirlos

1. En la [consola de Google Cloud](https://console.cloud.google.com/), vaya a **IAM y administrador → Cuentas de servicio → Crear cuenta de servicio**.
2. Otorgar los roles enumerados anteriormente.
3. En **Claves → Agregar clave → JSON**, descargue el archivo de clave.
4. Pegue el JSON **completo** en el campo `serviceAccountJson`.

## Conectar

1. **Administrador → Integraciones → Nube → Google Vertex AI → Conectar.**
2. Ingrese el proyecto, la ubicación y el JSON de la cuenta de servicio (más los campos de facturación opcionales).
3. **Probar**, luego **Guardar**.
4. **Sincronización**.

## Verificar

Abra [Sensores de nube](/discovery/cloud-sensors) para agentes/endpoints/modelos descubiertos y [Inventario NHI](/discovery/nhi-inventory) para cuentas de servicio y claves. Las estadísticas muestran los enlaces, el uso y el costo de IAM.

## Revocación

Las cuentas de servicio de GCP, las claves SA y las claves API son **revocables** de [NHI Inventory](/discovery/nhi-inventory) cuando el conector tiene las funciones de administrador de clave/SA opcionales.

## Relacionado

- [Descripción general de los proveedores de IA en la nube](/integrations/cloud/overview)
- [SSO de Google Workspace](/iam/google-workspace)
- [Inventario NHI](/discovery/nhi-inventory)