---
title: "Kurzanleitung (Quickstart)"
description: "Beginnen Sie in wenigen Minuten mit der Nutzung von SecureAI: Greifen Sie auf die Plattform zu, konfigurieren Sie den Assistenten und erstellen Sie Ihren ersten RAG-Index."
---

Dieser Leitfaden führt Sie Schritt für Schritt durch den Zugriff auf die SecureAI-Instanz Ihrer Organisation, die Auswahl Ihrer Authentifizierungsmethode und die Bereitstellung Ihrer ersten KI-Wissensdatenbank.

---

<Steps>
  <Step title="Greifen Sie auf Ihre Unternehmensinstanz zu">
    Geben Sie in Ihrem Webbrowser die für Ihre Organisation bereitgestellte Adresse ein:

    ```bash
    https://{tu-empresa}.hiperai.ai
    ```

    Klicken Sie auf die Hauptschaltfläche **„Erste Schritte“**, um den Zugriffsfluss zu starten.
  </Step>

  <Step title="Wählen Sie die Authentifizierungsmethode aus">
    Wählen Sie je nach dem von Ihrem Unternehmen abgeschlossenen Plan die entsprechende Methode aus:

    <Tabs>
      <Tab title="Firmenkonto (SSO)">
        Wenn Ihre Organisation **Microsoft Entra ID (Azure)** oder **Google Workspace** integriert hat, klicken Sie auf **"Unternehmenskonto"**.

        Sie werden automatisch zu Ihrem gewohnten Identitätsanbieter weitergeleitet, um sich sicher und föderal anzumelden.
      </Tab>
      <Tab title="Grundlegende Authentifizierung">
        Wenn Ihr Team die Anmeldung noch nicht mit SSO verbunden hat, wählen Sie die Option **„Basic Auth“** und melden Sie sich mit Ihrer vom Administrator bereitgestellten E-Mail-Adresse und Ihrem Passwort an.
      </Tab>
    </Tabs>
  </Step>

  <Step title="Legen Sie die Assistenteneinstellungen fest">
    Beim ersten Betreten sehen Sie einen Willkommensassistenten (**Startup-Setup**), mit dem Sie kalibrieren können, wie die KI mit Ihnen interagiert:

    - **Temperatur („Temperature“): Passt das Gleichgewicht zwischen analytischer Präzision (niedrige Werte) und Kreativität bei den Antworten (hohe Werte) an.**
    - **Antwortlänge („Response Length“): Definiert die Standardgröße der generierten Nachrichten.**
    - **Interface-Theme („Theme“): Wählen Sie zwischen hellem Modus, dunklem Modus oder Synchronisierung mit dem System.**
    - **KI-Avatar: Mit Premium-Lizenzen können Sie über eine Textaufforderung einen benutzerdefinierten Avatar erstellen.**

  </Step>

  <Step title="Erstellen Sie Ihren ersten RAG-Index (Knowledge Base).">
    Während der Erstkonfiguration können Sie Ihren eigenen **RAG-Index (Retrieval-Augmented Generation)** anzeigen:

    - **Multi-Cloud-Bereitstellung: Wählen Sie die Region und den Cloud-Anbieter Ihrer Wahl aus.**
    - **Ende-zu-Ende-Verschlüsselung: Alle vektorisierten Informationen und Dokumente werden mit exklusiven Schlüsseln verschlüsselt.**
    - **Persönliche oder Team-Wissensdatenbank: Ermöglicht das Hochladen von Dokumenten (PDFs, Dokumente, Code), damit die Modelle genau auf den Kontext Ihres Unternehmens reagieren.**

  </Step>

  <Step title="Verbinden Sie Erkennungs- und Sichtbarkeitsquellen (Cloud, CASB und Agent)">
    Um vollständige Transparenz zu erhalten und die KI-Nutzung in Ihrem Unternehmen zu überwachen, empfehlen wir die Aktivierung der drei wichtigsten Erkennungsquellen:

    - **Clouds und AI-Anbieter integrieren (NHI Inventory): Verbinden Sie Konsolen wie OpenAI, Anthropic, AWS oder Azure AI in [Cloud Providers](/de/integrations/cloud/overview). Dadurch können Sie **Nicht-menschliche Identitäten (NHIs)**, verwaiste API-Schlüssel und den Cloud-Verbrauch automatisch verfolgen.**
    - **Integrieren Sie CASB und Netzwerksicherheit (SWG): Verbinden Sie [Cisco Umbrella](/de/integrations/casb/overview) oder andere Proxys, um den Unternehmensverkehr zu externen KI-Diensten zu überwachen.**
    - **Stellen Sie den SecureAI Agent auf Geräten bereit: Installieren Sie den [SecureAI Endpoint Agent] (/de/agent/installation) auf Ihren Teamcomputern, um lokale Anwendungen zu überwachen, **MCP (Model Context Protocol)**-Server und -Konnektoren sowie autonome Agenten zu erkennen und Richtlinien zur Durchsetzung des ausgehenden Datenverkehrs anzuwenden.**

  </Step>

  <Step title="Bereit! Beginnen Sie mit der Interaktion und dem Regieren">
    Sobald die Einrichtung abgeschlossen ist und Ihre Quellen verbunden sind, haben Sie Zugriff auf den sicheren Unternehmenschat, Ihre RAG-Wissensdatenbanken sowie das Echtzeit-Telemetrie- und Governance-Dashboard.
  </Step>
</Steps>

---

## 🚀 Nächste Schritte

Entdecken Sie weiterhin alles, was Sie mit der Plattform tun können:

<CardGroup cols={2}>
  <Card title="Verfügbare Modelle" icon="brain" href="/de/models">
    Vergleichen Sie die Stärken jedes Modells und wann Sie jedes einzelne auswählen sollten.
  </Card>
  <Card title="Integration über API" icon="code" href="/de/api">
    Verbinden Sie Ihre internen Systeme über OpenAI-kompatible Endpunkte.
  </Card>
  <Card title="Sicherheit und SMLTP" icon="shield-halved" href="/de/security/overview">
    Erfahren Sie, wie SecureAI den Verlust sensibler Informationen (DLP) verhindert.
  </Card>
  <Card title="Installieren Sie den Endpoint Agent" icon="network-wired" href="/de/agent/overview">
    Überwachen und steuern Sie den Einsatz von KI-Tools in den Teams Ihres Unternehmens.
  </Card>
</CardGroup>
