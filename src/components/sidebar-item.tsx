import Link from "next/link";
import { cn } from "./cn";
import { mutedUnderWash, transitionQuick } from "./styles";
import { Thread } from "./thread";

/**
 * SidebarItem — one destination in the sidebar.
 *
 * **Purpose.** Persistent navigation on wide screens: Home, Queue, Library,
 * Captures, Settings. Destinations are plain nouns, never metaphors — a
 * destination that needs a subtitle to explain it is badly named.
 *
 * **Props.**
 * - `href`, `label` — required.
 * - `icon` — an icon from `icons.tsx`.
 * - `count` — an optional number on the right, e.g. items in the queue. Set in
 *   tabular figures so counts do not shift as they change.
 * - `active` — the current destination.
 *
 * ```tsx
 * <SidebarItem href="/queue" icon={<QueueIcon />} label="Queue" count={12} active />
 * ```
 *
 * **Accessibility.** A real anchor (via `next/link`, so navigation stays
 * client-side), keyboard-reachable and in document order. The active item is marked with `aria-current="page"`, which is
 * what a screen reader announces — the Bookmark Thread down its leading edge is
 * the visual half of the same statement, never the whole of it. The row is 44px
 * tall, meeting the touch minimum even though this control is mostly used with a
 * pointer.
 *
 * Metadata brightens from `muted-foreground` to `foreground` on hover rather
 * than staying muted, because the hover wash is the lightest surface in dark
 * mode and muted text measures only 4.07:1 against it.
 */
export type SidebarItemProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "className" | "href"
> & {
  href: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
  active?: boolean;
  className?: string;
};

export function SidebarItem({
  href,
  label,
  icon,
  count,
  active = false,
  className,
  ...rest
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-11 items-center gap-3 rounded-md px-3 text-sm text-foreground",
        transitionQuick,
        active ? "bg-surface font-medium" : "hover:bg-surface-hover",
        className,
      )}
      {...rest}
    >
      {active ? (
        <Thread className="absolute left-0 top-1/2 h-5 -translate-y-1/2" />
      ) : null}
      {icon ? (
        <span
          className={cn("shrink-0", active ? "text-foreground" : mutedUnderWash)}
        >
          {icon}
        </span>
      ) : null}
      <span className="min-w-0 truncate">{label}</span>
      {count !== undefined ? (
        <span
          className={cn(
            "ml-auto text-xs tabular-nums",
            active ? "text-foreground" : mutedUnderWash,
          )}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}
