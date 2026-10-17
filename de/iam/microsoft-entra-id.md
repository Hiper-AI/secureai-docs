---
sidebar_position: 3
title: "Microsoft Entra ID (SSO)"
sidebar_label: "Microsoft Entra ID (SSO)"
---

# Microsoft Entra ID (SSO)-Integration

Mit dieser Integration melden sich die Benutzer Ihrer Organisation mit ihrem Microsoft-Geschäftskonto bei SecureAI an (Schaltfläche **Continue with Microsoft**). Die Einrichtung erfolgt **in Eigenregie**: Ein Administrator Ihrer Organisation registriert SecureAI in Ihrem eigenen Microsoft Entra ID-Mandanten (ehemals Azure Active Directory) und trägt die Angaben unter **Admin → Integrationen** ein. Sie müssen kein Ticket eröffnen und nicht auf Hiper AI warten: Die Schaltfläche erscheint auf Ihrer Anmeldeseite, sobald Sie speichern.

Geschätzter Zeitaufwand: 10 Minuten.

## Voraussetzungen

- Eine Microsoft Entra-Rolle, die App-Registrierungen erstellen darf (zum Beispiel **Anwendungsentwickler** oder **Anwendungsadministrator**). Für die Administratorzustimmung (Schritt 4) ist **Cloudanwendungsadministrator**, **Anwendungsadministrator** oder **Globaler Administrator** erforderlich.
- Administratorzugriff auf SecureAI mit der Berechtigung **Administrator** für den Bereich **Integrationen**.

## So funktioniert es

1. Sie erstellen in Ihrem Entra ID-Mandanten eine **App-Registrierung**. SecureAI verwendet OpenID Connect (Autorisierungscodefluss) mit einem **geheimen Clientschlüssel** (Client Secret).
2. In SecureAI tragen Sie die **Verzeichnis-ID (Mandant)**, die **Anwendungs-ID (Client)** und den **Wert des geheimen Clientschlüssels** ein. Der Schlüssel wird verschlüsselt gespeichert und nie wieder angezeigt.
3. Wenn ein Benutzer auf **Continue with Microsoft** klickt, authentifiziert Microsoft ihn (unter Anwendung Ihrer MFA- und Richtlinien für bedingten Zugriff), und SecureAI lässt ihn herein, wenn seine E-Mail-Adresse zu einem **aktiven** SecureAI-Konto passt.

SecureAI akzeptiert nur Tokens, die von **Ihrem** Mandanten ausgestellt wurden: Die Anmeldung ist an Ihr Verzeichnis gebunden, und die mehrinstanzenfähigen Endpunkte (`common` / `organizations`) werden nie verwendet.

## Schritt 1: Umleitungs-URI aus SecureAI kopieren

1. Melden Sie sich als Administrator bei SecureAI an.
2. Gehen Sie zu **Admin → Integrationen** und filtern Sie nach der Kategorie **IAM**.
3. Klicken Sie auf der Karte **Microsoft Entra ID (SSO)** auf **Integration verbinden** (oder auf **Neu konfigurieren**, wenn die Karte **Configured by Hiper AI** anzeigt).
4. Klicken Sie im Abschnitt **1. Register SecureAI in Microsoft Entra ID** neben der **Redirect URI** (Umleitungs-URI) auf **Copy**.

Die URI sieht so aus (mit der Domain Ihrer Instanz):

```
https://<your-company>.hiperai.ai/api/auth/azure/callback
```

Verwenden Sie immer die URI, die Ihre Instanz anzeigt: Sie muss Zeichen für Zeichen übereinstimmen, einschließlich `https://`.

Lassen Sie dieses Fenster geöffnet; Sie kehren später zurück, um die Angaben einzufügen.

## Schritt 2: Anwendung in Microsoft Entra ID registrieren

1. Öffnen Sie das [Microsoft Entra Admin Center](https://entra.microsoft.com) (oder das [Azure-Portal](https://portal.azure.com) → **Microsoft Entra ID**).

<div class="mac-window">
  ![Searching for Microsoft Entra ID in the Azure portal](/img/microsoft%20entraid%20sso%20images/1%20-%20azure.png)
</div>

2. Gehen Sie zu **Anwendungen → App-Registrierungen** (*Applications → App registrations*).

<div class="mac-window">
  ![App registrations menu](/img/microsoft%20entraid%20sso%20images/2%20-%20azure.png)
</div>

3. Klicken Sie auf **+ Neue Registrierung** (*+ New registration*).

<div class="mac-window">
  ![New registration button](/img/microsoft%20entraid%20sso%20images/3%20-%20azure.png)
</div>

4. Füllen Sie das Formular aus:
   - **Name**: ein aussagekräftiger Name, zum Beispiel `SecureAI SSO`. Benutzer sehen ihn auf dem Zustimmungsbildschirm.
   - **Unterstützte Kontotypen** (*Supported account types*): **Nur Konten in diesem Organisationsverzeichnis (einzelner Mandant)** (*Accounts in this organizational directory only (Single tenant)*).
   - **Umleitungs-URI** (*Redirect URI*): Plattform **Web** (nicht „Single-Page-Webanwendung“), und fügen Sie die URI ein, die Sie in Schritt 1 kopiert haben.
5. Klicken Sie auf **Registrieren** (*Register*).

<div class="mac-window">
  ![Application registration form](/img/microsoft%20entraid%20sso%20images/4%20-%20azure.png)
</div>

6. Kopieren Sie auf der Seite **Übersicht** (*Overview*) der Anwendung:
   - **Anwendungs-ID (Client)** (*Application (client) ID*) – eine GUID wie `b96ee19f-5a15-4a85-b936-xxxxxxxxxxxx`.
   - **Verzeichnis-ID (Mandant)** (*Directory (tenant) ID*) – eine weitere GUID, etwa `155812d2-1112-46c8-bf52-xxxxxxxxxxxx`.

## Schritt 3: Geheimen Clientschlüssel erstellen

1. Öffnen Sie im Menü der Anwendung **Zertifikate & Geheimnisse** (*Certificates & secrets*).

<div class="mac-window">
  ![Certificates & secrets menu](/img/microsoft%20entraid%20sso%20images/5%20-%20azure.png)
</div>

2. Klicken Sie unter **Geheime Clientschlüssel** (*Client secrets*) auf **+ Neuer geheimer Clientschlüssel** (*+ New client secret*).
3. Geben Sie eine Beschreibung ein (zum Beispiel `SecureAI SSO`) und wählen Sie eine Gültigkeitsdauer (Microsoft empfiehlt weniger als 12 Monate; das Maximum sind 24).
4. Klicken Sie auf **Hinzufügen** (*Add*).

<div class="mac-window">
  ![Add a client secret](/img/microsoft%20entraid%20sso%20images/6%20-%20azure.png)
</div>

5. Kopieren Sie **sofort** die Spalte **Wert** (*Value*) (sie sieht etwa so aus: `plm8Q~xxxxxxxx…`). Sie wird nur ein einziges Mal angezeigt.

<div class="mac-window">
  ![Client secret value](/img/microsoft%20entraid%20sso%20images/7%20-%20azure.png)
</div>

<Warning>
Kopieren Sie den **Wert** (*Value*), nicht die **Geheime ID** (*Secret ID*, eine GUID). Wenn Sie die geheime ID einfügen, lehnt SecureAI sie beim Speichern ab.
</Warning>

Notieren Sie sich das Ablaufdatum: Wenn der Schlüssel abläuft, funktioniert die Microsoft-Anmeldung nicht mehr, bis Sie einen neuen eintragen (siehe den Abschnitt „Geheimen Clientschlüssel rotieren“ weiter unten).

## Schritt 4: API-Berechtigungen prüfen

SecureAI fordert die delegierten Microsoft Graph-Berechtigungen `openid`, `profile`, `email` und `User.Read` an (letztere, um das Profilfoto des Benutzers zu lesen). `User.Read` wird neuen Registrierungen standardmäßig hinzugefügt.

1. Öffnen Sie im Menü der Anwendung **API-Berechtigungen** (*API permissions*).
2. Prüfen Sie, dass **Microsoft Graph → Delegierte Berechtigungen** `User.Read` enthält und, falls Sie sie explizit aufführen möchten, `openid`, `profile` und `email` (über **+ Berechtigung hinzufügen → Microsoft Graph → Delegierte Berechtigungen**).

<div class="mac-window">
  ![Add delegated permissions](/img/microsoft%20entraid%20sso%20images/8%20-%20azure.png)
</div>

3. Klicken Sie auf **Administratorzustimmung für [Ihre Organisation] erteilen** (*Grant admin consent for [your organization]*) und bestätigen Sie.

<div class="mac-window">
  ![Grant admin consent](/img/microsoft%20entraid%20sso%20images/9%20-%20azure.png)
</div>

Wenn Ihr Mandant Benutzern nicht erlaubt, Anwendungen selbst zuzustimmen (in Unternehmen eine übliche Einstellung), ist dieser Schritt Pflicht: Andernfalls sehen Benutzer bei der Anmeldung den Hinweis „Genehmigung durch Administrator erforderlich“ (*Need admin approval*).

## Schritt 5: Angaben in SecureAI eintragen und testen

Kehren Sie zu **Admin → Integrationen → Microsoft Entra ID (SSO)** zurück:

1. Füllen Sie unter **2. Paste the app registration details** Folgendes aus:
   - **Directory (tenant) ID**: die GUID aus Schritt 2 (eine verifizierte Domain Ihres Mandanten, etwa `contoso.onmicrosoft.com`, funktioniert ebenfalls).
   - **Application (client) ID**: die GUID aus Schritt 2.
   - **Client secret value**: der Wert aus Schritt 3.
   - **Allowed email domains** (zulässige E-Mail-Domains; optional, empfohlen): die E-Mail-Domains Ihrer Organisation, durch Kommas getrennt, zum Beispiel `contoso.com, contoso.co.uk`. Nur diese Adressen können sich mit Microsoft anmelden. Bleibt das Feld leer, wird jedes Konto Ihres Mandanten akzeptiert, das in SecureAI existiert.
2. Klicken Sie unter **3. Test the connection** auf **Test connection**. SecureAI fragt bei Microsoft nach (ohne jemanden anzumelden) und prüft:

   | Prüfung | Wenn sie fehlschlägt |
   |---|---|
   | Directory (tenant) ID | Microsoft kennt diesen Mandanten nicht (`AADSTS90002`). Kopieren Sie die Verzeichnis-ID von der Seite „Übersicht“. |
   | Application (client) ID | Im Mandanten gibt es keine solche Anwendung (`AADSTS700016`). Prüfen Sie die Client-ID und ob die App im selben Mandanten liegt. |
   | Client secret | Der Schlüssel ist ungültig (`AADSTS7000215`) oder abgelaufen (`AADSTS7000222`). Fügen Sie den **Wert** ein oder erstellen Sie einen neuen Schlüssel. |
   | Redirect URI registered on the app | Die URI aus Schritt 1 ist nicht in der App-Registrierung eingetragen (der Fehler `AADSTS50011`, den ein Benutzer bei der Anmeldung erhalten würde). Öffnen Sie in der App **Authentifizierung → Plattform hinzufügen → Web** (*Authentication → Add a platform → Web*), fügen Sie sie exakt ein und speichern Sie. |

   Der Test verwendet die Eingaben im Formular, Sie können also vor dem Speichern testen. Wenn Ihr Mandant eine Richtlinie für bedingten Zugriff hat, die reine App-Tokens blockiert, wird der Schlüssel möglicherweise als „could not be verified automatically“ (konnte nicht automatisch überprüft werden) angezeigt: Das ist kein Fehler – bestätigen Sie es mit einer echten Anmeldung.

   <Note>
   Der Test bestätigt, dass die URI registriert ist, aber nicht, ob sie unter der Plattform **Web** oder unter **Single-Page-Webanwendung (SPA)** registriert wurde. Als SPA registriert, besteht sie den Test, und die Anmeldung schlägt mit „Single sign-on could not be completed“ fehl. Prüfen Sie, dass die URI unter **Authentifizierung** bei **Web** aufgeführt ist.
   </Note>

3. Prüfen Sie, dass **Show "Continue with Microsoft" on the login page** („Continue with Microsoft“ auf der Anmeldeseite anzeigen) aktiviert ist (beim ersten Mal ist es bereits aktiviert).
4. Klicken Sie auf **Save**.

Ab diesem Moment zeigt die Karte **Active on the login page** an, und die Schaltfläche **Continue with Microsoft** erscheint auf der Anmeldeseite Ihrer Instanz.

## Schritt 6: Benutzer hinzufügen

SecureAI **legt bei der ersten Anmeldung keine Konten automatisch an**: Jede Person, die sich mit Microsoft anmelden soll, muss in SecureAI existieren und aktiv sein. Die E-Mail-Adresse des SecureAI-Kontos muss mit der E-Mail-Adresse des Benutzers in Entra ID übereinstimmen (Attribut **E-Mail** (*Mail*); ist es leer, wird der **Benutzerprinzipalname (UPN)** verwendet). Groß- und Kleinschreibung spielen keine Rolle.

- **Bestehende Benutzer**: Personen, die bereits ein SecureAI-Konto haben (auch mit Passwort), werden nicht neu angelegt. Sie können sich weiterhin mit ihrem Passwort anmelden und zusätzlich mit Microsoft.
- **Neue reine SSO-Benutzer**: Wählen Sie unter **Admin → IAM Verwaltung → Benutzerverwaltung → Benutzer hinzufügen** die Authentifizierungsmethode **Geschäftskonto / SSO**. Der Benutzer erhält keine E-Mail zum Erstellen eines Passworts und meldet sich direkt über **Continue with Microsoft** an.
- **Viele Benutzer**: Sie können sie mit SCIM automatisch aus Entra ID bereitstellen und deprovisionieren.

Wird ein Benutzer in SecureAI deaktiviert (manuell oder per SCIM), kann er sich auch nicht mehr über SSO anmelden.

## Anmeldung testen

1. Öffnen Sie die Anmeldeseite Ihrer Instanz in einem Inkognito-Fenster.
2. Klicken Sie auf **Continue with Microsoft**.
3. Wählen Sie Ihr Geschäftskonto aus und schließen Sie bei Aufforderung die MFA ab.
4. Microsoft leitet Sie angemeldet zu SecureAI zurück.

Die Anmeldung mit Passwort funktioniert weiterhin: Das Aktivieren von SSO schaltet sie nicht ab.

## Integration deaktivieren oder entfernen

- Um die Schaltfläche auszublenden, die Konfiguration aber zu behalten, schalten Sie den Schalter aus und speichern Sie.
- Um sie zu löschen, verwenden Sie **Remove configuration**. Wenn für Ihre Instanz zuvor SSO von Hiper AI konfiguriert war, gilt diese Konfiguration wieder.

## Geheimen Clientschlüssel rotieren

Bevor der Schlüssel abläuft:

1. Erstellen Sie in Entra ID einen neuen geheimen Clientschlüssel (Schritt 3), ohne den alten zu löschen.
2. Öffnen Sie in SecureAI die Integration, fügen Sie den neuen Wert in **Client secret value** ein, klicken Sie auf **Test connection** und dann auf **Save**. Bleibt das Feld leer, wird der aktuelle Schlüssel beibehalten.
3. Sobald Sie bestätigt haben, dass die Anmeldung funktioniert, löschen Sie den alten Schlüssel in Entra ID.

Die Änderung gilt sofort, ohne aktive Sitzungen zu beenden.

## Wenn für Ihre Instanz bereits SSO von Hiper AI konfiguriert wurde

Bei Instanzen, für die Hiper AI Microsoft-SSO auf Anfrage konfiguriert hat, zeigt die Karte **Configured by Hiper AI** an. Diese Konfiguration funktioniert weiterhin. Wenn Sie unter Integrationen Ihre eigene speichern, ersetzt sie die bisherige; entfernen Sie Ihre später wieder, gilt die vorherige erneut.

## Fehlerbehebung

Anmeldefehler werden auf der SecureAI-Anmeldeseite angezeigt (auf Englisch):

| Meldung in SecureAI | Ursache und Lösung |
|---|---|
| "User not found in SecureAI database." | Es gibt kein SecureAI-Konto mit dieser E-Mail-Adresse. Legen Sie es an (Schritt 6) oder prüfen Sie, ob die E-Mail-Adresse mit E-Mail/UPN in Entra ID übereinstimmt. |
| "This account is not allowed to sign in here…" | Die Domain der E-Mail-Adresse ist nicht unter **Allowed email domains** eingetragen, oder das Token stammt aus einem anderen Mandanten. |
| "This sign-in method is not enabled for your organization." | Die Integration ist deaktiviert oder unvollständig. Prüfen Sie die Karte unter Integrationen. |
| "Your identity provider did not complete the sign-in…" | Microsoft hat einen Fehler zurückgegeben: Der Benutzer hat abgebrochen, die Administratorzustimmung fehlt (Schritt 4), oder der Benutzer ist der Anwendung nicht zugewiesen. |
| "Single sign-on could not be completed…" | Der Codeaustausch ist fehlgeschlagen: meist ein abgelaufener oder ersetzter Schlüssel (verwenden Sie **Test connection**) oder eine Umleitungs-URI, die als **Single-Page-Webanwendung** statt als **Web** registriert wurde (verschieben Sie sie unter **Authentifizierung** zu **Web**). |
| "Your account is inactive…" | Das Konto ist in SecureAI deaktiviert. |
| "The sign-in session expired or was not started from this browser…" | Es sind mehr als 10 Minuten vergangen, oder die Anmeldung wurde in einem anderen Tab/Browser gestartet. Versuchen Sie es erneut von der Anmeldeseite aus. |

Von Microsoft angezeigte Fehler (vor der Rückkehr zu SecureAI):

- **AADSTS50011 – Die Umleitungs-URI stimmt nicht überein**: Die in Entra ID registrierte URI entspricht nicht exakt der, die SecureAI in Schritt 1 anzeigt (schon ein zusätzlicher Schrägstrich am Ende reicht, damit sie nicht übereinstimmt). **Test connection** erkennt das vor der ersten Anmeldung.
- **AADSTS65001 / „Genehmigung durch Administrator erforderlich“** (*Need admin approval*): Erteilen Sie die Administratorzustimmung (Schritt 4).
- **AADSTS50105 – Der angemeldete Benutzer ist keiner Rolle für die Anwendung zugewiesen**: Bei der Unternehmensanwendung ist **Zuweisung erforderlich?** (*Assignment required?*) auf **Ja** gesetzt. Weisen Sie den Benutzer oder eine Gruppe unter **Unternehmensanwendungen → SecureAI SSO → Benutzer und Gruppen** (*Enterprise applications → SecureAI SSO → Users and groups*) zu.
- **AADSTS7000215 / AADSTS7000222**: ungültiger oder abgelaufener Schlüssel. Tragen Sie einen neuen ein.

Wenn Sie Hilfe benötigen, wenden Sie sich über **Support erhalten** in Ihrem Profilmenü an den Support und geben Sie die Anwendungs-ID (Client), die Verzeichnis-ID und die Fehlermeldung an. **Senden Sie niemals den geheimen Clientschlüssel.**