---
id: ide-claude-code
title: "Claude Code"
sidebar_label: "Claude Code"
description: "Utilisez Claude Code avec SecureAI — application complète de SMLTP, DLP et PII pour le développement assisté par l'IA"
---
# Claude Code — Intégration IDE

[Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) est l'assistant de codage agent d'Anthropic. En le pointant vers le proxy compatible Anthropic de SecureAI, chaque invite envoyée par vos développeurs passe par **SMLTP, DLP, analyse PII, Prompt Shield, limitation de débit et gouvernance des modèles** — sans aucune modification du flux de travail du développeur.

---

## Comment ça marche

SecureAI expose un point de terminaison compatible avec l'API Anthropic Messages à l'adresse :

```
https://<your-host>/api/claude-code
```

Claude Code prend nativement en charge la redirection de tout le trafic vers une URL de base personnalisée via la variable d'environnement `ANTHROPIC_BASE_URL`. Une fois configuré, il communique son protocole Anthropic natif directement à SecureAI — aucun proxy local ou script wrapper n'est requis.

```
Developer machine
    │
    │  Anthropic Messages API (POST /v1/messages)
    ▼
SecureAI  (/api/claude-code)
    │
    ├── API key auth
    ├── SMLTP bundle + policy hash
    ├── DLP scan (input)
    ├── PII scan + graduated enforcement
    ├── Prompt Shield (injection detection)
    ├── Model governance & rate limiting
    │
    ▼
OpenRouter / Self-Hosted LLM
```

Toutes les activités apparaissent dans le tableau de bord d'administration SecureAI sous **AI Gateway → Journaux d'audit**, attribuées à la clé API du développeur.

---

## Étape 1 — Installer Claude Code


<Tabs>
  <Tab title="macOS/Linux/WSL">

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

  </Tab>
  <Tab title="Windows PowerShell">

```powershell
irm https://claude.ai/install.ps1 | iex
```

  </Tab>
</Tabs>

---

## Étape 2 — Générer une clé API

1. Accédez à **Admin → Clés API** (`https://<your-host>/admin/apis`)
2. Cliquez sur **Créer une clé API**
3. Définissez un nom (par exemple `claude-code-dev-jane`)
4. Configurez :
   - **Modèles autorisés** — sélectionnez les LLM que la clé peut utiliser (voir [modèles disponibles](#available-models))
   - **Politique SMLTP** — sélectionnez la stratégie de conformité (`internal`, `confidential`, `hipaa`, etc.)
   - **Limites de taux** selon les besoins
5. Copiez la valeur `sk-…` — elle n'est affichée qu'une seule fois

---

## Étape 3 — Configurer Claude Code

L'approche recommandée consiste à ajouter les paramètres au **fichier de paramètres locaux au niveau du projet** (`.claude/settings.local.json`), qui est ignoré par git par défaut.

```json title=".claude/settings.local.json"
{
  "env": {
    "ANTHROPIC_BASE_URL":  "https://<your-host>/api/claude-code",
    "ANTHROPIC_AUTH_TOKEN": "sk-<your-secureai-api-key>",
    "ANTHROPIC_API_KEY":   "",

    "ANTHROPIC_DEFAULT_OPUS_MODEL":   "anthropic/claude-opus-4.6",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "anthropic/claude-sonnet-4.6",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL":  "google/gemini-3-flash-preview",
    "CLAUDE_CODE_SUBAGENT_MODEL":     "anthropic/claude-sonnet-4.6",

    "CLAUDE_CODE_SKIP_FAST_MODE_ORG_CHECK": "1"
  }
}
```

<Warning>
`ANTHROPIC_API_KEY` doit être **explicitement défini sur une chaîne vide** pour empêcher Claude Code de tenter de s'authentifier directement auprès d'Anthropic.
</Warning>

<Tip>
**Profil de coque (alternative)**

Vous pouvez également ajouter les variables à `~/.zshrc`, `~/.bashrc` ou à votre PowerShell `$PROFILE` au lieu du fichier de paramètres. Le fichier de paramètres est préféré pour les projets d’équipe afin que chaque développeur hérite automatiquement de la même configuration.
</Tip>

---

## Étape 4 — Vérifiez la connexion

Démarrez Claude Code depuis le répertoire de votre projet :

```bash
cd /path/to/your/project
claude
```

Exécutez `/status` dans la session. Vous devriez voir :

```
Auth token:          ANTHROPIC_AUTH_TOKEN
Anthropic base URL:  https://<your-host>/api/claude-code
```

Cela confirme que tout le trafic est acheminé via SecureAI.

---

## Modèles disponibles

SecureAI expose le même catalogue de modèles disponible dans l'interface de discussion. Utilisez n'importe quelle valeur `id` du tableau ci-dessous dans les variables d'environnement ci-dessus.

### Anthropique (Claude)
| ID du modèle | Nom d'affichage |
|---|---|
| `anthropic/claude-sonnet-4.6` | Claude Sonnet 4.6 |
| `anthropic/claude-opus-4.6` | Claude Opus 4.6 |

### OpenAI
| ID du modèle | Nom d'affichage |
|---|---|
| `openai/gpt-5-mini` | GPT-5 Mini |
| `openai/gpt-5.1-codex` | GPT-5.1-Codex |
| `openai/gpt-5.1` | GPT-5.1 |
| `openai/gpt-5.2` | GPT-5.2 |
| `openai/gpt-5.3-codex` | GPT-5.3-Codex |

### Google (Gémeaux)
| ID du modèle | Nom d'affichage |
|---|---|
| `google/gemini-3-flash-preview` | Aperçu Flash de Gémeaux 3 |
| `google/gemini-3.1-pro-preview` | Aperçu de Gemini 3.1 Pro |

### Méta (Lama)
| ID du modèle | Nom d'affichage |
|---|---|
| `meta-llama/llama-4-maverick` | Lama 4 Maverick |
| `meta-llama/llama-4-scout` | Lama 4 Scout |
| `meta-llama/llama-3.3-70b-instruct` | Lama 3.3 70B Instruire |

###Mistral
| ID du modèle | Nom d'affichage |
|---|---|
| `mistralai/mistral-large-2512` | Mistral Grand 3 2512 |
| `mistralai/ministral-14b-2512` | Ministral 14B 2512 |
| `mistralai/mistral-nemo` | Mistral Némo |
| `mistralai/mistral-7b-instruct` | Mistral 7B Instruire |

### Recherche profonde
| ID du modèle | Nom d'affichage |
|---|---|
| `deepseek/deepseek-r1-0528` | DeepSeek R1 0528 |
| `deepseek/deepseek-v3.2` | DeepSearch V3.2 |

### xAI (Grök)
| ID du modèle | Nom d'affichage |
|---|---|
| `x-ai/grok-4` | Grok 4 |
| `x-ai/grok-code-fast-1` | Grok Code Rapide 1 |
| `x-ai/grok-4.1-fast` | Grok 4.1 Rapide |

### Qwen
| ID du modèle | Nom d'affichage |
|---|---|
| `qwen/qwen3-coder` | Qwen3-Codeur |
| `qwen/qwen3-coder-next` | Codeur Qwen3 Suivant |
| `qwen/qwen3-235b-a22b-2507` | Qwen3 235B A22B 2507 |
| `qwen/qwen3.5-397b-a17b` | Qwen3.5 397B A17B |

### Auto-hébergé (points de terminaison SMLTP distants)

Les modèles auto-hébergés enregistrés en tant que points de terminaison SMLTP distants actifs sont automatiquement disponibles. Leurs identifiants suivent le modèle `self-hosted/<model-name>`. Exécutez `/status` dans Claude Code ou appelez `GET /api/claude-code/v1/models` pour voir la liste en direct.

---

## Rôles modèles de Claude Code

Claude Code utilise différents modèles pour différentes tâches internes. Mappez chaque rôle à n’importe quel modèle du catalogue ci-dessus :

| Variable d'environnement | Rôle | Recommandé |
|---|---|---|
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Raisonnement complexe, boucle agent principale | `anthropic/claude-opus-4.6` |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Tâches générales de codage | `anthropic/claude-sonnet-4.6` |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Complétions rapides, appels d'outils | `google/gemini-3-flash-preview` |
| `CLAUDE_CODE_SUBAGENT_MODEL` | Tâches de sous-agent générées | `anthropic/claude-sonnet-4.6` |

Vous pouvez mélanger librement les fournisseurs. Par exemple, utilisez Gemini pour les sous-tâches rapides/bon marché et Claude pour la boucle de raisonnement principale :

```json
"ANTHROPIC_DEFAULT_OPUS_MODEL":   "anthropic/claude-opus-4.6",
"ANTHROPIC_DEFAULT_SONNET_MODEL": "x-ai/grok-code-fast-1",
"ANTHROPIC_DEFAULT_HAIKU_MODEL":  "google/gemini-3-flash-preview",
"CLAUDE_CODE_SUBAGENT_MODEL":     "deepseek/deepseek-v3.2"
```

---

## Application de la sécurité

Chaque requête via le proxy est soumise à la pile de sécurité complète SecureAI :

| Couche | Ce qu'il fait |
|---|---|
| **SMLTP** | Attache l'ID de bundle, le hachage de stratégie, l'ID de trace et l'application de sortie à chaque appel |
| **DLP** | Analyse les invites pour détecter les modèles de perte de données (secrets, informations d'identification, documents confidentiels) |
| **PII** | Détecte et supprime les informations personnellement identifiables ; niveaux d'application progressifs |
| **Bouclier d'invite** | Détecte les tentatives d'injection rapides |
| **Modèle de gouvernance** | Applique les modèles autorisés, les listes autorisées des fournisseurs et les règles de résidence |
| **Limitation de taux** | Limites par clé et par utilisateur appliquées via Redis |
| **Journaux d'audit** | Piste d'audit complète par demande dans **AI Gateway → Journaux d'audit** |

La stratégie SMLTP est héritée de la configuration de la clé API. Pour modifier la stratégie d'une clé, accédez à **Admin → Clés API**, modifiez la clé et sélectionnez une autre **Politique SMLTP**.

---

## Dépannage

### `/status` affiche toujours `api.anthropic.com`

Claude Code a mis en cache les informations d'identification d'une connexion précédente. Exécutez `/logout` dans une session Claude Code, puis redémarrez :

```bash
claude
❯ /logout
```

### `401 Unauthorized`

- Vérifiez que la clé `sk-…` est active dans **Admin → Clés API**
- Vérifiez que `ANTHROPIC_API_KEY` est défini sur une chaîne vide (`""`)

### Modèle non disponible

- Vérifiez la liste des **Modèles autorisés** de la clé API dans **Admin → Clés API**.
- Appelez `GET /api/claude-code/v1/models` (avec votre token `Bearer sk-…`) pour voir exactement à quoi la clé peut accéder

### Blocage DLP/PII

Si une invite est bloquée, Claude Code recevra une réponse d'erreur avec un message expliquant la violation. L'incident est enregistré dans **Admin → Incidents** et visible dans **AI Gateway → Journaux d'audit**.