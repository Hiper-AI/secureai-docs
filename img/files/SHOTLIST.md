# Shot list — Archivos: Google Drive y SharePoint (SEC-321)

SecureAI: Chrome headless contra una instancia local (1440×900, PNG), con los IDs reales
difuminados. Google Cloud / Entra: consolas reales, proyecto de prueba `secureai-drive-sec321`
y app "SecureAI Files (SEC-321 test)" del directorio de Hiper AI, con IDs y secreto difuminados
(JPG, 800×600 — se pueden reemplazar por capturas de mayor resolución con el mismo nombre).

## google-drive/ (integrations/files/google-drive.md)
1. `1 - Google Drive.png` — SecureAI: Integraciones → Archivos, las dos tarjetas — lista
2. `2 - Google Drive.png` — SecureAI: drawer, paso 1 con origen y las **dos** restricciones (origen/* y docs.google.com/*) — **rehacer** cuando el drawer nuevo (SEC-321 E2E) esté desplegado en QA
3. `3 - Google Drive.jpg` — Google Cloud: Google Drive API habilitada — lista
4. `4 - Google Drive.jpg` — Google Cloud: Google Picker API habilitada — lista
5. `5 - Google Drive.jpg` — Google Auth Platform: público "Interno" — lista
6. `6 - Google Drive.jpg` — Crear cliente: Aplicación web + origen de JavaScript — lista
7. `7 - Google Drive.jpg` — Cliente OAuth creado (ID y secreto difuminados) — lista
8. `8 - Google Drive.jpg` — API key: solo Google Picker API + Sitios web — **rehacer**: tiene que mostrar las dos restricciones (origen/* y https://docs.google.com/*)
9. `9 - Google Drive.png` — SecureAI: "Probar conexión" en verde — lista (sumar "Probar inicio de sesión" cuando se haga el E2E con login)
10. `10 - Google Drive.png` — SecureAI: menú de adjuntar con "Añadir desde Drive" — lista
11. `11 - Google Drive.png` — Selector de Google Drive abierto — **pendiente** (el E2E del 2026-10-18 lo abrió en QA con la cuenta de Juan; falta capturarlo con archivos de ejemplo, no internos)

## sharepoint/ (integrations/files/sharepoint.md)
1. `1 - SharePoint.png` — SecureAI: drawer, paso 1 con la URI de redirección — lista
2. `2 - SharePoint.jpg` — Entra: Registros de aplicaciones → Nuevo registro — lista
3. `3 - SharePoint.jpg` — Entra: formulario de registro con plataforma SPA — **pendiente** (bloque quitado del texto)
4. `4 - SharePoint.jpg` — Entra: Información general (IDs difuminados) — lista
5. `5 - SharePoint.jpg` — Entra: permisos delegados de Microsoft Graph — lista
6. `6 - SharePoint.jpg` — Entra: consentimiento de administrador concedido — lista
7. `7 - SharePoint.png` — SecureAI: "Probar conexión" en verde — lista
8. `8 - SharePoint.png` — SecureAI: menú de adjuntar — lista
9. `9 - SharePoint.png` — SecureAI: explorador de SharePoint con sitios — **pendiente** (el directorio de Hiper AI no tiene Microsoft 365 / SharePoint Online: requiere un tenant con licencia)
