---
title: "빠른 시작 가이드(빠른 시작)"
description: "몇 분 안에 SecureAI 사용을 시작하세요. 플랫폼에 액세스하고 마법사를 구성하고 첫 번째 RAG 인덱스를 생성하세요."
---

이 가이드는 조직의 SecureAI 인스턴스에 액세스하고, 인증 방법을 선택하고, 첫 번째 AI 지식 베이스를 배포하는 방법을 단계별로 안내합니다.

---

<Steps>
  <Step title="기업 인스턴스에 액세스">
    귀하의 조직에 제공된 주소를 웹 브라우저에 입력하십시오.

    ```bash
    https://{tu-empresa}.hiperai.ai
    ```

    기본 **"시작하기"** 버튼을 클릭하여 액세스 흐름을 시작하세요.
  </Step>

  <Step title="인증방법 선택">
    회사와 계약한 요금제에 따라 해당하는 방법을 선택하세요.

    <Tabs>
      <Tab title="기업 계정(SSO)">
        조직에 **Microsoft Entra ID(Azure)** 또는 **Google Workspace**가 통합되어 있는 경우 **"엔터프라이즈 계정"**을 클릭하세요.

        안전하고 연합된 로그인을 위해 자동으로 일반 ID 공급자로 리디렉션됩니다.
      </Tab>
      <Tab title="기본 인증">
        팀에서 아직 로그인을 SSO와 통합하지 않은 경우 **"기본 인증"** 옵션을 선택하고 관리자가 제공한 이메일과 비밀번호로 로그인하세요.
      </Tab>
    </Tabs>
  </Step>

  <Step title="어시스턴트 기본 설정 지정">
    처음으로 들어가면 AI가 사용자와 상호 작용하는 방식을 조정할 수 있는 환영 마법사(**시작 설정**)가 표시됩니다.

    - **온도(`Temperature`): 분석 정밀도(낮은 값)와 반응의 창의성(높은 값) 사이의 균형을 조정합니다.**
    - **응답 길이(`응답 길이`): 생성된 메시지의 기본 크기를 정의합니다.**
    - **인터페이스 테마('테마'): 밝은 모드, 어두운 모드 또는 시스템과의 동기화 중에서 선택합니다.**
    - **AI 아바타: 프리미엄 라이선스를 사용하면 텍스트 프롬프트를 사용하여 사용자 정의 아바타를 생성할 수 있습니다.**

  </Step>

  <Step title="첫 번째 RAG(지식 기반) 색인 만들기">
    초기 구성 중에 자체 **RAG(검색 증강 생성) 색인**을 표시할 수 있습니다.

    - **다중 클라우드 배포: 원하는 지역 및 클라우드 제공업체를 선택하세요.**
    - **종단간 암호화: 벡터화된 모든 정보와 문서는 전용 키로 암호화됩니다.**
    - **개인 또는 팀 기술 자료: 모델이 비즈니스의 정확한 맥락에 응답할 수 있도록 문서(PDF, 문서, 코드)를 업로드할 수 있습니다.**

  </Step>

  <Step title="검색 및 가시성 소스 연결(클라우드, CASB 및 에이전트)">
    조직에서 완전한 가시성을 확보하고 AI 사용을 감사하려면 다음 세 가지 주요 검색 소스를 활성화하는 것이 좋습니다.

    - **클라우드 및 AI 공급자 통합(NHI Inventory): [클라우드 공급자](/ko/integrations/cloud/overview)에서 OpenAI, Anthropic, AWS 또는 Azure AI와 같은 콘솔을 연결합니다. 이를 통해 **NHI(Non-Human Identities)**, 고아 API 키 및 클라우드 소비를 자동으로 추적할 수 있습니다.**
    - **CASB 및 네트워크 보안(SWG) 통합: [Cisco Umbrella](/ko/integrations/casb/overview) 또는 기타 프록시를 연결하여 외부 AI 서비스에 대한 기업 트래픽을 모니터링합니다.**
    - **장치에 SecureAI 에이전트 배포: 팀 컴퓨터에 [SecureAI 엔드포인트 에이전트](/ko/agent/installation)를 설치하여 로컬 애플리케이션을 감사하고 **MCP(모델 컨텍스트 프로토콜)** 서버 및 커넥터, 자율 에이전트를 감지하고 송신 시행 정책을 적용합니다.**

  </Step>

  <Step title="준비가 된! 상호 작용 및 관리 시작">
    설정이 완료되고 소스가 연결되면 안전한 기업 채팅, RAG 지식 기반, 실시간 원격 측정 및 거버넌스 대시보드에 액세스할 수 있습니다.
  </Step>
</Steps>

---

## 🚀 다음 단계

플랫폼으로 할 수 있는 모든 것을 계속해서 탐색해 보세요.

<CardGroup cols={2}>
  <Card title="사용 가능한 모델" icon="brain" href="/ko/models">
    각 모델의 장점을 비교하고 각 모델을 선택하는 시기를 비교하세요.
  </Card>
  <Card title="API를 통한 통합" icon="code" href="/ko/api">
    OpenAI 호환 엔드포인트를 사용하여 내부 시스템을 연결하세요.
  </Card>
  <Card title="보안 및 SMLTP" icon="shield-halved" href="/ko/security/overview">
    SecureAI가 민감한 정보 유출(DLP)을 어떻게 방지하는지 알아보세요.
  </Card>
  <Card title="엔드포인트 에이전트 설치" icon="network-wired" href="/ko/agent/overview">
    회사 팀의 AI 도구 사용을 모니터링하고 관리합니다.
  </Card>
</CardGroup>
