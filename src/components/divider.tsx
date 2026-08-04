import { cn } from "./cn";

/**
 * Divider — a hairline between things.
 *
 * **Purpose.** The only rule-drawing component. It exists so that dividers are
 * never hand-rolled at the wrong opacity: hairlines in this system are drawn at
 * full strength, because a border faded to sixty percent is not a subtle
 * border, it is an uncertain one.
 *
 * **Props.**
 * - `orientation` — `"horizontal"` (default) or `"vertical"`. A vertical
 *   divider needs a parent that gives it height, usually a flex row with
 *   `items-stretch`.
 * - `tone` — `"default"` or `"strong"`. `strong` is for emphasis only: a table
 *   header, the rule under a page title.
 *
 * ```tsx
 * <Divider />
 * <Divider tone="strong" />
 * <div className="flex items-stretch gap-3"><span>A</span><Divider orientation="vertical" /><span>B</span></div>
 * ```
 *
 * **Accessibility.** Horizontal renders `<hr>`, which is already a separator.
 * Vertical renders an element with `role="separator"` and
 * `aria-orientation="vertical"`, because an `<hr>` turned on its side is a
 * thematic break that is not actually breaking a theme.
 */
export type DividerProps = {
  orientation?: "horizontal" | "vertical";
  tone?: "default" | "strong";
  className?: string;
};

export function Divider({
  orientation = "horizontal",
  tone = "default",
  className,
}: DividerProps) {
  const color = tone === "strong" ? "bg-border-strong" : "bg-border";

  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("w-px shrink-0 self-stretch", color, className)}
      />
    );
  }

  return <hr className={cn("h-px w-full border-0", color, className)} />;
}
