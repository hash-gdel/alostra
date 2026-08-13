"use client";

import { useEffect } from "react";
import {
  isProductPath,
  markAppRouteLeaving,
  prefersReducedMotion,
} from "@/app/_components/route-transition";

function shouldMarkLeaving(
  anchor: HTMLAnchorElement,
  event: MouseEvent,
): boolean {
  if (prefersReducedMotion()) return false;
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false;
  }
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return false;
  }

  if (url.origin !== window.location.origin) return false;
  if (
    url.pathname === window.location.pathname &&
    url.search === window.location.search
  ) {
    return false;
  }

  // Soften only when moving within (or into) the signed-in product surface.
  return isProductPath(url.pathname) || isProductPath(window.location.pathname);
}

export { markAppRouteLeaving };

/**
 * Shared page-surface transition for the authenticated `(app)` route group.
 * Enter plays on template remount; exit softens in parallel with navigation
 * (never blocks the router).
 */
export function AppRouteTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!shouldMarkLeaving(anchor, event)) return;
      markAppRouteLeaving();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <div data-app-route-surface="" className="app-route-surface">
      {children}
    </div>
  );
}
