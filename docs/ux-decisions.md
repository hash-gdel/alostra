# Alostra — UX and design decisions

This document records **what we decided and why**. It is the reference for
judgement calls: when a new screen is designed or a component is proposed,
it should be checked against this page.

Exact token names, values and implementation rules live in
[`design-system.md`](./design-system.md). Nothing in this file should need
updating when a value is retuned.

> The previous `docs/ux-decisions.md` was an empty placeholder committed in
> "Initial project setup". There was no prior content to preserve.

---

## Status — the design foundation is frozen

**Milestone 1 is approved and the design tokens are frozen.** They are the
foundation for all future UI work.

**All new components must use these tokens.** No component may introduce a
colour, size, space, radius, duration or easing curve of its own. If a
component appears to need a value that does not exist, that is a signal to
discuss the system — not to write a one-off value.

### Change control

The design system does not change unless **a usability issue requires it**.
Specifically, a change is justified when:

- a real contrast, legibility, or touch-target failure is found;
- an accessibility requirement is not met in practice;
- a token proves genuinely insufficient for a real screen, and the gap is
  demonstrated rather than anticipated.

A change is **not** justified by aesthetic preference, by a new screen
wanting to look different, by convenience during implementation, or by
copying a pattern from another product.

When a change is warranted:

1. State the usability problem and the evidence for it.
2. Change `src/app/globals.css`, which is the single source of truth.
3. Re-verify at `/dev/design-system` — the contrast table is computed from
   the CSS, so it updates on the next build.
4. Update [`design-system.md`](./design-system.md) to match.
5. Record the reason here if the underlying decision changed, not merely
   the value.

Sections 1–16 below record the frozen decisions. Section 17 records the
working principles that emerged while making them.

### Pre-freeze audit

A final consistency audit was run before the freeze. It found no
redesign-level problems, and made eight corrections, all in the direction
of a **smaller** system:

| Finding | Resolution |
|---|---|
| Terracotta used decoratively in three places (a rule on the placeholder page, an ornament beside a demo button, a motion-demo square) | Removed or replaced. The Thread now appears only as the brand mark, a progress demonstration, and a capture acknowledgement. |
| `rounded-full` in use — a fourth radius | Replaced with `rounded-sm`. On a 2px-wide bar CSS clamps the radius to half the width, so the caps render identically. Vocabulary back to three. |
| `text-4xl` (46px) defined with no planned use | Removed. The scale is eight steps and ends at 36px. |
| `min-w-xs` used Tailwind's container scale, which we had disclaimed | Replaced with `min-w-80`, the same value on the sanctioned numeric ramp. |
| `opacity-40` on a walnut hairline, contradicting "never fade a hairline" | Opacity removed. |
| `text-action` used for a failure state, giving the action colour a second meaning | Replaced. The system deliberately has no destructive colour. |
| `font-sans` written 20 times where Geist already inherits | Removed 19; kept the one that is genuinely demonstrating the family. |
| **Tailwind was scanning the whole repository**, so the read-only `alostra_v0/` prototype and class names quoted in `docs/` were compiling into the production stylesheet | Scoped detection to `src/`. Compiled CSS fell from 48 KB to 24 KB. |

Verified clean at the freeze: zero arbitrary values, zero opacity
modifiers on colour, three radii, three durations, two easings, eight type
steps, three tracking values, five spacing tokens, three containers — and
every one of them used.

---

## 1. Product feeling

Alostra should feel **calm, inspired, refined, private and precise**.

| Quality | What it means in practice |
|---|---|
| Calm | Nothing competes for attention. One clear thing to do per screen. |
| Inspired | The library makes you want to read, not to organise. |
| Refined | Restraint. Fewer, better decisions, executed exactly. |
| Private | No social signals, no audience, no performance of reading. |
| Precise | Alignment, contrast and rhythm are correct, not approximately correct. |

A useful test: **refinement is quiet about itself.** If a screen is telling
the user how calm it is, it is not calm. The interface should simply be
well made and then get out of the way.

---

## 2. Positioning — the Reading Corner

Alostra is **a refined private reading corner** where books, articles,
highlights and ideas live together.

The mental model is a well-made reading room: a chair, good light, quality
paper, a shelf of books, everything carefully arranged and nothing
excessive. Walking into a personal library — not opening software.

A reading corner is **a place you go to do something**, not a place you go
to feel something. This distinction drives most of the decisions below.

### What Alostra is not

Not a productivity app, a dashboard, a SaaS tool, a task manager, a social
network, or a gamified reading app. Statistics never lead. Reading leads.

---

## 3. Rejected direction — spiritual, mystical, ceremonial

The v0 prototype unintentionally read as **spiritual**. This is explicitly
not the intended direction and is rejected.

The audit traced the effect to three specific, independently removable
sources. They are recorded here so the mistake is not repeated:

1. **Light descending from overhead.** The prototype washed a cool radial
   gradient down from above the top edge of the viewport onto warm paper.
   A cool, sourceless glow entering from directly overhead is the visual
   grammar of the divine. Real daylight in a real room comes from the
   *side*, is *warm*, and falls off directionally.
2. **Aphoristic copy.** "A Reading Sanctuary." "Read a little. Then sit
   with it a while." Rotating atmospheric moods. Navigation labelled with
   metaphors and glossed with riddles ("The Study / Preferences"). This is
   the voice of a retreat, not a library.
3. **Ceremonial motion.** One-second staggered upward entrances. Slow
   ascent, sequentially revealed, is the motion vocabulary of reverence.

**The palette was never the problem.** Terracotta, cream and olive are the
colours of bookbinding cloth and mid-century publishing. They only read as
spiritual because the light, the language and the motion instructed the
user to read them that way.

---

## 4. References

**Apple, Craft, Bear, Linear.** Specifically: Apple for proportion and
restraint, Craft and Bear for warm editorial calm, Linear for precision and
speed.

**Explicitly not Notion.** We are not building a flexible workspace with a
dense toolbar. Luxury comes from restraint, not from capability on display.

---

## 5. Design principles

- Excellent typography over decoration.
- Careful spacing and high-quality proportion.
- Thin borders, minimal shadows, subtle materials.
- Quiet interactions.
- No decorative effects standing in for craft.
- If a value is used twice, it becomes a token.
- Craftsmanship the user can *feel* comes from a page that loads instantly
  and a control that always meets contrast — not from a picture of a
  handmade object.

---

## 6. Typography

Two families, with strict and separate jobs. **The interface is not serif;
the things worth reading are.**

| Fraunces (serif) — content | Geist (sans) — interface |
|---|---|
| Major section headings | Navigation |
| Book titles | Buttons |
| Article titles | Forms and filters |
| Long-form reading content | Labels and metadata |
| Quotations inside Captures | System messages |

**Rationale.** The v0 prototype set every heading in a neutral UI sans and
reserved the serif for two decorative italics. That gave the product the
typographic identity of a developer tool. Inverting the roles does more for
the "private library" feeling than any other single decision, because it
makes the typography match the subject matter.

Fraunces is used with its optical-size axis active, so display sizes gain
contrast and small sizes stay sturdy. Its `SOFT` and `WONK` axes are
deliberately unused — we do not download axes we will not exercise.

---

## 7. Colour

A **semantic** system: components reference roles (`surface`, `foreground`,
`action`) and never raw colours. Authored in OKLCH so lightness can be
re-mapped for dark mode without hue drift.

**Light** is daylight on cream paper. Surfaces step lighter as they lift.

**Dark is a lamp-lit reading room, not a dark dashboard.** Chroma is
retained in every neutral, so the warmth survives; nothing in dark mode is
grey. A generic neutral-grey dark theme is rejected — it discards the
identity at exactly the moment (night reading) when a reading product is
most used.

Two decisions worth recording:

- **Terracotta is split into two tokens.** The action colour is darkened
  until its label clears AA. The Bookmark Thread stays a shade more open,
  because as a 2px mark it needs presence rather than legibility. A single
  terracotta cannot serve both jobs; the prototype tried and its primary
  button failed contrast.
- **Dark mode inverts the action strategy.** On a dark ground a *light*
  terracotta fill with a *dark* label reads strongly both against the page
  and within itself. A dark fill would sink into the background.

Every material token must have a job. A token that is only ever a swatch is
not part of the system and should be deleted.

---

## 8. The Bookmark Thread

The signature motif: **a thin terracotta ribbon**.

Used **only** for:

- active navigation;
- reading progress;
- selected book;
- selected capture;
- important emphasis.

**Never overused.** It is the same object doing the same job — *marking
your place* — in every context. Terracotta must not be used for decoration,
for diagram fills, for generic accents, or to make a screen livelier. If
everything is marked, nothing is.

Related: focus rings use the thread colour, because focus is also a form of
"where you are". Selection is tinted with the thread, because highlighting
is the same gesture the product is built around.

---

## 9. Space, shape and motion

**Space.** A 4px base with five named rhythm tokens above it. Use a named
token whenever the value expresses page rhythm rather than local padding,
so rhythm can be retuned in one place. Section spacing is regular; the
prototype's irregular first gap was an accident, not an intention.

**Shape.** Three radii and no pill. A `rounded-full` button beside a large
rounded card is a SaaS pairing and is rejected. Hairlines are drawn at full
opacity — a border faded to 60% is not a subtle border, it is an uncertain
one.

**Motion.** Three durations and two curves.

- **No page-entrance animations.** Nothing rises, fades in, or staggers on
  load. The interface should feel settled on arrival, the way furniture in
  a real room does not animate into place.
- The standard curve decelerates and is used for everything.
- The accent curve overshoots slightly and is reserved for the single
  tactile acknowledgement of a capture being saved. Used anywhere else it
  stops meaning anything.
- Nothing depends on animation to become usable or to communicate state,
  so reduced-motion costs the user nothing.

---

## 10. Container widths

Three, because **reading and browsing are different activities and must not
share a container**.

| Width | Purpose |
|---|---|
| Reading | The reader and prose. About 66 characters. |
| Content | A single column of mixed content. Home, detail pages. |
| Library | Browsing grids and shelves. |

The prototype applied one reading-width container to everything, including
the library grid. A library that can never be wider than a paragraph will
feel cramped the moment a real collection fills it.

---

## 11. Accessibility

These are requirements, not aspirations:

- **All normal-sized text meets WCAG AA (4.5:1)** against every surface it
  can appear on. Contrast is solved against the *worst-case* surface for
  the mode — the canvas in light, the raised surface in dark.
- Non-text UI marks such as the Thread meet 3:1.
- Text colours are never reduced with opacity utilities; if a lighter tone
  is needed it becomes a token with a verified ratio.
- Selected and active states are exposed to assistive technology, never
  communicated by colour alone. The prototype's selected capture was
  visible only as a terracotta line and did not exist for a screen reader.
- Interactive targets are at least 44px on touch.
- Focus is always visible, drawn outside the element so it never shifts
  layout.
- Reduced-motion is honoured globally.

Contrast is verified continuously at `/dev/design-system`, which computes
ratios from the real token definitions rather than from transcribed values.

---

## 12. Reading mode

Reading Mode should become **the best screen in the application**.

Principles:

- Entering reading hides distractions and navigation.
- Readability is maximised: comfortable measure, excellent typography, a
  reading type scale distinct from the interface scale.
- Transitions are quiet.
- **The interface disappears behind the reading.** The Thread should be the
  only persistent interface element.
- Reading mode is a *destination*, not a panel: the library recedes and the
  page comes forward.

It will be built for **articles first**, because articles are the
unvalidated half of the product thesis.

---

## 13. Cover imagery

Decided:

- **No photographic or AI-generated cover images** are ported from the v0
  prototype.
- **No synthetic page-edge or spine effects.** The prototype drew a fake
  paper edge on top of a photograph of a real paper edge — skeuomorphism
  layered on skeuomorphism, and two incompatible design philosophies on the
  same screen.
- Milestone 1 uses **controlled placeholders only**.

Production covers will use real metadata sources, a strict **2:3** ratio,
`next/image`, and a **refined deterministic fallback** when no cover is
available. The fallback matters: real imported libraries are full of
missing artwork, and turning the ugliest state in every competing product
into a signature is high-leverage.

Cover artwork must never contradict its own metadata. Every seed book in
the prototype was mis-attributed, with a different author printed on the
cover than stored in the data. In a product whose promise is trustworthy
personal data, that is the worst possible first impression.

---

## 14. Language

**Preferred vocabulary:** Reading Corner · Continue Reading · Recently
Added · Your Library · Reading Room · Bookshelf · Shelf · Collection ·
Captures.

**Never use "sanctuary."** Use "reading corner" only where product language
is genuinely needed — it is positioning, not a word to sprinkle.

**Avoid entirely:** sanctuary, haven, retreat, sacred, meditation, zen,
mindfulness, temple, ceremonial, mystical, ethereal, and any phrasing that
suggests glowing spirituality.

**Also avoid:** corporate terminology, and metaphor navigation. A
destination that needs a subtitle to explain it is badly named. Plain nouns
beat clever ones.

The voice should be warm, intelligent and timeless — and should not narrate
the user's mood or comment on their state of being.

---

## 15. Visual treatments to avoid

- Gradients resembling light descending from overhead.
- Decorative textures, wood imagery, leather imagery.
- Slow page-rise or staggered entrance animations.
- Faded or low-opacity hairlines.
- Pill-shaped buttons.
- Drop shadows on anything that is not a book cover.
- Statistics or charts given visual priority over reading.
- Terracotta used decoratively.

---

## 16. Milestone 1 — scope boundary and freeze

**Status: approved and frozen.** See
[Status](#status--the-design-foundation-is-frozen) for the change-control
policy.

Milestone 1 delivered the **design foundation only**: semantic colour in
both modes, typography, type and spacing scales, three container widths,
radii, motion, focus, selection, reduced-motion, a temporary identity, and
an internal reference route at `/dev/design-system`.

Explicitly **not** in Milestone 1: components, the data layer, Home, Queue,
Reading, Captures, imports, exports, analytics, payments, authentication,
a dark-mode toggle, formal CI, and any application functionality.

Dark mode is **architecture only** — the tokens are complete and verified,
but `.dark` is not applied to the document and there is no user-facing
toggle.

`alostra_v0/` is a **read-only reference**. It is never edited, built or
imported from.

The foundation is frozen at this boundary. Milestone 2 (primitives) begins
only on explicit approval.

---

## 17. Principles that emerged during the review

Section 5 records the principles we started with. These emerged from doing
the work, and several came from catching our own mistakes. They apply to
every future milestone.

### Solve values, do not choose them

Every accent colour was derived by searching lightness against a contrast
target, not picked by eye. **Contrast is an input to colour selection, not
a test applied afterwards.** Adding a colour to the system therefore means
solving it, not proposing it and checking later.

### Know which surface is the worst case

Surfaces step *lighter* as they lift in both modes, which inverts the
maths between them. In light, dark text is worst off on the darkest
surface (the canvas). In dark, light text is worst off on the *lightest*
surface (a raised card).

This was a genuine near-miss: the first dark-mode solve targeted the
canvas and produced text that measured 4.60 there but only 4.17 on a card
— a silent AA failure on every panel in the product. Always identify the
worst-case surface before solving.

### Split a token rather than compromise it

A single terracotta could not both carry a white label at 4.5:1 and read
as an open 2px mark. Forcing one value to do both jobs is exactly how the
prototype's primary button ended up failing contrast. **When one token is
being pulled in two directions, that is two tokens.**

### Every token must have a job

The prototype declared walnut and paper and used neither. A token that
only ever appears as a swatch is a mood-board entry, not part of a system.
Before adding one, name the component that will use it.

### Never transcribe what can be computed

Ten hex annotations written by hand into the token file were wrong — close
enough to look right, wrong enough to mislead. The colours themselves were
correct; only the documentation lied. Inaccurate comments in a token file
are how a design system stops being trusted.

Consequently `/dev/design-system` reads `globals.css` and computes contrast
at build time rather than displaying transcribed numbers. **Documentation
that can verify itself should.**

### The demonstration must obey the rule it demonstrates

Terracotta was used for the spacing-diagram bars on the very page that
documents terracotta as reserved. A rule stated in prose and broken in the
adjacent example teaches the example. Reference material is held to the
system more strictly than product code, not less.

### Verify in the browser, not in the source

Reading the source cannot tell you that the fonts actually resolved, that
reduced-motion collapsed transitions, that the focus ring computed to the
right colour, or that an OS dark-mode preference did not leak through a
system that is supposed to be light-only. Each of those was checked
against computed styles in a real browser at real viewport widths.

### Craftsmanship is practiced, not depicted

The prototype showed photographs of handmade objects while shipping ten
megabytes of unoptimised images and suppressing its own type errors.
Craftsmanship the user can feel comes from a page that loads instantly and
a control that always meets contrast — never from a picture of a
well-made thing.

### Emotional misreads usually come from light, language and motion

The prototype read as spiritual, and the instinct was to blame the palette.
The palette was correct. Overhead light, aphoristic copy and slow ascending
motion were doing all of it. **When a design feels wrong, check those three
before changing the colours.**

---

## 18. Open questions

Carried forward, to be resolved before or during the milestones noted:

- **Shelf as a layout primitive** (spines with a baseline rule, varying
  heights) as a differentiator over the universal cover grid. Deferred.
- **Encoding state in the Thread** — length for progress, opacity for
  recency — to deliver reading activity without ever building a dashboard.
  Deferred.
- **Unifying articles and books typographically**, e.g. an article as a
  slim pamphlet spine on the same shelf. This communicates the product
  thesis in one image and should be explored when Home is designed.
- Whether to **enforce** the token system by removing Tailwind's default
  palette and larger radii, rather than merely documenting them as
  out-of-system. Revisit once components exist to test against.
