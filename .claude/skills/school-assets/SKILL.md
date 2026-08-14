---
name: school-assets
description: Handle images and media for the PSB school website — optimizing photos, generating responsive variants, writing the picture markup, and the privacy rules around photographs of children. Use when adding photos, building a gallery or hero, or when pages feel slow.
---

# Images on the school site

School sites are photo-heavy and are usually opened on a phone over mobile
data. An unoptimized 4MB camera JPEG in a hero is the single most common cause
of a slow school homepage.

## Privacy first — photographs of children

Before any photograph of an identifiable student goes on the site, the school
must confirm that a signed media consent is on file for that child. This is not
a formality; consent status varies per child and some families withhold it.

Rules:

- Never publish a photo of an identifiable child without confirming consent.
  When consent status is unknown, ask — do not publish and do not assume.
- Never pair a child's photograph with their full name, class, and any other
  identifying detail in the same caption.
- Never publish images showing anything that locates a specific child in time
  and place — bus route boards with route numbers, timetables on a whiteboard,
  ID cards, address details on noticeboards.
- Strip EXIF from every published photo. Camera GPS coordinates on a school
  photo disclose the location of children. The optimize step below re-encodes
  and drops EXIF by default — do not add a metadata-preserving flag.
- Prefer wide shots, activity-focused framing, and back-of-head or over-shoulder
  angles for general-purpose photography.

If the school hasn't supplied consent records, build the pages with placeholder
imagery and flag the gap rather than stalling the whole site.

## The pipeline

Put originals in `site/assets/img/_raw/`. That folder is never published — the
build filters it out.

```bash
cd .claude/tools
npm run images                                  # 480/960/1600px, WebP + JPEG
npm run images -- --widths 480,960,1600,2400    # add a wider variant for heroes
npm run images -- --quality 85                  # raise quality for a hero shot
```

Output lands beside the source path in `site/assets/img/`, named
`<name>-<width>.webp` and `<name>-<width>.jpg`. Originals are never upscaled.

## Markup

```html
<picture>
  <source
    type="image/webp"
    srcset="
      /assets/img/campus/library-480.webp   480w,
      /assets/img/campus/library-960.webp   960w,
      /assets/img/campus/library-1600.webp 1600w
    "
    sizes="(max-width: 700px) 100vw, 700px"
  />
  <img
    src="/assets/img/campus/library-960.jpg"
    width="960"
    height="640"
    alt="The school library, with students reading at low tables"
    loading="lazy"
    decoding="async"
  />
</picture>
```

Non-negotiable details:

- Always set `width` and `height` on `<img>`. Without them the page reflows as
  images load, which is both a bad experience and a Core Web Vitals penalty.
- `loading="lazy"` on everything **except** the hero image on each page. Lazy
  loading the hero delays the largest contentful paint — the opposite of what
  you want.
- `sizes` must reflect the real CSS layout width. A wrong `sizes` makes the
  browser download a variant far larger than needed, undoing the optimization.

## Budgets

| Asset | Target |
|---|---|
| Hero image (delivered) | ≤ 200kB |
| In-page photo | ≤ 120kB |
| Gallery thumbnail | ≤ 40kB |
| Total page weight | ≤ 1MB |

Check with the network panel throttled to Fast 3G, not on the dev machine's
connection.

## Other media

- **Logo and icons** — SVG, hand-optimized. Give each inline SVG a `<title>`
  or `aria-hidden="true"` when decorative.
- **Documents** (prospectus, fee structure, calendar) — link as PDF with the
  size in the link text: "Prospectus 2026–27 (PDF, 1.2MB)". Confirm the PDF
  itself has no student personal data before publishing.
- **Video** — do not self-host. Embed from the school's own YouTube channel
  with a click-to-load facade so the embed doesn't load on every page view.
