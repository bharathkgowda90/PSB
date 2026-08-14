---
name: school-page
description: Create or edit a page on the PSB school website so it matches the shared shell — header, nav, footer, breadcrumbs, section landmarks, and the class/grade taxonomy from Pre-school through Class 10. Use whenever adding a new page, restructuring an existing one, or wiring a page into the navigation.
---

# Building a page on the school site

The site is plain static HTML/CSS/JS. There is no framework and no build-time
templating — every page carries its own full shell. That means consistency is
maintained by copying the shell exactly, not by editing a layout file.

## Where things live

```
site/                     the web root — everything published comes from here
  index.html
  about/                  about the school, leadership, affiliation
  academics/              curriculum by stage
  admissions/
  student-life/
  contact/
  assets/
    css/                  site.css + per-section files
    js/
    img/
      _raw/               originals, never published
  _partials/              reference copies of the shell (see below)
```

`site/_partials/` holds the canonical `header.html`, `nav.html`, and
`footer.html`. They are **reference copies**, not includes. When the shell
changes, update the partial first, then propagate to every page. Never let a
page's shell drift from the partial.

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

## Page skeleton

Every page starts from this. Fill the four marked slots; leave everything else
byte-identical to the other pages.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title><!-- PAGE TITLE --> | PSB School</title>
    <meta name="description" content="<!-- 150-160 CHAR SUMMARY -->" />
    <link rel="stylesheet" href="/assets/css/site.css" />
    <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml" />
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to main content</a>
    <!-- header + nav: copy verbatim from site/_partials/ -->
    <main id="main">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <!-- BREADCRUMB TRAIL -->
      </nav>
      <h1><!-- PAGE HEADING, matches the title --></h1>
      <!-- PAGE CONTENT -->
    </main>
    <!-- footer: copy verbatim from site/_partials/footer.html -->
  </body>
</html>
```

## Rules that the linters enforce

- Exactly one `<h1>` per page, and heading levels never skip (`h1` → `h2` → `h3`).
- Every page is reachable from the main nav or from a parent section page.
  An orphan page is a bug even though no linter catches it — check by hand.
- Every `<img>` needs a meaningful `alt`; decorative images get `alt=""`.
- Interactive controls are `<a>` or `<button>`, never a clickable `<div>`.
- Internal links are root-relative (`/academics/primary/`), never relative
  (`../primary/`) — relative links break when a page moves.

## After editing

Run the gates from `.claude/tools/`:

```bash
cd .claude/tools
npm run check      # HTML validity + WCAG rules + CSS lint + formatting
npm run dev        # preview at http://localhost:3000
```

Fix what `check` reports before moving on. A page that fails the gates is not
done, regardless of how it looks in the browser.
