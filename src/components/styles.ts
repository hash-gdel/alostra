/**
 * Class fragments shared by more than one component.
 *
 * These exist so a rule lives in one place, not to build a styling framework.
 * Anything used by a single component stays in that component's file.
 *
 * Every fragment is a literal string so Tailwind's scanner still sees the
 * class names.
 */

/** Hover, colour and opacity. Below the threshold of attention. */
export const transitionQuick =
  "transition-colors duration-(--duration-quick) ease-standard";

/** A real state change: the thread extending, a panel opening. */
export const transitionState =
  "transition-all duration-(--duration-state) ease-standard";

/**
 * The one disabled treatment.
 *
 * The system forbids fading text with an opacity utility, so a disabled
 * control is not a dimmed copy of itself: it drops to the sunken surface,
 * keeps a hairline so it is still delineated on any background, and sets its
 * label in `muted-foreground` — 5.13:1 light, 5.37:1 dark on that surface.
 */
export const controlDisabled =
  "disabled:cursor-not-allowed disabled:border disabled:border-border disabled:bg-surface-sunken disabled:text-muted-foreground";

/**
 * Metadata inside a container that washes to `surface-hover`.
 *
 * In dark mode `surface-hover` is the lightest surface in the system, and
 * `muted-foreground` measures only 4.07:1 against it — an AA failure. Any
 * secondary text under a hover wash therefore brightens to `foreground`
 * (11.35:1) as the wash arrives, rather than staying muted.
 */
export const mutedUnderWash =
  "text-muted-foreground group-hover:text-foreground";
