---
sidebar_position: 7
title: "Google Vertex AI — Inferenz in Ihrem Konto"
sidebarTitle: "Google Vertex AI"
icon: "/img/icons/google-cloud.svg"
sidebar_label: "Vertex AI — Inferenz"
description: "Lassen Sie den LLM-Verkehr von SecureAI über Ihr eigenes Google Cloud-Konto laufen: Bezahlen Sie Google mit Ihren zugesicherten Ausgaben (CUDs), während SecureAI weiterhin DLP, Richtlinien und signierte Belege durchsetzt."
---

# Google Vertex AI — Inferenz in Ihrem Konto

Mit dieser Integration laufen die Aufrufe großer Sprachmodelle (LLM) von SecureAI in **Ihrem eigenen Google Cloud-Projekt** statt bei von SecureAI verwalteten Anbietern. Die Nutzung wird direkt Ihrem Google-Konto in Rechnung gestellt, sodass Sie Ihre zugesicherten Ausgaben (CUDs) und ausgehandelten Rabatte nutzen können.

SecureAI bleibt im Pfad jeder Anfrage: **DLP, Modellrichtlinien, Datenresidenz und signierte Belege** gelten genauso wie bei jedem anderen Anbieter.

<Info>
**Nicht zu verwechseln mit der anderen Google Cloud-Karte.** Diese Seite verbindet Vertex AI als **Inferenzanbieter** (Admin → Integrations → **AI providers**). Die Karte **Google Cloud — Erkennung** (Kategorie **Cloud**) inventarisiert das Projekt nur im Lesemodus und sendet niemals einen Prompt; sie wird unter [Google Cloud — Discovery](/de/integrations/cloud/gcp-vertex-ai) beschrieben. Sie können beide für dasselbe Projekt verwenden, aber sie sind unabhängig voneinander und verlangen unterschiedliche Berechtigungen.
</Info>

## Was auf Vertex läuft und was nicht

| Läuft auf Ihrem Vertex | Bleibt bei von SecureAI verwalteten Anbietern |
|---|---|
| Chat und Agenten (Modelle aus den von Ihnen gewählten Familien) | Embeddings (Dokument- und Indexsuche) |
| Zusammenfassungen von Teams-Besprechungen (Gemini-Modell) | Re-Ranking der Suche |
| Grammatikprüfung, Übersetzung und andere interne Hintergrundaufgaben, wenn Sie **Remap everything** wählen | OCR von Dokumenten |
| | Admin-Assistent |
| | Bildgenerierung und Echtzeit-Sprache |
| | Selbst gehostete Modelle und der Claude Code-Proxy |

Heute verfügbare Modelle: **Gemini** und die offenen Modelle, die auf Vertex als MaaS bereitgestellt werden (**gpt-oss, DeepSeek, Llama und Qwen**). **Claude und Mistral auf Vertex werden noch nicht unterstützt**; diese Modelle werden gemäß der Fallback-Einstellung behandelt (siehe unten).

## Wie viele Cloud-Anbieter Sie verwenden können

| Plan | Gleichzeitig aktivierte Inferenzanbieter |
|------|------------------------------------------|
| **Scale** | 1 (Google Vertex AI, Azure AI Foundry **oder** Amazon Bedrock) |
| **Enterprise** | Bis zu 3 – zum Beispiel Vertex AI für Gemini, Foundry für GPT und Bedrock für Claude |

Wenn mehr als ein Anbieter aktiviert ist, bedient jeder **unterschiedliche** Modellfamilien: Eine Familie kann nur von einem aktivierten Anbieter übernommen werden, und nur ein Anbieter kann im Modus **Remap everything** sein. Wenn Sie die Integration im eingeschalteten Zustand speichern, lehnt SecureAI dies in zwei Fällen ab und erklärt den Grund im Panel:

| Fall | Meldung im Panel |
|------|------------------|
| Das Routing überschneidet sich mit einem anderen aktivierten Anbieter (eine Familie, die bereits ein anderer übernimmt, oder ein zweites **Remap everything**) | *This routing overlaps another enabled cloud provider: …*, gefolgt von der Familie oder dem Modus, der kollidiert. |
| Ihr Plan erlaubt keinen weiteren aktivierten Anbieter | *Your plan's BYO-cloud provider limit is reached (… of … in use). Disable another provider or upgrade the plan.* |

## Voraussetzungen

- Ein **Google Cloud-Projekt** mit aktivierter Abrechnung.
- Die **Agent Platform API (Vertex AI API)** ist in diesem Projekt aktiviert (der Dienst `aiplatform.googleapis.com`).
- Ein **Dienstkonto** in Ihrem Projekt mit der Rolle **Agent Platform User** (`roles/aiplatform.user`) und eine dieser beiden Möglichkeiten, damit SecureAI als dieses Konto handeln kann:
  - **Option A – ein JSON-Schlüssel** für dieses Dienstkonto.
  - **Option B – schlüssellos (Identitätswechsel)**: Sie gewähren dem im Panel angezeigten SecureAI-Dienstkonto die Rolle **Service Account Token Creator** (`roles/iam.serviceAccountTokenCreator`) für Ihr Dienstkonto, und es wird kein Schlüssel gespeichert. Diese Option ist nur verfügbar, wenn Ihre SecureAI-Bereitstellung sie anbietet; andernfalls zeigt das Panel sie deaktiviert mit dem Hinweis *Keyless access is not enabled on this deployment.*
- **Admin**-Berechtigung für den Bereich Integrationen von SecureAI. Mit Leseberechtigung können Sie die Konfiguration ansehen, aber nicht ändern.

## Schritt 1. Das Projekt in Google Cloud vorbereiten

Sie können dies über die Befehlszeile (schnell) oder über die Console (mit Screenshots) erledigen. Die Schritte 1 bis 3 sind für beide Authentifizierungsoptionen gleich; Schritt 4 (der JSON-Schlüssel) gilt nur für Option A.

<Tabs>
<Tab title="gcloud (Cloud Shell)">

Aus der [Cloud Shell](https://shell.cloud.google.com/) oder mit installiertem `gcloud`. Ersetzen Sie `MY_PROJECT` durch die echte Projekt-ID:

```bash
gcloud config set project MY_PROJECT

# 1. Agent Platform API (Vertex AI API) aktivieren
gcloud services enable aiplatform.googleapis.com

# 2. Ein eigenes Dienstkonto für SecureAI erstellen
gcloud iam service-accounts create secureai-vertex --display-name="SecureAI Vertex"

# 3. Ihm die minimale Rolle zum Aufrufen von Modellen gewähren
gcloud projects add-iam-policy-binding MY_PROJECT \
  --member="serviceAccount:secureai-vertex@MY_PROJECT.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# 4. Nur Option A: den JSON-Schlüssel erzeugen
gcloud iam service-accounts keys create key.json \
  --iam-account=secureai-vertex@MY_PROJECT.iam.gserviceaccount.com
```

</Tab>
<Tab title="Google Cloud Console">

1. Wählen Sie in der [Google Cloud Console](https://console.cloud.google.com/) Ihr Projekt aus und öffnen Sie **APIs & Dienste → Bibliothek**. Suchen Sie nach **Agent Platform API** (früher **Vertex AI API**) und klicken Sie auf **Aktivieren**. Wenn bereits **API aktiviert** angezeigt wird, ist nichts zu tun.

   <div class="mac-window">
   ![Agent Platform API in Google Cloud aktiviert](/img/cloud/vertex-ai-inference/1%20-%20Vertex%20AI%20Inference.png)
   </div>

2. Gehen Sie zu **IAM & Verwaltung → Dienstkonten → Dienstkonto erstellen**. Geben Sie ihm einen Namen (zum Beispiel `secureai-vertex`).

   <div class="mac-window">
   ![Das Dienstkonto erstellen](/img/cloud/vertex-ai-inference/2%20-%20Vertex%20AI%20Inference.png)
   </div>

3. Gewähren Sie unter **Berechtigungen** die Rolle **Agent Platform User** (`roles/aiplatform.user`) für das Projekt und klicken Sie auf **Fertig**. Für die Inferenz ist keine weitere Rolle erforderlich.

   <div class="mac-window">
   ![Die Rolle Agent Platform User gewähren](/img/cloud/vertex-ai-inference/3%20-%20Vertex%20AI%20Inference.png)
   </div>

4. **Nur Option A.** Öffnen Sie das Dienstkonto, gehen Sie zum Tab **Schlüssel** → **Schlüssel hinzufügen → Neuen Schlüssel erstellen**, wählen Sie den Schlüsseltyp **JSON** und klicken Sie auf **Erstellen**. Die Datei wird nur einmal heruntergeladen.

   <div class="mac-window">
   ![Den JSON-Schlüssel erstellen](/img/cloud/vertex-ai-inference/4%20-%20Vertex%20AI%20Inference.png)
   </div>

</Tab>
</Tabs>

<Warning>
Behandeln Sie die JSON-Datei wie ein Passwort. SecureAI speichert sie **verschlüsselt** und zeigt sie nie wieder an, aber die heruntergeladene Datei (`key.json`) bleibt auf Ihrem Computer: Fügen Sie ihren Inhalt in SecureAI ein und **löschen Sie sie** anschließend, oder bewahren Sie sie in einem Secrets-Manager auf.
</Warning>

<Warning>
**Wenn Sie den Schlüssel nicht erstellen können.** Schlägt Schritt 4 mit `iam.disableServiceAccountKeyCreation` fehl, verbietet die Richtlinie Ihrer Google Cloud-Organisation Dienstkontoschlüssel (das ist die Standardeinstellung bei neuen Organisationen). Verwenden Sie **Option B, schlüssellos**, wenn Ihre Bereitstellung sie anbietet; andernfalls bitten Sie einen Administrator für Organisationsrichtlinien um eine Ausnahme von der Einschränkung `iam.disableServiceAccountKeyCreation` für dieses Projekt.
</Warning>

### Option B: SecureAI ohne Schlüssel autorisieren

Bei Option B wird kein Schlüssel erstellt. Stattdessen:

1. Öffnen Sie in SecureAI das Vertex AI-Panel (siehe Schritt 2), wählen Sie **Keyless (impersonation)** und geben Sie die E-Mail-Adresse Ihres Dienstkontos unter **Your service account to impersonate** ein.
2. Das Panel zeigt den auszuführenden Befehl an, bereits ausgefüllt mit dem SecureAI-Dienstkonto Ihrer Bereitstellung. Kopieren Sie ihn mit **Copy** und führen Sie ihn in der Cloud Shell aus. Er sieht so aus:

   ```bash
   gcloud iam service-accounts add-iam-policy-binding secureai-vertex@MY_PROJECT.iam.gserviceaccount.com \
     --member="serviceAccount:SECUREAI_ACCOUNT" \
     --role="roles/iam.serviceAccountTokenCreator"
   ```

   Die Rolle wird **für Ihr Dienstkonto** gewährt, nicht für das Projekt: SecureAI kann nur als dieses Konto handeln, das seinerseits nur `roles/aiplatform.user` besitzt.

### Offene Modelle (Llama, DeepSeek, Qwen, gpt-oss)

**Gemini benötigt nichts weiter.** Um auch Llama, DeepSeek, Qwen oder gpt-oss zu verwenden, akzeptieren Sie zuerst die Bedingungen jedes Modells unter **Vertex AI → Model Garden**. Diese offenen Modelle benötigen eine bestimmte **Region** (zum Beispiel `us-central1`); mit `global` sind sie möglicherweise nicht verfügbar.

## Schritt 2. Das Projekt in SecureAI verbinden

1. Gehen Sie zu **Admin → Integrations**, öffnen Sie die Kategorie **AI providers** und klicken Sie auf die Karte **Google Vertex AI — Inference on your account**.
2. Füllen Sie unter **Connection** Folgendes aus:

   | Feld | Was einzugeben ist |
   |------|--------------------|
   | **Google Cloud project ID** | Die Projekt-ID (zum Beispiel `my-project-123`), nicht der Anzeigename. |
   | **Vertex AI location** | Belassen Sie zu Beginn `global`: Dort befinden sich die Standardmodelle Gemini 3 *preview*. Wenn Sie **Datenresidenz** benötigen, geben Sie eine Region ein (`us-central1`, `europe-west4`…): SecureAI sendet jede Anfrage an den von Ihnen gewählten regionalen Endpunkt, und wo Google sie verarbeitet, hängt von den Datenresidenz-Zusagen von Google ab. Mit `global` wählt Google die Region. Offene Modelle benötigen eine Region. |
   | **Authentication** | **Option A:** Lassen Sie **Service-account key (JSON)** ausgewählt und fügen Sie den **vollständigen** Inhalt von `key.json` in **Service-account key JSON** ein. **Option B:** Wählen Sie **Keyless (impersonation)**, geben Sie die E-Mail-Adresse Ihres Dienstkontos unter **Your service account to impersonate** ein und führen Sie den Befehl aus, den das Panel anzeigt (siehe **Option B: SecureAI ohne Schlüssel autorisieren** oben). |

   <div class="mac-window">
   ![Abschnitt Connection des Vertex AI-Panels](/img/cloud/vertex-ai-inference/5%20-%20Vertex%20AI%20Inference.png)
   </div>

3. Klicken Sie auf **Save**. Es wird noch kein Verkehr geroutet: Die Integration wird ausgeschaltet gespeichert, damit Sie sie zuerst testen können.

<Info>
**Empfehlung für den ersten Tag:** Behalten Sie den Modus **Only these model families** nur mit **Gemini** bei, lassen Sie die Standardmodelle unverändert und sowohl den Fallback als auch die Ausgabenobergrenze pro Seat ausgeschaltet. Das ist die vorhersehbarste Konfiguration. Heben Sie sich **Remap everything** für später auf, wenn dies validiert ist.
</Info>

<Info>
Bei Option A wird der eingefügte Schlüssel nie wieder angezeigt. Um ihn zu ersetzen, fügen Sie einen neuen ein; wenn Sie das Feld beim Speichern leer lassen, bleibt der aktuelle Schlüssel erhalten.
</Info>

## Schritt 3. Auswählen, was auf Vertex läuft

Unter **What runs on Vertex** gibt es zwei Modi:

- **Only these model families** – die Familien, die Sie ankreuzen (Gemini, gpt-oss, DeepSeek, Llama, Qwen), laufen auf Ihrem Vertex; jedes andere Modell läuft weiterhin bei den Anbietern von SecureAI. Das ist die konservativste Art zu beginnen (Standard: nur Gemini).
- **Remap everything to Vertex** – alle LLM-Aufrufe laufen auf Ihrem Vertex. Modelle ohne Vertex-Entsprechung werden von einem **Standardmodell** bedient.

**Default Vertex models** (bearbeitbar):

| Stufe | Verwendet für | Standard |
|-------|---------------|----------|
| **Fast** | Hintergrundaufgaben und Hilfsfunktionen (Grammatik, Übersetzung, Teams) | `google/gemini-2.5-flash` |
| **Standard** | Modelle ohne Entsprechung | `google/gemini-3-flash-preview` |
| **Reasoning** | Reasoning-Modelle ohne Entsprechung | `google/gemini-3.1-pro-preview` |
| **Vision** | Anfragen mit Bildern oder PDFs | `google/gemini-3-flash-preview` |

Außerdem gibt es zwei Optionen:

| Option | Aus (empfohlen) | Ein |
|--------|-----------------|-----|
| **Allow fallback to SecureAI-managed models** | Wenn Vertex fehlschlägt oder ein Modell keine Entsprechung hat, wird die Anfrage **abgelehnt**, statt an einen anderen Anbieter gesendet zu werden. | Diese Anfragen werden **einmal** bei von SecureAI verwalteten Anbietern wiederholt. Die Wiederholung wird auditiert. |
| **Apply each seat's spend cap to turns served in your account** | Turns, die auf Ihrem Vertex bedient werden, zählen nicht zur Ausgabenobergrenze des Seats des jeweiligen Nutzers. | Diese Turns zählen zur Ausgabenobergrenze des Seats (sowohl zur monatlichen Obergrenze als auch zum 4-Stunden-Burst-Limit), zum Listenpreis, genau wie Turns, die SecureAI bedient. |

<div class="mac-window">

![Abschnitt What runs on Vertex](/img/cloud/vertex-ai-inference/6%20-%20Vertex%20AI%20Inference.png)

</div>

<Info>
Die verfügbaren Modelle hängen vom **Standort** ab. Die Standardmodelle (mehrere davon *preview*) existieren möglicherweise nicht in jeder Region. Wenn der Verbindungstest **Model not available in this location** zurückgibt, wählen Sie eine andere Region oder ersetzen Sie die Standardmodelle durch solche, die Ihre Region bereitstellt. Offene Modelle (MaaS) erfordern die Annahme ihrer Bedingungen in Vertex AI Model Garden und eine bestimmte Region.
</Info>

## Schritt 4. Die Verbindung testen

1. Klicken Sie bei gespeicherter Integration unter **Connection test** auf **Test connection**.
2. SecureAI sendet eine minimale Anfrage an jedes Standardmodell, **über denselben Pfad, den der echte Verkehr nutzen wird** (Gateway, Richtlinien und Belege eingeschlossen), und zeigt jedes Ergebnis mit seiner Latenz an.

   <div class="mac-window">
   ![Ergebnis des Verbindungstests](/img/cloud/vertex-ai-inference/7%20-%20Vertex%20AI%20Inference.png)
   </div>

3. Wenn ein Modell fehlschlägt, zeigt das Panel den Grund an. Siehe den Abschnitt **Fehlerbehebung** am Ende dieser Seite.

### Was die Identität sonst noch kann

Der Test prüft außerdem, was die Identität der Verbindung im Projekt sonst noch tun kann, mit `projects:testIamPermissions` und demselben Token wie der Inferenzpfad: Es ist keine zusätzliche Rolle nötig, und es wird nichts geändert. Das Panel zeigt einen dieser Hinweise:

| Hinweis im Panel | Bedeutung |
|------------------|-----------|
| *Permissions: roles/aiplatform.user — it can call models and also deploy or delete Vertex AI resources, and none of the permissions outside AI that SecureAI checks.* | Das ist mit `roles/aiplatform.user` zu erwarten. |
| *Least privilege: this identity can call models and nothing else that SecureAI checked.* | Sie hat nicht einmal die Bereitstellungsberechtigungen von `roles/aiplatform.user` (zum Beispiel bei einer benutzerdefinierten Rolle). |
| *This identity can do much more than call models: …* (Warnung, mit der Liste der Berechtigungen) | Sie hat Berechtigungen außerhalb von KI, zum Beispiel die IAM-Richtlinie ändern, Dienstkontoschlüssel erstellen oder Daten aus Storage, BigQuery oder Secret Manager lesen. Das Aktivitätsprotokoll speichert den Test als Warnung. Geben Sie dem Dienstkonto nur `roles/aiplatform.user`. |
| *Could not check what else this identity can do in the project …* | Google hat nicht geantwortet, zum Beispiel weil die Cloud Resource Manager API deaktiviert ist. |

<Info>
Der Test sendet einige Anfragen mit je einem Token und **wird Ihrem Google-Konto in Rechnung gestellt** (Cent-Beträge).
</Info>

## Schritt 5. Das Routing prüfen und einschalten

1. Öffnen Sie **Routing preview → Show which lane serves each model**. Für jedes Modell des Katalogs wird angezeigt, ob **Ihr Vertex** es bedienen wird (und mit welchem Vertex-Modell) oder **SecureAI**, und welche Modelle **vor den Nutzern ausgeblendet** werden. Die Vorschau simuliert die eingeschaltete Integration, sodass Sie die Auswirkung prüfen können, bevor Sie sie aktivieren.
2. Wenn der Test erfolgreich ist, schalten Sie **Route traffic to Vertex AI** ein und klicken Sie erneut auf **Save**. **Wenn Sie nicht speichern, bleibt der Schalter nicht eingeschaltet.** Zum Einschalten müssen ein Projekt und eine Anmeldeinformation konfiguriert sein. Wenn Ihr Plan keinen weiteren Cloud-Anbieter erlaubt oder sich das Routing mit einem anderen überschneidet, lehnt SecureAI dies ab und erklärt den Grund (siehe **Wie viele Cloud-Anbieter Sie verwenden können** oben).

   <div class="mac-window">
   ![Schalter Route traffic to Vertex AI eingeschaltet](/img/cloud/vertex-ai-inference/8%20-%20Vertex%20AI%20Inference.png)
   </div>
3. Die Karte wird grün: **Routing to Vertex**. Ist sie gespeichert, aber ausgeschaltet, zeigt sie in Gelb **Configured · not routing to Vertex**.

Die Änderung gilt sofort auf dem Server, auf dem sie gespeichert wurde, und auf den übrigen innerhalb von höchstens 30 Sekunden.

## Schritt 6. In der Modellauswahl überprüfen

Wenn die Integration aktiv ist, zeigen die Modelle, die auf Ihrem Vertex laufen, in der Modellauswahl des Chats das **Google Cloud-Logo** neben ihrem Namen. Beim Darüberfahren mit der Maus wird angezeigt, dass das Modell im Vertex AI-Konto Ihrer Organisation läuft.

<div class="mac-window">

![Modellauswahl mit dem Google Cloud-Logo](/img/cloud/vertex-ai-inference/9%20-%20Vertex%20AI%20Inference.png)

</div>

Im Modus **Remap everything** ohne Fallback bietet die Auswahl **nur** Modelle an, die Ihr Vertex bedient. Ein Modell ohne Entsprechung würde von einem anderen als dem gewählten Modell beantwortet, daher wird es ausgeblendet.

## Was abgerechnet wird und an wen

- **Die LLM-Nutzung stellt Google Ihrem Konto in Rechnung**, nicht SecureAI. Sie sehen die Belastung in Ihrer Google Cloud-Abrechnung, mit Ihren Rabatten und CUDs angewendet.
- SecureAI zeigt die Kosten der auf Vertex bedienten Turns als **Schätzung zum Listenpreis** nur für Analysezwecke an. Sie dient als Referenz: Sie **enthält** Ihre Rabatte **nicht**, daher kann der tatsächliche Betrag von Google niedriger sein.
- Auf Ihrem Vertex bediente Turns **zählen nicht zur Ausgabenobergrenze des Seats des jeweiligen Nutzers**, es sei denn, Sie schalten **Apply each seat's spend cap to turns served in your account** ein. Die **Seat-Stufe** gilt weiterhin: Ein Nutzer kann nur Modelle seiner Stufe oder darunter verwenden, auch wenn Ihr Vertex sie bedient.
- Ein **Govern BYO**-Seat kann nur Modelle verwenden, die auf der eigenen Infrastruktur Ihrer Organisation bereitgestellt werden: diejenigen, die Ihr Vertex (oder ein anderer verbundener Cloud-Anbieter) bedient, und die selbst gehosteten Modelle auf Ihren Servern. Jedes andere Modell wird abgelehnt, und die Auswahl bietet ihm **Auto** nicht an.

## Sicherheit und Compliance

- **Verschlüsselte Anmeldeinformationen oder gar keine.** Bei Option A wird der Dienstkontoschlüssel verschlüsselt gespeichert (AES-256-GCM) und nie an den Browser zurückgegeben, nicht einmal an einen Administrator; der Bildschirm zeigt nur die E-Mail-Adresse des Kontos. Bei Option B wird kein Schlüssel gespeichert: SecureAI fordert bei Google kurzlebige Tokens an, die als Ihr Dienstkonto handeln.
- **Der Pfad bleibt geschützt.** Jeder Aufruf läuft über das SMLTP-Gateway von SecureAI: DLP, ein signiertes Autorisierungstoken pro Anfrage und ein überprüfbarer **signierter Beleg**.
- **Datenresidenz.** Mit einer festgelegten Region (zum Beispiel `europe-west4`) sendet SecureAI jede Anfrage an den Endpunkt dieser Region und wendet die Residenzrichtlinien Ihrer Organisation an. Wo Google die Anfrage verarbeitet, hängt von den Datenresidenz-Zusagen von Google ab.
- **Schlägt geschlossen fehl.** Wenn die Konfiguration nicht gelesen oder das Token von Google nicht abgerufen werden kann, wird die Anfrage abgelehnt; sie wird nicht an einen anderen Anbieter gesendet, es sei denn, Sie haben den Fallback erlaubt.
- **Audit.** Das Speichern, Testen oder Trennen der Integration wird im Aktivitätsprotokoll erfasst, mit den Namen der geänderten Felder und nie mit dem Schlüssel.
- **Minimale Berechtigungen sichtbar.** Der Verbindungstest prüft, was die Identität der Verbindung im Projekt sonst noch tun kann, und warnt, wenn sie Berechtigungen außerhalb von KI hat (siehe **Was die Identität sonst noch kann** in Schritt 4).
- **Minimale Berechtigungen.** `roles/aiplatform.user` genügt für die Inferenz; die Integration muss weder Ihr IAM noch Ihre Abrechnung lesen.

## Trennen

**Disconnect** (Fußzeile des Panels) löscht die Konfiguration und den gespeicherten Schlüssel. Ab diesem Moment **kehrt der gesamte Verkehr zu den von SecureAI verwalteten Anbietern zurück**. Sie können auch nur den Schalter **Route traffic to Vertex AI** ausschalten, um das Routing zu pausieren und die Verbindung beizubehalten.

Entfernen Sie anschließend auch den Zugriff in Google Cloud:

- **Option A:** Wenn Sie den Schlüssel nicht mehr verwenden, **widerrufen Sie ihn** (Dienstkonten → Schlüssel).
- **Option B:** Entfernen Sie die Rolle `roles/iam.serviceAccountTokenCreator`, die Sie dem SecureAI-Dienstkonto für Ihr Dienstkonto gewährt haben (Dienstkonten → Ihr Konto → **Berechtigungen**).

## Fehlerbehebung

Dies sind die Gründe, die **Test connection** anzeigen kann:

| Grund | Wahrscheinliche Ursache | Was zu tun ist |
|-------|-------------------------|----------------|
| Credential rejected or not usable | Unvollständiges oder ungültiges JSON oder ein widerrufener Schlüssel. Schlüssellos: Dem SecureAI-Konto fehlt `roles/iam.serviceAccountTokenCreator` für Ihr Dienstkonto, oder die E-Mail-Adresse ist falsch geschrieben | Fügen Sie das vollständige JSON erneut ein oder erstellen Sie einen neuen Schlüssel. Schlüssellos: Führen Sie den Befehl aus, den das Panel anzeigt, und prüfen Sie die E-Mail-Adresse. |
| Not authenticated | Google hat das Token abgelehnt | Prüfen Sie, ob das Dienstkonto existiert und aktiv ist. |
| Vertex AI API is not enabled on the project | Schritt 1.1 fehlt | Aktivieren Sie die **Agent Platform API (Vertex AI API)** (`aiplatform.googleapis.com`) für das Projekt. |
| Missing roles/aiplatform.user | Unzureichende Berechtigung | Gewähren Sie dem Dienstkonto die Rolle **Agent Platform User** (`roles/aiplatform.user`) für dieses Projekt. |
| Model not available in this location | Das Modell existiert in der gewählten Region nicht, oder es ist ein offenes Modell, dessen Bedingungen in Model Garden nicht akzeptiert wurden | Ändern Sie die Region oder dieses Standardmodell; akzeptieren Sie bei offenen Modellen die Bedingungen in Model Garden. |
| Quota exceeded | Vertex-Kontingent erschöpft | Prüfen Sie die Kontingente des Projekts oder beantragen Sie bei Google eine Erhöhung. |
| Google returned an error | Fehler auf der Seite von Google | Versuchen Sie es erneut; wenn es weiterhin auftritt, prüfen Sie den Status von Google Cloud. |
| Blocked by your SMLTP model policy | Die Richtlinie von SecureAI erlaubt das Modell nicht | Fügen Sie das Modell der zulässigen Richtlinie hinzu. |
| SMLTP Vertex gateway unreachable / TLS error | Problem mit der Infrastruktur von SecureAI | Wenden Sie sich an den Support. Es hängt nicht von Ihrem Google-Projekt ab. |
| Unexpected error | Ein Fehler, den SecureAI nicht einordnen konnte | Versuchen Sie es erneut. Wenn es weiterhin auftritt, wenden Sie sich mit der Meldung, die das Panel anzeigt, an den Support. |
| No default models configured | Alle vier Standardmodelle sind leer, daher gibt es nichts zu testen | Füllen Sie unter **Default Vertex models** mindestens eines aus, speichern Sie und testen Sie erneut. |

Fehler, die Nutzer im Chat sehen können:

| Code | Bedeutung |
|------|-----------|
| `SAI-VERTEX-001` | Das gewählte Modell hat keine Vertex-Entsprechung, und der Fallback ist ausgeschaltet. Wählen Sie ein anderes Modell oder erlauben Sie den Fallback. |
| `SAI-VERTEX-002` | Der Zugriff auf Google konnte nicht erlangt werden (ungültiger oder widerrufener Schlüssel oder, schlüssellos, die Berechtigung für den Identitätswechsel wurde entfernt). Erneuern Sie die Anmeldeinformation. |
| `SAI-VERTEX-005` | Die Konfiguration konnte nicht gelesen werden, und die Anfrage wurde aus Sicherheitsgründen abgelehnt. Versuchen Sie es in einigen Sekunden erneut. |

## Aktuelle Einschränkungen

- **Claude und Mistral auf Vertex** werden nicht unterstützt (sie verwenden eine andere API).
- **Embeddings, Re-Ranking, OCR, der Admin-Assistent, die Bildgenerierung und die Echtzeit-Sprache** bleiben bei von SecureAI verwalteten Anbietern.
- **Ein Vertex-Projekt und ein Standort** pro Organisation.
- Wie viele Inferenzanbieter Sie gleichzeitig aktivieren können, hängt von Ihrem Plan ab (Scale: 1, Enterprise: bis zu 3). Siehe [Azure AI Foundry — Inference on your account](/en/integrations/cloud/azure-ai-foundry-inference) und [Amazon Bedrock — Inference on your account](/en/integrations/cloud/aws-bedrock-inference).
- Der **Claude Code**-Proxy verwendet Anthropic direkt und läuft nicht über Vertex.

## Verwandte

- [Google Cloud — Discovery](/de/integrations/cloud/gcp-vertex-ai) – Inventar der Agenten, Modelle, Identitäten und Kosten des Projekts.
- [Azure AI Foundry — Inference on your account](/en/integrations/cloud/azure-ai-foundry-inference)
- [Amazon Bedrock — Inference on your account](/en/integrations/cloud/aws-bedrock-inference)
- [Übersicht Cloud-KI-Anbieter](/de/integrations/cloud/overview)
- [Signierte Belege](/de/api/receipts)
