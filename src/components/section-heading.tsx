import { cn } from "./cn";
import { Label } from "./label";

/**
 * SectionHeading — the title of a region, with room for one control.
 *
 * **Purpose.** Every shelf, group and block on a screen is introduced the same
 * way: an optional eyebrow, a serif title, an optional sentence, and at most
 * one action on the right ("See all", "Add"). Headings are content, so they are
 * set in Fraunces — the interface is not serif, but the things worth reading
 * are, and the name of a shelf belongs to the reader, not to the machinery.
 *
 * **Props.**
 * - `title` — required.
 * - `eyebrow` — the small-caps kicker above it, e.g. `"Continue reading"`.
 * - `description` — one sentence, held to the reading measure.
 * - `action` — a single control. Two would make the heading a toolbar.
 * - `level` — `2` (default, `text-xl`) or `3` (`text-lg`) for a subsection.
 * - `id` — put one here when a region uses `aria-labelledby`.
 *
 * ```tsx
 * <SectionHeading
 *   eyebrow="Your library"
 *   title="Recently added"
 *   description="The last books and articles you saved."
 *   action={<Button variant="ghost" size="sm" href="/library">See all</Button>}
 * />
 * ```
 *
 * **Accessibility.** Renders a real `<h2>` or `<h3>`, so the page has a
 * navigable outline for screen-reader users who move by heading. Choose `level`
 * to match the document structure rather than to get a size — the two sizes
 * exist because a subsection is smaller, not as a styling escape hatch. The
 * eyebrow is a `<span>`, not a heading, so it does not add a phantom level.
 */
export type SectionHeadingProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  action?: React.ReactNode;
  level?: 2 | 3;
  id?: string;
  className?: string;
};

export function SectionHeading({
  title,
  eyebrow,
  description,
  action,
  level = 2,
  id,
  className,
}: SectionHeadingProps) {
  const Heading = level === 3 ? "h3" : "h2";

  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <Label as="span" variant="eyebrow" className="block">
            {eyebrow}
          </Label>
        ) : null}
        <Heading
          id={id}
          className={cn(
            "font-serif tracking-display text-balance",
            level === 3 ? "text-lg" : "text-xl",
            eyebrow && "mt-1.5",
          )}
        >
          {title}
        </Heading>
        {description ? (
          <p className="mt-1.5 max-w-reading text-sm text-muted-foreground text-pretty">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
