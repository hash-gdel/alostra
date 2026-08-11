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
