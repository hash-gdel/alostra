/**
 * Class name joiner.
 *
 * Deliberately not `clsx` + `tailwind-merge`. Components in this library own
 * their base classes and expose variant props for anything that changes, so
 * there is nothing to de-conflict at runtime. A `className` passed by a
 * consumer is appended and should *add* to the base — layout, width, margin —
 * rather than fight it. If a consumer needs to override a base style, that is
 * a signal the component needs a prop.
 */
export type ClassValue = string | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
