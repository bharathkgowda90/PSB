# Vendored: taste-skill

Third-party design skills installed from
[github.com/leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill).

- **Upstream commit**: see `COMMIT` in this folder
- **Licence**: MIT — see `LICENSE` (Copyright (c) 2026 Leonxlnx)

The skill files themselves live in `.claude/skills/` rather than here, because
Claude Code only discovers skills at `.claude/skills/<name>/SKILL.md`. This
folder keeps the licence and provenance alongside them.

## Installed skills

| Folder | Skill name | What it's for |
|---|---|---|
| `taste-skill` | `design-taste-frontend` | Main anti-generic skill for landing pages and redesigns |
| `taste-skill-v1` | `design-taste-frontend-v1` | Previous version, kept for compatibility |
| `soft-skill` | `high-end-visual-design` | Fonts, spacing, shadows, motion that read as premium |
| `minimalist-skill` | `minimalist-ui` | Clean editorial style, warm monochrome |
| `brutalist-skill` | `industrial-brutalist-ui` | Raw mechanical / terminal aesthetic |
| `redesign-skill` | `redesign-existing-projects` | Auditing and upgrading an existing site |
| `output-skill` | `full-output-enforcement` | Suppresses truncation and placeholder output |
| `gpt-tasteskill` | `gpt-taste` | GSAP motion and editorial layout rules |
| `image-to-code-skill` | `image-to-code` | Generate a design image first, then build to match |
| `imagegen-frontend-web` | `imagegen-frontend-web` | Generates web design reference images |
| `imagegen-frontend-mobile` | `imagegen-frontend-mobile` | Generates mobile app screen concepts |
| `brandkit` | `brandkit` | Brand guideline boards and logo systems |
| `stitch-skill` | `stitch-design-taste` | DESIGN.md generation for Google Stitch |

## Relevance to this project

The school site is static HTML/CSS/JS, so the directly useful ones are
`design-taste-frontend`, `high-end-visual-design`, `minimalist-ui`, and
`redesign-existing-projects`. `brandkit`, `imagegen-frontend-mobile`, and
`stitch-design-taste` cover work this project may never do; they are installed
because the whole pack was requested, and they cost nothing when not triggered.

## Precedence: the school skills win

On any disagreement the `school-*` skills take precedence. They encode
constraints this project cannot trade away, whereas the taste skills optimise
for visual impact on marketing sites:

- **Stack.** `design-taste-frontend` reaches for React, Tailwind, and component
  libraries. This site is plain static HTML/CSS/JS — see `school-page`.
- **Accessibility.** Where a visual rule (thin type, low-contrast greys, dense
  motion) would fail WCAG 2.1 AA, `school-a11y` wins. Parents and grandparents
  use this site on old phones.
- **Copy.** The taste skills favour bold marketing language; `school-content`
  bans superlatives and forbids inventing any fact about the school.
- **Performance.** Heavy imagery and motion are subject to the budgets in
  `school-assets`.

## Updating or removing

These are vendored copies, not a package — there is no update command. To
refresh, re-clone upstream and copy `skills/*` over `.claude/skills/`, taking
care not to overwrite the `school-*` folders.

They are removed along with everything else by `rm -rf .claude`.
