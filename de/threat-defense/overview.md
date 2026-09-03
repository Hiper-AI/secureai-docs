---
sidebar_position: 1
title: "Bedrohungsabwehr"
---
# Bedrohungsabwehr

Threat Defense bietet Echtzeitschutz vor böswilligen Sofortangriffen, Jailbreaks, Befehlslecks und Ausgabemanipulation.

---

## Geschützte Bedrohungsvektoren

| Bedrohung | Beschreibung |
|---|---|
| **Sofortige Injektion** | Versucht, Systemanweisungen und -beschränkungen außer Kraft zu setzen oder zu umgehen. |
| **Jailbreaks** | Kontroverse Aufforderungen zur Umgehung von Sicherheitsleitplanken. |
| **Anweisung/System-Prompt-Leckage** | Extraktionsangriffe, die versuchen, proprietäre Anweisungen preiszugeben. |
| **Rollendrift/Hijacking** | Den Assistenten so manipulieren, dass er von seinem beabsichtigten Geschäftsbereich abweicht. |
| **Datenextraktionsangriffe** | Automatisierte Versuche, vertrauliche Trainings- oder Indexdaten zu sammeln. |
| **Canary-Token-Lecks** | Erkennung versteckter Canary-Strings, die die Offenlegung von Anweisungen signalisieren. |

---

## Schlüsselmodule

### 1. Prompt Shield Engine
Wertet jede eingehende Eingabeaufforderung aus, bevor sie das Sprachmodell erreicht:
- **Zulassen**: Die Anfrage besteht alle Sicherheitsprüfungen.
- **Flag**: Die Anfrage ist zulässig, wird jedoch als Sicherheitsereignis zur administrativen Überprüfung protokolliert.
- **Blockieren**: Die Anfrage wird sofort mit einem signierten Ablehnungsereignis blockiert.

### 2. Ausgabeleitplanken
Überwacht Modellausgaben vor der Clientbereitstellung, um Folgendes abzufangen:
- Systemaufforderung und interner Kontextverlust.
- Kanarisches Token-Leck.
- Unbeabsichtigte Rollendrift oder gefährliche Ausgaben.

### 3. Kanarische Token
Kanarische Token sind einzigartige, versteckte kryptografische Markierungen, die in Chatbot-Anweisungen eingefügt werden:
- **So funktioniert es**: Wenn es einem Angreifer gelingt, Anweisungen zu extrahieren, löst der Canary-Marker in der Antwort sofort eine Sicherheitswarnung mit hoher Priorität aus.
- **Konfiguration**: Gehen Sie zu **Admin? Bedrohungsabwehr? Canary Tokens** zum Generieren, Rotieren oder Überwachen von Token.

---

## Richtlinienkonfiguration und Vorfallmanagement

1. **Richtlinien konfigurieren**: Gehen Sie zu **Admin? Bedrohungsabwehr? Richtlinien**. Wählen Sie zwischen **Streng** (öffentliche Chatbots), **Ausgewogen** (Standard-Unternehmensnutzung) oder **Permissiv** (Testumgebungen).
2. **Vorfälle überprüfen**: Untersuchen Sie markierte oder blockierte Ereignisse unter **Admin? Bedrohungsabwehr? Vorfälle**, um Angriffslasten zu analysieren und die Empfindlichkeit anzupassen.