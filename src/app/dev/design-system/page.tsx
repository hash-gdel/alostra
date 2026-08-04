import type { Metadata } from "next";
import { Button } from "@/components";
import { ComponentCatalogue } from "./_catalogue";
import { ModeFrame, Section } from "./_ui";
import {
  contrast,
  formatOklch,
  palette,
  resolve,
  type Mode,
  type Oklch,
} from "./_lib/color";

export const metadata: Metadata = {
  title: "Design foundation — Alostra",
  robots: { index: false, follow: false },
};

/* ---------------------------------------------------------------- data --- */

const COLOR_GROUPS: { group: string; tokens: [string, string][] }[] = [
  {
    group: "Surfaces",
    tokens: [
      ["canvas", "The page ground"],
      ["surface", "Cards and raised panels"],
      ["surface-sunken", "Sidebar and wells"],
      ["surface-hover", "Quiet hover wash"],
      ["paper", "Reading surface only"],
    ],
  },
  {
    group: "Text",
    tokens: [
      ["foreground", "Primary text"],
      ["muted-foreground", "Metadata and secondary text"],
    ],
  },
  {
    group: "Structure",
    tokens: [
      ["border", "Hairline, always full opacity"],
      ["border-strong", "Emphasis rules"],
    ],
  },
  {
    group: "Action",
    tokens: [
      ["action", "The only text-bearing fill"],
      ["action-hover", "Action, hovered"],
      ["action-foreground", "Label on action"],
    ],
  },
  {
    group: "Motif",
    tokens: [["thread", "The Bookmark Thread. Reserved."]],
  },
  {
    group: "Materials",
    tokens: [
      ["olive", "Quiet status text"],
      ["walnut", "Structural and display"],
    ],
  },
];

type Role = "text" | "ui" | "structure";

const ROLE_MINIMUM: Record<Role, number | null> = {
  text: 4.5,
  ui: 3,
  structure: null,
};

const CONTRAST_PAIRS: { fg: string; bg: string; role: Role }[] = [
  { fg: "foreground", bg: "canvas", role: "text" },
  { fg: "foreground", bg: "surface", role: "text" },
  { fg: "muted-foreground", bg: "canvas", role: "text" },
  { fg: "muted-foreground", bg: "surface", role: "text" },
  { fg: "action-foreground", bg: "action", role: "text" },
  { fg: "action-foreground", bg: "action-hover", role: "text" },
  { fg: "olive", bg: "canvas", role: "text" },
  { fg: "olive", bg: "surface", role: "text" },
  { fg: "walnut", bg: "canvas", role: "text" },
  { fg: "walnut", bg: "surface", role: "text" },
  { fg: "thread", bg: "canvas", role: "ui" },
  { fg: "thread", bg: "surface", role: "ui" },
  { fg: "border", bg: "canvas", role: "structure" },
  { fg: "border-strong", bg: "canvas", role: "structure" },
  // Added with the component library (Milestone 2). Components put text on
  // three more surfaces than the foundation ever did: the sunken well behind a
  // sidebar and a cover plate, the hover wash under a control, and paper.
  { fg: "foreground", bg: "surface-sunken", role: "text" },
  { fg: "muted-foreground", bg: "surface-sunken", role: "text" },
  { fg: "walnut", bg: "surface-sunken", role: "text" },
  { fg: "foreground", bg: "surface-hover", role: "text" },
  { fg: "foreground", bg: "paper", role: "text" },
  { fg: "muted-foreground", bg: "paper", role: "text" },
  { fg: "thread", bg: "surface-sunken", role: "ui" },
  { fg: "thread", bg: "surface-hover", role: "ui" },
  { fg: "thread", bg: "paper", role: "ui" },
];

/**
 * Pairings that measure below AA and are therefore forbidden.
 *
 * These are computed and displayed for the same reason the passing table is:
 * a rule with the number next to it is a rule people believe. Every one of
 * them was a plausible component decision — muted metadata on a hovered card,
 * an olive status badge in a sidebar — and the ratio is why the library does
 * something else instead.
 */
const FORBIDDEN_PAIRS: { fg: string; bg: string; instead: string }[] = [
  {
    fg: "muted-foreground",
    bg: "surface-hover",
    instead: "Metadata under a hover wash brightens to foreground.",
  },
  {
    fg: "olive",
    bg: "surface-hover",
    instead: "No status text on a hovered surface.",
  },
  {
    fg: "walnut",
    bg: "surface-hover",
    instead: "Walnut is structure, not a label on a control.",
  },
  {
    fg: "olive",
    bg: "surface-sunken",
    instead: "Use a neutral badge in wells and sidebars.",
  },
];

const TYPE_STEPS: {
  token: string;
  size: string;
  family: "serif" | "sans";
  use: string;
  className: string;
}[] = [
  { token: "text-3xl", size: "36px", family: "serif", use: "Page titles", className: "text-3xl" },
  { token: "text-2xl", size: "28px", family: "serif", use: "Book and article titles", className: "text-2xl" },
  { token: "text-xl", size: "22px", family: "serif", use: "Section headings", className: "text-xl" },
  { token: "text-lg", size: "18px", family: "serif", use: "Lead paragraphs, quotations", className: "text-lg" },
  { token: "text-base", size: "16px", family: "sans", use: "Default body", className: "text-base" },
  { token: "text-sm", size: "14px", family: "sans", use: "Secondary body, controls", className: "text-sm" },
  { token: "text-xs", size: "12px", family: "sans", use: "Metadata, counts", className: "text-xs" },
  { token: "text-2xs", size: "11px", family: "sans", use: "Micro labels, eyebrows", className: "text-2xs" },
];

const SPACING_STEPS: { token: string; size: string; use: string; className: string }[] = [
  { token: "gutter", size: "24px", use: "Page gutter, small screens", className: "w-gutter" },
  { token: "gutter-lg", size: "40px", use: "Page gutter, large screens", className: "w-gutter-lg" },
  { token: "block", size: "32px", use: "Between blocks in a section", className: "w-block" },
  { token: "section", size: "64px", use: "Between sections", className: "w-section" },
  { token: "section-lg", size: "80px", use: "Between sections, large screens", className: "w-section-lg" },
];

const CONTAINERS: { token: string; size: string; use: string; className: string }[] = [
  { token: "max-w-reading", size: "608px", use: "The reader and prose. About 66 characters.", className: "max-w-reading" },
  { token: "max-w-content", size: "768px", use: "A single column of mixed content.", className: "max-w-content" },
  { token: "max-w-library", size: "1200px", use: "Browsing grids and shelves.", className: "max-w-library" },
];

const RADII: { token: string; size: string; use: string; className: string }[] = [
  { token: "rounded-sm", size: "4px", use: "Tags, small controls", className: "rounded-sm" },
  { token: "rounded-md", size: "8px", use: "Buttons, inputs, nav items", className: "rounded-md" },
  { token: "rounded-lg", size: "14px", use: "Cards, panels, sheets", className: "rounded-lg" },
];

/* ---------------------------------------------------------- primitives --- */

function Swatch({
  token,
  note,
  value,
}: {
  token: string;
  note: string;
  value: Oklch | undefined;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="mt-0.5 size-11 shrink-0 rounded-md border border-border"
        style={{ backgroundColor: `var(--${token})` }}
      />
      <div className="min-w-0">
        <p className="text-sm font-medium">{token}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>
        <p className="mt-1 text-2xs tabular-nums text-muted-foreground">
          {value ? `${resolve(value).hex} · ${formatOklch(value)}` : "—"}
        </p>
      </div>
    </div>
  );
}

function ContrastTable({ tokens }: { tokens: Record<string, Oklch> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-80 border-collapse text-left">
        <thead>
          <tr className="border-b border-border-strong">
            <th className="py-2 pr-4 text-2xs font-medium uppercase tracking-label text-muted-foreground">
              Pair
            </th>
            <th className="py-2 pr-4 text-2xs font-medium uppercase tracking-label text-muted-foreground">
              Role
            </th>
            <th className="py-2 pr-4 text-2xs font-medium uppercase tracking-label text-muted-foreground">
              Ratio
            </th>
            <th className="py-2 text-2xs font-medium uppercase tracking-label text-muted-foreground">
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          {CONTRAST_PAIRS.map(({ fg, bg, role }) => {
            const a = tokens[fg];
            const b = tokens[bg];
            const ratio = a && b ? contrast(a, b) : null;
            const minimum = ROLE_MINIMUM[role];
            const passes = ratio !== null && (minimum === null || ratio >= minimum);
            return (
              <tr key={`${fg}-${bg}`} className="border-b border-border">
                <td className="py-2.5 pr-4 text-sm">
                  {fg} <span className="text-muted-foreground">on</span> {bg}
                </td>
                <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                  {role === "text"
                    ? "Text · AA 4.5"
                    : role === "ui"
                      ? "UI mark · 3.0"
                      : "Hairline"}
                </td>
                <td className="py-2.5 pr-4 text-sm tabular-nums">
                  {ratio ? ratio.toFixed(2) : "—"}
                </td>
                <td className="py-2.5 text-sm">
                  {minimum === null ? (
                    <span className="text-muted-foreground">Not applicable</span>
                  ) : passes ? (
                    <span className="text-olive">Passes</span>
                  ) : (
                    // Deliberately not terracotta: the system has no
                    // destructive colour, and action must not acquire a
                    // second meaning.
                    <span className="font-medium underline">Fails</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** The pairings components must not use, with the measurement that says so. */
function ForbiddenTable({ tokens }: { tokens: Record<string, Oklch> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-80 border-collapse text-left">
        <thead>
          <tr className="border-b border-border-strong">
            <th className="py-2 pr-4 text-2xs font-medium uppercase tracking-label text-muted-foreground">
              Never pair
            </th>
            <th className="py-2 pr-4 text-2xs font-medium uppercase tracking-label text-muted-foreground">
              Ratio
            </th>
            <th className="py-2 text-2xs font-medium uppercase tracking-label text-muted-foreground">
              What the library does
            </th>
          </tr>
        </thead>
        <tbody>
          {FORBIDDEN_PAIRS.map(({ fg, bg, instead }) => {
            const a = tokens[fg];
            const b = tokens[bg];
            const ratio = a && b ? contrast(a, b) : null;
            const passes = ratio !== null && ratio >= 4.5;
            return (
              <tr key={`${fg}-${bg}`} className="border-b border-border">
                <td className="py-2.5 pr-4 text-sm">
                  {fg} <span className="text-muted-foreground">on</span> {bg}
                </td>
                <td className="py-2.5 pr-4 text-sm tabular-nums">
                  {ratio ? ratio.toFixed(2) : "—"}
                  {passes ? (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (passes in this mode)
                    </span>
                  ) : null}
                </td>
                <td className="py-2.5 text-xs text-muted-foreground text-pretty">
                  {instead}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Real text at real sizes on both surfaces, alongside the numbers. */
function ReadabilityDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(["canvas", "surface"] as const).map((surface) => (
        <div
          key={surface}
          className="rounded-lg border border-border p-5"
          style={{ backgroundColor: `var(--${surface})` }}
        >
          <p className="text-2xs font-medium uppercase tracking-label text-muted-foreground">
            On {surface}
          </p>
          <p className="mt-3 font-serif text-2xl tracking-display">
            The History of Reading
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Alberto Manguel</p>
          <p className="mt-3 text-2xs uppercase tracking-label text-olive">
            Page 214 of 344
          </p>
          <p className="mt-4 text-base text-pretty">
            Body text at sixteen pixels, set in Geist. This is the size most
            interface copy will use outside the reader.
          </p>
          <p className="mt-3 text-sm text-muted-foreground text-pretty">
            Muted text at fourteen pixels, for metadata and supporting detail.
          </p>
          <div className="mt-5">
            <span className="inline-flex h-9 items-center rounded-md bg-action px-4 text-sm font-medium text-action-foreground">
              Continue reading
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ColorPanel({ mode }: { mode: Mode }) {
  const tokens = palette()[mode];
  return (
    <div
      className={`${mode === "dark" ? "dark " : ""}rounded-lg border border-border bg-canvas p-5 text-foreground md:p-8`}
    >
      <p className="text-2xs font-medium uppercase tracking-label text-muted-foreground">
        {mode === "light" ? "Light — shipping" : "Dark — architecture only"}
      </p>
      <p className="mt-2 max-w-reading text-sm text-muted-foreground text-pretty">
        {mode === "light"
          ? "Daylight on cream paper. Surfaces step lighter as they lift, so the worst case for text is the canvas."
          : "A lamp-lit reading room. Surfaces also step lighter as they lift, which inverts the maths: here the worst case for text is the raised surface, not the canvas. Every dark text value is solved against it."}
      </p>

      <div className="mt-7 space-y-7">
        {COLOR_GROUPS.map(({ group, tokens: entries }) => (
          <div key={group}>
            <h3 className="text-2xs font-medium uppercase tracking-label text-muted-foreground">
              {group}
            </h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map(([token, note]) => (
                <Swatch
                  key={token}
                  token={token}
                  note={note}
                  value={tokens[token]}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-9">
        <h3 className="text-2xs font-medium uppercase tracking-label text-muted-foreground">
          Measured contrast
        </h3>
        <p className="mt-2 max-w-reading text-sm text-muted-foreground text-pretty">
          Computed at build time from the OKLCH values in globals.css, not
          transcribed. If a token changes, these numbers change with it.
        </p>
        <div className="mt-4">
          <ContrastTable tokens={tokens} />
        </div>
      </div>

      <div className="mt-9">
        <h3 className="text-2xs font-medium uppercase tracking-label text-muted-foreground">
          Forbidden pairings
        </h3>
        <p className="mt-2 max-w-reading text-sm text-muted-foreground text-pretty">
          Building the components turned up a trap. Surfaces step lighter as
          they lift, so in dark mode the hover wash — not the raised surface —
          is the lightest thing in the room, and the three quiet text tokens
          all fall below AA on it. Each of these was a plausible component
          decision; the number beside it is why the library does something
          else.
        </p>
        <div className="mt-4">
          <ForbiddenTable tokens={tokens} />
        </div>
      </div>

      <div className="mt-9">
        <h3 className="text-2xs font-medium uppercase tracking-label text-muted-foreground">
          Readability
        </h3>
        <div className="mt-4">
          <ReadabilityDemo />
        </div>
      </div>

      <div className="mt-9">
        <h3 className="text-2xs font-medium uppercase tracking-label text-muted-foreground">
          Materials in use
        </h3>
        <p className="mt-2 max-w-reading text-sm text-muted-foreground text-pretty">
          A token that is only ever a swatch is not part of the system. Walnut
          and the sunken surface are shown doing the jobs they exist for.
        </p>
        <div className="mt-4 rounded-lg bg-surface-sunken p-5">
          <p className="text-2xs font-medium uppercase tracking-label text-walnut">
            surface-sunken · a well
          </p>
          <p className="mt-3 font-serif text-lg text-walnut">
            Walnut sets structure and quiet display type
          </p>
          <div aria-hidden className="mt-3 h-px w-full bg-walnut" />
          <p className="mt-3 text-xs text-muted-foreground">
            The rule above is the shelf baseline the library grid will stand on.
          </p>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- page --- */

export default function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-library px-gutter pb-section-lg pt-block md:px-gutter-lg">
      <header className="border-b border-border pb-block">
        <div className="flex items-center gap-3">
          <span aria-hidden className="flex h-8 items-center gap-1.5">
            <span className="h-5 w-1.5 rounded-sm bg-foreground" />
            <span className="h-7 w-0.5 rounded-sm bg-thread" />
          </span>
          <span className="text-2xs font-medium uppercase tracking-label text-muted-foreground">
            Alostra · Internal reference
          </span>
        </div>
        <h1 className="mt-5 font-serif text-3xl tracking-display text-balance">
          Design foundation
        </h1>
        <p className="mt-3 max-w-reading text-base text-muted-foreground text-pretty">
          Every colour, size, space, shape and duration the application is
          allowed to use, and in section 08 every component built from them.
          Screens should reach for a component here, and components for a
          token, rather than either inventing a value.
        </p>
        <p className="mt-4 text-sm text-muted-foreground text-pretty">
          This route is not linked from the application and is excluded from
          search indexing.
        </p>
      </header>

      <Section
        index="01"
        title="Colour"
        lede="Authored in OKLCH so lightness can be re-mapped for dark mode without hue drift. Terracotta is split in two: an action colour dark enough to carry a label, and the Bookmark Thread, tuned for presence as a two-pixel mark."
      >
        <div className="space-y-6">
          <ColorPanel mode="light" />
          <ColorPanel mode="dark" />
        </div>
      </Section>

      <Section
        index="02"
        title="Typography"
        lede="Fraunces sets the content: headings, titles, reading, quotations. Geist sets the machinery around it: navigation, controls, labels, metadata. The interface is not serif; the things worth reading are."
      >
        <div className="divide-y divide-border border-y border-border">
          {TYPE_STEPS.map((step) => (
            <div
              key={step.token}
              className="flex flex-col gap-3 py-5 md:flex-row md:items-baseline md:gap-8"
            >
              <div className="w-44 shrink-0">
                <p className="text-sm font-medium">{step.token}</p>
                <p className="mt-0.5 text-2xs tabular-nums text-muted-foreground">
                  {step.size} · {step.family === "serif" ? "Fraunces" : "Geist"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{step.use}</p>
              </div>
              <p
                className={`min-w-0 ${step.className} ${
                  step.family === "serif"
                    ? "font-serif tracking-display"
                    : "font-sans"
                }`}
              >
                A room with a chair, a lamp and enough shelves
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-border bg-paper p-5 md:p-8">
          <p className="text-2xs font-medium uppercase tracking-label text-muted-foreground">
            text-reading · 19px · Fraunces · max-w-reading
          </p>
          <div className="mt-4 max-w-reading font-serif text-reading text-pretty">
            <p>
              The reading size and measure are deliberately separate from the
              interface scale. Nineteen pixels of Fraunces across roughly
              sixty-six characters, set on the paper surface, is the one place
              in the product where type is tuned for sustained reading rather
              than for scanning. Everything else on the screen gives way to it.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-2xs font-medium uppercase tracking-label text-muted-foreground">
            Tracking
          </h3>
          <div className="mt-4 space-y-3">
            <p className="font-serif text-2xl tracking-display">
              tracking-display · −0.018em · headings and titles
            </p>
            <p className="text-base tracking-body">
              tracking-body · 0em · everything set as running text
            </p>
            <p className="text-2xs uppercase tracking-label text-muted-foreground">
              tracking-label · 0.14em · the one small-caps treatment
            </p>
          </div>
        </div>
      </Section>

      <Section
        index="03"
        title="Space"
        lede="A four-pixel base gives the full numeric ramp. Above it sit five named rhythm tokens, used whenever a value expresses page rhythm rather than local padding, so the rhythm can be retuned in one place."
      >
        <div className="divide-y divide-border border-y border-border">
          {SPACING_STEPS.map((step) => (
            <div key={step.token} className="flex items-center gap-6 py-3.5">
              <div className="w-36 shrink-0">
                <p className="text-sm font-medium">{step.token}</p>
                <p className="mt-0.5 text-2xs tabular-nums text-muted-foreground">
                  {step.size}
                </p>
              </div>
              {/* Walnut, not terracotta: these are measurement rules, and the
                  thread is reserved for marking your place. */}
              <div className={`${step.className} h-4 rounded-sm bg-walnut`} />
              <p className="hidden text-xs text-muted-foreground sm:block">
                {step.use}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        index="04"
        title="Measure"
        lede="Three widths, because reading and browsing are different activities and must not share a container. A library that can never be wider than a paragraph will feel cramped the moment it fills up."
      >
        <div className="space-y-4">
          {CONTAINERS.map((container) => (
            <div key={container.token}>
              <div className="flex items-baseline gap-3">
                <p className="text-sm font-medium">{container.token}</p>
                <p className="text-2xs tabular-nums text-muted-foreground">
                  {container.size}
                </p>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {container.use}
              </p>
              <div
                className={`${container.className} mt-2 h-2 rounded-sm bg-border-strong`}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section
        index="05"
        title="Shape and structure"
        lede="Three radii, and no pill. Hairlines are drawn at full opacity — a border faded to sixty percent is not a subtle border, it is an uncertain one."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {RADII.map((radius) => (
            <div key={radius.token}>
              <div
                className={`${radius.className} h-20 border border-border bg-surface`}
              />
              <p className="mt-2 text-sm font-medium">{radius.token}</p>
              <p className="text-2xs tabular-nums text-muted-foreground">
                {radius.size}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{radius.use}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-5">
            <p className="text-sm font-medium">border</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              The default hairline. Panels, dividers, inputs.
            </p>
            <div className="mt-4 space-y-3">
              <div className="h-px bg-border" />
              <div className="h-px bg-border" />
            </div>
          </div>
          <div className="rounded-lg border border-border-strong p-5">
            <p className="text-sm font-medium">border-strong</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Emphasis only. Table headers, section rules.
            </p>
            <div className="mt-4 space-y-3">
              <div className="h-px bg-border-strong" />
              <div className="h-px bg-border-strong" />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-2xs font-medium uppercase tracking-label text-muted-foreground">
            Depth
          </h3>
          <p className="mt-2 max-w-reading text-sm text-muted-foreground text-pretty">
            Two places, and no others, where the flat page acquires a third
            dimension. Both are mixed down from materials already in the
            palette, so neither adds a hue. The cover shadow is the one the
            system always said it would add when covers were built, and it is
            still the only shadow in it; the scrim exists because a dialog
            cannot be modal without dimming the page, and shadows are not
            available to lift it instead.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-5">
              <p className="text-sm font-medium">shadow-cover</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Book covers only. A cover is a real object with weight.
              </p>
              <div className="mt-4 h-16 w-11 rounded-sm border border-border bg-surface-sunken shadow-cover" />
            </div>
            <div className="rounded-lg border border-border p-5">
              <p className="text-sm font-medium">scrim</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                The modal ground, behind a dialog and nothing else.
              </p>
              <div className="mt-4 h-16 rounded-md bg-scrim" />
            </div>
          </div>
        </div>
      </Section>

      <Section
        index="06"
        title="Motion"
        lede="Three durations and two curves. Nothing rises, fades in or staggers on page load — the interface should feel settled on arrival, the way furniture in a room does not animate into place. Hover the panels below."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="group rounded-lg border border-border bg-surface p-5 transition-colors duration-(--duration-quick) ease-standard hover:bg-surface-hover">
            <p className="text-sm font-medium">duration-quick</p>
            <p className="text-2xs tabular-nums text-muted-foreground">
              120ms · ease-standard
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Hover, colour, opacity. Below the threshold of attention.
            </p>
          </div>

          <div className="group rounded-lg border border-border bg-surface p-5">
            <p className="text-sm font-medium">duration-state</p>
            <p className="text-2xs tabular-nums text-muted-foreground">
              200ms · ease-standard
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              A real state change. The thread extending.
            </p>
            <div className="mt-4 flex h-6 items-center">
              <span
                aria-hidden
                className="h-0.5 w-6 rounded-sm bg-thread transition-all duration-(--duration-state) ease-standard group-hover:w-full"
              />
            </div>
          </div>

          <div className="group rounded-lg border border-border bg-surface p-5">
            <p className="text-sm font-medium">duration-enter</p>
            <p className="text-2xs tabular-nums text-muted-foreground">
              320ms · ease-accent
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              An element genuinely arriving. The accent curve overshoots
              slightly and is reserved for acknowledging a capture.
            </p>
            <div className="mt-4 flex h-6 items-center">
              {/* A capture being marked — the one moment the accent curve
                  is for, so the thread is the correct object here. */}
              <span
                aria-hidden
                className="h-5 w-0.5 rounded-sm bg-thread transition-transform duration-(--duration-enter) ease-accent group-hover:scale-y-150"
              />
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground text-pretty">
          All motion is suppressed under prefers-reduced-motion. Nothing in the
          system depends on animation to become usable or to communicate state,
          so honouring the preference costs the user nothing.
        </p>
      </Section>

      <Section
        index="07"
        title="Focus and selection"
        lede="One focus treatment everywhere: the thread, drawn outside the element so it never shifts layout and stays visible on any surface in either mode. Selection reads as a highlighter laid over the text."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-5">
            <p className="text-2xs font-medium uppercase tracking-label text-muted-foreground">
              Focus visible
            </p>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              Tab into these to see the ring. It appears for keyboard
              navigation only.
            </p>
            {/* The real components, now that they exist. A page documenting
                the system should not be hand-rolling controls beside it. */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button size="sm">Action</Button>
              <Button size="sm" variant="quiet">
                Quiet
              </Button>
              <a
                href="#top"
                className="text-sm text-muted-foreground underline underline-offset-4 transition-colors duration-(--duration-quick) ease-standard hover:text-foreground"
              >
                A link
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-5">
            <p className="text-2xs font-medium uppercase tracking-label text-muted-foreground">
              Selection
            </p>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              Select the sentence below.
            </p>
            <p className="mt-4 font-serif text-lg text-pretty">
              Selection is tinted with the thread at twenty-two percent, so
              highlighting text uses the same gesture the product is built
              around.
            </p>
          </div>
        </div>
      </Section>

      <Section
        index="08"
        title="Components"
        lede="The reusable library, and nothing above it. Every component appears here in both modes, built only from the tokens above. Hover, active and focus are live rather than pictured — they are real CSS states, and a screenshot of a hover state is the kind of documentation that goes stale silently. Hover the exhibits and tab through them."
      >
        <div id="components" className="space-y-6">
          <ModeFrame mode="light">
            <ComponentCatalogue mode="light" />
          </ModeFrame>
          <ModeFrame mode="dark">
            <ComponentCatalogue mode="dark" />
          </ModeFrame>
        </div>
      </Section>

      <footer className="mt-section-lg border-t border-border pt-block">
        <p className="text-sm text-muted-foreground text-pretty">
          Milestone 1 is frozen: colour, typography, space, measure, shape and
          motion. Milestone 2 is frozen: the component library in section 08 —
          thirty reusable primitives and two depth tokens. No pages, no data
          layer, no application functionality. The next milestone begins only
          on explicit approval.
        </p>
      </footer>
    </div>
  );
}
