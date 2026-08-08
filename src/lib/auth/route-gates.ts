/** Default destination after sign-in / sign-up. */
export const DEFAULT_POST_AUTH_PATH = "/home";

const PRODUCT_PREFIXES = ["/home", "/library", "/captures"] as const;

const AUTH_ENTRY_PATHS = new Set(["/sign-in", "/sign-up"]);

/**
 * Product routes that require an authenticated session.
 */
export function isProductPath(pathname: string): boolean {
  return PRODUCT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Auth entry pages that should redirect away when already signed in.
 */
export function isAuthEntryPath(pathname: string): boolean {
  return AUTH_ENTRY_PATHS.has(pathname);
}

/**
 * Accept only same-origin relative product paths for post-auth redirects.
 * Rejects absolute URLs, protocol-relative URLs, and unknown paths.
 */
export function isSafeNextPath(path: string): boolean {
  if (!path.startsWith("/") || path.startsWith("//")) return false;
  if (path.includes("://") || path.includes("\\") || path.includes("\0")) {
    return false;
  }
  // Strip query/hash for prefix checks
  const pathOnly = path.split("?")[0]?.split("#")[0] ?? path;
  return isProductPath(pathOnly);
}

export function resolvePostAuthPath(next: string | null | undefined): string {
  if (next && isSafeNextPath(next)) return next;
  return DEFAULT_POST_AUTH_PATH;
}
