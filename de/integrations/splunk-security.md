---
id: splunk-security
title: "Splunk-Sicherheitsintegration"
sidebar_label: "Splunk-Sicherheit"
description: "Integrationsleitfaden: Splunk SIEM mit HiperAI über HTTP Event Collector (HEC) verbinden"
---
# Splunk-Sicherheitsintegration

Integrationsleitfaden: Splunk SIEM mit HiperAI verbinden

In dieser Anleitung werden die notwendigen Schritte beschrieben, um Splunk für den Empfang von Sicherheitsprotokollen von HiperAI über den HTTP Event Collector (HEC) zu konfigurieren.

## Schritt 1: Erstellen Sie einen neuen Index

Zunächst erstellen wir einen dedizierten Bereich zum Speichern der Anwendungsprotokolle.

### A. Navigieren Sie auf dem Splunk-Startbildschirm zu Einstellungen > Indizes.

<div class="mac-window">
  ![Splunk-Einstellungsindizes](/img/splunk%20images/1%20-%20Splunk%20Integration.png)
</div>

### B. Klicken Sie oben rechts auf die Schaltfläche „Neuer Index“.

### C. Konfigurieren Sie den Index:

- **Indexname**: `secureai_events`
- Belassen Sie alle anderen Optionen auf ihren Standardwerten für eine Standardkonfiguration.
- Klicken Sie auf **Speichern**.

<div class="mac-window">
  ![Splunk-Indexkonfiguration](/img/splunk%20images/2%20-%20Splunk%20Integration.png)
</div>

Ihr neuer Index ist nun erstellt und bereit zum Empfangen von Daten.

## Schritt 2: Aktivieren Sie den HTTP Event Collector (HEC)

Als Nächstes stellen wir sicher, dass Splunk auf eingehende Datenanfragen wartet.

### A. Gehen Sie zu Einstellungen > Dateneingaben.

<div class="mac-window">
  ![Splunk-Dateneingaben](/img/splunk%20images/3%20-%20Splunk%20Integration.png)
</div>

### B. Klicken Sie unter „Lokale Eingaben“ auf HTTP Event Collector.

<div class="mac-window">
  ![Splunk HTTP Event Collector](/img/splunk%20images/4%20-%20Splunk%20Integration.png)
</div>

### C. Klicken Sie oben rechts auf Globale Einstellungen.

### D. Überprüfen Sie die folgende Konfiguration:

- **Alle Token**: Muss aktiviert sein.
- **SSL aktivieren**: (Optional) Dies wird für Produktionsumgebungen empfohlen, kann aber für erste Tests deaktiviert werden.
- **HTTP-Portnummer**: Stellen Sie sicher, dass der Port 8088 ist.
- Klicken Sie auf **Speichern**.

<div class="mac-window">
  ![Splunk HEC Global Settings](/img/splunk%20images/5%20-%20Splunk%20Integration.png)
</div>

## Schritt 3: Erstellen Sie das HEC-Token

Das Token ist der sichere Zugriffsschlüssel, den unsere Anwendung zur Authentifizierung bei Splunk verwendet.

### A. Kehren Sie zur Seite HTTP Event Collector zurück (Einstellungen > Dateneingaben > HTTP Event Collector).

### B. Klicken Sie auf die Schaltfläche „Neues Token“.

<div class="mac-window">
  ![Splunk-Schaltfläche „Neues Token“](/img/splunk%20images/6%20-%20Splunk%20Integration.png)
</div>

### C. Token-Konfiguration (Registerkarte 1):

- **Name**: `token_secureai_app`
- **Beschreibung**: (Optional) Fügen Sie eine kurze Beschreibung hinzu.
- **Indexerbestätigung aktivieren**: **WICHTIG**: Stellen Sie sicher, dass dieses Kontrollkästchen deaktiviert ist.
- Klicken Sie auf **Weiter**.

<div class="mac-window">
  ![Splunk-Token-Konfiguration](/img/splunk%20images/7%20-%20Splunk%20Integration.png)
</div>

### D. Eingabeeinstellungen (Registerkarte 2):

- **Quellentyp**: Klicken Sie auf „Auswählen“. Geben Sie im Suchfeld `_json` ein und wählen Sie es aus der Liste aus. Dadurch wird Splunk angewiesen, Daten im JSON-Format zu erwarten.
- **Zulässige Indizes**: Suchen Sie in der Spalte „Verfügbare Indizes“ den von uns erstellten Index (`secureai_events`) und klicken Sie darauf, um ihn in die Spalte „Ausgewählte Indizes“ zu verschieben.
- **Standardindex**: Wählen Sie `secureai_events` aus dem Dropdown-Menü.

<div class="mac-window">
  ![Splunk-Eingabeeinstellungen](/img/splunk%20images/8%20-%20Splunk%20Integration.png)
</div>

- Klicken Sie auf **Überprüfen** und dann auf **Senden**.

<div class="mac-window">
  ![Splunk überprüfen und einreichen](/img/splunk%20images/9%20-%20Splunk%20Integration.png)
</div>

### E. Kopieren Sie den Token-Wert!

Splunk zeigt nun den Token-Wert an. Kopieren Sie es sofort und speichern Sie es an einem sicheren Ort. Dies ist das Token, das Sie in unserer Anwendung konfigurieren müssen.

<div class="mac-window">
  ![Splunk-Token-Wert](/img/splunk%20images/10%20-%20Splunk%20Integration.png)
</div>

## Schritt 4: Informationen finalisieren und teilen

Du bist fast fertig. Nur noch ein letzter Schritt.

### A. Sammeln Sie die Informationen

Um die Integration abzuschließen, benötigt die Anwendung die folgenden drei Informationen:

1. **HEC-URL**: Die Adresse Ihres Splunk-Servers und der HEC-Port (z. B. `http://splunk.yourcompany.com:8088/services/collector`).
2. **Das HEC-Token**: Der Wert, den Sie im vorherigen Schritt kopiert haben.
3. **Der Indexname**: Der Name des von Ihnen erstellten Index (`secureai_events`).

<div class="mac-window">
  ![Splunk-Indexinformationen](/img/splunk%20images/11%20-%20Splunk%20Integration.png)
</div>

### B. Überprüfen Sie die Firewall-Regeln

Stellen Sie sicher, dass jede Firewall zwischen dem Anwendungsserver und Ihrem Splunk-Server Datenverkehr auf dem HEC-Port (normalerweise TCP 8088) zulässt.

## Schritt 4: Hinweis zum Datenformat (Quellentyp)

Um sicherzustellen, dass Daten korrekt identifiziert und analysiert werden, sendet unsere Anwendung Protokolle in einem bestimmten strukturierten JSON-Format.

**Wichtig**: Alle von SecureAI gesendeten Ereignisse haben den Quelltyp `secureai:json`.

Dieser Wert wird direkt in der von unserer Anwendung gesendeten Datennutzlast festgelegt, sodass er automatisch den von Ihnen für das Token ausgewählten Standardquellentyp (`_json`) überschreibt. Es sind keine weiteren Maßnahmen erforderlich, aber es ist wichtig für Sie zu wissen, dass Sie die Daten bei Ihren Suchanfragen unter „sourcetype="secureai:json"“ finden.

## Schritt 6: Überprüfen Sie die Integration

Sobald Sie die Integrationsdetails in die SecureAI-Anwendung eingegeben haben, können Sie überprüfen, ob die Verbindung ordnungsgemäß funktioniert.

### A. Testen Sie die Verbindung

Nutzen Sie die Schaltfläche „Verbindung testen“ innerhalb unserer Anwendung. Dadurch wird ein Testereignis an Ihren Splunk-Index gesendet.

<div class="mac-window">
  ![Splunk-Testverbindung](/img/splunk%20images/12%20-%20Splunk%20Integration.png)
</div>

Sie erhalten eine Erfolgsmeldung, wenn das Ereignis korrekt gesendet wurde, oder eine Fehlermeldung, wenn die angegebenen Daten falsch sind.

### B. Suchen Sie das Testereignis in Splunk

Um zu sehen, ob das Ereignis in Splunk angekommen ist, gehen Sie zur Search & Reporting-App.

Führen Sie in der Suchleiste eine Suche nach Ihrem Index durch (z. B. `index="secureai_events"`).

Stellen Sie den Zeitbereich auf „Letzte 24 Stunden“ ein. Das Testprotokoll sollte in den Ergebnissen angezeigt werden.

<div class="mac-window">
  ![Splunk-Suchergebnisse](/img/splunk%20images/13%20-%20Splunk%20Integration.png)
</div>

**Hinweis**: Abhängig vom Netzwerkverkehr und der Systemlast kann es manchmal bis zu 10 Minuten dauern, bis Protokolle in Splunk angezeigt werden.

## Fertig!

Mit diesen Schritten ist Ihre Splunk-Instanz vollständig für die Integration mit SecureAI konfiguriert 😎.