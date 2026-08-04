"use client";

import { useId } from "react";
import { cn } from "./cn";
import {
  FieldShell,
  fieldBorder,
  fieldControlClasses,
  useFieldIds,
  type FieldOwnProps,
} from "./field";

/**
 * Input — a single-line text field.
 *
 * **Purpose.** Every one-line entry in the product: a book title, a page
 * number, an author, a URL to save. It renders the whole field — label,
 * control, help text, validation message — because a bare input that leaves
 * labelling to the caller is how unlabelled fields ship.
 *
 * **Props.**
 * - `label` — the visible name. `labelHidden` keeps it for assistive
 *   technology when the surrounding UI already names the field.
 * - `description` — persistent help text, announced with the control.
 * - `error` — a validation message. Its presence marks the field invalid.
 * - `className` — classes for the `<input>`; `fieldClassName` for the wrapper.
 * - All native input attributes are forwarded (`type`, `placeholder`,
 *   `required`, `inputMode`, `autoComplete`, `value`, `onChange`, …).
 *
 * ```tsx
 * <Input label="Title" placeholder="The History of Reading" required />
 * <Input label="Page" type="number" inputMode="numeric" description="Optional." />
 * <Input label="Article URL" error="That does not look like a link." />
 * ```
 *
 * **Accessibility.** The label is bound with `htmlFor`/`id`; ids are generated
 * with `useId` unless you pass one. `description` and `error` are wired into
 * `aria-describedby`, and `error` sets `aria-invalid`. Because the system has
 * no destructive colour, invalidity is carried by the message and
 * `aria-invalid` with a stronger hairline — never by colour alone.
 */
export type InputProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "className"
> &
  FieldOwnProps & {
    className?: string;
  };

export function Input({
  label,
  labelHidden,
  description,
  error,
  fieldClassName,
  className,
  id,
  ...rest
}: InputProps) {
  const reactId = useId();
  const { controlId, descriptionId, errorId, describedBy } = useFieldIds(
    id,
    reactId,
    description,
    error,
  );

  return (
    <FieldShell
      controlId={controlId}
      label={label}
      labelHidden={labelHidden}
      description={description}
      descriptionId={descriptionId}
      error={error}
      errorId={errorId}
      className={fieldClassName}
    >
      <input
        id={controlId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          fieldControlClasses,
          fieldBorder(Boolean(error)),
          "h-11",
          className,
        )}
        {...rest}
      />
    </FieldShell>
  );
}
