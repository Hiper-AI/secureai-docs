---
sidebar_position: 1
title: "Seguridad de Red y CASB (SWG)"
sidebar_label: "Visión General CASB"
description: "Descubra la IA oculta a partir de sus registros CASB/SWG/DNS: qué fuentes corporativas llaman API de LLM, sin necesidad de agente"
---

# Integraciones CASB y red (SWG)

Estos conectores resuelven el problema del **descubrimiento de IA en la sombra**: encontrar cada dispositivo, servidor o carga de trabajo corporativo que llama a una API LLM, incluso aquellos en los que no se puede instalar un SDK o el [agente de endpoint](/agent/overview) (un servidor de compilación, un clasificador de almacén, la computadora portátil de un contratista). SecureAI lee los registros que su plataforma **CASB/Secure Web Gateway (SWG)/DNS** ya recopila y detecta el tráfico hacia los proveedores de IA.

El resultado es un inventario en vivo de **qué IP de origen y qué usuarios llaman a qué proveedores de IA**, que apareció en [Fuentes de red](/discovery/network-sources).

## Conectores compatibles

| Conector | Fuente de datos | Estado |
|-----------|-------------|--------|
| [Cisco Umbrella](/integraciones/casb/cisco-umbrella) | API de informes de capa DNS v2 | Disponible |

## El bucle de configuración

1. **Admin → Integraciones → Red** (categoría CASB/SWG).
2. **Conecte** el conector e ingrese sus credenciales (consulte la página de cada conector). Los campos de URL están protegidos por SSRF y los secretos están cifrados en reposo.
3. **Prueba** la conexión.
4. **Sincronización**: la primera sincronización inicia un **relleno** en segundo plano (la vista retrospectiva predeterminada coincide con la ventana de descubrimiento); las sincronizaciones posteriores se ejecutan según una programación (predeterminada cada 30 minutos).

## La ventana de descubrimiento

El descubrimiento de redes informa la actividad durante un período continuo: **30 días de forma predeterminada** (configurable mediante la variable de entorno `NETWORK_DISCOVERY_WINDOW_DAYS`. Algunas subvistas (dominios principales, usuarios principales, dominios desconocidos) utilizan una ventana fija de 7 días. Consulte [Fuentes de red](/discovery/network-sources) para saber cómo se presenta y clasifica el inventario.

## Qué se detecta

Cada conector compara el tráfico con un catálogo seleccionado de dominios LLM/AI conocidos y, cuando la plataforma lo admite, su categoría de contenido nativa "IA generativa". La actividad detectada se agrupa por **IP de origen** y se muestra con el usuario que llama, los proveedores de IA, el volumen de llamadas, el dominio superior, una clasificación de **gravedad** y un indicador de **dominio de amenaza** para destinos de riesgo.

## Relacionado

- [Fuentes de red](/discovery/network-sources): el inventario descubierto y el flujo de trabajo de clasificación.
- [Agente de endpoint](/agent/overview): para endpoints donde *puede* implementar un agente.
- [Descripción general del inventario y descubrimiento de IA](/discovery/overview)