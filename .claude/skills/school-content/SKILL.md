---
name: school-content
description: Write or revise copy for the PSB school website — homepage, about, academics by stage, admissions, facilities, faculty, news, contact. Use when drafting page text, headings, calls to action, or FAQ entries, and to keep voice and terminology consistent across the site.
---

# Writing copy for the school site

The audience is parents deciding where to enrol a child, plus current parents
looking something up quickly. Almost nobody browses; they arrive with a
question. Write to answer questions, not to impress.

## Voice

Warm, plain, specific. Short sentences. Second person for parents ("your
child"), third person for the school ("the school", not "we" in formal pages).

Concrete beats superlative every time:

- No: "We provide world-class holistic education nurturing tomorrow's leaders."
- Yes: "Class sizes are capped at 30. Every primary class has two teachers."

Cut these words wherever they appear: *holistic, world-class, state-of-the-art,
nurturing young minds, cutting-edge, plethora, embark on a journey, unlock
potential, foster, synergy*. They carry no information and every school site
uses them.

## Hard rule: never invent facts

School sites carry claims parents act on. Do not write a number, date, fee,
affiliation, award, ratio, or facility that the school has not supplied.

When a fact is missing, leave a visible placeholder rather than a plausible
guess:

```html
<p><!-- TODO(school): confirm student:teacher ratio -->[ratio to confirm]</p>
```

Placeholders are easy to find before launch. Invented facts are not, and a
wrong fee or affiliation number on a school site is a real problem for real
families. This applies especially to: board affiliation and affiliation
number, fee amounts, admission dates, exam results, staff names and
qualifications, transport routes, and safety certifications.

## Terminology

Use the grade labels from the `school-page` skill exactly: Pre-School, Pre-KG,
LKG, UKG, Class 1 … Class 10, grouped as Pre-Primary / Primary / Middle /
Secondary. Never "Grade", never "Standard", never "Class-1" with a hyphen,
never "Lower KG" or "L.K.G.".

Age-appropriate copy tracks the four stages, and within Pre-Primary the four
years are genuinely different: Pre-School and Pre-KG are about settling in and
separation; LKG and UKG are about early literacy and numeracy and readiness for
Class 1. Do not let one paragraph serve all four.

Other consistent choices — pick once, apply everywhere:

- "enrol / enrolment" (British) throughout, matching Indian school convention.
- "admissions", not "admission", for the section name.
- "parents", not "guardians", in body copy; "parent or guardian" only on forms.
- Dates as "12 April 2026". Times as "8:30 am".
- The school's name spelled identically on every page — confirm the exact
  legal name and preferred short form before writing any of it.

## What each page needs to do

| Page | The question it answers |
|---|---|
| Home | What kind of school is this, and can my child join? |
| About | Who runs it, how long has it existed, what board? |
| Academics (per stage) | What will my child actually do all day at this age? |
| Admissions | What are the steps, dates, documents, and costs? |
| Facilities | Is it safe, and what's there? |
| Faculty | Who will teach my child, and are they qualified? |
| Contact | How do I reach a human today? |

Each stage page under Academics should be written for the age it covers.
A Pre-KG page talks about settling in, play, toilet independence, and separation
anxiety. A Class 10 page talks about board exams, subject choices, and
preparation support. The same paragraph must not serve both.

## Structure on the page

- Lead with the answer. No scene-setting paragraph before the substance.
- Headings are descriptive, not clever: "Admission steps", not "Your journey
  begins here".
- Break process content into numbered steps, not prose.
- One clear call to action per page — usually "Book a school visit" or
  "Start an enquiry". Two competing CTAs means neither gets used.
- Keep paragraphs to 3 sentences or fewer; parents read these on a phone.

## Accessibility of the writing itself

- Link text describes the destination: "Read the admissions policy", never
  "click here" or a bare URL.
- Expand an abbreviation the first time it appears on each page.
- Don't rely on colour or position alone to convey meaning ("the box on the
  right" breaks on mobile and for screen readers).
