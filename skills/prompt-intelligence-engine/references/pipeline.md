# Pipeline — full stage instructions

This file holds the detailed instructions for each pipeline stage. Read only the stages the
current difficulty tier requires (see the tier column in `SKILL.md`).

---

## Stage 1 — Difficulty estimate (the master gate, runs first)

Classify the prompt into one tier. The tier decides which later stages fire.

| Tier | Looks like | Stages that fire |
|------|-----------|------------------|
| **simple** | one concrete action, single file/concept ("fix this CSS", "rename a var") | core only (stages 1–7) |
| **medium** | a self-contained feature or deliverable ("build a login endpoint", "write a blog post") | core + placeholders, success criteria, few-shot, scorecard |
| **complex** | multiple components or non-trivial design ("design a caching layer", "migrate auth to OAuth") | medium + decomposition, critique, compression, AST |
| **enterprise** | a whole system or product ("build Amazon", "an ERP", "a multi-tenant SaaS") | complex + output is a phased plan, not a single prompt |

Heuristics: count the distinct deliverables, the number of subsystems, and whether the work
needs sequencing. When unsure, round **down** one tier — over-processing a small ask is worse
than under-processing it.

---

## Stage 2 — Intent classification

Pick exactly one task type from the taxonomy in `domain-playbooks.md` (coding, research,
debugging, documentation, LinkedIn, resume, QA testing, SQL, AWS, career, brainstorming,
marketing, education). If none fit, use the generic profile. The intent selects the role and
the hidden-requirement checklist.

---

## Stage 3 — Context inference

Mine the **current conversation** for facts the user already stated and should not have to
repeat: tech stack, language/framework versions, cloud provider, database, audience, tone,
constraints, prior decisions. Fold these into the optimized prompt automatically. If a fact is
implied but not certain, carry it as an `[ASSUMED: …]` tag (Stage 8), not as fact.

Never pull in context from unrelated earlier topics just because it is present — only what is
plausibly relevant to *this* prompt.

---

## Stage 4 — Role selection

Map the intent to an expert persona using `domain-playbooks.md`. State it on the `Role:` line.
The role sets the voice, depth, and default best practices of the optimized prompt. Do not ask
the user to pick a role — decide it.

---

## Stage 5 — Skill-level detection

Infer the user's expertise from their wording (jargon density, specificity, what they omit).
Set the explanation depth accordingly and encode it in the prompt:
- **beginner** → "explain key decisions briefly as you go."
- **intermediate** → "skip basics; focus on the implementation." (default when unclear)
- **expert** → "be terse; assume deep familiarity; no hand-holding."

---

## Stage 6 — Hidden-requirement expansion

Pull the intent's hidden-requirement checklist from `domain-playbooks.md` and weave the
relevant items into the prompt. Example: "build login API" silently implies auth, input
validation, rate limiting, error handling, logging, tests, and docs. Include only the items
that genuinely apply — do not pad.

---

## Stage 7 — Output-format choice

Choose the output shape the answer should take and state it in the prompt: prose/markdown,
table, code block, JSON, checklist, decision tree, report, or step-by-step. Match the shape to
the deliverable (e.g. comparisons → table; configs → code/JSON; plans → checklist/phases).

---

## Stage 8 — Missing-constraint placeholders (medium+)

Identify constraints the task needs but the user did not give: versions, scale/performance
targets, budget, timeline, platform, audience. Insert a sensible default as an explicit
`[ASSUMED: …]` tag rather than asking. The user can override any tag via "edit". Never bury an
assumption silently inside the prompt body.

---

## Stage 9 — Success criteria (medium+)

Append a short, checkable definition of done to the prompt — what the answer must satisfy
(e.g. "complete, no unstated assumptions, explains tradeoffs, lists risks, gives implementation
steps"). Keep it specific to the task, not boilerplate.

---

## Stage 10 — Auto few-shot (medium+)

Add ONE small example (input→output or a snippet of the desired shape) only when an example
sharpens the target more than words can. Skip it when the format is obvious or when an example
would bloat the prompt.

---

## Stage 12 — Task decomposition (complex+)

Break the work into ordered phases, each with a clear goal and output. For the **enterprise**
tier this decomposition *is* the optimized prompt (Phase 1…N). Typical shape: Requirements →
Architecture → Data model → Backend → Frontend → Testing → Deployment — adapt to the domain.
Each phase should be runnable on its own.

---

## Stage 13 — Self-critique → improve once (complex+)

After drafting the optimized prompt, critique it against the lint dimensions in `scoring.md`:
what is ambiguous, what is missing, what could be misread? Apply the fixes in ONE improve pass.
Do not loop endlessly — one critique, one revision. Record the critique only for "show your
work".

---

## Stage 14 — Prompt compression (complex+)

Trim the optimized prompt to its shortest form that preserves all meaning and structure: remove
redundancy, merge overlapping instructions, cut filler — but keep every constraint, assumption,
and success criterion. Report before/after token estimates only under "show your work".

---

## Stage 15 — Prompt AST (complex+)

Treat the prompt as components: Intent · Role · Context · Constraints · Inputs · Outputs ·
Evaluation · Examples · Risks. Identify which components the user already supplied and which are
missing. **Fill only the missing components.** This preserves the user's original wording and
intent while completing the structure — and prevents bloat from regenerating parts that were
already fine. The component table is shown under "show your work".
