---
sidebar_position: 1
title: "Übersicht über MCP-Steckverbinder"
sidebar_label: "Überblick"
description: "Verbinden Sie Model Context Protocol (MCP)-Server, um den Assistenten von SecureAI kontrollierten Zugriff auf Tools zu ermöglichen"
---
# MCP-Anschlüsse

SecureAI kann eine Verbindung zu **Model Context Protocol (MCP)**-Servern herstellen, sodass seine Assistenten unter der Kontrolle externe Tools aufrufen können – Datenbanken abfragen, Tickets lesen, Cloud-Vorgänge ausführen. Konnektoren werden aus einem integrierten Marktplatz ausgewählt und pro Benutzer konfiguriert; Jeder Tool-Aufruf durchläuft weiterhin die Richtlinien- und Sicherheitsschicht von SecureAI.

Konnektoren werden unter **Admin → Integrationen → MCP** (API-Basis `/api/connectors`) verwaltet.

## Transport- und Authentifizierungsmuster

Jeder Connector gibt an, wie SecureAI ihn erreicht und wie er sich authentifiziert. Drei Muster werden unterstützt:

| Muster | Transport | Authentifizierung | Beispiele |
|---------|-----------|------|----------|
| Lokaler Prozess | `stdio` | API-Schlüssel (in Umgebung) | Notion, Cloudflare (lokaler Bin), Azure (`npx @azure/mcp`), AWS (`uvx awslabs.aws-api-mcp-server`), Referenzserver (Sequential Thinking, Web Fetch, Time). |
| Remote (Token) | `streamable_http` | API-Schlüssel/Träger (in env) | GitHub offizielles MCP, die Google Cloud-Familie (BigQuery, Compute, Logging, Vertex AI, Cloud Run, GKE, …), Microsoft Learn. |
| Remote (OAuth) | `streamable_http` | OAuth 2.1 + PKCE, mit dynamischer Client-Registrierung | Cloudflare (offizieller Remote-MCP). Siehe [Remote MCP mit OAuth & DCR](/de/integrations/mcp/remote-oauth-dcr). |

Einige tokenbasierte Remote-Konnektoren (z. B. die Google Cloud-Familie) verfügen auch über einen OAuth-Ablauf, sodass ein Benutzer die Autorisierung mit seinem eigenen Google OAuth-Client über ein Popup durchführen kann, anstatt ein statisches Token einzufügen.

## Anschließen eines Steckers

1. **Admin → Integrationen → MCP.**
2. Wählen Sie einen Steckverbinder vom Marktplatz aus.
3. Geben Sie die erforderliche Konfiguration an – einen API-Schlüssel/Token – oder autorisieren Sie über das OAuth-Popup für OAuth-Konnektoren.
4. Speichern. Der Stecker steht der Werkzeugfräse des Assistenten zur Verfügung.

## Werkzeugsicherheit

Jeder Connector deklariert **blockierte Toolmuster** – zerstörerische Vorgänge (z. B. `delete`, `destroy`, `terminate`), deren Aufruf SecureAI selbst dann verweigert, wenn der MCP-Server sie offenlegt. Diese Leitplanke wird zentral durchgesetzt, sodass ein angeschlossener Tool-Server nicht durch den Assistenten zu einer destruktiven Aktion gezwungen werden kann.

## Verwandte

- [Remote MCP mit OAuth & DCR](/de/integrations/mcp/remote-oauth-dcr)
- [AI Gateway — Remote Endpoints](/de/ai-gateway/remote-endpoints)