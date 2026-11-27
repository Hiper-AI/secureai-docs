---
title: "Apps de IA de escritorio y cuentas de Google"
sidebarTitle: "Apps de IA y cuentas"
description: "Qué apps de IA de escritorio reconoce el agente, qué hace con una app no aprobada y cómo limitar Gemini, NotebookLM y AI Studio a las cuentas de su empresa"
---

## Apps de IA de escritorio

El agente reconoce una app de IA por el nombre de producto del ejecutable y por su firmante verificado. Un ejecutable
sin firma o con la firma alterada no cuenta como la app.

| Apps | Desde qué versión del agente |
|---|---|
| ChatGPT, Claude, Copilot, LM Studio, Ollama, Comet, Dia y Grammarly | 1.3.5 |
| Gemini, Jan, goose y Msty | posterior a la 1.3.5 |

### Qué hace con una app no aprobada

Con la regla de IA no aprobada de la política en vigor y el sitio de la app sin aprobar:

- en **block** o **redirect**, el agente cierra la app y sus procesos hijos y le muestra al colaborador un aviso, con un
  botón al chat de SecureAI de su organización si lo tiene. Si la vuelve a abrir, la cierra otra vez;
- en **warn**, solo muestra el aviso.

El agente cierra la app en lugar de cortarle la red porque Copilot corre dentro de WebView2, el mismo componente que
usan Teams y Outlook: un corte de red sobre ese componente los dejaría sin conexión.

### Qué se registra

Cada cierre aparece en el gráfico de IA no aprobada como **App de escritorio cerrada**, con el nombre de la app, y sale
al SIEM como `endpoint_shadow_ai` (ver [Alertas y SIEM](/agent/alerts-and-siem)).

Si además tiene encendidos los [cuadros de IA](/agent/ai-input-boxes), el agente revisa lo que el colaborador escribe en
las apps aprobadas.

## Gemini, NotebookLM y AI Studio solo con cuentas de la empresa

Puede pedirle a Google que rechace en Chrome, Edge y Brave el inicio de sesión de toda cuenta que no sea de los dominios
de su empresa. El agente escribe la política `AllowedDomainsForApps` de cada navegador en el registro de Windows con
la lista de dominios. La regla vale para toda la sesión de Google en esos navegadores, no solo para Gemini.

<Note>
Requiere una versión de SecureAI Agent posterior a la 1.3.5, en Windows. La consola todavía no muestra este campo:
se configura por la API de políticas, en `vendorPolicies.browserAi.googleAccountDomains`.
</Note>

- Hasta 20 dominios, sin comodines ni esquema (`empresa.com`, no `*.empresa.com`).
- SecureAI rechaza los dominios de correo públicos, como `gmail.com`.
- Agregar un dominio o vaciar la lista pide MFA reciente, como todo cambio que afloja la política.
- Si la lista no es válida, el agente deja el valor que estaba y lo reporta.
- Si su área de IT ya fijó `AllowedDomainsForApps` por GPO, el agente no lo toca y lo reporta como administrado por IT.
- Sin dominios en la política, el agente borra el valor que había escrito.

El colaborador no ve un aviso de SecureAI: ve el rechazo de Google cuando intenta entrar con otra cuenta. Para el mismo
control desde la extensión, en todos los proveedores que lo permiten, vea
[Solo cuentas corporativas](/extension/corporate-accounts).

## Relacionado

- [Políticas y grupos](/agent/policies-and-groups)
- [Cuadros de IA](/agent/ai-input-boxes)
