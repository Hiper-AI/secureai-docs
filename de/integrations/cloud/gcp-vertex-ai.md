---
sidebar_position: 6
title: "Google Cloud — Discovery"
sidebar_label: "Google Cloud — Discovery"
description: "Verbinden Sie Google Cloud, damit SecureAI Vertex AI-Agenten, Modelle, Dienstkonten, Schlüssel, IAM, Nutzung und Kosten inventarisieren kann – in einem Projekt oder in einer ganzen Organisation"
---

# Google Cloud — Discovery

Verbinden Sie Ihr Google Cloud-Projekt (oder eine ganze Organisation bzw. einen Ordner), damit SecureAI Vertex AI-Agenten, -Endpunkte und -Modelle inventarisieren kann – zusammen mit den Dienstkonten, Schlüsseln, IAM-Bindungen, Audit-Protokollen, der Nutzung und den Kosten, die sie umgeben.

<Info>
Diese Karte **liest** das Projekt **nur** und sendet niemals einen Prompt. Wenn Sie den LLM-Verkehr von SecureAI über Ihr eigenes Google Cloud-Konto laufen lassen möchten, siehe [Google Vertex AI — Inferenz in Ihrem Konto](/de/integrations/cloud/vertex-ai-inference).
</Info>

## Was SecureAI importiert

- **Vertex AI**: Agenten (Agent Engine), Serving-Endpunkte, laufende Batch- und Tuning-Jobs sowie Modelle – die Model Registry plus jedes verwendete Publisher-Modell (Gemini, Claude, offene Modelle).
- **Agent Builder / Gemini Enterprise und Dialogflow CX** (optional): Engines von Agent Builder (Discovery Engine) mit ihren Datenspeichern, abgefragt an den Standorten `global`, `us` und `eu`; sowie Dialogflow CX-Agenten, abgefragt in `global` und an den Vertex AI-Standorten, die Sie konfigurieren.
- **Nutzung pro Modell** der letzten 30 Tage: Anfragen (und wie viele davon fehlgeschlagen sind), Eingabe- und Ausgabe-Token sowie Prompt-Cache-Token.
- **Nutzung pro Anmeldeinformation** der letzten 30 Tage (Cloud Monitoring): Anfragen insgesamt und Anfragen an KI-APIs (Vertex AI, Gemini API, Agent Builder, Dialogflow) für jedes Dienstkonto und jeden API-Schlüssel. Der Verkehr von OAuth-Clients (Personen und Tools wie die Console oder `gcloud`) wird separat summiert. Außerdem liefert sie die letzte Nutzung dieser Konten und Schlüssel.
- **Nutzung nach Modell und Identität** (optional): welches Dienstkonto oder welche Person welches Vertex AI-Modell aufgerufen hat, entnommen aus den Audit-Protokollen zum Datenzugriff (Data Access), sofern Sie diese aktiviert haben. Siehe [Nutzung nach Modell und Identität](#nutzung-nach-modell-und-identität).
- **Kosten** der letzten 30 Tage: die tatsächlichen KI-Ausgaben dieses Projekts aus Ihrem BigQuery-Abrechnungsexport oder eine Schätzung zum Listenpreis.
- **NHIs**: Dienstkonten, vom Nutzer verwaltete Dienstkontoschlüssel, API-Schlüssel, Pools und Anbieter der Workload Identity Federation sowie OAuth-Clients – mit ihrer letzten Nutzung (aus Policy Analyzer und aus der Nutzung pro Anmeldeinformation) und ihrem [Privilegienrisiko](#privilegienrisiko). Widerrufbar und wiederherstellbar über das [NHI-Inventar](/de/discovery/nhi-inventory), manuell oder mit [automatischen Richtlinien](#automatische-nhi-richtlinien).
- **IAM**-Rollenbindungen des Projekts.
- **Cloud-Audit-Protokolle** der KI- und Identitätsdienste (Vertex AI, IAM, IAM Credentials, STS, API Keys, Resource Manager): die letzten 200 Ereignisse der vergangenen 30 Tage.

Standardmäßig liest der Connector **ein Projekt**. Mit dem Feld **Organization or folder** liest er jedes aktive Projekt einer Organisation oder eines Ordners: siehe [Modus Organisation oder Ordner](#modus-organisation-oder-ordner).

## Voraussetzungen

### Aktivierte APIs

SecureAI liest jeden Bereich mit der passenden Google-API. Aktivieren Sie sie für das Projekt (**APIs & Dienste → Bibliothek** oder mit `gcloud services enable`):

| API | Wofür | |
|-----|-------|---|
| `cloudresourcemanager.googleapis.com` | Das Projekt und seine IAM-Bindungen | Erforderlich |
| `iam.googleapis.com` | Dienstkonten, Schlüssel, Workload Identity, OAuth-Clients | Erforderlich |
| `aiplatform.googleapis.com` | Vertex AI-Agenten, -Endpunkte, -Jobs und -Modelle | Erforderlich |
| `apikeys.googleapis.com` | API-Schlüssel | Empfohlen |
| `monitoring.googleapis.com` | Nutzung pro Modell und pro Anmeldeinformation | Empfohlen |
| `logging.googleapis.com` | Audit-Protokolle und Datenzugriffsprotokolle | Empfohlen |
| `policyanalyzer.googleapis.com` | Letzte Nutzung von Schlüsseln und Dienstkonten (Policy Analyzer) | Optional |
| `bigquery.googleapis.com` | Tatsächliche Kosten, wenn Sie den Abrechnungsexport verwenden (für das Projekt, das die Abfrage ausführt) | Optional |
| `cloudasset.googleapis.com` | Modus Organisation oder Ordner (für das Projekt des Dienstkontos) | Nur in diesem Modus |
| `discoveryengine.googleapis.com` | Agent Builder / Gemini Enterprise | Wenn Sie dieses Produkt verwenden |
| `dialogflow.googleapis.com` | Dialogflow CX-Agenten | Wenn Sie dieses Produkt verwenden |

Eine deaktivierte API lässt die Synchronisierung nicht fehlschlagen: Sie erscheint als Lücke, **API disabled in the project — enable it**, mit dem Namen des Dienstes. Agent Builder und Dialogflow sind die Ausnahme: Ist ihre API deaktiviert, geht SecureAI davon aus, dass das Projekt dieses Produkt nicht verwendet, und markiert es nicht als Lücke.

### Rollen

Ein Dienstkonto, als das SecureAI handelt. Gewähren Sie ihm diese Rollen **für das Projekt** (**IAM & Verwaltung → IAM → Zugriff gewähren**):

| Rolle | Was sie freischaltet | |
|-------|----------------------|---|
| `roles/aiplatform.viewer` | Vertex AI-Agenten, -Endpunkte, -Jobs und -Modelle | Erforderlich |
| `roles/iam.securityReviewer` | Dienstkonten, Schlüssel, API-Schlüssel, Workload Identity, OAuth-Clients, IAM-Bindungen | Erforderlich |
| `roles/monitoring.viewer` | Nutzung pro Modell (Anfragen und Token) und Nutzung pro Anmeldeinformation | Empfohlen |
| `roles/logging.viewer` | Cloud-Audit-Protokolle | Empfohlen |
| `roles/policyanalyzer.activityAnalysisViewer` | Letzte Nutzung jedes Schlüssels und Dienstkontos | Optional |
| `roles/logging.privateLogViewer` | Nutzung nach Modell und Identität: Datenzugriffsprotokolle sind private Protokolle, und `roles/logging.viewer` liest sie nicht | Optional |
| `roles/discoveryengine.viewer` | Engines von Agent Builder / Gemini Enterprise | Optional |
| `roles/dialogflow.reader` | Dialogflow CX-Agenten | Optional |

Für die **tatsächlichen Kosten** müssen Ihre Cloud Billing-Daten [nach BigQuery exportiert](https://cloud.google.com/billing/docs/how-to/export-data-bigquery?hl=de) werden, und das Dienstkonto benötigt `roles/bigquery.dataViewer` für das Export-Dataset und `roles/bigquery.jobUser` für das Projekt, das die Abfrage ausführt.

Um **aus SecureAI heraus zu widerrufen und wiederherzustellen** (optional), benötigen Sie die Rolle jeder Aktion, die Sie erlauben möchten. Wenn Ihre Bereitstellung schlüssellosen Zugriff anbietet, gewähren Sie sie einem [separaten Dienstkonto nur für den Widerruf](#separates-dienstkonto-für-den-widerruf) und belassen Sie das lesende Konto bei reinen Leserollen; andernfalls gewähren Sie sie dem Dienstkonto des Connectors:

| Aktion | Rolle |
|--------|-------|
| Ein Dienstkonto deaktivieren (oder wieder aktivieren) | `roles/iam.serviceAccountAdmin` |
| Einen Dienstkontoschlüssel löschen | `roles/iam.serviceAccountKeyAdmin` |
| Einen API-Schlüssel löschen (oder wiederherstellen) | `roles/serviceusage.apiKeysAdmin` |
| Einen Workload Identity-Pool oder -Anbieter deaktivieren (oder wieder aktivieren) | `roles/iam.workloadIdentityPoolAdmin` |
| Einen OAuth-Client deaktivieren (oder wieder aktivieren) | `roles/iam.oauthClientAdmin` |

<Note>
Sie benötigen `roles/billing.viewer` **nicht**: Es ist eine Rolle für Rechnungskonten, kann nicht für ein Projekt gewährt werden, und der Connector verwendet sie nicht.
</Note>

Nichts wird stillschweigend übersprungen: Was SecureAI nicht lesen kann, wird zusammen mit der Rolle aufgeführt, die das Problem behebt – beim Verbinden, nach jeder Synchronisierung und im GCP-Panel.

## Anmeldeinformationen

| Feld | Erforderlich | Beschreibung |
|------|--------------|--------------|
| **Google Cloud Project ID** (`projectId`) | Ja | Die Projekt-**ID** (z. B. `my-project-123`) – nicht der Name oder die Nummer. Im Organisationsmodus ist es das Kontingent- und Abrechnungsprojekt. |
| **Vertex AI Location** (`location`) | Ja | Vertex AI-Standort, an dem sich Ihre Agenten und Endpunkte befinden (z. B. `us-central1`, `europe-west4`, `global`). Nutzung und Kosten umfassen alle Standorte. |
| **More Vertex AI Locations** (`locations`) | Nein | Mehrere Standorte, durch Kommas getrennt (bis zu 10). Hat Vorrang vor dem Standort oben. |
| **Service Account JSON** (`serviceAccountJson`) | Eines von beiden | Der JSON-Schlüssel des Dienstkontos. Im Ruhezustand verschlüsselt. |
| **Service account to impersonate** (`impersonateServiceAccount`) | Eines von beiden | Schlüssellos: die E-Mail-Adresse des Dienstkontos, dessen Identität SecureAI annimmt. Wird nur angezeigt, wenn Ihre Bereitstellung schlüssellosen Zugriff anbietet. |
| **Service account for revocation** (`revokeImpersonateServiceAccount`) | Nein | Ein zweites Dienstkonto, das nur zum Widerrufen oder Wiederherstellen von Identitäten verwendet wird, niemals zum Lesen. Wird nur angezeigt, wenn Ihre Bereitstellung schlüssellosen Zugriff anbietet. |
| **Organization or folder** (`scope`) | Nein | `organizations/<number>` oder `folders/<number>`: liest jedes aktive Projekt darin. |
| **BigQuery Billing Export Table** (`billingExportTable`) | Nein | `project.dataset.table` Ihres Abrechnungsexports (z. B. `my-billing.billing_export.gcp_billing_export_v1_XXXXXX`). |
| **BigQuery Billing Project ID** (`billingProjectId`) | Nein | Projekt, das die BigQuery-Abfrage ausführt. Standardmäßig das Projekt der Tabelle; ein Name der Form `dataset.table` wird in diesem Projekt gesucht (oder in der Projekt-ID, falls leer). |

### Wo man sie bekommt

**Option A — JSON-Schlüssel**

1. Gehen Sie in der [Google Cloud Console](https://console.cloud.google.com/) zu **IAM & Verwaltung → Dienstkonten → Dienstkonto erstellen** (z. B. `secureai-discovery`).
2. Gehen Sie zu **IAM & Verwaltung → IAM → Zugriff gewähren**, geben Sie die E-Mail-Adresse des Dienstkontos als Hauptkonto ein und fügen Sie die Rollen aus [Voraussetzungen](#voraussetzungen) hinzu.
3. Öffnen Sie wieder unter **Dienstkonten** das Konto → **Schlüssel → Schlüssel hinzufügen → Neuen Schlüssel erstellen → JSON** und laden Sie die Datei herunter.
4. Fügen Sie das **gesamte** JSON in **Service Account JSON** ein und löschen Sie anschließend die heruntergeladene Datei.

Dasselbe mit `gcloud`:

```bash
PROJECT=my-project-123
gcloud services enable cloudresourcemanager.googleapis.com iam.googleapis.com aiplatform.googleapis.com \
  apikeys.googleapis.com monitoring.googleapis.com logging.googleapis.com policyanalyzer.googleapis.com \
  --project=$PROJECT
gcloud iam service-accounts create secureai-discovery --project=$PROJECT --display-name="SecureAI discovery"
SA=secureai-discovery@$PROJECT.iam.gserviceaccount.com
for ROLE in roles/aiplatform.viewer roles/iam.securityReviewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
# Optional: letzte Nutzung, Nutzung nach Modell und Identität, Agent Builder und Dialogflow CX
for ROLE in roles/policyanalyzer.activityAnalysisViewer roles/logging.privateLogViewer roles/discoveryengine.viewer roles/dialogflow.reader; do
  gcloud projects add-iam-policy-binding $PROJECT --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud iam service-accounts keys create secureai-discovery.json --iam-account=$SA
```

Wenn Sie Agent Builder oder Dialogflow CX verwenden, sind deren APIs im Projekt bereits aktiviert; Sie müssen sie für SecureAI nicht aktivieren.

<Warning>
Wenn Google meldet, dass das Erstellen von Dienstkontoschlüsseln deaktiviert ist, erzwingt Ihre Organisation die Richtlinie `iam.disableServiceAccountKeyCreation` – die Standardeinstellung für Organisationen, die seit 2024 erstellt wurden. Verwenden Sie Option B oder bitten Sie Ihren Organisationsadministrator um eine Ausnahme für dieses Projekt.
</Warning>

**Option B — schlüssellos (Identitätswechsel)**

1. Erstellen Sie das Dienstkonto und gewähren Sie ihm die Rollen (Schritte 1 und 2 oben).
2. Im Verbindungsformular von SecureAI nennt der Hilfetext des Felds **Service account to impersonate (keyless — instead of the JSON)** das SecureAI-Konto, das Sie autorisieren müssen. Öffnen Sie in Google Cloud Ihr Dienstkonto → **Berechtigungen → Zugriff gewähren**, geben Sie dieses Konto als Hauptkonto ein und weisen Sie ihm `roles/iam.serviceAccountTokenCreator` zu. Mit `gcloud`:

   ```bash
   gcloud iam service-accounts add-iam-policy-binding $SA \
     --member=serviceAccount:SECUREAI_ACCOUNT --role=roles/iam.serviceAccountTokenCreator
   ```

3. Geben Sie die E-Mail-Adresse Ihres Dienstkontos in das Feld ein und lassen Sie das JSON leer.

Wenn das Feld nicht angezeigt wird, bietet Ihre Bereitstellung keinen schlüssellosen Zugriff an – verwenden Sie Option A.

### Separates Dienstkonto für den Widerruf

Wenn Ihre Bereitstellung schlüssellosen Zugriff anbietet, können Sie Lesen und Widerrufen trennen. Das wird empfohlen, statt dem lesenden Dienstkonto die Widerrufsrollen zu geben:

1. Erstellen Sie ein zweites Dienstkonto (z. B. `secureai-revoke`) und gewähren Sie ihm **nur** die Widerrufsrollen aus [Voraussetzungen](#voraussetzungen).
2. Gewähren Sie für dieses Konto `roles/iam.serviceAccountTokenCreator` dem SecureAI-Konto, das im Hilfetext des Felds **Service account for revocation (optional — separate from reading)** genannt wird.
3. Geben Sie seine E-Mail-Adresse in dieses Feld ein.

SecureAI fordert von diesem Konto nur dann ein Token mit 1 Stunde Gültigkeit an, wenn es eine Identität widerruft oder wiederherstellt; die Synchronisierung verwendet es nie. Das lesende Dienstkonto behält reine Leserollen. Außerdem verweigert SecureAI den Widerruf des Widerrufskontos über das Inventar.

## Modus Organisation oder Ordner

Um mehrere Projekte mit einem Connector zu inventarisieren, füllen Sie **Organization or folder** mit `organizations/<number>` oder `folders/<number>` aus (z. B. `organizations/123456789012`).

- SecureAI findet die aktiven Projekte mit **Cloud Asset Inventory** und liest jedes so, als wäre es ein Connector für ein einzelnes Projekt. Die **Google Cloud Project ID** bleibt das Kontingent- und Abrechnungsprojekt.
- Gewähren Sie dem Dienstkonto **für die Organisation oder den Ordner**: `roles/cloudasset.viewer`, `roles/iam.securityReviewer` und `roles/aiplatform.viewer`, dazu `roles/monitoring.viewer` und `roles/logging.viewer` für Nutzung und Audit.
- Aktivieren Sie `cloudasset.googleapis.com` für das Projekt des Dienstkontos.

```bash
ORG=123456789012
for ROLE in roles/cloudasset.viewer roles/iam.securityReviewer roles/aiplatform.viewer roles/monitoring.viewer roles/logging.viewer; do
  gcloud organizations add-iam-policy-binding $ORG --member=serviceAccount:$SA --role=$ROLE --condition=None
done
gcloud services enable cloudasset.googleapis.com --project=$PROJECT
```

Für einen Ordner verwenden Sie `gcloud resource-manager folders add-iam-policy-binding <number>` statt `gcloud organizations add-iam-policy-binding`.

Damit eine Synchronisierung in angemessener Zeit abgeschlossen wird, hat jede Synchronisierung Obergrenzen. Das Kontingentprojekt kommt zuerst, danach die Projekte mit Vertex AI-Ressourcen:

| Was | Obergrenze pro Synchronisierung |
|-----|---------------------------------|
| Inventarisierte Projekte | 200 |
| Nutzung pro Modell (Cloud Monitoring) außerhalb des Messwertbereichs des Kontingentprojekts | 15 Projekte mit Vertex AI |
| Audit-Protokolle | 25 Projekte |
| Nutzung nach Modell und Identität (Datenzugriffsprotokolle) | 10 Projekte |

Was außerhalb einer Obergrenze liegt, erscheint als teilweise Lücke, mit der Angabe, wie viel gelesen wurde. Ein Projekt, das nicht gelesen werden kann, wird ebenfalls als Lücke aufgeführt, und **nichts davon wird außer Betrieb genommen oder entfernt**. Beim Verbinden zählt der Test in diesem Modus nur die erste Seite der Projekte auf und prüft das Kontingentprojekt: Das Lesen jedes einzelnen Projekts ist Aufgabe der Synchronisierung.

## Verbinden

1. **Admin → Integrations → Cloud → Google Cloud — Erkennung → Integration verbinden.**
2. Geben Sie die Projekt-ID, den Standort (oder mehrere unter **More Vertex AI Locations**) und entweder den JSON-Schlüssel oder das Dienstkonto für den Identitätswechsel ein. Wenn Sie sie verwenden, fügen Sie das Dienstkonto für den Widerruf, die Organisation oder den Ordner sowie die Abrechnungsfelder hinzu.
3. Klicken Sie auf **Verbinden**. SecureAI prüft die Anmeldeinformationen vor dem Speichern mit einem echten Lesezugriff auf das Projekt – das dauert einige Sekunden. Kann es das Projekt nicht lesen, zeigt es den Grund an und speichert nichts; Ihre Eingaben bleiben im Formular erhalten. Die möglichen Meldungen finden Sie unter [Fehlerbehebung](#fehlerbehebung).
4. Wenn gespeichert wird, aber Rollen fehlen, listet eine Warnung sie auf. Gewähren Sie sie und synchronisieren Sie erneut.
5. Synchronisieren Sie jetzt mit der Aktualisieren-Schaltfläche auf der Karte. Danach synchronisiert SecureAI automatisch alle 6 Stunden.

Um die Anmeldeinformationen später zu ändern, verwenden Sie erneut **Verbinden**. Leer gelassene Felder behalten ihren gespeicherten Wert; die Eingabe eines JSON-Schlüssels ersetzt einen gespeicherten Identitätswechsel und umgekehrt.

## Überprüfen

- [Cloud Sensors](/de/discovery/cloud-sensors) listet die erkannten Agenten auf. Klicken Sie auf die Google Cloud-Karte, um das GCP-Panel zu öffnen: Nutzung und Kosten (Anfragen, Fehler, Token, Cache, Kosten und deren Quelle), Modelle und Bereitstellungen, Identität und Zugriff (Dienstkonten und Schlüssel mit ihrer letzten Nutzung, IAM-Bindungen) sowie Audit.
- Wenn das Panel **Discovery could not read everything** anzeigt, prüfen Sie jede Zeile (siehe [Fehlerbehebung](#fehlerbehebung)) und synchronisieren Sie erneut.
- Das [NHI-Inventar](/de/discovery/nhi-inventory) zeigt die Dienstkonten und Schlüssel.

Schlägt eine Synchronisierung fehl (z. B. weil der Schlüssel gelöscht oder die Rollen entzogen wurden), zeigt die Karte den Fehler an, und SecureAI versucht es mit Backoff erneut, wobei das letzte Inventar erhalten bleibt. Ein unvollständiger Lesevorgang nimmt niemals Agenten außer Betrieb und entfernt niemals Identitäten.

## Nutzung nach Modell und Identität

Cloud Monitoring zeigt, wie viele Anfragen jede Anmeldeinformation gestellt hat, aber nicht, an welches Modell. Um zu erfahren, **welche Identität welches Modell aufgerufen hat**, liest SecureAI die **Audit-Protokolle zum Datenzugriff** (Data Access) von Vertex AI. Das ist optional und liegt bei Ihnen:

- SecureAI liest sie nur, wenn Protokolle vom Typ **DATA_READ** oder **DATA_WRITE** für `aiplatform.googleapis.com` (oder für alle Dienste) aktiviert sind. SecureAI erkennt das in der IAM-Richtlinie; es aktiviert sie niemals selbst.
- Ihre Aktivierung verursacht **Aufnahmekosten in Cloud Logging** zu den Preisen von Google. Sie aktivieren sie unter **IAM & Verwaltung → Audit-Logs → Vertex AI API → Datenlesevorgang**.
- Das Dienstkonto benötigt `roles/logging.privateLogViewer`.
- Pro Projekt und Synchronisierung liest SecureAI bis zu 5.000 Einträge oder 20 Sekunden lang, je nachdem, was zuerst eintritt.
- Sind sie deaktiviert, zeigt das Panel eine optionale Lücke mit einer Erklärung, wie man sie aktiviert. Wenn Sie sie auf Organisations- oder Ordnerebene aktiviert haben, aber ein einzelnes Projekt verbinden, kann SecureAI das nicht anhand der Richtlinie des Projekts erkennen und zeigt die Lücke trotzdem an.

## Privilegienrisiko

Anhand der gelesenen IAM-Richtlinie markiert SecureAI ein Dienstkonto als **privilegiert**, wenn es eine dieser Rollen besitzt:

- Inhaber (`roles/owner`) oder Bearbeiter (`roles/editor`);
- eine beliebige Administratorrolle (`roles/<service>.admin` oder endend auf `Admin`);
- `roles/iam.serviceAccountTokenCreator` oder `roles/iam.serviceAccountUser`, mit denen der Inhaber als andere Dienstkonten handeln kann.

Ein vom Nutzer verwalteter Schlüssel eines privilegierten Dienstkontos erbt die Markierung: Wer den Schlüssel besitzt, besitzt dieses Privileg. **Uneingeschränkte** API-Schlüssel (ohne API-Ziel und ohne Anwendungseinschränkung) werden ebenfalls markiert. Im [NHI-Inventar](/de/discovery/nhi-inventory) erscheinen sie unter den Risikofaktoren als **Privileged (admin role or impersonation)** und **API key without restrictions**. Konnte die IAM-Richtlinie nicht gelesen werden, markiert SecureAI nichts, statt ein Konto als nicht privilegiert zu behandeln.

## Kosten

- **Mit der Tabelle des Abrechnungsexports**: die tatsächlichen Ausgaben dieses Projekts für KI-Dienste (Vertex AI, Gemini API, Agent Builder, Dialogflow, …), abzüglich Gutschriften, in der Währung Ihres Rechnungskontos. Wenn Gutschriften die Nutzung abdecken, kann der Nettobetrag null sein; das Panel zeigt dann daneben den Betrag vor Gutschriften an. Google aktualisiert den Export mit einer Verzögerung von mehreren Stunden.
- **Ohne**: eine Schätzung – Token aus Cloud Monitoring × Listenpreis, einschließlich Claude und Prompt-Cache-Token. Rabatte oder Verträge mit zugesicherter Nutzung werden nicht berücksichtigt.

## Widerruf und Wiederherstellung

GCP-Identitäten können über das [NHI-Inventar](/de/discovery/nhi-inventory) (Vorhängeschloss) widerrufen werden, wenn der Connector oder das Dienstkonto für den Widerruf die Rolle für die jeweilige Aktion hat (siehe [Voraussetzungen](#voraussetzungen)). Was dabei jeweils bei Google passiert:

| Identität | Was bei Google passiert | Umkehrbar |
|-----------|-------------------------|-----------|
| Dienstkonto | Deaktiviert | Ja – **Restore** aktiviert es wieder |
| Dienstkontoschlüssel | Gelöscht | Nein – Google vernichtet ihn. Erstellen Sie einen neuen Schlüssel |
| API-Schlüssel | Gelöscht | Ja, 30 Tage lang – **Restore** stellt ihn wieder her; danach bewahrt Google ihn nicht mehr auf |
| Workload Identity-Pool / -Anbieter, OAuth-Client | Deaktiviert | Ja – **Restore** aktiviert ihn wieder |

Um einen Widerruf rückgängig zu machen, öffnen Sie im NHI-Inventar das Menü der Identität und wählen Sie **Restore** (*Undo the revocation at Google Cloud*). Die Identität wird in Google Cloud wieder aktiviert, und in SecureAI wird sie entsperrt und bleibt **In remediation**, bis Sie sie überprüfen.

- Wiederhergestellt werden kann nur, was **SecureAI in Google Cloud widerrufen hat**, manuell oder über eine automatische Richtlinie. Für eine Sperre nur am Gateway von SecureAI wird es nicht angeboten, ebenso wenig für eine Identität, die Ihr Team direkt in Google Cloud deaktiviert hat.
- Ein gelöschter Dienstkontoschlüssel kann nicht wiederhergestellt werden: SecureAI lehnt dies ab, ohne Google aufzurufen.
- Die Wiederherstellung verwendet dieselben Rollen wie der Widerruf.

Schutzmechanismen:

- Das Dienstkonto, das der Connector verwendet, und seine Schlüssel können nicht über SecureAI widerrufen werden – das würde die Erkennung unterbrechen. Dasselbe gilt für das Dienstkonto für den Widerruf. Rotieren Sie sie in Google Cloud.
- Ebenso wenig kann das Dienstkonto (oder der Schlüssel) widerrufen werden, mit dem sich die Verbindung für [Vertex AI-Inferenz](/de/integrations/cloud/vertex-ai-inference) authentifiziert: Das würde jeden gesteuerten Aufruf stoppen. Kann SecureAI nicht prüfen, um welches es sich handelt, widerruft es nichts.
- Die Standarddienstkonten von Google (Compute Engine-Standarddienstkonto, App Engine, Cloud Build, Dienst-Agents) verlangen eine zweite Bestätigung: Wird eines davon deaktiviert, stoppt jede VM, App oder jeder Build, die bzw. der unter diesem Konto läuft.
- Fehlt dem Connector die Rolle für eine Aktion, nennt die Fehlermeldung diese Rolle.

## Automatische NHI-Richtlinien

**Automatische NHI-Richtlinien** (NHI-Inventar → **Automatic policies**) alarmieren bei Google Cloud-Identitäten oder widerrufen sie nach Regeln, ohne sie einzeln zu überprüfen. Sie werden am Ende jeder erfolgreichen Synchronisierung des Connectors ausgewertet, und zwar nur über dessen Identitäten.

| Regel | In Google Cloud | Standardschwellenwert |
|-------|-----------------|-----------------------|
| **Unused SA key / IAM access key** | Dienstkontoschlüssel, der sich seit N Tagen nicht authentifiziert hat. Sie greift nur bei bekannter letzter Nutzung: Ein Schlüssel ohne erfasste Nutzung bleibt unberührt. | 90 Tage |
| **Old SA key / IAM access key** | Dienstkontoschlüssel, der vor mehr als N Tagen erstellt wurde, ob genutzt oder nicht. | 365 Tage |
| **Unrestricted API key** | API-Schlüssel ohne Anwendungseinschränkung und ohne API-Ziel. | — |
| **Privileged SA with a user key** | Vom Nutzer verwalteter Schlüssel eines [privilegierten](#privilegienrisiko) Dienstkontos. | — |

Jede Regel hat drei Modi: **Off**, **Alert** und **Revoke**. Alle sind anfangs ausgeschaltet. Die Schutzmechanismen:

- **Simulation mode (dryRun)** ist standardmäßig aktiviert: Damit trennt keine auf **Revoke** gesetzte Regel etwas; sie listet nur auf, was sie tun würde. Erst das Ausschalten ermöglicht echte Trennungen. **Simulate with this configuration** zeigt die Auswirkung, bevor Sie speichern.
- **Revocation cap per run**: standardmäßig 5 (1 bis 50). Wenn die **Revoke**-Regeln in einem Durchlauf auf mehr Identitäten zutreffen als die Obergrenze, wird nichts getrennt und ein Alarm gesendet.
- **Exclusions**: Keine Regel greift bei einer Identität, deren Inhaber, Name oder Ressource einem Muster entspricht; `*` ist der einzige Platzhalter.
- Ausgewertet werden nur vollständige Schlüssellisten.
- Eine Anmeldeinformation, die SecureAI verwendet (die des Connectors, des Widerrufskontos oder der Vertex AI-Inferenz), wird nie getrennt. Schlüssel der Standarddienstkonten von Google werden nie automatisch getrennt: Die Regel alarmiert nur, und ein Mensch entscheidet.

In Google Cloud wird ein Dienstkontoschlüssel beim Widerruf **gelöscht** (er kann nicht wiederhergestellt werden), und ein API-Schlüssel wird beim Widerruf gelöscht, kann aber 30 Tage lang wiederhergestellt werden. Jede Aktion wird auditiert und gemeldet.

## Fehlerbehebung

### Beim Verbinden

Wenn der Test fehlschlägt, zeigt **Verbinden** eine dieser Meldungen an und speichert nichts:

| Meldung | Ursache | Was zu tun ist |
|---------|---------|----------------|
| `"My Project" is not a GCP project ID (use the ID, e.g. my-project-123 — not the project name or number).` | Sie haben den Namen oder die Nummer des Projekts eingegeben | Kopieren Sie die Projekt-**ID** aus der Projektauswahl der Console. |
| `<account> cannot read GCP project "<id>": it does not exist, or the service account has no role on it. Check the project ID and grant roles/aiplatform.viewer and roles/iam.securityReviewer on the project.` | Die ID existiert nicht, oder das Dienstkonto hat keine Rolle für dieses Projekt | Prüfen Sie die ID und gewähren Sie die beiden erforderlichen Rollen für das Projekt. |
| `Vertex AI location "mars-central9" is not reachable (no such endpoint (HTTP 404)). Check the location (e.g. us-central1, europe-west4, global).` | Der Standort existiert nicht (z. B. falsch geschrieben) | Korrigieren Sie den Standort. |
| `The Cloud Asset API is not enabled for <account>'s project. Enable cloudasset.googleapis.com and retry.` | Organisationsmodus ohne die Cloud Asset API | Aktivieren Sie `cloudasset.googleapis.com` für das Projekt des Dienstkontos. |
| `<account> cannot list the projects of organizations/<number>. Grant roles/cloudasset.viewer and roles/iam.securityReviewer on the organization …` | Organisationsmodus ohne die Rollen für die Organisation oder den Ordner, oder eine falsche Nummer | Gewähren Sie die Rollen für die Organisation oder den Ordner, oder entfernen Sie das Feld, um nur das Projekt zu lesen. |

### Lücken im Panel

Wenn das GCP-Panel **Discovery could not read everything** anzeigt, nennt jede Zeile den Bereich und was fehlt. Mit *optional* markierte Zeilen ergänzen nur das Inventar.

| Was die Zeile zeigt | Was sie bedeutet | Was zu tun ist |
|---------------------|------------------|----------------|
| Eine Rolle (z. B. `roles/monitoring.viewer`) | Dem Dienstkonto fehlt diese Rolle | Gewähren Sie sie für das Projekt (oder für die Organisation bzw. den Ordner) und synchronisieren Sie erneut. |
| **API disabled in the project — enable it** | Die API dieses Bereichs ist deaktiviert; das Detail nennt den Dienst | Aktivieren Sie sie unter **APIs & Dienste → Bibliothek**. |
| Keine Rolle und ein Detail, wonach eine Organisationsrichtlinie den Standort verbietet | Eine Organisationsrichtlinie (`constraints/gcp.resourceLocations`) sperrt diesen Standort, sodass dort nichts existieren kann. Keine Rolle behebt das | Entfernen Sie diesen Standort aus der Konfiguration, oder bitten Sie Ihren Organisationsadministrator, ihn zuzulassen. |
| **Usage by model and identity** nicht aktiviert | Die Datenzugriffsprotokolle von Vertex AI sind deaktiviert | Optional: siehe [Nutzung nach Modell und Identität](#nutzung-nach-modell-und-identität). |
| Ein teilweiser Lesevorgang (z. B. eine Obergrenze des Organisationsmodus) | Nur ein Teil wurde gelesen; das Detail sagt, wie viel | Deshalb wird nichts außer Betrieb genommen oder entfernt. Wenn Sie alles sehen müssen, grenzen Sie den Umfang ein. |

## Verwandte

- [Google Vertex AI — Inferenz in Ihrem Konto](/de/integrations/cloud/vertex-ai-inference)
- [Übersicht Cloud-KI-Anbieter](/de/integrations/cloud/overview)
- [Google Workspace SSO](/de/iam/google-workspace)
- [NHI-Inventar](/de/discovery/nhi-inventory)
