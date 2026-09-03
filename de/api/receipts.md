---
title: "Compliance-Belege"
sidebar_label: "Quittungen"
description: "Rufen Sie zum Abschluss die signierte SMLTP-Konformitätsquittung ab"
openapi: "GET /receipts/{bundleId}"
---
# Compliance-Belege

Wenn ein Abschluss über das **SMLTP-Gateway** weitergeleitet wird, erstellt SecureAI eine signierte Konformitätsbestätigung** – einen kryptografischen Nachweis der Richtlinie, die den Anruf geregelt hat. Dieser Endpunkt ruft diese Quittung anhand seiner Bundle-ID ab.

Belege sind nur für Gateway-geroutete Bereitstellungen vorhanden. Bei Direktanbieterbereitstellungen gibt es kein Gateway zum Signieren von Belegen, und dieser Endpunkt gibt `404` zurück.

## Endpunkt

```
GET /receipts/:bundleId
```

## Woher die Bundle-ID kommt

Abschlussantworten legen die Bundle-ID offen, wenn eine SMLTP-Berechtigung für den Aufruf erstellt wird:

- Klassischer Endpunkt: `metadata.smltp.bundle_id` (und ein vorgefertigtes `metadata.smltp.receipt_url`).
- OpenAI-kompatibler Endpunkt: `secureai.smltp_bundle_id`.

Die Bundle-ID (eine Berechtigungs-ID wie `jti-…`) wird auch bei nativen/direkten Anbieterbereitstellungen zurückgegeben. Die **signierte Quittung** mit dieser ID existiert jedoch nur, wenn der Datenverkehr über das SMLTP-Gateway geleitet wird – bei direkten Bereitstellungen gibt dieser Endpunkt `404` zurück (siehe unten).

## Authentifizierung

```bash
Authorization: Bearer sk-your-api-key-here
```

## Beispiel für Anfrage

```bash
curl -X GET "https://{customer.name}.hiperai.ai/api/external/receipts/bnd_9f2c...e71" \
  -H "Authorization: Bearer sk-your-api-key-here"
```

## Antwort

### 200 OK

```json
{
  "success": true,
  "receipt": {
    "bundle_id": "bnd_9f2c...e71",
    "...": "signed SMLTP receipt payload (policy, entitlement, verdict, signatures)"
  }
}
```

Das `receipt`-Objekt ist die vom Gateway ausgegebene signierte Nutzlast. Wie Belege in das Transparenz- und Prüfmodell passen, erfahren Sie unter [SMLTP-Sicherheit](/de/en/security/smltp).

### 404 Nicht gefunden

```json
{
  "success": false,
  "error": "Receipt not found",
  "message": "No receipt for this bundle id. Receipts are only available when requests are routed through the SMLTP gateway, and are retained in its in-memory store for a limited time. The authoritative record is the hash-chained audit log."
}
```

### 400 Ungültige Anfrage

Wird zurückgegeben, wenn die Bundle-ID fehlt oder länger als 128 Zeichen ist.

## Notizen

- Belege werden für eine begrenzte Zeit im In-Memory-Speicher des Gateways gespeichert. Für einen langfristigen Nachweis verlassen Sie sich auf das **Hash-verkettete Prüfprotokoll** – den maßgeblichen, unveränderlichen Datensatz. Siehe [Immutable Logs](/de/en/security/immutable-logs).
– Nicht jede Bereitstellung erfolgt über das Gateway. Behandeln Sie einen `404` als „Kein Gateway-Empfang für diesen Anruf“ und nicht als Fehler in Ihrer Integration.

## Verwandte

- [SMLTP-Sicherheit](/de/en/security/smltp)
- [Unveränderliche Protokolle](/de/en/security/immutable-logs)
- [Chat-Abschluss](/de/en/api/chat/completions)