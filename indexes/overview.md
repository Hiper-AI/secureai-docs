---
sidebar_position: 1
title: "Bases de Conocimiento y RAG"
sidebar_label: "Bases de Conocimiento & RAG"
---

# Bases de conocimiento y sistema RAG

SecureAI utiliza **Generación de recuperación aumentada (RAG)** para conectar modelos de IA con sus datos y documentos privados, garantizando respuestas seguras, precisas y sensibles al contexto.

---

## ¿Qué es RAG?

**Generación de recuperación aumentada (RAG)** es una técnica de inteligencia artificial que combina modelos de lenguaje con fuentes de conocimiento externas. En lugar de depender únicamente de los datos previamente entrenados del modelo:

1. **Procesamiento de consultas**: el sistema analiza la solicitud del usuario para identificar los requisitos de conocimiento relevantes.
2. **Recuperación de conocimientos**: la búsqueda semántica recupera fragmentos de documentos relevantes de su índice.
3. **Aumento de contexto**: el contexto recuperado se inyecta en el mensaje del modelo.
4. **Generación de respuesta**: La IA genera una respuesta objetiva y fundamentada citando sus documentos.

---

## Tipos de índice en SecureAI

Los índices son bases de conocimiento estructuradas categorizadas por accesibilidad:

| Tipo de índice | Alcance | Acceso y Privacidad | Mejor para |
|---|---|---|---|
| **Índices personales** | Usuario individual | Cifrado de extremo a extremo; almacenamiento sin conocimiento (ni siquiera los administradores pueden leer los contenidos) | Notas personales, investigaciones privadas, documentos de proyectos individuales |
| **Índices de grupo** | Equipos / Departamentos | Acceso basado en roles controlado por pertenencia al grupo | Wikis de departamento, documentación de proyectos de equipo, SOP compartidos |
| **Índices globales** | En toda la organización | Acceso de lectura para todos los usuarios de la empresa | Políticas de empresa, directrices de recursos humanos, manuales para toda la empresa |

### 1. Índices personales
- **Privacidad de conocimiento cero**: sus archivos y conversaciones se cifran con claves de inquilino/usuario.
- **Creación**: 
  - **Usuarios**: abra la interfaz de chat, haga clic en el selector de índice junto al selector de modelo, cambie a la pestaña *Personal* y haga clic en **+**.
  - **Administradores**: ¿Ir a **Administrador? ¿Gestión de índices? Cree un índice** y asígnelo a un usuario específico.

### 2. Índices de grupo
- **Colaboración**: varios miembros del equipo pueden consultar y aportar documentos a la misma base de conocimientos.
- **Creación**:
  - ¿Ir a **Administrador? ¿Gestión de grupos? Cree un grupo**, asigne miembros y vincule un índice de grupo compartido.

### 3. Índices globales
- **Estándares para toda la empresa**: repositorios centralizados para el cumplimiento empresarial, términos legales y pautas operativas.
- **Creación**: ¿Ir a **Administrador? ¿Gestión de índices? Cree un índice** y establezca el alcance en **Global**.

---

## Cómo funciona la indexación

Cuando carga archivos (PDF, documentos de Word, CSV, JSON, Markdown o texto sin formato):

`
¿Documento sin procesar--?  Extracción de texto --?  Fragmentación semántica --?  ¿Incrustaciones de vectores --?  Almacenamiento de vectores (índice)
`

1. **Procesamiento de documentos**: el texto y los metadatos (marcas de tiempo, nombres de archivos) se extraen y limpian.
2. **Fragmentos**: el contenido se divide en fragmentos semánticos optimizados que se superponen para mantener la continuidad contextual.
3. **Generación de incrustaciones**: los fragmentos se convierten en incrustaciones de vectores de alta dimensión.
4. **Almacenamiento vectorial**: las incrustaciones se almacenan en bases de datos vectoriales de alto rendimiento para una recuperación instantánea de similitudes.

---

## Mejores prácticas

- **Nombres**: utilice nombres claros y descriptivos para índices y archivos cargados (por ejemplo, HR-Policy-2026 en lugar de doc1).
- **Preparación de archivos**: asegúrese de que los documentos cargados sean texto claro; limpie los escaneos de baja calidad antes de cargarlos.
- **Límites de archivos**: las cargas estándar admiten archivos de hasta 10 MB por lote.
- **Alcance apropiado**: mantenga notas personales confidenciales en índices personales; mover los recursos del equipo a índices de grupo.