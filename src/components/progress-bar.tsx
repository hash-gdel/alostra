import { cn } from "./cn";
import { Thread } from "./thread";

/**
 * ProgressBar — how far through something you are.
 *
 * **Purpose.** The generic progress primitive: a hairline track with the
 * Bookmark Thread laid along it. Reading progress is the reason it exists, and
 * `ReadingProgress` composes it with the page or percentage wording, but the
 * bar itself knows nothing about books, so an import or an export can use it
 * too.
 *
 * It is two pixels tall on purpose. Progress in this product is a ribbon
 * marking a place in a book, not a loading bar in a dashboard.
 *
 * **Props.**
 * - `value`, `max` — `max` defaults to 100, so a bare percentage works.
 * - `label` — **required** accessible name, e.g. `"Reading progress"`.
 * - `valueText` — a human phrasing for assistive technology, e.g.
 *   `"Page 214 of 344"`. Without it a screen reader announces a bare
 *   percentage, which is not what the user is tracking.
 *
 * ```tsx
 * <ProgressBar value={62} label="Reading progress" />
 * <ProgressBar value={214} max={344} label="Reading progress" valueText="Page 214 of 344" />
 * ```
 *
 * **Accessibility.** `role="progressbar"` with `aria-valuenow`, `aria-valuemin`
 * and `aria-valuemax`, plus `aria-valuetext` when supplied. The thread inside
 * is decorative, so the meaning lives in the ARIA rather than in the colour.
 * Nothing here animates on arrival; only a *change* in value animates, over
 * `--duration-state`, and even that is suppressed under reduced motion.
 */
export type ProgressBarProps = {
  value: number;
  max?: number;
  label: string;
  valueText?: string;
  className?: string;
};

export function ProgressBar({
  value,
  max = 100,
  label,
  valueText,
  className,
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 1;
  const clamped = Math.min(safeMax, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={clamped}
      aria-valuetext={valueText}
      className={cn("h-0.5 w-full overflow-hidden rounded-sm bg-border", className)}
    >
      {/* The track and the thread are both 2px, so the thread needs no height
          of its own here — one height utility, no override to lose. */}
      <Thread orientation="horizontal" extent={clamped / safeMax} />
    </div>
  );
}
