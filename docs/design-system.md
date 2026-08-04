# Alostra — design system reference

Exact tokens and implementation rules. The rationale behind these choices
lives in [`ux-decisions.md`](./ux-decisions.md).

> **These tokens are frozen.** Milestone 1 is approved. All new components
> must use them, and no component may introduce a value of its own. The
> system changes only when a usability issue requires it — see the change
> -control policy in
> [`ux-decisions.md`](./ux-decisions.md#status--the-design-foundation-is-frozen).
>
> Milestone 2 added exactly two tokens under that policy, both under
> [Depth](#depth): `--scrim`, without which a dialog cannot be modal, and
> `--cover-shadow`, which this document already said would arrive when covers
> were built. Both are mixed down from existing materials, so the palette is
> unchanged. Nothing else moved.

The components built on these tokens are documented in
[`components.md`](./components.md).

**Source of truth:** `src/app/globals.css`. This document mirrors it. If the
two ever disagree, the CSS is correct and this file is stale.

**Live reference:** `/dev/design-system` renders every token and computes
contrast ratios directly from `globals.css` at build time. It is not linked
from the application and is excluded from search indexing.

**Stack:** Tailwind CSS v4 (CSS-first, no `tailwind.config`), Next.js App
Router, TypeScript strict.

---

## Consumption rules

1. **Use tokens, not values.** No arbitrary bracket values where a token
   exists. `src` currently contains zero.

   It contains exactly one arbitrary *variant*:
   `[&::-webkit-search-cancel-button]:appearance-none` in `SearchInput`, which
   suppresses the browser's own clear button so the field has one clear
   affordance rather than two. That is a selector for a pseudo-element, not a
   value, and no token can express it. Arbitrary variants are acceptable where
   the platform gives us no other handle; arbitrary values are not.
2. **Use semantic roles, not colours.** Reference `surface` and
   `foreground`, never a hex or a raw OKLCH triple.
3. **Never fade a text colour or a border with an opacity utility.** If a
   lighter tone is needed, add a token with a verified contrast ratio.
   `src` contains no `opacity-*` utilities and no `/nn` colour modifiers.
4. Tailwind's default palette, its container scale (`max-w-xs`, `min-w-md`
   and similar) and its radii above `lg` remain technically reachable but
   are **not part of this system**. Do not use them. The numeric spacing
   ramp (`w-80`, `p-6`) *is* part of the system — it derives from
   `--spacing`.
5. **Do not restate an inherited default.** Geist is the body font, so
   `font-sans` is only written where a specimen is deliberately
   demonstrating the family.
6. When a value is needed twice, promote it to a token here first.

### Source scoping

`globals.css` imports Tailwind as `@import "tailwindcss" source("../")`,
which limits class detection to `src/`.

This is load-bearing, not cosmetic. Tailwind's default behaviour is to scan
the entire repository, which meant the read-only `alostra_v0/` prototype
and every class name quoted in `docs/` were generating real utilities into
the production stylesheet — `snap-x`, `backdrop-blur-md`, `rounded-2xl`
and others were all shipping. Scoping the source halved the compiled CSS
(48 KB to 24 KB) and makes the rules above enforceable rather than
aspirational: a utility outside this system now genuinely does not exist.

**Do not widen this path.** If a new source directory is added, add it
explicitly with `@source`.

---

## Colour

Authored in OKLCH. Light is the default on `:root`; dark is a `.dark` class.

| Token | Light OKLCH | Light hex | Dark OKLCH | Dark hex |
|---|---|---|---|---|
| `--canvas` | `0.958 0.014 83` | `#f6f0e7` | `0.205 0.012 60` | `#1b1612` |
| `--surface` | `0.982 0.011 86` | `#fcf9f1` | `0.245 0.013 60` | `#251f1a` |
| `--surface-sunken` | `0.945 0.016 82` | `#f2ece1` | `0.175 0.010 58` | `#140f0c` |
| `--surface-hover` | `0.925 0.018 78` | `#ede5d9` | `0.285 0.014 62` | `#2f2923` |
| `--paper` | `0.985 0.010 88` | `#fdfaf3` | `0.235 0.012 62` | `#221d18` |
| `--foreground` | `0.290 0.021 58` | `#342921` | `0.920 0.012 82` | `#e9e4dc` |
| `--muted-foreground` | `0.500 0.028 66` | `#6f6053` | `0.628 0.016 70` | `#8f877e` |
| `--border` | `0.840 0.018 74` | `#d2c9be` | `0.370 0.014 62` | `#453e38` |
| `--border-strong` | `0.780 0.020 72` | `#c0b6aa` | `0.450 0.016 62` | `#5c534c` |
| `--action` | `0.562 0.128 42` | `#b25833` | `0.720 0.115 45` | `#e08c66` |
| `--action-hover` | `0.512 0.128 42` | `#a14923` | `0.770 0.105 45` | `#ec9f7c` |
| `--action-foreground` | `0.980 0.012 85` | `#fcf8f0` | `0.185 0.014 58` | `#18110d` |
| `--thread` | `0.585 0.128 42` | `#b95e3a` | `0.660 0.125 42` | `#d17652` |
| `--olive` | `0.530 0.055 118` | `#69704c` | `0.624 0.050 118` | `#848c6a` |
| `--walnut` | `0.360 0.045 58` | `#4f3725` | `0.630 0.035 58` | `#9a8475` |

### Roles

| Token | Job |
|---|---|
| `canvas` | The page ground. |
| `surface` | Cards and raised panels. |
| `surface-sunken` | Sidebar and wells. |
| `surface-hover` | Quiet hover wash. |
| `paper` | The reading surface. **Reader only.** |
| `foreground` | Primary text. |
| `muted-foreground` | Metadata and secondary text. |
| `border` | The default hairline. Panels, dividers, inputs. |
| `border-strong` | Emphasis only. Table headers, section rules. |
| `action` | The only text-bearing fill in the system. |
| `action-hover` | Action, hovered. |
| `action-foreground` | The label on `action`. |
| `thread` | The Bookmark Thread. Reserved — see usage limits. |
| `olive` | Quiet status text. |
| `walnut` | Structural and quiet display. Shelf rules, measurement marks. |

### Utilities

Exposed via `@theme inline`, so any subtree carrying `.dark` resolves
through normal cascade: `bg-canvas` `bg-surface` `bg-surface-sunken`
`bg-surface-hover` `bg-paper` `text-foreground` `text-muted-foreground`
`border-border` `border-border-strong` `bg-action` `hover:bg-action-hover`
`text-action-foreground` `bg-thread` `text-olive` `text-walnut`.

### Thread usage limits

`--thread` may be used **only** for active navigation, reading progress,
selected book, selected capture, and important emphasis — plus focus rings
and the selection tint, which are the same "where you are" idea. It must
not be used for diagram fills, generic accents or decoration.

---

## Contrast

Measured against the worst-case surface for each mode. All twelve text and
UI pairs pass. Verified live at `/dev/design-system`.

| Pair | Light | Dark | Required |
|---|---|---|---|
| `foreground` on `canvas` | 12.54 | 14.16 | 4.5 |
| `foreground` on `surface` | 13.46 | 12.83 | 4.5 |
| `muted-foreground` on `canvas` | 5.34 | 5.07 | 4.5 |
| `muted-foreground` on `surface` | 5.73 | 4.60 | 4.5 |
| `action-foreground` on `action` | 4.60 | 7.24 | 4.5 |
| `action-foreground` on `action-hover` | 5.69 | 8.71 | 4.5 |
| `olive` on `canvas` | 4.60 | 5.07 | 4.5 |
| `olive` on `surface` | 4.94 | 4.60 | 4.5 |
| `walnut` on `canvas` | 9.73 | 5.08 | 4.5 |
| `walnut` on `surface` | 10.44 | 4.61 | 4.5 |
| `thread` on `canvas` | 3.91 | 5.50 | 3.0 (UI) |
| `thread` on `surface` | 4.20 | 4.99 | 3.0 (UI) |
| `border` on `canvas` | 1.45 | 1.71 | n/a |
| `border-strong` on `canvas` | 1.77 | 2.40 | n/a |

Components put text on three further surfaces, so these pairs were added with
the library. All pass.

| Pair | Light | Dark | Required |
|---|---|---|---|
| `foreground` on `surface-sunken` | 12.07 | 14.98 | 4.5 |
| `muted-foreground` on `surface-sunken` | 5.13 | 5.37 | 4.5 |
| `walnut` on `surface-sunken` | 9.36 | 5.38 | 4.5 |
| `foreground` on `surface-hover` | 11.35 | 11.35 | 4.5 |
| `foreground` on `paper` | 13.58 | 13.18 | 4.5 |
| `muted-foreground` on `paper` | 5.78 | 4.72 | 4.5 |
| `thread` on `surface-sunken` | 3.76 | 5.82 | 3.0 (UI) |
| `thread` on `surface-hover` | 3.54 | 4.41 | 3.0 (UI) |
| `thread` on `paper` | 4.24 | 5.12 | 3.0 (UI) |

Ratios are computed in sRGB. On a P3 display the terracottas render
slightly more saturated; these values are the conservative case.

**Any new colour pairing must be added to `CONTRAST_PAIRS` in
`src/app/dev/design-system/page.tsx` so it is checked on every build.**

### Forbidden pairings

Surfaces step lighter as they lift, so in dark mode the **hover wash** is the
lightest surface in the system — lighter than the raised surface every dark
text token was solved against. The three quiet text tokens fall below AA on it.
These combinations are therefore forbidden, and the reference page renders them
with their measured ratios beside the rule, in `FORBIDDEN_PAIRS`.

| Never pair | Light | Dark | Use instead |
|---|---|---|---|
| `muted-foreground` on `surface-hover` | 4.83 | **4.07** | Brighten to `foreground` under a wash |
| `olive` on `surface-hover` | **4.17** | **4.07** | No status text on a hovered surface |
| `walnut` on `surface-hover` | 8.80 | **4.08** | Walnut is structure, not a control label |
| `olive` on `surface-sunken` | **4.43** | 5.37 | A neutral badge in wells and sidebars |

The practical rules: **wash controls, not cards** — only elements whose text is
`foreground` may take `bg-surface-hover`, and anything muted inside a washed
container brightens to `foreground` as the wash arrives. Olive never sits in a
well.

---

## Light and dark mode rules

- **Light is the default**, declared on `:root`.
- **Dark is a `.dark` class**, never the OS preference. A custom variant
  (`@custom-variant dark (&:where(.dark, .dark *))`) makes `dark:`
  utilities follow the same class, so utilities and tokens can never
  disagree about which mode is active.
- **Every semantic token must be defined in both modes.** A token missing
  from `.dark` will inherit its light value and break.
- **Surfaces step lighter as they lift in both modes.** This inverts the
  contrast maths: the worst case for text is `canvas` in light and
  `surface` in dark. Solve dark text against `surface`.
- Dark mode retains chroma in every neutral. **Nothing in dark mode is
  grey.**
- **Current status: architecture only.** `.dark` is not applied to the
  document, `viewport.colorScheme` is `light`, and there is no toggle. To
  preview, scope the class to a subtree — `/dev/design-system` does exactly
  this.

---

## Typography

`--font-sans` → Geist. `--font-serif` → Fraunces, `"Iowan Old Style"`,
Georgia, serif.

Fraunces is loaded with the `opsz` axis only and driven by
`font-optical-sizing: auto`. `SOFT` and `WONK` are intentionally not
downloaded.

`.font-serif` additionally enables `liga`, `dlig`, `onum`, `kern`. The
document enables `liga`, `calt`, `kern` globally.

### Scale

Eight steps, ~1.2 ratio. Each is paired with a line height. `text-3xl` is
the largest size in the system; there is deliberately no display step above
it, because nothing in the product needs one.

| Utility | Size | Line height | Family | Use |
|---|---|---|---|---|
| `text-3xl` | 2.25rem / 36px | 1.2 | Fraunces | Page titles |
| `text-2xl` | 1.75rem / 28px | 1.3 | Fraunces | Book and article titles |
| `text-xl` | 1.375rem / 22px | 1.4 | Fraunces | Section headings |
| `text-lg` | 1.125rem / 18px | 1.55 | Fraunces | Lead paragraphs, quotations |
| `text-base` | 1rem / 16px | 1.6 | Geist | Default body |
| `text-sm` | 0.875rem / 14px | 1.55 | Geist | Secondary body, controls |
| `text-xs` | 0.75rem / 12px | 1.5 | Geist | Metadata, counts |
| `text-2xs` | 0.6875rem / 11px | 1.45 | Geist | Micro labels, eyebrows |

### Reading scale

Separate from the interface scale and used **only** by the reader.

| Utility | Size | Line height |
|---|---|---|
| `text-reading` | 1.1875rem / 19px | 1.72 |

### Tracking

| Utility | Value | Use |
|---|---|---|
| `tracking-display` | `-0.018em` | Headings and titles |
| `tracking-body` | `0em` | Everything set as running text |
| `tracking-label` | `0.14em` | The one small-caps treatment |

The small-caps treatment is `text-2xs uppercase tracking-label`, normally
in `text-muted-foreground`. There is no second variant.

---

## Spacing

Base unit `--spacing: 0.25rem` (4px), giving the full numeric ramp
(`p-1` = 4px, `p-6` = 24px).

Five named rhythm tokens sit above it. Use the named token whenever a value
expresses page rhythm rather than local padding.

| Utility suffix | Value | Use |
|---|---|---|
| `gutter` | 1.5rem / 24px | Page gutter, small screens |
| `gutter-lg` | 2.5rem / 40px | Page gutter, large screens |
| `block` | 2rem / 32px | Between blocks within a section |
| `section` | 4rem / 64px | Between sections |
| `section-lg` | 5rem / 80px | Between sections, large screens |

Works with any spacing utility: `px-gutter`, `mt-section`,
`md:mt-section-lg`, `gap-block`, `pb-section-lg`.

Standard page shell: `px-gutter md:px-gutter-lg`, sections at
`mt-section md:mt-section-lg`.

---

## Container widths

| Utility | Value | Use |
|---|---|---|
| `max-w-reading` | 38rem / 608px | The reader and prose. ~66 characters. |
| `max-w-content` | 48rem / 768px | A single column of mixed content. |
| `max-w-library` | 75rem / 1200px | Browsing grids and shelves. |

Reading and browsing must not share a container.

---

## Radii

Three, and only three. **There is no pill radius by design**, and
`rounded-full` is not used anywhere in the codebase.

| Utility | Value | Use |
|---|---|---|
| `rounded-sm` | 0.25rem / 4px | Tags, small controls, Thread caps |
| `rounded-md` | 0.5rem / 8px | Buttons, inputs, nav items |
| `rounded-lg` | 0.875rem / 14px | Cards, panels, sheets |

Thread marks use `rounded-sm`. On an element only a few pixels wide CSS
clamps the radius to half the width, so the caps render fully round —
identical to `rounded-full` without admitting a fourth radius.

---

## Borders and shadows

One hairline token at **full opacity**: `border-border`. `border-strong`
for emphasis only. Do not apply opacity modifiers to borders.

**Shadows are reserved for book covers**, where they represent a real
object with weight. Nothing else in the system casts a shadow.

### Depth

Two tokens, added with the component library, and the only two places the flat
page acquires a third dimension. Both are `color-mix` derivations of materials
already in the palette — the same technique `::selection` already used — so
neither introduces a hue.

| Token | Utility | Light basis | Dark basis | Use |
|---|---|---|---|---|
| `--scrim` | `bg-scrim` | `walnut` at 55% | `surface-sunken` at 78% | The modal ground. `Dialog`, and nothing else. |
| `--cover-shadow` | `shadow-cover` | `walnut` at 16% / 30% | `surface-sunken` at 65% / 85% | Book covers. Still the only shadow in the system. |

Dark mode mixes from `surface-sunken` rather than `walnut`, because walnut is a
*light* tone in dark mode: a walnut scrim would fog the page instead of dimming
it.

The scrim exists because a dialog has to be separated from the page somehow,
and shadows are not available to lift it. `--scrim` is reached through
Tailwind's `backdrop:` variant on the native `<dialog>` element
(`backdrop:bg-scrim`).

---

## Motion

Three durations and two curves. Reference them as CSS variables so the
token is named at the use site.

| Token | Value | Use |
|---|---|---|
| `--duration-quick` | 120ms | Hover, colour, opacity. Below the threshold of attention. |
| `--duration-state` | 200ms | A real state change. The thread extending. A panel opening. |
| `--duration-enter` | 320ms | An element genuinely arriving. The ceiling, rarely reached. |

| Utility | Curve | Use |
|---|---|---|
| `ease-standard` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Decelerating. Everything. |
| `ease-accent` | `cubic-bezier(0.34, 1.4, 0.64, 1)` | Slight overshoot. **Reserved** for acknowledging a saved capture. |

Usage:

```
transition-colors duration-(--duration-quick) ease-standard
transition-all    duration-(--duration-state) ease-standard
```

**There are no page-entrance animations.** No keyframes for rising, fading
in or staggering exist in the system, and none should be added.

---

## Focus

One treatment everywhere, applied globally to `:focus-visible`:

```css
outline: 2px solid var(--thread);
outline-offset: 2px;
```

Drawn outside the element, so it never shifts layout, and visible on any
surface in either mode. Components must not remove or override it.

---

## Selection

```css
::selection {
  background-color: color-mix(in oklch, var(--thread) 22%, transparent);
  color: var(--foreground);
}
```

Selection reads as a highlighter laid over the text — the same gesture the
product is built around.

---

## Reduced motion

Global, in `@layer base`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Nothing in the system depends on animation to become usable or to
communicate state, so honouring the preference costs the user nothing.
**Any future component must hold to this**: if it needs motion to be
understood, it is designed wrong.

---

## Base layer

- `html` and `body` are painted `--canvas`. **The canvas is flat** — no
  gradient, no texture, no simulated light source.
- Body is `--font-sans`, `--foreground`, `tracking-body`.
- `-webkit-font-smoothing: antialiased`, `text-rendering: optimizeLegibility`.

---

## Verification

Run locally before completing a milestone:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Then open `/dev/design-system` and confirm the contrast table shows no
failures in either mode. The table is computed from `globals.css` at build
time, so a token change is reflected automatically.
