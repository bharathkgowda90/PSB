---
name: school-a11y
description: Check and fix accessibility on the PSB school website — keyboard navigation, screen-reader semantics, colour contrast, forms, and the mobile nav. Use before publishing any page, when a page contains a form or menu, or when asked about WCAG, a11y, contrast, or screen readers.
---

# Accessibility for the school site

A school site is used by parents on old phones, grandparents with weak vision,
and staff on keyboards. It also carries a legal expectation of accessibility in
most jurisdictions. Target **WCAG 2.1 Level AA**.

## What the tooling catches, and what it doesn't

`npm run check` (from `.claude/tools/`) runs html-validate with the WCAG rule
set on. It catches missing `alt`, unlabelled inputs, bad heading order, missing
`lang`, tables without headers, and redundant ARIA.

It cannot catch: colour contrast, keyboard traps, focus visibility, whether
`alt` text is *meaningful*, or whether the mobile menu works. Those need the
manual pass below. Never report a page as accessible on the strength of the
linter alone.

## Manual pass — run this on every page before publishing

**Keyboard only.** Put the mouse away.

1. `Tab` from the top. The first stop must be the "Skip to main content" link,
   and it must become visible when focused.
2. Every interactive element is reachable, in the order it appears visually.
3. The focus ring is clearly visible on every stop. Never `outline: none`
   without a replacement indicator.
4. Open the mobile menu with `Enter`, close it with `Escape`, and confirm focus
   returns to the toggle button.
5. Nothing traps focus. If you can't `Tab` back out, it's a blocker.

**Contrast.** Body text ≥ 4.5:1 against its background, large text (≥ 24px, or
≥ 19px bold) ≥ 3:1, and UI borders/icons ≥ 3:1. School palettes tend to fail
on light-blue-on-white headings and on white text over photo hero banners —
check both specifically. A hero needs a scrim or a solid text panel, not hope.

**Zoom.** At 200% browser zoom and at 320px width, no horizontal scrolling and
no clipped text.

**Images.** Read each `alt` aloud with the image hidden. "Students in the
science lab using microscopes" works; "IMG_2043", "photo", or "students" does
not. Purely decorative images take `alt=""` so screen readers skip them.

## Patterns this site uses

**Skip link** — first element in `<body>` on every page:

```html
<a class="skip-link" href="#main">Skip to main content</a>
```

```css
.skip-link {
  position: absolute;
  left: -9999px;
}
.skip-link:focus {
  left: 1rem;
  top: 1rem;
  position: fixed;
  z-index: 100;
  padding: 0.75rem 1rem;
  background: #fff;
}
```

**Mobile nav toggle** — state lives in `aria-expanded`, not in a class alone:

```html
<button
  class="nav-toggle"
  aria-expanded="false"
  aria-controls="primary-nav"
>
  <span class="visually-hidden">Menu</span>
</button>
<ul id="primary-nav" class="nav-list">
  …
</ul>
```

The script toggles `aria-expanded` and closes on `Escape`. Keep the button a
real `<button>` so it is focusable and activates on both `Enter` and `Space`.

**Current page** in nav gets `aria-current="page"`, not just a highlight class.

**Forms** (enquiry, contact) — every field has a real `<label for>`. Placeholder
text is not a label; it disappears on focus and fails contrast. Group related
fields in `<fieldset>` with a `<legend>`. Mark required fields in the label text
as well as with `required`, and put error messages next to the field they
belong to, referenced with `aria-describedby`.

**Motion** — respect the user's setting:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Tap targets** — minimum 44×44px, with spacing between adjacent links. Parents
tap these one-handed.

## Reporting

When reporting a11y status, separate what was verified from what wasn't:
"html-validate passes; keyboard pass done on the homepage and admissions form;
contrast not yet checked on the hero." Vague all-clears hide real failures.
