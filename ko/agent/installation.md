---
sidebar_position: 2
title: "에이전트 설치"
sidebar_label: "설치"
description: "Windows, Linux 및 macOS 엔드포인트에 SecureAI OS 에이전트 설치"
---
# 에이전트 설치

SecureAI OS 에이전트는 **관리자 → 에이전트 레지스트리 → OS 에이전트**에서 빌드한 **설치 프로그램 패키지**에서 설치됩니다. 패키지는 **백엔드 URL** 및 범위가 지정된 **등록 키**라는 두 가지 값을 전달하는 즉시 실행 가능한 명령(Windows) 또는 스크립트(Linux/macOS)를 생성합니다. 전체 패키지 빌더 및 등록 메커니즘은 [등록 및 설치 프로그램 패키지](/ko/agent/enrollment-and-packages)를 참조하세요.

## 윈도우(MSI)

Windows는 **코드 서명된 MSI**를 사용합니다. MSI는 다운로드될 때 수정되지 않으므로 해당 Authenticode 서명이 유효한 상태로 유지됩니다. 구성은 파일에 구워지는 대신 설치 시 `msiexec` 명령줄을 통해 전달됩니다.

```powershell
msiexec /i "secureai-agent.msi" /qb BACKEND_URL=https://{customer.name}.hiperai.ai ENROLL_KEY=sk-...
```

| 부동산 | 설명 |
|----------|-------------|
| `BACKEND_URL` | SecureAI 백엔드 원본(엔드포인트는 여기에서 홈을 호출합니다). |
| `ENROLL_KEY` | 설치 프로그램 패키지의 범위가 지정된 `agent:enroll` 키입니다. |

설치 프로그램 패널에는 값이 미리 입력된 정확한 명령이 표시됩니다. 직접 복사하세요.

<Tip>
**대규모 배포**

기존 MDM/RMM(Intune, GPO, SCCM 등)을 통해 동일한 `msiexec` 명령을 푸시합니다. URL과 키는 명령줄 속성이므로 하나의 서명된 MSI가 모든 테넌트와 그룹에 대해 작동합니다.
</Tip>

## Linux / macOS(스크립트)

설치 프로그램 패키지에서 자체 포함된 셸 스크립트를 다운로드하고 실행합니다. 스크립트는 적절한 `.deb`/`.pkg`를 가져와 에이전트 구성(예: Linux의 `/etc/secureai-agent.toml`, macOS의 LaunchAgent plist)을 작성합니다.

```bash
sudo ./secureai-agent-install.sh
```

백엔드 URL과 등록 키는 패키지에 대해 생성된 스크립트에 이미 포함되어 있습니다.

## 처음 실행하면 어떻게 되나요?

에이전트가 처음 실행되면 **등록**: 등록 키를 제시하고, 장치를 등록하고, 장치별 토큰과 해당 런타임 구성을 받습니다. 그런 다음 하트비트를 시작하고 해결된 [정책](/ko/agent/policies-and-groups)을 적용합니다. 백엔드 URL 확인 방법 및 기기 토큰 순환 방법을 포함한 자세한 내용은 [등록 및 설치 프로그램 패키지](/ko/agent/enrollment-and-packages)를 참조하세요.

## 관련

- [등록 및 설치 프로그램 패키지](/ko/agent/enrollment-and-packages)
- [정책 및 그룹](/ko/agent/policies-and-groups)
- [엔드포인트 에이전트 개요](/ko/agent/overview)