---
sidebar_position: 6
title: "Google Vertex AI"
sidebar_label: "Google Vertex AI"
description: "Verbinden Sie Google Vertex AI, damit SecureAI Agenten, Modelle, Dienstkonten, IAM, Nutzung und Kosten inventarisieren kann"
---
# Google Vertex AI

Verbinden Sie Ihr Google Cloud-Projekt, damit SecureAI Vertex AI-Agenten, Endpunkte und Modelle sowie die sie umgebenden Dienstkonten, IAM-Bindungen, Audit-Protokolle, Nutzung und Abrechnung inventarisieren kann.

## Was SecureAI importiert

- **Vertex AI-Agenten, Endpunkte und Modelle**
- **NHIs** – Dienstkonten, Dienstkontoschlüssel und API-Schlüssel (widerruflich – siehe [NHI Inventory](/de/en/discovery/nhi-inventory))
- **IAM** Rollenbindungen
- **Cloud-Audit-Protokolle**
– **Anfragen, Token und Kosten** für die letzten 30 Tage (tatsächlich aus dem BigQuery-Abrechnungsexport oder geschätzt)

## Voraussetzungen

– Ein **Dienstkonto** mit einem JSON-Schlüssel, dem Leserollen für das Projekt gewährt werden:
  - `roles/aiplatform.viewer`
  - `roles/monitoring.viewer`
  - `roles/iam.securityReviewer`
  - `roles/logging.viewer`
  - `roles/billing.viewer`
  – BigQuery-Rollen (z. B. `roles/bigquery.dataViewer`, `roles/bigquery.jobUser`), wenn Sie den Abrechnungsexport für **tatsächliche** Kosten verwenden.
  - *(Optional)* Schlüssel-/Dienstkonto-Administratorrollen, wenn SecureAI Identitäten an der Quelle widerrufen soll.

## Anmeldeinformationen

| Feld | Erforderlich | Beschreibung |
|-------|----------|-------------|
| `projectId` | Ja | GCP-Projekt-ID. |
| `location` | Ja | Vertex-Region (z. B. `us-central1`). |
| `serviceAccountJson` | Ja | Der Dienstkontoschlüssel JSON. Im Ruhezustand verschlüsselt. |
| `billingExportTable` | Nein | BigQuery-Tabelle für die tatsächliche Abrechnung (z. B. `dataset.gcp_billing_export_v1_XXXX`). |
| `billingProjectId` | Nein | Projekt, das den Abrechnungsexport hostet, falls abweichend. |

### Wo man sie bekommt

1. Gehen Sie in der [Google Cloud Console](https://console.cloud.google.com/) zu **IAM & Admin → Dienstkonten → Dienstkonto erstellen**.
2. Gewähren Sie die oben aufgeführten Rollen.
3. Laden Sie unter **Schlüssel → Schlüssel hinzufügen → JSON** die Schlüsseldatei herunter.
4. Fügen Sie den **gesamten** JSON in das Feld `serviceAccountJson` ein.

## Verbinden

1. **Admin → Integrationen → Cloud → Google Vertex AI → Verbinden.**
2. Geben Sie Projekt, Standort und den JSON-Code des Dienstkontos ein (sowie optionale Abrechnungsfelder).
3. **Testen**, dann **Speichern**.
4. **Synchronisieren**.

## Überprüfen

Öffnen Sie [Cloud Sensors](/de/en/discovery/cloud-sensors) für erkannte Agenten/Endpunkte/Modelle und [NHI Inventory](/de/en/discovery/nhi-inventory) für Dienstkonten und Schlüssel. Einblicke zeigen IAM-Bindungen, Nutzung und Kosten.

## Widerruf

GCP-Dienstkonten, SA-Schlüssel und API-Schlüssel können von [NHI Inventory](/de/en/discovery/nhi-inventory) **widerruflich** werden, wenn der Connector über die optionalen Schlüssel-/SA-Administratorrollen verfügt.

## Verwandte

- [Übersicht Cloud-KI-Anbieter](/de/en/integrations/cloud/overview)
- [Google Workspace SSO](/de/en/iam/google-workspace)
- [NHI Inventory](/de/en/discovery/nhi-inventory)