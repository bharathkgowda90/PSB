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
const OUT = path.join(ROOT, "preview.html");

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
const header = home.match(/<header class="site-header">[\s\S]*?<\/header>/)[0];
const footer = home.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)[0];

// ------------------------------------------------------------- inline assets

const assets = new Map();
for (const [rel, mime] of [
  ["assets/fonts/lexend-latin.woff2", "font/woff2"],
  ["assets/fonts/lexend-latin-ext.woff2", "font/woff2"],
  ["assets/img/logo.svg", "image/svg+xml"],
  ["assets/img/hero-480.webp", "image/webp"],
  ["assets/img/hero-960.webp", "image/webp"],
  ["assets/img/hero-1600.webp", "image/webp"],
  ["assets/img/hero-960.jpg", "image/jpeg"],
]) {
  const file = path.join(DIST, rel);
  if (existsSync(file)) assets.set("/" + rel, await dataUri(file, mime));
}

const inlineAssets = (html) => {
  let out = html;
  for (const [route, uri] of assets) out = out.split(route).join(uri);
  return out;
};

const shellHeader = inlineAssets(header);
const shellFooter = inlineAssets(footer);
for (const page of pages) page.main = inlineAssets(page.main);

// The stylesheet's @font-face rules point at font files by path. A single-file
// preview has no such paths, so swap them for the inlined data URIs too --
// otherwise the preview silently falls back to a system font and misrepresents
// the typography, which is the whole point of the review.
const inlinedCss = inlineAssets(css);
for (const rel of ["/assets/fonts/lexend-latin.woff2", "/assets/fonts/lexend-latin-ext.woff2"]) {
  if (assets.has(rel) && inlinedCss.includes(rel)) {
    console.error(`font not inlined into CSS: ${rel}`);
    process.exit(1);
  }
}

// ------------------------------------------------------------------- emit

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
      .preview-bar select {
        max-width: 100%;
        padding: 0.2rem 0.4rem;
        border: 0;
        border-radius: 4px;
        margin-left: 0.5rem;
        font-family: inherit;
        font-size: 0.85rem;
      }
      .site-header { top: 2.6rem; }
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
        wireMaps();
      }

      // Rewrite every internal link to a hash route, once, across the whole document.
      function rewrite(scope) {
        scope.querySelectorAll('a[href^="/"]').forEach(function (a) {
          var href = a.getAttribute("href");
          a.setAttribute("data-href", href);
          a.setAttribute("href", PAGES[href] ? "#" + href : "#/");
        });
      }

      // The real site loads a Google Maps iframe here. A hosted preview blocks
      // external requests, so say so rather than fail silently.
      function wireMaps() {
        main.querySelectorAll(".map-facade").forEach(function (b) {
          b.addEventListener("click", function () {
            b.outerHTML =
              '<div class="img-placeholder">Google Maps loads here on the real site.' +
              '<br />External requests are blocked in this preview.</div>';
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

      // Mobile nav, same behaviour as the real site.
      var toggle = document.querySelector(".nav-toggle");
      var nav = document.getElementById("primary-nav");
      function setOpen(open) {
        toggle.setAttribute("aria-expanded", String(open));
        nav.classList.toggle("is-open", open);
      }
      toggle.addEventListener("click", function () {
        setOpen(toggle.getAttribute("aria-expanded") !== "true");
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
          setOpen(false);
          toggle.focus();
        }
      });
      nav.addEventListener("click", function (e) {
        if (e.target.tagName === "A") setOpen(false);
      });

      render();
    </script>
  </body>
</html>
`;

await writeFile(OUT, doc);
console.log(
  `preview.html written: ${pages.length} pages, ${(Buffer.byteLength(doc) / 1024).toFixed(0)}kB`,
);
