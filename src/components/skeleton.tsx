import { cn } from "./cn";

/**
 * Skeleton — the shape of content that has not arrived yet.
 *
 * **Purpose.** Reading data is local, so waits are short; a skeleton exists to
 * hold the layout still for those few frames, not to entertain. It is
 * deliberately **static**. Reduced motion is honoured globally, which would
 * freeze a shimmer mid-sweep, and a pulsing gradient is the decorative effect
 * this system spends its restraint avoiding. A quiet block that does not move
 * is also simply more honest about the fact that nothing is happening yet.
 *
 * **Props.**
 * - `variant`:
 *   - `text` (default) — one or more type-height bars. `lines` sets how many;
 *     the last is shortened, the way a real paragraph ends.
 *   - `block` — a panel-shaped placeholder.
 *   - `cover` — a 2:3 book cover.
 * - `lines` — only meaningful for `text`.
 *
 * ```tsx
 * <div aria-busy>
 *   <Skeleton variant="cover" className="w-24" />
 *   <Skeleton lines={3} />
 * </div>
 * ```
 *
 * **Accessibility.** Skeletons are `aria-hidden`, so assistive technology is
 * never told to read placeholder shapes. Put `aria-busy` on the region that is
 * loading, and announce the result when it arrives; the skeleton itself should
 * be invisible to a screen reader.
 */
export type SkeletonProps = {
  variant?: "text" | "block" | "cover";
  lines?: number;
  className?: string;
};

export function Skeleton({
  variant = "text",
  lines = 1,
  className,
}: SkeletonProps) {
  if (variant === "text") {
    const count = Math.max(1, lines);
    return (
      <div aria-hidden className={cn("flex flex-col gap-2", className)}>
        {Array.from({ length: count }, (_, index) => (
          <span
            key={index}
            className={cn(
              "block h-4 rounded-sm bg-border",
              index === count - 1 && count > 1 ? "w-3/5" : "w-full",
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "border border-border bg-surface-hover",
        variant === "cover" ? "aspect-2/3 rounded-sm" : "h-24 rounded-md",
        className,
      )}
    />
  );
}
