#!/usr/bin/env node
// Repo fact-finder for promo videos. Zero dependencies.
// Usage: node discover.mjs [repoRoot=.] [--max-files=60000] > facts.md
// Prints a Markdown report: identity, stack, size, brand assets, colours, lifecycle/role enums,
// routes, integrations, tests, CI. Everything is a *lead* — verify before putting it on screen.
import { readdirSync, readFileSync, statSync, openSync, readSync, closeSync } from "node:fs";
import { join, relative, extname, basename } from "node:path";

const root = process.argv.slice(2).find((a) => !a.startsWith("--")) || ".";
const MAX_FILES = Number((process.argv.find((a) => a.startsWith("--max-files=")) || "").split("=")[1]) || 60000;
const SKIP = new Set(["node_modules", ".git", "build", "dist", "target", "out", ".next", ".nuxt", "vendor", "coverage", ".gradle", ".idea", ".vscode", "__pycache__", ".venv", "venv", "bin", "obj", ".turbo", ".cache", "logs", "tmp"]);
const CODE = new Set([".java", ".kt", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".py", ".go", ".rb", ".php", ".cs", ".rs", ".swift", ".dart", ".scala", ".vue", ".svelte"]);
const STYLE = new Set([".css", ".scss", ".sass", ".less"]);
const IMG = new Set([".png", ".svg", ".jpg", ".jpeg", ".webp", ".ico"]);

// ---------- walk ----------
const files = [];
const walk = (dir) => {
  if (files.length >= MAX_FILES) return;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (files.length >= MAX_FILES) return;
    if (e.name.startsWith(".") && e.name !== ".github") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP.has(e.name)) walk(p);
    } else if (e.isFile()) files.push(p);
  }
};
walk(root);
const rel = (p) => relative(root, p).replace(/\\/g, "/");
const read = (p, max = 400_000) => {
  try {
    if (statSync(p).size > max) return "";
    return readFileSync(p, "utf8");
  } catch {
    return "";
  }
};
const out = [];
const h = (t) => out.push(`\n## ${t}\n`);
const li = (t) => out.push(`- ${t}`);

// ---------- identity ----------
out.push(`# Repo facts: ${basename(join(process.cwd(), root))}`);
out.push(`_Scanned ${files.length} files${files.length >= MAX_FILES ? " (limit hit — pass --max-files)" : ""}. Everything below is a lead; verify before using on screen._`);

h("Identity (manifests)");
const manifests = files.filter((f) => /(^|[\\/])(package\.json|pom\.xml|build\.gradle(\.kts)?|pyproject\.toml|setup\.py|go\.mod|Cargo\.toml|composer\.json|Gemfile|pubspec\.yaml|.*\.csproj)$/.test(f));
for (const m of manifests.slice(0, 12)) {
  const s = read(m);
  const bits = [];
  if (m.endsWith("package.json")) {
    try {
      const j = JSON.parse(s);
      bits.push(`name=${j.name ?? "?"}`, j.description ? `desc="${j.description}"` : "", j.homepage ? `homepage=${j.homepage}` : "");
      const deps = Object.keys({ ...(j.dependencies || {}) });
      if (deps.length) bits.push(`deps(${deps.length}): ${deps.slice(0, 25).join(", ")}${deps.length > 25 ? ", …" : ""}`);
    } catch {}
  } else {
    const grab = (re) => (s.match(re) || [])[1];
    const name = grab(/<name>([^<]+)<\/name>/) || grab(/<artifactId>([^<]+)<\/artifactId>/) || grab(/^name\s*=\s*"([^"]+)"/m) || grab(/^module\s+(\S+)/m);
    const desc = grab(/<description>([^<]+)<\/description>/) || grab(/^description\s*=\s*"([^"]+)"/m);
    if (name) bits.push(`name=${name}`);
    if (desc) bits.push(`desc="${desc.trim()}"`);
    const parent = grab(/<parent>[\s\S]*?<artifactId>([^<]+)<\/artifactId>[\s\S]*?<version>([^<]+)</);
    if (parent) bits.push(`parent=${parent}`);
  }
  li(`\`${rel(m)}\` ${bits.filter(Boolean).join(" · ")}`);
}

h("README (first lines)");
const readme = files.find((f) => /(^|[\\/])readme\.(md|rst|txt)$/i.test(f) && rel(f).split("/").length <= 2);
if (readme) {
  const lines = read(readme).split(/\r?\n/).filter((l) => l.trim()).slice(0, 40);
  out.push("```text", ...lines.map((l) => l.slice(0, 200)), "```");
} else li("_no README at the root_");
const agentDocs = files.filter((f) => /(^|[\\/])(CLAUDE|AGENTS|CONTRIBUTING)\.md$/i.test(f)).slice(0, 5);
if (agentDocs.length) li(`Also read: ${agentDocs.map((f) => `\`${rel(f)}\``).join(", ")}`);

// ---------- stack & size ----------
h("Stack & size");
const byExt = {};
let loc = 0;
let testFiles = 0;
const isTest = (p) => /(^|[\\/])(test|tests|__tests__|spec)[\\/]|\.(test|spec)\.[jt]sx?$|Tests?\.(java|kt|cs)$|_test\.(go|py)$|test_.*\.py$/i.test(p);
for (const f of files) {
  const e = extname(f).toLowerCase();
  if (!CODE.has(e)) continue;
  byExt[e] = (byExt[e] || 0) + 1;
  if (isTest(f)) testFiles++;
  const s = read(f, 300_000);
  if (s) loc += s.split("\n").length;
}
li(`Code files by extension: ${Object.entries(byExt).sort((a, b) => b[1] - a[1]).map(([e, n]) => `${e} ${n}`).join(", ") || "none"}`);
li(`≈ ${loc.toLocaleString("en-US")} lines of code (incl. tests) · ${testFiles} test files`);

// ---------- brand assets ----------
h("Brand assets (logo candidates)");
const pngSize = (p) => {
  try {
    const fd = openSync(p, "r");
    const b = Buffer.alloc(24);
    readSync(fd, b, 0, 24, 0);
    closeSync(fd);
    if (b.toString("ascii", 1, 4) !== "PNG") return "";
    const w = b.readUInt32BE(16), hh = b.readUInt32BE(20);
    return `${w}×${hh} (aspect ${(w / hh).toFixed(2)})`;
  } catch {
    return "";
  }
};
const logos = files
  .filter((f) => IMG.has(extname(f).toLowerCase()) && /(logo|brand|wordmark|icon|favicon|mark|emblem)/i.test(rel(f)))
  .sort((a, b) => (/white|light|dark|inverse/i.test(b) ? 1 : 0) - (/white|light|dark|inverse/i.test(a) ? 1 : 0))
  .slice(0, 30);
if (!logos.length) li("_none found — the wordmark fallback will be used_");
for (const l of logos) li(`\`${rel(l)}\` ${extname(l) === ".png" ? pngSize(l) : ""} ${statSync(l).size < 3000 ? "(tiny)" : ""}`);
li("Look at each candidate (Read the image). Prefer one that reads on a DARK background; `white-*` variants may not actually be white.");

// ---------- colours ----------
h("Colour palette (hex frequency in theme/style files)");
const colourFiles = files.filter((f) => STYLE.has(extname(f).toLowerCase()) || /(theme|palette|colors?|tailwind|tokens|variables|brand|styles?)\.(ts|tsx|js|mjs|json|scss|css)$/i.test(basename(f)));
const freq = {};
for (const f of colourFiles.slice(0, 400)) {
  const s = read(f, 200_000);
  for (const m of s.matchAll(/#([0-9a-fA-F]{6})\b/g)) {
    const k = "#" + m[1].toUpperCase();
    if (/^#(F{6}|0{6}|F9FAFB|FAFAFA|F5F5F5|EEEEEE|E0E0E0|212121|111111|333333|666666|999999|CCCCCC)$/.test(k)) continue;
    freq[k] = freq[k] || { n: 0, file: rel(f) };
    freq[k].n++;
  }
}
const top = Object.entries(freq).sort((a, b) => b[1].n - a[1].n).slice(0, 16);
if (!top.length) li("_no hex colours found — derive the palette from the logo_");
for (const [k, v] of top) li(`\`${k}\` ×${v.n} (e.g. \`${v.file}\`)`);
// Theme-like files first: MUI (`primary: { main | 500 | 300: "#…" }`), Tailwind (`primary: "#…"`), CSS vars (`--primary: #…`).
const themeFirst = [...colourFiles].sort((a, b) => Number(/theme|tailwind|tokens|palette/i.test(basename(b))) - Number(/theme|tailwind|tokens|palette/i.test(basename(a))));
for (const f of themeFirst.slice(0, 60)) {
  const s = read(f, 200_000);
  // first *saturated mid-tone* hex within 400 chars after a `primary` key (skips 50/100 near-white shades)
  const saturated = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
    return l > 0.15 && l < 0.8 && (mx - mn) / (1 - Math.abs(2 * l - 1) || 1) > 0.35;
  };
  let hit;
  for (const m of s.matchAll(/(?:--)?primary[\w-]*['"]?\s*[:=]/gi)) {
    hit = (s.slice(m.index, m.index + 400).match(/#[0-9a-fA-F]{6}\b/g) || []).find(saturated);
    if (hit) break;
  }
  if (hit) {
    li(`"primary" is defined near \`${hit.toUpperCase()}\` in \`${rel(f)}\` — open that file to confirm the real brand colour`);
    break;
  }
}
const themeFiles = themeFirst.filter((f) => /theme|tailwind|tokens|palette/i.test(basename(f))).slice(0, 6);
if (themeFiles.length) li(`Theme files to read: ${themeFiles.map((f) => `\`${rel(f)}\``).join(", ")}`);

// ---------- enums: lifecycle, roles, types ----------
h("Lifecycle / role / type enums (story material)");
const enumHits = [];
for (const f of files) {
  if (!CODE.has(extname(f).toLowerCase()) || isTest(f)) continue;
  const s = read(f, 150_000);
  if (!s) continue;
  // Java/Kotlin/TS/C#: enum Foo { A, B }  ·  TS union: type Foo = "A" | "B"  ·  Python: class Foo(Enum)
  for (const m of s.matchAll(/enum\s+(?:class\s+)?(\w*(?:Status|State|Stage|Step|Phase|Role|Type|Kind|Tier|Plan|Level)\w*)\s*(?:\([^)]*\))?\s*(?::\s*[\w.<>]+\s*)?\{/g)) {
    let body = s.slice(m.index + m[0].length, m.index + m[0].length + 4000).replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, "");
    let prev;
    do {
      prev = body;
      body = body.replace(/\([^()]*\)/g, "");
    } while (body !== prev);
    const end = body.search(/[;}]/);
    const vals = (end >= 0 ? body.slice(0, end) : body)
      .split(",")
      .map((x) => (x.trim().match(/^([A-Za-z_]\w*)/) || [])[1])
      .filter(Boolean)
      .slice(0, 16);
    if (vals.length >= 2) enumHits.push([m[1], vals, rel(f)]);
  }
  for (const m of s.matchAll(/type\s+(\w*(?:Status|State|Stage|Role|Type|Kind)\w*)\s*=\s*((?:\s*\|?\s*['"][\w -]+['"])+)/g)) {
    const vals = [...m[2].matchAll(/['"]([\w -]+)['"]/g)].map((x) => x[1]).slice(0, 14);
    if (vals.length >= 2) enumHits.push([m[1], vals, rel(f)]);
  }
  for (const m of s.matchAll(/class\s+(\w*(?:Status|State|Stage|Role|Type|Kind)\w*)\s*\((?:str,\s*)?(?:Enum|IntEnum|StrEnum|TextChoices)\)\s*:([\s\S]{0,1200}?)(?:\n\S|$)/g)) {
    const vals = [...m[2].matchAll(/^\s+([A-Z][A-Z0-9_]+)\s*=/gm)].map((x) => x[1]).slice(0, 14);
    if (vals.length >= 2) enumHits.push([m[1], vals, rel(f)]);
  }
}
const seen = new Set();
const ranked = enumHits
  .filter(([n]) => (seen.has(n) ? false : seen.add(n)))
  .sort((a, b) => (/Status|State|Stage/.test(b[0]) ? 1 : 0) - (/Status|State|Stage/.test(a[0]) ? 1 : 0))
  .slice(0, 30);
if (!ranked.length) li("_none detected — read domain models / DB migrations for statuses_");
for (const [n, v, f] of ranked) li(`**${n}**: ${v.join(" → ")}  (\`${f}\`)`);

// ---------- routes / domains ----------
h("Domains & routes");
const routeRe = /@(Get|Post|Put|Patch|Delete|Request)Mapping|\b(router|app|api)\.(get|post|put|patch|delete)\s*\(|@(app|router|bp)\.(route|get|post)|\bpath\(\s*['"]|\[Http(Get|Post|Put|Delete)|\bexport\s+(async\s+)?function\s+(GET|POST|PUT|DELETE|PATCH)\b|<Route\b|\bpath\s*[:=]\s*["'`]\//g;
let routes = 0;
const domains = {};
for (const f of files) {
  if (!CODE.has(extname(f).toLowerCase()) || isTest(f)) continue;
  const b = basename(f, extname(f));
  const m = b.match(/^(\w+?)(Controller|Resource|Router|Routes|Handler|Endpoint|ViewSet|Api)$/);
  if (m && m[1].length > 1 && !/^Base|^Abstract/.test(m[1])) domains[m[1]] = 1;
  const s = read(f, 200_000);
  routes += (s.match(routeRe) || []).length;
}
li(`≈ ${routes} route/endpoint declarations`);
const dn = Object.keys(domains).sort();
if (dn.length) li(`Domains from controller/router names (${dn.length}): ${dn.join(", ")}`);
const pages = files.filter((f) => /[\\/](pages|app|views|screens|routes)[\\/]/i.test(f) && /\.(tsx|jsx|vue|svelte)$/.test(f)).length;
if (pages) li(`${pages} page/screen/view component files`);

// ---------- integrations ----------
h("Integrations (dependency & import hints)");
const KNOWN = ["stripe", "paypal", "braintree", "twilio", "sendgrid", "mailgun", "postmark", "aws", "s3", "sqs", "sns", "lambda", "firebase", "supabase", "auth0", "okta", "cognito", "clerk", "openai", "anthropic", "slack", "discord", "teams", "redis", "kafka", "rabbitmq", "elasticsearch", "algolia", "sentry", "datadog", "newrelic", "segment", "mixpanel", "amplitude", "mapbox", "google", "places", "maps", "shopify", "salesforce", "hubspot", "netsuite", "quickbooks", "xero", "plaid", "docusign", "zoom", "websocket", "stomp", "socket.io", "graphql", "grpc", "quartz", "cron", "pdf", "pdfbox", "puppeteer", "excel", "poi", "exceljs", "jwt", "oauth", "2fa", "otp", "flyway", "liquibase", "prisma", "typeorm", "hibernate", "docker", "kubernetes", "terraform"];
const hay = files
  .filter((f) => /(package\.json|pom\.xml|build\.gradle(\.kts)?|requirements.*\.txt|pyproject\.toml|go\.mod|Cargo\.toml|Gemfile|composer\.json|\.csproj|\.properties|\.ya?ml)$/.test(f))
  .slice(0, 300)
  .map((f) => read(f, 300_000).toLowerCase())
  .join("\n");
const found = KNOWN.filter((k) => new RegExp(`[^a-z]${k.replace(".", "\\.")}[^a-z]`).test(hay));
li(found.length ? found.join(", ") : "_none detected in manifests/config_");
li("⚠ Config files often hold secrets — never put URLs, keys or tokens from them on screen.");

// ---------- CI / deploy ----------
h("CI / deploy");
const ci = files.filter((f) => /\.github[\\/]workflows[\\/].+\.ya?ml$|\.gitlab-ci\.yml$|Jenkinsfile$|azure-pipelines\.yml$|bitbucket-pipelines\.yml$|Dockerfile$|docker-compose\.ya?ml$/.test(f));
for (const f of ci.slice(0, 10)) {
  const s = read(f, 100_000);
  const name = (s.match(/^name:\s*(.+)$/m) || [])[1];
  li(`\`${rel(f)}\`${name ? ` — ${name.trim()}` : ""}`);
}
if (!ci.length) li("_none found_");

process.stdout.write(out.join("\n") + "\n");
