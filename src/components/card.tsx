import Link from "next/link";
import { cn } from "./cn";
import { transitionQuick } from "./styles";

/**
 * Card — a raised panel, optionally something you can go to.
 *
 * **Purpose.** The one surface every item in the product sits on: books,
 * articles, captures, settings groups, dialogs' inner panels. `BookCard`,
 * `ArticleCard`, `CaptureCard` and `ContinueReadingCard` are all compositions
 * of this, so the corner radius, hairline and hover behaviour are defined once.
 *
 * **Props.**
 * - `href` — renders a `next/link` anchor, and the whole card becomes the
 *   target.
 * - `asButton` — renders a button, for in-page selection rather than
 *   navigation. `href` wins if both are given.
 * - `as` — element for a non-interactive card: `"div"` (default), `"article"`,
 *   `"section"` or `"li"`.
 * - `padding` — `"md"` (default), `"sm"` for a tile in a grid, `"lg"` for a card
 *   that is the main content of a screen, `"none"` when a cover or image runs to
 *   the edge.
 * - `selected` — the Bookmark Thread takes over the hairline, and
 *   `aria-current` is set. For "this is the one you are on", not for hover.
 *
 * ```tsx
 * <Card href="/books/1" padding="none">…</Card>
 * <Card asButton onClick={select} selected={isSelected}>…</Card>
 * <Card as="article" padding="lg">…</Card>
 * ```
 *
 * **Accessibility.** An interactive card is a real `<a>` or `<button>`, never a
 * div with a click handler, so it is focusable, keyboard-activatable and
 * announced with the right role. A card that navigates must not contain another
 * link or button — nested interactive elements are unreachable by keyboard;
 * `ContinueReadingCard` is laid out around this rule rather than against it.
 *
 * **Why hover does not wash the surface.** The obvious hover treatment,
 * `bg-surface-hover`, cannot be used here. In dark mode `surface-hover` is the
 * lightest surface in the system, and `muted-foreground` measures 4.07:1
 * against it — an AA failure, and cards are exactly where metadata lives. So an
 * interactive card firms its hairline to `border-strong` instead. Controls whose
 * only text is `foreground` (buttons, nav items) keep the wash, because
 * `foreground` measures 11.35:1 there.
 */
export type CardProps = Omit<React.HTMLAttributes<HTMLElement>, "className"> & {
  href?: string;
  target?: string;
  rel?: string;
  asButton?: boolean;
  as?: "div" | "article" | "section" | "li";
  padding?: "none" | "sm" | "md" | "lg";
  selected?: boolean;
  className?: string;
  children: React.ReactNode;
};

const cardPadding = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-5 md:p-8",
} as const;

export function Card({
  href,
  target,
  rel,
  asButton = false,
  as: Tag = "div",
  padding = "md",
  selected = false,
  className,
  children,
  ...rest
}: CardProps) {
  const interactive = href !== undefined || asButton;

  const classes = cn(
    "rounded-lg border bg-surface",
    selected ? "border-thread" : "border-border",
    cardPadding[padding],
    interactive && cn("block w-full text-left", transitionQuick),
    interactive && !selected && "hover:border-border-strong",
    className,
  );

  const current = selected ? "true" : undefined;

  if (href !== undefined) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        aria-current={current}
        className={classes}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  if (asButton) {
    return (
      <button
        type="button"
        aria-current={current}
        className={classes}
        {...rest}
      >
        {children}
      </button>
    );
  }

  return (
    <Tag aria-current={current} className={classes} {...rest}>
      {children}
    </Tag>
  );
}
