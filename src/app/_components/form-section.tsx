import { Skeleton } from "@/components";

/**
 * Quiet field group for product forms. Spacing and a legend carry hierarchy—
 * no cards or dividers.
 */
export function FormSection({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-4 border-0 p-0">
      <legend className="float-none mb-1 w-full px-0 text-xs font-medium text-muted-foreground">
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}

/** Preserves reading-width form layout while an edit page loads. */
export function FormLoading({ label }: { label: string }) {
  return (
    <div
      className="mt-block max-w-reading space-y-4"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="sr-only">{label}</p>
      <Skeleton variant="block" className="h-11" />
      <Skeleton variant="block" className="h-11" />
      <Skeleton variant="block" className="h-11" />
      <Skeleton variant="block" className="h-24" />
    </div>
  );
}

/**
 * Primary + Cancel together; Delete on its own quieter row when present.
 */
export function FormActions({
  primary,
  secondary,
  destructive,
}: {
  primary: React.ReactNode;
  secondary: React.ReactNode;
  destructive?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-block pt-2">
      <div className="flex flex-wrap items-center gap-3">
        {primary}
        {secondary}
      </div>
      {destructive ? (
        <div className="flex flex-wrap items-center">{destructive}</div>
      ) : null}
    </div>
  );
}
