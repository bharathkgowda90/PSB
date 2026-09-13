/* Measures the real vertical gap between every pair of adjacent sections, on
   every built page, at three viewports — the gap a reader sees, not the one the
   padding claims. The two differ whenever content carries its own leading or
   trailing margin, and that difference is invisible in the CSS.

   Serves dist/ itself, so it needs no separate server. */
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Every built page.
const root = "/home/user/PSB/dist";
const routes = [];
(function walk(dir, base) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { if (!e.startsWith("_") && e !== "assets") walk(p, base + e + "/"); }
    else if (e === "index.html") routes.push("/" + base);
  }
})(root, "");
routes.sort();

const server = createServer((req, res) => {
  const url = req.url.split("?")[0];
  const file = join(root, url.endsWith("/") ? url + "index.html" : url);
  const TYPES = { html: "text/html", css: "text/css", js: "text/javascript",
    woff2: "font/woff2", jpg: "image/jpeg", png: "image/png", webp: "image/webp",
    svg: "image/svg+xml", json: "application/json" };
  try {
    const body = readFileSync(file);
    const ext = (url.endsWith("/") ? "html" : url.split(".").pop()).toLowerCase();
    // The wrong type here is not a cosmetic problem: serve the stylesheet as
    // application/octet-stream and the browser ignores it, and the audit
    // cheerfully measures an unstyled page.
    res.writeHead(200, { "content-type": TYPES[ext] || "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, r));
const ORIGIN = "http://127.0.0.1:" + server.address().port;

const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const out = [];
for (const [vp, w] of [["mobile", 390], ["tablet", 768], ["desktop", 1440]]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
  for (const r of routes) {
    await p.goto(ORIGIN + r, { waitUntil: "domcontentloaded" });
    const rows = await p.evaluate(() => {
      const main = document.getElementById("main");
      const secs = [...main.children].filter((e) => e.tagName === "SECTION" || e.classList.contains("motif-band"));
      // The last painted box inside a section, and the first — so we measure the
      // gap a reader actually sees, not the one the padding claims.
      const edge = (el, which) => {
        let best = null;
        for (const n of el.querySelectorAll("*")) {
          const cs = getComputedStyle(n);
          if (cs.display === "none" || cs.visibility === "hidden") continue;
          const r = n.getBoundingClientRect();
          if (!r.width || !r.height) continue;
          const hasInk = n.childNodes.length && [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())
            || ["IMG", "HR", "BUTTON", "INPUT"].includes(n.tagName)
            || getComputedStyle(n).backgroundColor !== "rgba(0, 0, 0, 0)";
          if (!hasInk) continue;
          const v = which === "top" ? r.top : r.bottom;
          if (best === null) best = v;
          else best = which === "top" ? Math.min(best, v) : Math.max(best, v);
        }
        return best;
      };
      return secs.map((s) => {
        const r = s.getBoundingClientRect();
        const cs = getComputedStyle(s);
        return {
          cls: s.className || s.tagName.toLowerCase(),
          top: r.top + scrollY, bottom: r.bottom + scrollY,
          padTop: parseFloat(cs.paddingTop), padBottom: parseFloat(cs.paddingBottom),
          inkTop: edge(s, "top") === null ? null : edge(s, "top") + scrollY,
          inkBottom: edge(s, "bottom") === null ? null : edge(s, "bottom") + scrollY,
        };
      });
    });
    for (let i = 0; i < rows.length - 1; i++) {
      const a = rows[i], c = rows[i + 1];
      if (a.inkBottom == null || c.inkTop == null) continue;
      out.push({ vp, route: r, from: a.cls, to: c.cls,
        optical: Math.round(c.inkTop - a.inkBottom),
        padPair: Math.round(a.padBottom + c.padTop) });
    }
  }
  await p.close();
}
await b.close();
server.close();
writeFileSync("/tmp/claude-0/-home-user-PSB/257b2af5-bac7-5c0d-acee-4ac710921f7f/scratchpad/spacing.json", JSON.stringify(out, null, 1));
console.log("routes:", routes.length, "| measurements:", out.length);
