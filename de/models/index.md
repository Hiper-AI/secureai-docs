---
sidebar_position: 1
title: "Modelle"
---
# Modelle

Verfügbare Modelle in SecureAI.

SecureAI bietet Zugriff auf die neuesten KI-Modelle aller großen Anbieter und bietet Ihnen die besten Tools für Ihre spezifischen Anforderungen.

Um Echtzeitmodellverfügbarkeit für Ihren API-Schlüssel zu erhalten, verwenden Sie den externen Endpunkt `GET /api/external/models`.

## Modellvergleich

| Eimer | Aktuelle Modelle |
|--------|----------------|
| Standard | openai/gpt-oss-120b, openai/gpt-5-nano, google/gemini-3.1-flash-lite-preview, google/gemini-3-flash-preview, deepseek/deepseek-r1-distill-llama-70b, deepseek/deepseek-r1, deepseek/deepseek-v3.2, meta-llama/llama-3.3-70b-instruct, meta-llama/llama-4-maverick, meta-llama/llama-4-scout, mistralai/mistral-7b-instruct, mistralai/mistral-nemo, mistralai/ministral-14b-2512, mistralai/mistral-large-2512, x-ai/grok-3-mini, qwen/qwen3-235b-a22b-2507, qwen/qwen3-coder, qwen/qwen3-coder-next, qwen/qwen3.5-397b-a17b |
| Prämie | anthropic/claude-3.7-sonnet, anthropic/claude-sonnet-4.6, anthropic/claude-opus-4.6, openai/o4-mini-high, openai/o4-mini, openai/gpt-5.2, openai/gpt-5.3-codex, openai/gpt-5.1, google/gemini-3.1-pro-preview, x-ai/grok-4 |

## Bucket-Typen

### Standardeimer
- **Verwendung**: Alltagsaufgaben und allgemeine Gespräche
- **Kosten**: Kostengünstiger bei regelmäßiger Anwendung
- **Geschwindigkeit**: Optimiert für schnellere Antworten
- **Am besten für**: Schnelle Fragen, einfache Aufgaben und Routinearbeiten

### Premium-Eimer
- **Verwendung**: Komplexes Denken und fortgeschrittene Analysen
- **Kosten**: Höhere Kosten für erweiterte Funktionen
- **Geschwindigkeit**: Kann länger dauern, liefert aber bessere Ergebnisse
- **Am besten geeignet**: Komplexe Problemlösung, detaillierte Analyse und spezielle Aufgaben

## Leitfaden zur Modellauswahl

### Für komplexe Überlegungen
- **anthropic/claude-opus-4.6** – Am besten für tiefgreifende analytische Aufgaben geeignet
- **openai/gpt-5.2** - Starke Argumentation und Synthese
- **google/gemini-3.1-pro-preview** – Erweiterte Argumentationsfunktionen

### Für eine schnelle Entwicklung
- **openai/gpt-5-nano** – Schnelle Antworten für unkomplizierte Aufgaben
- **google/gemini-3-flash-preview** – Gutes Verhältnis zwischen Geschwindigkeit und Kosten
- **x-ai/grok-3-mini** – Schnelle Iteration und Prototyping

### Für die Codegenerierung
- **openai/gpt-5.3-codex** – Spezialisierte Codierungsworkflows
- **qwen/qwen3-coder-next** – Starke Codegenerierung und -bearbeitung
- **deepseek/deepseek-r1** – Argumentationsintensive Codeanalyse

### Für großen Kontext
- **openai/gpt-5.1** – Analyseaufgaben mit großem Kontext
- **anthropic/claude-sonnet-4.6** - Starke Kontextverarbeitung in Langform
- **google/gemini-3.1-pro-preview** – Umfassende Dokumentenanalyse

## Modellfähigkeiten

### Kontextfenster
- **Standardkontext**: Die meisten Modelle unterstützen 16.000 bis 200.000 Token
- **Erweiterter Kontext**: Einige Modelle unterstützen unbegrenzten Kontext
- **Optimierte Verarbeitung**: Modelle werden für Ihre spezifischen Anwendungsfälle optimiert

### Leistungsmerkmale
- **🧠 Standard-KI**: Textgenerierung, Argumentation, Kodierung
- **📊 Analyse**: Datenanalyse und Interpretation
- **💻 Code**: Spezialisierte Codegenerierung und -überprüfung
- **🎯 Spezialisiert**: Aufgabenspezifische Optimierungen

## Automatische Auswahl

SecureAI umfasst eine **Auto-Select**-Funktion, die automatisch das beste Modell für Ihre spezifische Aufgabe auswählt und optimiert für:
- **Aufgabenkomplexität**: Passt die Modellfunktionen an Ihre Bedürfnisse an
- **Reaktionsgeschwindigkeit**: Gleicht Geschwindigkeit mit Qualität aus
- **Kosteneffizienz**: Optimiert für Ihr Budget
- **Kontextanforderungen**: Wählt Modelle mit geeigneten Kontextfenstern aus

## Nächste Schritte

- [API-Referenz](/de/api) – Erfahren Sie, wie Sie Modelle über API nutzen
- [Quickstart](/de/quickstart) - Beginnen Sie mit Ihrem ersten Modell
- [Sicherheitsübersicht](/de/security/overview) - Modell-Sicherheitsfunktionen verstehen