import { cn } from "./cn";
import { transitionState } from "./styles";

/**
 * Thread — the Bookmark Thread. The signature motif of the product.
 *
 * **Purpose.** A thin terracotta ribbon that marks your place. It is the same
 * object doing the same job everywhere it appears, which is the only reason it
 * carries any meaning at all.
 *
 * **It may only be used for:** active navigation · reading progress · the
 * selected book · the selected capture · genuinely important emphasis. That is
 * the whole list. It is not an accent, not a divider, not a diagram fill, and
 * not a way to make a quiet screen livelier. If everything is marked, nothing
 * is. Within this library it appears in exactly five places: `SidebarItem`
 * and `MobileNavItem` when active, `ProgressBar`, `Card` when selected, and
 * `Badge` with `tone="emphasis"`.
 *
 * **Props.**
 * - `orientation` — `"vertical"` (default) is a 2px ribbon down the leading
 *   edge of an active item; `"horizontal"` is a 2px rule, used as progress.
 * - `extent` — `0`–`1`, how far the thread runs along its length. Animated
 *   with `--duration-state`, since the thread extending is a real state
 *   change. Omit it for a fixed-length mark.
 *
 * ```tsx
 * <Thread className="h-5" />
 * <Thread orientation="horizontal" extent={0.62} />
 * ```
 *
 * **Accessibility.** Always `aria-hidden`: the thread is a visual mark, and
 * anything it signifies must also be exposed properly — `aria-current` on an
 * active nav item, `role="progressbar"` on progress, `aria-current` on a
 * selection. The prototype's selected capture was a terracotta line and
 * nothing else, so for a screen reader it was not selected at all. `--thread`
 * clears 3:1 against every surface in both modes, which is the requirement for
 * a non-text mark.
 */
export type ThreadProps = {
  orientation?: "vertical" | "horizontal";
  extent?: number;
  className?: string;
};

export function Thread({
  orientation = "vertical",
  extent,
  className,
}: ThreadProps) {
  const clamped =
    extent === undefined ? undefined : Math.min(1, Math.max(0, extent));
  const percentage = clamped === undefined ? undefined : `${clamped * 100}%`;

  return (
    <span
      aria-hidden
      className={cn(
        "block rounded-sm bg-thread",
        orientation === "vertical" ? "w-0.5" : "h-0.5",
        extent !== undefined && transitionState,
        className,
      )}
      style={
        percentage === undefined
          ? undefined
          : orientation === "vertical"
            ? { height: percentage }
            : { width: percentage }
      }
    />
  );
}
