# Scoring — lint scorecard, quality gate, compression

Used at the **medium+** tiers. Produces the one-line `Quality:` score in the output contract
and drives the silent improve pass.

## Lint scorecard (8 dimensions)

Score each dimension, then combine into a 0–100 score. Weight clarity and objective highest.

| # | Dimension | Pass when… |
|---|-----------|-----------|
| 1 | **Clear objective** | the single goal is unambiguous and explicit |
| 2 | **Role defined** | an expert role/persona is set |
| 3 | **Context / background** | relevant stack, audience, and prior decisions are included |
| 4 | **Constraints present** | versions, scale, platform, budget/timeline are stated or `[ASSUMED]` |
| 5 | **Output format** | the desired answer shape is specified |
| 6 | **Success criteria** | a checkable definition of done is included |
| 7 | **Ambiguity** | low — no instruction can be read two ways |
| 8 | **Token efficiency** | no redundancy or filler; concise for its size |

Render the score as: `92/100 (clarity ✓ · role ✓ · constraints ⚠ · format ✓ · success-criteria ✓)`.
Use `✓` for a strong dimension and `⚠` for a weak one. Show the dimensions most relevant to the
prompt (you need not list all 8 if some are trivially satisfied).

**Confidence is folded in here**, not shown separately: if intent or context is uncertain,
lower the score and flag the weak dimension rather than printing a separate confidence number.

## Quality gate (≥ 90)

1. Compute the score for the drafted optimized prompt.
2. If **< 90**, run ONE silent improve pass: fix the weakest dimensions, re-score.
3. Show the user only the improved prompt and its score.
4. If after one pass it still cannot reach 90 (e.g. the task is irreducibly ambiguous), show
   the best version with the weak dimension flagged `⚠` — do not loop further, and do not
   pester the user with questions unless they chose "edit".

## Compression rules (complex+)

Trim the optimized prompt to its shortest form that loses no meaning:
- Remove redundant or overlapping instructions; merge duplicates.
- Cut filler words and ceremony; keep imperative, concrete wording.
- **Never** drop a constraint, an `[ASSUMED: …]` tag, or a success criterion to save tokens.
- Estimate before/after tokens and report the delta only under "show your work".

Goal: same quality, fewer tokens — preserving the full structure the pipeline built.
