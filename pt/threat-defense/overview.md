---
sidebar_position: 1
title: "Threat Defense"
---



# Threat Defense

Threat Defense provides real-time protection against malicious prompt attacks, jailbreaks, instruction leaks, and output manipulation.

---

## Protected Threat Vectors

| Threat | Description |
|---|---|
| **Prompt Injection** | Attempts to override or bypass system instructions and constraints. |
| **Jailbreaks** | Adversarial prompts designed to circumvent safety guardrails. |
| **Instruction / System Prompt Leakage** | Extraction attacks attempting to reveal proprietary instructions. |
| **Role Drift / Hijacking** | Manipulating the assistant to deviate from its intended business domain. |
| **Data Extraction Attacks** | Automated attempts to harvest confidential training or index data. |
| **Canary Token Leaks** | Detection of hidden canary strings signaling instruction exposure. |

---

## Key Modules

### 1. Prompt Shield Engine
Evaluates every incoming prompt before it reaches the language model:
- **Allow**: Request passes all safety checks.
- **Flag**: Request is permitted, but logged as a security event for administrative review.
- **Block**: Request is blocked immediately with a signed denial event.

### 2. Output Guardrails
Monitors model outputs prior to client delivery to catch:
- System prompt and internal context leakage.
- Canary token leakage.
- Unintended role drift or dangerous outputs.

### 3. Canary Tokens
Canary tokens are unique, hidden cryptographic markers inserted into chatbot instructions:
- **How it works**: If an attacker succeeds in extracting instructions, the canary marker in the response triggers an immediate high-priority security alert.
- **Configuration**: Go to **Admin ? Threat Defense ? Canary Tokens** to generate, rotate, or monitor tokens.

---

## Policy Configuration & Incident Management

1. **Configure Policies**: Go to **Admin ? Threat Defense ? Policies**. Select from **Strict** (public chatbots), **Balanced** (standard enterprise use), or **Permissive** (testing environments).
2. **Review Incidents**: Inspect flagged or blocked events under **Admin ? Threat Defense ? Incidents** to analyze attack payloads and adjust sensitivity.
