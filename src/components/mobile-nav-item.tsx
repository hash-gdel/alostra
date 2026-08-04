import Link from "next/link";
import { cn } from "./cn";
import { mutedUnderWash, transitionQuick } from "./styles";
import { Thread } from "./thread";

/**
 * MobileNavItem — one destination in the bottom bar.
 *
 * **Purpose.** The same destinations as the sidebar, at thumb height on a
 * phone: icon over label, four or five across. It is a separate component
 * rather than a variant of `SidebarItem` because the anatomy really is
 * different — stacked instead of in a row, and the thread marks the top edge
 * rather than the leading one. What they share is the meaning of "active", and
 * that is expressed identically in both.
 *
 * **Props.**
 * - `href`, `label`, `icon` — required. An unlabelled icon in a bottom bar is a
 *   guessing game, so the label is not optional.
 * - `active` — the current destination.
 *
 * ```tsx
 * <MobileNavItem href="/" icon={<HomeIcon />} label="Home" active />
 * ```
 *
 * **Accessibility.** A real anchor (via `next/link`) with `aria-current="page"`
 * when active. The
 * target is 56px tall and at least 64px wide, comfortably above the 44px touch
 * minimum. Both the icon and the written label are present — the label is not
 * hidden to save space, because on a small screen it is the fastest way to read
 * the bar.
 */
export type MobileNavItemProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "className" | "href"
> & {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  className?: string;
};

export function MobileNavItem({
  href,
  label,
  icon,
  active = false,
  className,
  ...rest
}: MobileNavItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-14 min-w-16 flex-col items-center justify-center gap-1 rounded-md px-2 text-2xs",
        transitionQuick,
        active ? "font-medium text-foreground" : mutedUnderWash,
        !active && "hover:bg-surface-hover",
        className,
      )}
      {...rest}
    >
      {active ? (
        <Thread orientation="horizontal" className="absolute inset-x-0 top-0" />
      ) : null}
      <span className="shrink-0">{icon}</span>
      <span className="max-w-full truncate">{label}</span>
    </Link>
  );
}
