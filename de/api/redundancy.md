---
title: "Redundanz und Failover"
sidebar_label: "Redundanz und Failover"
description: "Vom Aufrufer definierte Modell-Failover-Ketten für die SecureAI Completions API"
---
# Redundanz und Failover

Die Completions-API kann automatisch von einem Modell auf ein anderes **Failover** durchführen, wenn ein Anbieteraufruf fehlschlägt. Sie definieren eine geordnete Kette – ein Primärmodell plus bis zu zwei Fallbacks – und SecureAI probiert sie nacheinander aus, bis eines erfolgreich ist. Dies gibt Ihnen Widerstandsfähigkeit gegen Anbieterausfälle, Ratenbegrenzungen und Zeitüberschreitungen, ohne dass Ihr eigener Code eine Wiederholungslogik erfordert.

Redundanz ist sowohl auf dem [klassischen `/chat/completions`](/de/api/chat/completions) Endpunkt als auch auf dem [OpenAI-kompatiblen `/v1/chat/completions`](/de/api/chat/openai-kompatiblen) Endpunkt verfügbar.

## Wie eine Kette definiert ist

Es gibt drei Möglichkeiten, eine Kette anzufordern (in der Reihenfolge der Reihenfolge):

| # | Sie senden | Resultierende Kette |
|---|----------|---|
| 1 | `models: ["a", "b", "c"]` | Genau diese Kette (überschreibt `model`). |
| 2 | `model: "a"` + `fallback_models: ["b", "c"]` | `a → b → c`. |
| 3 | `model: "a"` allein | Verwendet den vom Administrator konfigurierten `failoverDefaults` des API-Schlüssels, wenn `a` darin vorkommt (die Kette beginnt an der Position von `a`); Ansonsten ein einziger Versuch. |

Eine Kette kann **höchstens 3 verschiedene Modelle** enthalten. Doppelte Einträge werden ausgeblendet. Jeder Ketteneintrag kann eine einfache Modellzeichenfolge oder ein Objekt mit Zeitüberschreitungen pro Versuch sein:

```json
{ "model": "openai/gpt-5-nano", "timeout_ms": 30000, "first_token_timeout_ms": 5000 }
```

Sie können `models` und `fallback_models` nicht in derselben Anfrage kombinieren.

## Kettenweite Optionen (`redundancy`)

```json
{
  "redundancy": {
    "timeout_ms": 30000,
    "first_token_timeout_ms": 5000,
    "on": ["connection_error", "server_error", "rate_limit", "timeout"]
  }
}
```

| Feld | Reichweite | Beschreibung |
|-------|-------|-------------|
| `timeout_ms` | 1000–300000 | Gesamtzeitüberschreitung pro Versuch. |
| `first_token_timeout_ms` | 500–60000 | Für Streaming: Wie lange muss auf das erste Inhaltstoken gewartet werden, bevor ein Failover erfolgt? |
| `on` | Teilmenge der Auslöser unten | Welche Fehlerklassen lösen ein Failover aus? Standardmäßig sind alle vier eingestellt. |

Zeitüberschreitungen pro Versuch (festgelegt in einem `models[]`-Eintrag) überschreiben die kettenweiten Werte für diesen Versuch.

## Failover-Trigger

Ein fehlgeschlagener Versuch wird einem dieser Gründe zugeordnet; Ein Failover findet nur statt, wenn der Grund in Ihrer `on`-Liste enthalten ist **und** noch ein anderes Modell in der Kette vorhanden ist:

| Grund | Ursache |
|--------|-------|
| `connection_error` | Verbindung abgelehnt/zurückgesetzt, DNS/Abruffehler. |
| `server_error` | Der Anbieter hat HTTP 5xx zurückgegeben. |
| `rate_limit` | Der Anbieter hat HTTP 429 zurückgegeben. |
| `timeout` | Der Versuch hat `timeout_ms` (oder `first_token_timeout_ms` während des Streamings überschritten). |

Fehler, die **nicht** wiederholbar sind, lösen nie einen Failover aus – zum Beispiel eine absichtliche Gateway-Ratenbegrenzung/Token-Budget-Blockierung, ein offener Leistungsschalter oder eine Ablehnung einer Richtlinie/Validierung. Ein Fallback würde genauso scheitern oder die Blockierung ist gewollt.

## Streaming-Verhalten

Bei Streaming-Anfragen ist **Failover nur möglich, bevor das erste Inhaltstoken eintrifft.** SecureAI ruft den Upstream-Stream bis zum ersten Token ab (begrenzt durch `first_token_timeout_ms`); Wenn dies fehlschlägt, erfolgt ein Failover auf das nächste Modell. Sobald das erste Token an Ihren Client gesendet wurde, ist das Bereitstellungsmodell gesperrt – eine spätere Unterbrechung während des Streams wird als `error`-Frame und nicht als Failover angezeigt.

## Was du zurückbekommst

Wenn eine Kette mit mehreren Modellen ausgeführt wird, enthält die Antwort einen **Failover-Bericht**:

– Klassischer Endpunkt: `metadata.failover`
– OpenAI-kompatibler Endpunkt: `secureai.failover`

```json
"failover": {
  "occurred": true,
  "attempts": [
    { "model": "openai/gpt-5-nano", "status": "failed", "reason": "timeout", "latency_ms": 30011 },
    { "model": "anthropic/claude-sonnet-4", "status": "served", "latency_ms": 734 }
  ]
}
```

`metadata.served_model` / `secureai.served_model` sagt Ihnen, welches Modell tatsächlich geantwortet hat, und `requested_model` ist das erste Modell in der Kette. Bei einer Einzelmodell-Anfrage (Legacy-Anfrage) wird kein Failover-Bericht erstellt.

## Wenn die ganze Kette versagt

Wenn jeder Versuch fehlschlägt, gibt die Anfrage einen Fehler zurück, der alle Versuche auflistet:

- **429**, wenn *jeder* Fehler eine Ratenbegrenzung darstellte.
- **502** sonst.

```json
{
  "success": false,
  "error": "All model attempts failed",
  "message": "All 3 model attempt(s) failed (last: google/gemini-2.5-flash — server_error)",
  "attempts": [ /* per-model status + reason + latency */ ]
}
```

Auf dem OpenAI-kompatiblen Endpunkt gibt dieselbe Bedingung den OpenAI-Fehlerumschlag mit `code: "all_models_failed"` zurück.

## Admin-Standardeinstellungen (`failoverDefaults`)

Ein Administrator kann eine Standardkette an einen API-Schlüssel anhängen, sodass Aufrufer ein Failover erhalten, ohne bei jeder Anfrage eine Kette zu senden. Die unter **Admin → API-Schlüssel** konfigurierte Nutzlast wird validiert und geklemmt:

- `models`: bis zu 3 verschiedene Modellnamen.
- `timeout_ms`: 1000–300000.
- `first_token_timeout_ms`: 500–60000.
– `on`: jede Teilmenge der vier Trigger.

Wenn ein Anrufer nur `model: "a"` sendet und `a` in `failoverDefaults.models` vorhanden ist, beginnt die Kette an der Position von `a` und wird durch die verbleibenden Standardwerte fortgesetzt.

## Sicherheit & Abrechnung pro Versuch

Jeder Versuch ist ein vollständiger, unabhängiger Aufruf über den SMLTP-Wrapper – Richtliniendurchsetzung, Egress-/Residency-Governance und das Signed Entitlement Token Mint werden alle pro Versuch erneut ausgeführt, gebunden an das Modell dieses Versuchs und die genauen Anforderungsbytes. Die Abrechnung spiegelt das Modell wider, das die Antwort tatsächlich bereitgestellt hat. Jedes Failover gibt außerdem ein `api:model_failover`-Sicherheitsereignis (das an alle abonnierten [Webhooks](/de/api/webhooks/overview) übermittelt wird) und einen Audit-Log-Eintrag aus.

## Verwandte

- [Chat-Abschluss](/de/api/chat/completions)
- [OpenAI-kompatibler Endpunkt](/de/api/chat/openai-kompatibel)
- [Policy Check](/de/api/policy-check) – Vorschau des Zugriffs der gesamten Kette, ohne Punkte auszugeben.
- [Webhooks](/de/api/webhooks/overview) – abonnieren Sie `api:model_failover`.