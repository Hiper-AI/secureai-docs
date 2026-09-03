---
sidebar_position: 4
title: "Azure AI Foundry"
sidebar_label: "Azure AI Foundry"
description: "Verbinden Sie Azure AI Foundry/Azure OpenAI, damit SecureAI Agenten, Modelle, Identitäten, RBAC, Nutzung und Kosten inventarisieren kann"
---
# Azure AI Foundry

Verbinden Sie Ihren Azure-Mandanten, damit SecureAI Azure OpenAI/AI Foundry-Agenten, AI Search, Bot Service und ML-Endpunkte sowie die Entra-Identitäten und RBAC, die sie steuern, inventarisieren kann.

## Was SecureAI importiert

- **Azure OpenAI/AI Foundry-Agenten, AI Search, Bot Service und ML-Endpunkte**
- **NHIs** – Entra-Dienstprinzipale, App-Geheimnisse und -Zertifikate sowie verwaltete Identitäten (widerruflich – siehe [NHI Inventory](/de/en/discovery/nhi-inventory))
– **Azure RBAC** Rollenzuweisungen
- **Aktivitätsprotokolle**
- **Nutzung, Token und Ausgaben** für die letzten 30 Tage

## Voraussetzungen

– Eine **Entra ID (Azure AD)-App-Registrierung** (Dienstprinzipal) mit einem Client-Geheimnis.
- **Microsoft Graph-Anwendungsberechtigungen** mit Zustimmung des Administrators gewährt:
  - `Application.Read.All`, `Directory.Read.All`, `AuditLog.Read.All` (lesen).
  - `Application.ReadWrite.All` – **nur**, wenn Sie möchten, dass SecureAI Identitäten an der Quelle widerruft.
– Der Dienstprinzipal hat den relevanten Abonnements/Ressourcengruppen eine **Leser**-Rolle zugewiesen.

## Anmeldeinformationen

| Feld | Erforderlich | Beschreibung |
|-------|----------|-------------|
| `tenantId` | Ja | Verzeichnis-(Mandanten-)ID. |
| `clientId` | Ja | Anwendungs-(Client-)ID der App-Registrierung. |
| `clientSecret` | Ja | Kundengeheimnis. Im Ruhezustand verschlüsselt. |
| `subscriptionId` | Nein | Bereichserkennung für ein bestimmtes Abonnement. |

SecureAI authentifiziert sich über OAuth2 (Service-Principal-Flow für Client-Anmeldeinformationen).

### Wo man sie bekommt

1. Gehen Sie im [Azure-Portal](https://portal.azure.com/) zu **Microsoft Entra ID → App-Registrierungen → Neue Registrierung**.
2. Kopieren Sie die **Verzeichnis-ID (Mandant)** und die **Anwendungs-ID (Client)** aus der Übersicht der App.
3. Erstellen Sie unter **Zertifikate und Geheimnisse** ein **Client-Geheimnis** und kopieren Sie dessen Wert.
4. Fügen Sie unter **API-Berechtigungen** die oben genannten Microsoft Graph-Berechtigungen hinzu und **Administratoreinwilligung erteilen**.
5. Weisen Sie der App die Rolle **Leser** für das Zielabonnement zu (**Abonnements → Zugriffskontrolle (IAM)**).

## Verbinden

1. **Admin → Integrationen → Cloud → Azure AI Foundry → Verbinden.**
2. Geben Sie Mandant, Client, Geheimnis (und optionales Abonnement) ein.
3. **Testen**, dann **Speichern**.
4. **Synchronisierung** (Azure-Synchronisierungen können mehrere Minuten dauern – Multi-Service + Graph + Aktivitätsprotokoll-Sweeps).

## Überprüfen

Öffnen Sie [Cloud Sensors](/de/en/discovery/cloud-sensors) für erkannte Agenten/Endpunkte und [NHI Inventory](/de/en/discovery/nhi-inventory) für Dienstprinzipale, Geheimnisse und verwaltete Identitäten. Einblicke zeigen RBAC, Nutzung und Ausgaben.

## Widerruf

Entra-Dienstprinzipale, App-Geheimnisse/-Zertifikate und verwaltete Identitäten können über Microsoft Graph von [NHI Inventory](/de/en/discovery/nhi-inventory) **widerruflich** werden – hierfür ist die oben genannte `Application.ReadWrite.All`-Berechtigung erforderlich.

## Verwandte

- [Übersicht Cloud-KI-Anbieter](/de/en/integrations/cloud/overview)
- [Microsoft Entra ID SSO](/de/en/iam/microsoft-entra-id)
- [NHI Inventory](/de/en/discovery/nhi-inventory)