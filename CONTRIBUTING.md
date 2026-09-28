# Contributing to Skillroom

Thanks for helping make these skills better! Contributions of all sizes are welcome.

## Ways to contribute

**🧠 prompt-intelligence-engine**
- **New domain playbooks** — add an intent → role + enhancers + hidden-requirements entry in
  `skills/prompt-intelligence-engine/references/domain-playbooks.md`.
- **Before/after examples** — add calibration examples in
  `skills/prompt-intelligence-engine/examples/transformations.md`.
- **Pipeline / scoring tweaks** — improve stage instructions or the lint rubric.

**🎬 repo-reel**
- **New scene types** — follow "Adding a new scene type" in `skills/repo-reel/references/craft.md`.
- **Better discovery** — teach `skills/repo-reel/scripts/discover.mjs` a new language, framework or
  enum style (keep it zero-dependency).
- **Example stories** — add a fictional `skills/repo-reel/examples/<name>.story.ts` for a new
  audience or length.

**Everywhere**
- **Docs & FAQ** — clarify a README, fix typos, add an FAQ entry.
- **Bug reports** — open an issue with what you asked, what came back, and (for repo-reel) the
  still or error output.

## How a skill works (read first)

A **Claude Agent Skill** is instructions the model reads and follows. The entry point is
`SKILL.md` (frontmatter `name` + `description` decide when it triggers); heavy detail lives in
`references/` and is loaded only when needed (progressive disclosure). Keep `SKILL.md` tight —
push depth into the reference files.

Some skills also ship code the model runs: repo-reel has Node scripts and a Remotion `template/`.
Those need a test run, not just a read-through (see below).

## Workflow

1. Fork the repo and create a branch: `git checkout -b feat/<short-description>`.
2. Make your change. Keep the writing style consistent with the existing files.
3. **Test it live:** copy the skill into your Claude skills dir and try a few real requests —
   ```bash
   cp -r skills/<skill-name> ~/.claude/skills/
   ```
   Restart Claude and confirm the behaviour still matches the contract in its `SKILL.md`.
4. **repo-reel only — run the self-test** (scaffolds, installs, typechecks, bundles, one still per scene):
   ```bash
   node skills/repo-reel/scripts/smoke-test.mjs --example client-60s
   node skills/repo-reel/scripts/smoke-test.mjs --example technical-60s
   ```
   Look at the stills it prints the path to. If you changed visuals, refresh the README images
   with `--previews`, and add an entry to `skills/repo-reel/CHANGELOG.md`.
5. Commit with a clear message (`feat:`, `fix:`, `docs:`), push, and open a PR describing
   what changed and how you tested it.

## Adding a new skill

1. Create `skills/<kebab-case-name>/SKILL.md` with frontmatter matching the existing skills:
   ```yaml
   ---
   name: <kebab-case-name>          # must equal the folder name
   description: <what it does + when to use it — this is what triggers the skill>
   license: MIT
   version: 1.0.0
   metadata:
     author: VivekParmar-18
     homepage: https://github.com/VivekParmar-18/skillroom/tree/main/skills/<kebab-case-name>
     keywords: [ ... ]
   ---
   ```
2. Add `skills/<name>/README.md` (what it does, install with `--skill <name>`, usage, FAQ) and put
   depth in `references/`.
3. Add a row to the **Skills in this room** table and a short section in the root `README.md`.
4. Keep the installed footprint small (the skills CLI caps a download at 25 MiB / 1000 files) —
   no `node_modules`, build output or large media committed.

## Style

- Match the tone and structure of neighboring files.
- Keep examples realistic and concise — and fictional (no real customer names, data or secrets).
- Don't bloat `SKILL.md`; new depth goes in `references/`.

## Code of conduct

Be kind and constructive. We're all here to ship better tools.
