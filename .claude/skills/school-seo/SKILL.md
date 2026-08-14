---
name: school-seo
description: Set up discoverability for the PSB school website — titles, meta descriptions, structured data for a school, sitemap, robots.txt, and local search details. Use when adding pages, when asked about SEO, Google, search rankings, or when the school should appear in local map results.
---

# Discoverability for the school site

Most traffic will be people searching the school by name, plus parents
searching "schools near <locality>". Both are won with accurate basics, not
tricks.

## Per-page essentials

Every page needs a unique `<title>` and `<meta name="description">`.

- Title: `<Specific page> | <School name>`, under 60 characters.
  "Admissions 2026–27 | PSB School", not "Home | PSB School" on four pages.
- Description: 150–160 characters, written for a human deciding whether to
  click. It is not a keyword list.
- Canonical URL on every page:
  `<link rel="canonical" href="https://www.example.edu/admissions/" />`
- Open Graph tags so links shared in parent WhatsApp groups render properly —
  this is how school links actually spread:

```html
<meta property="og:title" content="Admissions 2026–27 | PSB School" />
<meta property="og:description" content="…" />
<meta property="og:image" content="https://www.example.edu/assets/img/og-default.jpg" />
<meta property="og:url" content="https://www.example.edu/admissions/" />
<meta property="og:type" content="website" />
```

The OG image should be 1200×630 and contain the school name as text — many
share surfaces show it at thumbnail size.

## Structured data

Put a `School` block on the homepage only, inside `<head>`. Every value must be
supplied by the school — do not fill this in from guesswork, since it feeds
Google's knowledge panel and map listing.

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "School",
    "name": "<exact legal name>",
    "url": "https://www.example.edu/",
    "logo": "https://www.example.edu/assets/img/logo.png",
    "telephone": "<+91 …>",
    "email": "<office email>",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "…",
      "addressLocality": "…",
      "addressRegion": "…",
      "postalCode": "…",
      "addressCountry": "IN"
    },
    "openingHours": "Mo-Fr 08:30-15:30"
  }
</script>
```

Add a `FAQPage` block on the admissions page if — and only if — the visible
page shows the same questions and answers. Structured data that doesn't match
visible content is a manual-action risk.

The address, phone number, and school name here must match the school's Google
Business Profile character for character. Mismatches are the usual reason a
school doesn't show up in local map results.

## Site-level files

`site/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://www.example.edu/sitemap.xml
```

`site/sitemap.xml` lists every published page with `<loc>` and `<lastmod>`.
Regenerate it whenever pages are added or removed — a sitemap listing dead URLs
is worse than none.

## URLs

- Lowercase, hyphenated, stable: `/academics/pre-primary/`, not
  `/Academics/PrePrimary.html`.
- Directory-style with a trailing slash and an `index.html` inside.
- Mirror the grade taxonomy: `pre-primary`, `primary`, `middle`, `secondary`.
- Never change a published URL without a redirect. Parents bookmark the
  admissions page and share it for years.

## What actually moves the needle for a school

In rough order: an accurate and claimed Google Business Profile; the school
name, address, and phone identical everywhere online; page speed on mobile;
a genuinely useful admissions page; and fresh news or calendar content.

Skip entirely: keyword stuffing, hidden text, meta keywords, doorway pages for
each nearby locality, and paid link building. They range from useless to
actively penalized.

## Before launch

- Every page has a unique title and description — no duplicates.
- `robots.txt` does not block the site (the staging version often does; check).
- No `noindex` left over from staging.
- Sitemap submitted in Google Search Console, plus Bing Webmaster Tools.
- The HTTPS version is canonical, and HTTP redirects to it.
