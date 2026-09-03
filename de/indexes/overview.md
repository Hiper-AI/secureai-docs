---
sidebar_position: 1
title: "Wissensdatenbanken und RAG"
---
# Wissensdatenbanken und RAG-System

SecureAI nutzt **Retrieval-Augmented Generation (RAG)**, um KI-Modelle mit Ihren privaten Daten und Dokumenten zu verbinden und so sichere, genaue und kontextbezogene Antworten zu gewährleisten.

---

## Was ist RAG?

**Retrieval-Augmented Generation (RAG)** ist eine KI-Technik, die Sprachmodelle mit externen Wissensquellen kombiniert. Anstatt sich ausschließlich auf die vorab trainierten Daten des Modells zu verlassen:

1. **Abfrageverarbeitung**: Das System analysiert die Benutzeraufforderung, um relevante Wissensanforderungen zu identifizieren.
2. **Wissensabruf**: Die semantische Suche ruft relevante Dokumentblöcke aus Ihrem Index ab.
3. **Kontexterweiterung**: Der abgerufene Kontext wird in die Modelleingabeaufforderung eingefügt.
4. **Antwortgenerierung**: Die KI generiert eine sachliche, fundierte Antwort unter Berufung auf Ihre Dokumente.

---

## Indextypen in SecureAI

Indizes sind strukturierte Wissensdatenbanken, die nach Zugänglichkeit kategorisiert sind:

| Indextyp | Geltungsbereich | Zugriff und Datenschutz | Am besten für |
|---|---|---|---|
| **Persönliche Indizes** | Einzelner Benutzer | Ende-zu-Ende-verschlüsselt; Zero-Knowledge-Speicher (selbst Administratoren können Inhalte nicht lesen) | Persönliche Notizen, private Recherchen, individuelle Projektdokumente |
| **Gruppenindizes** | Teams / Abteilungen | Rollenbasierter Zugriff, gesteuert durch Gruppenmitgliedschaft | Abteilungswikis, Teamprojektdokumentation, gemeinsame SOPs |
| **Globale Indizes** | Organisationsweit | Lesezugriff für alle Firmenbenutzer | Unternehmensrichtlinien, HR-Richtlinien, unternehmensweite Handbücher |

### 1. Persönliche Indexe
- **Zero-Knowledge-Datenschutz**: Ihre Dateien und Gespräche werden mit Mieter-/Benutzerschlüsseln verschlüsselt.
- **Erstellung**: 
  - **Benutzer**: Öffnen Sie die Chat-Oberfläche, klicken Sie auf die Indexauswahl neben der Modellauswahl, wechseln Sie zur Registerkarte *Persönlich* und klicken Sie auf **+**.
  - **Admins**: Gehen Sie zu **Admin? Indexverwaltung? Erstellen Sie einen Index** und weisen Sie ihn einem bestimmten Benutzer zu.

### 2. Gruppenindizes
- **Zusammenarbeit**: Mehrere Teammitglieder können Dokumente abfragen und zur gleichen Wissensdatenbank beitragen.
- **Erstellung**:
  - Gehen Sie zu **Admin? Gruppenleitung? Erstellen Sie eine Gruppe**, weisen Sie Mitglieder zu und verknüpfen Sie einen gemeinsamen Gruppenindex.

### 3. Globale Indizes
- **Unternehmensweite Standards**: Zentralisierte Repositories für Unternehmens-Compliance, rechtliche Bestimmungen und Betriebsrichtlinien.
- **Erstellung**: Gehen Sie zu **Admin? Indexverwaltung? Erstellen Sie einen Index** und legen Sie den Gültigkeitsbereich auf **Global** fest.

---

## So funktioniert die Indizierung

Wenn Sie Dateien hochladen (PDFs, Word-Dokumente, CSV, JSON, Markdown oder Nur-Text):

`
Rohdokument –?  Textextraktion --?  Semantisches Chunking –?  Vektoreinbettungen --?  Vektorspeicher (Index)
`

1. **Dokumentenverarbeitung**: Text und Metadaten (Zeitstempel, Dateinamen) werden extrahiert und bereinigt.
2. **Chunking**: Der Inhalt wird in optimierte semantische Blöcke mit Überlappung aufgeteilt, um die kontextuelle Kontinuität aufrechtzuerhalten.
3. **Einbettungsgenerierung**: Chunks werden in hochdimensionale Vektoreinbettungen umgewandelt.
4. **Vektorspeicher**: Einbettungen werden in leistungsstarken Vektordatenbanken gespeichert, um die Ähnlichkeit sofort abzurufen.

---

## Best Practices

- **Benennung**: Verwenden Sie klare, beschreibende Namen für Indizes und hochgeladene Dateien (z. B. HR-Policy-2026 anstelle von doc1).
- **Dateivorbereitung**: Stellen Sie sicher, dass die hochgeladenen Dokumente Klartext sind; Bereinigen Sie Scans mit geringer Qualität vor dem Hochladen.
- **Dateibeschränkungen**: Standard-Uploads unterstützen Dateien bis zu 10 MB pro Stapel.
- **Angemessener Umfang**: Bewahren Sie vertrauliche persönliche Notizen in persönlichen Verzeichnissen auf; Verschieben Sie Teamressourcen in Gruppenindizes.