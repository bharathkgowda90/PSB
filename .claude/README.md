# Development tooling — delete before publishing

Everything needed to build the PSB school website lives in this one folder.
Nothing outside it depends on anything inside it, so the whole thing can be
removed with a single command when the site is handed over:

```bash
rm -rf .claude
```

The published site is `site/` (source) and `dist/` (build output). Neither
references this folder — `npm run build` fails loudly if that ever stops being
true.

## Contents

```
.claude/
  skills/            authoring guides Claude loads automatically
    school-page/     page shell, grade taxonomy, file layout
    school-content/  copy voice, terminology, the no-invented-facts rule
    school-a11y/     WCAG 2.1 AA checks and the site's a11y patterns
    school-assets/   image pipeline, responsive markup, child-photo privacy
    school-seo/      titles, structured data, sitemap, local search
    publish-site/    pre-flight checklist, build, and teardown
    <13 more>       vendored design skills from leonxlnx/taste-skill (MIT)
  agents/
    site-reviewer.md review agent for shell drift, taxonomy, privacy, a11y
  vendor/
    taste-skill/     licence + provenance for the vendored design skills
  tools/             the npm toolchain
    package.json
    scripts/         optimize-images.mjs, check.mjs, build.mjs
    node_modules/    gitignored; restore with `npm install`
```

## Installed packages

| Package | Purpose |
|---|---|
| `prettier` | Formats HTML, CSS, JS, JSON consistently |
| `html-validate` | HTML validity **and** the WCAG rule set |
| `stylelint` + `stylelint-config-standard` | CSS linting |
| `sharp` | Resizes and re-encodes photos; strips EXIF |
| `lightningcss` | CSS minification at build time |
| `esbuild` | JS minification at build time |
| `serve` | Local static preview server |

All development dependencies. Zero of them ship to the browser — the site is
plain static HTML, CSS, and JS with no runtime framework.

## Commands

Run from `.claude/tools/`:

```bash
npm install         # restore node_modules
npm run dev         # preview the site at http://localhost:3000
npm run check       # HTML + WCAG + CSS + formatting gates
npm run format      # auto-fix formatting
npm run images      # generate responsive WebP/JPEG from site/assets/img/_raw/
npm run build       # produce dist/, minified, with a .claude/ leak check
```

## Site layout the tooling assumes

```
site/                web root — the only thing that gets published
  assets/css|js|img
  _partials/         reference copies of header, nav, footer
  assets/img/_raw/   original photos, never published
dist/                build output, generated
.claude/             this folder, deleted at handover
```

This layout is provisional until the site plan is agreed; the tooling paths in
`tools/package.json` and `tools/scripts/` need updating together if it changes.

## Skill precedence

The `school-*` skills are authoritative for this project. The vendored
`taste-skill` design skills are advisory — useful for visual direction, but
overruled wherever they conflict with the static-HTML stack, WCAG 2.1 AA, the
copy rules, or the performance budgets. See `vendor/taste-skill/README.md`.
