---
sidebar_position: 2
title: "Google Workspace (SSO)"
---
# Google Workspace (SSO)-Integration

Dieser Leitfaden führt Sie durch den Prozess der Konfiguration von Google Workspace für Single Sign-On (SSO) mit SecureAI. Sie erfahren, wie Sie die erforderlichen Anmeldeinformationen von der Google Cloud Console erhalten und diese übermitteln, um die Integration abzuschließen.

## Voraussetzungen

- Administratorzugriff auf die Google Cloud Console
– Ein Google Workspace-Konto für Ihre Organisation
– Zugriff auf die Google Workspace-Administratorkonsole Ihrer Organisation (bei Verwendung von Domänenbeschränkungen)
- Administratorzugriff auf SecureAI

## Schritt 1: Erstellen Sie ein Projekt in der Google Cloud Console

1. Melden Sie sich bei der [Google Cloud Console] an (https://console.cloud.google.com).
2. Klicken Sie oben auf der Seite auf das Projekt-Dropdown-Menü
3. Klicken Sie auf **Neues Projekt**

<div class="mac-window">
  ![Neues Projekt](/img/google%20sso%20images/google%20-%201.png)
</div>

4. Geben Sie einen Projektnamen ein (z. B. „SecureAI SSO“).
5. Klicken Sie auf **Erstellen**

<div class="mac-window">
  ![Projekt erstellen](/img/google%20sso%20images/google%20-%202.png)
</div>

## Schritt 2: Aktivieren Sie die Google+ API (falls erforderlich)

1. Gehen Sie in Ihrem Projekt zu **APIs & Dienste** > **Bibliothek**
2. Suchen Sie nach „Google+ API“ oder „Google Identity“
3. Klicken Sie darauf und dann auf **Aktivieren** (falls nicht bereits aktiviert).
4. **Hinweis**: Modernes Google OAuth erfordert dies möglicherweise nicht, aber die Aktivierung stellt die Kompatibilität sicher

## Schritt 3: Konfigurieren Sie den OAuth-Zustimmungsbildschirm

1. Gehen Sie zu **APIs & Dienste** > **OAuth-Zustimmungsbildschirm**

<div class="mac-window">
  ![OAuth-Zustimmungsbildschirm](/img/google%20sso%20images/google%20-%203.png)
</div>

2. Geben Sie die erforderlichen Informationen ein:
   - **App-Name**: Geben Sie einen Namen ein (z. B. „SecureAI“).
   - **Benutzer-Support-E-Mail**: Wählen Sie eine Support-E-Mail-Adresse aus
   - **Kontaktinformationen**: Fügen Sie eine Kontakt-E-Mail-Adresse hinzu

3. Wählen Sie **Benutzertyp**:
   - **Intern**: Nur für Nutzer in Ihrer Google Workspace-Organisation (empfohlen für die Nutzung durch Unternehmen)
   - **Extern**: Für Benutzer außerhalb Ihrer Organisation

4. Klicken Sie auf **Erstellen**

<div class="mac-window">
  ![OAuth-Zustimmung erstellen](/img/google%20sso%20images/google%20-%204.png)
</div>

5. **Branding**:
   - Gehen Sie im linken Menü zum Abschnitt **Branding**
   - Suchen Sie nach **Autorisierten Domänen** und fügen Sie Ihre Unternehmensdomäne hinzu
   - Dadurch können sich Benutzer mit ihrer Firmen-E-Mail-Adresse anmelden
   - (Zusätzlich können Sie bei Bedarf Ihre Homepage-URL, Datenschutzrichtlinie und Nutzungsbedingungen hinzufügen.)

<div class="mac-window">
  ![Autorisierte Domains](/img/google%20sso%20images/google%20-%205.png)
</div>

6. **Umfang**:
   - Klicken Sie im linken Menü auf den Abschnitt **Datenzugriff**
   - Klicken Sie im Abschnitt „Datenzugriff“ auf **Bereiche hinzufügen oder entfernen**
   - Auf der linken Seite öffnet sich ein Fenster, in dem Sie nach Rollen suchen können
   - Suchen Sie nach der Rolle **"openid"** und wählen Sie sie aus
   - Klicken Sie auf **Aktualisieren**
   - Klicken Sie dann im Abschnitt „Datenzugriff“ auf **Speichern**
   - **Hinweis**: Der Bereich `openid` umfasst automatisch den Zugriff auf `profile` und `email` – Sie müssen diese nicht separat hinzufügen
   – Wenn Sie andere Bereichsoptionen sehen, benötigen Sie nur **OpenID** für SecureAI SSO

<div class="mac-window">
  ![OpenID-Bereichsauswahl](/img/google%20sso%20images/google%20-%206.png)
</div>

   - **Wichtig**: Der OpenID-Bereich bietet Zugriff auf:
     - E-Mail-Adresse des Benutzers
     - Grundlegende Profilinformationen
     – Das ist alles, was für die SecureAI-Authentifizierung benötigt wird

7. **Testbenutzer** (bei Verwendung von Extern):
   - Fügen Sie bei Bedarf während des Tests Testbenutzer hinzu
   - Klicken Sie auf **Speichern und fortfahren**

8. **Zusammenfassung**:
   - Überprüfen Sie Ihre Konfiguration
   - Klicken Sie auf **Zurück zum Dashboard**

## Schritt 4: OAuth 2.0-Anmeldeinformationen erstellen

1. Gehen Sie zu **APIs & Dienste** > **Anmeldeinformationen**
2. Klicken Sie auf **+ Anmeldeinformationen erstellen** > **OAuth-Client-ID**

<div class="mac-window">
  ![OAuth-Client-ID erstellen](/img/google%20sso%20images/google%20-%207.png)
</div>
3. **Anwendungstyp**: Wählen Sie **Webanwendung**
4. **Name**: Geben Sie einen aussagekräftigen Namen ein (z. B. „SecureAI SSO Client“).
5. **Autorisierte Weiterleitungs-URIs**: Klicken Sie auf **+ URI hinzufügen** und geben Sie Folgendes ein:
   - `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`
   - **Wichtig**: Die URL muss genau übereinstimmen (einschließlich `https://` und `/api/auth/google/callback`).

<div class="mac-window">
  ![Autorisierte Weiterleitungs-URIs](/img/google%20sso%20images/google%20-%208.png)
</div>

6. Klicken Sie auf **Erstellen**

## Schritt 5: Holen Sie sich Ihre Anmeldeinformationen

Nach dem Erstellen des OAuth-Clients:

1. Ein Popup mit Ihren Anmeldeinformationen wird angezeigt

<div class="mac-window">
  ![OAuth-Anmeldeinformationen-Popup](/img/google%20sso%20images/google%20-%209.png)
</div>
2. **Kunden-ID**:
   - Sieht aus wie: `123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com`
   - **Kopieren Sie diesen Wert** – Sie werden ihn später benötigen
3. **Client-Geheimnis**:
   - Sieht aus wie: `GOCSPX-abcdefghijklmnopqrstuvwxyz`
   - **Diesen Wert sofort kopieren**
   - **WARNUNG**: Dieses Geheimnis wird nur einmal im Popup angezeigt. Wenn Sie es verlieren, müssen Sie einen neuen OAuth-Client erstellen

## Schritt 6: Variablen an das Hiper AI-Team senden

Nachdem Sie den OAuth-Client in der Google Cloud Console erstellt und die oben genannten Schritte ausgeführt haben, erhalten Sie die folgenden wichtigen Informationen:

1. **Kunden-ID** (aus Schritt 5)
2. **Client-Geheimnis** (aus Schritt 5)
3. **Umleitungs-URI**: `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`

Sie müssen diese Werte an das Hiper AI-Team senden, um die SSO-Integration abzuschließen.

### A. Greifen Sie auf das Admin-Panel zu

1. Melden Sie sich als Administrator bei Ihrer SecureAI-Instanz an
2. Navigieren Sie zu `https://{enterprise.name}.hiperai.ai/admin/home`
3. Klicken Sie in der oberen rechten Ecke auf Ihr Admin-Profilbild
4. Dadurch wird ein Dropdown-Menü mit verschiedenen Optionen geöffnet

### B. Senden Sie die Supportanfrage

1. Klicken Sie im Dropdown-Menü auf **"Support erhalten"**

<div class="mac-window">
  ![Support-Menü abrufen](/img/microsoft%20entraid%20sso%20images/10%20-%20azure.png)
</div>

2. Es erscheint ein Popup-Fenster mit einem Support-Ticket-Formular
3. Füllen Sie das Formular mit den folgenden Informationen aus:
   - **Kategorie**: Wählen Sie **"Integrationen und Implementierungen"**

<div class="mac-window">
  ![Supportformularkategorie](/img/microsoft%20entraid%20sso%20images/11%20-%20azure.png)
</div>

   - **Betreff**: Geben Sie **„Google Workspace SSO-Integration“** ein.
   - **Beschreibung**: Fügen Sie die Werte ein, die Sie während des Einrichtungsvorgangs kopiert haben:
     - Kunden-ID
     - Kundengeheimnis
     – Umleitungs-URI: `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`
4. Klicken Sie auf die Schaltfläche **Anfrage senden**

### C. Warten Sie auf die Bestätigung

- Sie erhalten innerhalb von **24 bis 72 Stunden** eine E-Mail-Bestätigung (je nach Verfügbarkeit)
- Die E-Mail bestätigt, dass Ihr SSO erfolgreich konfiguriert wurde
- Nach der Konfiguration können Sie über die Anmeldeschaltfläche **„Weiter mit Google“** auf der Anmeldeseite auf Ihre SecureAI-Instanz zugreifen

**Wichtig**: Bewahren Sie Ihre Anmeldeinformationen sicher auf, bis die Integration abgeschlossen ist. Teilen Sie sie nicht über unsichere Kanäle.

## Benutzerkonfiguration

### Vorhandene Benutzer

Benutzer, die bereits über Konten in SecureAI verfügen (unabhängig davon, ob sie die Basisauthentifizierung verwenden) **müssen nicht neu erstellt werden**. Sie können weiterhin ihre bestehenden Konten verwenden und sich nach der Konfiguration auch über Google Workspace SSO anmelden.

**Wichtig**: Die E-Mail-Adresse des Benutzers in Google Workspace muss genau mit der E-Mail-Adresse in SecureAI übereinstimmen, damit SSO funktioniert.

### Neue SSO-Benutzer erstellen

Für neue Benutzer, die ausschließlich über SSO auf SecureAI zugreifen sollten:

1. Navigieren Sie im SecureAI-Administrationsbereich zu **Benutzerverwaltung**
2. Klicken Sie, um einen neuen Benutzer zu erstellen
3. Wählen Sie beim Anlegen des Benutzers die Option **"Geschäftskonto / SSO"**
4. Diese Konfiguration stellt sicher, dass:
   - Der neue Benutzer erhält **keine E-Mail** zur Generierung eines Passworts
   - Der Benutzer kann **direkt über die Google Workspace SSO**-Anmeldeschaltfläche auf SecureAI zugreifen
   – Die E-Mail-Adresse des Nutzers in Google Workspace muss genau mit der in SecureAI eingegebenen E-Mail-Adresse übereinstimmen

## Fehlerbehebung

### Fehler: „redirect_uri_mismatch“

– Stellen Sie sicher, dass der Umleitungs-URI in der Google Cloud Console genau mit der Konfiguration auf dem Server übereinstimmt
- Stellen Sie sicher, dass `https://` (nicht `http://` in die Produktion einbezogen wird).
– Der Weiterleitungs-URI muss genau lauten: `https://{enterprise.name}.hiperai.ai/api/auth/google/callback`
- Suchen Sie nach abschließenden Schrägstrichen oder Tippfehlern

### Fehler: „Benutzer nicht in SecureAI-Datenbank gefunden“

- Der Benutzer muss zuvor in SecureAI registriert sein
- Wenden Sie sich an den SecureAI-Administrator, um das Benutzerkonto zu erstellen
– Stellen Sie sicher, dass die E-Mail-Adresse in Google Workspace genau mit der E-Mail in SecureAI übereinstimmt

### Fehler: „E-Mail-Domäne für Google Workspace-Anmeldung nicht zulässig“

– Die E-Mail-Domäne des Benutzers ist nicht in der Liste der zulässigen Domänen enthalten
- Wenden Sie sich an Ihr Entwicklungsteam, um Ihre Domain zur Liste der zulässigen Domains hinzuzufügen
- Oder überprüfen Sie, ob die Konfiguration der Domänenbeschränkung korrekt ist

### Fehler: „access_denied“ oder „unauthorized_client“

– Stellen Sie sicher, dass der OAuth-Zustimmungsbildschirm ordnungsgemäß konfiguriert ist
- Überprüfen Sie, ob Ihr Antrag genehmigt wurde (bei Verwendung des externen Benutzertyps).
- Stellen Sie sicher, dass die Client-ID und das Client-Geheimnis korrekt sind

### Fehler: „invalid_client“

- Das Client-Geheimnis wurde möglicherweise zurückgesetzt oder ist falsch
– Überprüfen Sie das Client-Geheimnis in der Google Cloud Console
- Erstellen Sie bei Bedarf ein neues Client Secret und stellen Sie Ihrem Entwicklungsteam den neuen Wert zur Verfügung

## Best Practices für die Sicherheit von Client-Geheimnissen

1. **Übergeben Sie niemals Geheimnisse an Code-Repositories**
2. **Geheimnisse regelmäßig wechseln** (empfohlen: alle 90 Tage)
3. **Beschränken Sie den Zugriff** auf die Anmeldeinformationsseite der Google Cloud Console
4. **Verwenden Sie sichere Kanäle**, wenn Sie Geheimnisse mit Ihrem Entwicklungsteam teilen
5. **Überwachen Sie die Nutzung** in der Google Cloud Console auf verdächtige Aktivitäten

## Erneuerung des Kundengeheimnisses

So rotieren Sie Ihr Client Secret (empfohlen alle 90 Tage):

1. Gehen Sie zu **APIs & Dienste** > **Anmeldeinformationen**
2. Suchen Sie Ihre OAuth 2.0-Client-ID
3. Klicken Sie auf das **Bleistiftsymbol** (Bearbeiten).
4. Klicken Sie im Abschnitt **Client-Geheimnis** auf **Geheimnis zurücksetzen**
5. **Sofort kopieren** Sie den neuen Geheimwert
6. Stellen Sie Ihrem Entwicklungsteam das neue Geheimnis über die Supportanfrage im Admin-Panel zur Verfügung
7. Sie aktualisieren die Konfiguration, ohne den Dienst zu unterbrechen
8. Nachdem Sie bestätigt haben, dass das neue Geheimnis funktioniert, können Sie optional das alte Geheimnis löschen

**Hinweis**: Während der Rotation gibt es eine kurze Überschneidungsphase, in der beide Geheimnisse funktionieren, was einen reibungslosen Übergang ermöglicht.

## SSO-Anmeldung testen

Nach Abschluss der Konfiguration:

1. Gehen Sie zu Ihrer SecureAI-Anmeldeseite
2. Klicken Sie auf **Weiter mit Google**
3. Wählen Sie Ihr Google Workspace-Konto aus
4. Erteilen Sie Berechtigungen, wenn Sie dazu aufgefordert werden
5. Sie sollten zu SecureAI weitergeleitet und angemeldet werden

Wenn Sie auf Probleme stoßen:
- Löschen Sie Ihre Browser-Cookies und versuchen Sie es erneut
– Stellen Sie sicher, dass Sie das richtige Google Workspace-Konto verwenden
- Überprüfen Sie, ob Ihre E-Mail in SecureAI vorhanden ist

## Unterstützung

Wenn bei der Konfiguration Probleme auftreten:

1. Stellen Sie sicher, dass Sie über Administratorrechte in der Google Cloud Console verfügen
2. Stellen Sie sicher, dass Sie über Google Workspace-Administratorzugriff verfügen (falls Domänenbeschränkungen verwendet werden).
3. Kontaktieren Sie Ihr Entwicklungsteam über die Supportanfrage im Admin-Panel mit:
   - Screenshots der Fehler
   - Die Kunden-ID (Sie können diese weitergeben, sie ist nicht vertraulich)
   - Die vollständige Fehlermeldung
   - Alle relevanten Browserkonsolenfehler

**Geben Sie Ihr Kundengeheimnis niemals in Supportanfragen weiter** – geben Sie es nur über sichere Kanäle weiter, nachdem die Identitätsüberprüfung durchgeführt wurde.

## Zusätzliche Ressourcen

- [Dokumentation zur Google Cloud Console](https://cloud.google.com/docs)
- [Google OAuth 2.0-Dokumentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Workspace-Administratorhilfe](https://support.google.com/a)