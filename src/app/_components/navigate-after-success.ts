import {
  markAppRouteLeaving,
  prefersReducedMotion,
} from "@/app/_components/route-transition";

type RouterLike = {
  push: (href: string) => void;
};

/** Just long enough for the Saved label / toast to register — not a page pause. */
const SUCCESS_FEEDBACK_MS = 120;

export { prefersReducedMotion };

/**
 * Brief pause so toast + control success state can register before navigation.
 * Skipped entirely when the user prefers reduced motion.
 */
export async function pauseForSuccessTransition(): Promise<void> {
  if (prefersReducedMotion()) return;
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, SUCCESS_FEEDBACK_MS);
  });
}

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

/**
 * Client-side navigation after a successful mutation.
 * Softens the current surface, then pushes — no server refresh (avoids flicker
 * on client-fetched list pages).
 */
export async function navigateAfterSuccess(
  router: RouterLike,
  href: string,
): Promise<void> {
  await pauseForSuccessTransition();
  markAppRouteLeaving();
  if (!prefersReducedMotion()) {
    await waitForPaint();
  }
  router.push(href);
}
