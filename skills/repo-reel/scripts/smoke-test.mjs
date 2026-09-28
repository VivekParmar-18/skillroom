#!/usr/bin/env node
// End-to-end check of the template: scaffold → install → typecheck → bundle → one still per scene.
//   node scripts/smoke-test.mjs                          # client-60s example, temp dir, stills only
//   node scripts/smoke-test.mjs --example technical-60s  # any file in examples/ (without .story.ts)
//   node scripts/smoke-test.mjs --render                 # also render the full MP4
//   node scripts/smoke-test.mjs --previews               # write README preview JPEGs to assets/previews/
//   node scripts/smoke-test.mjs --dir <path> --keep      # choose/keep the work folder
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const has = (k) => args.includes(k);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const example = opt("--example", "client-60s");
const work = resolve(opt("--dir", join(tmpdir(), `repo-reel-smoke-${Date.now()}`)));
const previews = has("--previews");

const run = (cmd, cwd = work) => {
  console.log(`\n$ ${cmd}`);
  const r = spawnSync(cmd, { cwd, stdio: "inherit", shell: true });
  if (r.status !== 0) {
    console.error(`\n✗ Failed: ${cmd}\n  work dir kept at ${work}`);
    process.exit(r.status ?? 1);
  }
};
const capture = (cmd) => spawnSync(cmd, { cwd: work, shell: true, encoding: "utf8" }).stdout.trim();

const storySrc = join(ROOT, "examples", `${example}.story.ts`);
if (!existsSync(storySrc)) {
  console.error(`No such example: ${storySrc}\nAvailable: ${readdirSync(join(ROOT, "examples")).join(", ")}`);
  process.exit(1);
}

if (!existsSync(work) || readdirSync(work).length === 0) run(`node "${join(ROOT, "scripts", "scaffold.mjs")}" "${work}"`, ROOT);
copyFileSync(storySrc, join(work, "src", "story.ts"));
if (!existsSync(join(work, "node_modules"))) run("npm install --no-fund --no-audit");
const pad = Number((capture("node scripts/timeline.mjs").match(/--pad=(\d+)/) || [])[1]) || 62;
run(`node scripts/gen-sfx.mjs --pad=${pad}`);
run("npx tsc --noEmit");
run("npx remotion bundle --log=error");

const frames = capture("node scripts/timeline.mjs --frames").split(/\s+/).filter(Boolean);
const stillDir = previews ? join(ROOT, "assets", "previews") : join(work, "out");
mkdirSync(stillDir, { recursive: true });
frames.forEach((fr, i) => {
  const name = previews ? `${example}-${String(i + 1).padStart(2, "0")}.jpg` : `still-${fr}.png`;
  const fmt = previews ? "--image-format=jpeg --jpeg-quality=82" : "";
  run(`npx remotion still build Main "${join(stillDir, name)}" --frame=${fr} --scale=0.5 ${fmt} --log=error`);
});
if (has("--render")) {
  run(`npx remotion render build Main out/${example}.mp4 --codec=h264 --crf=20 --concurrency=50% --log=error`);
  run(`npx remotion ffprobe -v error -show_entries stream=codec_type,width,height,r_frame_rate:format=duration -of compact out/${example}.mp4`);
}

console.log(`\n✓ Smoke test passed (${example}). Stills: ${stillDir}`);
if (!has("--keep") && !has("--dir") && !has("--render")) {
  rmSync(work, { recursive: true, force: true });
  console.log("  (temp work dir removed — pass --keep to keep it)");
} else console.log(`  Work dir: ${work}`);
