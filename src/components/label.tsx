import { cn } from "./cn";

/**
 * Label — the two sanctioned ways to name something.
 *
 * **Purpose.** `field` names a form control. `eyebrow` is the system's single
 * small-caps treatment (`text-2xs uppercase tracking-label`), used for section
 * kickers, group headings in navigation, and column headers. There is
 * deliberately no third variant: a new label style is how a type system starts
 * to leak.
 *
 * **Props.**
 * - `variant` — `"field"` (default) or `"eyebrow"`.
 * - `htmlFor` — the id of the control being named.
 * - `as` — `"label"` (default) or `"span"`, for an eyebrow that names a region
 *   rather than a control.
 *
 * ```tsx
 * <Label htmlFor="title">Title</Label>
 * <Label as="span" variant="eyebrow">Recently added</Label>
 * ```
 *
 * **Accessibility.** A `field` label must always point at its control with
 * `htmlFor`, which the field components do for you. Use `as="span"` when there
 * is no control to point at — a `<label>` with nothing to label is a lie to a
 * screen reader.
 */
export type LabelVariant = "field" | "eyebrow";

export const labelVariants: Record<LabelVariant, string> = {
  field: "text-sm font-medium text-foreground",
  eyebrow:
    "text-2xs font-medium uppercase tracking-label text-muted-foreground",
};

export type LabelProps = Omit<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  "className"
> & {
  variant?: LabelVariant;
  as?: "label" | "span";
  className?: string;
  children: React.ReactNode;
};

export function Label({
  variant = "field",
  as = "label",
  className,
  children,
  ...rest
}: LabelProps) {
  const classes = cn(labelVariants[variant], className);

  if (as === "span") {
    return (
      <span className={classes} {...rest}>
        {children}
      </span>
    );
  }

  return (
    <label className={classes} {...rest}>
      {children}
    </label>
  );
}
