<div align="center">

<!-- BANNER: replace this line with a hero image at docs/banner.png (1280×640). See "Branding assets" below. -->

# 🧠 Prompt Intelligence Engine

### Turn one-line prompts into expert-level prompts — automatically.

*A Claude Agent Skill that thinks like a senior consultant, not a text rewriter.*

[![Install with skills.sh](https://img.shields.io/badge/install-npx%20skills%20add-black?style=for-the-badge)](https://skills.sh)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Claude Skill](https://img.shields.io/badge/Claude-Agent%20Skill-d97757?style=for-the-badge)](https://github.com/vercel-labs/skills)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blueviolet.svg?style=for-the-badge)](CONTRIBUTING.md)

```bash
npx skills add VivekParmar-18/skillroom
```

</div>

---

## 😖 The problem

You type a quick prompt:

> `build login API`

…and the model guesses. It picks a stack you didn't want, skips rate-limiting, forgets validation, invents constraints silently, and you spend three follow-ups fixing it.

Good prompts are a skill. Most people don't have time to write a 300-word, role-assigned, constraint-complete prompt for every task — so they don't, and they get mediocre output.

## ✨ The fix

**Prompt Intelligence Engine** sits between your rough idea and the model. It detects what you're trying to do, adopts the right expert role, reuses context from your conversation, fills the gaps with **assumptions it shows you**, scores the result, and hands back a prompt that's actually good — then offers to run it.

```
🧠 Prompt Intelligence — coding · medium

Role:        Senior Backend Engineer
Assumptions: [ASSUMED: Spring Boot 3 / Java 17] · [ASSUMED: MySQL] · [ASSUMED: stateless JWT]
Quality:     94/100  (clarity ✓ · role ✓ · constraints ✓ · format ✓ · success-criteria ✓)

─── Optimized Prompt ─────────────────────────
Act as a senior backend engineer. Implement a login API in Spring Boot 3 (Java 17)
backed by MySQL. POST /auth/login → signed JWT. Validate input; BCrypt compare; never
log credentials; rate-limit attempts; consistent error responses; structured logging.
Deliver controller + service + DTOs, security config, and unit tests for success /
bad-password / unknown-user / rate-limit paths. Success: compiles, tests pass, no
plaintext secrets, edge cases handled.
──────────────────────────────────────────────

▸ Run this now? (yes / edit / show your work)
```

> **Demo:** _add an animated `docs/demo.gif` here — see [Branding assets](#-branding-assets)._

---

## 🚀 Why it's different

Most prompt improvers just reword your text. This one runs an **adaptive pipeline** gated by task difficulty, so a tiny ask stays fast and a big one gets the full treatment.

| | Typical prompt rewriter | 🧠 Prompt Intelligence Engine |
|---|---|---|
| Detects intent & picks an expert role | sometimes | ✅ always, automatic |
| Reuses context already in your chat | ❌ | ✅ infers stack/versions/decisions |
| Fills missing constraints | silently guesses | ✅ **surfaced** as `[ASSUMED: …]` you can override |
| Quality control | none | ✅ 8-point scorecard, auto-improves below 90/100 |
| Scales to task size | one-size-fits-all | ✅ simple → enterprise (phased decomposition) |
| After optimizing | just text | ✅ offers to run it |

## 🎯 Features

- **Intent classification** — coding, debugging, research, SQL, AWS, QA, docs, marketing, resume, LinkedIn, career, education, brainstorming.
- **Automatic expert role** — you never write "act as…".
- **Context inference** — reuses what you already said in the conversation.
- **Hidden-requirement expansion** — a login API silently implies auth, validation, rate-limiting, logging, tests.
- **Surfaced assumptions** — every gap is tagged `[ASSUMED: …]`, never hidden.
- **Quality scorecard** — transparent 0–100 score; auto-improves weak prompts.
- **Difficulty-tiered depth** — adds decomposition, self-critique, and compression only when the task is big.
- **Optimize → offer to execute** — copy it, or run it on the spot.

## 📦 Installation

**Via the skills.sh CLI (recommended):**
```bash
npx skills add VivekParmar-18/skillroom
```

**Manually (Claude Code / claude.ai):**
```bash
git clone https://github.com/VivekParmar-18/skillroom.git
cp -r skillroom/skills/prompt-intelligence-engine ~/.claude/skills/
```
Restart Claude, then invoke it (below).

## 💡 Usage

Just ask Claude to optimize a prompt:

- *"Optimize this prompt: write a blog about AI"*
- *"Improve my prompt before running it: fix this SQL query"*
- *"Make this prompt better: build a login API"*

Then reply:
- **`yes`** → it runs the optimized prompt
- **`edit`** → correct an assumption, it re-emits
- **`show your work`** → full diagnostics (intent reasoning, prompt AST, critique, token counts)

## 🔁 Before vs After

| Before | After |
|---|---|
| `write tests` | A senior-QA-framed prompt scoped to the target file, covering happy/edge/failure paths, with deterministic arrange-act-assert and explicit pass criteria. |
| `make a landing page` | A frontend-engineer prompt with audience, sections, responsive + a11y requirements, framework `[ASSUMED]`, and a clear definition of done. |
| `build amazon` | An enterprise-tier **phased plan** (Requirements → Architecture → Data → Backend → Frontend → Testing → Deployment), each phase runnable on its own. |

## ⚙️ How it works

A tight `SKILL.md` plus reference files loaded **only when the difficulty tier needs them** (progressive disclosure — keeps it fast):

```
skills/prompt-intelligence-engine/
├── SKILL.md                       entry: triggers, difficulty gate, pipeline, output contract
├── references/
│   ├── pipeline.md                full stage instructions
│   ├── domain-playbooks.md        intent → role + enhancers + hidden requirements
│   └── scoring.md                 8-point lint scorecard, ≥90 gate, compression
└── examples/transformations.md    before→after calibration examples
```

Pipeline order: **difficulty → intent → context → role → skill-level → hidden-reqs → (tiered stages) → format → scorecard.**

## ❓ FAQ

<details>
<summary><b>Does it work outside Claude Code?</b></summary>
It's a standard Agent Skill, so it works anywhere the skills.sh CLI installs (Claude Code, Cursor, Codex CLI, and more). The optimized prompt itself is portable to any model.
</details>

<details>
<summary><b>Will it slow down simple prompts?</b></summary>
No — difficulty estimation runs first. "Fix this CSS" gets a light pass; only complex/enterprise prompts trigger decomposition and the critique loop.
</details>

<details>
<summary><b>Does it secretly change what I asked for?</b></summary>
No. It preserves your intent and fills only the gaps — and every gap it fills is shown as an <code>[ASSUMED: …]</code> tag you can override with <code>edit</code>.
</details>

<details>
<summary><b>Is my data sent anywhere?</b></summary>
No. The skill is plain instructions Claude reads locally — there's no server, no telemetry, no external calls of its own.
</details>

## 🗺️ Roadmap

- [ ] Animated demo GIF + hero banner
- [ ] More domain playbooks (data science, mobile, game dev, legal)
- [ ] Optional "ask me 1 question" mode for high-stakes prompts
- [ ] Saved prompt templates / favorites
- [ ] Community-contributed playbooks

Have an idea? [Open an issue](https://github.com/VivekParmar-18/skillroom/issues).

## 🤝 Contributing

PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Good first contributions: new domain playbooks, before/after examples, and FAQ entries.

## 🎨 Branding assets

This README references two images you should add for a top-tier look:
- `docs/banner.png` — 1280×640 hero (also set it as the repo's **Social preview** in Settings → General).
- `docs/demo.gif` — a 10–20s screen capture of the skill in action.

I can't generate binary images, so these are intentionally left as placeholders for you to drop in.

## 💬 Support

- 🐛 Bugs / ideas → [GitHub Issues](https://github.com/VivekParmar-18/skillroom/issues)
- ⭐ Like it? **Star the repo** — stars drive discovery on skills.sh and GitHub search.

## 📄 License

[MIT](LICENSE) © Vivek Parmar

<div align="center">

**If this saves you a few prompt rewrites, give it a ⭐ — it genuinely helps others find it.**

</div>
