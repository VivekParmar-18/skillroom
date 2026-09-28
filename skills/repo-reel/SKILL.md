---
name: repo-reel
description: >-
  Make a polished motion-graphics promo / explainer VIDEO (real MP4, 1080p60, with synthesized
  sound) about whatever product or codebase is in the current repo. Reads the repo to extract
  true facts (name, tagline, lifecycle/status enums, roles, domains, integrations, security
  features, brand colours, logos), writes a storyboard, and renders it with Remotion using a
  data-driven library of cinematic scenes (logo ignition, chaos→order, lifecycle path, money flow,
  role orbit, live dashboard, trust/security, tech stats, brand showcase, outro). Use when asked to
  "make a video / motion graphics / promo / explainer / trailer / sizzle reel" about the project,
  product, app or codebase, or to "turn the repo into a video".
license: MIT
version: 1.0.0
metadata:
  author: VivekParmar-18
  homepage: https://github.com/VivekParmar-18/skillroom/tree/main/skills/repo-reel
  keywords: [video, motion-graphics, promo-video, explainer-video, remotion, product-video, trailer, codebase, marketing, animation]
---

# Repo → motion-graphics promo video

You turn *any* repository into a ~30–90 s cinematic product video. The heavy lifting (animation,
transitions, typography, sound) is already built in `template/`; your job is to **understand the
repo, tell a true story, and fill one data file** — then verify frames and render.

Skill root (referred to as `$SKILL` below): the folder containing this file.

```
$SKILL/scripts/discover.mjs   repo fact-finder (zero deps) → Markdown leads
$SKILL/scripts/scaffold.mjs   copies template/ to a new folder
$SKILL/template/              Remotion 4 project: src/story.ts is the ONLY file you normally edit
$SKILL/references/storyboard.md   scene catalogue, field-by-field, recipes per audience/length
$SKILL/references/craft.md        techniques, verified gotchas, how to add a new scene type
$SKILL/examples/*.story.ts        complete fictional stories (client-60s, technical-60s, teaser-30s) — copy the closest one as a starting shape
$SKILL/scripts/smoke-test.mjs     self-test of the template (use if a scaffolded project misbehaves)
```

## Workflow

### 0 · Decide the brief (ask only what you can't infer)
If the request doesn't say, ask in ONE AskUserQuestion call (recommended option first):
- **Audience** — product/clients (business story, no code talk) · technical/team (stack, stats, architecture) · mixed.
- **Length** — ~60 s (7–8 scenes, recommended) · ~30 s teaser (4 scenes) · ~90 s (10–11 scenes, repeat types with different content).
- **Audio** — synthesized SFX + soft pad (default, license-free) · silent.
- **Where** — default: a sibling folder **outside** the repo, `<repo-parent>/<RepoName>-Promo/`. Never scaffold inside the repo or commit the video unless asked.

### 1 · Understand the repo (facts before pixels)
1. `node "$SKILL/scripts/discover.mjs" <repoRoot> > <promoDir>/facts.md` (for monorepos / sibling
   frontend+backend repos, run it on each root). It reports manifests, README, size, logo
   candidates with pixel sizes, colour frequencies + the theme's `primary`, **status/role/type enums**
   (lifecycles!), controller/route domains, integrations, tests, CI.
2. Read what it points at: README / CLAUDE.md / AGENTS.md, the theme file, the 2–3 most important
   status enums, the domain list. For a big or unfamiliar codebase, delegate a single Explore agent
   ("medium") for: product purpose, user roles, core workflow + its status enum, money/billing flow,
   security features (auth, 2FA, encryption, audit), integrations, brands/white-label, exact counts.
3. **Look at every logo candidate** with the Read tool. Pick the version that reads on a very dark
   background; note its `logoAspect` (from the report). A file named `white-logo.png` is often NOT
   white — check. No usable logo → omit `logo`; the template renders a gradient wordmark + monogram.
4. Write a short fact sheet (in `facts.md` under the report): each on-screen claim → the file it came
   from. Anything you can't source doesn't go on screen.

### 2 · Storyboard
Pick scenes from `references/storyboard.md` → *Recipes*. Default 60 s client cut:
`title → chaos → journey → flow → orbit → dashboard → trust → showcase|stats → outro`
(drop `flow` if there's no money/transaction story, `showcase` if there's one brand, use `stats`
for technical audiences). Map facts → fields: lifecycle enum → `journey.stages`, roles enum →
`orbit.nodes`, controller domains → `chaos.chips`, billing enums → `flow.doc.states`, auth/2FA/
encryption/audit → `trust.features`, real counts → `stats.stats`. Keep copy short (limits in the
reference). Show the storyboard (one line per scene) to the user only if they asked to review; otherwise proceed.

### 3 · Scaffold & assets
```bash
node "$SKILL/scripts/scaffold.mjs" "<promoDir>"
cd "<promoDir>" && npm install          # pinned Remotion 4.0.529; bundles its own ffmpeg + headless Chrome
cp <repo>/path/to/logo.png public/brand/logo.png   # + icon.png, extra brand logos (read-only copies)
```

### 4 · Write `src/story.ts`
Start from the closest `$SKILL/examples/*.story.ts` for shape, then replace every value (brand + scenes)
with the repo's facts. Types in `src/types.ts` document every field.
Palette: `primary` = the theme's main brand colour; `gradient` = two stops sampled from the logo
(or primary → a lighter/adjacent hue). Background stays near-black — the look depends on it.
Then:
```bash
node scripts/timeline.mjs                       # scene starts, total length, suggested --pad
node scripts/gen-sfx.mjs --pad=<total s + 2>    # synthesizes public/sfx/*.wav (skip if silent: set musicVolume: 0)
npx tsc --noEmit                                # must be clean
```

### 5 · Verify with stills (mandatory — look at every scene)
```bash
npx remotion bundle
for fr in $(node scripts/timeline.mjs --frames); do npx remotion still build Main out/s$fr.png --frame=$fr --scale=0.5 --log=error; done
```
Read every PNG. Check: text clipped or wrapping onto 2 lines, cards overlapping each other or the
frame edge, logo legibility, empty-looking areas, wrong facts. Fix in `story.ts` first (shorter
copy, fewer items, different tone); only touch scene code for real layout bugs. Re-bundle and
re-check the frames you changed. For motion-heavy moments also check a frame mid-animation.

### 6 · Render & report
```bash
npx remotion render build Main out/<name>.mp4 --codec=h264 --crf=16 --concurrency=50%   # run in background; ~3–8 min per minute of video
npx remotion ffprobe -v error -show_entries stream=codec_type,width,height,r_frame_rate:format=duration -of compact out/<name>.mp4
```
Report: output path, duration/resolution/audio confirmed, the scene list with the real facts used,
anything illustrative, and how to watch/edit (double-click the MP4; `npm run studio` to scrub;
edit `src/story.ts` → `npm run render`).

## Content guardrails (non-negotiable)
- **Only true, sourced claims.** Labels come from the code (enum values → human words, e.g.
  `NEEDS_MORE_INFO` → "Needs more info"). No invented customers, logos of partners, awards or metrics.
- Mock numbers are allowed only in `flow`/`dashboard`, which show an **ILLUSTRATIVE DATA** tag
  (leave `illustrative` on). `stats` numbers must be real counts you measured.
- **No compliance claims** (HIPAA/SOC 2/GDPR "compliant") unless the repo contains the certification
  evidence; describe features instead ("Audit trail", "Encrypted data", "Business Associate Agreements").
- **Never show secrets, internal URLs, hostnames, tokens, emails or customer data** — config files
  are full of them. Public marketing URLs only.
- Third-party names (carriers, payment networks) as plain text, never their logos.
