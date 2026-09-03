---
title: "Kurzübersicht zu den Abrechnungsmodi"
---
# Kurzübersicht zu den Abrechnungsmodi

Eine kurze Vergleichsanleitung zur Auswahl zwischen den Abrechnungsmodi „Benutzerabschlüsse“ und „Nutzung nach Modell“.

## Schneller Vergleich

| Funktion | Benutzervervollständigungen | Nutzung nach Modell |
|---------|------------------|----------------|
| **Standardmodus** | ✅ Ja | ❌ Nein |
| **Kostenstruktur** | Fest (Lizenzkontingent) | Variable (pro Token) |
| **Benutzerberechtigung** | Nicht erforderlich | Muss aktiviert sein |
| **Kostenverfolgung** | Abschluss zählt | Tokenanzahl + Kosten |
| **Am besten für** | Planbare Kosten | Hoher Verbrauch |
| **Fallback-Unterstützung** | ✅ Ja | ❌ Nein |

## Wann die einzelnen Modi verwendet werden sollten

### Benutzervervollständigungsmodus

**Wählen Sie dies, wenn:**
- ✅ Sie wollen vorhersehbare, feste Kosten
- ✅ Sie liegen innerhalb der bestehenden Lizenzgrenzen
- ✅ Du baust interne Tools
- ✅ Sie möchten bestehende Kontingentzuteilungen nutzen
- ✅ Sie benötigen ein einfaches Kostenmanagement

**Beispielhafte Anwendungsfälle:**
- Interne Chatbots
- Entwicklung und Tests
- Anwendungen mit geringem Volumen
- Projekte mit festem Budget

### Nutzung nach Modellmodus

**Wählen Sie dies, wenn:**
- ✅ Sie benötigen eine detaillierte Kostenverfolgung
- ✅ Du verwendest häufig teure Modelle
- ✅ Sie möchten nur für die tatsächliche Nutzung bezahlen
- ✅ Sie benötigen eine detaillierte Nutzungsanalyse
- ✅ Sie haben einen hohen Volumenbedarf

**Beispielhafte Anwendungsfälle:**
- Produktionsanwendungen
- KI-Dienste mit hohem Volumen
- Kostensensible Projekte
- Multi-Modell-Anwendungen

## API-Nutzung

Bei Verwendung der externen API mit Abrechnungsmodi:

```bash
curl -X POST "https://{customer.name}.hiperai.ai/api/external/chat/completions" \
  -H "Authorization: Bearer sk-your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5-nano",
    "prompt": "Hello, world!",
    "user_id": "optional-user-id-for-billing"
  }'
```

## Tarifbegrenzungen

### Standardratenbegrenzungen
- **Anfragen pro Minute**: 60 (konfigurierbar)
- **Anfragen pro Stunde**: 1.000 (konfigurierbar)
- **Tageslimits**: 100 Anfragen (konfigurierbar)
- **Monatliche Limits**: 10.000 Anfragen (konfigurierbar)

### Spezifische Beschränkungen für den Abrechnungsmodus
- **Benutzerabschlüsse**: Basierend auf dem Lizenzkontingent
- **Nutzung nach Modell**: Zusätzliche Dollar-basierte Limits

## SMLTP-Richtlinienintegration

Beide Abrechnungsmodi unterstützen die Durchsetzung von SMLTP-Richtlinien:

| Politik | Beschreibung | Anwendungsfall |
|--------|-------------|----------|
| `public` | Für nicht sensible Daten | Öffentlich zugängliche Anwendungen |
| `internal` | Für Unternehmensdaten | Interne Tools und Prozesse |
| `confidential` | Für sensible Informationen | Anwendungen mit eingeschränktem Zugriff |

### SMLTP-Konfigurationsbeispiel

```json
{
  "billingMode": "usage-by-model",
  "allowedSMLTPPolicies": ["public", "internal"],
  "enforceSMLTPPolicies": true,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"]
}
```

## Konfigurationsbeispiele

### Konfiguration der Benutzervervollständigungen

```json
{
  "billingMode": "user-completions",
  "dailyLimit": 100,
  "monthlyLimit": 1000,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"],
  "allowedSMLTPPolicies": ["public", "internal"],
  "rateLimit": {
    "requestsPerMinute": 60,
    "requestsPerHour": 1000
  }
}
```

### Nutzung nach Modellkonfiguration

```json
{
  "billingMode": "usage-by-model",
  "dailyLimit": 500,
  "monthlyLimit": 5000,
  "allowedModels": ["openai/gpt-5-nano", "anthropic/claude-sonnet-4.6"],
  "allowedSMLTPPolicies": ["public", "internal", "confidential"],
  "rateLimit": {
    "requestsPerMinute": 120,
    "requestsPerHour": 2000
  },
  "usageByModel": {
    "enabled": true,
    "dollarLimit": 100.00
  }
}
```

## Fehlerszenarien

### Fehler bei Benutzerabschlüssen

| Fehler | Ursache | Lösung |
|-------|-------|----------|
| `Completion limit exceeded` | Monatskontingent erreicht | Nutzung nach Modell aktivieren oder Kontingent erhöhen |
| `Daily limit exceeded` | Tageslimit erreicht | Auf Zurücksetzen oder Erhöhen des Limits warten |
| `User not found` | Ungültige Benutzer-ID | Überprüfen Sie, ob der Benutzer existiert |

### Verwendung durch Modellfehler

| Fehler | Ursache | Lösung |
|-------|-------|----------|
| `Usage by Model required` | Der Benutzer hat es nicht aktiviert | Aktivieren Sie die Verwendung nach Modell für Benutzer |
| `Usage by Model budget exceeded` | Monatsbudget erreicht | Dollar-Limit erhöhen |
| `Invalid billing mode` | Ungültiger Modus angegeben | Verwenden Sie `"usage-by-model"` oder `"user-completions"` |

## Migrationsleitfaden

### Von Benutzervervollständigungen bis zur Nutzung nach Modell

1. **Nutzung nach Modell für den Benutzer aktivieren**
   ```bash
   # Admin panel: Users > Edit User > Enable Usage by Model
   ```

2. **API-Schlüsselkonfiguration aktualisieren**
   ```json
   {
     "billingMode": "usage-by-model",
     "usageByModel": {
       "enabled": true,
       "dollarLimit": 100.00
     }
   }
   ```

3. **Nutzung und Kosten überwachen**
   - Verfolgen Sie die Token-Nutzung
   - Überwachen Sie die monatlichen Ausgaben
   - Passen Sie die Grenzwerte nach Bedarf an

### Von der Nutzung durch Modell zu Benutzervervollständigungen

1. **Überprüfen Sie, ob der Benutzer über ein ausreichendes Kontingent verfügt**
   - Überprüfen Sie die Lizenzstufe
   - Überprüfen Sie die monatlichen Limits

2. **API-Schlüsselkonfiguration aktualisieren**
   ```json
   {
     "billingMode": "user-completions",
     "dailyLimit": 100,
     "monthlyLimit": 1000
   }
   ```

3. **Abschlussnutzung überwachen**
   - Verfolgen Sie die Anzahl der abgeschlossenen Arbeiten
   – Stellen Sie sicher, dass das Fallback-Verhalten funktioniert

## Kostenschätzung

### Kosten für Benutzerabschlüsse

- **Fixkosten**: Basierend auf der Lizenzstufe
- **Keine zusätzlichen Kosten**: Über die bestehende Lizenz hinaus
- **Vorhersehbar**: Identisch mit der Nutzung der Webschnittstelle

### Nutzung nach Modellkosten

- **Variable Kosten**: Basierend auf der Token-Nutzung
- **Modellspezifische Preise**: Unterschiedliche Tarife pro Modell
- **Beispielkosten**:
  - GPT-5.1: Es gelten die Anbieterpreise
  - Claude Sonnet 4.6: Es gelten die Anbieterpreise
  - GPT-5 Nano: Es gelten die Anbieterpreise

## Überwachungstipps

### Überwachung der Benutzerabschlüsse

- Verfolgen Sie die Anzahl der abgeschlossenen Arbeiten täglich
- Überwachen Sie den Kontingentverbrauch
- Legen Sie Warnungen fest, wenn sich Grenzen nähern
- Überprüfen Sie monatlich die Nutzungsmuster

### Nutzung durch Modellüberwachung

- Verfolgen Sie die Token-Nutzung und -Kosten
- Überwachen Sie die monatlichen Ausgaben
- Legen Sie Dollar-Limit-Benachrichtigungen fest
- Überprüfen Sie die Kostenaufschlüsselung nach Modell

## Sicherheitsüberlegungen

### Beide Modi

- Verwenden Sie IP-Einschränkungen für sensible Apps
- API-Schlüssel regelmäßig rotieren
- Achten Sie auf ungewöhnliche Aktivitäten
- Implementieren Sie eine ordnungsgemäße Fehlerbehandlung

### Verwendung je nach Modell

- Legen Sie angemessene Dollar-Limits fest
- Überwachen Sie Kostenspitzen
- Überprüfen Sie die Modellnutzungsmuster
- Verfolgen Sie die Nutzung teurer Modelle

## Support-Ressourcen

### Dokumentation
- [Übersicht über die Abrechnungsmodi](../billing-modes.md)
- [Limits & Quoten](/de/en/api/limits-and-quotas) - Plattformlimits verstehen

### Admin-Panel
- **API-Bereich**: API-Schlüssel erstellen und verwalten
- **Benutzerbereich**: Nutzung nach Modell aktivieren

### Häufige Probleme
1. **Nutzung nach Modell funktioniert nicht**: Überprüfen Sie die Benutzerberechtigungen
2. **Kontingent überschritten**: Aktivieren Sie die Nutzung nach Modell oder erhöhen Sie die Grenzwerte
3. **Kostenspitzen**: Überprüfen Sie die Modellnutzung und legen Sie Grenzen fest
4. **Authentifizierungsfehler**: API-Schlüssel und Berechtigungen überprüfen