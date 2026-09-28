# Changelog

All notable changes to **repo-reel**. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [SemVer](https://semver.org/).

## [1.0.0] — 2026-09-28

### Added
- `SKILL.md`: end-to-end workflow (brief, discover, storyboard, scaffold, story, still QA, render) with content guardrails.
- `scripts/discover.mjs`: zero-dependency repo fact-finder. It covers manifests, README, size, logo candidates with PNG sizes, theme colours and the saturated `primary`, status/role/type enums (Java/Kotlin/TS/C#/Python), route and controller domains, integrations, tests and CI.
- `scripts/scaffold.mjs` and `scripts/smoke-test.mjs` (end-to-end self-test and README preview generator).
- Remotion 4.0.529 template driven by a single typed `src/story.ts`.
- 10 data-driven scenes: `title`, `chaos`, `journey`, `flow`, `orbit`, `dashboard`, `trust`, `stats`, `showcase`, `outro`.
- Shared motion kit: kinetic per-character type, noise particles (burst/converge), mesh-gradient background with perspective grid, grain and vignette, light sweeps, flashes, glass cards, 45 stroke icons, logo shine and wordmark/monogram fallbacks, CSS zoom-through transition.
- `template/scripts/gen-sfx.mjs`: synthesized whoosh, impact, riser, tick, pop, key, chime and shimmer, plus an ambient pad of configurable length (`--pad`).
- `template/scripts/timeline.mjs`: scene start frames, total length and still-frame picks.
- `examples/`: fictional `client-60s`, `technical-60s` and `teaser-30s` stories.
- `references/storyboard.md` (scene catalogue, copy limits, recipes) and `references/craft.md` (techniques, verified gotchas, extending).
