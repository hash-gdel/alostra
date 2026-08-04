import { cn } from "./cn";
import { Label } from "./label";
import { transitionQuick } from "./styles";

/**
 * Internal plumbing shared by `Input`, `Textarea` and `SearchInput`.
 *
 * Not exported from the library barrel: it exists so that the label,
 * description, error text and their `aria` wiring are written once instead of
 * three times. Consumers use the field components.
 */

/**
 * The shared control surface.
 *
 * Set at `text-base` (16px) rather than the `text-sm` used by other controls.
 * That is a deliberate, documented exception: iOS zooms the viewport when a
 * focused field is under 16px, which on a phone is a real usability failure
 * rather than a typographic preference.
 */
export const fieldControlBase =
  "w-full rounded-md border bg-surface px-3 text-base text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-muted-foreground";

/**
 * The system has no destructive colour by design, so an invalid field is
 * marked by a stronger hairline, `aria-invalid`, and a message in full
 * `foreground` — never by turning something red, and never by colour alone.
 */
export function fieldBorder(invalid: boolean): string {
  return invalid ? "border-border-strong" : "border-border";
}

export const fieldControlClasses = cn(fieldControlBase, transitionQuick);

export type FieldOwnProps = {
  /** Visible name for the control. Always supply one, hide it if the surrounding UI already names it. */
  label?: string;
  /** Keeps the label for assistive technology but removes it visually. */
  labelHidden?: boolean;
  /** Persistent help text, read out with the control. */
  description?: string;
  /** Validation message. Presence of this prop marks the control invalid. */
  error?: string;
  /** Classes for the wrapper. `className` belongs to the control itself. */
  fieldClassName?: string;
};

export function useFieldIds(
  providedId: string | undefined,
  reactId: string,
  description: string | undefined,
  error: string | undefined,
) {
  const controlId = providedId ?? `${reactId}-control`;
  const descriptionId = description ? `${reactId}-description` : undefined;
  const errorId = error ? `${reactId}-error` : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return { controlId, descriptionId, errorId, describedBy };
}

export function FieldShell({
  controlId,
  label,
  labelHidden = false,
  description,
  descriptionId,
  error,
  errorId,
  className,
  children,
}: {
  controlId: string;
  descriptionId?: string;
  errorId?: string;
  className?: string;
  children: React.ReactNode;
} & Pick<
  FieldOwnProps,
  "label" | "labelHidden" | "description" | "error"
>) {
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label ? (
        <Label htmlFor={controlId} className={labelHidden ? "sr-only" : undefined}>
          {label}
        </Label>
      ) : null}
      {children}
      {description ? (
        <p id={descriptionId} className="text-xs text-muted-foreground">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs font-medium text-foreground">
          {error}
        </p>
      ) : null}
    </div>
  );
}
