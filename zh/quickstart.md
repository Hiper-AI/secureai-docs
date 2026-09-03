---
title: "快速入门指南（快速入门）"
description: "只需几分钟即可开始使用 SecureAI：访问平台、配置向导并创建您的第一个 RAG 索引。"
---

本指南将逐步引导您访问组织的 SecureAI 实例、选择身份验证方法并部署您的第一个 AI 知识库。

---

<Steps>
  <Step title="访问您的企业实例">
    在网络浏览器中输入为您的组织提供的地址：

    ```bash
    https://{tu-empresa}.hiperai.ai
    ```

    单击主 **“开始”** 按钮开始访问流程。
  </Step>

  <Step title="选择身份验证方法">
    根据您公司签约的套餐，选择相应的方式：

    <Tabs>
      <Tab title="公司账户 (SSO)">
        如果您的组织集成了 **Microsoft Entra ID (Azure)** 或 **Google Workspace**，请点击 **“企业帐户”**。

        您将被自动重定向到您常用的身份提供商以安全、联合地登录。
      </Tab>
      <Tab title="基本认证">
        如果您的团队尚未将登录与 SSO 联合，请选择 **“基本身份验证”** 选项并使用管理员提供的电子邮件和密码登录。
      </Tab>
    </Tabs>
  </Step>

  <Step title="设置助理偏好设置">
    第一次进入时，您将看到一个欢迎向导（**启动设置**），允许您校准 AI 将如何与您交互：

    - **温度（`Temperature`）：调整分析精度（低值）和响应创造力（高值）之间的平衡。**
    - **响应长度（`Response Length`）：定义生成的消息的默认大小。**
    - **界面主题（`Theme`）：选择浅色模式、深色模式或与系统同步。**
    - **AI 头像：使用高级许可证，您可以使用文本提示生成自定义头像。**

  </Step>

  <Step title="创建您的第一个 RAG（知识库）索引">
    在初始配置期间，您将能够显示您自己的**RAG（检索增强生成）索引**：

    - **多云部署：选择您偏好的区域和云提供商。**
    - **端到端加密：所有矢量化信息和文档均使用专用密钥进行加密。**
    - **个人或团队知识库：允许您上传文档（PDF、文档、代码），以便模型根据您的业务的确切背景做出响应。**

  </Step>

  <Step title="连接发现和可见性源（云、CASB 和代理）">
    为了获得完整的可见性并审核组织中的 AI 使用情况，我们建议启用三个主要发现源：

    - **集成云和 AI 提供商（NHI 库存）：在[云提供商](/zh/integrations/cloud/overview) 中连接 OpenAI、Anthropic、AWS 或 Azure AI 等控制台。这使您可以自动跟踪 **非人类身份 (NHIs)**、孤立 API 密钥和云消耗。**
    - **集成 CASB 和网络安全 (SWG)：连接 [Cisco Umbrella](/zh/integrations/casb/overview) 或其他代理来监控企业到外部 AI 服务的流量。**
    - **在设备上部署 SecureAI Agent：在团队计算机上安装 [SecureAI Endpoint Agent](/zh/agent/installation) 以审核本地应用程序、检测 **MCP（模型上下文协议）** 服务器和连接器、自治代理，并应用出口强制策略。**

  </Step>

  <Step title="准备好！开始互动和治理">
    设置完成并连接您的来源后，您将可以访问安全的公司聊天、RAG 知识库以及实时遥测和治理仪表板。
  </Step>
</Steps>

---

## 🚀 下一步

继续探索您可以使用该平台做的一切：

<CardGroup cols={2}>
  <Card title="可用型号" icon="brain" href="/zh/models">
    比较每种模型的优势以及何时选择每种模型。
  </Card>
  <Card title="通过 API 集成" icon="code" href="/zh/api">
    使用 OpenAI 兼容端点连接您的内部系统。
  </Card>
  <Card title="安全和 SMLTP" icon="shield-halved" href="/zh/security/overview">
    了解 SecureAI 如何防止敏感信息泄露 (DLP)。
  </Card>
  <Card title="安装端点代理" icon="network-wired" href="/zh/agent/overview">
    监控和管理公司团队中人工智能工具的使用情况。
  </Card>
</CardGroup>
