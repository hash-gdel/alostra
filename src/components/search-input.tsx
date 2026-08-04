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
import { CloseIcon, SearchIcon } from "./icons";
import { IconButton } from "./icon-button";

/**
 * SearchInput — filtering a library, a queue, or a set of captures.
 *
 * **Purpose.** One search control for the whole product, so search always
 * looks and behaves the same. It is a filter, not a form: there is no submit
 * button, and results are expected to update as the user types.
 *
 * **Props.**
 * - `value` / `onValueChange` — controlled value. The value is handed over
 *   directly rather than as an event, because every caller wants the string.
 * - `onClear` — called after the value is cleared, for refocusing or resetting
 *   a filter. The clear control only appears when `value` is a non-empty
 *   string, so an uncontrolled search field simply has no clear button.
 * - `label` — defaults to `"Search"` and is visually hidden by default, since
 *   the magnifier and placeholder already name the field on screen.
 * - `clearLabel` — accessible name for the clear control.
 * - Native input attributes are forwarded (`placeholder`, `autoFocus`, …).
 *
 * ```tsx
 * const [query, setQuery] = useState("");
 * <SearchInput value={query} onValueChange={setQuery} placeholder="Search your library" />
 * ```
 *
 * **Accessibility.** A real `type="search"` input with a bound, visually
 * hidden label. Escape clears the field when there is something to clear, and
 * stops there — so pressing Escape inside a dialog clears the search before it
 * closes the dialog, which is the behaviour users expect. The clear control is
 * a proper button with a name, reachable by keyboard, and the magnifier is
 * decorative. The browser's own cancel button is suppressed so there is one
 * clear affordance rather than two.
 */
export type SearchInputProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "className" | "type" | "value" | "onChange"
> &
  Omit<FieldOwnProps, "error"> & {
    value?: string;
    onValueChange?: (value: string) => void;
    onClear?: () => void;
    clearLabel?: string;
    className?: string;
  };

export function SearchInput({
  value,
  onValueChange,
  onClear,
  clearLabel = "Clear search",
  label = "Search",
  labelHidden = true,
  description,
  fieldClassName,
  className,
  id,
  onKeyDown,
  ...rest
}: SearchInputProps) {
  const reactId = useId();
  const { controlId, descriptionId, describedBy } = useFieldIds(
    id,
    reactId,
    description,
    undefined,
  );

  const showClear = typeof value === "string" && value.length > 0;

  function clear() {
    onValueChange?.("");
    onClear?.();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.key === "Escape" && showClear) {
      event.stopPropagation();
      clear();
    }
  }

  return (
    <FieldShell
      controlId={controlId}
      label={label}
      labelHidden={labelHidden}
      description={description}
      descriptionId={descriptionId}
      className={fieldClassName}
    >
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          id={controlId}
          type="search"
          value={value}
          onChange={(event) => onValueChange?.(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-describedby={describedBy}
          className={cn(
            fieldControlClasses,
            fieldBorder(false),
            "h-11 pl-10 [&::-webkit-search-cancel-button]:appearance-none",
            showClear && "pr-12",
            className,
          )}
          {...rest}
        />
        {showClear ? (
          <IconButton
            label={clearLabel}
            size="sm"
            onClick={clear}
            className="absolute right-1.5 top-1/2 -translate-y-1/2"
          >
            <CloseIcon className="size-4" />
          </IconButton>
        ) : null}
      </div>
    </FieldShell>
  );
}
