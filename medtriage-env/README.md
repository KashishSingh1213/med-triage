# MedTriage-Env: The First AI Medical Triage Decision Environment for OpenEnv

MedTriage-Env is a specialized reinforcement learning and agentic environment designed to evaluate LLM agents on medical triage decision-making. 

## Overview
As an AI emergency room triage nurse, the agent must assess synthetic patient presentations, order diagnostics, identify red flags, and assign an ESI priority level (1–5) based on the Emergency Severity Index.

## Task Difficulty
1. **Easy**: Basic Triage Classification (ESI 4–5).
2. **Medium**: Multi-Symptom Differential Triage (ESI 2–3).
3. **Hard**: Critical Multi-System Failure (ESI 1).

## Action Space
- `ask_question`: Ask clinical questions.
- `order_test`: Order labs/imaging.
- `flag_critical`: Identified a red-flag symptom.
- `assign_triage`: Assign definitive ESI level.
- `request_vitals`: Reveal more detailed vital sign.

## Setup & Implementation
- **Dockerfile**: Optimized for HF Spaces deployment.
- **Pydantic**: Robust I/O validation.
- **Dense Rewards**: Multi-signal feedback at every step.

## Baseline Results
- Llama-3-8B (Task 1): ~0.85
- GPT-4o (Task 3): ~0.70
