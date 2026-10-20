---
sidebar_position: 4
title: "Azure — Erkennung"
sidebarTitle: "Azure"
icon: "/img/icons/azure.svg"
sidebar_label: "Azure — Erkennung"
description: "Verbinden Sie Azure und Microsoft Entra ID, damit SecureAI Ihre Azure-OpenAI- und Foundry-Ressourcen, Foundry-Projekte und -Agenten, AI Search, Bot Service und jede nicht-menschliche Identität (Dienstprinzipale, Agentidentitäten, verwaltete Identitäten, Geheimnisse, Zertifikate und föderierte Anmeldeinformationen) mit ihren Berechtigungen sowie RBAC, Aktivität, Nutzung und Kosten inventarisieren kann."
---

# Azure — Erkennung

Verbinden Sie Ihren Azure-Mandanten, damit SecureAI Ihre KI-Ressourcen in Azure und **jede nicht-menschliche Identität (NHI)** in Microsoft Entra ID inventarisieren kann, einschließlich der Rollen und Berechtigungen, die jede Identität besitzt.

<Info>
Diese Verbindung **liest nur** und sendet nie einen Prompt. Wenn Sie den LLM-Datenverkehr von SecureAI stattdessen über Ihre eigene Foundry-Ressource laufen lassen möchten, lesen Sie [Azure AI Foundry — Inference in your account](/en/integrations/cloud/azure-ai-foundry-inference). Es sind zwei voneinander unabhängige Verbindungen mit unterschiedlichen Dienstprinzipalen und Berechtigungen. Sie können beide für dasselbe Abonnement verwenden.
</Info>

## Was SecureAI importiert

Für jedes Abonnement, das der Dienstprinzipal lesen kann:

- **KI-Ressourcen**: jedes Konto für Azure AI Services, Azure OpenAI und andere Cognitive Services (Content Safety, Speech, Language, Document Intelligence …) mit Region und Status.
- **Modellbereitstellungen** von Azure OpenAI und Foundry mit ihrer Kapazität und der Nutzung der letzten 30 Tage (Anfragen, Eingabe- und Ausgabetoken, aus Azure Monitor).
- **Foundry-Projekte und -Agenten**: die Agenten des Foundry Agent Service und die klassischen Assistenten jedes Projekts, mit dem jeweils verwendeten Modell. Außerdem Hubs und hubbasierte Projekte (Azure Machine Learning) mit ihren Online- und Serverless-Endpunkten.
- **Azure AI Search** und **Azure Bot Service**.
- **Kosten** des aktuellen Monats nach Dienst (Cost Management).
- **Aktivität**: Verwaltungsereignisse für Cognitive Services und Machine Learning der letzten 30 Tage (Aktivitätsprotokoll).
- **NHIs**, aufgelistet im [NHI-Inventar](/de/discovery/nhi-inventory):
  - **Dienstprinzipale** von Unternehmensanwendungen.
  - **Agentidentitäten** von Microsoft Entra, die Foundry für jeden Agenten erstellt (als *Agent* klassifiziert).
  - **Verwaltete Identitäten**, system- und benutzerzugewiesen.
  - **Clientgeheimnisse** und **Zertifikate** von App-Registrierungen, mit ihrem Ablaufdatum.
  - **Föderierte Anmeldeinformationen** (Workload Identity Federation). Beispielsweise erlaubt eine GitHub-Actions-OIDC-Vertrauensstellung diesem Repository, Token als die Anwendung zu erhalten, ganz ohne Geheimnis.
  - Die **letzte Anmeldung** jeder Anwendung, sofern Ihr Mandant diesen Bericht bereitstellt.
- **Berechtigungen jeder Identität**: ihre Azure-RBAC-Rollen in jedem Bereich des Abonnements (Abonnement, Ressourcengruppe oder Ressource), ihre Microsoft-Graph-Anwendungsberechtigungen und ihre Entra-Verzeichnisrollen.
- **RBAC-Rollenzuweisungen**: jede Rolle mit ihrem Namen sowie den Benutzern, Gruppen und Anwendungen, die sie innehaben.

Eine Identität wird als **privilegiert** markiert, wenn sie eines der Folgenden besitzt:

- eine der Rollen **Owner**, **Contributor**, **User Access Administrator** oder **Role Based Access Control Administrator**;
- eine Graph-Schreibberechtigung, etwa `Application.ReadWrite.All`, `Directory.ReadWrite.All`, `Mail.Send` oder `Files.ReadWrite.All`;
- eine Verzeichnis-Administratorrolle, etwa Global Administrator oder Application Administrator.

Die Geheimnisse, Zertifikate und föderierten Anmeldeinformationen einer privilegierten Anwendung werden ebenfalls als privilegiert markiert.

SecureAI importiert weder die rund 130 Dienstprinzipale, die Microsoft in jedem Mandanten anlegt (Azure Portal, Microsoft Graph usw.), noch Verbindungen für die soziale Anmeldung: Das sind nicht Ihre Identitäten, die Sie verwalten müssten.

## Voraussetzungen

Eine **App-Registrierung** in Microsoft Entra ID (Dienstprinzipal) mit einem **Clientgeheimnis** und diesen Berechtigungen:

| Wo | Berechtigung | Erforderlich? | Was sie ermöglicht |
|----|--------------|---------------|--------------------|
| Abonnement | Rolle **Reader** | Ja | Ressourcen, Bereitstellungen, Projekte, verwaltete Identitäten, Rollenzuweisungen, Nutzung und Aktivität |
| Abonnement | Rolle **Cost Management Reader** | Empfohlen | Kosten des laufenden Monats nach Dienst |
| Foundry-Ressource | Rolle **Cognitive Services Data Reader** | Empfohlen | Die Agenten jedes Foundry-Projekts |
| Microsoft Graph | `Application.Read.All` (Anwendungsberechtigung) | Ja | Dienstprinzipale, Agentidentitäten, Anwendungen, Geheimnisse, Zertifikate, föderierte Anmeldeinformationen und Graph-Berechtigungen |
| Microsoft Graph | `Directory.Read.All` (Anwendungsberechtigung) | Ja | Verzeichnisrollen und die Namen der Mitglieder jeder Rolle |
| Microsoft Graph | `AuditLog.Read.All` (Anwendungsberechtigung) | Empfohlen | Letzte Anmeldung jeder Anwendung |
| Microsoft Graph | `Application.ReadWrite.All` (Anwendungsberechtigung) | Nur zum Widerrufen | Dienstprinzipale deaktivieren sowie Geheimnisse, Zertifikate und föderierte Anmeldeinformationen aus SecureAI löschen |

Die Graph-Berechtigungen benötigen die **Administratoreinwilligung**. Um **alle** Ihre Abonnements zu lesen, weisen Sie **Reader** für jedes einzelne zu oder für eine Verwaltungsgruppe, die sie enthält.

<Note>
Foundry-Agenten befinden sich in der Datenebene des Projekts, nicht im Azure Resource Manager: **Reader reicht nicht aus, um sie zu sehen**. Ohne **Cognitive Services Data Reader** (oder **Foundry User**) für die Foundry-Ressource funktioniert die Synchronisierung weiterhin, aber die Agentenliste bleibt leer und SecureAI meldet dies als Lücke. Cognitive Services Data Reader ist die engste Rolle, die das erlaubt: nur Lesezugriff auf die Datenebene.
</Note>

## Schritt 1. Dienstprinzipal erstellen

### Mit der Azure CLI

In [Azure Cloud Shell](https://shell.azure.com/) oder mit der `az` CLI. Ersetzen Sie `SUB_ID` durch Ihr Abonnement und, wenn Sie Foundry verwenden, `MY_RESOURCE` und `MY_RG` durch Ihre Ressource und Ihre Ressourcengruppe:

```bash
SUB_ID=00000000-0000-0000-0000-000000000000

# 1. App registration + service principal
APP_ID=$(az ad app create --display-name "SecureAI Discovery" --query appId -o tsv)
az ad sp create --id "$APP_ID"

# 2. Client secret (shown only once: copy it now)
az ad app credential reset --id "$APP_ID" --display-name secureai --years 1 \
  --query "{tenantId:tenant, clientId:appId, clientSecret:password}" -o json

# 3. Microsoft Graph application permissions + admin consent
#    Application.Read.All, Directory.Read.All, AuditLog.Read.All
az ad app permission add --id "$APP_ID" --api 00000003-0000-0000-c000-000000000000 \
  --api-permissions 9a5d68dd-52b0-4cc2-bd40-abcf44ac3a30=Role \
                    7ab1d382-f21e-4acd-a863-ba3e13f7da61=Role \
                    b0afded3-3588-46d8-8b3d-9842eff778da=Role
az ad app permission admin-consent --id "$APP_ID"

# 4. Azure RBAC on the subscription
az role assignment create --assignee "$APP_ID" --role "Reader" --scope "/subscriptions/$SUB_ID"
az role assignment create --assignee "$APP_ID" --role "Cost Management Reader" --scope "/subscriptions/$SUB_ID"

# 5. (Recommended) read the agents of your Foundry resource
RID=$(az cognitiveservices account show -n MY_RESOURCE -g MY_RG --query id -o tsv)
az role assignment create --assignee "$APP_ID" --role "Cognitive Services Data Reader" --scope "$RID"
```

Schritt 2 gibt die drei Werte aus, die Sie in SecureAI einfügen. Um **aus SecureAI heraus zu widerrufen**, fügen Sie in Schritt 3 zusätzlich `1bfefb4e-e0b5-418b-a88f-73c46d2cc8e9=Role` (`Application.ReadWrite.All`) hinzu und erteilen Sie die Einwilligung erneut.

### Mit dem Azure-Portal

1. Gehen Sie im [Azure-Portal](https://portal.azure.com/) zu **Microsoft Entra ID → App-Registrierungen → Neue Registrierung**, vergeben Sie einen Namen (zum Beispiel `SecureAI Discovery`) und registrieren Sie die App.
2. Kopieren Sie unter **Übersicht** die **Verzeichnis-ID (Mandant)** und die **Anwendungs-ID (Client)**.
3. Erstellen Sie unter **Zertifikate & Geheimnisse → Clientgeheimnisse → Neuer geheimer Clientschlüssel** ein Geheimnis und kopieren Sie dessen **Wert** (er wird nur einmal angezeigt).
4. Fügen Sie unter **API-Berechtigungen → Berechtigung hinzufügen → Microsoft Graph → Anwendungsberechtigungen** `Application.Read.All`, `Directory.Read.All` und `AuditLog.Read.All` hinzu (und `Application.ReadWrite.All`, wenn Sie aus SecureAI heraus widerrufen möchten). Klicken Sie dann auf **Administratoreinwilligung erteilen**.
5. Weisen Sie unter **Abonnements → Ihr Abonnement → Zugriffssteuerung (IAM) → Rollenzuweisung hinzufügen** der Anwendung die Rollen **Reader** und **Cost Management Reader** zu.
6. Weisen Sie unter **Ihre Foundry-Ressource → Zugriffssteuerung (IAM)** der Anwendung die Rolle **Cognitive Services Data Reader** zu.

<Info>
Azure-Rollen können **bis zu 5 Minuten** brauchen, bis sie wirksam sind, die Graph-Einwilligung einige Minuten länger. Zeigt die erste Synchronisierung Lücken bei Berechtigungen, die Sie gerade erteilt haben, warten Sie und synchronisieren Sie erneut.
</Info>

<Warning>
Behandeln Sie das Geheimnis wie ein Passwort. SecureAI speichert es **verschlüsselt** und zeigt es nie wieder an. Geheimnisse **laufen ab** (mit dem obigen Befehl nach einem Jahr): Erneuern Sie es rechtzeitig, sonst funktioniert die Synchronisierung ab diesem Tag nicht mehr.
</Warning>

## Schritt 2. Azure in SecureAI verbinden

1. Gehen Sie zu **Admin → Integrationen**, filtern Sie nach **Cloud** und klicken Sie auf der Karte **Azure — Erkennung** auf **Integration verbinden**.
2. Füllen Sie die Felder aus:

   | Feld | Was einzutragen ist |
   |------|---------------------|
   | **Azure Tenant ID (Directory ID)** | `tenantId` aus Schritt 1 |
   | **App Registration Client ID** | `clientId` aus Schritt 1 |
   | **App Registration Client Secret** | `clientSecret` aus Schritt 1. Wird verschlüsselt gespeichert. |
   | **Subscription ID** (optional) | Beschränkt das Lesen auf dieses Abonnement. Leer: jedes Abonnement, für das der Prinzipal **Reader** hat. |

3. Klicken Sie auf **Verbinden**. Vor dem Speichern testet SecureAI die Anmeldeinformationen mit einem echten Lesezugriff: Ist das Geheimnis falsch oder kann der Prinzipal das Abonnement nicht lesen, wird nichts gespeichert und die Meldung nennt, was fehlt. Wenn die Verbindung zwar zustande kommt, aber eine Graph-Berechtigung fehlt, nennt der Hinweis diese Berechtigung.
4. **Synchronisieren** Sie mit der Aktualisieren-Schaltfläche der Karte. Eine Azure-Synchronisierung kann mehrere Minuten dauern (sie durchläuft Azure Resource Manager, Microsoft Graph, Azure Monitor und Cost Management). Danach synchronisiert SecureAI automatisch alle 6 Stunden.

## Schritt 3. Überprüfen

- [Cloud Sensors](/de/discovery/cloud-sensors) listet die erkannten Bereitstellungen, Agenten und Dienste auf. Klicken Sie auf die Azure-Karte, um ihre Insights zu öffnen:
  - **Usage & Costs**: Nutzung und Kosten;
  - **Models & Deployments**: Bereitstellungen und Agenten;
  - **Identity & Access**: Identitäten mit ihren Rollen und der Markierung *Privileged*; Geheimnisse, Zertifikate und föderierte Anmeldeinformationen; RBAC-Rollen mit ihren Mitgliedern;
  - **Audit & Logs**: die Aktivität.
- Das [NHI-Inventar](/de/discovery/nhi-inventory) zeigt Dienstprinzipale, Agentidentitäten, verwaltete Identitäten, Geheimnisse, Zertifikate und föderierte Anmeldeinformationen mit ihren Berechtigungen und ob sie privilegiert sind.

Schlägt eine Synchronisierung fehl (zum Beispiel weil das Geheimnis abgelaufen ist), zeigt die Karte den Fehler an und SecureAI versucht es mit Backoff erneut, wobei das letzte Inventar erhalten bleibt.

## Abdeckungslücken

Nichts, was SecureAI nicht lesen konnte, wird stillschweigend übersprungen: Beim Verbinden oder Synchronisieren nennt der Hinweis die fehlende Berechtigung.

| Bereich | Berechtigung, die das behebt |
|---------|------------------------------|
| Entra-Identitäten (Dienstprinzipale, App-Registrierungen) | `Application.Read.All` mit Administratoreinwilligung |
| Graph-Berechtigungen jeder Identität | `Application.Read.All` |
| Verzeichnisrollen | `Directory.Read.All` |
| Rollenzuweisungen und verwaltete Identitäten | **Reader** für das Abonnement |
| Foundry-Agenten | **Cognitive Services Data Reader** für die Foundry-Ressource |

Ein teilweises Lesen (eine fehlende Berechtigung, eine Seite, die Azure nicht geliefert hat, Drosselung) **entfernt nie Agenten und löscht nie Identitäten** aus dem Inventar: SecureAI behandelt etwas nur dann als gelöscht, wenn die Auflistung, in der es auftauchen würde, vollständig beantwortet wurde. Ohne Rollenzuweisungen bleiben die Berechtigungen einer Identität *unbekannt*, nie „keine“.

## Widerruf

Über das [NHI-Inventar](/de/discovery/nhi-inventory) (Vorhängeschloss), mit `Application.ReadWrite.All`:

| Identität | Was in Azure passiert | Umkehrbar? |
|-----------|-----------------------|------------|
| Dienstprinzipal | Wird **deaktiviert** (`accountEnabled: false`) | Ja: in Entra ID wieder aktivieren |
| Clientgeheimnis | Wird aus der Anwendung **gelöscht** | Nein: ein neues erstellen |
| Zertifikat | Wird aus der Anwendung **entfernt** | Nein: erneut hochladen |
| Föderierte Anmeldeinformationen | Die Vertrauensstellung wird **gelöscht** | Nein: erneut erstellen |
| Benutzerzugewiesene verwaltete Identität | Die Ressource wird **gelöscht** (erfordert zusätzlich **Managed Identity Contributor** für sie) | Nein |

Schutzmaßnahmen:

- SecureAI **bietet nicht an, den Dienstprinzipal zu widerrufen**, mit dem es verbunden ist, und auch nicht dessen Geheimnisse, da dies die Erkennung unterbrechen würde. Erneuern Sie sie in Entra ID.
- **Systemzugewiesene** verwaltete Identitäten werden nicht aus SecureAI heraus widerrufen: Ihr Lebenszyklus ist der der Azure-Ressource.
- Föderierte Anmeldeinformationen, die **Foundry** am *Blueprint* der Identität eines Agenten verwaltet, werden ebenfalls nicht aus SecureAI heraus widerrufen: Sie zu entfernen stoppt den Agenten.
- Automatische NHI-Richtlinien (Widerruf nach Alter oder Nichtnutzung) gelten für Azure noch nicht: Der Widerruf erfolgt manuell.

## Trennen

Unter **Admin → Integrationen → Cloud → Azure — Erkennung** entfernt das Löschen der Verbindung die gespeicherten Anmeldeinformationen. Um den Zugriff von SecureAI auf der Azure-Seite zu entfernen, löschen Sie die App-Registrierung oder ihr Geheimnis.

## Verwandte

- [Azure AI Foundry — Inference in your account](/en/integrations/cloud/azure-ai-foundry-inference)
- [Übersicht über Cloud-KI-Anbieter](/de/integrations/cloud/overview)
- [Cloud Sensors](/de/discovery/cloud-sensors)
- [NHI-Inventar](/de/discovery/nhi-inventory)
- [Microsoft Entra ID (SSO)](/de/iam/microsoft-entra-id)
