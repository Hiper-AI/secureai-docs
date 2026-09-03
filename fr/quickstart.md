---
title: "Guide de démarrage rapide (Quickstart)"
description: "Commencez à utiliser SecureAI en quelques minutes : accédez à la plateforme, configurez l'assistant et créez votre premier index RAG."
---

Ce guide vous guidera étape par étape pour accéder à l'instance SecureAI de votre organisation, choisir votre méthode d'authentification et déployer votre première base de connaissances IA.

---

<Steps>
  <Step title="Accédez à votre instance d'entreprise">
    Saisissez dans votre navigateur Web l'adresse fournie pour votre organisation :

    ```bash
    https://{tu-empresa}.hiperai.ai
    ```

    Cliquez sur le bouton principal **"Commencer"** pour démarrer le flux d'accès.
  </Step>

  <Step title="Sélectionnez la méthode d'authentification">
    En fonction du forfait souscrit par votre entreprise, sélectionnez la méthode correspondante :

    <Tabs>
      <Tab title="Compte d'entreprise (SSO)">
        Si votre organisation intègre **Microsoft Entra ID (Azure)** ou **Google Workspace**, cliquez sur **« Compte d'entreprise »**.

        Vous serez automatiquement redirigé vers votre fournisseur d'identité habituel pour vous connecter de manière sécurisée et fédérée.
      </Tab>
      <Tab title="Authentification de base">
        Si votre équipe n'a pas encore fédéré la connexion avec SSO, sélectionnez l'option **"Basic Auth"** et connectez-vous avec votre email et votre mot de passe fournis par l'administrateur.
      </Tab>
    </Tabs>
  </Step>

  <Step title="Définir les préférences de l'assistant">
    Lors de votre première connexion, vous verrez un assistant de bienvenue (**Startup Setup**) qui vous permet de calibrer la façon dont l'IA interagira avec vous :

    - **Température (« Température ») : ajuste l'équilibre entre la précision analytique (valeurs faibles) et la créativité dans les réponses (valeurs élevées).**
    - **Longueur de réponse (« Réponse Longueur ») : définit la taille par défaut des messages générés.**
    - **Thème d'interface (« Thème ») : Choisissez entre le mode clair, le mode sombre ou la synchronisation avec le système.**
    - **AI Avatar : avec les licences premium, vous pouvez générer un avatar personnalisé à l’aide d’une invite texte.**

  </Step>

  <Step title="Créez votre premier index RAG (Knowledge Base)">
    Lors de la configuration initiale, vous pourrez afficher votre propre **index RAG (Retrieval-Augmented Generation)** :

    - **Déploiement multi-cloud : sélectionnez la région et le fournisseur de cloud de votre préférence.**
    - **Cryptage de bout en bout : toutes les informations et documents vectorisés sont cryptés avec des clés exclusives.**
    - **Base de connaissances personnelle ou d'équipe : permet de télécharger des documents (PDF, docs, code) afin que les modèles répondent au contexte exact de votre entreprise.**

  </Step>

  <Step title="Connectez les sources de découverte et de visibilité (Cloud, CASB et Agent)">
    Pour obtenir une visibilité complète et auditer l'utilisation de l'IA dans votre organisation, nous vous recommandons d'activer les trois principales sources de découverte :

    - **Intégrer les Clouds et les fournisseurs d'IA (NHI Inventory) : Connectez des consoles telles que OpenAI, Anthropic, AWS ou Azure AI dans [Cloud Providers](/fr/integrations/cloud/overview). Cela vous permet de suivre automatiquement les **identités non humaines (NHI)**, les clés API orphelines et la consommation du cloud.**
    - **Intégrez CASB et Network Security (SWG) : connectez [Cisco Umbrella](/fr/integrations/casb/overview) ou d'autres proxys pour surveiller le trafic de l'entreprise vers des services d'IA externes.**
    - **Déployez l'agent SecureAI sur les appareils : installez [SecureAI Endpoint Agent](/fr/agent/installation) sur les ordinateurs de votre équipe pour auditer les applications locales, détecter les serveurs et connecteurs **MCP (Model Context Protocol)**, les agents autonomes et appliquer les politiques d'application de sortie.**

  </Step>

  <Step title="Prêt! Commencez à interagir et à gouverner">
    Une fois la configuration terminée et vos sources connectées, vous aurez accès au chat d'entreprise sécurisé, à vos bases de connaissances RAG et au tableau de bord de télémétrie et de gouvernance en temps réel.
  </Step>
</Steps>

---

## 🚀 Prochaines étapes

Continuez à explorer tout ce que vous pouvez faire avec la plateforme :

<CardGroup cols={2}>
  <Card title="Modèles disponibles" icon="brain" href="/fr/models">
    Comparez les points forts de chaque modèle et quand choisir chacun d’eux.
  </Card>
  <Card title="Intégration via API" icon="code" href="/fr/api">
    Connectez vos systèmes internes à l’aide de points de terminaison compatibles OpenAI.
  </Card>
  <Card title="Sécurité et SMLTP" icon="shield-halved" href="/fr/security/overview">
    Découvrez comment SecureAI prévient les fuites d'informations sensibles (DLP).
  </Card>
  <Card title="Installer l'agent de point de terminaison" icon="network-wired" href="/fr/agent/overview">
    Surveillez et gouvernez l’utilisation des outils d’IA au sein des équipes de votre entreprise.
  </Card>
</CardGroup>
