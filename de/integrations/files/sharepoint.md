---
sidebar_position: 2
title: "SharePoint & OneDrive — Add from SharePoint"
sidebar_label: "SharePoint & OneDrive"
description: "Ermöglichen Sie Ihren Benutzern, Dateien aus SharePoint-Websites und OneDrive im SecureAI-Chat anzuhängen. Self-Service-Einrichtung mit Ihrer eigenen App-Registrierung in Microsoft Entra ID."
---

# SharePoint & OneDrive — Add from SharePoint

Mit dieser Integration hängen Ihre Benutzer Dateien aus **SharePoint-Websites** (einschließlich Teams-Websites), aus **OneDrive** und aus **Mit mir geteilt** direkt im Chat an, über die Option **Add from SharePoint** der Schaltfläche zum Anhängen.

Die Einrichtung erfolgt per **Self-Service**: Ein Administrator Ihrer Organisation registriert SecureAI als Anwendung in **Ihrem eigenen Microsoft-Entra-ID-Verzeichnis** und trägt die Bezeichner unter **Admin → Integrations → Files** ein. Es ist weder ein Ticket noch eine Wartezeit auf Hiper AI nötig: Die Option erscheint im Chat, sobald Sie die Konfiguration speichern.

Geschätzte Dauer: 10 Minuten.

## So funktioniert es

1. Der Benutzer klickt auf **Attach → Add from SharePoint**. Beim ersten Mal fordert Microsoft ihn auf, sich mit **seinem eigenen Microsoft-365-Konto** anzumelden.
2. Der SecureAI-Explorer wird über Microsoft Graph geöffnet: Websites, Bibliotheken, Ordner, Suche und für den Benutzer freigegebene Dateien. Der Benutzer wählt eine oder mehrere Dateien aus.
3. Der Browser des Benutzers lädt **nur die ausgewählten Dateien** mit dem Token des Benutzers herunter und hängt sie an die Nachricht an.
4. Die Datei durchläuft denselben Weg wie jeder Anhang: Sie **durchläuft die DLP** und die Richtlinien Ihrer Organisation, bevor sie ein Modell erreicht.

<Info>
**Delegierte Berechtigungen, niemals Anwendungsberechtigungen.** SecureAI handelt immer **im Namen des angemeldeten Benutzers**: Ein Benutzer sieht und hängt nur an, was er in SharePoint bereits öffnen kann. Die Anwendung ist eine „Single-Page-Anwendung" (SPA) ohne Client-Secret, und SecureAI liest nichts im Hintergrund.
</Info>

## Voraussetzungen

- Ein Microsoft-365-Abonnement, das **SharePoint Online** enthält (zum Beispiel Business Basic, Business Standard, E3 oder E5). Ein Entra-ID-Verzeichnis ohne diese Lizenz hat keine SharePoint-Websites und kein OneDrive: Die Anmeldung funktioniert, aber es gibt keine Dateien zum Anhängen.
- Eine Entra-ID-Rolle, die das Registrieren von Anwendungen und das **Erteilen der Administratorzustimmung** für Microsoft-Graph-Berechtigungen erlaubt (zum Beispiel **Cloudanwendungsadministrator** oder **Globaler Administrator**).
- Administratorzugriff auf SecureAI mit der Berechtigung **Administrator** für den Bereich **Integrations**.
- Ein SecureAI-Tarif, der **Attach from Drive / SharePoint** enthält. Ohne ihn können Sie die Konfiguration vorbereiten, aber die Benutzer sehen die Option nicht.

## Schritt 1: Umleitungs-URI aus SecureAI kopieren

1. Melden Sie sich als Administrator bei SecureAI an.
2. Wechseln Sie zu **Admin → Integrations** und filtern Sie nach der Kategorie **Files**.
3. Klicken Sie auf der Karte **SharePoint & OneDrive** auf **Connect integration**.
4. Klicken Sie im Abschnitt **1. Register SecureAI in Microsoft Entra ID** neben dem **Redirect URI** auf **Copy**.

<div class="mac-window">
  ![Redirect URI im SecureAI-Seitenbereich](/img/files/sharepoint/1%20-%20SharePoint.png)
</div>

Der URI ist die Adresse Ihrer Instanz, zum Beispiel `https://<ihr-unternehmen>.hiperai.ai`. Verwenden Sie immer den URI, den Ihre Instanz anzeigt: Er muss exakt übereinstimmen.

## Schritt 2: Anwendung in Entra ID registrieren

1. Öffnen Sie das [Microsoft Entra Admin Center](https://entra.microsoft.com) und wechseln Sie zu **Identität → Anwendungen → App-Registrierungen** (Identity → Applications → App registrations).
2. Klicken Sie auf **Neue Registrierung** (New registration).

<div class="mac-window">
  ![App-Registrierungen → Neue Registrierung](/img/files/sharepoint/2%20-%20SharePoint.jpg)
</div>

3. Füllen Sie aus:
   - **Name**: zum Beispiel `SecureAI — Add from SharePoint`.
   - **Unterstützte Kontotypen** (Supported account types): **Nur Konten in diesem Organisationsverzeichnis** (Accounts in this organizational directory only; einzelner Mandant).
   - **Umleitungs-URI** (Redirect URI): Wählen Sie in der Dropdownliste **Single-Page-Anwendung (SPA)** (Single-page application) und fügen Sie den URI ein, den Sie in Schritt 1 kopiert haben.
4. Klicken Sie auf **Registrieren** (Register).


<Warning>
Die Plattform muss **Single-Page-Anwendung (SPA)** sein, nicht **Web**. Bei **Web** schlägt die Anmeldung mit dem Fehler `AADSTS9002326` fehl. Wenn Sie sie bereits als Web registriert haben, wechseln Sie zu **Authentifizierung** (Authentication), fügen Sie eine Plattform **Single-Page-Anwendung** mit demselben URI hinzu und entfernen Sie die Web-Plattform.
</Warning>

5. Kopieren Sie auf der **Übersicht** (Overview) der Anwendung die **Anwendungs-ID (Client)** (Application (client) ID) und die **Verzeichnis-ID (Mandant)** (Directory (tenant) ID). Es muss kein Client-Secret erstellt werden.

<div class="mac-window">
  ![Anwendungs-ID und Verzeichnis-ID](/img/files/sharepoint/4%20-%20SharePoint.jpg)
</div>

## Schritt 3: Microsoft-Graph-Berechtigungen hinzufügen

1. Wechseln Sie in der Anwendung zu **API-Berechtigungen → Berechtigung hinzufügen → Microsoft Graph → Delegierte Berechtigungen** (API permissions → Add a permission → Microsoft Graph → Delegated permissions).
2. Suchen und markieren Sie:
   - `Files.Read.All` — die Dateien lesen, auf die der Benutzer Zugriff hat.
   - `Sites.Read.All` — die SharePoint-Websites auflisten und durchsuchen, auf die der Benutzer Zugriff hat.
3. Klicken Sie auf **Berechtigungen hinzufügen** (Add permissions). `User.Read` ist standardmäßig bereits hinzugefügt; belassen Sie sie.

<div class="mac-window">
  ![Delegierte Berechtigungen von Microsoft Graph](/img/files/sharepoint/5%20-%20SharePoint.jpg)
</div>

## Schritt 4: Administratorzustimmung erteilen

1. Klicken Sie unter **API-Berechtigungen** auf **Administratorzustimmung für &lt;Ihre Organisation&gt; erteilen** (Grant admin consent for &lt;org&gt;) und bestätigen Sie mit **Ja**.
2. Alle drei Berechtigungen müssen den Status **Gewährt für &lt;Ihre Organisation&gt;** haben.

<div class="mac-window">
  ![Administratorzustimmung erteilt](/img/files/sharepoint/6%20-%20SharePoint.jpg)
</div>

Ohne diesen Schritt würde jeder Benutzer eine Zustimmungsanfrage sehen (oder einen Fehler `AADSTS65001`, wenn Ihre Organisation die Zustimmung durch Benutzer nicht erlaubt).

## Schritt 5: In SecureAI eintragen, testen und aktivieren

1. Kehren Sie zum Seitenbereich **SharePoint & OneDrive** in SecureAI zurück.
2. Fügen Sie unter **2. Paste the identifiers** die **Directory (tenant) ID** und die **Application (client) ID** ein.
3. Unter **3. Test it**:
   - **Test connection** prüft von den SecureAI-Servern aus, dass das Verzeichnis existiert.
   - **Try signing in** öffnet dasselbe Microsoft-Fenster, das Ihre Benutzer sehen werden: Melden Sie sich mit Ihrem Konto an. SecureAI bestätigt, dass der Umleitungs-URI vom Typ SPA ist, dass für `Files.Read.All` und `Sites.Read.All` eine Zustimmung vorliegt und dass Microsoft Graph antwortet.

<div class="mac-window">
  ![Grüne Tests im SecureAI-Seitenbereich](/img/files/sharepoint/7%20-%20SharePoint.png)
</div>

4. Lassen Sie unter **4.** die Option **Show "Add from SharePoint" to users** aktiviert und klicken Sie auf **Save**.

Die Karte wechselt zu **Available in the chat**.

## Schritt 6: So verwenden Ihre Benutzer es

1. Im Chat klickt der Benutzer auf die Schaltfläche zum **Anhängen** und wählt **Add from SharePoint**.

<div class="mac-window">
  ![Add from SharePoint im Anhängen-Menü](/img/files/sharepoint/8%20-%20SharePoint.png)
</div>

2. Beim ersten Mal klickt er auf **Sign in with Microsoft** und wählt sein Konto der Organisation.
3. Er navigiert durch **Sites**, **Shared** oder die Suche, wählt eine oder mehrere Dateien aus und klickt auf **Add**.


4. Die Dateien erscheinen an die Nachricht angehängt, mit dem SharePoint-Symbol.

## Einschränken, wer es verwenden darf (optional)

Damit nur bestimmte Benutzer oder Gruppen **Add from SharePoint** verwenden können:

1. Wechseln Sie in Entra zu **Unternehmensanwendungen** (Enterprise applications) und öffnen Sie die von Ihnen registrierte Anwendung.
2. Aktivieren Sie unter **Eigenschaften** (Properties) die Option **Zuweisung erforderlich?** (Assignment required?) und speichern Sie.
3. Weisen Sie unter **Benutzer und Gruppen** (Users and groups) die berechtigten Benutzer oder Gruppen zu.

Ein nicht zugewiesener Benutzer erhält bei der Anmeldung den Fehler `AADSTS50105` und kann keine Dateien anhängen.

## Fehlerbehebung

| Was Sie sehen | Ursache | Was zu tun ist |
|---|---|---|
| `AADSTS50011` — der Umleitungs-URI stimmt nicht überein | Der URI aus Schritt 1 ist nicht registriert | Fügen Sie ihn unter **Authentifizierung → Single-Page-Anwendung** hinzu |
| `AADSTS9002326` | Der URI ist als **Web** registriert | Verschieben Sie ihn zu **Single-Page-Anwendung** |
| `AADSTS65001` — Zustimmung fehlt | Die Administratorzustimmung wurde nicht erteilt | Schritt 4 |
| `AADSTS700016` — Anwendung nicht gefunden | Falsche Anwendungs-ID oder Verzeichnis-ID | Kopieren Sie sie erneut aus der **Übersicht** |
| `AADSTS50105` | Der Benutzer ist der Anwendung nicht zugewiesen | Weisen Sie ihn zu, oder deaktivieren Sie **Zuweisung erforderlich?** |
| **Try signing in**: „These delegated permissions are missing" (Diese delegierten Berechtigungen fehlen) | `Files.Read.All` oder `Sites.Read.All` fehlt, oder deren Zustimmung | Schritte 3 und 4 |
| **Try signing in**: „this Microsoft 365 directory has no SharePoint Online license" (dieses Microsoft-365-Verzeichnis hat keine SharePoint-Online-Lizenz) | Das Verzeichnis hat kein Abonnement mit SharePoint Online | Verwenden Sie das Microsoft-365-Verzeichnis Ihrer Organisation, oder weisen Sie ein Abonnement zu, das SharePoint Online enthält |
| Der Explorer meldet, dass Ihre Organisation kein SharePoint Online hat | Derselbe Fall, aus Sicht eines Benutzers | Wie in der vorherigen Zeile |
| Der Benutzer sieht keine Websites, nur „Shared" | Der Benutzer ist in keiner Website Mitglied | Erwartetes Verhalten: Er sieht nur, was er bereits öffnen kann |
| Der Benutzer sieht **Add from SharePoint** nicht | Die Integration ist deaktiviert, nicht gespeichert, oder der Tarif enthält sie nicht | Prüfen Sie die Karte unter **Admin → Integrations → Files** |

## Häufig gestellte Fragen

**Was kann SecureAI lesen?** Nur das, was der angemeldete Benutzer bereits lesen kann, und nur, wenn er im Explorer eine Datei auswählt. Die Berechtigungen sind delegiert: SecureAI hat keinen Zugriff „als Anwendung" auf Ihr SharePoint.

**Funktionieren Richtlinien für bedingten Zugriff?** Ja. Die Anmeldung ist eine normale Microsoft-365-Anmeldung und berücksichtigt MFA, verwaltete Geräte und Ihre übrigen Richtlinien.

**Wie deaktiviere ich es?** Deaktivieren Sie **Show "Add from SharePoint" to users** und speichern Sie, oder klicken Sie auf **Remove configuration**. Um auch bereits ausgestellte Token zu widerrufen, löschen Sie die App-Registrierung in Entra ID oder deaktivieren Sie die Anmeldung für Ihre Unternehmensanwendung.

**Hiper AI hatte SharePoint bereits für mich konfiguriert. Muss ich etwas tun?** Nein. Solange Sie keine eigene Konfiguration speichern, zeigt die Karte **Configured by Hiper AI** an und alles funktioniert unverändert weiter. Wenn Sie Ihre eigene speichern, ersetzt sie diese.
