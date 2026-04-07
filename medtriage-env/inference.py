# inference.py — place in project root
import os, asyncio, json
from openai import OpenAI
from env.environment import MedTriageEnv
from env.models import TriageAction

API_BASE_URL = os.environ.get("API_BASE_URL", "https://api.openai.com/v1")
MODEL_NAME = os.environ.get("MODEL_NAME", "gpt-4o")
HF_TOKEN = os.environ.get("HF_TOKEN", "")

TASKS = ["task_01_basic_triage", "task_02_differential", "task_03_critical_triage"]
MAX_STEPS = 15
SYSTEM_PROMPT = """You are an AI triage nurse. Assess the patient and respond with JSON only:
{"action_type": "...", "parameters": {...}}
Actions: ask_question | order_test | flag_critical | assign_triage | request_vitals
Assign ESI 1 (critical) to 5 (non-urgent)."""

def log_start(task, model):
    print(json.dumps({"event":"START","task":task,"model":model}), flush=True)

def log_step(step, action, reward, done, error=None):
    print(json.dumps({"event":"STEP","step":step,"action":action, "reward":round(reward,4),"done":done,"error":error}), flush=True)

def log_end(success, steps, score, rewards):
    print(json.dumps({"event":"END","success":success,"steps":steps, "score":round(score,4),"rewards":[round(r,4) for r in rewards]}), flush=True)

async def run_episode(client, task_id):
    env = MedTriageEnv(task_id=task_id)
    log_start(task=task_id, model=MODEL_NAME)
    result = await env.reset()
    rewards, steps_taken = [], 0
    
    for step in range(1, MAX_STEPS + 1):
        if result.done:
            break
            
        obs_text = result.observation.model_dump_json(indent=2)
        
        try:
            completion = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[{"role":"system","content":SYSTEM_PROMPT}, {"role":"user","content":f"Patient: {obs_text} Your action:"}],
                max_tokens=150,
                temperature=0.1
            )
            raw = completion.choices[0].message.content.strip()
            # Handle potential JSON markdown
            if "```json" in raw:
                raw = raw.split("```json")[1].split("```")[0].strip()
            elif "```" in raw:
                raw = raw.split("```")[1].split("```")[0].strip()
                
            action = TriageAction(**json.loads(raw))
        except Exception as e:
            log_step(step, raw if 'raw' in locals() else "Error reading raw", 0.0, False, error=str(e))
            continue
            
        result = await env.step(action)
        rewards.append(result.reward)
        steps_taken = step
        log_step(step, raw, result.reward, result.done)
        
        if result.done:
            break
            
    score = min(max(sum(rewards)/MAX_STEPS if rewards else 0.0, 0.0), 1.0)
    log_end(success=score>=0.6, steps=steps_taken, score=score, rewards=rewards)

async def main():
    client = OpenAI(base_url=API_BASE_URL, api_key=HF_TOKEN or "none")
    for task in TASKS:
        await run_episode(client, task)

if __name__ == "__main__":
    asyncio.run(main())
