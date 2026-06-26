---
name: prompt-intelligence-engine
description: Turn rough one-line prompts into structured, expert-level prompts. Use when the user asks to improve/optimize/rewrite/refine a prompt, or pastes a vague request and wants the best version before running it. Auto-detects intent, picks an expert role, fills gaps with surfaced assumptions, scores quality, and offers to run the result.
license: MIT
---

# Prompt Intelligence Engine

Transform a rough, one-line prompt into a structured, expert-level prompt — behaving like a
senior consultant, not a text rewriter. Detect intent, adopt the right expert role, infer
context, fill gaps with **surfaced** assumptions, score quality, and offer to execute.

## When to use

Trigger when the user:
- asks to "improve / optimize / rewrite / refine / fix" a prompt, or
- pastes a vague request and asks for the best version before running it, or
- explicitly invokes this skill.

Do **not** trigger on normal task requests the user simply wants done. If they say "write the
login API", just write it — only optimize the *prompt* when they ask about the prompt itself
(or invoke this skill).

## How it works (adaptive pipeline)

Difficulty estimation is the **master gate** and runs first — it decides how many stages fire.
A trivial prompt gets a light pass; an enterprise prompt gets the full compiler.

Execution order:

```
difficulty estimate → intent → context → role → skill-level →
hidden-requirement expansion → (tiered stages) → output-format → scorecard
```

| Stage | Fires at tier | Detail in |
|-------|---------------|-----------|
| Difficulty estimate (simple / medium / complex / enterprise) | all (first) | references/pipeline.md |
| Intent classification (~13 task types) | all | references/domain-playbooks.md |
| Context inference (mine the conversation) | all | references/pipeline.md |
| Role selection (auto expert persona) | all | references/domain-playbooks.md |
| Skill-level detection | all | references/pipeline.md |
| Hidden-requirement expansion | all | references/domain-playbooks.md |
| Output-format choice | all | references/pipeline.md |
| Missing-constraint placeholders `[ASSUMED: …]` | medium+ | references/pipeline.md |
| Success criteria | medium+ | references/pipeline.md |
| Auto few-shot | medium+ | references/pipeline.md |
| Lint scorecard + quality score | medium+ | references/scoring.md |
| Task decomposition (phases) | complex+ | references/pipeline.md |
| Self-critique → improve once | complex+ | references/pipeline.md |
| Prompt compression | complex+ | references/scoring.md |
| Prompt AST (fill only missing parts) | complex+ | references/pipeline.md |

**Load reference files only when the tier needs them.** For a `simple` prompt you do not need
to open `scoring.md` or the complex-tier sections of `pipeline.md`. Read:
- `references/pipeline.md` — full stage instructions.
- `references/domain-playbooks.md` — intent taxonomy → role + domain enhancers + hidden reqs.
- `references/scoring.md` — the 8-dimension lint scorecard, the ≥90 gate, compression rules.
- `examples/transformations.md` — before→after examples to calibrate quality.

## Core rules

1. **Surface every assumption.** When you fill a gap, mark it `[ASSUMED: …]`. Never silently
   invent a constraint, version, or requirement.
2. **Preserve the user's intent.** Fill in only what is missing (the AST principle). Do not
   redirect the task to something you find more interesting.
3. **Quality gate ≥ 90.** Compute the lint score (medium+). If < 90, run ONE silent improve
   pass before showing output. The user should only ever see a prompt scoring ≥ 90 — unless it
   genuinely cannot reach it, in which case flag the weak dimension with `⚠`.
4. **Scale to the tier.** Do not bury a "fix this CSS" prompt under phases and critique logs.
5. **Offer, don't auto-run.** Always end with the run offer; wait for the user.

## Output contract (every invocation)

```
🧠 Prompt Intelligence — <Intent> · <Difficulty tier>

Role:        <auto-selected expert>
Assumptions: [ASSUMED: …] · [ASSUMED: …]
Quality:     92/100  (clarity ✓ · role ✓ · constraints ⚠ · format ✓ · success-criteria ✓)

─── Optimized Prompt ─────────────────────────
<the rewritten, structured prompt — ready to copy or run>
──────────────────────────────────────────────

▸ Run this now? (yes / edit / show your work)
```

- **`yes`** → execute the optimized prompt in the same conversation.
- **`edit`** → the user corrects an assumption or detail; re-emit the optimized prompt.
- **`show your work`** → expand full diagnostics: intent reasoning, the prompt-AST table, the
  hidden-requirements list, the critique pass, and compression before/after token counts.

For the **enterprise** tier, the "Optimized Prompt" block *is* the phased decomposition
(Phase 1…N), not a single blob.

Keep the default output to the compact form above. Reserve the full report for "show your work".
