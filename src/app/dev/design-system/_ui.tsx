/**
 * Chrome for the internal reference page itself.
 *
 * These are not part of the component library and must not be imported by the
 * application — they are the frame around the exhibits. Reference material is
 * held to the system more strictly than product code, not less, so they use
 * the same tokens as everything else.
 */

export function Section({
  title,
  index,
  lede,
  children,
}: {
  title: string;
  index: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-section md:mt-section-lg">
      <div className="flex items-baseline gap-3">
        <span className="text-2xs tabular-nums tracking-label text-muted-foreground">
          {index}
        </span>
        <h2 className="font-serif text-xl tracking-display">{title}</h2>
      </div>
      {lede ? (
        <p className="mt-2 max-w-reading text-sm text-muted-foreground text-pretty">
          {lede}
        </p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

/**
 * A canvas in one mode. Rendering the catalogue inside two of these is how
 * every component is shown in both modes without writing it twice.
 */
export function ModeFrame({
  mode,
  children,
}: {
  mode: "light" | "dark";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${mode === "dark" ? "dark " : ""}rounded-lg border border-border bg-canvas p-5 text-foreground md:p-8`}
    >
      <p className="text-2xs font-medium uppercase tracking-label text-muted-foreground">
        {mode === "light" ? "Light — shipping" : "Dark — architecture only"}
      </p>
      <div className="mt-7">{children}</div>
    </div>
  );
}

/** A family of components: Foundation, Layout, Navigation, and so on. */
export function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-2xs font-medium uppercase tracking-label text-muted-foreground">
        {title}
      </h3>
      <div className="mt-4 divide-y divide-border border-y border-border">
        {children}
      </div>
    </div>
  );
}

/** One component: its name, what it is for, and its states. */
export function Specimen({
  name,
  purpose,
  children,
}: {
  name: string;
  purpose: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-6">
      <p className="text-sm font-medium">{name}</p>
      <p className="mt-1 max-w-reading text-xs text-muted-foreground text-pretty">
        {purpose}
      </p>
      <div className="mt-4 flex flex-col gap-5">{children}</div>
    </div>
  );
}

/** One labelled state of a component. */
export function Cell({
  label,
  children,
  layout = "row",
}: {
  label: string;
  children: React.ReactNode;
  layout?: "row" | "stack";
}) {
  return (
    <div>
      <p className="text-2xs uppercase tracking-label text-muted-foreground">
        {label}
      </p>
      <div
        className={
          layout === "row"
            ? "mt-2 flex flex-wrap items-center gap-3"
            : "mt-2 flex flex-col gap-3"
        }
      >
        {children}
      </div>
    </div>
  );
}
