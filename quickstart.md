---
title: "Guía de Inicio Rápido (Quickstart)"
description: "Comienza a utilizar SecureAI en minutos: acceso a la plataforma, configuración del asistente y creación de tu primer índice RAG."
sidebar_label: "Inicio Rápido"
---


Esta guía te acompañará paso a paso para acceder a la instancia de SecureAI de tu organización, elegir tu método de autenticación y desplegar tu primera base de conocimiento con IA.

---

<Steps>
  <Step title="Acceder a tu instancia corporativa">
    Ingresa en tu navegador web a la dirección provista para tu organización:

    ```bash
    https://{tu-empresa}.hiperai.ai
    ```

    Haz clic en el botón principal **"Get Started"** para iniciar el flujo de acceso.
  </Step>

  <Step title="Seleccionar método de autenticación">
    Dependiendo del plan contratado por tu empresa, selecciona el método correspondiente:

    <Tabs>
      <Tab title="Cuenta Corporativa (SSO)">
        Si tu organización tiene integrado **Microsoft Entra ID (Azure)** o **Google Workspace**, haz clic en **"Enterprise account"**.
        
        Serás redirigido automáticamente a tu proveedor de identidad habitual para iniciar sesión de forma segura y federada.
      </Tab>
      <Tab title="Autenticación Básica">
        Si tu equipo aún no ha federado el inicio de sesión con SSO, selecciona la opción **"Basic Auth"** e ingresa con tu correo y contraseña provistos por el administrador.
      </Tab>
    </Tabs>
  </Step>

  <Step title="Configurar preferencias del Asistente">
    Al ingresar por primera vez, verás un asistente de bienvenida (**Startup Setup**) que te permite calibrar cómo interactuará la IA contigo:

    - **Temperatura (`Temperature`)**: Ajusta el balance entre precisión analítica (valores bajos) y creatividad en las respuestas (valores altos).
    - **Longitud de Respuesta (`Response Length`)**: Define el tamaño predeterminado de los mensajes generados.
    - **Tema de Interfaz (`Theme`)**: Selecciona entre modo claro, modo oscuro o sincronización con el sistema.
    - **Avatar con IA**: Con licencias premium, puedes generar un avatar personalizado mediante un prompt de texto.

  </Step>

  <Step title="Crear tu primer índice RAG (Knowledge Base)">
    Durante la configuración inicial, podrás desplegar tu propio **índice RAG (Retrieval-Augmented Generation)**:

    - **Despliegue Multi-Nube**: Selecciona la región y el proveedor de nube de tu preferencia.
    - **Cifrado Extremo a Extremo**: Toda la información y documentos vectorizados se cifran con claves exclusivas.
    - **Base de Conocimiento Personal o de Equipo**: Permite subir documentos (PDFs, docs, código) para que los modelos respondan con el contexto exacto de tu negocio.

  </Step>

  <Step title="Conectar fuentes de descubrimiento y visibilidad (Cloud, CASB y Agente)">
    Para obtener visibilidad completa y auditar el uso de IA en tu organización, recomendamos habilitar las tres fuentes principales de descubrimiento:

    - **Integrar Nubes y Proveedores de AI (Inventario de NHIs)**: Conecta consolas como OpenAI, Anthropic, AWS o Azure AI en [Cloud Providers](/integrations/cloud/overview). Esto permite rastrear automáticamente **Identidades No Humanas (NHIs)**, claves de API huérfanas y consumo en la nube.
    - **Integrar CASB & Seguridad de Red (SWG)**: Conecta [Cisco Umbrella](/integrations/casb/overview) u otros proxies para monitorear el tráfico corporativo hacia servicios externos de IA.
    - **Desplegar el SecureAI Agent en dispositivos**: Instala el [SecureAI Endpoint Agent](/agent/installation) en las computadoras de tu equipo para auditar aplicaciones locales, detectar servidores y conectores **MCP (Model Context Protocol)**, agentes autónomos y aplicar políticas de control de salida (*egress enforcement*).

  </Step>

  <Step title="¡Listo! Comienza a interactuar y gobernar">
    Una vez completada la configuración y conectadas tus fuentes, tendrás acceso al chat corporativo seguro, tus bases de conocimiento RAG y el panel de telemetría y gobernanza en tiempo real.
  </Step>
</Steps>

---

## 🚀 Próximos Pasos

Continúa explorando todo lo que puedes hacer con la plataforma:

<CardGroup cols={2}>
  <Card title="Modelos Disponibles" icon="brain" href="/models">
    Compara las fortalezas de cada modelo y cuándo elegir cada uno.
  </Card>
  <Card title="Integración vía API" icon="code" href="/api">
    Conecta tus sistemas internos mediante endpoints OpenAI-compatibles.
  </Card>
  <Card title="Seguridad & SMLTP" icon="shield-halved" href="/security/overview">
    Aprende cómo SecureAI previene la fuga de información confidencial (DLP).
  </Card>
  <Card title="Instalar Agente de Endpoint" icon="network-wired" href="/agent/overview">
    Monitorea y gobierna el uso de herramientas de IA en los equipos de tu empresa.
  </Card>
</CardGroup> 
