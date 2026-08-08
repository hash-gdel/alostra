const PRODUCT_PREFIXES = ["/home", "/library", "/captures"] as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isProductPath(pathname: string): boolean {
  return PRODUCT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Soften the current page surface before a client navigation. */
export function markAppRouteLeaving(): void {
  if (typeof document === "undefined") return;
  if (prefersReducedMotion()) return;
  document
    .querySelectorAll<HTMLElement>("[data-app-route-surface]")
    .forEach((el) => {
      el.dataset.leaving = "true";
    });
}
