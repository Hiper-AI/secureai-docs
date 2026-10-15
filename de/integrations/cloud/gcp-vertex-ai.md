---
sidebar_position: 6
title: "Google Cloud — Discovery"
sidebar_label: "Google Cloud — Discovery"
description: "Verbinden Sie Google Cloud, damit SecureAI Vertex AI-Agenten, Modelle, Dienstkonten, Schlüssel, IAM, Nutzung und Kosten inventarisieren kann"
---

# Google Cloud — Discovery

Verbinden Sie Ihr Google Cloud-Projekt, damit SecureAI Vertex AI-Agenten, -Endpunkte und -Modelle inventarisieren kann – zusammen mit den Dienstkonten, Schlüsseln, IAM-Bindungen, Audit-Protokollen, der Nutzung und den Kosten, die sie umgeben.

<Info>
Diese Karte **liest** das Projekt **nur** und sendet niemals einen Prompt. Wenn Sie den LLM-Verkehr von SecureAI über Ihr eigenes Google Cloud-Konto laufen lassen möchten, siehe [Google Vertex AI — Inferenz in Ihrem Konto](/en/integrations/cloud/vertex-ai-inference).
</Info>

## Was SecureAI importiert

- **Vertex AI**: Agenten (Agent Engine), Serving-Endpunkte, laufende Batch- und Tuning-Jobs sowie Modelle – die Model Registry plus jedes verwendete Publisher-Modell (Gemini, Claude, offene Modelle).
- **Nutzung** der letzten 30 Tage pro Modell: Anfragen (und wie viele davon fehlgeschlagen sind), Eingabe- und Ausgabe-Token sowie Prompt-Cache-Token.
- **Kosten** der letzten 30 Tage: die tatsächlichen KI-Ausgaben dieses Projekts aus Ihrem BigQuery-Abrechnungsexport oder eine Schätzung zum Listenpreis.
- **NHIs**: Dienstkonten, vom Nutzer verwaltete Dienstkontoschlüssel, API-Schlüssel, Pools und Anbieter der Workload Identity Federation sowie OAuth-Clients – jeweils mit dem Zeitpunkt, zu dem sich jeder Schlüssel und jedes Dienstkonto zuletzt authentifiziert hat. Widerrufbar über das [NHI-Inventar](/de/discovery/nhi-inventory).
- **IAM**-Rollenbindungen des Projekts.
- **Cloud-Audit-Protokolle** der KI- und Identitätsdienste (Vertex AI, IAM, IAM Credentials, STS, API Keys, Resource Manager): die letzten 200 Ereignisse der vergangenen 30 Tage.

## Voraussetzungen

Ein Dienstkonto, als das SecureAI handelt. Gewähren Sie ihm diese Rollen **für das Projekt** (**IAM & Verwaltung → IAM → Zugriff gewähren**):

| Rolle | Was sie freischaltet | |
|-------|----------------------|---|
| `roles/aiplatform.viewer` | Vertex AI-Agenten, -Endpunkte, -Jobs und -Modelle | Erforderlich |
| `roles/iam.securityReviewer` | Dienstkonten, Schlüssel, API-Schlüssel, Workload Identity, OAuth-Clients, IAM-Bindungen | Erforderlich |
| `roles/monitoring.viewer` | Anfragen und Token pro Modell | Empfohlen |
| `roles/logging.viewer` | Cloud-Audit-Protokolle | Empfohlen |
| `roles/policyanalyzer.activityAnalysisViewer` | Letzte Nutzung jedes Schlüssels und Dienstkontos | Optional |

Für die **tatsächlichen Kosten** müssen Ihre Cloud Billing-Daten [nach BigQuery exportiert](https://cloud.google.com/billing/docs/how-to/export-data-bigquery?hl=de) werden, und das Dienstkonto benötigt `roles/bigquery.dataViewer` für das Export-Dataset und `roles/bigquery.jobUser` für das Projekt, das die Abfrage ausführt.

Um **aus SecureAI heraus zu widerrufen** (optional), gewähren Sie zusätzlich die Rolle jeder Aktion, die Sie erlauben möchten:

| Aktion | Rolle |
|--------|-------|
| Ein Dienstkonto deaktivieren | `roles/iam.serviceAccountAdmin` |
| Einen Dienstkontoschlüssel löschen | `roles/iam.serviceAccountKeyAdmin` |
| Einen API-Schlüssel löschen | `roles/serviceusage.apiKeysAdmin` |
| Einen Workload Identity-Pool oder -Anbieter deaktivieren | `roles/iam.workloadIdentityPoolAdmin` |
| Einen OAuth-Client deaktivieren | `roles/iam.oauthClientAdmin` |

<Note>
Sie benötigen `roles/billing.viewer` **nicht**: Es ist eine Rolle für Rechnungskonten, kann nicht für ein Projekt gewährt werden, und der Connector verwendet sie nicht.
</Note>

Nichts wird stillschweigend übersprungen: Was SecureAI nicht lesen kann, wird zusammen mit der Rolle aufgeführt, die das Problem behebt – beim Verbinden, nach jeder Synchronisierung und im GCP-Panel.

## Anmeldeinformationen

| Feld | Erforderlich | Beschreibung |
|------|--------------|--------------|
| `projectId` | Ja | Die Projekt-**ID** (z. B. `my-project-123`) – nicht der Name oder die Nummer. |
| `location` | Ja | Vertex AI-Standort, an dem sich Ihre Agenten und Endpunkte befinden (z. B. `us-central1`, `europe-west4`, `global`). Nutzung und Kosten umfassen alle Standorte. |
| `locations` | Nein | Mehrere Standorte, durch Kommas getrennt (bis zu 10). Hat Vorrang vor `location`. |
| `serviceAccountJson` | Eines von beiden | Der JSON-Schlüssel des Dienstkontos. Im Ruhezustand verschlüsselt. |
| `impersonateServiceAccount` | Eines von beiden | Schlüssellos: die E-Mail-Adresse des Dienstkontos, dessen Identität SecureAI annimmt. Wird nur angezeigt, wenn Ihre Bereitstellung schlüssellosen Zugriff anbietet. |
| `billingExportTable` | Nein | `project.dataset.table` Ihres Abrechnungsexports (z. B. `my-billing.billing_export.gcp_billing_export_v1_XXXXXX`). |
| `billingProjectId` | Nein | Projekt, das die BigQuery-Abfrage ausführt. Standardmäßig das Projekt der Tabelle; ein Name der Form `dataset.table` wird in diesem Projekt gesucht (oder in `projectId`, falls leer). |

### Wo man sie bekommt

**Option A — JSON-Schlüssel**

1. Gehen Sie in der [Google Cloud Console](https://console.cloud.google.com/) zu **IAM & Verwaltung → Dienstkonten → Dienstkonto erstellen** (z. B. `secureai-discovery`).
2. Gehen Sie zu **IAM & Verwaltung → IAM → Zugriff gewähren**, geben Sie die E-Mail-Adresse des Dienstkontos als Hauptkonto ein und fügen Sie die Rollen aus [Voraussetzungen](#voraussetzungen) hinzu.
3. Öffnen Sie wieder unter **Dienstkonten** das Konto → **Schlüssel → Schlüssel hinzufügen → Neuen Schlüssel erstellen → JSON** und laden Sie die Datei herunter.
4. Fügen Sie das **gesamte** JSON in `serviceAccountJson` ein und löschen Sie anschließend die heruntergeladene Datei.

Dasselbe mit `gcloud`:

```bash
PROJECT=my-project-123
gcloud iam service-accounts create secureai-discovery --project=$PROJECT --display-name="SecureAI discovery"
SA=secureai-discovery@$PROJECT.iam.gserviceaccount.com
for ROLE in roles/aiplatform.viewer roles/iam.securityReviewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud iam service-accounts keys create secureai-discovery.json --iam-account=$SA
```

<Warning>
Wenn Google meldet, dass das Erstellen von Dienstkontoschlüsseln deaktiviert ist, erzwingt Ihre Organisation die Richtlinie `iam.disableServiceAccountKeyCreation` – die Standardeinstellung für Organisationen, die seit 2024 erstellt wurden. Verwenden Sie Option B oder bitten Sie Ihren Organisationsadministrator um eine Ausnahme für dieses Projekt.
</Warning>

**Option B — schlüssellos (Identitätswechsel)**

1. Erstellen Sie das Dienstkonto und gewähren Sie ihm die Rollen (Schritte 1 und 2 oben).
2. Im Verbindungsformular von SecureAI nennt das Feld **Service account to impersonate** das SecureAI-Konto, das Sie autorisieren müssen. Öffnen Sie in Google Cloud Ihr Dienstkonto → **Berechtigungen → Zugriff gewähren**, geben Sie dieses Konto als Hauptkonto ein und weisen Sie ihm `roles/iam.serviceAccountTokenCreator` zu.
3. Geben Sie die E-Mail-Adresse Ihres Dienstkontos in das Feld ein und lassen Sie das JSON leer.

Wenn das Feld nicht angezeigt wird, bietet Ihre Bereitstellung keinen schlüssellosen Zugriff an – verwenden Sie Option A.

## Verbinden

1. **Admin → Integrationen → Cloud → Google Cloud — Discovery → Verbinden.**
2. Geben Sie die Projekt-ID, den Standort (oder mehrere unter **More Vertex AI Locations**) und entweder den JSON-Schlüssel oder das Dienstkonto für den Identitätswechsel ein. Fügen Sie die Abrechnungsfelder hinzu, wenn Sie den Export verwenden.
3. Klicken Sie auf **Verbinden**. SecureAI prüft die Anmeldeinformationen vor dem Speichern mit einem echten Lesezugriff auf das Projekt – das dauert einige Sekunden. Kann es das Projekt nicht lesen (falsche ID, keine Rollen, falsch geschriebener Standort), zeigt es den Grund an und speichert nichts; Ihre Eingaben bleiben im Formular erhalten.
4. Wenn gespeichert wird, aber Rollen fehlen, listet eine Warnung sie auf. Gewähren Sie sie und synchronisieren Sie erneut.
5. Synchronisieren Sie jetzt mit der Aktualisieren-Schaltfläche auf der Karte. Danach synchronisiert SecureAI automatisch alle 6 Stunden.

Um die Anmeldeinformationen später zu ändern, verwenden Sie erneut **Verbinden**. Leer gelassene Felder behalten ihren gespeicherten Wert; die Eingabe eines JSON-Schlüssels ersetzt einen gespeicherten Identitätswechsel und umgekehrt.

## Überprüfen

- [Cloud Sensors](/de/discovery/cloud-sensors) listet die erkannten Agenten auf. Klicken Sie auf die Google Cloud-Karte, um das GCP-Panel zu öffnen: Nutzung und Kosten (Anfragen, Fehler, Token, Cache, Kosten und deren Quelle), Modelle und Bereitstellungen, Identität und Zugriff (Dienstkonten und Schlüssel mit ihrer letzten Nutzung, IAM-Bindungen) sowie Audit.
- Wenn das Panel **Discovery could not read everything** anzeigt, gewähren Sie die dort aufgeführten Rollen und synchronisieren Sie erneut.
- Das [NHI-Inventar](/de/discovery/nhi-inventory) zeigt die Dienstkonten und Schlüssel.

Schlägt eine Synchronisierung fehl (z. B. weil der Schlüssel gelöscht oder die Rollen entzogen wurden), zeigt die Karte den Fehler an, und SecureAI versucht es mit Backoff erneut, wobei das letzte Inventar erhalten bleibt. Ein unvollständiger Lesevorgang nimmt niemals Agenten außer Betrieb und entfernt niemals Identitäten.

## Kosten

- **Mit `billingExportTable`**: die tatsächlichen Ausgaben dieses Projekts für KI-Dienste (Vertex AI, Gemini API, Agent Builder, Dialogflow, …), abzüglich Gutschriften, in der Währung Ihres Rechnungskontos. Wenn Gutschriften die Nutzung abdecken, kann der Nettobetrag null sein; das Panel zeigt dann daneben den Betrag vor Gutschriften an. Google aktualisiert den Export mit einer Verzögerung von mehreren Stunden.
- **Ohne**: eine Schätzung – Token aus Cloud Monitoring × Listenpreis, einschließlich Claude und Prompt-Cache-Token. Rabatte oder Verträge mit zugesicherter Nutzung werden nicht berücksichtigt.

## Widerruf

GCP-Identitäten können über das [NHI-Inventar](/de/discovery/nhi-inventory) (Vorhängeschloss) widerrufen werden, wenn der Connector die Rolle für die jeweilige Aktion hat (siehe [Voraussetzungen](#voraussetzungen)). Was dabei jeweils bei Google passiert:

| Identität | Was bei Google passiert | Umkehrbar |
|-----------|-------------------------|-----------|
| Dienstkonto | Deaktiviert | Ja – in Google Cloud wieder aktivieren |
| Dienstkontoschlüssel | Gelöscht | Nein |
| API-Schlüssel | Gelöscht | 30 Tage lang in Google Cloud wiederherstellbar |
| Workload Identity-Pool / -Anbieter, OAuth-Client | Deaktiviert | Ja |

Schutzmechanismen:

- Das Dienstkonto, das der Connector verwendet, und seine Schlüssel können nicht über SecureAI widerrufen werden – das würde die Erkennung unterbrechen. Rotieren Sie sie in Google Cloud.
- Die Standarddienstkonten von Google (Compute Engine-Standarddienstkonto, App Engine, Cloud Build, Dienst-Agents) verlangen eine zweite Bestätigung: Wird eines davon deaktiviert, stoppt jede VM, App oder jeder Build, die bzw. der unter diesem Konto läuft.
- Fehlt dem Connector die Rolle für eine Aktion, nennt die Fehlermeldung diese Rolle.

## Verwandte

- [Google Vertex AI — Inferenz in Ihrem Konto](/en/integrations/cloud/vertex-ai-inference)
- [Übersicht Cloud-KI-Anbieter](/de/integrations/cloud/overview)
- [Google Workspace SSO](/de/iam/google-workspace)
- [NHI-Inventar](/de/discovery/nhi-inventory)
