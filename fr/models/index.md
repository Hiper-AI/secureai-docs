---
sidebar_position: 1
title: "Modèles"
---
# Modèles

Modèles disponibles dans SecureAI.

SecureAI donne accès aux derniers modèles d'IA de tous les principaux fournisseurs, vous offrant ainsi les meilleurs outils pour vos besoins spécifiques.

Pour obtenir la disponibilité du modèle en temps réel pour votre clé API, utilisez le point de terminaison externe `GET /api/external/models`.

## Comparaison de modèles

| Seau | Modèles actuels |
|--------|----------------|
| Norme | openai/gpt-oss-120b, openai/gpt-5-nano, google/gemini-3.1-flash-lite-preview, google/gemini-3-flash-preview, deepseek/deepseek-r1-distill-llama-70b, deepseek/deepseek-r1, deepseek/deepseek-v3.2, méta-llama/llama-3.3-70b-instruct, méta-llama/llama-4-maverick, méta-llama/llama-4-scout, mistralai/mistral-7b-instruct, mistralai/mistral-nemo, mistralai/ministral-14b-2512, mistralai/mistral-large-2512, x-ai/grok-3-mini, qwen/qwen3-235b-a22b-2507, qwen/qwen3-coder, qwen/qwen3-coder-next, qwen/qwen3.5-397b-a17b |
| Prime | anthropique/claude-3.7-sonnet, anthropique/claude-sonnet-4.6, anthropique/claude-opus-4.6, openai/o4-mini-high, openai/o4-mini, openai/gpt-5.2, openai/gpt-5.3-codex, openai/gpt-5.1, google/gemini-3.1-pro-preview, x-ai/grok-4 |

## Types de compartiments

### Godet standard
- **Utilisation** : tâches quotidiennes et conversations générales
- **Coût** : Plus rentable pour une utilisation régulière
- **Vitesse** : optimisé pour des réponses plus rapides
- **Idéal pour** : questions rapides, tâches simples et travail de routine

### Seau Premium
- **Utilisation** : Raisonnement complexe et analyse avancée
- **Coût** : coût plus élevé pour des capacités améliorées
- **Vitesse** : peut prendre plus de temps mais fournit des résultats supérieurs
- **Meilleur pour** : résolution de problèmes complexes, analyse détaillée et tâches spécialisées

## Guide de sélection des modèles

### Pour un raisonnement complexe
- **anthropic/claude-opus-4.6** - Idéal pour les tâches analytiques approfondies
- **openai/gpt-5.2** - Raisonnement et synthèse solides
- **google/gemini-3.1-pro-preview** - Capacités de raisonnement avancées

### Pour un développement rapide
- **openai/gpt-5-nano** - Réponses rapides pour des tâches simples
- **google/gemini-3-flash-preview** - Fort équilibre vitesse/coût
- **x-ai/grok-3-mini** - Itération et prototypage rapides

### Pour la génération de code
- **openai/gpt-5.3-codex** - Workflows de codage spécialisés
- **qwen/qwen3-coder-next** - Génération et modifications de code solides
- **deepseek/deepseek-r1** - Analyse de code nécessitant beaucoup de raisonnement

### Pour un contexte étendu
- **openai/gpt-5.1** - Tâches d'analyse de contexte étendu
- **anthropic/claude-sonnet-4.6** - Forte gestion du contexte de forme longue
- **google/gemini-3.1-pro-preview** - Analyse complète des documents

## Capacités du modèle

### Fenêtres contextuelles
- **Contexte standard** : la plupart des modèles prennent en charge 16 000 à 200 000 jetons
- **Contexte étendu** : certains modèles prennent en charge un contexte illimité
- **Traitement optimisé** : les modèles sont optimisés pour vos cas d'utilisation spécifiques

### Fonctionnalités de capacité
- **🧠 IA standard** : Génération de texte, raisonnement, codage
- **📊 Analyse** : Analyse et interprétation des données
- **💻 Code** : génération et révision de code spécialisé
- **🎯 Spécialisé** : optimisations spécifiques aux tâches

## Sélection automatique

SecureAI inclut une fonctionnalité **Auto-Select** qui choisit automatiquement le meilleur modèle pour votre tâche spécifique, en l'optimisant pour :
- **Complexité des tâches** : adapte les capacités du modèle à vos besoins
- **Vitesse de réponse** : équilibre vitesse et qualité
- **Efficacité des coûts** : optimise votre budget
- **Exigences contextuelles** : sélectionne les modèles avec les fenêtres contextuelles appropriées

## Prochaines étapes

- [Référence API](/fr/en/api) - Apprenez à utiliser les modèles via API
- [Quickstart](/fr/en/quickstart) - Commencez avec votre premier modèle
- [Présentation de la sécurité](/fr/en/security/overview) - Comprendre les fonctionnalités de sécurité du modèle