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
 * Textarea — multi-line text.
 *
 * **Purpose.** Book notes, the note attached to a capture, and feedback. Same
 * field anatomy and same wiring as `Input`; only the control differs.
 *
 * **Props.** Identical to `Input`, plus native `rows` (default 4). The height
 * grows with `rows`; nothing here auto-resizes, so a long note scrolls rather
 * than pushing the page around while the user types.
 *
 * ```tsx
 * <Textarea label="Note" rows={6} description="Kept on this device." />
 * ```
 *
 * **Accessibility.** As `Input`: label bound with `htmlFor`, `description` and
 * `error` in `aria-describedby`, `aria-invalid` when `error` is present.
 * `resize-y` leaves the user in control of the height, which matters for
 * anyone with a large font size.
 */
export type TextareaProps = Omit<
  React.ComponentPropsWithoutRef<"textarea">,
  "className"
> &
  FieldOwnProps & {
    className?: string;
  };

export function Textarea({
  label,
  labelHidden,
  description,
  error,
  fieldClassName,
  className,
  id,
  rows = 4,
  ...rest
}: TextareaProps) {
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
      <textarea
        id={controlId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          fieldControlClasses,
          fieldBorder(Boolean(error)),
          "resize-y py-2.5",
          className,
        )}
        {...rest}
      />
    </FieldShell>
  );
}
