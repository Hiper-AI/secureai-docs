---
id: elastic-security
title: "Elastische Sicherheitsintegration"
sidebar_label: "Elastische Sicherheit"
description: "Integrieren Sie HiperAI mit Elastic Security für erweiterte Bedrohungserkennung und Sicherheitsanalysen"
---
# Integration von SecureAI mit Elastic SIEM

Diese Anleitung enthält Schritt-für-Schritt-Anleitungen zur Integration von SecureAI in Ihre Elastic SIEM-Instanz. Mit dieser Integration können Sie Ereignisprotokolle von SecureAI zur Überwachung, Analyse und Warnung an Elasticsearch weiterleiten.

## Schritt 1: Besorgen Sie sich Ihren Elastic Cloud Endpoint

Zunächst müssen Sie die Endpunkt-URL von Ihrer Elastic Cloud-Bereitstellung abrufen.

1. Melden Sie sich bei Ihrem Elastic Cloud-Konto an.
2. Suchen Sie auf der Startseite die gewünschte Bereitstellung.
3. Suchen Sie die Elasticsearch-Endpunkt-URL und kopieren Sie sie. Diese benötigen Sie später für die SecureAI-Konfiguration.

<div class="mac-window">
  ![Elastic Cloud Endpoint](/img/elastic%20images/Elastic%20-%201.png)
</div>

## Schritt 2: Erstellen Sie einen API-Schlüssel in Elasticsearch

Damit SecureAI Daten sicher an Ihren Elasticsearch-Cluster senden kann, ist ein API-Schlüssel erforderlich.

1. Navigieren Sie in Ihrem Kibana-Dashboard zu **Verwaltung** > **API-Schlüssel**.
2. Klicken Sie auf die Schaltfläche **API-Schlüssel erstellen**.

<div class="mac-window">
  ![Schaltfläche „API-Schlüssel erstellen“](/img/elastic%20images/Elastic%20-%202.png)
</div>

3. Konfigurieren Sie den API-Schlüssel mit den folgenden Details:

<div class="mac-window">
  ![API-Schlüssel konfigurieren](/img/elastic%20images/Elastic%20-%203.png)
</div>

   - **Name**: `secureai-siem-integration` (oder ein anderer beschreibender Name).
   - **Rolle**: Weisen Sie eine Rolle zu, die über die erforderlichen Berechtigungen zum Schreiben in Indizes verfügt. Der Einfachheit halber legen wir in diesem Leitfaden kein Ablaufdatum oder bestimmte Rollenbeschränkungen fest.
4. Klicken Sie auf **API-Schlüssel erstellen**.

<div class="mac-window">
  ![Klicken Sie auf API-Schlüssel erstellen](/img/elastic%20images/Elastic%20-%204.png)
</div>

5. Ihr Schlüssel wird generiert und angezeigt. Kopieren Sie den Base64-codierten API-Schlüssel und speichern Sie ihn an einem sicheren Ort. Sie können es nicht mehr sehen, nachdem Sie diesen Bildschirm verlassen haben.

<div class="mac-window">
  ![API-Schlüssel generiert](/img/elastic%20images/Elastic%20-%205.png)
</div>

## Schritt 3: Erstellen Sie den Zielindex in Elasticsearch

Sie müssen in Elasticsearch einen Index erstellen und zuordnen, in dem die SecureAI-Ereignisse gespeichert werden.

1. Navigieren Sie in Kibana zu **Entwicklertools**.
2. Führen Sie in der Konsole den folgenden Befehl aus, um den Index `secureai-events` mit den entsprechenden Feldzuordnungen zu erstellen:

```json
PUT /secureai-events
{
  "mappings": {
    "properties": {
      "timestamp": { "type": "date" },
      "event_type": { "type": "keyword" },
      "source": { "type": "keyword" },
      "severity": { "type": "keyword" },
      "category": { "type": "keyword" },
      "user": { "type": "keyword" },
      "ip": { "type": "ip" },
      "action": { "type": "keyword" },
      "message": { "type": "text" }
    }
  }
}
```

<div class="mac-window">
  ![Index in Entwicklertools erstellen](/img/elastic%20images/Elastic%20-%206.png)
</div>

## Schritt 4: Konfigurieren Sie die Elastic SIEM-Integration in SecureAI

Geben Sie nun die Elastic-Details in das SecureAI-Integrationsfenster ein.

1. Navigieren Sie in Ihrem SecureAI-Dashboard zu **Integrationen**.
2. Suchen Sie die Integrationskarte **Elastic SIEM** und klicken Sie auf **Konfigurieren**.
3. Füllen Sie die Konfigurationsfelder wie folgt aus:
   - **Integrationsname**: `secureai-app-elastic`
   - **Elastische URL**: Fügen Sie den Endpunkt ein, den Sie in Schritt 1 kopiert haben.
   - **Elastic API Key**: Fügen Sie den Base64-codierten API-Schlüssel ein, den Sie in Schritt 2 erstellt haben.
   - **Elastischer Index**: `secureai-events`
   - **Ereigniskategorien auswählen**: Aktivieren Sie alle Kontrollkästchen, um alle verfügbaren Ereignistypen an Ihr Elastic SIEM weiterzuleiten.
4. Klicken Sie auf **Aktualisieren**, um die Konfiguration zu speichern.

<div class="mac-window">
  ![Klicken Sie auf „Aktualisieren“, um die Konfiguration zu speichern](/img/elastic%20images/Elastic%20-%207.png)
</div>

## Schritt 5: Testen und überprüfen Sie die Verbindung

Testen Sie nach dem Speichern der Konfiguration die Verbindung, um sicherzustellen, dass SecureAI mit Ihrer Elastic-Instanz kommunizieren kann.

1. Klicken Sie im Modal „Integrationseinstellungen“ auf die Schaltfläche **Verbindung testen**.
2. Sie sollten eine Erfolgsmeldung sehen: „Test erfolgreich! Verbindung bestätigt.“

<div class="mac-window">
  ![Nachricht über erfolgreichen Test](/img/elastic%20images/Elastic%20-%208.png)
</div>

3. Um zu bestätigen, dass die Testdaten empfangen wurden, gehen Sie in Kibana zu **Entdecken**.
4. Wählen Sie die Datenansicht `secureai-events` (Indexmuster).
5. Sie sollten ein Testereignisprotokoll von SecureAI sehen, das bestätigt, dass die Integration ordnungsgemäß funktioniert.

<div class="mac-window">
  ![Bestätigung des Testereignisprotokolls](/img/elastic%20images/Elastic%20-%209.png)
</div>

Ihre SecureAI- und Elastic SIEM-Integration ist jetzt aktiv. Ereignisse werden in Ihrem `secureai-events`-Index protokolliert, sobald sie auftreten.

## Fertig!

Mit diesen Schritten ist Ihre Elastic-Instanz vollständig für die Integration mit SecureAI konfiguriert 😎.