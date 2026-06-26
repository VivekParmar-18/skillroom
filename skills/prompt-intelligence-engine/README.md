# 🧠 Prompt Intelligence Engine

A Claude Agent Skill that turns rough, one-line prompts into **structured, expert-level
prompts** — behaving like a senior consultant, not a text rewriter.

Give it `build login API` and it detects the intent, adopts the right expert role, infers your
stack from the conversation, fills the gaps with **surfaced assumptions**, scores the result,
and offers to run it.

## What it does

An adaptive pipeline, gated by difficulty so simple prompts stay fast and big ones get the full
treatment:

- **Intent classification** — ~13 task types (coding, research, debugging, SQL, AWS, QA,
  marketing, resume, LinkedIn, career, docs, education, brainstorming).
- **Automatic expert role** — picks the persona; you never write "act as…".
- **Context inference** — reuses stack/versions/decisions already stated in the conversation.
- **Hidden-requirement expansion** — e.g. a login API silently implies auth, validation,
  rate-limiting, logging, tests.
- **Surfaced assumptions** — every gap filled is tagged `[ASSUMED: …]`, never hidden.
- **Quality scorecard** — an 8-dimension lint score; auto-improves anything below 90/100.
- **Task decomposition + self-critique + compression** — for complex/enterprise prompts.

### Output

```
🧠 Prompt Intelligence — coding · medium

Role:        Senior Backend Engineer
Assumptions: [ASSUMED: Spring Boot 3 / Java 17] · [ASSUMED: MySQL]
Quality:     94/100  (clarity ✓ · role ✓ · constraints ✓ · format ✓ · success-criteria ✓)

─── Optimized Prompt ─────────────────────────
<a polished, structured prompt — ready to copy or run>
──────────────────────────────────────────────

▸ Run this now? (yes / edit / show your work)
```

## Install

Copy this folder into your Claude skills directory:

```bash
# Claude Code (per-user)
cp -r prompt-intelligence-engine ~/.claude/skills/
```

Then restart Claude and ask it to "optimize this prompt: …".

## Usage

- "Optimize this prompt: write a blog about AI"
- "Improve my prompt before I run it: fix this SQL query"
- Reply `show your work` to see the full diagnostics (AST, critique, token counts).
- Reply `edit` to correct an assumption.

## How it's built

Progressive disclosure — a tight `SKILL.md` entry point plus reference files loaded only when
the difficulty tier needs them:

```
SKILL.md                    entry: triggers, difficulty gate, pipeline map, output contract
references/pipeline.md       full stage instructions
references/domain-playbooks.md  intent → role + enhancers + hidden requirements
references/scoring.md        lint scorecard, ≥90 quality gate, compression
examples/transformations.md  before→after calibration examples
```

## License

MIT — see [LICENSE](LICENSE).
