---
sidebar_position: 2
title: "Remote-MCP mit OAuth und DCR"
sidebar_label: "Remote-OAuth und DCR"
description: "Wie SecureAI mithilfe von OAuth 2.1, PKCE und Dynamic Client Registration eine Verbindung zu Remote-MCP-Servern herstellt"
---
# Remote-MCP mit OAuth und DCR

Einige Remote-MCP-Server autorisieren den Zugriff mit **OAuth 2.1** anstelle eines statischen API-Tokens. SecureAI unterstützt dies durchgängig, einschließlich **PKCE** und **Dynamic Client Registration (DCR)**, sodass Sie keine OAuth-Anwendung vorab registrieren müssen. Das Referenzbeispiel ist der **Cloudflare Official Remote MCP**-Connector (`cloudflare-remote`).

## So funktioniert der Ablauf

1. **Dynamische Client-Registrierung (RFC 7591).** Wenn ein Connector ein `registrationUrl` deklariert und kein statisches `clientId` hat, registriert sich SecureAI als öffentlicher PKCE-Client unter dieser URL und speichert das resultierende `client_id` zwischen. Wenn sich der Umleitungs-URI ändert, wird er automatisch neu registriert. (Bei Connectors, die eine statische Client-ID liefern, wird dieser Schritt übersprungen.)
2. **Autorisierung + PKCE (S256).** SecureAI generiert einen PKCE-Verifizierer/eine PKCE-Challenge, erstellt die Autorisierungs-URL mit `code_challenge` und `code_challenge_method=S256` und leitet den Administrator/Benutzer an den Anbieter weiter, um Zugriff zu gewähren.
3. **Rückruf.** Der Anbieter leitet zurück zu `GET /api/connectors/oauth/callback/:slug`. Diese Route wird durch den undurchsichtigen Parameter `state` (abgeglichen mit einem kurzlebigen, 10-minütigen PKCE-Speicher) und nicht durch eine Sitzung gesichert, sodass keine Authentifizierungs-Middleware erforderlich ist.
4. **Token-Austausch und -Speicherung.** SecureAI tauscht den Code (mit dem PKCE-Verifizierer) gegen Tokens aus und speichert diese **pro Benutzer**. Das Zugriffstoken wird dann für die Tool-Aufrufe dieses Benutzers in den MCP-Transport eingefügt (z. B. als `BEARER_TOKEN`).

## Anschließen eines OAuth-MCP-Connectors

1. **Admin → Integrationen → MCP** und wählen Sie einen OAuth-Connector aus (z. B. Cloudflare Official Remote MCP).
2. Klicken Sie auf **Autorisieren** – ein Popup öffnet den Zustimmungsbildschirm des Anbieters.
3. Genehmigen Sie die angeforderten Bereiche.
4. Bei Erfolg werden Sie zurückgeleitet und der Connector wird als verbunden angezeigt.

## Notizen

- **Token pro Benutzer.** Jeder Benutzer autorisiert individuell; Toolaufrufe werden mit der eigenen Berechtigung des Benutzers ausgeführt, nicht mit gemeinsamen Anmeldeinformationen.
– **PKCE ist erforderlich** für diese Connectors (`pkceRequired: true`), daher wird kein Client-Geheimnis für öffentliche Clients gespeichert.
- **Statische Client-Konnektoren.** Wenn Ihre Organisation einen OAuth-Client vorregistriert, geben Sie dessen Client-ID/Geheimnis an und SecureAI verwendet es anstelle von DCR.

## Verwandte

- [MCP Connectors Übersicht](/de/integrations/mcp/overview)
- [AI Gateway — Remote Endpoints](/de/ai-gateway/remote-endpoints)