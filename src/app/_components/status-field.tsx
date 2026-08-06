"use client";

import { useId } from "react";
import { Label } from "@/components";

/**
 * Native select styled with the same surface language as library fields.
 * There is no Select primitive in the frozen component library; this stays
 * app-local rather than expanding that API.
 */
export function StatusField({
  label,
  name,
  value,
  onChange,
  options,
  error,
  description,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  description?: string;
}) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {description ? (
        <p id={descriptionId} className="text-xs text-muted-foreground">
          {description}
        </p>
      ) : null}
      <select
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [descriptionId, errorId].filter(Boolean).join(" ") || undefined
        }
        className={[
          "h-11 w-full rounded-md border bg-surface px-3 text-base text-foreground",
          "transition-colors duration-(--duration-quick) ease-standard",
          "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-muted-foreground",
          error ? "border-border-strong" : "border-border",
        ].join(" ")}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} className="text-xs text-foreground">
          {error}
        </p>
      ) : null}
    </div>
  );
}
