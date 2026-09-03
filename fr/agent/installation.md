---
sidebar_position: 2
title: "Installation de l'agent"
sidebar_label: "Installation"
description: "Installez l'agent SecureAI OS sur les points de terminaison Windows, Linux et macOS"
---
# Installation de l'agent

L'agent du système d'exploitation SecureAI est installé à partir d'un **package d'installation** que vous créez dans **Admin → Registre des agents → Agents du système d'exploitation**. Le package produit une commande (Windows) ou un script (Linux/macOS) prêt à l'emploi qui contient deux valeurs : l'**URL backend** et une **clé d'inscription** de portée. Pour le générateur de packages complet et les mécanismes d'inscription, voir [Packages d'inscription et d'installation](/fr/en/agent/enrollment-and-packages).

## Windows (MSI)

Windows utilise un **MSI signé par code**. Le MSI n'est jamais modifié lors de son téléchargement, donc sa signature Authenticode reste valide — la configuration est transmise au moment de l'installation sur la ligne de commande `msiexec` au lieu d'être intégrée dans le fichier.

```powershell
msiexec /i "secureai-agent.msi" /qb BACKEND_URL=https://{customer.name}.hiperai.ai ENROLL_KEY=sk-...
```

| Propriété | Descriptif |
|--------------|-------------|
| `BACKEND_URL` | Votre origine du backend SecureAI (le point de terminaison appelle ici). |
| `ENROLL_KEY` | Clé `agent:enroll` étendue du package d'installation. |

Le panneau d'installation affiche la commande exacte avec vos valeurs pré-remplies – copiez-la directement.

<Tip>
**Déployer à grande échelle**

Envoyez la même commande `msiexec` via votre MDM/RMM existant (Intune, GPO, SCCM, etc.). Étant donné que l’URL et la clé sont des propriétés de ligne de commande, un MSI signé fonctionne pour chaque locataire et groupe.
</Tip>

## Linux/MacOS (script)

Téléchargez le script shell autonome à partir du package d'installation et exécutez-le. Le script extrait le `.deb`/`.pkg` approprié et écrit la configuration de l'agent (par exemple `/etc/secureai-agent.toml` sous Linux, une liste LaunchAgent sur macOS).

```bash
sudo ./secureai-agent-install.sh
```

L'URL du backend et la clé d'inscription sont déjà intégrées dans le script généré pour votre package.

## Que se passe-t-il lors de la première exécution

Au premier lancement, l'agent **s'inscrit** : il présente la clé d'inscription, enregistre l'appareil et reçoit un jeton par appareil et sa configuration d'exécution. Il commence alors à battre et à appliquer sa [politique](/fr/en/agent/policies-and-groups) résolue. Voir [Packages d'inscription et d'installation](/fr/en/agent/enrollment-and-packages) pour plus de détails, y compris la manière dont l'URL du backend est résolue et la rotation des jetons d'appareil.

## Connexes

- [Packages d'inscription et d'installation](/fr/en/agent/enrollment-and-packages)
- [Politiques & Groupes](/fr/en/agent/policies-and-groups)
- [Présentation de l'agent Endpoint](/fr/en/agent/overview)