# Alostra — component library

The reusable primitives every screen is built from. Thirty components in one
flat folder, `src/components/`, imported from `@/components`.

**Source of truth:** the components themselves. Each file opens with a doc
comment covering **purpose, props, usage and accessibility** — often including
why a treatment is what it is. This page is the map and the public API summary;
read the file for the detail.

**Live catalogue:** `/dev/design-system`, section 08. Every component is
rendered there in both light and dark, with its states. Hover, active and focus
are live rather than pictured.

> **This library is frozen.** Milestone 2 is approved; the components and the
> public API below are the vocabulary every screen is assembled from. A prop,
> variant or behaviour changes — and a component is added — only against a
> need demonstrated on a real screen, under the same change-control policy as
> the tokens. See
> [`ux-decisions.md`](./ux-decisions.md#status--the-design-foundation-is-frozen).
>
> Design tokens are frozen likewise. No component may introduce a colour,
> size, space, radius, duration or easing curve of its own. See
> [`design-system.md`](./design-system.md).

---

## Conventions

1. **One flat folder.** `src/components/*.tsx`, one component per file, kebab
   case. No nesting, no per-component directories, no index files inside
   folders. The library is small on purpose and should stay browsable.
2. **Import from the barrel.** `import { BookCard, Button } from "@/components"`.
3. **Generic, never page-specific.** A component knows about the design system
   and about reading. It knows nothing about Home, the Queue or the Reader. If a
   component would only ever be used once, it belongs to that screen instead.
4. **Composition over configuration.** `BookCard` is `Card` + `BookCover` +
   `Badge` + `ReadingProgress`, not a new surface. A panel, hairline or hover
   behaviour is defined once and reused.
5. **`className` adds, it does not override.** Components own their base
   classes; `className` is for layout, width and margin at the call site. If you
   need to override a base style, the component needs a prop. There is no
   `tailwind-merge` and nothing to de-conflict at runtime.
6. **Real elements.** Anything clickable is a `<button>` or an `<a>`, never a
   div with a handler. Headings are headings, quotes are `<blockquote>`,
   separators are separators.
7. **Client components only where state lives.** `Input`, `Textarea`,
   `SearchInput`, `Dialog` and `Toast` are `"use client"`; everything else
   renders on the server.
8. **Internal, not exported:** `cn.ts` (class joiner), `styles.ts` (shared class
   fragments), `field.tsx` (field plumbing). They are how components share a
   rule, not part of the API.

---

## Foundation

| Component | Purpose | Key props |
|---|---|---|
| `Button` | Every action. `action` is the only text-bearing fill; one per screen at most. | `variant` `action \| quiet \| ghost`, `size` `md \| sm`, `loading`, `loadingLabel`, `leadingIcon`, `trailingIcon`, `href`, `disabled` |
| `IconButton` | A square control carrying one icon, sharing Button's geometry. | `label` **(required)**, `variant`, `size`, `href`, `disabled` |
| `Input` | A whole single-line field: label, control, help text, validation. | `label`, `labelHidden`, `description`, `error`, `fieldClassName`, all native input attributes |
| `Textarea` | Multi-line text. Same anatomy as `Input`. | as `Input`, plus `rows` (default 4) |
| `SearchInput` | Filtering a library, queue or captures. A filter, not a form. | `value`, `onValueChange`, `onClear`, `clearLabel`, `placeholder` |
| `Label` | The two sanctioned ways to name something. | `variant` `field \| eyebrow`, `htmlFor`, `as` `label \| span` |
| `Badge` | A short, static piece of state. Never interactive. | `tone` `neutral \| status \| emphasis`, `icon` |
| `Divider` | A hairline at full strength. | `orientation`, `tone` `default \| strong` |
| `Thread` | The Bookmark Thread. Reserved — see below. | `orientation`, `extent` `0–1` |
| `ProgressBar` | The generic progress primitive. | `value`, `max`, `label` **(required)**, `valueText` |
| `Skeleton` | The shape of content that has not arrived. Static by design. | `variant` `text \| block \| cover`, `lines` |
| `EmptyState` | A place with nothing in it yet, treated as a real screen. | `title`, `description`, `action`, `icon`, `headingLevel` |

## Layout

| Component | Purpose | Key props |
|---|---|---|
| `PageContainer` | `max-w-library` (1200px). Browsing: shelves, grids, the queue. | `as`, `gutters` |
| `ContentContainer` | `max-w-content` (768px). A single column of mixed content. | `as`, `gutters` |
| `ReadingContainer` | `max-w-reading` (608px) and the reading type scale. Prose. | `as`, `gutters`, `prose` |
| `Card` | The one raised panel. Every item card composes it. | `href`, `asButton`, `as`, `padding` `none \| sm \| md \| lg`, `selected` |
| `SectionHeading` | The title of a region, with room for one control. | `title`, `eyebrow`, `description`, `action`, `level` `2 \| 3`, `id` |

## Navigation

| Component | Purpose | Key props |
|---|---|---|
| `SidebarItem` | One destination in the sidebar. | `href`, `label`, `icon`, `count`, `active` |
| `MobileNavItem` | One destination in the bottom bar, icon over label. | `href`, `label`, `icon`, `active` |
| `NavigationGroup` | A labelled set of destinations, wrapped as a real list. | `label`, `ariaLabel`, `orientation`, `as` `nav \| div` |

## Reading

| Component | Purpose | Key props |
|---|---|---|
| `BookCover` | A book at 2:3, carrying the only shadow in the system, with a deterministic fallback plate when there is no artwork. | `title`, `author`, `src`, `size` `sm \| md \| lg \| fluid`, `sizes`, `priority`, `decorative` |
| `BookCard` | The unit of the library, as a grid tile or a row. | `title`, `author`, `coverSrc`, `href`, `status`, `statusTone`, `progress`, `layout` `grid \| row`, `selected`, `headingLevel` |
| `ContinueReadingCard` | The most prominent card: what the reader came back to do. | `title`, `author`, `coverSrc`, `href`, `progress`, `eyebrow`, `actionLabel` |
| `ReadingProgress` | Progress with the reading meaning on it. | `page` + `pages`, or `percent`; `showLabel`, `label` |

## Content

| Component | Purpose | Key props |
|---|---|---|
| `ArticleCard` | A saved article, built from the same parts as `BookCard`. | `title`, `source`, `readingTime`, `excerpt`, `href`, `status`, `selected`, `headingLevel` |
| `CaptureCard` | A highlight you kept, with real quotation semantics. | `quote`, `sourceTitle`, `sourceType`, `sourceDetail`, `note`, `href`, `asButton`, `selected` |
| `SourceIcon` | One mapping from a source kind to its mark. | `type` `book \| article \| capture`, `label` |

## Feedback

| Component | Purpose | Key props |
|---|---|---|
| `Dialog` | A modal panel on the native `<dialog>` element. | `open`, `onClose`, `title` **(required)**, `description`, `footer`, `size` `sm \| md`, `dismissOnBackdrop`, `closeLabel` |
| `ConfirmationDialog` | Asking before something irreversible. | `open`, `onClose`, `onConfirm`, `title`, `description`, `confirmLabel`, `cancelLabel`, `confirming` |
| `Toast` · `ToastProvider` · `useToast` | A brief, factual acknowledgement. | provider: `duration`; `show({ title, description?, duration? })`, `dismiss(id)` |

## Icons

A closed set of line icons on one 20×20 grid at one stroke weight, in
`icons.tsx`, with no icon-library dependency: `SearchIcon` `CloseIcon`
`CheckIcon` `ChevronRightIcon` `PlusIcon` `BookIcon` `ArticleIcon`
`HighlightIcon` `BookmarkIcon` `HomeIcon` `QueueIcon` `SettingsIcon`
`InboxIcon`. They take `className` only; colour comes from `currentColor` and
every icon is `aria-hidden`.

---

## Frozen public API

Import from `@/components`. The barrel (`src/components/index.ts`) is the
contract. Everything listed above is exported; `cn`, `styles` and `field` are
not.

| Surface | Exports |
|---|---|
| Foundation | `Button` `IconButton` `Input` `Textarea` `SearchInput` `Label` `Badge` `Divider` `Thread` `ProgressBar` `Skeleton` `EmptyState` |
| Layout | `PageContainer` `ContentContainer` `ReadingContainer` `Card` `SectionHeading` |
| Navigation | `SidebarItem` `MobileNavItem` `NavigationGroup` |
| Reading | `BookCover` `BookCard` `ContinueReadingCard` `ReadingProgress` |
| Content | `ArticleCard` `CaptureCard` `SourceIcon` |
| Feedback | `Dialog` `ConfirmationDialog` `Toast` `ToastProvider` `useToast` |
| Icons | the thirteen icons above, plus `IconProps` |

Each component also exports its props type (`ButtonProps`, and so on). Variant
unions that are part of the contract (`ButtonVariant`, `BadgeTone`,
`BookCoverSize`, `SourceType`, …) are exported beside them. Adding a prop,
variant or export is a library change and requires the change-control steps in
[`ux-decisions.md`](./ux-decisions.md#status--the-design-foundation-is-frozen).

---

## Intentional exceptions at freeze

Recorded here so they are not silently absorbed into the next screen:

1. **Form controls are `text-base` (16px), not `text-sm` (14px).** iOS zooms
   the viewport when a focused field is smaller than 16px. This is a usability
   exception to the control size in the type scale, not a new token. See
   [`ux-decisions.md` §18](./ux-decisions.md#18-milestone-2--the-component-library).
2. **One arbitrary Tailwind variant** in `SearchInput` —
   `[&::-webkit-search-cancel-button]:appearance-none` — to hide the browser's
   native clear control so the field has a single clear affordance. Documented
   in [`design-system.md`](./design-system.md#consumption-rules).

Questions deliberately left open (shelf layout, Thread encoding, remote cover
hosts, a labelled icon specimen, enforcing Tailwind defaults out of the build)
live in
[`ux-decisions.md` §19](./ux-decisions.md#19-open-questions). None of them
change this API.

---

## Rules the library encodes

These are the decisions worth knowing before writing a screen. Each is
implemented, not merely documented.

### The Bookmark Thread appears in exactly five places

`SidebarItem` and `MobileNavItem` when active, `ProgressBar` (and so
`ReadingProgress`), `Card` when `selected`, and `Badge` with `tone="emphasis"`.
That is the whole list, and it matches the system's own list: active
navigation, reading progress, selected book, selected capture, important
emphasis. It is never an accent or a divider. Wherever it appears, the meaning
is also exposed properly — `aria-current`, or `role="progressbar"` — because
the thread is a visual mark and never the only statement of state.

### Hover washes controls, not cards

In dark mode `surface-hover` is the **lightest** surface in the system, and
`muted-foreground` measures 4.07:1 against it — below AA. So:

- Controls whose only text is `foreground` (`Button`, `IconButton`,
  `SidebarItem`, `MobileNavItem`) keep the `bg-surface-hover` wash;
  `foreground` measures 11.35:1 there.
- Secondary text inside a washed container brightens to `foreground` as the
  wash arrives (`SidebarItem`'s count, `MobileNavItem`'s label).
- `Card` — where metadata lives — does **not** wash. An interactive card firms
  its hairline to `border-strong` instead.

The measured failures are displayed, with their ratios, in the "Forbidden
pairings" table at `/dev/design-system`.

### Nothing is disabled by fading it

The system forbids reducing text with an opacity utility, so a disabled control
drops to `surface-sunken`, keeps a hairline so it stays delineated on any
background, and sets its label in `muted-foreground` (5.13:1 light, 5.37:1
dark).

### Loading states have no spinner

Reduced motion is honoured globally, which would freeze a spinner mid-turn.
`Button` with `loading` sets `aria-busy`, disables itself, and swaps its label
for `loadingLabel`. `Skeleton` is static for the same reason.

### There is no destructive colour

Deliberately: giving `action` a second meaning was a pre-freeze finding. An
invalid field is marked by `aria-invalid`, a stronger hairline and a message in
full `foreground`. A destructive confirmation carries its weight in the title,
the description and the verb on the button — `"Delete book"`, never `"OK"`.

### No entrance animation

Nothing rises, fades in or staggers. Dialogs and toasts are simply present.
Only a *change* animates — the thread extending, a colour on hover — and that
is suppressed under reduced motion, which costs the user nothing because
nothing here depends on motion to be understood.

### Touch targets are 44px

`md` is the default size for `Button` and `IconButton` (44px), nav rows are
44px, and the bottom bar is 56px. `sm` (36px) exists for pointer-dense
contexts that are never the primary path.

### Covers never contradict their metadata

`BookCover`'s fallback prints the real title and author it was given and
invents nothing. Every seed book in the v0 prototype was mis-attributed; in a
product whose promise is trustworthy personal data, that is the worst possible
first impression.

### Privacy is a component-level concern

`SourceIcon` draws its own marks rather than fetching a favicon, which would
tell a website what its reader is reading from that reader's own device.
`BookCover` does not enable remote image hosts until a metadata source is
actually chosen.

---

## Surface pairing rules

Text may not go on any surface. These pairings are below AA and must not be
used; the measured ratios are computed live at `/dev/design-system`.

| Never pair | Light | Dark | Use instead |
|---|---|---|---|
| `muted-foreground` on `surface-hover` | 4.83 | **4.07** | Brighten to `foreground` under a wash |
| `olive` on `surface-hover` | **4.17** | **4.07** | No status text on a hovered surface |
| `walnut` on `surface-hover` | 8.80 | **4.08** | Walnut is structure, not a control label |
| `olive` on `surface-sunken` | **4.43** | 5.37 | A `neutral` badge in wells and sidebars |

Consequences to remember: a `Badge` with `tone="status"` and a labelled
`ReadingProgress` must not be placed on `surface-sunken`. With
`showLabel={false}`, `ReadingProgress` is a non-text mark and any surface is
fine.

---

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Then open `/dev/design-system` and check that the contrast table shows no
failures in either mode, and that section 08 renders every component in both.
