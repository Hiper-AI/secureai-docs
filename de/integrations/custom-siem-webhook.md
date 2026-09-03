---
id: custom-siem-webhook
title: "Benutzerdefinierte SIEM-/Webhook-Integration"
sidebar_label: "Benutzerdefiniertes SIEM/Webhook"
description: "Generische SIEM-Integration (HTTP/Webhook) zum Senden von SecureAI-Sicherheitsprotokollen an jeden benutzerdefinierten HTTP-Endpunkt"
---
# Generische SIEM-Integration (HTTP/Webhook).

## Übersicht

Mit der generischen SIEM-Integration (HTTP/Webhook) können Sie SecureAI-Sicherheitsprotokolle an jeden benutzerdefinierten HTTP-Endpunkt senden. Dies eignet sich perfekt für die Integration in SIEM-Systeme, die keine native Unterstützung, keine benutzerdefinierten Sicherheitstools oder kein HTTP-basiertes Protokollierungssystem bieten.

## Anwendungsfälle

- **Benutzerdefinierte SIEM-Systeme**: Senden Sie Protokolle an Ihre internen Sicherheitsüberwachungstools
- **Sicherheitsplattformen von Drittanbietern**: Integration mit Sicherheitstools, die Webhooks akzeptieren
- **Benutzerdefinierte Dashboards**: Erstellen Sie Ihre eigene Visualisierung von Sicherheitsereignissen
- **Testen und Entwicklung**: Verwenden Sie Webhook-Testdienste, um die Protokollzustellung zu überprüfen
- **Legacy-Systeme**: Stellen Sie eine Verbindung zu älteren Sicherheitstools her, die nur HTTP-Endpunkte unterstützen

## Konfigurationsschritte

### 1. Holen Sie sich einen Testendpunkt

Zu Testzwecken empfehlen wir die Verwendung von webhook.site:

1. Besuchen Sie [https://webhook.site](https://webhook.site)
2. Kopieren Sie Ihre eindeutige URL (z. B. `https://webhook.site/ae0761ed-7939-4d86-be2f-ed58d0e65dd3`)
3. Lassen Sie diese Seite geöffnet, um eingehende Webhooks zu überwachen

<div class="mac-window">
  ![Webhook.site-Testendpunkt](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%201.png)
</div>

### 2. Konfigurieren Sie die Integration

1. Navigieren Sie in Ihrem SecureAI-Admin-Panel zu **Integrationen**
2. Suchen Sie in der SIEM-Kategorie nach **„Generic SIEM (HTTP/Webhook)“**
3. Klicken Sie auf **"Integration verbinden"**

### 3. Geben Sie die Konfiguration ein

#### Grundeinstellungen

- **Integrationsname**: `Test Generic SIEM` (oder ein beliebiger beschreibender Name)
- **Endpunkt-URL**: `https://webhook.site/ae0761ed-7939-4d86-be2f-ed58d0e65dd3`
- **HTTP-Methode**: `POST` (empfohlen für die meisten SIEM-Plattformen)
- **HTTP-Header**: `{"Content-Type": "application/json"}`

<div class="mac-window">
  ![HTTP-Header-Konfiguration](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%202.png)
</div>

#### Ereigniskategorien

Wählen Sie aus, welche Arten von Ereignissen weitergeleitet werden sollen:

✅ **Zum Testen empfohlen:**
- Authentifizierung und Anmeldung
- API- und Modellnutzung
- Datenzugriff und PHI
- SMLTP und Richtlinien
- Abrechnungs- und Nutzungsbeschränkungen
- Analytik

⚠️ **Optional (kann ein hohes Volumen erzeugen):**
- Sicherheit und Verstöße
- System und Infrastruktur
- Konfigurationsänderungen

### 4. Testen Sie die Verbindung

1. Klicken Sie auf **„Verbindung testen“**, um die Konnektivität zu überprüfen

<div class="mac-window">
  ![Schaltfläche „Verbindung testen“](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%203.png)
</div>

2. Überprüfen Sie webhook.site – Sie sollten eine Testanfrage sehen
3. Überprüfen Sie, ob die Antwort erfolgreich war

<div class="mac-window">
  ![Verifizierung der Erfolgsantwort](/img/generic%20siem%20-%20Images/Generic%20SIEM%20-%204.png)
</div>

### 5. Speichern und überwachen

1. Klicken Sie auf **„Verbinden“**, um die Konfiguration zu speichern
2. Führen Sie Aktionen in Ihrem SecureAI-System durch (Anmeldung, API-Aufrufe usw.)
3. Überwachen Sie webhook.site, um Echtzeitprotokolle anzuzeigen

## Erweiterte Konfiguration

### Benutzerdefinierte Header

Sie können benutzerdefinierte Header zur Authentifizierung oder für bestimmte Anforderungen hinzufügen:

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer your-api-key",
  "X-Custom-Header": "custom-value"
}
```

### Wann man benutzerdefiniertes SIEM verwenden sollte

Die benutzerdefinierte SIEM-Integration ist in diesen Szenarien besonders nützlich:

- **Kein SIEM-System**: Wenn Sie derzeit keine SIEM-Plattform verwenden, bietet dies eine einfache Möglichkeit, mit der Erfassung von Sicherheitsprotokollen zu beginnen
- **Zusätzliche Datenziele**: Senden Sie Daten gleichzeitig an mehrere Standorte (z. B. Ihr primäres SIEM + ein Backup-System)
- **Benutzerdefinierte Tools**: Integration mit speziellen Sicherheitstools, Rechenzentren oder benutzerdefinierten Dashboards
- **Kommunikationsplattformen**: Senden Sie Benachrichtigungen an Teams-Kanäle, Slack oder andere Tools für die Zusammenarbeit
- **Legacy-Systeme**: Stellen Sie eine Verbindung zu älteren Sicherheitstools her, die nur HTTP-Endpunkte unterstützen
- **Testen und Entwicklung**: Verwenden Sie Webhook-Testdienste, um die Protokollzustellung vor der Produktionsbereitstellung zu überprüfen

**Hinweis**: Wenn Sie bereits über ein unterstütztes SIEM (Splunk, Microsoft Sentinel, Elastic) verfügen, empfehlen wir die Verwendung unserer nativen Integrationen für optimale Leistung und Funktionen.

## Fehlerbehebung

### Häufige Probleme

1. **Verbindungszeitlimit**: Überprüfen Sie, ob der Endpunkt erreichbar ist und antwortet
2. **Authentifizierungsfehler**: API-Schlüssel und Authentifizierungsheader überprüfen
3. **SSL/TLS-Probleme**: Stellen Sie sicher, dass die Zertifikatsvalidierung für HTTPS-Endpunkte ordnungsgemäß erfolgt

### Überwachung

- Überprüfen Sie den Integrationsstatus in Ihrem SecureAI-Admin-Panel
- Überwachen Sie die Erfolgsraten der Webhook-Zustellung
– Überprüfen Sie fehlgeschlagene Webhook-Versuche in den Protokollen
- Überprüfen Sie die Verfügbarkeit und Antwortzeiten der Endpunkte

## Sicherheitsüberlegungen

- **Nur HTTPS**: Verwenden Sie in der Produktion immer HTTPS-Endpunkte
- **Authentifizierung**: Implementieren Sie eine ordnungsgemäße Authentifizierung für Ihre Webhook-Endpunkte
- **Ratenbegrenzung**: Konfigurieren Sie entsprechende Ratenbegrenzungen für Ihre Endpunkte
- **Protokollaufbewahrung**: Implementieren Sie ordnungsgemäße Richtlinien zur Protokollaufbewahrung zur Einhaltung der Vorschriften
- **Zugriffskontrolle**: Beschränken Sie den Zugriff auf Webhook-Endpunkte nur auf autorisierte Systeme

## Best Practices

1. **Klein anfangen**: Beginnen Sie mit wesentlichen Veranstaltungskategorien und erweitern Sie diese schrittweise
2. **Gründlich testen**: Verwenden Sie webhook.site oder ähnliche Dienste für erste Tests
3. **Leistung überwachen**: Achten Sie auf Verzögerungen oder Fehler bei der Webhook-Zustellung
4. **Dokumentenkonfiguration**: Führen Sie detaillierte Aufzeichnungen über die Einrichtung Ihres Webhooks
5. **Regelmäßige Überprüfung**: Webhook-Konfigurationen regelmäßig überprüfen und aktualisieren
6. **Backup-Pläne**: Nutzen Sie alternative Protokollierungsmethoden für den Fall, dass Webhooks fehlschlagen

## Fertig! 

Mit diesen Schritten ist Ihre benutzerdefinierte Webhook-Instanz vollständig für die Integration mit SecureAI konfiguriert 😎.