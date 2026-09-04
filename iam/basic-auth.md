---
sidebar_position: 4
title: "Autenticación Básica (Usuario y Contraseña)"
sidebar_label: "Autenticación Básica"
---

# Autenticación básica

La autenticación básica proporciona un método simple de autenticación de nombre de usuario y contraseña para SecureAI. Los usuarios se autentican en nuestra base de datos utilizando sus credenciales, con soporte de autenticación multifactor opcional.

## ¿Qué es la autenticación básica?

**Autenticación básica** es un método de autenticación simple que utiliza credenciales de nombre de usuario y contraseña para autenticar a los usuarios en nuestra base de datos. Es el método de autenticación más sencillo disponible en SecureAI.

## Características clave

### **Inicio de sesión sencillo**
- **Nombre de usuario y contraseña**: los usuarios proporcionan sus credenciales para iniciar sesión
- **Autenticación de base de datos**: las credenciales se verifican con nuestra base de datos
- **Almacenamiento seguro**: las contraseñas se almacenan y codifican de forma segura

### **Autenticación multifactor (MFA)**
- **Google Authenticator**: los usuarios pueden inscribir su aplicación Google Authenticator
- **Microsoft Authenticator**: compatibilidad con la aplicación Microsoft Authenticator
- **Configuración de código QR**: proceso de inscripción sencillo con códigos QR
- **Códigos de respaldo**: códigos de recuperación para acceder a la cuenta

### **Configuración OTP de correo electrónico**
- **OTP de correo electrónico predeterminada**: la OTP de correo electrónico está habilitada de forma predeterminada como segundo factor
- **Desactivación por usuario**: los administradores pueden desactivar la OTP de correo electrónico para usuarios específicos
- **Alternativa MFA**: los usuarios pueden cambiar de OTP de correo electrónico a aplicaciones de autenticación

## Cómo funciona

### **Flujo de autenticación**
1. **Inicio de sesión de usuario**: El usuario ingresa nombre de usuario y contraseña
2. **Verificación de credenciales**: el sistema verifica las credenciales con la base de datos
3. **Segundo factor**: OTP enviada por correo electrónico o se requiere código de aplicación MFA
4. **Acceso concedido**: el usuario obtiene acceso a la plataforma SecureAI

### **Comportamiento del segundo factor**
- **Antes de la configuración de MFA**: la OTP de correo electrónico siempre se requiere como segundo factor
- **Después de la configuración de MFA**: el usuario puede elegir entre OTP por correo electrónico o código MFA
- **Opciones de inicio de sesión**: el usuario selecciona el método de segundo factor preferido durante el inicio de sesión
- **Reserva**: la OTP de correo electrónico sigue estando disponible como opción de copia de seguridad

## Experiencia de usuario

### **Inicio de sesión por primera vez (antes de MFA)**
- Ingrese nombre de usuario y contraseña
- Recibir OTP por correo electrónico como segundo factor
- Acceda a la plataforma SecureAI

### **Proceso de configuración de MFA**
1. **Navegue al Chat**: Vaya a "/chat-ai/new-chat" o a cualquier página de chat
2. **Abrir menú de perfil**: haga clic en la imagen de perfil en la esquina superior derecha
3. **Configuración de acceso**: seleccione "Configuración" en el menú desplegable
4. **Vaya a Seguridad**: haga clic en la pestaña "Seguridad"
5. **Habilitar MFA**: haga clic en "Habilitar autenticación multifactor"
6. **Escanear código QR**: use Google o Microsoft Authenticator para escanear el código QR
7. **Ingrese el código**: ingrese el código de 6 dígitos de su aplicación de autenticación
8. **Guardar códigos de respaldo**: almacene los códigos de respaldo generados de forma segura

### **Iniciar sesión después de la configuración de MFA**
- Ingrese nombre de usuario y contraseña
- Elija el método del segundo factor:
  - **OTP por correo electrónico**: reciba el código por correo electrónico
  - **Código MFA**: ingrese el código de la aplicación de autenticación
- Acceda a la plataforma SecureAI

### **Uso del código de respaldo**
- Utilice códigos de respaldo si la aplicación de autenticación no está disponible
- Cada código de respaldo solo se puede usar una vez
- Generar nuevos códigos de respaldo si es necesario

## Funciones de seguridad

### **Seguridad de contraseña**
- **Hashing fuerte**: las contraseñas se codifican de forma segura
- **Almacenamiento de base de datos**: Credenciales almacenadas en nuestra base de datos
- **Transmisión segura**: todos los datos de autenticación cifrados

### **Seguridad MFA**
- **Códigos basados en tiempo**: las aplicaciones de autenticación generan códigos basados en tiempo
- **Inscripción segura**: configuración segura basada en código QR
- **Recuperación de copia de seguridad**: códigos de copia de seguridad para recuperación de cuenta

### **Gestión de sesiones**
- **Sesiones seguras**: gestión de sesiones cifradas
- **Protección de tiempo de espera**: tiempo de espera automático de la sesión
- **Control de sesiones simultáneas**: gestiona múltiples sesiones activas

## Empezando

1. **Habilitar autenticación básica**: configurar en el panel de administración
2. **Crear cuentas de usuario**: configurar las credenciales de usuario
3. **Configurar MFA**: habilitar la autenticación multifactor
4. **Capacitación de usuarios**: eduque a los usuarios sobre el proceso de inicio de sesión
5. **Monitorear el uso**: realizar un seguimiento de los patrones de autenticación

## Próximos pasos

- [Google Workspace](/iam/google-workspace) - Integrar con Google Workspace
- [ID de Microsoft Entra](/iam/microsoft-entra-id) - Conéctese con ID de Microsoft Entra
- [Descripción general de IAM](/iam/overview) - Obtenga más información sobre la gestión de identidades