---
sidebar_position: 1
title: "Google Drive — Add from Drive"
sidebarTitle: "Google Drive"
icon: "/img/icons/google-drive.svg"
sidebar_label: "Google Drive"
description: "Ermöglichen Sie Ihren Benutzern, Dateien aus Google Drive und aus freigegebenen Ablagen im SecureAI-Chat anzuhängen. Self-Service-Einrichtung mit Ihrem eigenen OAuth-Client in Google Cloud."
---

# Google Drive — Add from Drive

Mit dieser Integration hängen Ihre Benutzer Dateien aus **Google Drive** (Meine Ablage, Mit mir geteilt und **freigegebene Ablagen**) direkt im Chat an, über die Option **Add from Drive** der Schaltfläche zum Anhängen.

Die Einrichtung erfolgt per **Self-Service**: Ein Administrator Ihrer Organisation erstellt einen OAuth-Client und einen API-Schlüssel in **Ihrem eigenen Google-Cloud-Projekt** und trägt sie unter **Admin → Integrations → Files** ein. Es ist weder ein Ticket noch eine Wartezeit auf Hiper AI nötig: Die Option erscheint im Chat, sobald Sie die Konfiguration speichern.

Geschätzte Dauer: 10 Minuten.

## So funktioniert es

1. Der Benutzer klickt auf **Attach → Add from Drive**. Beim ersten Mal fordert Google ihn auf, sich mit **seinem eigenen Konto** anzumelden und SecureAI zu autorisieren.
2. Die **offizielle Google-Drive-Auswahl** (Google Picker) wird geöffnet. Der Benutzer wählt eine oder mehrere Dateien aus.
3. Der Browser des Benutzers lädt **nur die ausgewählten Dateien** mit dem Token des Benutzers herunter und hängt sie an die Nachricht an. Google-Dokumente werden in Office-Formate exportiert (Docs → `.docx`, Sheets → `.xlsx`, Slides → `.pptx`; alle übrigen als PDF).
4. Die Datei durchläuft denselben Weg wie jeder Anhang: Sie **durchläuft die DLP** und die Richtlinien Ihrer Organisation, bevor sie ein Modell erreicht.

<Info>
**SecureAI sieht nie Ihr gesamtes Drive.** Es wird der Bereich `drive.file` verwendet: SecureAI kann nur die Dateien lesen, die jeder Benutzer in der Auswahl auswählt, und sonst nichts. Es gibt kein Dienstkonto, keine domänenweite Delegierung und kein Lesen im Hintergrund: Ein Benutzer kann nur anhängen, was er in Drive bereits öffnen kann.
</Info>

## Voraussetzungen

- Ein Google-Cloud-Projekt **innerhalb der Organisation Ihres Google Workspace** sowie Berechtigungen, darin APIs zu aktivieren, die Google Auth Platform zu konfigurieren und Anmeldedaten zu erstellen (zum Beispiel die Rolle **Inhaber** oder **Bearbeiter** des Projekts).
- Administratorzugriff auf SecureAI mit der Berechtigung **Administrator** für den Bereich **Integrations**.
- Ein SecureAI-Tarif, der **Attach from Drive / SharePoint** enthält. Ohne ihn können Sie die Konfiguration vorbereiten, aber die Benutzer sehen die Option nicht.

## Schritt 1: Adressen aus SecureAI kopieren

1. Melden Sie sich als Administrator bei SecureAI an.
2. Wechseln Sie zu **Admin → Integrations** und filtern Sie nach der Kategorie **Files**.
3. Klicken Sie auf der Karte **Google Drive** auf **Connect integration**.

<div class="mac-window">
  ![Karten der Kategorie Files](/img/files/google-drive/1%20-%20Google%20Drive.png)
</div>

4. Im Abschnitt **1. Set up Google Cloud** finden Sie die beiden Werte, die Sie in Google Cloud benötigen, jeweils mit einer Schaltfläche **Copy**:
   - **Authorized JavaScript origin**: die Adresse Ihrer Instanz, zum Beispiel `https://<ihr-unternehmen>.hiperai.ai`.
   - **Website restrictions for the API key**: zwei Zeilen, die Adresse Ihrer Instanz mit `/*` am Ende und `https://docs.google.com/*`.

<div class="mac-window">
  ![Origin und Einschränkung im SecureAI-Seitenbereich](/img/files/google-drive/2%20-%20Google%20Drive.png)
</div>

Verwenden Sie immer die Werte, die Ihre Instanz anzeigt: Sie müssen exakt übereinstimmen, einschließlich `https://` und ohne abschließendes `/` bei der Origin.

<Note>
`https://docs.google.com/*` ist die Google-Auswahl selbst: Sie wird als Frame auf `docs.google.com` geöffnet und legt den API-Schlüssel von dort aus vor. Ohne diese Zeile öffnet sich die Auswahl mit dem Fehler **„The API developer key is invalid"**.
</Note>

## Schritt 2: Projekt auswählen und APIs aktivieren

1. Öffnen Sie die [Google-Cloud-Konsole](https://console.cloud.google.com) und wählen Sie in der Projektauswahl in der oberen Leiste ein Projekt Ihrer Organisation aus (oder erstellen Sie ein neues, zum Beispiel `SecureAI Drive`).
2. Wechseln Sie zu **APIs und Dienste → Bibliothek** (APIs & Services → Library), suchen Sie nach **Google Drive API** und klicken Sie auf **Aktivieren** (Enable).

<div class="mac-window">
  ![Google Drive API aktivieren](/img/files/google-drive/3%20-%20Google%20Drive.jpg)
</div>

3. Wiederholen Sie den Vorgang für die **Google Picker API**.

<div class="mac-window">
  ![Google Picker API aktivieren](/img/files/google-drive/4%20-%20Google%20Drive.jpg)
</div>

## Schritt 3: Zustimmungsbildschirm konfigurieren

1. Wechseln Sie zu **Google Auth Platform** (Menü **APIs und Dienste → OAuth-Zustimmungsbildschirm**, englisch „OAuth consent screen"). Wenn das Projekt sie noch nicht konfiguriert hat, klicken Sie auf **Jetzt starten** (Get started).
2. Füllen Sie **App-Name** (App name; zum Beispiel `SecureAI`) und **Support-E-Mail-Adresse für Nutzer** (User support email) aus.
3. Wählen Sie unter **Zielgruppe** (Audience) die Option **Intern** (Internal): Nur Konten Ihrer Google-Workspace-Organisation können die App autorisieren, und Google verlangt keine Verifizierung.
4. Geben Sie die Kontakt-E-Mail-Adresse an, akzeptieren Sie die Richtlinie zu Nutzerdaten und klicken Sie auf **Erstellen** (Create).

<div class="mac-window">
  ![Interne Zielgruppe in der Google Auth Platform](/img/files/google-drive/5%20-%20Google%20Drive.jpg)
</div>

Sie müssen keine Bereiche manuell hinzufügen: SecureAI fordert nur `drive.file` an, einen nicht sensiblen Bereich.

## Schritt 4: OAuth-Client erstellen

1. Klicken Sie unter **Google Auth Platform → Clients** auf **Client erstellen** (Create client).
2. Wählen Sie unter **Anwendungstyp** (Application type) die Option **Webanwendung** (Web application) und geben Sie einen Namen ein (zum Beispiel `SecureAI — Add from Drive`).
3. Klicken Sie unter **Autorisierte JavaScript-Quellen** (Authorized JavaScript origins) auf **URI hinzufügen** (Add URI) und fügen Sie die **Authorized JavaScript origin** ein, die Sie in Schritt 1 kopiert haben.
4. Lassen Sie die **Autorisierten Weiterleitungs-URIs** (Authorized redirect URIs) leer: Die Auswahl verwendet sie nicht.
5. Klicken Sie auf **Erstellen**.

<div class="mac-window">
  ![OAuth-Client vom Typ Webanwendung mit der Origin von SecureAI](/img/files/google-drive/6%20-%20Google%20Drive.jpg)
</div>

6. Kopieren Sie die **Client-ID** (Client ID; sie endet auf `.apps.googleusercontent.com`). Dieser Client benötigt kein Secret: Kopieren Sie es nicht und tragen Sie es nirgends ein.

<div class="mac-window">
  ![Erstellte Client-ID](/img/files/google-drive/7%20-%20Google%20Drive.jpg)
</div>

<Note>
Wenn Ihre Organisation in SecureAI bereits einen Google-Web-Client für die [Anmeldung mit Google Workspace](/de/iam/google-workspace) verwendet, können Sie ihn wiederverwenden: Fügen Sie die JavaScript-Origin zu demselben Client hinzu.
</Note>

## Schritt 5: API-Schlüssel erstellen und einschränken

1. Wechseln Sie zu **APIs und Dienste → Anmeldedaten** (Credentials) und klicken Sie auf **Anmeldedaten erstellen → API-Schlüssel** (Create credentials → API key).
2. Öffnen Sie den neu erstellten Schlüssel (**API-Schlüssel bearbeiten**, englisch „Edit API key"):
   - Wählen Sie unter **Anwendungsbeschränkungen** (Application restrictions) die Option **Websites** und fügen Sie mit **Hinzufügen** (Add) **beide** Einschränkungen hinzu, die Sie in Schritt 1 kopiert haben: die Adresse Ihrer Instanz mit `/*` am Ende und `https://docs.google.com/*`.
   - Wählen Sie unter **API-Einschränkungen** (API restrictions) die Option **Schlüssel einschränken** (Restrict key) und markieren Sie nur **Google Picker API**.
3. Klicken Sie auf **Speichern** (Save) und kopieren Sie den Schlüssel (er beginnt mit `AIza`). Es kann bis zu 5 Minuten dauern, bis Änderungen an einem API-Schlüssel wirksam werden.

<div class="mac-window">
  ![API-Schlüssel auf Websites und die Google Picker API beschränkt](/img/files/google-drive/8%20-%20Google%20Drive.jpg)
</div>

<Warning>
Der API-Schlüssel **ist von Natur aus öffentlich**: Der Browser jedes Benutzers erhält ihn, um die Auswahl zu öffnen. Deshalb ist es zwingend erforderlich, ihn auf die SecureAI-Website, auf `docs.google.com` und auf die Google Picker API einzuschränken.
</Warning>

Wenn Sie den Schlüssel nach der Verwendung von **Test connection** bearbeiten, kann Google **„Warning: Potential breakage due to active usage"** anzeigen und dabei `drive.googleapis.com` auflisten. Diese Nutzung stammt vom Test von SecureAI, der die Google Drive API mit dem Schlüssel aufruft, um ihn zu prüfen: Geben Sie `UPDATE` ein und bestätigen Sie.

## Schritt 6: In SecureAI eintragen, testen und aktivieren

1. Kehren Sie zum Seitenbereich **Google Drive** in SecureAI zurück.
2. Fügen Sie unter **2. Paste the identifiers** die **Client ID** und den **API key** ein.
3. Unter **3. Test it**:
   - **Test connection** prüft von den SecureAI-Servern aus, dass der API-Schlüssel gültig ist, dass er Anfragen Ihrer Instanz und der Google-Auswahl (`docs.google.com`) akzeptiert und dass er zum **selben Projekt** wie der OAuth-Client gehört.
   - **Try signing in** öffnet dasselbe Google-Fenster, das Ihre Benutzer sehen werden: Melden Sie sich mit Ihrem Konto an. SecureAI bestätigt, dass die Origin autorisiert ist und dass die Google Drive API antwortet.

<div class="mac-window">
  ![Grüne Tests im SecureAI-Seitenbereich](/img/files/google-drive/9%20-%20Google%20Drive.png)
</div>

4. Lassen Sie unter **4.** die Option **Show "Add from Drive" to users** aktiviert und klicken Sie auf **Save**.

Die Karte wechselt zu **Available in the chat**.

## Schritt 7: So verwenden Ihre Benutzer es

1. Im Chat klickt der Benutzer auf die Schaltfläche zum **Anhängen** und wählt **Add from Drive**.

<div class="mac-window">
  ![Add from Drive im Anhängen-Menü](/img/files/google-drive/10%20-%20Google%20Drive.png)
</div>

2. Es öffnet sich ein Google-Fenster, in dem er sein Konto auswählt und SecureAI autorisiert, die von ihm ausgewählten Dateien zu sehen. Wenn der Browser Pop-ups blockiert, müssen sie für die SecureAI-Website zugelassen werden.
3. Die Google-Drive-Auswahl wird geöffnet, mit den Tabs Meine Ablage, freigegebene Ablagen und Bilder. Der Benutzer wählt eine oder mehrere Dateien aus und klickt auf **Select**.


4. Die Dateien erscheinen an die Nachricht angehängt, mit dem Google-Drive-Symbol. Beim Senden durchlaufen sie die DLP-Richtlinien Ihrer Organisation: Enthält eine Datei Daten, die eine Richtlinie blockiert (zum Beispiel E-Mail-Adressen), wird die Nachricht wie bei jedem anderen Anhang blockiert.

## Fehlerbehebung

| Was Sie sehen | Ursache | Was zu tun ist |
|---|---|---|
| **Test connection**: „The API key's website restrictions do not include this address" (Die Website-Einschränkungen des API-Schlüssels enthalten diese Adresse nicht) | Der API-Schlüssel enthält nicht die SecureAI-Website | Fügen Sie die exakte Einschränkung aus Schritt 1 hinzu, mit `/*` am Ende |
| **Test connection**: „The API key's website restrictions do not include https://docs.google.com/*" (Die Website-Einschränkungen des API-Schlüssels enthalten https://docs.google.com/* nicht) | Die zweite Einschränkung aus Schritt 1 fehlt | Fügen Sie sie hinzu (Schritt 5) und warten Sie einige Minuten |
| **Test connection**: „The API key belongs to a different project than the OAuth client" (Der API-Schlüssel gehört zu einem anderen Projekt als der OAuth-Client) | Die Anmeldedaten wurden in verschiedenen Projekten erstellt | Erstellen Sie den API-Schlüssel im selben Projekt wie den OAuth-Client |
| **Test connection**: „The Google Drive API is not enabled" (Die Google Drive API ist nicht aktiviert) | Die API wurde nicht aktiviert | Schritt 2 |
| Das Google-Fenster zeigt **Error 400: origin_mismatch** oder **redirect_uri_mismatch** | Die JavaScript-Origin ist nicht im OAuth-Client eingetragen | Fügen Sie sie hinzu (Schritt 4). Änderungen können einige Minuten dauern |
| Das Google-Fenster zeigt **Error 403: org_internal** | Der Benutzer verwendet ein Konto außerhalb Ihres Workspace | Er muss sich mit dem Konto der Organisation anmelden |
| Die Auswahl zeigt „The API developer key is invalid" | Der API-Schlüssel enthält `https://docs.google.com/*` nicht unter seinen Websites oder erlaubt die Google Picker API nicht | Prüfen Sie Schritt 5 und verwenden Sie **Test connection**; Änderungen am Schlüssel dauern bis zu 5 Minuten |
| Google verlangt beim Speichern des API-Schlüssels die Eingabe von `UPDATE` („Potential breakage due to active usage") | Der Test von SecureAI hat die Drive API mit dem Schlüssel aufgerufen | Geben Sie `UPDATE` ein und bestätigen Sie |
| „Your browser blocked the Google sign-in window" (Ihr Browser hat das Google-Anmeldefenster blockiert) | Pop-ups sind für die Website blockiert | Lassen Sie sie für die SecureAI-Adresse zu |
| Die Nachricht wird beim Senden mit der angehängten Datei blockiert | Eine DLP-Richtlinie hat Daten in der Datei erkannt | Das ist das erwartete Verhalten; prüfen Sie den Vorfall unter **Data Protection** |
| „SecureAI did not receive access to this file" (SecureAI hat keinen Zugriff auf diese Datei erhalten) | Die Datei wurde nicht in der Auswahl ausgewählt | Wählen Sie sie über das Drive-Fenster aus |
| „Its owner does not allow downloading it" (Der Eigentümer erlaubt den Download nicht) | Der Eigentümer hat das Herunterladen deaktiviert | Bitten Sie den Eigentümer, es zu aktivieren |
| Der Benutzer sieht **Add from Drive** nicht | Die Integration ist deaktiviert, nicht gespeichert, oder der Tarif enthält sie nicht | Prüfen Sie die Karte unter **Admin → Integrations → Files** |

## Häufig gestellte Fragen

**Funktioniert es mit freigegebenen Ablagen?** Ja. Die Auswahl hat einen Tab für freigegebene Ablagen; der Benutzer sieht die Ablagen, in denen er Mitglied ist.

**Welche Berechtigungen erteilt jeder Benutzer SecureAI?** Nur `drive.file`: Zugriff auf die Dateien, die der Benutzer in der Auswahl ausgewählt hat. SecureAI kann keine anderen Dateien Ihres Drive auflisten, durchsuchen oder lesen.

**Wie deaktiviere ich es?** Deaktivieren Sie **Show "Add from Drive" to users** und speichern Sie, oder klicken Sie auf **Remove configuration**. Um auch den bereits von den Benutzern erteilten Zugriff zu beenden, löschen Sie den OAuth-Client in Google Cloud.

**Hiper AI hatte Drive bereits für mich konfiguriert. Muss ich etwas tun?** Nein. Solange Sie keine eigene Konfiguration speichern, zeigt die Karte **Configured by Hiper AI** an und alles funktioniert unverändert weiter. Wenn Sie Ihre eigene speichern, ersetzt sie diese.

**Und das „Google-Drive-Dienstkonto" der Vorgängerversion?** Es wird nicht mehr verwendet: Jeder Download erfolgt mit dem Token des Benutzers selbst, was sicherer ist, da ein Benutzer nie eine Datei anhängen kann, die er nicht öffnen kann.
