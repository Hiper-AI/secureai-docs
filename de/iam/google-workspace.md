---
sidebar_position: 2
title: "Google Workspace (SSO)"
sidebar_label: "Google Workspace (SSO)"
---

# Google Workspace (SSO)-Integration

Mit dieser Integration melden sich die Benutzer Ihrer Organisation mit ihrem Google Workspace-Konto bei SecureAI an (Schaltfläche **Continue with Google**). Die Einrichtung erfolgt **in Eigenregie**: Ein Administrator Ihrer Organisation erstellt einen OAuth-Client in Ihrem eigenen Google Cloud-Projekt und trägt die Angaben unter **Admin → Integrationen** ein. Sie müssen kein Ticket eröffnen und nicht auf Hiper AI warten: Die Schaltfläche erscheint auf Ihrer Anmeldeseite, sobald Sie speichern.

Geschätzter Zeitaufwand: 10 Minuten.

## Voraussetzungen

- Ein Google Cloud-Projekt **innerhalb Ihrer Google Workspace-Organisation** sowie die Berechtigung, darin die Google Auth Platform zu konfigurieren und OAuth-Clients zu erstellen (zum Beispiel die Projektrolle **Inhaber** (*Owner*) oder **Bearbeiter** (*Editor*)).
- Administratorzugriff auf SecureAI mit der Berechtigung **Administrator** für den Bereich **Integrationen**.

## So funktioniert es

1. Sie erstellen in Google Cloud einen **OAuth 2.0-Client vom Typ „Webanwendung“**. SecureAI verwendet OpenID Connect mit den Bereichen (Scopes) `openid`, `email` und `profile`.
2. In SecureAI tragen Sie die **Client-ID**, den **Clientschlüssel** (Client Secret) und Ihre **Google Workspace-Domains** ein. Der Schlüssel wird verschlüsselt gespeichert und nie wieder angezeigt.
3. Wenn ein Benutzer auf **Continue with Google** klickt, authentifiziert Google ihn, und SecureAI lässt ihn nur herein, wenn:
   - Google seine E-Mail-Adresse verifiziert hat,
   - das Konto **von einer Ihrer Workspace-Domains verwaltet wird** (der Claim `hd`) und
   - seine E-Mail-Adresse zu einem **aktiven** SecureAI-Konto passt.

Ein privates Google-Konto (zum Beispiel ein @gmail.com-Konto oder ein privates Konto, das mit der Firmen-E-Mail-Adresse erstellt wurde) kann sich **nicht** anmelden, selbst wenn es dieselbe E-Mail-Adresse wie ein SecureAI-Benutzer hat.

## Schritt 1: Weiterleitungs-URI aus SecureAI kopieren

1. Melden Sie sich als Administrator bei SecureAI an.
2. Gehen Sie zu **Admin → Integrationen** und filtern Sie nach der Kategorie **IAM**.
3. Klicken Sie auf der Karte **Google Workspace (SSO)** auf **Integration verbinden**.
4. Klicken Sie im Abschnitt **1. Create an OAuth client in Google Cloud** neben der **Redirect URI** (Weiterleitungs-URI) auf **Copy**.

Die URI sieht so aus (mit der Domain Ihrer Instanz):

```
https://<your-company>.hiperai.ai/api/auth/google/callback
```

Verwenden Sie immer die URI, die Ihre Instanz anzeigt: Sie muss exakt übereinstimmen, einschließlich `https://`.

## Schritt 2: Google Cloud-Projekt auswählen oder erstellen

1. Öffnen Sie die [Google Cloud Console](https://console.cloud.google.com).
2. Wählen Sie in der Projektauswahl in der oberen Leiste ein Projekt Ihrer Organisation aus oder klicken Sie auf **Neues Projekt** (*New Project*).

<div class="mac-window">
  ![New project](/img/google%20sso%20images/google%20-%201.png)
</div>

3. Wenn Sie ein neues Projekt erstellen: Geben Sie ihm einen Namen (zum Beispiel `SecureAI SSO`), prüfen Sie, dass als **Organisation** Ihre Google Workspace-Organisation eingestellt ist, und klicken Sie auf **Erstellen** (*Create*).

<div class="mac-window">
  ![Create project](/img/google%20sso%20images/google%20-%202.png)
</div>

Für die Anmeldung muss keine API aktiviert werden.

## Schritt 3: Google Auth Platform konfigurieren (Zustimmungsbildschirm)

1. Gehen Sie im Menü zu **APIs und Dienste → OAuth-Zustimmungsbildschirm** (*APIs & Services → OAuth consent screen*; in der neuen Console **Google Auth Platform** genannt). Wenn Sie dies zum ersten Mal tun, klicken Sie auf **Jetzt starten** (*Get started*).

<div class="mac-window">
  ![OAuth consent screen](/img/google%20sso%20images/google%20-%203.png)
</div>

2. **App-Informationen** (*App information*): ein App-Name (zum Beispiel `SecureAI`) und eine E-Mail-Adresse für den Nutzersupport.
3. **Zielgruppe** (*Audience*): Wählen Sie **Intern** (*Internal*). Nur Konten Ihrer Google Workspace-Organisation können die App verwenden, und Google verlangt keine App-Überprüfung.
4. **Kontaktdaten** (*Contact information*): eine E-Mail-Adresse für Benachrichtigungen von Google.
5. Akzeptieren Sie die Richtlinie zu Nutzerdaten und klicken Sie auf **Erstellen** (*Create*).

<div class="mac-window">
  ![Create the OAuth configuration](/img/google%20sso%20images/google%20-%204.png)
</div>

Die Bereiche `openid`, `email` und `profile` sind nicht sensibel: Sie müssen sie nicht unter **Datenzugriff** (*Data access*) hinzufügen.

<Note>
Wenn Sie **Extern** (*External*) wählen, muss sich die App **in Produktion** (*In production*) befinden (nicht im Status „Test“); im Testmodus können sich nur die von Ihnen eingetragenen Testnutzer anmelden. Auch bei „Extern“ akzeptiert SecureAI nur Konten aus den Workspace-Domains, die Sie in Schritt 5 konfigurieren.
</Note>

## Schritt 4: OAuth-Client erstellen

1. Gehen Sie in der Google Auth Platform zu **Clients** (oder **APIs und Dienste → Anmeldedaten → + Anmeldedaten erstellen → OAuth-Client-ID**; *APIs & Services → Credentials → + Create credentials → OAuth client ID*).

<div class="mac-window">
  ![Create OAuth client ID](/img/google%20sso%20images/google%20-%207.png)
</div>

2. Klicken Sie auf **+ Client erstellen** (*+ Create client*).
3. **Anwendungstyp** (*Application type*): **Webanwendung** (*Web application*).
4. **Name**: zum Beispiel `SecureAI SSO`.
5. Klicken Sie unter **Autorisierte Weiterleitungs-URIs** (*Authorized redirect URIs*) auf **+ URI hinzufügen** (*+ Add URI*) und fügen Sie die URI aus Schritt 1 ein. (**Autorisierte JavaScript-Quellen** (*Authorized JavaScript origins*) benötigen Sie nicht.)

<div class="mac-window">
  ![Authorized redirect URIs](/img/google%20sso%20images/google%20-%208.png)
</div>

6. Klicken Sie auf **Erstellen** (*Create*).
7. Kopieren Sie im angezeigten Dialog die **Client-ID** (endet auf `.apps.googleusercontent.com`) und den **Clientschlüssel** (*Client secret*, beginnt mit `GOCSPX-`). Sie können die JSON-Datei als Sicherung herunterladen.

<div class="mac-window">
  ![OAuth client created](/img/google%20sso%20images/google%20-%209.png)
</div>

<Warning>
Google zeigt den vollständigen Schlüssel nur bei der Erstellung an. Bewahren Sie ihn sicher auf; wenn Sie ihn verlieren, fügen Sie dem Client einen neuen Schlüssel hinzu.
</Warning>

Änderungen an der Weiterleitungs-URI können bei Google einige Minuten dauern, bis sie wirksam werden.

## Schritt 5: Angaben in SecureAI eintragen und testen

Kehren Sie zu **Admin → Integrationen → Google Workspace (SSO)** zurück:

1. Füllen Sie unter **2. Paste the OAuth client details** Folgendes aus:
   - **Client ID**: aus Schritt 4.
   - **Client secret**: aus Schritt 4.
   - **Allowed email domains** (zulässige E-Mail-Domains; Pflichtfeld): Ihre primäre Google Workspace-Domain und, falls Sie welche verwenden, Ihre sekundären Domains, durch Kommas getrennt. Zum Beispiel `contoso.com, contoso.co.uk`.
2. Klicken Sie unter **3. Test the connection** auf **Test connection**. SecureAI fragt bei Google nach (ohne jemanden anzumelden) und prüft:

   | Prüfung | Wenn sie fehlschlägt |
   |---|---|
   | Client ID | Google kennt diesen Client nicht (`invalid_client`). Prüfen Sie, ob Sie die vollständige ID kopiert haben und ob der Client nicht gelöscht oder deaktiviert ist. |
   | Redirect URI registered on the client | Die URI aus Schritt 1 ist nicht unter **Autorisierte Weiterleitungs-URIs** eingetragen (`redirect_uri_mismatch`). Fügen Sie sie exakt hinzu und warten Sie einige Minuten. |
   | Client secret | Der Schlüssel gehört nicht zu diesem Client (`invalid_client`). Fügen Sie ihn erneut ein oder fügen Sie einen neuen hinzu. |

   Der Test verwendet die Eingaben im Formular, Sie können also vor dem Speichern testen.
3. Aktivieren Sie **Show "Continue with Google" on the login page** („Continue with Google“ auf der Anmeldeseite anzeigen).
4. Klicken Sie auf **Save**.

Ab diesem Moment zeigt die Karte **Active on the login page** an, und die Schaltfläche **Continue with Google** erscheint auf der Anmeldeseite Ihrer Instanz.

## Schritt 6: Benutzer hinzufügen

SecureAI **legt bei der ersten Anmeldung keine Konten automatisch an**: Jede Person, die sich mit Google anmelden soll, muss in SecureAI existieren und aktiv sein, und zwar mit **derselben E-Mail-Adresse** wie ihr Google Workspace-Konto (Groß- und Kleinschreibung spielen keine Rolle; `+`-Aliasse werden nicht akzeptiert).

- **Bestehende Benutzer**: Personen, die bereits ein SecureAI-Konto haben (auch mit Passwort), werden nicht neu angelegt. Sie können sich weiterhin mit ihrem Passwort anmelden und zusätzlich mit Google.
- **Neue reine SSO-Benutzer**: Wählen Sie unter **Admin → IAM Verwaltung → Benutzerverwaltung → Benutzer hinzufügen** die Authentifizierungsmethode **Geschäftskonto / SSO**. Der Benutzer erhält keine E-Mail zum Erstellen eines Passworts und meldet sich direkt über **Continue with Google** an.

Wird ein Benutzer in SecureAI deaktiviert, kann er sich auch nicht mehr über SSO anmelden.

## Anmeldung testen

1. Öffnen Sie die Anmeldeseite Ihrer Instanz in einem Inkognito-Fenster.
2. Klicken Sie auf **Continue with Google**.
3. Wählen Sie Ihr Google Workspace-Konto aus.
4. Google leitet Sie angemeldet zu SecureAI zurück.

Die Anmeldung mit Passwort funktioniert weiterhin: Das Aktivieren von SSO schaltet sie nicht ab.

## Integration deaktivieren oder entfernen

- Um die Schaltfläche auszublenden, die Konfiguration aber zu behalten, schalten Sie den Schalter aus und speichern Sie.
- Um sie zu löschen, verwenden Sie **Remove configuration**. Wenn für Ihre Instanz zuvor SSO von Hiper AI konfiguriert war, gilt diese Konfiguration wieder.

## Clientschlüssel rotieren

1. Öffnen Sie in Google Cloud den OAuth-Client und klicken Sie auf **Secret hinzufügen** (*Add secret*) (der alte Schlüssel funktioniert weiterhin).
2. Fügen Sie in SecureAI den neuen Wert in **Client secret** ein, klicken Sie auf **Test connection** und dann auf **Save**. Bleibt das Feld leer, wird der aktuelle Schlüssel beibehalten.
3. Sobald Sie bestätigt haben, dass die Anmeldung funktioniert, deaktivieren und löschen Sie den alten Schlüssel in Google Cloud.

Die Änderung gilt sofort, ohne aktive Sitzungen zu beenden.

## Wenn für Ihre Instanz bereits SSO von Hiper AI konfiguriert wurde

Bei Instanzen, für die Hiper AI Google-SSO auf Anfrage konfiguriert hat, zeigt die Karte **Configured by Hiper AI** an. Diese Konfiguration funktioniert weiterhin. Wenn Sie unter Integrationen Ihre eigene speichern, ersetzt sie die bisherige; entfernen Sie Ihre später wieder, gilt die vorherige erneut.

## Fehlerbehebung

Anmeldefehler werden auf der SecureAI-Anmeldeseite angezeigt (auf Englisch):

| Meldung in SecureAI | Ursache und Lösung |
|---|---|
| "User not found in SecureAI database." | Es gibt kein SecureAI-Konto mit dieser E-Mail-Adresse. Legen Sie es an (Schritt 6). |
| "This account is not allowed to sign in here…" | Das Konto gehört zu keiner der **Allowed email domains**, oder es ist ein privates Google-Konto (ohne Workspace). Fügen Sie die Domain hinzu oder verwenden Sie das Firmenkonto. |
| "Your identity provider has not verified this email address." | Google hat die E-Mail-Adresse nicht als verifiziert markiert, oder sie enthält Zeichen, die SecureAI nicht akzeptiert (zum Beispiel einen `+`-Alias). |
| "This sign-in method is not enabled for your organization." | Die Integration ist deaktiviert oder unvollständig. Prüfen Sie die Karte unter Integrationen. |
| "Your identity provider did not complete the sign-in…" | Google hat einen Fehler zurückgegeben, zum Beispiel weil der Benutzer abgebrochen hat. |
| "Single sign-on could not be completed…" | Der Codeaustausch ist fehlgeschlagen, meist weil der Schlüssel ersetzt oder gelöscht wurde. Verwenden Sie **Test connection**. |
| "The sign-in session expired or was not started from this browser…" | Es sind mehr als 10 Minuten vergangen, oder die Anmeldung wurde in einem anderen Tab/Browser gestartet. Versuchen Sie es erneut von der Anmeldeseite aus. |

Von Google angezeigte Fehler (vor der Rückkehr zu SecureAI):

- **Fehler 400: redirect_uri_mismatch**: Die Weiterleitungs-URI des Clients entspricht nicht exakt der aus Schritt 1. Korrigieren Sie sie unter **Autorisierte Weiterleitungs-URIs** (nicht unter JavaScript-Quellen).
- **Fehler 403: org_internal**: Die App ist **Intern**, und das Konto gehört nicht zu der Google-Cloud-Organisation, der das Projekt gehört. Das passiert auch, wenn Ihr Unternehmen mehr als eine Google-Organisation hat (zum Beispiel `company.com` und `company.ai`) und der OAuth-Client in einem Projekt der jeweils anderen erstellt wurde: Erstellen Sie ihn in einem Projekt der Organisation, zu der Ihre Nutzer gehören (die Projektauswahl der Konsole zeigt die Organisation jedes Projekts an).
- **Fehler 401: invalid_client / deleted_client**: Der OAuth-Client existiert nicht oder wurde gelöscht. Erstellen Sie einen neuen und aktualisieren Sie SecureAI.
- **„Zugriff blockiert: Ihr Administrator hat diese App nicht als vertrauenswürdig eingestuft“** (*Access blocked: your administrator has not trusted this app*): Die App-Zugriffssteuerung Ihres Workspace blockiert Drittanbieter-Apps. Markieren Sie die Client-ID in der Google Admin-Konsole (**Sicherheit → Zugriffs- und Datenkontrolle → API-Steuerung → Zugriff durch Drittanbieter-Apps verwalten**; *Security → Access and data control → API controls → Manage third-party app access*) als **Vertrauenswürdig** (*Trusted*).

Wenn Sie Hilfe benötigen, wenden Sie sich über **Support erhalten** in Ihrem Profilmenü an den Support und geben Sie die Client-ID und die Fehlermeldung an. **Senden Sie niemals den Clientschlüssel.**

## Weitere Ressourcen

- [OAuth 2.0 in Google Cloud einrichten](https://support.google.com/cloud/answer/6158849)
- [OpenID Connect bei Google](https://developers.google.com/identity/openid-connect/openid-connect)
- [Festlegen, welche Drittanbieter-Apps auf Google Workspace-Daten zugreifen dürfen](https://support.google.com/a/answer/7281227)