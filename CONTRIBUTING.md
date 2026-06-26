# Contributing to Prompt Intelligence Engine

Thanks for helping make this skill better! Contributions of all sizes are welcome.

## Ways to contribute

- **New domain playbooks** — add an intent → role + enhancers + hidden-requirements entry in
  `skills/prompt-intelligence-engine/references/domain-playbooks.md`.
- **Before/after examples** — add calibration examples in
  `skills/prompt-intelligence-engine/examples/transformations.md`.
- **Pipeline / scoring tweaks** — improve stage instructions or the lint rubric.
- **Docs & FAQ** — clarify the README, fix typos, add an FAQ entry.
- **Bug reports** — open an issue with the prompt you used and what came back.

## How a skill works (read first)

This is a **Claude Agent Skill**: plain Markdown that the model reads and follows. There's no
build step and no code to compile. The entry point is `SKILL.md`; heavy detail lives in
`references/` and is loaded only when the difficulty tier needs it (progressive disclosure).
Keep `SKILL.md` tight — push depth into the reference files.

## Workflow

1. Fork the repo and create a branch: `git checkout -b feat/<short-description>`.
2. Make your change. Keep the writing style consistent with the existing files.
3. **Test it live:** copy the skill into your Claude skills dir and try a few prompts —
   ```bash
   cp -r skills/prompt-intelligence-engine ~/.claude/skills/
   ```
   Restart Claude and confirm the output still matches the contract in `SKILL.md`.
4. Commit with a clear message (`feat:`, `fix:`, `docs:`), push, and open a PR describing
   what changed and the prompts you tested.

## Style

- Match the tone and structure of neighboring files.
- Keep examples realistic and concise.
- Don't bloat `SKILL.md`; new depth goes in `references/`.

## Code of conduct

Be kind and constructive. We're all here to ship a better tool.
