"use client";

import { usePathname } from "next/navigation";
import {
  HomeIcon,
  InboxIcon,
  MobileNavItem,
  NavigationGroup,
  QueueIcon,
  SidebarItem,
} from "@/components";

const NAV = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/library", label: "Library", icon: QueueIcon },
  { href: "/captures", label: "Captures", icon: InboxIcon },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-canvas text-foreground">
      <div className="mx-auto flex min-h-dvh max-w-library">
        <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-border px-3 py-block md:flex">
          <p className="px-3 font-serif text-lg tracking-display">Alostra</p>
          <p className="mt-1 px-3 text-2xs text-muted-foreground">
            Your reading corner
          </p>
          <NavigationGroup ariaLabel="Main" className="mt-section">
            {NAV.map(({ href, label, icon: Icon }) => (
              <SidebarItem
                key={href}
                href={href}
                label={label}
                icon={<Icon className="size-4" />}
                active={isActive(pathname, href)}
              />
            ))}
          </NavigationGroup>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
          <header className="border-b border-border px-gutter py-4 md:hidden">
            <p className="font-serif text-lg tracking-display">Alostra</p>
          </header>
          <div className="flex-1">{children}</div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-surface md:hidden">
        <NavigationGroup
          ariaLabel="Primary"
          orientation="horizontal"
          className="mx-auto max-w-library"
        >
          {NAV.map(({ href, label, icon: Icon }) => (
            <MobileNavItem
              key={href}
              href={href}
              label={label}
              icon={<Icon className="size-5" />}
              active={isActive(pathname, href)}
            />
          ))}
        </NavigationGroup>
      </div>
    </div>
  );
}
