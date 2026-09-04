---
sidebar_position: 2
title: "Sensores Cloud para IA"
sidebar_label: "Sensores Cloud"
description: "El inventario de solo lectura de agentes y modelos descubiertos dentro de sus plataformas de nube de IA conectadas"
---

# Sensores de nubes

**Sensores de nube** (Administrador → Registro de agentes → **Nube**) es el inventario de agentes, modelos e implementaciones descubiertos dentro de sus plataformas de IA en la nube conectadas: **Azure AI Foundry, AWS Bedrock, GCP Vertex AI, OpenAI Platform y Anthropic Console**. Es de solo lectura: configura los conectores en [Integraciones](/integrations/cloud/overview) y Cloud Sensors muestra lo que encontraron.

## KPI

| KPI | Significado |
|-----|---------|
| **Proveedores conectados** | Cuántos proveedores de nube están configurados y conectados. |
| **Agentes descubiertos** | Total de agentes/modelos actualmente visibles entre proveedores. |
| **Agentes activos en la nube** | Agentes todavía presentes en el último descubrimiento. |
| **Retirado automáticamente** | Agentes eliminados por un descubrimiento reciente (desaparecieron del proveedor). |

Cada KPI lleva un minigráfico de 30 días creado a partir del historial de sincronización.

## La tabla de inventario

| Columna | Descripción |
|--------|-------------|
| **Agente** | Nombre del agente/modelo descubierto. |
| **Proveedor** | Azure / AWS / GCP / OpenAI / Antrópico. |
| **Espacio de trabajo/Implementación** | Dónde vive en el proveedor. |
| **Modelo** | Modelo subyacente. |
| **Estado** | `observed`, `active` o `retired` (con un sufijo `· auto` cuando se retira automáticamente por descubrimiento). |
| **Último descubrimiento** | Cuando fue visto por última vez. |

Filtrar por proveedor, estado o búsqueda de texto libre; exporte las filas visibles a CSV.

## Sincronización

Ejecute **Sync** para un único proveedor o **Sync All**. Cada proveedor también expone un cuadro de diálogo **Insights** (uso, costo, detalles de gobernanza específicos de ese proveedor). Las credenciales y la configuración del conector se encuentran en **Administrador → Integraciones → Nube**: esta pestaña enlaza con ella y el estado vacío le indica allí.

## Relacionado

- [Proveedores de IA en la nube](/integrations/cloud/overview): conecte y configure los proveedores.
- [NHI Inventory](/discovery/nhi-inventory): identidades descubiertas por los mismos conectores.
- [Descripción general del inventario y descubrimiento de IA](/discovery/overview)