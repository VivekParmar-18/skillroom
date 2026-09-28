# Storyboard reference

All scenes: 1920×1080 @ 60 fps, dark background, shared mesh gradient + particles + grain.
Numbered scenes (`journey flow orbit dashboard trust stats`) get an automatic `01 / EYEBROW` label
in the order they appear. Transitions are automatic (zoom-through / push-cut rotation, fade into outro).

## Scene catalogue

| type | default length | what it shows | best fed by |
|---|---|---|---|
| `title` | 5.0 s | light filament → logo wipe with scan edge + masked shine → 1–2 tagline lines | brand name/tagline (README, manifest description, site `<title>`, brand config) |
| `chaos` | 6.3 s | tangled chips drift + glitchy problem line → chips snap into a grid as the answer slams in | the things the product unifies: actors + objects (controller domains, entity names) |
| `journey` | 10.0 s | glowing path draws through 3–7 lifecycle stages; comet, node pops, stage cards | a status enum / state machine (orders, tickets, builds, applications, deployments) |
| `flow` | 8.0 s | document card flips in, cycles states → stamp + confetti; value fans out on ribbons to 1–4 recipients | invoices/payments/commissions/payouts/revenue share; or any "item done → distributed" story |
| `orbit` | 8.0 s | product hub with 4–8 actors orbiting in 3D (depth blur), pulses on spokes, caption | roles enum, tenant types, connected services/integrations |
| `dashboard` | 8.0 s | tilted 3D dashboard builds (KPIs, bars, line), live toasts stack, optional scanning automation card | dashboards/analytics features, notifications, background jobs, AI/automation |
| `trust` | 6.0 s | shield assembles from shards, hex field, optional 2FA code typing, feature list | auth (JWT/OAuth/SSO), 2FA/OTP, encryption, audit logs, RBAC, agreements |
| `stats` | 7.0 s | 3–6 big gradient counters in flipping tiles + tag row | real repo numbers: endpoints, modules, tests, integrations, brands, LOC; stack tags |
| `showcase` | 5.5 s | 1–3 cards rise and fan out in 3D with reflections + sheen | brands/white-label editions, apps (web/mobile/API), plans |
| `outro` | 6.5 s | particles collapse → flash → logo, tagline, URL pill → fade to black | brand tagline + public URL |

Override any length with `dur` (frames). Longer = calmer; don't go below ~80% of default or
animations get cut off (they are timed to fixed frames).

## Field limits (keep copy short — long copy is the #1 cause of layout breaks)
- Headlines (`title` arrays, `caption`): ≤ 22 characters per part. Inline titles (`flow/dashboard/trust/stats`): all words together ≤ 36 chars.
- `chaos.problem[1]` ≤ 14 chars (it's huge); `chaos.answer` ≤ 16 chars; chips ≤ 18 chars, 6–12 chips.
- `journey.stages[].title` ≤ 18 chars, `status` ≤ 20 chars (use `"ENTITY · STATE"` style); `badges` on at most one stage, ≤ 4 short badges.
- `orbit.nodes[].label` ≤ 20 chars, 4–8 nodes.
- `dashboard.kpis` exactly 4 (labels ≤ 16 chars), `toasts` ≤ 4 (title ≤ 18, sub ≤ 26).
- `trust.features` ≤ 4 with `code`, ≤ 6 without; title ≤ 28, sub ≤ 40. `code.digits` 4–6 digits.
- `flow.doc.items` 2–5 values; `destinations` 1–4 (label ≤ 12, sub ≤ 22).
- `stats.stats` 3–6 (value as a number; use `suffix: "+"`/`"K"`), label ≤ 22; `tags` ≤ 10.
- `showcase.cards[].tagline` ≤ 60 chars.

## Tones
`tone?: "primary" | "info" | "warn" | "violet" | "danger"` on chips/stages/nodes/features/etc.
Omitted → rotates primary/info/warn/violet by index. Use `danger` only for "bad" states (unpaid,
failed), `primary` for the final/success state.

## Recipes
**Client / product, 60 s** (default): `title, chaos, journey, flow, orbit, dashboard, trust, showcase|stats, outro` ≈ 60 s.
**Technical / team, 60 s**: `title, chaos (problem = tech pain), journey (request or CI lifecycle), stats, orbit (services/integrations), trust (security), dashboard, outro`.
**Teaser, 30 s**: `title, chaos, journey (dur 420), outro (dur 300)`.
**Long, 90 s**: default recipe + a second `journey` (another lifecycle) + `stats` + a second `orbit` (integrations).
Check total with `node scripts/timeline.mjs`.

## Mapping repo facts → story (examples of the reasoning, not content to copy)
- Enum `OrderStatus { PENDING, PLACED, PROCESSING, SHIPPED, DELIVERED, CANCELED, RETURNED }` → journey
  stages: pick the *happy path* in business order (enum declaration order is often NOT the lifecycle
  order — reason about it), drop side branches (canceled/returned).
- `UserRole` enum with 16 values → orbit shows 6–7 human groupings (merge ADMIN/STAFF variants),
  caption can state the real count: `["16 roles.", "One source of truth."]`.
- Controllers `Invoice, Payment, Commission` + enum `CommissionType { PLATFORM, AGENCY, OVERRIDE }`
  → `flow` with destinations = those types.
- Dependencies `stripe`, `twilio`, `sendgrid` → toasts ("Payment received", "SMS sent") or an
  integrations orbit — named as text.
- `JwtFilter`, `BCrypt`, `2FA` enum, `AuditListener` → trust features (+ `code` only if 2FA exists).
- Counts from the discovery report (files, endpoints, tests, integrations) → `stats`.
