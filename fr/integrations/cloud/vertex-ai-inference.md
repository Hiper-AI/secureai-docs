---
sidebar_position: 7
title: "Google Vertex AI — Inférence sur votre compte"
sidebar_label: "Vertex AI — Inférence"
description: "Faites passer le trafic LLM de SecureAI par votre propre compte Google Cloud : payez Google avec vos engagements de dépenses (CUD) pendant que SecureAI continue d'appliquer le DLP, les politiques et les reçus signés."
---

# Google Vertex AI — Inférence sur votre compte

Avec cette intégration, les appels de SecureAI aux grands modèles de langage (LLM) s'exécutent dans **votre propre projet Google Cloud** au lieu des fournisseurs gérés par SecureAI. L'utilisation est facturée directement sur votre compte Google, ce qui vous permet d'utiliser vos engagements de dépenses (CUD) et vos remises négociées.

SecureAI reste dans le chemin de chaque requête : **le DLP, les politiques de modèles, la résidence des données et les reçus signés** s'appliquent exactement comme avec n'importe quel autre fournisseur.

<Info>
**À ne pas confondre avec l'autre carte Google Cloud.** Cette page connecte Vertex AI en tant que **fournisseur d'inférence** (Admin → Integrations → **AI providers**). La carte **Google Cloud — Découverte** (catégorie **Cloud**) se contente d'inventorier le projet en lecture seule et n'envoie jamais de prompt ; elle est décrite dans [Google Cloud — Discovery](/fr/integrations/cloud/gcp-vertex-ai). Vous pouvez utiliser les deux sur le même projet, mais elles sont indépendantes et demandent des autorisations différentes.
</Info>

## Ce qui s'exécute sur Vertex et ce qui ne s'y exécute pas

| S'exécute sur votre Vertex | Reste sur les fournisseurs gérés par SecureAI |
|---|---|
| Chat et agents (modèles des familles que vous choisissez) | Embeddings (recherche dans les documents et les index) |
| Résumés de réunions Teams (modèle Gemini) | Reclassement (re-ranking) des résultats de recherche |
| Correction grammaticale, traduction et autres tâches internes en arrière-plan, lorsque vous choisissez **Remap everything** | OCR des documents |
| | Assistant d'administration |
| | Génération d'images et voix en temps réel |
| | Modèles auto-hébergés et proxy Claude Code |

Modèles disponibles aujourd'hui : **Gemini** et les modèles ouverts servis en MaaS sur Vertex (**gpt-oss, DeepSeek, Llama et Qwen**). **Claude et Mistral sur Vertex ne sont pas encore pris en charge** ; ces modèles sont traités selon le paramètre de repli (voir ci-dessous).

## Combien de fournisseurs cloud vous pouvez utiliser

| Plan | Fournisseurs d'inférence activés en même temps |
|------|------------------------------------------------|
| **Scale** | 1 (Google Vertex AI, Azure AI Foundry **ou** Amazon Bedrock) |
| **Enterprise** | Jusqu'à 3 — par exemple Vertex AI pour Gemini, Foundry pour GPT et Bedrock pour Claude |

Lorsque plusieurs fournisseurs sont activés, chacun sert des familles de modèles **différentes** : une famille ne peut être prise que par un seul fournisseur activé, et un seul fournisseur peut être en **Remap everything**. Lorsque vous enregistrez l'intégration activée, SecureAI la refuse dans deux cas et en explique la raison dans le panneau :

| Cas | Message du panneau |
|-----|--------------------|
| Le routage chevauche un autre fournisseur activé (une famille qu'un autre prend déjà, ou un second **Remap everything**) | *This routing overlaps another enabled cloud provider: …*, suivi de la famille ou du mode en conflit. |
| Votre plan n'autorise pas un fournisseur activé de plus | *Your plan's BYO-cloud provider limit is reached (… of … in use). Disable another provider or upgrade the plan.* |

## Prérequis

- Un **projet Google Cloud** avec la facturation activée.
- L'**Agent Platform API (Vertex AI API)** activée sur ce projet (le service `aiplatform.googleapis.com`).
- Un **compte de service** dans votre projet avec le rôle **Agent Platform User** (`roles/aiplatform.user`), et l'une de ces deux façons pour SecureAI d'agir en tant que ce compte :
  - **Option A — une clé JSON** pour ce compte de service.
  - **Option B — sans clé (emprunt d'identité)** : vous accordez au compte de service SecureAI affiché dans le panneau le rôle **Service Account Token Creator** (`roles/iam.serviceAccountTokenCreator`) sur votre compte de service, et aucune clé n'est stockée. Cette option n'est disponible que si votre déploiement SecureAI la propose ; sinon, le panneau l'affiche désactivée avec l'avis *Keyless access is not enabled on this deployment.*
- L'autorisation **Admin** sur la section Integrations de SecureAI. Avec l'autorisation de lecture, vous pouvez consulter la configuration mais pas la modifier.

## Étape 1. Préparer le projet dans Google Cloud

Vous pouvez le faire en ligne de commande (rapide) ou depuis la console (avec captures d'écran). Les étapes 1 à 3 sont les mêmes pour les deux options d'authentification ; l'étape 4 (la clé JSON) ne concerne que l'option A.

<Tabs>
<Tab title="gcloud (Cloud Shell)">

Depuis [Cloud Shell](https://shell.cloud.google.com/) ou avec `gcloud` installé. Remplacez `MY_PROJECT` par l'ID réel du projet :

```bash
gcloud config set project MY_PROJECT

# 1. Activer l'Agent Platform API (Vertex AI API)
gcloud services enable aiplatform.googleapis.com

# 2. Créer un compte de service dédié à SecureAI
gcloud iam service-accounts create secureai-vertex --display-name="SecureAI Vertex"

# 3. Lui accorder le rôle minimal pour invoquer des modèles
gcloud projects add-iam-policy-binding MY_PROJECT \
  --member="serviceAccount:secureai-vertex@MY_PROJECT.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# 4. Option A uniquement : générer la clé JSON
gcloud iam service-accounts keys create key.json \
  --iam-account=secureai-vertex@MY_PROJECT.iam.gserviceaccount.com
```

</Tab>
<Tab title="Console Google Cloud">

1. Dans la [Console Google Cloud](https://console.cloud.google.com/), sélectionnez votre projet et ouvrez **API et services → Bibliothèque**. Recherchez **Agent Platform API** (anciennement **Vertex AI API**) et cliquez sur **Activer**. Si elle affiche déjà **API activée**, il n'y a rien à faire.

   <div class="mac-window">
   ![Agent Platform API activée dans Google Cloud](/img/cloud/vertex-ai-inference/1%20-%20Vertex%20AI%20Inference.png)
   </div>

2. Accédez à **IAM et administration → Comptes de service → Créer un compte de service**. Donnez-lui un nom (par exemple `secureai-vertex`).

   <div class="mac-window">
   ![Créer le compte de service](/img/cloud/vertex-ai-inference/2%20-%20Vertex%20AI%20Inference.png)
   </div>

3. Sous **Autorisations**, accordez le rôle **Agent Platform User** (`roles/aiplatform.user`) sur le projet et cliquez sur **OK**. Aucun autre rôle n'est nécessaire pour l'inférence.

   <div class="mac-window">
   ![Accorder le rôle Agent Platform User](/img/cloud/vertex-ai-inference/3%20-%20Vertex%20AI%20Inference.png)
   </div>

4. **Option A uniquement.** Ouvrez le compte de service, accédez à l'onglet **Clés** → **Ajouter une clé → Créer une clé**, choisissez le type de clé **JSON** et cliquez sur **Créer**. Le fichier n'est téléchargé qu'une seule fois.

   <div class="mac-window">
   ![Créer la clé JSON](/img/cloud/vertex-ai-inference/4%20-%20Vertex%20AI%20Inference.png)
   </div>

</Tab>
</Tabs>

<Warning>
Traitez le fichier JSON comme un mot de passe. SecureAI le stocke **chiffré** et ne l'affiche plus jamais, mais le fichier téléchargé (`key.json`) reste sur votre ordinateur : collez son contenu dans SecureAI puis **supprimez-le**, ou conservez-le dans un gestionnaire de secrets.
</Warning>

<Warning>
**Si vous ne pouvez pas créer la clé.** Si l'étape 4 échoue avec `iam.disableServiceAccountKeyCreation`, la règle de votre organisation Google Cloud interdit les clés de compte de service (c'est le comportement par défaut des nouvelles organisations). Utilisez l'**option B, sans clé**, si votre déploiement la propose ; sinon, demandez à un administrateur des règles d'administration une exception à la contrainte `iam.disableServiceAccountKeyCreation` pour ce projet.
</Warning>

### Option B : autoriser SecureAI sans clé

Avec l'option B, aucune clé n'est créée. À la place :

1. Dans SecureAI, ouvrez le panneau Vertex AI (voir l'étape 2), choisissez **Keyless (impersonation)** et saisissez l'adresse e-mail de votre compte de service dans **Your service account to impersonate**.
2. Le panneau affiche la commande à exécuter, déjà renseignée avec le compte de service SecureAI de votre déploiement. Copiez-la avec **Copy** et exécutez-la dans Cloud Shell. Elle ressemble à ceci :

   ```bash
   gcloud iam service-accounts add-iam-policy-binding secureai-vertex@MY_PROJECT.iam.gserviceaccount.com \
     --member="serviceAccount:SECUREAI_ACCOUNT" \
     --role="roles/iam.serviceAccountTokenCreator"
   ```

   Le rôle est accordé **sur votre compte de service**, et non sur le projet : SecureAI ne peut agir qu'en tant que ce compte, qui lui-même ne détient que `roles/aiplatform.user`.

### Modèles ouverts (Llama, DeepSeek, Qwen, gpt-oss)

**Gemini ne demande rien de plus.** Pour utiliser aussi Llama, DeepSeek, Qwen ou gpt-oss, acceptez d'abord les conditions de chaque modèle dans **Vertex AI → Model Garden**. Ces modèles ouverts nécessitent une **région** précise (par exemple `us-central1`) ; avec `global`, ils peuvent ne pas être disponibles.

## Étape 2. Connecter le projet dans SecureAI

1. Accédez à **Admin → Integrations**, ouvrez la catégorie **AI providers** et cliquez sur la carte **Google Vertex AI — Inference on your account**.
2. Sous **Connection**, renseignez :

   | Champ | Quoi saisir |
   |-------|-------------|
   | **Google Cloud project ID** | L'ID du projet (par exemple `my-project-123`), et non son nom d'affichage. |
   | **Vertex AI location** | Pour commencer, laissez `global` : c'est là que se trouvent les modèles par défaut Gemini 3 en *preview*. Si vous avez besoin de **résidence des données**, saisissez une région (`us-central1`, `europe-west4`…) : SecureAI envoie chaque requête au point de terminaison régional que vous avez choisi, et le lieu où Google la traite dépend des engagements de Google en matière de résidence des données. Avec `global`, c'est Google qui choisit la région. Les modèles ouverts nécessitent une région. |
   | **Authentication** | **Option A :** laissez **Service-account key (JSON)** sélectionné et collez le contenu **complet** de `key.json` dans **Service-account key JSON**. **Option B :** choisissez **Keyless (impersonation)**, saisissez l'adresse e-mail de votre compte de service dans **Your service account to impersonate** et exécutez la commande affichée par le panneau (voir **Option B : autoriser SecureAI sans clé**, ci-dessus). |

   <div class="mac-window">
   ![Section Connection du panneau Vertex AI](/img/cloud/vertex-ai-inference/5%20-%20Vertex%20AI%20Inference.png)
   </div>

3. Cliquez sur **Save**. Aucun trafic n'est encore routé : l'intégration est enregistrée désactivée pour que vous puissiez d'abord la tester.

<Info>
**Recommandation pour le premier jour :** conservez le mode **Only these model families** avec **Gemini** uniquement, les modèles par défaut inchangés, et laissez désactivés le repli comme le plafond de dépenses par siège. C'est la configuration la plus prévisible. Gardez **Remap everything** pour quand tout cela aura été validé.
</Info>

<Info>
Avec l'option A, la clé collée n'est plus jamais affichée. Pour la remplacer, collez-en une nouvelle ; si vous laissez le champ vide lors de l'enregistrement, la clé actuelle est conservée.
</Info>

## Étape 3. Choisir ce qui s'exécute sur Vertex

Sous **What runs on Vertex**, il existe deux modes :

- **Only these model families** — les familles que vous cochez (Gemini, gpt-oss, DeepSeek, Llama, Qwen) s'exécutent sur votre Vertex ; tous les autres modèles continuent de s'exécuter sur les fournisseurs de SecureAI. C'est la façon la plus prudente de commencer (par défaut : Gemini uniquement).
- **Remap everything to Vertex** — tous les appels LLM s'exécutent sur votre Vertex. Les modèles sans équivalent sur Vertex sont servis par un **modèle par défaut**.

**Default Vertex models** (modifiables) :

| Niveau | Utilisé pour | Par défaut |
|--------|--------------|------------|
| **Fast** | Tâches en arrière-plan et utilitaires (grammaire, traduction, Teams) | `google/gemini-2.5-flash` |
| **Standard** | Modèles sans équivalent | `google/gemini-3-flash-preview` |
| **Reasoning** | Modèles de raisonnement sans équivalent | `google/gemini-3.1-pro-preview` |
| **Vision** | Requêtes avec des images ou des PDF | `google/gemini-3-flash-preview` |

Il existe aussi deux options :

| Option | Désactivée (recommandé) | Activée |
|--------|-------------------------|---------|
| **Allow fallback to SecureAI-managed models** | Si Vertex échoue ou qu'un modèle n'a pas d'équivalent, la requête est **refusée** au lieu d'être envoyée à un autre fournisseur. | Ces requêtes sont relancées **une fois** sur les fournisseurs gérés par SecureAI. La relance est auditée. |
| **Apply each seat's spend cap to turns served in your account** | Les tours servis sur votre Vertex ne sont pas décomptés du plafond de dépenses du siège de chaque utilisateur. | Ces tours sont décomptés du plafond de dépenses du siège (le plafond mensuel comme la limite de rafale sur 4 heures), au prix catalogue, comme les tours que sert SecureAI. |

<div class="mac-window">

![Section What runs on Vertex](/img/cloud/vertex-ai-inference/6%20-%20Vertex%20AI%20Inference.png)

</div>

<Info>
Les modèles disponibles dépendent de l'**emplacement**. Les modèles par défaut (dont plusieurs en *preview*) peuvent ne pas exister dans toutes les régions. Si le test de connexion renvoie **Model not available in this location**, choisissez une autre région ou remplacez les modèles par défaut par des modèles que votre région sert. Les modèles ouverts (MaaS) exigent d'accepter leurs conditions dans Vertex AI Model Garden et une région précise.
</Info>

## Étape 4. Tester la connexion

1. Une fois l'intégration enregistrée, sous **Connection test**, cliquez sur **Test connection**.
2. SecureAI envoie une requête minimale à chaque modèle par défaut, **par le même chemin que le trafic réel** (passerelle, politiques et reçus compris), et affiche chaque résultat avec sa latence.

   <div class="mac-window">
   ![Résultat du test de connexion](/img/cloud/vertex-ai-inference/7%20-%20Vertex%20AI%20Inference.png)
   </div>

3. Si un modèle échoue, le panneau en affiche la raison. Consultez la section **Dépannage** à la fin de cette page.

<Info>
Le test envoie quelques requêtes d'un jeton et **est facturé sur votre compte Google** (quelques centimes).
</Info>

## Étape 5. Vérifier le routage et l'activer

1. Ouvrez **Routing preview → Show which lane serves each model**. Pour chaque modèle du catalogue, l'aperçu indique s'il sera servi par **votre Vertex** (et avec quel modèle Vertex) ou par **SecureAI**, et lesquels seront **masqués aux utilisateurs**. L'aperçu simule l'intégration activée, ce qui vous permet d'examiner l'effet avant de l'activer.
2. Lorsque le test réussit, activez **Route traffic to Vertex AI** et cliquez de nouveau sur **Save**. **Si vous n'enregistrez pas, l'interrupteur ne reste pas activé.** Pour l'activer, un projet et un identifiant doivent être configurés. Si votre plan n'autorise pas un fournisseur cloud de plus ou si le routage en chevauche un autre, SecureAI le refuse et en explique la raison (voir **Combien de fournisseurs cloud vous pouvez utiliser**, ci-dessus).

   <div class="mac-window">
   ![Interrupteur Route traffic to Vertex AI activé](/img/cloud/vertex-ai-inference/8%20-%20Vertex%20AI%20Inference.png)
   </div>
3. La carte passe au vert : **Routing to Vertex**. Si elle est enregistrée mais désactivée, elle affiche en orange **Configured · not routing to Vertex**.

Le changement s'applique immédiatement sur le serveur où il a été enregistré et en 30 secondes au maximum sur les autres.

## Étape 6. Vérifier dans le sélecteur de modèles

Lorsque l'intégration est active, les modèles qui s'exécutent sur votre Vertex affichent le **logo Google Cloud** à côté de leur nom dans le sélecteur de modèles du chat. Au survol, il indique que le modèle s'exécute sur le compte Vertex AI de votre organisation.

<div class="mac-window">

![Sélecteur de modèles avec le logo Google Cloud](/img/cloud/vertex-ai-inference/9%20-%20Vertex%20AI%20Inference.png)

</div>

En mode **Remap everything** sans repli, le sélecteur **ne propose que** les modèles que sert votre Vertex. Un modèle sans équivalent recevrait une réponse d'un modèle différent de celui choisi : il est donc masqué.

## Ce qui est facturé, et à qui

- **L'utilisation des LLM est facturée par Google sur votre compte**, et non par SecureAI. Vous verrez le montant dans votre facturation Google Cloud, avec vos remises et vos CUD appliqués.
- SecureAI affiche le coût des tours servis sur Vertex sous forme d'**estimation au prix catalogue**, uniquement à des fins d'analyse. C'est une référence : elle **n'inclut pas** vos remises, donc le montant réel de Google peut être inférieur.
- Les tours servis sur votre Vertex **ne sont pas décomptés du plafond de dépenses du siège de chaque utilisateur**, sauf si vous activez **Apply each seat's spend cap to turns served in your account**. Le **niveau du siège** continue de s'appliquer : un utilisateur ne peut utiliser que les modèles de son niveau ou d'un niveau inférieur, même lorsque votre Vertex les sert.
- Un siège **Govern BYO** ne peut utiliser que les modèles servis sur la propre infrastructure de votre organisation : ceux que sert votre Vertex (ou un autre fournisseur cloud connecté) et les modèles auto-hébergés sur vos serveurs. Tout autre modèle est refusé, et le sélecteur ne lui propose pas **Auto**.

## Sécurité et conformité

- **Identifiants chiffrés, ou aucun.** Avec l'option A, la clé du compte de service est stockée chiffrée (AES-256-GCM) et n'est jamais renvoyée au navigateur, pas même à un administrateur ; l'écran n'affiche que l'adresse e-mail du compte. Avec l'option B, aucune clé n'est stockée : SecureAI demande à Google des jetons de courte durée qui agissent en tant que votre compte de service.
- **Le chemin reste protégé.** Chaque appel passe par la passerelle SMLTP de SecureAI : DLP, un jeton d'autorisation signé par requête et un **reçu signé** vérifiable.
- **Résidence des données.** Avec une région fixée (par exemple `europe-west4`), SecureAI envoie chaque requête au point de terminaison de cette région et applique les politiques de résidence de votre organisation. Le lieu où Google traite la requête dépend des engagements de Google en matière de résidence des données.
- **Échec en mode fermé.** Si la configuration ne peut pas être lue ou si le jeton de Google ne peut pas être obtenu, la requête est refusée ; elle n'est pas envoyée à un autre fournisseur, sauf si vous avez autorisé le repli.
- **Audit.** L'enregistrement, le test ou la déconnexion de l'intégration est consigné dans le journal d'activité, avec le nom des champs modifiés et jamais la clé.
- **Autorisations minimales.** `roles/aiplatform.user` suffit pour l'inférence ; l'intégration n'a pas besoin de lire votre IAM ni votre facturation.

## Déconnecter

**Disconnect** (pied du panneau) supprime la configuration et la clé stockée. À partir de ce moment, **tout le trafic revient aux fournisseurs gérés par SecureAI**. Vous pouvez aussi désactiver seulement l'interrupteur **Route traffic to Vertex AI** pour suspendre le routage tout en conservant la connexion.

Retirez ensuite l'accès dans Google Cloud également :

- **Option A :** si vous n'utilisez plus la clé, **révoquez-la** (Comptes de service → Clés).
- **Option B :** retirez le rôle `roles/iam.serviceAccountTokenCreator` que vous avez accordé au compte de service SecureAI sur votre compte de service (Comptes de service → votre compte → **Autorisations**).

## Dépannage

Voici les raisons que **Test connection** peut afficher :

| Raison | Cause probable | Que faire |
|--------|----------------|-----------|
| Credential rejected or not usable | JSON incomplet ou non valide, ou clé révoquée. Sans clé : il manque au compte SecureAI `roles/iam.serviceAccountTokenCreator` sur votre compte de service, ou l'adresse e-mail est mal saisie | Collez de nouveau le JSON complet ou créez une nouvelle clé. Sans clé : exécutez la commande affichée par le panneau et vérifiez l'adresse e-mail. |
| Not authenticated | Google a rejeté le jeton | Vérifiez que le compte de service existe et qu'il est actif. |
| Vertex AI API is not enabled on the project | L'étape 1.1 n'a pas été faite | Activez l'**Agent Platform API (Vertex AI API)** (`aiplatform.googleapis.com`) sur le projet. |
| Missing roles/aiplatform.user | Autorisation insuffisante | Accordez le rôle **Agent Platform User** (`roles/aiplatform.user`) au compte de service sur ce projet. |
| Model not available in this location | Le modèle n'existe pas dans la région choisie, ou c'est un modèle ouvert dont les conditions n'ont pas été acceptées dans Model Garden | Changez la région ou ce modèle par défaut ; pour les modèles ouverts, acceptez les conditions dans Model Garden. |
| Quota exceeded | Quota Vertex épuisé | Vérifiez les quotas du projet ou demandez une augmentation à Google. |
| Google returned an error | Défaillance du côté de Google | Réessayez ; si le problème persiste, consultez l'état de Google Cloud. |
| Blocked by your SMLTP model policy | La politique de SecureAI n'autorise pas le modèle | Ajoutez le modèle à la politique autorisée. |
| SMLTP Vertex gateway unreachable / TLS error | Problème d'infrastructure de SecureAI | Contactez le support. Cela ne dépend pas de votre projet Google. |
| Unexpected error | Une défaillance que SecureAI n'a pas pu classer | Réessayez. Si le problème persiste, contactez le support avec le message affiché par le panneau. |
| No default models configured | Les quatre modèles par défaut sont vides, il n'y a donc rien à tester | Renseignez-en au moins un sous **Default Vertex models**, enregistrez et testez de nouveau. |

Erreurs que les utilisateurs peuvent voir dans le chat :

| Code | Signification |
|------|---------------|
| `SAI-VERTEX-001` | Le modèle choisi n'a pas d'équivalent sur Vertex et le repli est désactivé. Choisissez un autre modèle ou autorisez le repli. |
| `SAI-VERTEX-002` | L'accès à Google n'a pas pu être obtenu (clé non valide ou révoquée ou, sans clé, l'autorisation d'emprunt d'identité a été retirée). Renouvelez l'identifiant. |
| `SAI-VERTEX-005` | La configuration n'a pas pu être lue et la requête a été refusée par sécurité. Réessayez dans quelques secondes. |

## Limitations actuelles

- **Claude et Mistral sur Vertex** ne sont pas pris en charge (ils utilisent une API différente).
- **Les embeddings, le reclassement, l'OCR, l'assistant d'administration, la génération d'images et la voix en temps réel** restent sur les fournisseurs gérés par SecureAI.
- **Un seul projet et un seul emplacement Vertex** par organisation.
- Le nombre de fournisseurs d'inférence que vous pouvez activer en même temps dépend de votre plan (Scale : 1, Enterprise : jusqu'à 3). Voir [Azure AI Foundry — Inference on your account](/en/integrations/cloud/azure-ai-foundry-inference) et [Amazon Bedrock — Inference on your account](/en/integrations/cloud/aws-bedrock-inference).
- Le proxy **Claude Code** utilise Anthropic directement et ne passe pas par Vertex.

## Connexes

- [Google Cloud — Discovery](/fr/integrations/cloud/gcp-vertex-ai) — inventaire des agents, des modèles, des identités et des coûts du projet.
- [Azure AI Foundry — Inference on your account](/en/integrations/cloud/azure-ai-foundry-inference)
- [Amazon Bedrock — Inference on your account](/en/integrations/cloud/aws-bedrock-inference)
- [Présentation des fournisseurs Cloud AI](/fr/integrations/cloud/overview)
- [Reçus signés](/fr/api/receipts)
