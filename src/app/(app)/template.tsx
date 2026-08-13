import { AppRouteTransition } from "@/app/_components/app-route-transition";

/**
 * Remounts on every navigation within `(app)`, so enter transitions stay
 * consistent without per-page wrappers. Shell chrome lives in the layout and
 * remains stable.
 */
export default function AppTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppRouteTransition>{children}</AppRouteTransition>;
}
