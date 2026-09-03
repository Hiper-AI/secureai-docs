---
id: microsoft-sentinel
title: "Microsoft Sentinel-Integration"
sidebar_label: "Microsoft Sentinel"
description: "Integrationsleitfaden: Microsoft Sentinel mit HiperAI über Azure Data Collection Rules (DCR) verbinden"
---
# Microsoft Sentinel-Integration

Integrationsleitfaden: Microsoft Sentinel mit HiperAI verbinden

In dieser Anleitung werden die notwendigen Schritte beschrieben, um Microsoft Sentinel für den Empfang von Sicherheitsprotokollen von SecureAI über Azure Data Collection Rules (DCR) zu konfigurieren.

## Schritt 1: Erstellen Sie die Anwendungsidentität (App-Registrierung)

Zunächst erstellen wir eine Identität für Ihre Anwendung in Azure, die eine sichere Authentifizierung ermöglicht.

### A. Gehen Sie zu Azure Active Directory

Suchen Sie im Azure-Portal nach **Azure Active Directory** und wählen Sie es aus.

<div class="mac-window">
  ![Azure Active Directory-Suche](/img/ms%20sentinel%20-%20images/Sentinel%20-%201.png)
</div>

### B. Neue Registrierung

Navigieren Sie im linken Menü zu **App-Registrierungen** und klicken Sie auf **+ Neue Registrierung**.

<div class="mac-window">
  ![App-Registrierungsmenü](/img/ms%20sentinel%20-%20images/Sentinel%20-%202.png)
</div>

### C. Benennen Sie die Anwendung

Geben Sie einen eindeutigen Namen an, z. B. `SecureAI-Log-Ingester`, und belassen Sie die anderen Optionen als Standardwerte. Klicken Sie auf **Registrieren**.

<div class="mac-window">
  ![App-Registrierungsformular](/img/ms%20sentinel%20-%20images/Sentinel%20-%203.png)
</div>

### D. Kopieren Sie die IDs

Kopieren Sie von der Übersichtsseite der neuen Anwendung die folgenden Werte und speichern Sie sie sicher:
- **Anwendungs-(Client-)ID**
- **Verzeichnis-(Mandanten-)ID**

<div class="mac-window">
  ![Anwendungsübersicht mit IDs](/img/ms%20sentinel%20-%20images/Sentinel%20-%204.png)
</div>

### E. Erstellen Sie das Client-Geheimnis

Gehen Sie im linken Menü zu **Zertifikate & Geheimnisse** und klicken Sie auf **+ Neues Kundengeheimnis**. Geben Sie eine Beschreibung ein (z. B. „SentinelLogKey“) und klicken Sie auf **Hinzufügen**.

<div class="mac-window">
  ![Client-Geheimnis erstellen](/img/ms%20sentinel%20-%20images/Sentinel%20-%205.png)
</div>

**KRITISCHER SCHRITT**: Kopieren Sie sofort den **Wert** des Geheimnisses. Dies ist das einzige Mal, dass es vollständig sichtbar ist. Bewahren Sie es sicher zusammen mit den anderen Ausweisen auf.

<div class="mac-window">
  ![Client Secret Value](/img/ms%20sentinel%20-%20images/Sentinel%20-%206.png)
</div>

## Schritt 2: Erstellen Sie die Azure-Aufnahmeinfrastruktur

Jetzt erstellen wir den „Pfad“ und den „Speicher“ für Ihre Protokolle.

### A. Erstellen Sie den Data Collection Endpoint (DCE)

#### 1. Suchen Sie den Dienst

Suchen Sie in der Azure-Suchleiste nach **Datenerfassungsendpunkte** und wählen Sie diese aus.

<div class="mac-window">
  ![Datenerfassungsendpunkte durchsuchen](/img/ms%20sentinel%20-%20images/Sentinel%20-%207.png)
</div>

#### 2. Erstellen Sie ein neues DCE

Klicken Sie auf ***+Erstellen**.

<div class="mac-window">
  ![Datenerfassungsendpunkt erstellen](/img/ms%20sentinel%20-%20images/Sentinel%20-%208.png)
</div>

#### 3. Konfigurieren Sie den DCE

- **Name**: `dce-secureai-integration`
– **Region**: Wählen Sie dieselbe Region wie Ihren Log Analytics-Arbeitsbereich
- Klicken Sie auf **Überprüfen + erstellen** und dann auf **Erstellen**

<div class="mac-window">
  ![DCE überprüfen und erstellen](/img/ms%20sentinel%20-%20images/Sentinel%20-%209.png)
</div>

#### 4. Kopieren Sie die URI

Navigieren Sie nach der Bereitstellung zur Ressource. Kopieren Sie auf der Übersichtsseite den **Protokollaufnahme-URI** und speichern Sie ihn.

<div class="mac-window">
  ![DCE-Übersicht mit URI](/img/ms%20sentinel%20-%20images/Sentinel%20-%2010.png)
</div>

### B. Erstellen Sie die benutzerdefinierte Tabelle und Datenerfassungsregel (DCR)

#### 1. Gehen Sie zu Log Analytics

Navigieren Sie zu Ihrem **Log Analytics-Arbeitsbereich**.

#### 2. Erstellen Sie eine benutzerdefinierte Tabelle

Klicken Sie im linken Menü auf **Tabellen**, dann auf **+ Erstellen** und wählen Sie **Neues benutzerdefiniertes Protokoll (DCR-basiert)** aus.

<div class="mac-window">
  ![Benutzerdefinierte Tabelle erstellen](/img/ms%20sentinel%20-%20images/Sentinel%20-%2011.png)
</div>

#### 3. Registerkarte „Grundlagen“.

– **Tabellenname**: `secureaitosiem` (Azure hängt automatisch `_CL` an, wodurch der vollständige Name `secureaitosiem_CL` entsteht)
- **Datenerfassungsregel**: Wählen Sie „Neue erstellen…“ und nennen Sie sie `dcr-secureai-events`

<div class="mac-window">
  ![Einrichtung der Datenerfassungsregel](/img/ms%20sentinel%20-%20images/Sentinel%20-%2012.png)
</div>

- **Datenerfassungsendpunkt**: Wählen Sie den DCE aus, den Sie zuvor erstellt haben (`dce-secureai-integration`)
- Klicken Sie auf **Weiter: Schema und Transformation**

<div class="mac-window">
  ![Nächstes Schema und Transformation](/img/ms%20sentinel%20-%20images/Sentinel%20-%2013.png)
</div>

#### 4. Tab „Schema und Transformation“.

**Beispieldatei hochladen**: Das System fordert Sie dazu auf. Erstellen Sie eine `.json`-Datei mit folgendem Inhalt und laden Sie sie hoch:

```json
[
  {
    "time": "2025-08-30T21:34:29.013Z",
    "level": "Info",
    "message": "SecureAI platform started successfully",
    "component": "SystemService",
    "correlationId": "test-001"
  },
  {
    "time": "2025-08-30T21:34:30.013Z",
    "level": "Warning",
    "message": "High memory usage detected on server",
    "component": "MonitoringService",
    "correlationId": "test-002"
  },
  {
    "time": "2025-08-30T21:34:31.013Z",
    "level": "Error",
    "message": "Database connection timeout after 30 seconds",
    "component": "DatabaseService",
    "correlationId": "test-003"
  },
  {
    "time": "2025-08-30T21:34:32.013Z",
    "level": "Info",
    "message": "User admin@secureai.com logged in successfully",
    "component": "AuthService",
    "correlationId": "test-004"
  },
  {
    "time": "2025-08-30T21:34:33.013Z",
    "level": "Warning",
    "message": "API rate limit approaching threshold",
    "component": "APIGateway",
    "correlationId": "test-005"
  },
  {
    "time": "2025-08-30T21:34:34.013Z",
    "level": "Info",
    "message": "Security scan completed - 0 threats found",
    "component": "SecurityScanner",
    "correlationId": "test-006"
  },
  {
    "time": "2025-08-30T21:34:35.013Z",
    "level": "Error",
    "message": "Failed to sync with external SIEM system",
    "component": "SIEMSync",
    "correlationId": "test-007"
  },
  {
    "time": "2025-08-30T21:34:36.013Z",
    "level": "Info",
    "message": "Backup job completed successfully",
    "component": "BackupService",
    "correlationId": "test-008"
  }
]
```

**Beispieldatei herunterladen**: Sie können auch die vollständige JSON-Beispieldatei herunterladen, um sie direkt zu verwenden:

<a href="/de/en/sample-json.json" download>📥 sample.json</a>

#### 5. Wenden Sie die Transformation an

Das System zeigt möglicherweise eine Warnung zum Feld TimeGenerated an. Klicken Sie auf die Schaltfläche **Transformationseditor**, löschen Sie alle vorhandenen Inhalte und fügen Sie die folgende vollständige KQL-Abfrage ein:

```kql
source
| extend TimeGenerated = todatetime(['time'])
| project
    TimeGenerated,
    Level_s = tostring(['level']),
    Message_s = tostring(['message']),
    Component_s = tostring(['component']),
    CorrelationId_s = tostring(['correlationId'])
```

<div class="mac-window">
  ![KQL-Transformationsabfrage](/img/ms%20sentinel%20-%20images/Sentinel%20-%2014.png)
</div>

Klicken Sie auf **Anwenden**. Sie sollten eine Vorschau der Tabelle mit allen korrekten Spalten und Datentypen sehen.

<div class="mac-window">
  ![Transformation anwenden](/img/ms%20sentinel%20-%20images/Sentinel%20-%2015.png)
</div>

#### 6. Schließen Sie die Erstellung ab

Klicken Sie auf **Weiter: Überprüfen + erstellen** und dann auf **Erstellen**.

<div class="mac-window">
  ![DCR überprüfen und erstellen](/img/ms%20sentinel%20-%20images/Sentinel%20-%2016.png)
</div>

## Schritt 3: Verbinden Sie die Identität mit der Infrastruktur (Berechtigungen)

Dieser entscheidende Schritt erteilt unserer Anwendung die Erlaubnis, die soeben erstellte Datenerfassungsregel zu verwenden.

### A. Gehen Sie zu Ihrem neuen DCR

Suchen Sie nach Ihrer Datenerfassungsregel `dcr-secureai-events` und öffnen Sie sie. Kopieren Sie unter „Übersicht“ die unveränderliche ID und speichern Sie sie zur Integration.

<div class="mac-window">
  ![DCR-Übersicht mit unveränderlicher ID](/img/ms%20sentinel%20-%20images/Sentinel%20-%2017.png)
</div>

### B. Weisen Sie die Rolle zu

Gehen Sie im linken Menü zu **Zugriffskontrolle (IAM)** und klicken Sie auf **+ Hinzufügen** → **Rollenzuweisung hinzufügen**.

<div class="mac-window">
  ![Rollenzuweisung hinzufügen](/img/ms%20sentinel%20-%20images/Sentinel%20-%2018.png)
</div>

**Rolle**: Suchen Sie nach **Monitoring Metrics Publisher** und wählen Sie es aus.

<div class="mac-window">
  ![Wählen Sie die Rolle des Herausgebers von Überwachungsmetriken aus](/img/ms%20sentinel%20-%20images/Sentinel%20-%2019.png)
</div>

**Mitglieder**: Klicken Sie auf **Mitglieder auswählen** und suchen Sie nach Ihrem App-Registrierungsnamen (`SecureAI-Log-Ingester`). Wählen Sie es aus.

<div class="mac-window">
  ![App-Registrierungsmitglied auswählen](/img/ms%20sentinel%20-%20images/Sentinel%20-%2020.png)
</div>

Klicken Sie auf **Überprüfen + zuweisen**.

## Schritt 4: Informationen finalisieren und teilen

Du bist fast fertig. Nur noch ein letzter Schritt.

### A. Sammeln Sie die Informationen

Um die Integration abzuschließen, benötigt die Anwendung die folgenden sechs Informationen:

1. **Mieter-ID**: (Aus Schritt 1)
2. **Kunden-ID**: (Aus Schritt 1)
3. **Client-Geheimnis**: (Aus Schritt 1)
4. **DCE-URI**: (Aus Schritt 2A)
5. **DCR Immutable ID**: (Navigieren Sie zu Ihrem DCR `dcr-secureai-events` und kopieren Sie diesen aus der JSON-Ansicht.)
6. **Stream-Name**: Dies ist ein konstruierter Wert. Das Format ist `Custom-{TableName}`. In unserem Fall wäre es: `Custom-secureaitosiem_CL`

### B. Konfigurieren Sie die Anwendung

Geben Sie diese 6 Werte in die Konfigurationseinstellungen Ihrer Anwendung ein.

<div class="mac-window">
  ![Anwendungskonfigurationseinstellungen](/img/ms%20sentinel%20-%20images/Sentinel%20-%2021.png)
</div>

## Schritt 5: Überprüfen Sie die Integration

Sobald Sie die Integrationsdetails in die SecureAI-Anwendung eingegeben haben, können Sie überprüfen, ob die Verbindung ordnungsgemäß funktioniert.

### A. Testen Sie die Verbindung

Nutzen Sie die Schaltfläche „Verbindung testen“ innerhalb unserer Anwendung. Dadurch wird ein Testereignis an Ihren Microsoft Sentinel-Arbeitsbereich gesendet.

### B. Suchen Sie das Testereignis in Log Analytics

Um zu sehen, ob das Ereignis in Microsoft Sentinel angekommen ist, gehen Sie zu Ihrem Log Analytics-Arbeitsbereich und klicken Sie auf **Protokolle**.

Führen Sie die folgende Abfrage aus, um Ihre eingehenden Daten anzuzeigen:

```kql
secureaitosiem_CL
| order by TimeGenerated desc
```

Ihre Protokolldaten sollten so angezeigt werden, dass alle Spalten (`TimeGenerated`, `Level_s`, `Message_s` usw. korrekt ausgefüllt sind. Dann ist Ihre Integration ein Erfolg! ✅

<div class="mac-window">
  ![Erfolgreiche Integrationsüberprüfung](/img/ms%20sentinel%20-%20images/Sentinel%20-%2022.png)
</div>

**Hinweis**: Abhängig vom Netzwerkverkehr und der Systemlast kann es manchmal bis zu 10 Minuten dauern, bis Protokolle in Microsoft Sentinel angezeigt werden.

## Fertig!

Mit diesen Schritten ist Ihre Microsoft Sentinel-Instanz vollständig für die Integration mit SecureAI konfiguriert 😎.