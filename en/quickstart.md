---
title: "Quick Start Guide (Quickstart)"
description: "Start using SecureAI in minutes: access the platform, configure the wizard and create your first RAG index."
---

This guide will walk you step by step to access your organization's SecureAI instance, choose your authentication method, and deploy your first AI knowledge base.

---

<Steps>
  <Step title="Access your corporate instance">
    Enter in your web browser the address provided for your organization:

    ```bash
    https://{tu-empresa}.hiperai.ai
    ```

    Click the main **"Get Started"** button to start the access flow.
  </Step>

  <Step title="Select authentication method">
    Depending on the plan contracted by your company, select the corresponding method:

    <Tabs>
      <Tab title="Corporate Account (SSO)">
        If your organization has **Microsoft Entra ID (Azure)** or **Google Workspace** integrated, click **"Enterprise account"**.

        You will be automatically redirected to your usual identity provider to log in securely and federatedly.
      </Tab>
      <Tab title="Basic Authentication">
        If your team has not yet federated the login with SSO, select the **"Basic Auth"** option and log in with your email and password provided by the administrator.
      </Tab>
    </Tabs>
  </Step>

  <Step title="Set Assistant Preferences">
    Upon entering for the first time, you will see a welcome wizard (**Startup Setup**) that allows you to calibrate how the AI ​​will interact with you:

    - **Temperature (`Temperature`): Adjusts the balance between analytical precision (low values) and creativity in responses (high values).**
    - **Response Length (`Response Length`): Defines the default size of the generated messages.**
    - **Interface Theme (`Theme`): Select between light mode, dark mode or synchronization with the system.**
    - **AI Avatar: With premium licenses, you can generate a custom avatar using a text prompt.**

  </Step>

  <Step title="Create your first RAG (Knowledge Base) index">
    During the initial configuration, you will be able to display your own **RAG (Retrieval-Augmented Generation) index**:

    - **Multi-Cloud Deployment: Select the region and cloud provider of your preference.**
    - **End-to-End Encryption: All vectorized information and documents are encrypted with exclusive keys.**
    - **Personal or Team Knowledge Base: Allows you to upload documents (PDFs, docs, code) so that the models respond with the exact context of your business.**

  </Step>

  <Step title="Connect discovery and visibility sources (Cloud, CASB and Agent)">
    To gain complete visibility and audit AI usage in your organization, we recommend enabling the three main discovery sources:

    - **Integrate Clouds and AI Providers (NHI Inventory): Connect consoles such as OpenAI, Anthropic, AWS or Azure AI in [Cloud Providers](/en/integrations/cloud/overview). This allows you to automatically track **Non-Human Identities (NHIs)**, orphan API keys, and cloud consumption.**
    - **Integrate CASB & Network Security (SWG): Connect [Cisco Umbrella](/en/integrations/casb/overview) or other proxies to monitor corporate traffic to external AI services.**
    - **Deploy the SecureAI Agent on devices: Install the [SecureAI Endpoint Agent](/en/agent/installation) on your team computers to audit local applications, detect **MCP (Model Context Protocol)** servers and connectors, autonomous agents, and apply egress enforcement policies.**

  </Step>

  <Step title="Ready! Start interacting and governing">
    Once setup is complete and your sources are connected, you'll have access to secure corporate chat, your RAG knowledge bases, and real-time telemetry and governance dashboard.
  </Step>
</Steps>

---

## 🚀 Next Steps

Continue exploring everything you can do with the platform:

<CardGroup cols={2}>
  <Card title="Available Models" icon="brain" href="/en/models">
    Compare the strengths of each model and when to choose each one.
  </Card>
  <Card title="Integration via API" icon="code" href="/en/api">
    Connect your internal systems using OpenAI-compatible endpoints.
  </Card>
  <Card title="Security & SMLTP" icon="shield-halved" href="/en/security/overview">
    Learn how SecureAI prevents sensitive information leakage (DLP).
  </Card>
  <Card title="Install Endpoint Agent" icon="network-wired" href="/en/agent/overview">
    Monitor and govern the use of AI tools on your company's teams.
  </Card>
</CardGroup>
