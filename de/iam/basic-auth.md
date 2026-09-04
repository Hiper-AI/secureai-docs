---
sidebar_position: 4
title: "Grundlegende Auth"
---
# Basisauthentifizierung

Die Standardauthentifizierung bietet eine einfache Authentifizierungsmethode mit Benutzername und Passwort für SecureAI. Benutzer authentifizieren sich anhand ihrer Anmeldeinformationen bei unserer Datenbank, optional mit Unterstützung der Multi-Faktor-Authentifizierung.

## Was ist Basisauthentifizierung?

**Basisauthentifizierung** ist eine einfache Authentifizierungsmethode, die Benutzernamen und Passwort-Anmeldeinformationen verwendet, um Benutzer anhand unserer Datenbank zu authentifizieren. Dies ist die einfachste Authentifizierungsmethode, die in SecureAI verfügbar ist.

## Hauptmerkmale

### **Einfache Anmeldung**
- **Benutzername und Passwort**: Benutzer geben ihre Anmeldeinformationen ein, um sich anzumelden
- **Datenbankauthentifizierung**: Anmeldeinformationen werden anhand unserer Datenbank überprüft
- **Sichere Speicherung**: Passwörter werden sicher gehasht und gespeichert

### **Multi-Faktor-Authentifizierung (MFA)**
- **Google Authenticator**: Benutzer können ihre Google Authenticator-App registrieren
- **Microsoft Authenticator**: Unterstützung für die Microsoft Authenticator-App
- **QR-Code-Einrichtung**: Einfacher Registrierungsprozess mit QR-Codes
- **Backup-Codes**: Wiederherstellungscodes für den Kontozugriff

### **E-Mail-OTP-Konfiguration**
- **Standard-E-Mail-OTP**: E-Mail-OTP ist standardmäßig als zweiter Faktor aktiviert
- **Deaktivierung pro Benutzer**: Administratoren können E-Mail-OTP für bestimmte Benutzer deaktivieren
- **MFA-Alternative**: Benutzer können von E-Mail-OTP zu Authentifizierungs-Apps wechseln

## Wie es funktioniert

### **Authentifizierungsablauf**
1. **Benutzeranmeldung**: Der Benutzer gibt Benutzernamen und Passwort ein
2. **Anmeldeinformationsüberprüfung**: Das System prüft die Anmeldeinformationen anhand der Datenbank
3. **Zweiter Faktor**: E-Mail-OTP gesendet oder MFA-App-Code erforderlich
4. **Zugriff gewährt**: Der Benutzer erhält Zugriff auf die SecureAI-Plattform

### **Verhalten des zweiten Faktors**
- **Vor der MFA-Einrichtung**: E-Mail-OTP ist immer als zweiter Faktor erforderlich
- **Nach der MFA-Einrichtung**: Der Benutzer kann zwischen E-Mail-OTP oder MFA-Code wählen
- **Anmeldeoptionen**: Der Benutzer wählt beim Anmelden die bevorzugte Zweitfaktor-Methode aus
- **Fallback**: E-Mail-OTP bleibt als Backup-Option verfügbar

## Benutzererfahrung

### **Erste Anmeldung (vor MFA)**
- Geben Sie Benutzernamen und Passwort ein
- Erhalten Sie E-Mail-OTP als zweiten Faktor
- Greifen Sie auf die SecureAI-Plattform zu

### **MFA-Einrichtungsprozess**
1. **Zum Chat navigieren**: Gehen Sie zu „/chat-ai/new-chat“ oder einer beliebigen Chat-Seite
2. **Profilmenü öffnen**: Klicken Sie oben rechts auf das Profilbild
3. **Zugriffseinstellungen**: Wählen Sie „Einstellungen“ aus der Dropdown-Liste
4. **Gehen Sie zu Sicherheit**: Klicken Sie auf die Registerkarte „Sicherheit“.
5. **MFA aktivieren**: Klicken Sie auf „Multi-Faktor-Authentifizierung aktivieren“
6. **QR-Code scannen**: Verwenden Sie Google oder Microsoft Authenticator, um den QR-Code zu scannen
7. **Code eingeben**: Geben Sie den 6-stelligen Code aus Ihrer Authentifizierungs-App ein
8. **Backup-Codes speichern**: Speichern Sie die generierten Backup-Codes sicher

### **Anmeldung nach der MFA-Einrichtung**
- Geben Sie Benutzernamen und Passwort ein
- Wählen Sie die zweite Faktormethode:
  - **E-Mail-OTP**: Code per E-Mail erhalten
  - **MFA-Code**: Geben Sie den Code aus der Authentifizierungs-App ein
- Greifen Sie auf die SecureAI-Plattform zu

### **Backup-Code-Nutzung**
- Verwenden Sie Ersatzcodes, wenn die Authentifizierungs-App nicht verfügbar ist
- Jeder Backup-Code kann nur einmal verwendet werden
- Generieren Sie bei Bedarf neue Backup-Codes

## Sicherheitsfunktionen

### **Passwortsicherheit**
- **Starkes Hashing**: Passwörter werden sicher gehasht
- **Datenbankspeicherung**: In unserer Datenbank gespeicherte Anmeldeinformationen
- **Sichere Übertragung**: Alle Authentifizierungsdaten verschlüsselt

### **MFA-Sicherheit**
- **Zeitbasierte Codes**: Authentifizierungs-Apps generieren zeitbasierte Codes
- **Sichere Registrierung**: QR-Code-basierte sichere Einrichtung
- **Backup-Wiederherstellung**: Backup-Codes für die Kontowiederherstellung

### **Sitzungsverwaltung**
- **Sichere Sitzungen**: Verschlüsselte Sitzungsverwaltung
- **Timeout-Schutz**: Automatisches Sitzungs-Timeout
- **Gleichzeitige Sitzungssteuerung**: Verwalten Sie mehrere aktive Sitzungen

## Erste Schritte

1. **Basisauthentifizierung aktivieren**: Im Admin-Bereich konfigurieren
2. **Benutzerkonten erstellen**: Benutzeranmeldeinformationen einrichten
3. **MFA konfigurieren**: Aktivieren Sie die Multi-Faktor-Authentifizierung
4. **Benutzerschulung**: Informieren Sie Benutzer über den Anmeldevorgang
5. **Nutzung überwachen**: Authentifizierungsmuster verfolgen

## Nächste Schritte

- [Google Workspace](/de/iam/google-workspace) - Integration mit Google Workspace
- [Microsoft Entra ID](/de/iam/microsoft-entra-id) - Mit Microsoft Entra ID verbinden
- [IAM-Übersicht](/de/iam/overview) - Erfahren Sie mehr über Identitätsmanagement