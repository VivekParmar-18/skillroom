#!/usr/bin/env node
// Copy the Remotion promo template into a new folder.
// Usage: node scaffold.mjs <targetDir>
import { cpSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const target = process.argv[2];
if (!target) {
  console.error("Usage: node scaffold.mjs <targetDir>");
  process.exit(1);
}
const dest = resolve(target);
if (existsSync(dest) && readdirSync(dest).length > 0) {
  console.error(`Refusing to scaffold into non-empty folder: ${dest}`);
  process.exit(1);
}
const template = join(dirname(fileURLToPath(import.meta.url)), "..", "template");
cpSync(template, dest, { recursive: true, filter: (src) => !/[\\/](node_modules|build|out)([\\/]|$)/.test(src) });
console.log(`Scaffolded → ${dest}
Next:
  cd "${dest}"
  npm install
  node scripts/gen-sfx.mjs --pad=<video seconds + 2>
  # copy logos into public/brand/, edit src/story.ts
  npx remotion bundle && npx remotion still build Main out/check.png --frame=200 --scale=0.5
  npm run render`);
