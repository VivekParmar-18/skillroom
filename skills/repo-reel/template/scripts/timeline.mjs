#!/usr/bin/env node
// Print the global start frame of every scene in src/story.ts + suggested frames for preview stills.
// Mirrors the maths in src/Video.tsx (24-frame transitions, 30 into the outro). Keep DEFAULTS in sync
// with the `<type>Dur` exports in src/scenes/*.tsx.
// Usage: node scripts/timeline.mjs            → table
//        node scripts/timeline.mjs --frames   → just the still frames, space-separated (for a shell loop)
import { readFileSync } from "node:fs";

const DEFAULTS = { title: 300, chaos: 380, journey: 600, flow: 480, orbit: 480, dashboard: 480, trust: 360, stats: 420, showcase: 330, outro: 388 };
const FPS = 60;

const src = readFileSync(new URL("../src/story.ts", import.meta.url), "utf8");
const body = src.slice(src.indexOf("scenes:"));
// split into top-level scene objects by tracking brace depth inside the scenes array
const scenes = [];
let depth = 0, start = -1;
for (let i = body.indexOf("[") + 1; i < body.length; i++) {
  const ch = body[i];
  if (ch === "{") {
    if (depth === 0) start = i;
    depth++;
  } else if (ch === "}") {
    depth--;
    if (depth === 0 && start >= 0) scenes.push(body.slice(start, i + 1));
  } else if (ch === "]" && depth === 0) break;
}

let t = 0;
const rows = scenes.map((s, i) => {
  const type = (s.match(/type:\s*["'](\w+)["']/) || [])[1] ?? "?";
  const dur = Number((s.match(/^\s*\{?\s*[^{}]*?\bdur:\s*(\d+)/) || [])[1]) || DEFAULTS[type] || 0;
  const next = scenes[i + 1] ? (scenes[i + 1].match(/type:\s*["'](\w+)["']/) || [])[1] : null;
  const trans = next ? (next === "outro" ? 30 : 24) : 0;
  const row = { i, type, start: t, dur, still: t + Math.round(dur * 0.72) };
  t += dur - trans;
  return row;
});
const total = rows.length ? rows[rows.length - 1].start + rows[rows.length - 1].dur : 0;

if (process.argv.includes("--frames")) {
  process.stdout.write(rows.map((r) => r.still).join(" ") + "\n");
} else {
  console.log("#  type        start   dur   still-frame");
  for (const r of rows) console.log(`${String(r.i).padEnd(2)} ${r.type.padEnd(11)} ${String(r.start).padStart(5)} ${String(r.dur).padStart(5)}   ${r.still}`);
  console.log(`\nTotal: ${total} frames = ${(total / FPS).toFixed(1)} s @ ${FPS} fps   (gen-sfx --pad=${Math.ceil(total / FPS) + 2})`);
}
