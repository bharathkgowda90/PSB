# Prashanth School of Brilliance — Website Plan

Information architecture and page-by-page specification.

**Status:** draft for school approval. Nothing here is built yet.
**Last updated:** 14 August 2026

---

## 1. How to read this document

Section 2 lists what is known versus what the school must supply — read it first,
because roughly half the site cannot be written until those blanks are filled.

Sections 3–5 cover audience, benchmarking, and the sitemap. Section 6 is the
page-by-page specification and is the bulk of the document. Sections 7–11 cover
content collection, design, build sequence, and open decisions.

Throughout, `[CONFIRM]` marks a fact the school must supply or verify. These are
not placeholders to be filled with something plausible — a wrong fee, board
affiliation, or admission date on a school website causes real problems for real
families. Every `[CONFIRM]` ships as a visible blank until answered.

---

## 2. What we know, and what we don't

### Confirmed from the school crest

| Fact | Value |
|---|---|
| Trust | Snehanjali Rural Education Society (R.) |
| School name on crest | Prashanth High School of Brilliance |
| Location | Bharathinagar – 571422 |
| Established | 2002 |
| Tagline | "A School with Science & Technology" |
| Crest motif | Om symbol, graduation cap, open book, cupped hands |

Bharathinagar is in Maddur taluk, Mandya district, Karnataka — about 100 km from
Bengaluru on the Bengaluru–Mysuru corridor. A public listing exists for
"Prashanth School Of Brilliance" at Mellahalli, Mandya, which appears to be the
same institution.

### Name discrepancy — decide before anything is written

The crest says **Prashanth High School of Brilliance**. The brief says
**Prashanth School of Brilliance**. These cannot both be the site's name.

This is the single highest-priority decision, because the name appears in every
page title, the logo, structured data, the domain, and the Google listing.
Note that "High School" sits oddly with a Pre-School intake, so if the school has
been dropping it informally, the shorter form is likely the intended direction.
`[CONFIRM]` — and once chosen, it is spelled identically everywhere.

### Must confirm before build

| # | Item | Why it blocks work |
|---|---|---|
| 1 | Exact school name | Every page title, logo, schema, domain |
| 2 | **Board affiliation** — Karnataka State (SSLC), CBSE, or ICSE | Changes curriculum pages, results pages, and legal disclosure obligations |
| 3 | Affiliation / recognition number | Required on disclosure page; parents verify it |
| 4 | Medium of instruction (English / Kannada / both) | Drives the bilingual decision in §11 |
| 5 | Full postal address + Google Maps pin | Contact page, schema, local search |
| 6 | Phone numbers (office, admissions, WhatsApp) | Primary conversion path |
| 7 | Official email address | Forms, contact page |
| 8 | Whether a domain is already owned | Blocks launch |
| 9 | Exact grades offered this year | The nav is built from this |
| 10 | Fee structure, or whether it goes online at all | Admissions page |
| 11 | Admission dates and document list for 2026–27 | Admissions page |
| 12 | SSLC / board results, last 3–5 years | Results page; strongest trust signal |
| 13 | Staff list with qualifications | Faculty page |
| 14 | Transport routes and villages served | High-value for rural catchment |
| 15 | Photo media consent status per child | Blocks publishing any student photo |
| 16 | Society registration details | Disclosure page |

Items 2, 5, 6, and 15 block the largest amount of work. Chase those first.

---

## 3. Audience and goals

### Who actually visits

1. **A parent in a village around Bharathinagar deciding where to enrol** —
   the primary audience. Arrives via a Google search for schools nearby, or a
   WhatsApp link from a neighbour. On a mid-range Android phone, often on mobile
   data with patchy 4G. May read Kannada more comfortably than English.
2. **A current parent looking something up** — fee due date, holiday, exam
   timetable, a phone number. Wants the answer in one tap, not a browse.
3. **A parent comparing against a nearby competitor** — wants results, fees,
   transport, and safety, in that order.
4. **A prospective teacher** — checking whether the school is real and hiring.
5. **Officials and verifiers** — checking recognition and disclosure.

Note who is *not* in this list: an international-school audience shopping IB
curricula. That distinction drives most of the content decisions below.

### What the site must achieve

| Goal | How it's measured |
|---|---|
| Generate admission enquiries | Enquiry form submissions + tracked phone taps |
| Answer routine parent questions | Fewer repeat calls to the office |
| Establish legitimacy | Disclosure, recognition number, results, real photos |
| Be findable for "schools near Bharathinagar / Maddur" | Google Business Profile + local SEO |
| Reduce office phone load | Calendar, circulars, fees, transport online |

The single most important conversion is **an enquiry, by form or by phone**.
Every page drives toward it.

---

## 4. Benchmarking against Bengaluru schools

The brief asked to model content on top Bengaluru schools. Their **structure** is
worth copying; much of their **content strategy** is not, because they serve a
different market. Being explicit about the split:

### Adopt

| Pattern | Seen at | Why it applies here |
|---|---|---|
| Results shown prominently with real numbers | NPS Indiranagar leads with board performance | Strongest trust signal a school has, and cheap to produce |
| Clearly staged curriculum pages | Structured framework "evolving with each stage of learning" | Matches the four-stage taxonomy already fixed |
| Explicit admission process and criteria | NPS states test timing and merit basis | Rural parents especially need the steps spelled out |
| Detailed, itemised facilities lists | Labs, library, AV rooms, named sports | Concrete beats adjectives; supports the science/tech claim |
| Announcements / circulars block on the homepage | Standard across Indian school sites | Serves the current-parent audience, which most school sites forget |
| A dedicated public disclosure page | CBSE mandates a homepage icon for it | Legitimacy; see §6.14 for the board-dependent detail |

### Reject

| Pattern | Why not |
|---|---|
| IB / IGCSE / "global citizen" framing | Not the curriculum, not the audience, and reads as false advertising |
| Stock photography of unrelated children | Undermines trust; real photos of the actual campus beat polished stock |
| Fee opacity ("contact us for fees") | Elite schools can afford this. Here it filters out families who simply need the number |
| Heavy motion, parallax, video backgrounds | Fails the performance budget on rural mobile data |
| English-only assumption | Likely wrong for this catchment — see §11 |
| Long "message from the Chairman" essays | Nobody reads them. One tight paragraph with a photo does the job |

### Adapt

- **Transport** is a minor page for an urban school and a **major** one here.
  Which villages the bus reaches can decide the enrolment.
- **"A School with Science & Technology"** is the school's own differentiator and
  should be proved with specifics — lab equipment, computer counts, what students
  actually build — not repeated as a slogan.
- **WhatsApp** is a first-class contact channel in this market, not an
  afterthought. A click-to-chat link belongs on every page.

---

## 5. Information architecture

### Sitemap

```
/                                  Home
│
├── /about/                        About the school
│   ├── /about/leadership/         Principal & management
│   └── /about/society/            Snehanjali Rural Education Society
│
├── /academics/                    Academics overview
│   ├── /academics/pre-primary/    Pre-School, Pre-KG, LKG, UKG
│   ├── /academics/primary/        Class 1–5
│   ├── /academics/middle/         Class 6–8
│   ├── /academics/secondary/      Class 9–10
│   └── /academics/results/        Board results
│
├── /admissions/                   Admissions
│   ├── /admissions/fees/          Fee structure
│   └── /admissions/enquiry/       Enquiry form
│
├── /campus/                       Facilities
│   ├── /campus/science-technology/  Labs & computing
│   └── /campus/transport/         Bus routes
│
├── /student-life/                 Sports, arts, clubs, events
├── /faculty/                      Teachers
│
├── /news/                         News & circulars
│   └── /news/calendar/            Academic calendar
│
├── /gallery/                      Photo gallery
├── /contact/                      Contact & directions
├── /disclosure/                   Mandatory public disclosure
└── /privacy/                      Privacy & photo policy
```

21 pages. See §9 for which are Phase 1.

### Primary navigation

Six items. Anything more collapses badly on a phone.

```
About   Academics   Admissions   Campus   Student Life   Contact
```

- **Admissions** is visually emphasised — it is the conversion path.
- A persistent **"Enquire"** button sits to the right of the nav on all breakpoints.
- Faculty, News, Gallery, Disclosure, Privacy live in the footer, reachable from
  section pages. They matter, but not enough to spend top-nav space on.

### Footer

Four columns, collapsing to stacked blocks on mobile:

1. **School** — logo, one-line description, established 2002, society name
2. **Quick links** — Admissions, Fees, Results, Calendar, Transport, Careers
3. **Contact** — address, phone, WhatsApp, email, office hours, map link
4. **Legal** — Mandatory Disclosure, Privacy & Photo Policy, recognition number

### URL rules

- Lowercase, hyphenated, trailing slash, `index.html` inside each directory.
- Stage segments mirror the taxonomy exactly: `pre-primary`, `primary`,
  `middle`, `secondary`.
- Published URLs never change without a redirect. Parents bookmark
  `/admissions/` and share it for years.

---

## 6. Page specifications

Every page inherits: the shared header/nav/footer, a skip link, breadcrumbs
(except Home), one `<h1>`, a canonical URL, and Open Graph tags.

---

### 6.1 Home — `/`

**Title:** `Prashanth School of Brilliance | English Medium School in Bharathinagar, Mandya` `[CONFIRM name + medium]`
**Meta:** Focus on place and stage range, e.g. "Pre-School to Class 10 in Bharathinagar, Maddur taluk. Established 2002. Admissions open for 2026–27." `[CONFIRM]`

**Answers:** What kind of school is this, is it near me, and can my child join?

| # | Section | Content |
|---|---|---|
| 1 | Hero | Real campus photo. `<h1>` naming school + place. One line: stages offered and established year. Two buttons: **Enquire about admission** (primary), **Call the office** (secondary, `tel:`) |
| 2 | Admissions strip | "Admissions open for 2026–27" with dates and a link. Removable block when closed `[CONFIRM dates]` |
| 3 | At a glance | 4–6 tiles of hard numbers: established 2002, stages offered, student count, teacher count, SSLC pass rate, buses/villages served `[CONFIRM all]` |
| 4 | Why this school | 3 cards, each concrete. Science & technology; small classes; results. Each links deeper. No adjectives without a number behind them |
| 5 | Stages | Four cards — Pre-Primary, Primary, Middle, Secondary — with grade ranges, linking to stage pages |
| 6 | Results | Latest board result headline + link `[CONFIRM]` |
| 7 | News & circulars | Latest 3 items with dates, link to `/news/` |
| 8 | Transport | Map thumbnail, villages served, link to `/campus/transport/` |
| 9 | Location & contact | Address, embedded map (click-to-load facade), phone, WhatsApp, office hours |
| 10 | Final CTA | Enquiry form, or a strong link to it |

**Notes:** Total page weight ≤ 1 MB. Hero image ≤ 200 KB and **not** lazy-loaded.
Carries the `School` structured-data block. This is the only page allowed more
than one CTA, and even here they are the same CTA in two forms (form / phone).

---

### 6.2 About — `/about/`

**Title:** `About Us | <School>`
**Answers:** Who runs this school, how long has it existed, is it recognised?

Sections: intro (founding in 2002 by Snehanjali Rural Education Society, what the
school set out to do for this area); vision & mission `[CONFIRM]`; the "Science &
Technology" philosophy explained concretely; milestones timeline `[CONFIRM]`;
recognition & affiliation with the number, linking to `/disclosure/` `[CONFIRM]`;
at-a-glance facts table; links to Leadership and Society.

**CTA:** Visit the campus → `/admissions/enquiry/`

---

### 6.3 Leadership — `/about/leadership/`

**Title:** `Principal & Management | <School>`

Principal's message — **maximum 200 words**, signed, with a real photo and full
name and qualification `[CONFIRM]`. Then the management committee / society
office-bearers with names and roles, and the school's administrative contacts.

**Note:** Resist the long chairman's essay. One tight paragraph that says
something specific about this school beats three columns of homily.

---

### 6.4 Society — `/about/society/`

**Title:** `Snehanjali Rural Education Society | <School>`

What the society is, when registered, its registration number, its objectives,
other institutions it runs if any, and office-bearers `[CONFIRM all]`.

Worth its own page: the society's rural-education mission is a genuine part of
the school's identity, and it satisfies verifiers looking for provenance.

---

### 6.5 Academics overview — `/academics/`

**Title:** `Academics | Pre-School to Class 10 | <School>`

Curriculum and board, stated plainly `[CONFIRM]`. The four-stage table:

| Stage | Grades |
|---|---|
| Pre-Primary | Pre-School, Pre-KG, LKG, UKG |
| Primary | Class 1 – Class 5 |
| Middle | Class 6 – Class 8 |
| Secondary | Class 9 – Class 10 |

Then: medium of instruction and languages offered `[CONFIRM]`; assessment
pattern; teaching approach; class size and teacher:student ratio `[CONFIRM]`;
links to each stage page and to Results.

---

### 6.6–6.9 Stage pages

Four pages sharing one template, at `/academics/pre-primary/`, `/primary/`,
`/middle/`, `/secondary/`.

**Shared template:** who it's for (ages and grades) → a day in the life →
subjects → how learning is assessed → what's special at this stage → what parents
should expect → photos → CTA.

The template is shared; **the writing is not**. Each page speaks to the age it
covers. Specifically:

- **Pre-Primary** — settling in, separation anxiety, toilet independence, play,
  safety and supervision, staff-to-child ratio. Written for an anxious parent
  handing over a 3-year-old. Note the four years differ: Pre-School and Pre-KG
  are about settling; LKG and UKG about early literacy, numeracy, and Class 1
  readiness. One paragraph must not serve all four.
- **Primary** — foundational literacy and numeracy, languages introduced,
  homework expectations, activity-based learning, first exposure to the computer lab.
- **Middle** — subject specialisation, science labs proper, projects, the
  technology programme, sports and clubs.
- **Secondary** — board exam preparation, subject choices, coaching and remedial
  support, past results, guidance on what comes after Class 10 (PUC streams and
  local options). This page carries the most weight in an enrolment decision.

---

### 6.10 Results — `/academics/results/`

**Title:** `Board Exam Results | <School>`

Headline pass percentage for the most recent year; 3–5 year table (year,
appeared, passed, pass %, distinctions, highest score); toppers with photo, name,
and score — **only with written consent**; a short honest note on how the school
supports weaker students `[CONFIRM all figures]`.

**Notes:** For most parents this is the deciding page. Publish real numbers or
publish nothing — a vague "excellent results" claim reads as concealment. Never
round upward. If a year was weak, showing the trend recovering is more credible
than omitting it.

---

### 6.11 Admissions — `/admissions/`

**Title:** `Admissions 2026–27 | <School>` `[CONFIRM year]`

The most important page after Home.

| # | Section | Content |
|---|---|---|
| 1 | Status banner | Open / closed, with dates `[CONFIRM]` |
| 2 | Grades with seats | Which grades have vacancies now `[CONFIRM]` |
| 3 | Age criteria | Minimum age per entry class, with cut-off date `[CONFIRM]` |
| 4 | Process | Numbered steps: enquire → visit → form → documents → interaction → confirmation `[CONFIRM]` |
| 5 | Documents | Checklist: birth certificate, transfer certificate, photos, Aadhaar, caste/income certificate if applicable `[CONFIRM]` |
| 6 | Fees | Summary + link to `/admissions/fees/` |
| 7 | Dates | Key dates table `[CONFIRM]` |
| 8 | FAQ | 8–12 real questions from the office's actual phone calls |
| 9 | CTA | Enquiry form + phone + WhatsApp |

**Note:** Written for a parent who has never navigated an admission process
before. Numbered steps, no jargon, no assumed knowledge. If the FAQ section is
built from real questions the office fields, it will cut call volume measurably.

---

### 6.12 Fees — `/admissions/fees/`

**Title:** `Fee Structure 2026–27 | <School>`

Fee table by grade with what's included; separate optional charges (transport by
route, uniform, books, exam fees); payment schedule and instalments; accepted
payment methods; refund policy; scholarships or concessions `[CONFIRM all]`.

**Decision required:** publish real numbers, or direct to the office. The
recommendation is to publish. In this market, a parent who cannot find the fee
often does not call — they assume it is unaffordable and look elsewhere.
If exact figures are sensitive, publish a range or a "from ₹X" figure rather than
nothing. Whatever is published must carry an effective date and be updated the
day fees change.

---

### 6.13 Enquiry — `/admissions/enquiry/`

**Title:** `Admission Enquiry | <School>`

Short form: parent name, phone (required), WhatsApp same-as-phone checkbox,
child's name, grade seeking, village/area, preferred contact time, message.
**Nothing else** — every extra field costs submissions.

Below the form: phone, WhatsApp, office hours, address, "or just visit us".

**Requirements:** real `<label>` on every field; errors beside the field they
belong to; a genuine confirmation page stating when the school will respond;
notification to a monitored address; spam protection via honeypot rather than a
CAPTCHA, which is a barrier for this audience.

**Critical:** a silently broken enquiry form loses admissions and nobody notices
for months. Test end-to-end at launch, then monthly. Note this needs a form
handler — see §10.

---

### 6.14 Campus — `/campus/`

**Title:** `Campus & Facilities | <School>`

Itemised, not adjectival: classrooms (number, capacity), science labs, computer
lab (number of machines), library (volumes), playground and sports facilities,
assembly hall, drinking water and sanitation, first aid, CCTV and safety
measures, transport summary `[CONFIRM all]`.

**Note:** Safety and sanitation are decision factors for parents of young
children and are usually buried. Give them their own subsection with specifics.

---

### 6.15 Science & Technology — `/campus/science-technology/`

**Title:** `Science & Technology | <School>`

The school's own tagline made real. Physics/chemistry/biology lab equipment;
computer lab specifications and student:computer ratio; what is actually taught
at each stage; projects and science fair participation; achievements
`[CONFIRM all]`.

**Note:** This page either justifies the crest's promise or exposes it as a
slogan. It needs real specifics and real photographs of students using the
equipment. If the substance isn't there yet, say less rather than inflating —
parents visit, and the gap between page and reality is worse than a modest page.

---

### 6.16 Transport — `/campus/transport/`

**Title:** `School Bus Routes & Transport | <School>`

Villages and areas served; route table (route number, villages, approximate
pickup times); fees by route; bus safety — driver verification, attendant,
GPS, speed limits; contact for transport `[CONFIRM all]`.

**Note:** Disproportionately important in a rural catchment — often the deciding
factor. **Privacy caution:** publish villages and approximate times, never a
precise child-level pickup schedule.

---

### 6.17 Student Life — `/student-life/`

**Title:** `Student Life | <School>`

Daily routine and timings; assembly; sports offered and achievements; arts,
music, dance; clubs; annual day, sports day, science fair, festivals; excursions;
student council; houses `[CONFIRM]`. Photo-led, but every photo consent-checked.

---

### 6.18 Faculty — `/faculty/`

**Title:** `Our Teachers | <School>`

Teaching philosophy and staff strength; then teachers grouped by stage or
department with name, qualification, subject, years of experience, and photo
`[CONFIRM]`; professional development; a link to careers if hiring.

**Note:** Get written consent before publishing any staff photo or
qualification. Qualifications must be accurate — this is exactly what verifying
parents and officials check.

---

### 6.19 News & Circulars — `/news/`

**Title:** `News & Circulars | <School>`

Reverse-chronological list with date, title, category, and a link to a PDF where
applicable. Categories: circular, event, achievement, holiday notice.

**Note:** This is the page that keeps the site alive. A site whose latest news is
two years old actively damages trust — worse than having no news section.
**Assign a named person to update it before launch.** If nobody will own it, cut
the section; that is a legitimate choice, and better than visible neglect.

---

### 6.20 Academic Calendar — `/news/calendar/`

**Title:** `Academic Calendar 2026–27 | <School>`

Term dates, holidays, exam schedule, event dates, PTM dates `[CONFIRM]`.
Table on the page, plus a downloadable PDF with its size in the link text.
Serves the current-parent audience and cuts routine phone calls.

---

### 6.21 Gallery — `/gallery/`

**Title:** `Photo Gallery | <School>`

Albums by category — campus, classrooms, labs, sports, events, annual day.
Thumbnails ≤ 40 KB, lazy-loaded, lightbox on click.

**Critical:** every identifiable child requires confirmed media consent. No
captions pairing a child's full name with their class. Check for incidental
disclosure in the background — noticeboards, route lists, ID cards, timetables.
EXIF is stripped automatically by the image pipeline.

---

### 6.22 Contact — `/contact/`

**Title:** `Contact Us | <School>`

Full address; phone numbers by purpose (office, admissions, transport, principal);
WhatsApp click-to-chat; email; office hours including Saturdays; embedded map with
directions from Bharathinagar and from Maddur; a short "how to reach" note by
bus/road; a brief contact form `[CONFIRM all]`.

**Note:** The address, phone, and name here must match the Google Business
Profile character for character, or local search results suffer.

---

### 6.23 Mandatory Disclosure — `/disclosure/`

**Title:** `Mandatory Public Disclosure | <School>`

**Scope depends on the board `[CONFIRM #2]`.** For CBSE-affiliated schools this
is compulsory and must be linked by a clearly visible icon on the homepage,
covering: affiliation status and number, trust/society registration, NOC,
recognition certificate, building safety, fire safety and sanitation
certificates, infrastructure details, fee structure, student strength, and staff
details with qualifications. Non-compliance carries penalties under the
affiliation rules.

For a Karnataka state board school the specific obligations differ and should be
verified with the DDPI office rather than assumed from CBSE norms. **Build the
page regardless** — voluntary transparency is a competitive advantage against
schools that publish nothing, and it costs a single page.

Documents as PDFs with size in link text.

---

### 6.24 Privacy & Photo Policy — `/privacy/`

**Title:** `Privacy & Photo Policy | <School>`

What the enquiry form collects and how it is used; how long data is kept; who to
contact for removal; the photo consent policy; how a parent withdraws consent for
their child's image.

**Note:** Not merely a legal formality — a clearly stated photo policy is
reassuring to parents and gives the school a defensible position. It should be
written to match the practice in §7, not aspirationally.

---

## 7. Content collection

The build is blocked on content, not code. Suggested order:

**Week 1 — unblocks everything**
Name decision; board and affiliation number; address, phone, WhatsApp, email;
grades offered; domain status.

**Week 2 — unblocks the conversion path**
Admission dates, process, documents, age criteria; fee structure decision;
board results for 3–5 years; transport routes.

**Week 3 — unblocks the trust pages**
Principal's message and photo; staff list with qualifications and consent;
society registration details; facilities inventory with numbers; vision/mission.

**Week 4 — photography**
See below.

### Photography brief

Roughly 60–80 usable photographs: campus exterior and gate, classrooms in use,
science labs with students working, computer lab, library, playground and sports,
assembly, buses, staff portraits, and one strong hero candidate.

Rules, non-negotiable:
- Written media consent confirmed per identifiable child **before** any photo is
  published. Consent varies per family; some withhold it. Where status is
  unknown, do not publish.
- Never pair a child's photograph with full name plus class in a caption.
- Nothing in frame that locates a specific child — route boards, ID cards,
  timetables, addresses on noticeboards.
- EXIF stripped on every published image (automatic in the pipeline; camera GPS
  on a school photo discloses where children are).
- Prefer wide, activity-focused framing over identifiable close-ups.

Shoot on a working day in good light. A phone camera held steady in daylight
beats a bad flash photo. Deliver originals — the pipeline handles resizing.

---

## 8. Design direction

**Principle:** trustworthy and fast, not fashionable. This site is judged on
whether it loads on a weak connection and answers the question, not on whether it
wins design awards.

- **Colour** — drawn from the crest: deep blue, red, yellow, green. Blue as
  primary, red as accent used sparingly, yellow for highlights only. Every
  combination must clear WCAG AA (4.5:1 body text, 3:1 large text and UI). The
  crest's yellow will fail on white for text — restrict it to backgrounds and
  accents.
- **Typography** — one humanist sans for UI and headings, with **full Kannada
  glyph coverage** (Noto Sans Kannada or similar) whether or not bilingual
  launches, since Kannada names and place names will appear regardless.
  Generous size: many users are grandparents.
- **Layout** — single column on mobile, max 2–3 columns on desktop. Content width
  ~70ch. Mobile-first throughout.
- **Imagery** — real photographs only. No stock, no illustration of generic
  children.
- **Motion** — minimal, and fully disabled under `prefers-reduced-motion`.
- **Tap targets** — minimum 44×44 px. Parents use this one-handed.

**Accessibility target: WCAG 2.1 AA.** Grandparents with weak vision are a real
part of this audience.

**Performance budget:** hero ≤ 200 KB, in-page photo ≤ 120 KB, thumbnail ≤ 40 KB,
total page ≤ 1 MB. Test throttled to Fast 3G, not on office wifi.

> The vendored `taste-skill` design skills are available for visual direction,
> but where they conflict with these constraints — they assume React/Tailwind and
> favour heavy imagery and bold marketing copy — the constraints here win.

---

## 9. Build phases

**Phase 1 — launchable site (8 pages)**
Home, About, Academics overview, the four stage pages, Admissions, Enquiry,
Contact. This is a complete, useful site. Do not launch with less: a site without
Admissions and Contact fails its primary job.

**Phase 2 — trust and conversion (7 pages)**
Results, Fees, Campus, Science & Technology, Transport, Faculty, Disclosure.

**Phase 3 — ongoing content (6 pages)**
News, Calendar, Gallery, Student Life, Leadership, Society, Privacy.

Phase 1 can go live while 2 and 3 are in progress — provided no navigation links
point at pages that don't exist yet.

---

## 10. Technical notes

Stack, tooling, image pipeline, and quality gates are already installed and
documented in `.claude/README.md`. Site source lives in `site/`; `npm run build`
produces `dist/`.

Two things the plan needs that the static stack does not provide on its own:

1. **Form handling.** A static site cannot process the enquiry form. Options:
   a hosted form service (Formspree, Netlify Forms — simplest, no backend);
   WhatsApp deep-link as the primary path with the form secondary (lowest
   friction for this audience, no infrastructure); or a small serverless
   function. **Recommendation:** hosted form service *plus* a prominent WhatsApp
   link, so there are two independent paths and one failing doesn't lose the
   enquiry. `[DECISION NEEDED]`
2. **News updates.** Adding a circular means editing HTML and rebuilding. That is
   fine if a technical person is available; it is a problem if the office must do
   it. If the school needs self-service updates, that changes the stack choice
   and should be decided now, not after launch. `[DECISION NEEDED]`

**Pre-launch:** all `[CONFIRM]` resolved; forms tested end-to-end on the live
domain; `npm run check` clean; keyboard and contrast pass; no staging URLs or
`noindex` left; HTTPS forced; Google Business Profile claimed and matching;
sitemap submitted.

**Post-launch:** re-test the form on the live domain (mail routing differs from
staging), and open the homepage on a real phone over mobile data.

---

## 11. Open decisions

| # | Decision | Recommendation |
|---|---|---|
| 1 | **Exact school name** | Blocks everything. Decide first |
| 2 | **Bilingual English + Kannada?** | Likely yes for this catchment, at least Home, Admissions, Fees, Contact. Roughly doubles content effort and needs a language toggle — decide **before** building, as retrofitting is expensive |
| 3 | Publish fees? | Yes. Opacity loses enquiries in this market |
| 4 | Publish results? | Yes, with real numbers, or omit the page entirely |
| 5 | Form handling | Hosted service + WhatsApp link |
| 6 | Who owns news updates? | Name a person, or cut the section |
| 7 | Toppers' photos and names | Only with written consent |
| 8 | Domain | `[CONFIRM]` whether one is owned |

Decisions 1 and 2 should be settled before any page is written.

---

## Sources

Benchmarking drew on the following. Direct fetches of the Bengaluru school sites
were blocked by this environment's network policy, so their structure is
summarised from search results rather than read from their live navigation —
worth a manual sanity-check before relying on any specific detail.

- [National Public School Indiranagar — EducationWorld](https://educationworld.in/national-public-school-indiranagar/)
- [National Public School Indiranagar — SchoolMyKids](https://www.schoolmykids.com/school/national-public-school-indiranagar-bengaluru-bangalore-karnataka-india-s10015629)
- [CBSE Mandatory Public Disclosure Norms 2026 — Careerindia](https://www.careerindia.com/news/cbse-mandatory-public-disclosure-norms-2026-what-schools-must-upload-055688.html)
- [CBSE Mandatory Disclosure — guidelines & checklist](https://www.rijadeja.com/cbse/mandatory-disclosure/)
- [CBSE School Website Requirements](https://resulthosting.net/CBSE%20School%20Website%20Requirements.html)
- [Karnataka School Examination and Assessment Board (KSEAB)](https://kseab.karnataka.gov.in/)
- [Prashanth School Of Brilliance, Mellahalli — Justdial listing](https://www.justdial.com/Mandya/Prashanth-School-Of-Brilliance-Mellahalli/9999P8232-8232-180209051021-D5N2_BZDET)
- [Inventure Academy](https://www.inventureacademy.com/) · [Vidyashilp Academy](https://vidyashilpacademy.edu.in/) (blocked; referenced from search results only)
