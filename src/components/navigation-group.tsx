import { Children } from "react";
import { cn } from "./cn";
import { Label } from "./label";

/**
 * NavigationGroup — a labelled set of destinations.
 *
 * **Purpose.** Wraps `SidebarItem`s or `MobileNavItem`s in the markup that makes
 * a group of links a *list* of links, and gives the group its name. Both
 * navigations use it, which is why the sidebar and the bottom bar cannot drift
 * apart structurally: `orientation` is the only difference between them.
 *
 * **Props.**
 * - `label` — a visible small-caps heading, e.g. `"Library"`. Also names the
 *   landmark, so a screen reader hears the same word a sighted user reads.
 * - `ariaLabel` — the landmark name when there is no visible heading. Give one
 *   of `label` or `ariaLabel` whenever `as="nav"`.
 * - `orientation` — `"vertical"` (default, the sidebar) or `"horizontal"` (the
 *   bottom bar, items sharing the width evenly).
 * - `as` — `"nav"` (default) or `"div"`. Use `"div"` for a group nested inside
 *   an outer `<nav>`, so the page does not end up with landmarks inside
 *   landmarks.
 *
 * ```tsx
 * <NavigationGroup label="Library">
 *   <SidebarItem href="/books" icon={<BookIcon />} label="Books" />
 *   <SidebarItem href="/captures" icon={<HighlightIcon />} label="Captures" count={48} />
 * </NavigationGroup>
 *
 * <NavigationGroup ariaLabel="Main" orientation="horizontal">
 *   <MobileNavItem href="/" icon={<HomeIcon />} label="Home" active />
 *   <MobileNavItem href="/queue" icon={<QueueIcon />} label="Queue" />
 * </NavigationGroup>
 * ```
 *
 * **Accessibility.** Renders a `<nav>` landmark containing a `<ul>`, and wraps
 * each child in its own `<li>` so the items are announced as "list, 5 items"
 * and can be skipped as a unit. `role="list"` is stated explicitly because
 * Safari drops list semantics from a list whose bullets have been removed.
 * Children stay plain anchors, which keeps them valid to use on their own.
 */
export type NavigationGroupProps = {
  label?: string;
  ariaLabel?: string;
  orientation?: "vertical" | "horizontal";
  as?: "nav" | "div";
  className?: string;
  children: React.ReactNode;
};

export function NavigationGroup({
  label,
  ariaLabel,
  orientation = "vertical",
  as: Tag = "nav",
  className,
  children,
}: NavigationGroupProps) {
  const horizontal = orientation === "horizontal";

  return (
    <Tag aria-label={ariaLabel ?? label} className={className}>
      {label ? (
        <Label as="span" variant="eyebrow" className="block px-3">
          {label}
        </Label>
      ) : null}
      <ul
        role="list"
        className={cn(
          horizontal
            ? "flex items-stretch justify-around"
            : "flex flex-col gap-0.5",
          label && !horizontal && "mt-2",
        )}
      >
        {Children.map(children, (child) => (
          <li className={horizontal ? "flex flex-1 justify-center" : undefined}>
            {child}
          </li>
        ))}
      </ul>
    </Tag>
  );
}
