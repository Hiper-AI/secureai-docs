---
title: "Guia de início rápido (início rápido)"
description: "Comece a usar o SecureAI em minutos: acesse a plataforma, configure o assistente e crie seu primeiro índice RAG."
---

Este guia orientará você passo a passo para acessar a instância SecureAI da sua organização, escolher seu método de autenticação e implantar sua primeira base de conhecimento de IA.

---

<Steps>
  <Step title="Acesse sua instância corporativa">
    Digite em seu navegador o endereço fornecido para sua organização:

    ```bash
    https://{tu-empresa}.hiperai.ai
    ```

    Clique no botão principal **"Começar"** para iniciar o fluxo de acesso.
  </Step>

  <Step title="Selecione o método de autenticação">
    Dependendo do plano contratado pela sua empresa, selecione a modalidade correspondente:

    <Tabs>
      <Tab title="Conta Corporativa (SSO)">
        Se sua organização tiver o **Microsoft Entra ID (Azure)** ou o **Google Workspace** integrado, clique em **"Conta empresarial"**.

        Você será automaticamente redirecionado para seu provedor de identidade habitual para fazer login de forma segura e federada.
      </Tab>
      <Tab title="Autenticação Básica">
        Caso sua equipe ainda não federou o login com SSO, selecione a opção **"Autenticação Básica"** e faça login com seu e-mail e senha fornecidos pelo administrador.
      </Tab>
    </Tabs>
  </Step>

  <Step title="Definir preferências do assistente">
    Ao entrar pela primeira vez, você verá um assistente de boas-vindas (**Configuração de inicialização**) que permite calibrar como a IA irá interagir com você:

    - **Temperatura (`Temperatura`): Ajusta o equilíbrio entre precisão analítica (valores baixos) e criatividade nas respostas (valores altos).**
    - **Comprimento da Resposta (`Response Length`): Define o tamanho padrão das mensagens geradas.**
    - **Tema da Interface (`Tema`): Selecione entre modo claro, modo escuro ou sincronização com o sistema.**
    - **AI Avatar: Com licenças premium, você pode gerar um avatar personalizado usando um prompt de texto.**

  </Step>

  <Step title="Crie seu primeiro índice RAG (Base de Conhecimento)">
    Durante a configuração inicial, você poderá exibir seu próprio índice **RAG (Retrieval-Augmented Generation)**:

    - **Implantação multinuvem: selecione a região e o provedor de nuvem de sua preferência.**
    - **Criptografia ponta a ponta: todas as informações e documentos vetorizados são criptografados com chaves exclusivas.**
    - **Base de Conhecimento Pessoal ou de Equipe: Permite fazer upload de documentos (PDFs, docs, código) para que os modelos respondam com o contexto exato do seu negócio.**

  </Step>

  <Step title="Conecte fontes de descoberta e visibilidade (nuvem, CASB e agente)">
    Para obter visibilidade completa e auditar o uso de IA em sua organização, recomendamos habilitar as três principais fontes de descoberta:

    - **Integrar nuvens e provedores de IA (inventário NHI): Conecte consoles como OpenAI, Anthropic, AWS ou Azure AI em [Provedores de nuvem](/pt/integrations/cloud/overview). Isso permite que você rastreie automaticamente **Identidades Não Humanas (NHIs)**, chaves de API órfãs e consumo de nuvem.**
    - **Integre CASB e segurança de rede (SWG): conecte [Cisco Umbrella](/pt/integrations/casb/overview) ou outros proxies para monitorar o tráfego corporativo para serviços externos de IA.**
    - **Implante o SecureAI Agent em dispositivos: instale o [SecureAI Endpoint Agent](/pt/agent/installation) nos computadores da sua equipe para auditar aplicativos locais, detectar servidores e conectores **MCP (Model Context Protocol)**, agentes autônomos e aplicar políticas de aplicação de saída.**

  </Step>

  <Step title="Preparar! Comece a interagir e governar">
    Depois que a configuração for concluída e suas fontes estiverem conectadas, você terá acesso ao chat corporativo seguro, às suas bases de conhecimento RAG e ao painel de telemetria e governança em tempo real.
  </Step>
</Steps>

---

## 🚀 Próximas etapas

Continue explorando tudo o que você pode fazer com a plataforma:

<CardGroup cols={2}>
  <Card title="Modelos Disponíveis" icon="brain" href="/pt/models">
    Compare os pontos fortes de cada modelo e quando escolher cada um.
  </Card>
  <Card title="Integração via API" icon="code" href="/pt/api">
    Conecte seus sistemas internos usando endpoints compatíveis com OpenAI.
  </Card>
  <Card title="Segurança e SMLTP" icon="shield-halved" href="/pt/security/overview">
    Saiba como o SecureAI evita o vazamento de informações confidenciais (DLP).
  </Card>
  <Card title="Instalar o Agente Endpoint" icon="network-wired" href="/pt/agent/overview">
    Monitore e governe o uso de ferramentas de IA nas equipes da sua empresa.
  </Card>
</CardGroup>
