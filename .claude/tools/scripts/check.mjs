/**
 * Run every quality gate over the site and report a single pass/fail summary.
 *
 * Usage:  npm run check
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TOOLS = path.resolve(HERE, "..");
const SITE = path.resolve(TOOLS, "../../site");

if (!existsSync(SITE)) {
  console.error("No site/ folder yet — nothing to check.");
  process.exit(0);
}

const gates = [
  { name: "HTML validity + WCAG", script: "lint:html" },
  { name: "CSS lint", script: "lint:css" },
  { name: "Formatting", script: "format:check" },
];

const failed = [];

for (const gate of gates) {
  process.stdout.write(`\n── ${gate.name} ${"─".repeat(Math.max(0, 46 - gate.name.length))}\n`);
  const result = spawnSync("npm", ["run", "--silent", gate.script], {
    cwd: TOOLS,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) failed.push(gate.name);
}

console.log(`\n${"═".repeat(50)}`);
if (failed.length === 0) {
  console.log("All checks passed.");
  process.exit(0);
}
console.log(`Failed: ${failed.join(", ")}`);
process.exit(1);
