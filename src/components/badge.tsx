import { cn } from "./cn";

/**
 * Badge — a short, static piece of state.
 *
 * **Purpose.** Reading status on a book, a source kind on a card, a count on a
 * shelf. A badge is never interactive: if it can be clicked it is a control,
 * not a badge. It is set in the system's one small-caps treatment so a row of
 * badges reads as metadata rather than as a row of little buttons.
 *
 * **Props.**
 * - `tone`:
 *   - `neutral` (default) — a hairline and muted text. The normal case.
 *   - `status` — olive text for quiet status, olive's actual job.
 *   - `emphasis` — the Bookmark Thread as the hairline, with the label left in
 *     `foreground`. This is the one badge that draws the eye, and it is
 *     reserved for the thread's meaning: *this is where you are*. A currently
 *     reading book, not a promotion.
 * - `icon` — an optional leading icon.
 *
 * ```tsx
 * <Badge>Want to read</Badge>
 * <Badge tone="status">Finished</Badge>
 * <Badge tone="emphasis">Reading</Badge>
 * ```
 *
 * **Accessibility.** A badge is text, so it is readable by default and needs no
 * ARIA. Do not let it be the *only* carrier of state — a "Reading" badge is a
 * label on a card whose progress is also written out, not a colour-coded dot.
 *
 * **Surface limit.** `status` must not be placed on `surface-sunken`: olive
 * measures 4.43:1 there in light mode, below AA. Use `neutral` in wells and
 * sidebars.
 */
export type BadgeTone = "neutral" | "status" | "emphasis";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "border-border text-muted-foreground",
  status: "border-border text-olive",
  emphasis: "border-thread text-foreground",
};

export type BadgeProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "className"> & {
  tone?: BadgeTone;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function Badge({
  tone = "neutral",
  icon,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-2xs font-medium uppercase tracking-label",
        badgeTones[tone],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </span>
  );
}
