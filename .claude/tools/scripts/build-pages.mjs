/**
 * Assemble every page from one shell + per-page content fragments.
 *
 * Hand-copying the shell into 21 pages guarantees drift -- the single most
 * common defect on a site like this. Here the shell exists once; this script
 * writes the finished static HTML, which is committed so site/ stays plain
 * static files that any host can serve.
 *
 * Usage:  npm run pages
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, "../../../site");
const LAYOUT = path.join(SITE, "_layout");
const PAGES = path.join(SITE, "_pages");

const config = JSON.parse(await readFile(path.join(LAYOUT, "site.config.json"), "utf8"));
const shell = await readFile(path.join(LAYOUT, "shell.html"), "utf8");
const manifest = JSON.parse(await readFile(path.join(PAGES, "pages.json"), "utf8"));

/** Which top-level nav item should be marked aria-current for a given path. */
const NAV_SECTIONS = {
  ABOUT: "/about/",
  ACADEMICS: "/academics/",
  ADMISSIONS: "/admissions/",
  CAMPUS: "/campus/",
  STUDENTLIFE: "/student-life/",
  CONTACT: "/contact/",
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function breadcrumbsFor(page) {
  if (page.path === "/") return "";
  const trail = page.breadcrumbs || [];
  const items = [`<li><a href="/">Home</a></li>`];
  for (const crumb of trail) {
    items.push(`<li><a href="${crumb.href}">${escapeHtml(crumb.label)}</a></li>`);
  }
  items.push(`<li><span aria-current="page">${escapeHtml(page.crumb || page.h1)}</span></li>`);
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">
        <div class="wrap"><ol>${items.join("")}</ol></div>
      </nav>`;
}

let written = 0;
const seenTitles = new Map();
const problems = [];

for (const page of manifest.pages) {
  const fragmentPath = path.join(PAGES, page.file);
  let content;
  try {
    content = await readFile(fragmentPath, "utf8");
  } catch {
    problems.push(`missing fragment: ${page.file} (for ${page.path})`);
    continue;
  }

  // Duplicate titles and descriptions are an SEO defect and easy to introduce
  // by copy-paste, so fail the build rather than ship them.
  if (seenTitles.has(page.title)) {
    problems.push(`duplicate <title> on ${page.path} and ${seenTitles.get(page.title)}`);
  }
  seenTitles.set(page.title, page.path);

  if (page.description.length > 165) {
    problems.push(`description too long (${page.description.length} chars) on ${page.path}`);
  }

  let html = shell
    .replace(/{{LANG}}/g, config.site.lang)
    .replace(/{{LOCALE}}/g, config.site.locale)
    .replace(/{{ORIGIN}}/g, config.site.origin)
    .replace(/{{PATH}}/g, page.path)
    .replace(/{{TITLE}}/g, escapeHtml(page.title))
    .replace(/{{DESCRIPTION}}/g, escapeHtml(page.description))
    .replace(/{{HEAD_EXTRA}}/g, page.headExtra || "")
    .replace(/{{BREADCRUMBS}}/g, breadcrumbsFor(page))
    .replace(/{{CONTENT}}/g, content.trimEnd());

  for (const [key, href] of Object.entries(NAV_SECTIONS)) {
    const current = page.path === href || page.path.startsWith(href);
    html = html.replace(`{{NAV_${key}}}`, current ? ' aria-current="page"' : "");
  }

  const outDir = path.join(SITE, page.path);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "index.html"), html);
  written += 1;
}

// Any fragment not referenced by the manifest is dead weight or a forgotten
// wiring step -- both worth surfacing.
const fragments = (await readdir(PAGES)).filter((f) => f.endsWith(".html"));
const referenced = new Set(manifest.pages.map((p) => p.file));
for (const fragment of fragments) {
  if (!referenced.has(fragment)) problems.push(`orphan fragment (not in pages.json): ${fragment}`);
}

console.log(`Generated ${written} page(s) from ${manifest.pages.length} manifest entries.`);

if (problems.length) {
  console.error("\nProblems:");
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
