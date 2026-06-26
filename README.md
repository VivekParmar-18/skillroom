# 🧩 skillroom

A collection of Claude Agent Skills by [@VivekParmar-18](https://github.com/VivekParmar-18).

Each skill is a self-contained folder (`SKILL.md` + supporting files) that installs into
Claude Code / claude.ai.

## Skills

| Skill | What it does |
|-------|--------------|
| [prompt-intelligence-engine](skills/prompt-intelligence-engine/) | Turns rough one-line prompts into structured, expert-level prompts — auto-detects intent, picks an expert role, fills gaps with surfaced assumptions, scores quality, and offers to run the result. |

## Install a skill

Copy the skill's folder into your Claude skills directory:

```bash
# via the skills.sh CLI
npx skills add VivekParmar-18/skillroom

# or manually
cp -r skills/prompt-intelligence-engine ~/.claude/skills/
```

Then restart Claude and invoke the skill.

## License

[MIT](LICENSE)
