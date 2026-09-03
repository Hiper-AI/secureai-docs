---
title: "API-Schlüssel für den Abrechnungsmodus"
---
# API-Schlüssel für den Abrechnungsmodus

SecureAI unterstützt zwei unterschiedliche Abrechnungsmodi für API-Schlüssel, sodass Administratoren steuern können, wie die Nutzung für verschiedene API-Integrationen verfolgt und abgerechnet wird.

## Übersicht

API-Schlüssel können mit einem von zwei Abrechnungsmodi konfiguriert werden:

- **Benutzerabschlüsse**: Wird vom Lizenzabschluss-Bucket des Benutzers abgezogen
- **Nutzung nach Modell**: Die Belastung der Kreditkarte des Benutzers basiert auf der tatsächlichen Modellnutzung

## Abrechnungsmodi

### Benutzervervollständigungsmodus

**Standardmodus** – API-Schlüssel verwenden standardmäßig diesen Modus.

#### Wie es funktioniert
- Abschlüsse werden vom monatlichen Lizenzkontingent des Benutzers abgezogen
- Verwendet die gleichen Abschlussgrenzen wie die Weboberfläche
- Keine zusätzlichen Kosten über die bestehende Lizenz des Benutzers hinaus
– Fällt auf „Nutzung nach Modell“ zurück, wenn kein Kontingent verfügbar ist und der Benutzer die Nutzung nach Modell aktiviert hat

#### Anwendungsfälle
- Interne Anwendungen, bei denen Sie vorhandene Lizenzzuteilungen nutzen möchten
- Entwicklungs- und Testumgebungen
- Anwendungen, bei denen Sie vorhersehbare, feste Kosten wünschen
- Wenn Sie innerhalb der bestehenden Lizenzgrenzen bleiben möchten

#### Konfiguration
```json
{
  "billingMode": "user-completions",
  "dailyLimit": 100,
  "monthlyLimit": 1000
}
```

### Nutzung nach Modellmodus

**Erweiterter Modus** – Erfordert explizite Konfiguration und Benutzerberechtigung.

#### Wie es funktioniert
- Gebühren basierend auf der tatsächlichen Token-Nutzung und den Modellkosten
- Verfolgt Eingabetoken, Ausgabetoken und Gesamttoken
- Berechnet die Kosten basierend auf modellspezifischen Preisen
– Erfordert, dass der Benutzer die Nutzung nach Modell in seinem Konto aktiviert hat
- Verfügt über konfigurierbare monatliche Dollarlimits

#### Anwendungsfälle
- Anwendungen mit hohem Volumen, bei denen eine genaue Kostenverfolgung erforderlich ist
- Anwendungen mit teureren Modellen (GPT-5.x, Claude Opus/Sonnet usw.)
- Wenn Sie detaillierte Nutzungsanalysen benötigen
- Anwendungen, bei denen Sie nur für das bezahlen möchten, was Sie nutzen

#### Konfiguration
```json
{
  "billingMode": "usage-by-model",
  "usageByModel": {
    "enabled": true,
    "dollarLimit": 100
  }
}
```

## API-Schlüsselerstellung

### Erstellen von API-Schlüsseln mit Abrechnungsmodi

Erstellen und konfigurieren Sie API-Schlüssel über das SecureAI-Admin-Panel.

1. Gehen Sie zu `Admin -> API Keys`.
2. Erstellen oder bearbeiten Sie einen API-Schlüssel.
3. Setzen Sie `billingMode` auf `user-completions` oder `usage-by-model`.
4. Konfigurieren Sie Grenzwerte, zulässige Modelle, zulässige Indizes und zulässige SMLTP-Richtlinien.

### Validierung des Abrechnungsmodus

Das System validiert die Anforderungen an den Abrechnungsmodus:

- **Nutzung nach Modellmodus**: Erfordert, dass der Benutzer die Nutzung nach Modell aktiviert hat
- **Benutzervervollständigungsmodus**: Funktioniert mit jedem Benutzer, kann jedoch auf die Nutzung nach Modell zurückgreifen, wenn kein Kontingent verfügbar ist

## Nutzungsverfolgung

### Nachverfolgung von Benutzerabschlüssen

Im Modus „Benutzervervollständigungen“ verfolgt das System Folgendes:
- Tägliche und monatliche Abschlusszählungen
- Modellspezifische Nutzungsstatistiken
- Kontingentverbrauch und Limits

### Nutzung durch Model Tracking

Im Modus „Nutzung nach Modell“ verfolgt das System Folgendes:
- Eingabe-Tokens, Ausgabe-Tokens und Gesamt-Tokens
- Modellspezifische Kosten und Punkte
- Monatliche Dollarausgaben
- Detaillierte Nutzungsanalyse

## Beispiele für API-Antworten

### Antwort im Modus „Benutzervervollständigungen“.

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2
  }
}
```

### Verwendung nach Modellmodus-Antwort

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18,
    "input_tokens": 10,
    "output_tokens": 8
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2
  }
}
```

## Fehlerbehandlung

### Nutzung nach Modell nicht aktiviert

```json
{
  "success": false,
  "error": "Usage by Model required",
  "message": "This API key is configured for Usage by Model billing, but the user does not have Usage by Model enabled. Please contact an administrator to enable Usage by Model for this user.",
  "request_id": "req-abc123"
}
```

### Kontingent überschritten (Benutzerabschlüsse)

```json
{
  "success": false,
  "error": "Completion limit exceeded",
  "message": "You have reached your monthly Standard completion limit of 1000. To continue using AI models, please contact an administrator to activate Usage by Model in Admin Panel > APIs > Edit.",
  "request_id": "req-abc123"
}
```

### Budget überschritten (Nutzung nach Modell)

```json
{
  "success": false,
  "error": "Usage by Model budget exceeded",
  "message": "You have reached your Usage by Model budget limit of $100.00.",
  "request_id": "req-abc123"
}
```

## Best Practices

### Den richtigen Abrechnungsmodus wählen

1. **Verwenden Sie Benutzervervollständigungen, wenn:**
   - Sie wollen vorhersehbare Kosten
   - Sie befinden sich innerhalb der bestehenden Lizenzgrenzen
   - Sie erstellen interne Tools
   - Sie möchten bestehende Kontingentzuteilungen nutzen

2. **Nutzung nach Modell verwenden, wenn:**
   - Sie benötigen eine detaillierte Kostenverfolgung
   - Sie verwenden häufig teure Modelle
   - Sie möchten nur für die tatsächliche Nutzung bezahlen
   - Sie benötigen eine detaillierte Nutzungsanalyse

### Konfigurationsempfehlungen

1. **Geeignete Grenzwerte festlegen:**
   - Tageslimits zur Tarifkontrolle
   - Monatliche Limits zur Kostenkontrolle
   - Dollarlimits für den Modus „Nutzung nach Modell“.

2. **Nutzung überwachen:**
   - Verfolgen Sie regelmäßig die Nutzung von API-Schlüsseln
   - Richten Sie Warnungen für die Annäherung an Grenzwerte ein
   - Überprüfen Sie monatlich die Nutzungsmuster

3. **Sicherheitsaspekte:**
   - Verwenden Sie IP-Einschränkungen für sensible Anwendungen
   - API-Schlüssel regelmäßig rotieren
   - Achten Sie auf ungewöhnliche Nutzungsmuster

## Fallback-Mechanismus

### Benutzervervollständigungen zur Verwendung nach Modell-Fallback

Wenn bei einem Benutzervervollständigungs-API-Schlüssel eine Kontingenterschöpfung auftritt, greift das System automatisch auf die Verwendung nach Modell zurück, wenn:

1. **Der Benutzer hat in seinen Kontoeinstellungen die Option „Nutzung nach Modell“ aktiviert**
2. **Der Benutzer verfügt über ein verfügbares Budget** in seiner Zuteilung „Nutzung nach Modell“.
3. **API-Schlüssel ermöglicht Fallback** (Standardverhalten)

#### Fallback-Prozess

```json
{
  "success": true,
  "id": "req_123456789",
  "object": "chat.completion",
  "created": 1640995200,
  "model": "openai/gpt-5-nano",
  "choices": [...],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  },
  "metadata": {
    "conversation_id": "conv_123",
    "index_used": "my-index",
    "smltp_policy_used": "public",
    "rag_enabled": true,
    "documents_retrieved": 2,
    "billing_fallback": {
      "original_mode": "user-completions",
      "fallback_mode": "usage-by-model",
      "reason": "quota_exhausted"
    }
  }
}
```

### Validierungslogik

#### Nutzung nach Modellanforderungen

Das System validiert Folgendes, bevor es die Abrechnung „Nutzung nach Modell“ zulässt:

1. **Benutzerkontoeinstellungen**: Für den Benutzer muss „Nutzung nach Modell“ aktiviert sein
2. **Monatsbudget**: Der Benutzer muss in seiner Zuweisung über ein verfügbares Budget verfügen
3. **API-Schlüsselkonfiguration**: Der API-Schlüssel muss für die Verwendung nach Modell konfiguriert sein oder einen Fallback zulassen
4. **Modellzugriff**: Der Benutzer muss Zugriff auf das angeforderte Modell haben

#### Gemischte Abrechnungsszenarien

Wenn mehrere API-Schlüssel mit unterschiedlichen Abrechnungsmodi verwendet werden:

- **Benutzervervollständigungsschlüssel** verbrauchen das monatliche Kontingent des Benutzers
- **Nutzung nach Modellschlüsseln** wird von der Budgetzuweisung des Benutzers abgezogen
- **Fallback-Szenarien** priorisieren zuerst Benutzerabschlüsse und dann die Nutzung nach Modell
- **Kontingenterschöpfung** löst automatischen Fallback aus, sofern verfügbar

## Migration zwischen Modi

### Von Benutzervervollständigungen bis zur Nutzung nach Modell

1. **Nutzung nach Modell aktivieren**: Stellen Sie sicher, dass der Benutzer die Nutzung nach Modell in seinem Konto aktiviert hat
2. **API-Schlüssel aktualisieren**: Ändern Sie den Abrechnungsmodus in der API-Schlüsselkonfiguration
3. **Budgetlimits festlegen**: Konfigurieren Sie entsprechende monatliche Dollarlimits
4. **Nutzung überwachen**: Verfolgen Sie sowohl die Abschlussnutzung als auch den Budgetverbrauch
5. **Fallback testen**: Überprüfen Sie, ob das Fallback-Verhalten ordnungsgemäß funktioniert

### Von der Nutzung durch Modell zu Benutzervervollständigungen

1. **Kontingent überprüfen**: Stellen Sie sicher, dass der Benutzer über ein ausreichendes monatliches Abschlusskontingent verfügt
2. **API-Schlüssel aktualisieren**: Ändern Sie den Abrechnungsmodus in der API-Schlüsselkonfiguration
3. **Nutzung überwachen**: Verfolgen Sie den Fertigstellungsverbrauch anhand der monatlichen Grenzwerte
4. **Fallback konfigurieren**: Richten Sie den Fallback auf „Nutzung nach Modell“ ein, wenn das Kontingent erschöpft ist
5. **Grenzwerte testen**: Überprüfen Sie, ob die Kontingentgrenzen ordnungsgemäß durchgesetzt werden

### Best Practices für die Migration

- **Schrittweise Migration**: Testen Sie zuerst mit API-Schlüsseln mit geringem Volumen
- **Überwachen Sie beide Metriken**: Verfolgen Sie sowohl die Fertigstellungsnutzung als auch den Budgetverbrauch
- **Geeignete Grenzwerte festlegen**: Konfigurieren Sie realistische Grenzwerte für beide Modi
- **Dokumentänderungen**: Verfolgen Sie Änderungen des Abrechnungsmodus zu Prüfzwecken
- **Benutzerkommunikation**: Informieren Sie Benutzer über Änderungen des Abrechnungsmodus und deren Auswirkungen

## Überwachung und Analyse

### Nutzungsanalyse

Das System bietet detaillierte Analysen für beide Abrechnungsmodi:

- **Benutzerabschlüsse**: Anzahl der Abschlüsse, Kontingentnutzung, Modellverteilung
- **Nutzung nach Modell**: Token-Anzahl, Kosten, modellspezifische Analysen

### Admin-Panel-Integration

Das Admin-Panel bietet:
- Nutzungsüberwachung in Echtzeit
- Konfiguration des Abrechnungsmodus
- Nutzungsanalysen und Berichte
- Kostenverfolgung und Benachrichtigungen

## Fehlerbehebung

### Häufige Probleme

1. **Nutzung nach Modell funktioniert nicht:**
   – Stellen Sie sicher, dass der Benutzer die Nutzung nach Modell aktiviert hat
   - Überprüfen Sie die monatlichen Dollarlimits
   - Sorgen Sie für einen ordnungsgemäßen Zugang zum Modell

2. **Kontingentprobleme bei Benutzervervollständigungen:**
   - Überprüfen Sie die Lizenzstufe des Benutzers
   - Überprüfen Sie die monatlichen Abschlussgrenzen
   – Erwägen Sie die Aktivierung der Nutzung nach Modell als Fallback

3. **Fehler bei der API-Schlüsselauthentifizierung:**
   – Überprüfen Sie, ob der API-Schlüssel aktiv ist
   - Überprüfen Sie die IP-Einschränkungen
   - Stellen Sie sicher, dass die entsprechenden Berechtigungen vorliegen

### Unterstützung

Bei Problemen mit den Abrechnungsmodi:
1. Überprüfen Sie das Admin-Panel auf Nutzungsstatistiken
2. Überprüfen Sie die API-Schlüsselkonfiguration
3. Wenden Sie sich bezüglich Änderungen des Abrechnungsmodus an den Systemadministrator
4. Überwachen Sie die Protokolle auf detaillierte Fehlerinformationen