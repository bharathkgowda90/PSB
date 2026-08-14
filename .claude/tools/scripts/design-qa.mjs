/**
 * Design QA — automated fit-and-finish checks across every page and breakpoint.
 *
 * html-validate and stylelint check correctness. They cannot see whether a
 * layout actually holds together: whether things overflow, stretch, sit on the
 * grid, land on the spacing scale, or stay tappable. This drives a real browser
 * over the built site and checks what a designer would check by eye.
 *
 * Usage:  npm run qa                 (all pages, 3 viewports)
 *         npm run qa -- --page /     (one page)
 *         npm run qa -- --json       (machine-readable)
 */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../../..");
const DIST = path.join(ROOT, "dist");
const BROWSER = "/opt/pw-browsers/chromium";
const PORT = 4319;

const args = process.argv.slice(2);
const onlyPage = args.includes("--page") ? args[args.indexOf("--page") + 1] : null;
const asJson = args.includes("--json");

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

/* Thresholds. Each is a design decision, not a magic number. */
const LIMITS = {
  tapTarget: 44, // WCAG 2.5.5 AAA / sensible minimum for one-handed phone use
  aspectDrift: 0.02, // >2% between natural and rendered aspect = visible stretch
  maxMeasure: 90, // characters per line before running text gets hard to track
  contrastBody: 4.5, // WCAG AA normal text
  contrastLarge: 3.0, // WCAG AA large text (>=24px, or >=18.66px bold)
  alignTolerance: 2, // px of drift allowed in the shared content left edge
};

if (!existsSync(DIST)) {
  console.error("No dist/ — run `npm run build` first.");
  process.exit(1);
}

/* ------------------------------------------------------------------ server */

const server = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["serve", DIST, "-l", String(PORT), "--no-clipboard"],
  { cwd: path.join(ROOT, ".claude/tools"), stdio: "ignore" },
);

const stop = () => {
  try {
    server.kill();
  } catch {
    /* already gone */
  }
};
process.on("exit", stop);
process.on("SIGINT", () => {
  stop();
  process.exit(130);
});

const base = `http://localhost:${PORT}`;
await (async () => {
  for (let i = 0; i < 40; i += 1) {
    try {
      const res = await fetch(base + "/");
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  console.error("Preview server did not start.");
  process.exit(1);
})();

/* ------------------------------------------------------------------- pages */

const manifest = JSON.parse(await readFile(path.join(ROOT, "site/_pages/pages.json"), "utf8"));
const routes = manifest.pages.map((p) => p.path).filter((p) => !onlyPage || p === onlyPage);

/* ------------------------------------------------------------------ checks
   Everything below runs inside the page. Kept as one serialised function so
   the browser is only round-tripped once per page/viewport pair. */

const collect = function (LIMITS) {
  const out = [];
  const add = (level, check, detail, el) =>
    out.push({
      level,
      check,
      detail,
      where: el
        ? el.tagName.toLowerCase() +
          (el.id ? "#" + el.id : "") +
          (el.className && typeof el.className === "string" && el.className.trim()
            ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
            : "")
        : "",
    });

  const vw = document.documentElement.clientWidth;

  /* Some elements are parked off-screen on purpose: the skip link until it is
     focused, visually-hidden labels, and the form honeypot. They are not
     layout defects and must not be reported as such. */
  const parkedOffscreen = (el) =>
    !!el.closest(".skip-link, .hp, .visually-hidden") ||
    el.classList.contains("skip-link") ||
    el.classList.contains("hp") ||
    el.classList.contains("visually-hidden");

  /* 1. Page-level horizontal overflow. */
  const pageOver = document.documentElement.scrollWidth - vw;
  if (pageOver > 1) add("error", "overflow-page", `page scrolls ${pageOver}px sideways`);

  /* 2. Individual elements poking past the viewport. Skips anything
        deliberately full-bleed and anything inside a scroll container. */
  document.querySelectorAll("body *").forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.position === "fixed") return;
    if (el.closest(".table-scroll, .marquee, [style*='overflow']")) return;
    if (parkedOffscreen(el)) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    const past = Math.round(r.right - vw);
    if (past > 1 && cs.width !== "100vw") add("error", "overflow-element", `${past}px past the right edge`, el);
    if (Math.round(r.left) < -1 && cs.marginLeft.indexOf("-") !== 0)
      add("warn", "overflow-element", `${Math.abs(Math.round(r.left))}px past the left edge`, el);
  });

  /* 3. Tap targets. Links inside running text are exempt — the rule is about
        controls, not every inline link in a paragraph. */
  document.querySelectorAll("a, button, input, select, textarea, summary").forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return;
    if (el.closest("p, li, td, th, address, .breadcrumbs")) return;
    if (parkedOffscreen(el)) return;

    /* A checkbox or radio is small by design; what the finger actually hits is
       the row formed with its label. Measure that instead. */
    let r = el.getBoundingClientRect();
    if (el.type === "checkbox" || el.type === "radio") {
      const row = el.closest(".field--check, label") || el.parentElement;
      if (row) r = row.getBoundingClientRect();
    }
    if (r.width === 0 || r.height === 0) return;
    if (r.height < LIMITS.tapTarget || r.width < LIMITS.tapTarget)
      add(
        "warn",
        "tap-target",
        `${Math.round(r.width)}×${Math.round(r.height)}px, below ${LIMITS.tapTarget}px`,
        el,
      );
  });

  /* 4. Stretched images — rendered aspect ratio differing from the natural
        one means the picture is squashed. */
  document.querySelectorAll("img").forEach((img) => {
    if (!img.complete || !img.naturalWidth) return;
    const r = img.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return;
    const fit = getComputedStyle(img).objectFit;
    if (fit === "cover" || fit === "contain") return; // cropping is intentional
    const natural = img.naturalWidth / img.naturalHeight;
    const rendered = r.width / r.height;
    const drift = Math.abs(rendered - natural) / natural;
    if (drift > LIMITS.aspectDrift)
      add(
        "error",
        "image-stretch",
        `rendered ${rendered.toFixed(3)} vs natural ${natural.toFixed(3)} (${(drift * 100).toFixed(1)}% off)`,
        img,
      );
    if (!img.getAttribute("width") || !img.getAttribute("height"))
      add("warn", "image-dimensions", "no width/height attributes — causes layout shift", img);
  });

  /* 5. Content hidden behind the fixed header. */
  const header = document.querySelector(".site-header");
  if (header) {
    const hb = header.getBoundingClientRect();
    const main = document.getElementById("main");
    if (main) {
      const first = main.querySelector("h1");
      if (first) {
        const fr = first.getBoundingClientRect();
        if (fr.top < hb.bottom && fr.bottom > hb.top)
          add("error", "header-overlap", "the h1 sits under the fixed header", first);
      }
    }
  }

  /* 6. Measure — running text far past a comfortable line length. */
  document.querySelectorAll("p").forEach((p) => {
    const text = (p.textContent || "").trim();
    if (text.length < 120) return;
    const cs = getComputedStyle(p);
    const r = p.getBoundingClientRect();
    const ch = parseFloat(cs.fontSize) * 0.5; // ≈ average character advance
    const chars = r.width / ch;
    if (chars > LIMITS.maxMeasure)
      add("warn", "measure", `≈${Math.round(chars)} characters per line`, p);
  });

  /* 7. Contrast for visible text against its nearest painted background. */
  const lum = (c) => {
    const s = c.map((v) => {
      const x = v / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];
  };
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const parts = m[1].split(",").map((n) => parseFloat(n));
    if (parts.length > 3 && parts[3] === 0) return null; // transparent
    return parts.slice(0, 3);
  };
  const bgOf = (el) => {
    let node = el;
    while (node && node !== document.documentElement) {
      const c = parse(getComputedStyle(node).backgroundColor);
      if (c) return c;
      node = node.parentElement;
    }
    return [255, 255, 255];
  };

  document
    .querySelectorAll("p, li, td, th, h1, h2, h3, h4, a, span, button, label, caption, address")
    .forEach((el) => {
      if (!el.textContent || !el.textContent.trim()) return;
      // Only leaf-ish nodes, so the same text is not measured repeatedly.
      if (el.querySelector("p, li, h1, h2, h3, h4, span, a")) return;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") return;
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) return;
      const fg = parse(cs.color);
      if (!fg) return;
      const bg = bgOf(el);
      const l1 = lum(fg);
      const l2 = lum(bg);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const size = parseFloat(cs.fontSize);
      const bold = Number(cs.fontWeight) >= 700;
      const large = size >= 24 || (bold && size >= 18.66);
      const need = large ? LIMITS.contrastLarge : LIMITS.contrastBody;
      if (ratio < need)
        add(
          "error",
          "contrast",
          `${ratio.toFixed(2)}:1 against background, needs ${need}:1 (${Math.round(size)}px)`,
          el,
        );
    });

  /* 8. Grid alignment — every top-level content block should share one left
        edge. Drift here is what makes a page feel subtly untidy. */
  const lefts = [];
  document.querySelectorAll("main > section > .wrap, main > section > .container").forEach((el) => {
    const cs = getComputedStyle(el);
    lefts.push(Math.round(el.getBoundingClientRect().left + parseFloat(cs.paddingLeft)));
  });
  if (lefts.length > 1) {
    const min = Math.min(...lefts);
    const max = Math.max(...lefts);
    if (max - min > LIMITS.alignTolerance)
      add("warn", "alignment", `content left edge varies by ${max - min}px across sections`);
  }

  /* 9. Vertical rhythm — section padding should come from a small scale, not
        arbitrary values. */
  const pads = new Set();
  document.querySelectorAll("main > section").forEach((el) => {
    const cs = getComputedStyle(el);
    pads.add(Math.round(parseFloat(cs.paddingTop)));
    pads.add(Math.round(parseFloat(cs.paddingBottom)));
  });
  if (pads.size > 6)
    add("warn", "rhythm", `${pads.size} distinct section paddings: ${[...pads].sort((a, b) => a - b).join(", ")}`);

  /* 10. Fonts actually applied rather than silently falling back. */
  if (document.fonts && document.fonts.check) {
    if (!document.fonts.check('1em "Instrument Serif"'))
      add("error", "font", "display face Instrument Serif did not load");
    if (!document.fonts.check("1em lexend")) add("error", "font", "text face Lexend did not load");
  }

  return out;
};

/* -------------------------------------------------------------------- run */

const browser = await chromium.launch({ executablePath: BROWSER });
const findings = [];

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    // Settle reveal animations so nothing is measured mid-transition.
    await page.evaluate(() => {
      document
        .querySelectorAll("[data-reveal], [data-reveal-stagger]")
        .forEach((el) => el.classList.add("is-visible"));
    });
    await page.waitForTimeout(120);
    const results = await page.evaluate(collect, LIMITS);
    for (const r of results) findings.push({ ...r, route, viewport: vp.name });
  }
  await page.close();
}

await browser.close();
stop();

/* ----------------------------------------------------------------- report */

if (asJson) {
  console.log(JSON.stringify(findings, null, 2));
  process.exit(findings.some((f) => f.level === "error") ? 1 : 0);
}

const errors = findings.filter((f) => f.level === "error");
const warns = findings.filter((f) => f.level === "warn");

// Group by check, then collapse identical detail across routes/viewports so a
// systemic problem reads as one finding rather than seventy.
const byCheck = new Map();
for (const f of findings) {
  if (!byCheck.has(f.check)) byCheck.set(f.check, []);
  byCheck.get(f.check).push(f);
}

console.log(`\nDesign QA — ${routes.length} page(s) × ${VIEWPORTS.length} viewports\n`);

for (const [check, list] of [...byCheck.entries()].sort(
  (a, b) => b[1].length - a[1].length,
)) {
  const level = list.some((f) => f.level === "error") ? "ERROR" : "warn ";
  console.log(`${level}  ${check}  (${list.length})`);
  const seen = new Set();
  for (const f of list) {
    const key = f.where + "|" + f.detail;
    if (seen.has(key)) continue;
    seen.add(key);
    if (seen.size > 6) {
      console.log(`         … and ${list.length - 6} more`);
      break;
    }
    console.log(`         ${f.route} @${f.viewport}  ${f.where || "(page)"}  — ${f.detail}`);
  }
  console.log("");
}

console.log("─".repeat(60));
console.log(`${errors.length} error(s), ${warns.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
