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

**Milestone 2 is approved and the component library is frozen.** The thirty
primitives in `src/components/`, their public API as recorded in
[`components.md`](./components.md), and the thirteen-icon set are the
vocabulary every screen is assembled from. Screens compose these components;
they do not invent surfaces, hairlines or hover behaviours of their own. If a
screen appears to need a component or a prop that does not exist, that is a
signal to discuss the library — not to write a one-off.

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

From Milestone 2 the same policy governs the component library. A prop,
variant or behaviour changes — and a component is added — only against a
need demonstrated on a real screen, never speculatively. When a library
change is warranted: state the problem and the evidence, change the
component, re-verify the catalogue at `/dev/design-system` section 08 and
the three build checks, update [`components.md`](./components.md), and
record the reason here if a decision changed rather than an implementation
detail.

Sections 1–16 below record the frozen foundation decisions. Section 17
records the working principles that emerged while making them. Section 18
records the decisions made while building the component library, frozen with
Milestone 2. Section 19 records questions deliberately left open. Section 20
records Milestone 3 (data and library). Section 21 records authentication and
Supabase persistence. Persistence details live in [`data.md`](./data.md) and
[`authentication-architecture.md`](./authentication-architecture.md).

### Changes made under this policy

**Milestone 2 — two additions, no changes.** Both were justified by a
demonstrated gap, both are `color-mix` derivations of existing materials, and
the palette itself is untouched.

| Addition | Problem | Evidence |
|---|---|---|
| `--scrim` | A dialog has to be separated from the page and marked as modal. Shadows are reserved for covers, so lifting the panel was not available; the page had to be dimmed instead. | Building `Dialog`. Without a scrim, a modal panel is indistinguishable from an inline one. |
| `--cover-shadow` | A book cover is a real object with weight. | Anticipated by the system: `design-system.md` already stated a cover shadow would be added when covers were built. |

**Milestone 2 — one failure found, fixed without touching a token.** The dark
hover wash is the lightest surface in the system, so `muted-foreground`,
`olive` and `walnut` all fall below AA on it (4.07, 4.07, 4.08). This is the
same class of near-miss as the original dark-mode solve, one surface further
on. It was resolved in the components rather than in the palette — see
[§18](#18-milestone-2--the-component-library).

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

`alostra_v0/` was a **read-only reference**: never edited, built or imported
from. It was verified to have no imports, dependencies, assets or copied files
reaching into it, and was then deleted.

The foundation is frozen at this boundary. Milestone 2 (primitives) began on
explicit approval and is recorded in [§18](#18-milestone-2--the-component-library).

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

## 18. Milestone 2 — the component library

**Status: approved and frozen.** See
[Status](#status--the-design-foundation-is-frozen) for the change-control
policy, which from this milestone governs the component API exactly as it
governs the tokens.

**Scope.** Thirty reusable primitives in `src/components/`, catalogued at
`/dev/design-system` section 08, documented in
[`components.md`](./components.md). No pages, no data layer, no application
functionality. A component that would only ever be used once is not a
primitive and was not built.

### The dark hover wash was an AA failure waiting to happen

Milestone 1 solved every dark text colour against `surface`, having correctly
identified it as lighter than `canvas`. But `surface-hover` is lighter still —
it is the lightest surface in the system — and `muted-foreground` measures only
**4.07:1** against it. So does olive, and so does walnut. Metadata under a
hover wash is not an edge case: it is every card and every navigation row in
the product.

Two ways out. Re-solve three dark tokens against the true worst case, or design
the components so the pairing never occurs. We chose the components, because the
palette is frozen and the constraint turned out to be a *better* interface
rather than a compromise:

- **Wash controls, not cards.** Buttons, icon buttons and navigation rows —
  whose text is `foreground` at 11.35:1 — keep the wash. Cards do not; an
  interactive card firms its hairline to `border-strong` instead. This is
  quieter than a wash, which suits a product whose interactions are meant to be
  quiet.
- **Muted text brightens under a wash.** A sidebar count moves from
  `muted-foreground` to `foreground` as the wash arrives, which is both AA-safe
  and a better hover: the row you are pointing at becomes more legible, not
  merely tinted.

The failing ratios are now rendered *on the reference page* beside the rule they
justify, computed from the tokens like everything else. A rule with the number
next to it is a rule people believe.

### Restraint held where it was tested

Four places where the obvious component pattern was rejected because the system
already had an answer:

- **No spinner.** Reduced motion is honoured globally, which would freeze a
  spinner mid-turn. `loading` swaps the label and sets `aria-busy`.
- **No shimmer.** Skeletons are static blocks. A pulsing gradient is exactly the
  decorative effect this system spends its restraint avoiding.
- **No red.** Invalid fields and destructive confirmations carry their weight in
  words, `aria-invalid` and a stronger hairline. Naming the verb on the button
  (`"Delete book"`, never `"OK"`) does more than colouring it ever would.
- **No fading.** A disabled control drops to the sunken surface and keeps a
  hairline, rather than being an opacity-reduced copy of itself.

### The platform does the hard parts

`Dialog` is the native `<dialog>` element with `showModal()`, which brings the
top layer, focus containment, page inertness and Escape. A hand-rolled focus
trap is a bug waiting to happen, and this product cannot afford to be the app
where keyboard users get stuck behind a modal.

### Privacy is a component-level decision, not a policy page

`SourceIcon` draws its own marks rather than fetching favicons: a favicon
request tells a website what its reader is reading, from that reader's own
device. `BookCover` does not enable remote image hosts until a metadata source
is chosen. These are the kind of leaks that arrive by convenience, one
component at a time.

### Composition kept the library small

`BookCard`, `ArticleCard`, `CaptureCard` and `ContinueReadingCard` are all
`Card` plus existing parts, so the panel, hairline and hover behaviour exist
once. `ReadingProgress` is `ProgressBar` plus the product's wording.
`IconButton` shares `Button`'s variant and geometry maps rather than restating
them. The three containers are one implementation with three widths. Where two
components looked unifiable and were not — `SidebarItem` and `MobileNavItem` —
the anatomy genuinely differs, and what they share (the meaning of "active") is
expressed identically in both.

### One deliberate typographic exception

Form controls are set at 16px rather than the 14px the system assigns to
controls, because iOS zooms the viewport when a focused field is smaller. That
is a usability failure, not a preference — the exception the change-control
policy exists to allow, recorded here rather than absorbed silently.

### Scope boundary and freeze

Milestone 2 delivered the component library only: thirty primitives, the
thirteen-icon set, two sanctioned tokens (`--scrim`, `--cover-shadow`), the
expanded catalogue at `/dev/design-system`, and
[`components.md`](./components.md). Explicitly **not** in Milestone 2: pages
(Home, Queue, Reader, Settings), the data layer, imports, exports, search,
analytics, payments, authentication, a dark-mode toggle, and any application
functionality.

Two intentional exceptions stand at the freeze, both recorded rather than
absorbed into a redesign of the APIs:

1. **Form controls at 16px** — see above. Documented in
   [`components.md`](./components.md#intentional-exceptions-at-freeze).
2. **One arbitrary variant in `SearchInput`** —
   `[&::-webkit-search-cancel-button]:appearance-none`, documented in
   [`design-system.md`](./design-system.md#consumption-rules).

Open questions that were deliberately not answered by inventing components or
props are listed in [§19](#19-open-questions). None of them change the frozen
API.

The library is frozen at this boundary. The next milestone begins only on
explicit approval.

---

## 19. Open questions

Carried forward, to be resolved before or during the milestones noted:

- **Shelf as a layout primitive** (spines with a baseline rule, varying
  heights) as a differentiator over the universal cover grid. Deferred.
- **Encoding state in the Thread** — length for progress, opacity for
  recency — to deliver reading activity without ever building a dashboard.
  Deferred.
- **Unifying articles and books typographically**, e.g. an article as a
  slim pamphlet spine on the same shelf. Home now exists as a calm list and
  continue card; a shared shelf language remains open.
- Whether to **enforce** the token system by removing Tailwind's default
  palette and larger radii, rather than merely documenting them as
  out-of-system. First screens now exist; revisit once the library and home
  layouts have settled under real use.
- **Remote cover hosts.** `BookCover` ships with no remote image patterns
  configured — a privacy decision, not an oversight. Milestone 3 stores
  optional cover URLs but only renders same-origin paths; `http(s)` URLs use
  the fallback plate until hosts are chosen in `next.config.ts`.
- **A labelled icon specimen.** The catalogue shows the thirteen icons only
  inside the components that use them, so four never appear under their own
  name. Worth a dedicated specimen if the set ever grows.
- **Native select.** Milestone 3 needed status and source pickers. There is no
  Select primitive in the frozen library; app-local native `<select>` fields
  were used instead of expanding the component API. Promote only if screens
  keep needing the same control.

---

## 20. Milestone 3 — data and library

**Status: delivered (superseded persistence by §21).** Milestones 1 and 2 remain
frozen.

Milestone 3 delivered the first user-facing library experience:

- Domain types and repositories for books, articles and captures
- Application shell (Home, Library, Captures)
- Unified library with filters, search, add/edit/delete
- Captures attached to books or articles
- Book progress rules and validation

Exact schema, progress rules and search behaviour:
[`data.md`](./data.md).

The original device-local store from Milestone 3 was removed when Version 1
moved to authenticated Supabase persistence (§21).

Explicitly **not** in Milestone 3 alone: article extraction, in-app article
reading, highlighting, Goodreads/Notion/Markdown import or export, payments,
analytics, notifications, or reading guidance.

---

## 21. Authentication and cloud persistence (Version 1)

**Status: implemented; awaiting review freeze.** Architecture:
[`authentication-architecture.md`](./authentication-architecture.md).

Authentication exists so a user’s reading home is durable and available across
devices. Supabase Auth + PostgreSQL with RLS is the **only** library source of
truth. Public visitors see a calm landing page; product routes (`/home`,
`/library`, `/captures`) require sign-in. Email/password only. Calm copy —
no aggressive onboarding.

Explicitly **not** in this foundation: offline bidirectional sync, OAuth,
anonymous persistent libraries, book-file storage, conflict UI.
