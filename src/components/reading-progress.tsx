import { cn } from "./cn";
import { ProgressBar } from "./progress-bar";

/**
 * ReadingProgress — how far into a book you are, in words and in thread.
 *
 * **Purpose.** `ProgressBar` draws the thread; this puts the reading meaning on
 * it. Page progress is optional in this product, so the component takes either a
 * page position or a bare percentage and phrases whichever it is given. It is
 * the one place that phrasing is decided, so "Page 214 of 344" reads the same on
 * a card, in the reader and on a book's own page.
 *
 * **Props.**
 * - `page` + `pages` — a page position. Preferred when known: readers think in
 *   pages, not percentages.
 * - `percent` — `0`–`100`, used when there is no page count.
 * - `showLabel` — `true` by default. Turn it off in tight layouts; the wording
 *   still reaches assistive technology through the bar's `aria-valuetext`.
 * - `label` — accessible name, default `"Reading progress"`. Worth setting when
 *   several bars share a screen.
 *
 * ```tsx
 * <ReadingProgress page={214} pages={344} />
 * <ReadingProgress percent={62} showLabel={false} />
 * ```
 *
 * **Accessibility.** The bar carries `role="progressbar"` with a real
 * `aria-valuetext`, so the position is announced as a sentence rather than as a
 * naked number. The written label uses tabular figures so digits do not shift as
 * the number grows, and olive — the token whose job is quiet status.
 *
 * **Surface limit.** Olive measures 4.43:1 on `surface-sunken` in light mode,
 * below AA, so do not place a labelled `ReadingProgress` in a well or sidebar.
 * With `showLabel={false}` the thread is a non-text mark and any surface is fine.
 */
export type ReadingProgressValue = {
  percent?: number;
  page?: number;
  pages?: number;
};

export type ReadingProgressProps = ReadingProgressValue & {
  showLabel?: boolean;
  label?: string;
  className?: string;
};

export function ReadingProgress({
  percent,
  page,
  pages,
  showLabel = true,
  label = "Reading progress",
  className,
}: ReadingProgressProps) {
  const byPage =
    typeof page === "number" && typeof pages === "number" && pages > 0;

  const value = byPage
    ? Math.min(pages, Math.max(0, page))
    : Math.min(100, Math.max(0, percent ?? 0));
  const max = byPage ? pages : 100;
  const valueText = byPage
    ? `Page ${value} of ${pages}`
    : `${Math.round(value)} percent`;
  const written = byPage ? `Page ${value} of ${pages}` : `${Math.round(value)}%`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <ProgressBar value={value} max={max} label={label} valueText={valueText} />
      {showLabel ? (
        <p className="text-2xs uppercase tracking-label tabular-nums text-olive">
          {written}
        </p>
      ) : null}
    </div>
  );
}
