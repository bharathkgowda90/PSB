/**
 * Optimize images for the school website.
 *
 * Reads originals from site/assets/img/_raw/ and writes web-ready
 * WebP + JPEG variants at several widths into site/assets/img/.
 *
 * Usage:  npm run images
 *         npm run images -- --widths 480,960,1600 --quality 78
 */
import { mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, "../../../site");
const SRC = path.join(SITE, "assets/img/_raw");
const OUT = path.join(SITE, "assets/img");

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const WIDTHS = flag("widths", "480,960,1600")
  .split(",")
  .map((w) => Number(w.trim()))
  .filter(Boolean);
const QUALITY = Number(flag("quality", "78"));
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXTS.has(path.extname(entry.name).toLowerCase())) yield full;
  }
}

if (!existsSync(SRC)) {
  console.error(`No source folder at ${path.relative(SITE, SRC)}`);
  console.error("Drop original photos there, then re-run: npm run images");
  process.exit(1);
}

let processed = 0;
let savedBytes = 0;

for await (const file of walk(SRC)) {
  const rel = path.relative(SRC, file);
  const base = path.join(path.dirname(rel), path.basename(rel, path.extname(rel)));
  const original = (await stat(file)).size;
  const image = sharp(file).rotate();
  const meta = await image.metadata();

  await mkdir(path.join(OUT, path.dirname(rel)), { recursive: true });

  for (const width of WIDTHS) {
    if (meta.width && meta.width < width) continue; // never upscale
    const resized = image.clone().resize({ width, withoutEnlargement: true });

    const webp = path.join(OUT, `${base}-${width}.webp`);
    const jpeg = path.join(OUT, `${base}-${width}.jpg`);

    const [w, j] = await Promise.all([
      resized.clone().webp({ quality: QUALITY }).toFile(webp),
      resized.clone().jpeg({ quality: QUALITY, mozjpeg: true }).toFile(jpeg),
    ]);

    savedBytes += original - w.size;
    console.log(
      `  ${path.relative(SITE, webp)}  ${(w.size / 1024).toFixed(0)}kB` +
        `   ${path.relative(SITE, jpeg)}  ${(j.size / 1024).toFixed(0)}kB`,
    );
  }
  processed += 1;
}

const skipped = [];
for await (const file of walk(SRC)) {
  const base = path.basename(file, path.extname(file));
  const any = WIDTHS.some((w) => existsSync(path.join(OUT, path.dirname(path.relative(SRC, file)), `${base}-${w}.webp`)));
  if (!any) skipped.push(path.relative(SRC, file));
}
if (skipped.length) {
  console.warn(`\nNo variants produced for ${skipped.length} source(s) - too small for any target width:`);
  for (const s of skipped) console.warn(`  ${s}`);
}

if (processed === 0) {
  console.log(`No images found in ${path.relative(SITE, SRC)}`);
} else {
  console.log(
    `\nOptimized ${processed} image(s) at widths ${WIDTHS.join(", ")} ` +
      `(~${Math.max(0, savedBytes / 1024 / 1024).toFixed(1)}MB saved vs originals).`,
  );
  console.log("Reference them with <picture> + srcset — see the school-assets skill.");
}
