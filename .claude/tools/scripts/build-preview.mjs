/**
 * Bundle the whole built site into ONE self-contained HTML file for review.
 *
 * The real site is 25 separate pages plus linked CSS, JS and images. A hosted
 * preview has to be a single file with no external requests, so this inlines
 * the stylesheet, inlines images as data URIs, embeds every page's <main>, and
 * adds a small hash router so the navigation still works.
 *
 * This is a REVIEW ARTEFACT ONLY. It is not the deliverable and is never
 * deployed -- dist/ is what gets published.
 *
 * Usage:  npm run preview   (run `npm run build` first)
 */
import { readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../../..");
const DIST = path.join(ROOT, "dist");
const OUT = path.join(ROOT, "site-preview.html");

if (!existsSync(DIST)) {
  console.error("No dist/ -- run `npm run build` first.");
  process.exit(1);
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const dataUri = async (file, mime) =>
  `data:${mime};base64,${(await readFile(file)).toString("base64")}`;

// ---------------------------------------------------------------- collect

const pages = [];
for await (const file of walk(DIST)) {
  if (path.basename(file) !== "index.html") continue;
  const html = await readFile(file, "utf8");
  const route = "/" + path.relative(DIST, path.dirname(file)).split(path.sep).filter(Boolean).join("/");
  const main = html.match(/<main id="main">([\s\S]*?)<\/main>/);
  const title = html.match(/<title>([\s\S]*?)<\/title>/);
  if (!main) {
    console.error(`no <main> in ${file}`);
    process.exit(1);
  }
  pages.push({
    route: route === "/" ? "/" : route + "/",
    title: title ? title[1] : "",
    main: main[1],
  });
}
pages.sort((a, b) => a.route.localeCompare(b.route));

const home = await readFile(path.join(DIST, "index.html"), "utf8");
const css = await readFile(path.join(DIST, "assets/css/site.css"), "utf8");
const siteJs = await readFile(path.join(DIST, "assets/js/site.js"), "utf8");
const header = home.match(/<header class="site-header">[\s\S]*?<\/header>/)[0];
const footer = home.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)[0];
const navPanel = home.match(/<nav class="primary-nav"[\s\S]*?<\/nav>/)[0];

// ------------------------------------------------------------- inline assets

const assets = new Map();

/* Inline EVERY font and image the site ships, discovered by walking dist/
   rather than listed by hand. A hardcoded list silently misses whatever was
   added since it was written — which is exactly how the prop, pillar, marquee
   and split photographs ended up as broken-image icons in the preview. */
const MIME = {
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".avif": "image/avif",
};

for (const dir of ["assets/fonts", "assets/img"]) {
  const abs = path.join(DIST, dir);
  if (!existsSync(abs)) continue;
  for await (const file of walk(abs)) {
    const mime = MIME[path.extname(file).toLowerCase()];
    if (!mime) continue;
    const rel = "/" + path.relative(DIST, file).split(path.sep).join("/");
    assets.set(rel, await dataUri(file, mime));
  }
}

const assetsByLength = [...assets.entries()].sort((a, b) => b[0].length - a[0].length);

const inlineAssets = (html) => {
  let out = html;
  for (const [route, uri] of assetsByLength) out = out.split(route).join(uri);
  return out;
};

const shellHeader = inlineAssets(header) + "\n    " + inlineAssets(navPanel);
const shellFooter = inlineAssets(footer);
for (const page of pages) page.main = inlineAssets(page.main);

// The stylesheet's @font-face rules point at font files by path. A single-file
// preview has no such paths, so swap them for the inlined data URIs too --
// otherwise the preview silently falls back to a system font and misrepresents
// the typography, which is the whole point of the review.
const inlinedCss = inlineAssets(css);
for (const rel of [
  "/assets/fonts/instrument-serif-latin.woff2",
  "/assets/fonts/instrument-serif-latin-ext.woff2",
  "/assets/fonts/lexend-latin.woff2",
  "/assets/fonts/lexend-latin-ext.woff2",
]) {
  if (assets.has(rel) && inlinedCss.includes(rel)) {
    console.error(`font not inlined into CSS: ${rel}`);
    process.exit(1);
  }
}

// ------------------------------------------------------------------- emit

const leftover = new Set();
for (const html of [shellHeader, shellFooter, ...pages.map((p) => p.main)]) {
  for (const m of html.matchAll(/\/assets\/[^"')\s,]+/g)) leftover.add(m[0]);
}
if (leftover.size) {
  console.error(`\nReferenced but not inlined -- these would render broken in the preview:`);
  for (const a of leftover) console.error(`  ${a}`);
  console.error("Usually a missing responsive size. Check site/assets/img/ and the markup.");
  process.exit(1);
}

const payload = JSON.stringify(
  Object.fromEntries(pages.map((p) => [p.route, { title: p.title, main: p.main }])),
);

const doc = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Prashanth High School of Brilliance</title>
    <style>
${inlinedCss}
      /* Preview-only chrome, not part of the real site. */
      .preview-bar {
        position: sticky;
        z-index: 300;
        top: 0;
        padding: 0.6rem 1rem;
        background: #1f2328;
        color: #fff;
        font-family: var(--font);
        font-size: 0.85rem;
        text-align: center;
      }
      .preview-bar strong { color: var(--yellow); }
      /* The open menu pins the site header to the top of the viewport, which in
         the real site is the top of the page. Here the preview bar occupies
         that space, so the header — and its close button — would slide under
         it and stop being clickable. Measured at runtime, since the bar's
         height depends on how far its text wraps. */
      body.nav-open .site-header { top: var(--preview-bar-h, 0px); }
      body.nav-open .primary-nav { padding-top: calc(var(--nav-h) + var(--preview-bar-h, 0px) + var(--gutter) * 2); }
      .preview-bar select {
        max-width: 100%;
        padding: 0.2rem 0.4rem;
        border: 0;
        border-radius: 4px;
        margin-left: 0.5rem;
        font-family: inherit;
        font-size: 0.85rem;
      }
    </style>
  </head>
  <body>
    <div class="preview-bar">
      <strong>PREVIEW</strong> &mdash; all ${pages.length} pages in one file. Navigation works; the
      map and enquiry form are inert here.
      <label>
        <span class="visually-hidden">Jump to page</span>
        <select id="preview-jump"></select>
      </label>
    </div>

    <a class="skip-link" href="#main">Skip to main content</a>
    ${shellHeader}
    <main id="main"></main>
    ${shellFooter}

    <script>
${siteJs}
    </script>

    <script>
      var PAGES = ${payload};

      var main = document.getElementById("main");
      var jump = document.getElementById("preview-jump");

      Object.keys(PAGES).forEach(function (route) {
        var o = document.createElement("option");
        o.value = route;
        o.textContent = route;
        jump.appendChild(o);
      });

      function routeFromHash() {
        var h = location.hash.replace(/^#/, "");
        return PAGES[h] ? h : "/";
      }

      // Preview-only: publish the bar's height so the pinned header can clear it.
      function measureBar() {
        var bar = document.querySelector(".preview-bar");
        if (!bar) return;
        document.documentElement.style.setProperty(
          "--preview-bar-h",
          Math.round(bar.getBoundingClientRect().height) + "px",
        );
      }
      measureBar();
      window.addEventListener("resize", measureBar);

      function render() {
        var route = routeFromHash();
        var page = PAGES[route];
        main.innerHTML = page.main;
        document.title = page.title;
        jump.value = route;

        document.querySelectorAll(".primary-nav__list a").forEach(function (a) {
          var href = a.getAttribute("data-href") || a.getAttribute("href");
          var target = href.replace(/^#/, "");
          if (target !== "/" && route.indexOf(target) === 0) {
            a.setAttribute("aria-current", "page");
          } else {
            a.removeAttribute("aria-current");
          }
        });

        window.scrollTo(0, 0);
        // The router replaces main's content, so the site's own per-content
        // initialisation has to run again for the newly injected markup.
        if (window.PSBSite) window.PSBSite.initContent(main);
        markMapsInert();
      }

      // Rewrite every internal link to a hash route, once, across the whole document.
      function rewrite(scope) {
        scope.querySelectorAll('a[href^="/"]').forEach(function (a) {
          var href = a.getAttribute("href");
          a.setAttribute("data-href", href);
          a.setAttribute("href", PAGES[href] ? "#" + href : "#/");
        });
      }

      // A hosted preview cannot make external requests, so say so plainly
      // rather than letting the map button fail silently.
      function markMapsInert() {
        main.querySelectorAll(".map-facade").forEach(function (b) {
          b.addEventListener("click", function (e) {
            e.stopImmediatePropagation();
            b.outerHTML =
              '<div class="img-placeholder">Google Maps loads here on the real site.' +
              "<br />External requests are blocked in this preview.</div>";
          });
        });
      }

      var observer = new MutationObserver(function () {
        rewrite(main);
      });
      observer.observe(main, { childList: true, subtree: true });

      rewrite(document);
      jump.addEventListener("change", function () {
        location.hash = jump.value;
      });
      window.addEventListener("hashchange", render);


      render();
    </script>
  </body>
</html>
`;

await writeFile(OUT, doc);
console.log(
  `site-preview.html written: ${pages.length} pages, ${(Buffer.byteLength(doc) / 1024).toFixed(0)}kB`,
);
