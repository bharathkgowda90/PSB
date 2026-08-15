---
name: design-qa
description: Check fit and finish on the school website — responsiveness, overflow, spacing rhythm, grid alignment, stretched images, tap targets, colour contrast and line length across every page and breakpoint. Use before publishing, after any CSS or layout change, and when asked whether the design is consistent, responsive, polished, or properly aligned.
---

# Design QA

`npm run check` proves the markup is *correct*. It cannot tell you the layout
*holds together*. A page can be perfectly valid and still overflow on a phone,
stretch a photograph, drift off the grid, or ship a 27px button nobody can tap.

`npm run qa` drives a real browser over the built site and checks what a
designer checks by eye.

## Running it

```bash
cd .claude/tools
npm run build              # qa reads dist/, so build first
npm run qa                 # every page, 3 viewports
npm run qa -- --page /     # one page, while iterating
npm run qa -- --json       # machine-readable
```

It starts its own server on port 4319 and shuts it down afterwards. Exit code
is non-zero if there is any **error**; warnings do not fail the run.

Viewports: **390px** (the phone most of this audience actually holds), **768px**
(tablet and the awkward middle), **1440px** (desktop).

## What it checks

| Check | Level | What it means |
|---|---|---|
| `overflow-page` | error | The page scrolls sideways. Always a bug. |
| `overflow-element` | error/warn | An element pokes past the viewport edge. |
| `broken-image` | error | An image 404s. Renders as a placeholder icon that every other check happily measures as fine. |
| `text-collision` | error | Two pieces of text overlap — usually absolute positioning meeting content that grew. |
| `image-stretch` | error | Rendered aspect ratio differs from the file's — the photo is squashed. |
| `contrast` | error | Text below WCAG AA against its actual painted background. |
| `header-overlap` | error | The `h1` sits under the fixed header. |
| `font` | error | A self-hosted face silently fell back to a system font. |
| `tap-target` | warn | A control smaller than 44×44px. |
| `image-dimensions` | warn | `<img>` without `width`/`height` — causes layout shift. |
| `measure` | warn | Running text past ~90 characters per line. |
| `alignment` | warn | The shared content left edge drifts between sections. |
| `rhythm` | warn | More than six distinct section paddings — the spacing scale has leaked. |

Reveal animations are forced complete before measuring, so nothing is judged
mid-transition.

## Reading the output

Findings group by check, most frequent first, and identical results collapse
across pages. One line repeated on twenty pages is **one systemic problem in a
shared component**, not twenty problems — fix it in `site.css`, not page by page.

A finding on a single page at a single viewport is usually a content-shape
problem: an unusually long word, a wide table, an odd image.

## Fix the tool when the tool is wrong

False positives are the tool's bug, not something to work around. Two are
already handled and are the pattern to follow:

- Elements parked off-screen on purpose — the skip link, `.visually-hidden`,
  the form honeypot — are excluded rather than reported as overflow.
- A checkbox is 22px by design; what the finger hits is its label row, so the
  row is measured instead.

If you find yourself mentally filtering the output, tighten the check.

Two traps the collision check had to learn, both worth knowing before adding
any geometry check:

- **A wrapped inline element's `getBoundingClientRect()` is the union box
  across all its lines**, so it overlaps its neighbours by construction. Only
  the per-line boxes from `getClientRects()` mean anything.
- **Chromium still lays out the content of a closed `<details>`**, so every
  collapsed FAQ answer reports a real, overlapping rect. They are skipped.

## What it does not check

Automation cannot see these. They still need a person:

- Whether the design is any *good* — hierarchy, emphasis, whether the page
  guides the eye.
- Whether an image is well chosen or well cropped.
- Real device rendering. Chromium at 390px is not an actual budget Android.
- Keyboard order and screen-reader flow beyond structural checks.
- Whether motion feels right, or merely runs.
- Whether a floating element sitting over content *reads* as intentional.
  Geometrically the header is fine; whether it looks fine is a human call.
- Anything only visible in the published preview. `npm run qa` measures the
  real site in `dist/`, so a preview-only defect passes it. The preview now
  runs the site's own `site.js` rather than a copy, which removes the usual
  cause, but check the published artifact too before calling a change done.

So report QA results as "0 errors, 0 warnings from `npm run qa`", never as
"the design is verified".

## Before publishing

```bash
cd .claude/tools
npm run check && npm run qa
```

Both must be clean. Then walk the manual list in `school-a11y` — keyboard pass,
zoom to 200%, and a look on a real phone.
