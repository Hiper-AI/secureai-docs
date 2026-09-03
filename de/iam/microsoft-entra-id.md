---
sidebar_position: 3
title: "Microsoft Entra ID (SSO)"
---
# Microsoft Entra ID (SSO)-Integration

Dieser Leitfaden führt Sie durch den Prozess der Konfiguration von Microsoft Entra ID (ehemals Azure Active Directory) für Single Sign-On (SSO) mit SecureAI. Sie erfahren, wie Sie die erforderlichen Anmeldeinformationen von Azure erhalten und diese übermitteln, um die Integration abzuschließen.

## Voraussetzungen

- Administratorzugriff auf das Azure-Portal
– Ein Azure Entra ID (Azure AD)-Mandant
- Administratorzugriff auf SecureAI

## Schritt 1: Erstellen Sie eine Anwendung im Azure-Portal

1. Melden Sie sich beim [Azure-Portal](https://portal.azure.com) an.
2. Suchen Sie nach **Azure Active Directory** oder **Microsoft Entra ID** und wählen Sie es aus.

<div class="mac-window">
  ![Azure Portal Search](/img/microsoft%20entraid%20sso%20images/1%20-%20azure.png)
</div>

3. Wählen Sie im Seitenmenü **App-Registrierungen**

<div class="mac-window">
  ![App-Registrierungsmenü](/img/microsoft%20entraid%20sso%20images/2%20-%20azure.png)
</div>

4. Klicken Sie auf **+ Neue Registrierung**

<div class="mac-window">
  ![Neue Registrierungsschaltfläche](/img/microsoft%20entraid%20sso%20images/3%20-%20azure.png)
</div>

## Schritt 2: Konfigurieren Sie die Anwendung

1. **Name**: Geben Sie einen aussagekräftigen Namen ein (z. B. „SecureAI SSO“).
2. **Unterstützte Kontotypen**:
   - Wählen Sie **Nur Konten in diesem Organisationsverzeichnis** aus.
   - Oder **Konten in einem beliebigen Organisationsverzeichnis**, wenn Sie mehrere Organisationen unterstützen müssen
3. **Umleitungs-URI**:
   - Plattform: **Web**
   - URI: `https://your-backend-domain.com/api/auth/azure/callback`
   - **Hinweis**: Sie erhalten diese URL von Ihrem Entwicklungsteam
4. Klicken Sie auf **Registrieren**

<div class="mac-window">
  ![Schaltfläche „Registrieren“](/img/microsoft%20entraid%20sso%20images/4%20-%20azure.png)
</div>

## Schritt 3: Holen Sie sich die Anwendungs-(Client-)ID

1. Auf der **Übersichtsseite** Ihrer Bewerbung
2. Kopieren Sie den Wert **Anwendungs-ID (Client)**
   – Dies ist eine GUID, die so aussieht: `b96ee19f-5a15-4a85-b936-****-****`
   - **Speichern Sie diesen Wert** – Sie werden ihn später benötigen

## Schritt 4: Rufen Sie die Verzeichnis-(Mandanten-)ID ab

1. Auf derselben **Übersichtsseite**
2. Kopieren Sie den Wert **Verzeichnis-(Mandanten-)ID**
   – Dies ist eine GUID, die so aussieht: `155812d2-1112-46c8-bf52-****-****`
   - **Speichern Sie diesen Wert** – Sie werden ihn später benötigen

## Schritt 5: Erstellen Sie ein Client-Geheimnis

1. Wählen Sie im Seitenmenü Ihrer Anwendung **Zertifikate und Geheimnisse** aus.

<div class="mac-window">
  ![Menü „Zertifikate und Geheimnisse“](/img/microsoft%20entraid%20sso%20images/5%20-%20azure.png)
</div>

2. Klicken Sie im Abschnitt **Client-Geheimnisse** auf **+ Neues Client-Geheimnis**
3. **Beschreibung**: Geben Sie eine Beschreibung ein (z. B. „SecureAI SSO Secret“).
4. **Läuft ab**:
   - Wählen Sie einen Ablaufzeitraum (empfohlen: 24 Monate)
   - **WICHTIG**: Stellen Sie sicher, dass Sie das Geheimnis erneuern, bevor es abläuft
5. Klicken Sie auf **Hinzufügen**

<div class="mac-window">
  ![Client-Geheimnis-Schaltfläche hinzufügen](/img/microsoft%20entraid%20sso%20images/6%20-%20azure.png)
</div>

6. **SOFORT** den **Wert** des Geheimnisses kopieren
   - Es wird so aussehen: `plm8Q~************************************`

<div class="mac-window">
  ![Client Secret Value](/img/microsoft%20entraid%20sso%20images/7%20-%20azure.png)
</div>
   - **WARNUNG**: Dieser Wert wird nur einmal angezeigt. Wenn Sie es verlieren, müssen Sie ein neues Geheimnis erstellen
   - **Diesen Wert sicher speichern**

## Schritt 6: API-Berechtigungen konfigurieren

1. Wählen Sie im Seitenmenü **API-Berechtigungen**
2. Klicken Sie auf **+Berechtigung hinzufügen**
3. Wählen Sie **Microsoft Graph**
4. Wählen Sie **Delegierte Berechtigungen**
5. Überprüfen Sie die folgenden Berechtigungen:
   - `openid` (automatisch enthalten)
   - `profile`
   - `email`
6. Klicken Sie auf **Berechtigungen hinzufügen**

<div class="mac-window">
  ![Schaltfläche „Berechtigungen hinzufügen“](/img/microsoft%20entraid%20sso%20images/8%20-%20azure.png)
</div>

7. Wenn Ihre Organisation die Zustimmung des Administrators benötigt:
   - Klicken Sie auf **Administratoreinwilligung erteilen**

<div class="mac-window">
  ![Schaltfläche „Administratoreinwilligung erteilen“](/img/microsoft%20entraid%20sso%20images/9%20-%20azure.png)
</div>

## Schritt 7: Variablen an das Hiper AI-Team senden

Nachdem Sie die Anwendung in Azure erstellt und die oben genannten Schritte ausgeführt haben, erhalten Sie drei wichtige Informationen:

1. **Kunden-ID** (aus Schritt 3)
2. **Mieter-ID** (aus Schritt 4)
3. **Client-Geheimwert** (ab Schritt 5)

Sie müssen diese drei Werte an das Hiper AI-Team senden, um die SSO-Integration abzuschließen.

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

   - **Betreff**: Geben Sie **„Microsoft Entra ID SSO-Integration“** ein.
   - **Beschreibung**: Fügen Sie die drei Werte ein, die Sie während des Einrichtungsvorgangs kopiert haben:
     - Kunden-ID (Anwendungs-ID)
     - Mieter-ID (Verzeichnis-ID)
     - Client-Geheimwert
4. Klicken Sie auf die Schaltfläche **Anfrage senden**

### C. Warten Sie auf die Bestätigung

- Sie erhalten innerhalb von **24 bis 72 Stunden** eine E-Mail-Bestätigung (je nach Verfügbarkeit)
- Die E-Mail bestätigt, dass Ihr SSO erfolgreich konfiguriert wurde
– Nach der Konfiguration können Sie über die Anmeldeschaltfläche **„Weiter mit Azure EntraID“** auf der Anmeldeseite auf Ihre SecureAI-Instanz zugreifen

**Wichtig**: Bewahren Sie Ihre Anmeldeinformationen sicher auf, bis die Integration abgeschlossen ist. Teilen Sie sie nicht über unsichere Kanäle.

## Benutzerkonfiguration

### Vorhandene Benutzer

Benutzer, die bereits über Konten in SecureAI verfügen (unabhängig davon, ob sie die Basisauthentifizierung verwenden) **müssen nicht neu erstellt werden**. Sie können weiterhin ihre vorhandenen Konten verwenden und sich nach der Konfiguration auch mit Azure Entra ID SSO anmelden.

**Wichtig**: Die E-Mail-Adresse des Benutzers in Azure muss genau mit der E-Mail-Adresse in SecureAI übereinstimmen, damit SSO funktioniert.

### Neue SSO-Benutzer erstellen

Für neue Benutzer, die ausschließlich über SSO auf SecureAI zugreifen sollten:

1. Navigieren Sie im SecureAI-Administrationsbereich zu **Benutzerverwaltung**
2. Klicken Sie, um einen neuen Benutzer zu erstellen
3. Wählen Sie beim Anlegen des Benutzers die Option **"Geschäftskonto / SSO"**
4. Diese Konfiguration stellt sicher, dass:
   - Der neue Benutzer erhält **keine E-Mail** zur Generierung eines Passworts
   – Der Benutzer kann **direkt über die Azure Entra ID SSO**-Anmeldeschaltfläche auf SecureAI zugreifen
   – Die E-Mail-Adresse des Benutzers in Azure muss genau mit der in SecureAI eingegebenen E-Mail-Adresse übereinstimmen

## Fehlerbehebung

### Fehler: „redirect_uri-Wert muss ein gültiger absoluter URI sein“
– Stellen Sie sicher, dass der Umleitungs-URI in Azure genau mit der Konfiguration auf dem Server übereinstimmt
- Stellen Sie sicher, dass Sie entsprechend `https://` oder `http://` angeben

### Fehler: „Benutzer nicht in SecureAI-Datenbank gefunden“
- Der Benutzer muss zuvor in SecureAI registriert sein
- Wenden Sie sich an den SecureAI-Administrator, um das Benutzerkonto zu erstellen

### Fehler: „Ungültiges Client-Geheimnis“
- Das Geheimnis ist möglicherweise abgelaufen
- Erstellen Sie ein neues Client-Geheimnis und aktualisieren Sie die Konfiguration

## Erneuerung des Kundengeheimnisses

Der geheime Clientschlüssel hat ein Ablaufdatum. Bevor es abläuft:

1. Erstellen Sie gemäß Schritt 5 ein neues Client-Geheimnis
2. Stellen Sie Ihrem Entwicklungsteam den neuen Wert zur Verfügung
3. Sie aktualisieren die Konfiguration, ohne den Dienst zu unterbrechen

## Unterstützung

Wenn bei der Konfiguration Probleme auftreten:
1. Stellen Sie sicher, dass Sie über Administratorberechtigungen in Azure verfügen
2. Kontaktieren Sie Ihr Entwicklungsteam mit:
   - Screenshots der Fehler
   - Die von Ihnen erhaltenen IDs (ohne Geheimnis)
   - Die vollständige Fehlermeldung