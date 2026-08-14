---
name: publish-site
description: Produce the publishable build of the PSB school website and strip the development tooling. Use when asked to publish, deploy, ship, go live, hand off the site, or remove the dev packages and skills.
---

# Publishing the site

The whole point of keeping every tool, skill, and dependency inside `.claude/`
is that publishing is a clean separation: `site/` is the website, `.claude/` is
the workshop, and the workshop never ships.

## Pre-flight

Run the gates and fix everything they report:

```bash
cd .claude/tools
npm run check
```

Then walk the manual list — the linters cannot check any of it:

- **No placeholders left.** Search the site for `TODO`, `Lorem`, `[to confirm]`,
  `example.edu`, and `xxx`. The `school-content` skill deliberately leaves
  visible placeholders; every one must be resolved or removed before launch.
- **Facts verified with the school**: legal name, board affiliation and number,
  address, phone, email, fee structure, admission dates, staff names.
- **Photo consent** confirmed for every identifiable child (see `school-assets`).
- **Forms actually deliver.** Submit the enquiry and contact forms end to end
  and confirm the office receives them. A silently broken enquiry form on a
  school site loses admissions.
- **Accessibility keyboard pass** done on the homepage, admissions, and any
  page with a form or menu (see `school-a11y`).
- **Links**: no 404s, no `localhost`, no staging hostnames.
- **Mobile**: check at 320px and at 200% zoom.

## Build

```bash
cd .claude/tools
npm run build
```

This writes `dist/` from `site/`, minifies CSS and JS, drops dotfiles and
`assets/img/_raw/`, and **aborts if any output file references `.claude/`**.
That last check is the safety net for the separation — if it trips, a page is
linking to something in the toolchain and must be fixed, not overridden.

`dist/` is what gets uploaded. Nothing else.

## Removing the tooling

Once the site is handed over and no further development is planned:

```bash
rm -rf .claude
git add -A && git commit -m "Remove development tooling"
```

That single command removes the skills, the agent, the npm toolchain,
`node_modules`, and every config file. Nothing in `site/` or `dist/` depends on
any of it, so the site is unaffected — the build's leak check exists to
guarantee that.

Verify afterwards:

```bash
grep -ri "\.claude" site/ dist/ || echo "clean"
```

Reinstalling later is `npm install` inside `.claude/tools/`, so deleting is
safe as long as `.claude/` is committed in git history first. Prefer deleting on
a branch or after tagging the release, rather than as an unrecoverable local
`rm`.

## Deploying a static site

`dist/` is plain static files — any static host serves it:

- **Netlify / Cloudflare Pages / Vercel**: publish directory `dist`, no build
  command needed if you build locally.
- **GitHub Pages**: push `dist/` contents to the `gh-pages` branch.
- **Traditional hosting**: upload `dist/` contents to the web root over SFTP.

Whichever host: enable HTTPS, force the HTTP→HTTPS redirect, and confirm the
custom domain resolves with and without `www` (one redirecting to the other).

## After going live

- Submit the sitemap in Google Search Console (see `school-seo`).
- Re-test the enquiry form on the live domain — mail routing often differs
  between staging and production.
- Check the homepage on a real phone over mobile data, not just on wifi.
