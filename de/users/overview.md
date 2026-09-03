---
sidebar_position: 1
title: "Benutzer- und Zugriffsverwaltung"
---
# Benutzer- und Zugriffsverwaltung

SecureAI bietet Benutzerverwaltung der Enterprise-Klasse, rollenbasierte Zugriffskontrolle (RBAC), Berechtigungsstufen und Lizenzzuweisung.

---

## Systemrollen

SecureAI umfasst integrierte Systemrollen zur Steuerung des Plattformzugriffs:

| Rolle | Zugriffsebene | Beschreibung |
|---|---|---|
| **Administrator** | Volle Kontrolle | Vollständige Administratorrechte: Benutzer verwalten, benutzerdefinierte Rollen erstellen, SMLTP/AI-Gateway-Richtlinien konfigurieren, Protokolle anzeigen und SSO konfigurieren. |
| **Benutzer** | Standard | Regelmäßiger Benutzerzugriff: Chatten Sie mit KI-Modellen, erstellen und verwalten Sie persönliche Indizes, laden Sie Dokumente hoch. |
| **Globaler Leser** | Schreibgeschützt | Gleiche Funktionen wie der Standardbenutzer plus schreibgeschützte Sichtbarkeit der Admin-Panels und des Systemstatus. Einstellungen können nicht geändert werden. |

### Benutzerdefinierte Rollen und detaillierte Berechtigungen
Administratoren können benutzerdefinierte Rollen mit maßgeschneiderten Berechtigungsstufen (**Keine**, **Leser**, **Administrator**) für bestimmte Module erstellen:
- **Benutzer- und Gruppenverwaltung**: Benutzererstellung, Bearbeitung, Gruppenzuweisung.
- **Indexverwaltung**: Hochladen von Dokumenten, Indexerstellung, Indexschulung.
- **Sicherheit & SMLTP**: Sicherheitsrichtlinien, Reaktion auf Vorfälle, Audit-Verifizierung.
- **Integrationen & AI Gateway**: Verbindung von Cloud-Anbietern, API-Schlüsseln und Endpunkten.

---

## Lizenzverwaltung

Benutzerkonten werden unter Organisationslizenzstufen bereitgestellt:

| Stufe | Enthaltene Funktionen |
|---|---|
| **Ultra** | Vollständige Plattformfunktionen, unbegrenzte Indizes, Prioritätsmodelldurchsatz, benutzerdefinierte SMLTP-Compliance-Richtlinien, dedizierter Support. |
| **Wachstum** | Tools für die Teamzusammenarbeit, Gruppenindizes, Standard-SMLTP-Sicherheitsrichtlinien, Standardunterstützung. |
| **Unverzichtbar** | Kern-Chat-Schnittstelle, persönliche Indizes, grundlegender Modellzugriff, Community-Unterstützung. |

---

## Allgemeine Verwaltungsaufgaben

- **Benutzer erstellen**: Gehen Sie zu **Admin? Benutzer? Benutzer erstellen**. Legen Sie E-Mail, Rolle und Lizenzstufe fest.
- **Zu Gruppen zuweisen**: Navigieren Sie zu **Admin? Gruppen** zum Organisieren von Benutzern in kollaborativen Teams mit gemeinsamen Gruppenindizes.
- **SSO konfigurieren**: Verbinden Sie Ihren Unternehmensidentitätsanbieter (Google Workspace oder Microsoft Entra ID) unter den **Authentifizierungseinstellungen**.