"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Button,
  HomeIcon,
  InboxIcon,
  MobileNavItem,
  NavigationGroup,
  QueueIcon,
  SidebarItem,
} from "@/components";
import { useAuth } from "@/lib/auth/auth-context";

const NAV = [
  { href: "/home", label: "Home", icon: HomeIcon },
  { href: "/library", label: "Library", icon: QueueIcon },
  { href: "/captures", label: "Captures", icon: InboxIcon },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/home") return pathname === "/home";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

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
          <div className="mt-auto px-3 pt-block">
            {user ? (
              <div className="space-y-2">
                <p className="truncate text-2xs text-muted-foreground">
                  {user.email}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    void signOut().then(() => {
                      router.push("/");
                      router.refresh();
                    });
                  }}
                >
                  Sign out
                </Button>
              </div>
            ) : null}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
          <header className="flex items-center justify-between border-b border-border px-gutter py-4 md:hidden">
            <p className="font-serif text-lg tracking-display">Alostra</p>
            {user ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  void signOut().then(() => {
                    router.push("/");
                    router.refresh();
                  });
                }}
              >
                Sign out
              </Button>
            ) : null}
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
