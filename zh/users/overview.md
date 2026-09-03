---
sidebar_position: 1
title: "User & Access Management"
---


# User & Access Management

SecureAI provides enterprise-grade user administration, role-based access control (RBAC), permission tiers, and license allocation.

---

## System Roles

SecureAI includes built-in system roles to govern platform access:

| Role | Access Level | Description |
|---|---|---|
| **Admin** | Full Control | Full administrative privileges: manage users, create custom roles, configure SMLTP/AI Gateway policies, view logs, and configure SSO. |
| **User** | Standard | Regular user access: chat with AI models, create and manage personal indexes, upload documents. |
| **Global Reader** | Read-Only | Same capabilities as standard User plus read-only visibility into admin panels and system status. Cannot modify settings. |

### Custom Roles & Granular Permissions
Administrators can create custom roles with tailored permission levels (**None**, **Reader**, **Admin**) across specific modules:
- **User & Group Management**: User creation, editing, group assignment.
- **Index Management**: Document upload, index creation, index training.
- **Security & SMLTP**: Security policies, incident response, audit verification.
- **Integrations & AI Gateway**: Connecting cloud providers, API keys, and endpoints.

---

## License Management

User accounts are provisioned under organizational license tiers:

| Tier | Included Features |
|---|---|
| **Ultra** | Full platform features, unlimited indexes, priority model throughput, custom SMLTP compliance policies, dedicated support. |
| **Growth** | Team collaboration tools, group indexes, standard SMLTP security policies, standard support. |
| **Essential** | Core chat interface, personal indexes, basic model access, community support. |

---

## Common Administrative Tasks

- **Create a User**: Go to **Admin ? Users ? Create User**. Set email, role, and license tier.
- **Assign to Groups**: Navigate to **Admin ? Groups** to organize users into collaborative teams with shared group indexes.
- **Configure SSO**: Connect your enterprise Identity Provider (Google Workspace or Microsoft Entra ID) under the **Authentication** settings.
