---
name: school-page
description: Create or edit a page on the PSB school website so it matches the shared shell — header, nav, footer, breadcrumbs, section landmarks, and the class/grade taxonomy from Pre-school through Class 10. Use whenever adding a new page, restructuring an existing one, or wiring a page into the navigation.
---

# Building a page on the school site

The site is plain static HTML/CSS/JS with no runtime framework. Pages are
**generated** from a single shell plus per-page content fragments, and the
generated HTML is committed — so `site/` stays plain static files any host can
serve, while the shell exists in exactly one place and cannot drift.

## Where things live

```
site/                     the web root
  _layout/
    shell.html            the one and only page shell
    site.config.json      school facts: name, address, phone, origin
  _pages/
    pages.json            every page: path, title, description, breadcrumbs
    *.html                content fragments (what goes inside <main>)
  index.html              GENERATED — do not hand-edit
  about/ academics/ …     GENERATED — do not hand-edit
  assets/
    css/site.css
    js/site.js
    img/
      _raw/               photo originals, never published
```

Directories beginning with `_` are build inputs and are excluded from `dist/`.

## Never hand-edit a generated page

Editing `site/about/index.html` directly is wasted work — the next
`npm run pages` overwrites it. Change the fragment in `site/_pages/`, or the
shell in `site/_layout/`, then regenerate:

```bash
cd .claude/tools && npm run pages
```

Adding a page means adding both a fragment and an entry in `pages.json`. The
generator fails the build on a missing fragment, an orphan fragment, a duplicate
`<title>`, or a description over 165 characters.

## The grade taxonomy

Use these labels verbatim — they appear in nav, page titles, URLs, and copy.
Getting them inconsistent across pages is the most common defect on this site.

| Stage | Grades | URL segment |
|---|---|---|
| Pre-Primary | Pre-School, Pre-KG, LKG, UKG | `pre-primary` |
| Primary | Class 1 – Class 5 | `primary` |
| Middle | Class 6 – Class 8 | `middle` |
| Secondary | Class 9 – Class 10 | `secondary` |

Confirmed with the school: all four stages exist, and Pre-Primary runs
Pre-School → Pre-KG → LKG → UKG in that order before Class 1.

Write "Class 1", not "Class-1", "class 1", "Grade 1", or "1st Standard".
Write "Pre-KG", not "Pre KG" or "PreKG". Write "LKG" and "UKG" uppercase and
unpunctuated, never "L.K.G." or "Lower KG".

## Fragment skeleton

A fragment contains only what goes inside `<main>` after the breadcrumbs. The
shell supplies `<head>`, header, nav, breadcrumbs and footer.

```html
<section class="page-head">
  <div class="wrap">
    <h1>Page heading</h1>
    <p>One sentence saying what this page answers.</p>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <h2>First real section</h2>
    <p>…</p>
  </div>
</section>
```

Every fragment needs exactly one `<h1>`, and every block needs a `.wrap` inside
it for the page's max width and gutters.

Use `.placeholder` with a `.placeholder__tag` for anything the school has not
yet supplied. It renders as a loud dashed red box that cannot be mistaken for
real information — which is the point.

## Rules that the linters enforce

- Exactly one `<h1>` per page, and heading levels never skip (`h1` → `h2` → `h3`).
- Every page is reachable from the main nav or from a parent section page.
  An orphan page is a bug even though no linter catches it — check by hand.
- Link text inside a `tel:` link uses `&nbsp;` for every space, not just inside
  the number — html-validate's `tel-non-breaking` rule flags all of them.
- Every `<img>` needs a meaningful `alt`; decorative images get `alt=""`.
- Interactive controls are `<a>` or `<button>`, never a clickable `<div>`.
- Internal links are root-relative (`/academics/primary/`), never relative
  (`../primary/`) — relative links break when a page moves.

## After editing

Run the gates from `.claude/tools/`:

```bash
cd .claude/tools
npm run pages      # regenerate pages from _layout + _pages
npm run check      # regenerate, format, then HTML + WCAG + CSS gates
npm run dev        # preview at http://localhost:3000
```

`check` and `build` regenerate and format first, so a stale generated page can
never pass the gates.

Fix what `check` reports before moving on. A page that fails the gates is not
done, regardless of how it looks in the browser.
