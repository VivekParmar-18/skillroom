# Transformations — before → after

Calibration examples showing what good output looks like at each tier. Match this quality bar.

---

## Example 1 — simple tier

**User prompt:** `fix this CSS`

```
🧠 Prompt Intelligence — coding · simple

Role:        Senior Frontend Engineer
Assumptions: [ASSUMED: the CSS snippet referenced is in the current selection/file]
Quality:     91/100  (clarity ✓ · role ✓ · format ✓)

─── Optimized Prompt ─────────────────────────
As a senior frontend engineer, review the CSS below and fix the layout/styling issue.
State what was wrong in one line, then give the corrected CSS. Keep selectors and class
names unchanged unless the fix requires otherwise.

<paste the CSS here>
──────────────────────────────────────────────

▸ Run this now? (yes / edit / show your work)
```

---

## Example 2 — medium tier

**User prompt:** `build login API`
**Earlier in the conversation:** the user mentioned Spring Boot and MySQL.

```
🧠 Prompt Intelligence — coding · medium

Role:        Senior Backend Engineer
Assumptions: [ASSUMED: Spring Boot 3 / Java 17] · [ASSUMED: MySQL] · [ASSUMED: stateless JWT auth]
Quality:     94/100  (clarity ✓ · role ✓ · constraints ✓ · format ✓ · success-criteria ✓)

─── Optimized Prompt ─────────────────────────
Act as a senior backend engineer. Implement a login API in Spring Boot 3 (Java 17) backed by
MySQL.

Requirements:
- POST /auth/login accepting email + password; return a signed JWT on success.
- Validate input; hash-compare passwords (BCrypt); never log credentials.
- Rate-limit login attempts and lock out after repeated failures.
- Consistent error responses for bad credentials vs validation errors.
- Structured logging and basic auth metrics.

Deliver: the controller, service, and DTOs; security config for JWT; and unit tests covering
success, bad password, unknown user, and rate-limit paths.

Success criteria: compiles, tests pass, no plaintext secrets, edge cases handled, brief notes
on tradeoffs.
──────────────────────────────────────────────

▸ Run this now? (yes / edit / show your work)
```

---

## Example 3 — enterprise tier (decomposition is the output)

**User prompt:** `build amazon`

```
🧠 Prompt Intelligence — coding · enterprise

Role:        Staff Software Architect
Assumptions: [ASSUMED: an MVP e-commerce platform, not literal Amazon scale] · [ASSUMED: web first]
Quality:     93/100  (clarity ✓ · role ✓ · constraints ⚠ · format ✓ · success-criteria ✓)

─── Optimized Prompt (phased) ────────────────
Act as a staff software architect. Design and build an MVP e-commerce platform in phases.
Complete each phase before the next; output each phase's artifact.

Phase 1 — Requirements: core user stories (browse, cart, checkout, orders), non-goals.
Phase 2 — Architecture: services, data flow, tech choices with tradeoffs.
Phase 3 — Data model: catalog, users, cart, orders, payments schema.
Phase 4 — Backend: APIs for catalog, cart, checkout, orders.
Phase 5 — Frontend: product list, product page, cart, checkout flow.
Phase 6 — Testing: unit + integration for the checkout path.
Phase 7 — Deployment: environments, CI/CD, monitoring.

Success criteria per phase: complete, justified decisions, stated risks, runnable next step.
──────────────────────────────────────────────

▸ Run this now? (yes / edit / show your work)
```

> `constraints ⚠` here because scale/budget/region were not given — the assumptions narrow it,
> but the user may want to "edit" them.
