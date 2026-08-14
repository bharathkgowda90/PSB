/**
 * Produce the publishable site in dist/.
 *
 * Copies site/ verbatim, minifies CSS and JS in place, and asserts that
 * nothing under .claude/ leaked into the output — the whole point of keeping
 * the toolchain in one folder is that the published site never contains it.
 *
 * Usage:  npm run build
 */
import { cp, mkdir, readdir, rm, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transform as minifyJs } from "esbuild";
import { transform as minifyCss, Features } from "lightningcss";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../../..");
const SITE = path.join(ROOT, "site");
const DIST = path.join(ROOT, "dist");

if (!existsSync(SITE)) {
  console.error("No site/ folder yet — build the pages first.");
  process.exit(1);
}

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

// Never ship raw originals or dotfiles.
await cp(SITE, DIST, {
  recursive: true,
  filter: (src) => {
    const base = path.basename(src);
    if (base.startsWith(".")) return false;
    if (base === "_raw") return false;
    return true;
  },
});

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let cssBefore = 0;
let cssAfter = 0;
let jsBefore = 0;
let jsAfter = 0;
const leaks = [];

for await (const file of walk(DIST)) {
  const ext = path.extname(file).toLowerCase();

  if (ext === ".css") {
    const source = await readFile(file);
    const { code } = minifyCss({
      filename: file,
      code: source,
      minify: true,
      include: Features.Nesting,
    });
    cssBefore += source.length;
    cssAfter += code.length;
    await writeFile(file, code);
  } else if (ext === ".js") {
    const source = await readFile(file, "utf8");
    const { code } = await minifyJs(source, { minify: true, loader: "js" });
    jsBefore += Buffer.byteLength(source);
    jsAfter += Buffer.byteLength(code);
    await writeFile(file, code);
  }

  if (ext === ".html" || ext === ".css" || ext === ".js") {
    const text = await readFile(file, "utf8");
    if (text.includes(".claude/")) leaks.push(path.relative(DIST, file));
  }
}

const kb = (n) => `${(n / 1024).toFixed(1)}kB`;
console.log(`dist/ built from site/`);
if (cssBefore) console.log(`  CSS  ${kb(cssBefore)} → ${kb(cssAfter)}`);
if (jsBefore) console.log(`  JS   ${kb(jsBefore)} → ${kb(jsAfter)}`);

if (leaks.length) {
  console.error(`\nBuild aborted — these files reference .claude/:`);
  for (const leak of leaks) console.error(`  ${leak}`);
  console.error("The dev toolchain must not be referenced by the published site.");
  process.exit(1);
}

console.log("\nNo .claude/ references in the output — dist/ is safe to publish.");
