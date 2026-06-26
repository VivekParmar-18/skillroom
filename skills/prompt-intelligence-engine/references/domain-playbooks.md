# Domain playbooks — intent → role + enhancers + hidden requirements

For the classified intent, use the matching row: adopt the **role**, apply the **enhancers**
(domain best practices to bake into the prompt), and weave in the relevant **hidden
requirements**. Include only items that genuinely apply — do not pad the prompt.

---

## coding
- **Role:** Senior Software Engineer (Principal for complex+).
- **Enhancers:** name the language + version, the framework, target runtime; idiomatic style;
  explicit error handling; testability.
- **Hidden requirements:** input validation, error handling, logging, edge cases, tests,
  performance, security, docs/comments.

## debugging
- **Role:** Senior Debugging Engineer.
- **Enhancers:** reproduce first; isolate root cause before fixing; minimal change; add a
  regression test.
- **Hidden requirements:** exact error/stack, environment, recent changes, expected vs actual,
  how to verify the fix.

## research
- **Role:** Senior Research Analyst.
- **Enhancers:** define scope and sources; require citations; separate fact from inference;
  flag uncertainty.
- **Hidden requirements:** recency window, source quality bar, depth, comparison criteria,
  deliverable format.

## documentation
- **Role:** Senior Technical Writer.
- **Enhancers:** audience-first; task-oriented; runnable examples; consistent terminology.
- **Hidden requirements:** audience, prerequisites, examples, versioning, where it lives.

## SQL
- **Role:** Senior Database Engineer.
- **Enhancers:** name the engine + version; use indexes; avoid N+1; explain the query plan when
  it matters; parameterize.
- **Hidden requirements:** schema/sample data, data volume, read vs write pattern,
  indexing, transaction/locking, performance target.

## AWS
- **Role:** Senior Cloud / DevOps Engineer.
- **Enhancers:** least-privilege IAM; cost-awareness; region; IaC over console; observability.
- **Hidden requirements:** account/region, scale, budget, security/compliance, networking,
  monitoring, disaster recovery.

## QA testing
- **Role:** Senior QA Engineer.
- **Enhancers:** cover happy path + edge + failure; deterministic tests; clear arrange-act-assert.
- **Hidden requirements:** scope, environment, test data, pass/fail criteria, regression risk,
  automation vs manual.

## marketing
- **Role:** Senior Marketing Strategist.
- **Enhancers:** define audience + channel; lead with the hook; one clear CTA; on-brand voice.
- **Hidden requirements:** audience, channel/platform, goal/KPI, tone, length, CTA.

## LinkedIn
- **Role:** LinkedIn Content Strategist.
- **Enhancers:** strong first line (hook); short paragraphs; one idea; a clear takeaway;
  authentic voice over hype.
- **Hidden requirements:** audience, goal (reach / leads / hiring), tone, length, hashtags/CTA.

## resume
- **Role:** Senior Career / Resume Coach.
- **Enhancers:** quantified impact; strong action verbs; tailor to the target role; concise.
- **Hidden requirements:** target role/level, seniority, key achievements, format (ATS-friendly),
  length.

## career
- **Role:** Career Coach / Mentor.
- **Enhancers:** clarify the goal; concrete next steps; weigh tradeoffs; realistic timeline.
- **Hidden requirements:** current situation, goal, timeline, constraints, risk tolerance.

## brainstorming
- **Role:** Creative Strategist / Facilitator.
- **Enhancers:** diverge before converging; quantity then quality; group and rank ideas.
- **Hidden requirements:** the real problem, constraints, evaluation criteria, how many ideas.

## education
- **Role:** Expert Educator / Tutor.
- **Enhancers:** match the learner's level; build from fundamentals; use analogies; check
  understanding with a question or exercise.
- **Hidden requirements:** learner level, prior knowledge, goal, format (explain / quiz /
  walkthrough), depth.

---

## generic (fallback)
- **Role:** Senior Subject-Matter Expert in the relevant field.
- **Enhancers:** clarify objective; state assumptions; structure the answer; note tradeoffs.
- **Hidden requirements:** objective, constraints, audience, output format, definition of done.
