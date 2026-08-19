# Pre-launch checklist

The site is built and passes its quality gates, but **it must not go live in its
current state.** This is everything standing between here and launch.

Grep the site for remaining gaps at any time:

```bash
grep -rn "To be supplied\|To be confirmed\|TODO\|SAMPLE DATA" site/_pages site/_layout | wc -l
```

---

## 1. Blockers — the site is harmful or broken without these

| # | Item | Where | Why it blocks |
|---|---|---|---|
| 1 | **Replace the invented faculty list** | `site/_pages/faculty.html` | All 20 names, qualifications and years of experience are fabricated. Publishing invented teacher qualifications misleads parents making a decision about their child, and is exactly what a verifying official checks. |
| 2 | **Replace the invented bus routes** | `site/_pages/transport.html` | All 15 routes, villages and timings are made up. A parent could plan around a bus that does not exist. |
| 3 | **Register a domain and set the real origin** | `site/_layout/site.config.json`, `site/robots.txt`, `site/sitemap.xml` | Currently `https://TODO-domain-not-yet-registered.example`. Canonical tags, Open Graph URLs and the sitemap are all wrong until this is set. |
| 4 | **Connect the enquiry form** | `site/_pages/enquiry.html` | The form has `action="#"` and goes nowhere. Every enquiry sent through it is silently lost. See §4. |
| 5 | **Confirm the email address** | throughout | `psb@gmail.com` is almost certainly not a real inbox — that address would have been registered years ago. Verify it or replace it. |
| 6 | **Real photographs, with consent** | `site/assets/img/_raw/` | Only generated placeholders exist. No photograph of an identifiable child may be published without written consent from that child's family. See the note below on the supplied image set. |
| 7 | **Verify the recognition number** | `site/_pages/disclosure.html`, footer | `29220204201` is published as fact on the disclosure page. Confirm it is correct and current. |
| 8 | **Replace the invented parent quotes** | `site/_pages/home.html` | All five testimonials in the "What families say" carousel are written, along with the names and the child's class. No parent said any of them. The on-page warning card was removed at the client's request for design reasons, so nothing on the site now signals that these are samples — a visitor reads them as real. Replace each with a parent's own words, obtained with written permission, or delete the section. |
| 9 | **Approve or rewrite the five tenets** | `site/_pages/home.html` | The "What we stand for" section states five commitments in the school's voice. Four restate things the site already says (small classes, English medium, society-run since 2002, visitors welcome in working hours); the fifth — telling families early when a child is slipping — was written to fill the set and nobody at the school has agreed to it. A promise published on the school's own homepage is one parents will hold it to. Someone with authority must approve the wording or replace it. |

**On the "Beyond the lessons" cards (homepage section 04)**

The six cards are navigation into `student-life.html`, not claims. Each says what
that page will answer rather than asserting what the school offers, because the
Student Life page itself still carries "To be supplied" against sports, arts,
clubs and excursions. Once those gaps are filled the card copy can become
specific — and should, since a card that describes a page rather than the school
is weaker than one that names a real activity.

---

## 2. Content the school still owes

Roughly 40 marked gaps remain. In priority order:

**Highest value — these change enrolment decisions**
- SSLC results for the last 3–5 years (`results.html`)
- Student numbers, teacher numbers, class sizes, teacher:student ratio
- Age criteria and cut-off date for each entry class (`admissions.html`)
- Office hours, including Saturday
- Real bus routes and the villages served

**Trust and verification**
- Principal's message, photo, name and qualification (`leadership.html`)
- Society registration number, date and office-bearers (`society.html`)
- Recognition, safety, fire and sanitation certificates as PDFs (`disclosure.html`)
- Infrastructure counts: classrooms, labs, computers, library books, toilets

**Completes the picture**
- Vision and mission, founding story, milestones (`about.html`)
- Lab equipment lists and computer counts (`science-technology.html`)
- Academic calendar dates (`calendar.html`)
- Sports, clubs and events actually offered (`student-life.html`)
- Fee inclusions, payment methods, instalments, concessions (`fees.html`)

---

## 2b. On the photographs currently in place

The photographs currently on the site were supplied as stand-ins for layout
review. They are third-party stock taken from another school's website, and the
sheet they came from states plainly that they are **not licensed for reuse**.

They must be replaced, for two reasons that are independent of each other:

1. **Licensing.** They are another company's commercial photography.
2. **They are photographs of identifiable children who do not attend this
   school.** Publishing them here tells a parent in Maddur that these are this
   school's children, classrooms and campus. That is the "stock photography of
   unrelated children" failure this project rejected at the planning stage, and
   it is worse than a visible placeholder because it is not recoverable once a
   family notices.

The school's own crest was also supplied, and is genuinely in use: as the
favicon, the Apple touch icon, the social-share card, in the footer, and on the
About page.

`site/assets/img/_raw/REPLACE-THESE.md` lists every stand-in, where it appears,
and what the school's own photograph should show. Filenames are stable, so
replacing a file and re-running `npm run images && npm run build` needs no
markup changes.

The photography brief in `docs/website-plan.md` §7 still stands: roughly 60–80
photographs of this school, shot on a working day, with written media consent
confirmed per identifiable child.

---

## 3. A WhatsApp number is missing

`082322 98195` is a landline (Maddur STD code 08232) and cannot receive
WhatsApp. In this catchment WhatsApp would likely become the most-used contact
route, so a mobile number is worth obtaining before launch. The markup and copy
are already in place — only the number is missing.

---

## 4. Connecting the enquiry form

The site is static, so it cannot process a form by itself. Options:

| Option | Effort | Notes |
|---|---|---|
| **Hosted form service** (Formspree, Netlify Forms) | Low | Set `action` to the service endpoint, point its redirect at `/admissions/enquiry/thank-you/`. Free tiers usually suffice at this volume. |
| **WhatsApp link only** | Lowest | No infrastructure, and the lowest friction for this audience — but needs a mobile number, and nothing is recorded. |
| **Serverless function** | Higher | Full control, needs hosting and maintenance. |

**Recommendation:** a hosted form service *and* a prominent WhatsApp link, so
there are two independent paths and one failing does not lose the enquiry.

The honeypot field (`name="website"`) is already in place — configure the
service to reject submissions where it is non-empty.

**After connecting, submit a real test enquiry and confirm it arrives.** Then
re-test on the live domain, because mail routing often differs from staging.
A silently broken enquiry form loses admissions for months before anyone notices.

---

## 5. Decide before launch, not after

**Fee amounts.** The school asked not to publish them, and the site respects
that. Worth reconsidering: a parent who cannot find any figure often assumes the
school is beyond their means and never calls. Even a band per stage keeps those
families in the conversation.

**Kannada.** The site is English-only. For a rural Mandya catchment a Kannada
version — at minimum Home, Admissions, Fees and Contact — would widen reach
considerably. This is far cheaper to do now than to retrofit.

**Who owns the news page.** `news.html` is deliberately switched off. A news
section whose latest item is two years old is worse than none. Name a person who
will keep it current, or delete the page and its nav links.

---

## 6. Technical steps at launch

- [ ] Domain registered and DNS pointed at the host
- [ ] `site.config.json`, `robots.txt`, `sitemap.xml` updated with the real origin
- [ ] HTTPS enabled and HTTP redirecting to it
- [ ] `www` and non-`www` resolve, one redirecting to the other
- [ ] `npm run check` passes
- [ ] `npm run qa` passes (design QA: responsiveness, spacing, contrast, tap targets)
- [ ] `npm run build` and deploy **`dist/` only**
- [ ] Google Business Profile claimed; name, address and phone match the site character for character
- [ ] Sitemap submitted in Google Search Console
- [ ] Homepage opened on a real phone over mobile data, not office wifi
- [ ] Enquiry form tested end to end on the live domain

---

## 7. Already verified

Checked during the build; no further work needed.

**Automated, re-runnable**
- `npm run check` — HTML validity, the WCAG rule set, CSS lint and formatting,
  clean on all 25 pages
- `npm run qa` — design QA across 25 pages × 3 viewports (390 / 768 / 1440):
  **0 errors, 0 warnings**. Covers page and element overflow, stretched images,
  colour contrast against actual painted backgrounds, header overlap, font
  loading, tap targets, image dimensions, line length, grid alignment and
  section-padding rhythm.
- The QA checker was itself negative-tested: planted overflow, low-contrast
  text, a stretched image and undersized buttons were all detected.

**Manual**
- Keyboard: skip link is the first tab stop; the menu opens, closes on Escape,
  and returns focus to its button
- Rendered and inspected at 390px, 768px and 1440px
- Content stays visible with `site.js` blocked — no page depends on JavaScript
- `dist/` excludes build inputs (`_layout`, `_pages`) and photo originals
  (`_raw`); no `.claude/` references in the output

**Fixed along the way**
- 113px horizontal overflow at 390px — the 12-column grid never collapsed
- Reveal animations hid content by default, so a failed `site.js` would have
  left pages blank
- Three tap targets below 44px: card links, the checkbox row, the header phone
  link
- Ghost buttons were blue-on-dark-blue on the old hero

**Still needs a person.** Automation cannot judge whether the design is *good*,
whether a photograph is well chosen, how it renders on a real budget Android
over mobile data, or screen-reader flow beyond structure. Re-run `npm run qa`
once real photographs replace the placeholders — images behind text are the
most likely source of new contrast failures.
