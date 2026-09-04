---
sidebar_position: 6
title: "Endpoints Remotos y Conectividad"
sidebar_label: "Endpoints Remotos"
---

# Endpoints Remotos

Los endpoints remotos le permiten conectar servidores modelo externos o autohospedados a SecureAI a través de controles AI Gateway.

Esto resulta útil cuando su organización ejecuta su propia infraestructura modelo y aún desea una gestión de seguridad centralizada.

## Dónde configurar

Vaya a **Administrador → AI Gateway → Endpoints Remotos**.

## Opciones de registro

- **Instalación rápida**: asistente guiado que genera un flujo de configuración de un solo comando.
- **Registro manual**:
  - **Pegar JSON**
  - Campos **Entrada manual**

## Modos de conectividad

- **Conexión inversa**: recomendado para la mayoría de las implementaciones; conexión saliente, sin puertos entrantes abiertos.
- **Cloudflare Tunnel**: conectividad de confianza cero mediante token de túnel y nombre de host.

## Operaciones Diarias

Para cada endpoint, los administradores pueden:

- ejecutar **Comprobación de estado**
- ejecutar **Verificar mTLS**
- inspeccionar los detalles del terminal (región, huella digital, modelos, última verificación)
- eliminar el endpoint cuando esté fuera de servicio

## Flujo de incorporación sugerido

1. Comience con **Instalación rápida**.
2. Elija el modo de conectividad.
3. Seleccione los modelos requeridos.
4. Completar el registro.
5. Ejecute Health Check y verifique mTLS.
6. Confirme que el endpoint permanezca en buen estado después de 5 a 10 minutos.

## Lista de verificación para solucionar problemas

- Endpoint inalcanzable: verifique el modo de conectividad y los valores del nombre de host.
- TLS aprobado pero en mal estado: verifique el estado del servicio modelo/puerta de enlace remota.
- No conectado: confirme que el servicio remoto se esté ejecutando y que el registro sea válido.

## Mejores prácticas

- Prefiera la conexión inversa a menos que su arquitectura requiera el modo túnel.
- Mantenga clara la propiedad de los endpoints por organización/equipo.
- Vuelva a verificar el estado del endpoint después de cambios de políticas o claves.