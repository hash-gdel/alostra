/**
 * Placeholder. The reading corner is built in a later milestone; this exists
 * only so the application has a root while the design foundation is laid.
 */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-content flex-col justify-center px-gutter md:px-gutter-lg">
      <p className="text-2xs font-medium uppercase tracking-label text-muted-foreground">
        Alostra
      </p>
      <h1 className="mt-4 font-serif text-3xl tracking-display text-balance">
        A reading corner for your books, articles and the parts worth keeping.
      </h1>
      <p className="mt-4 max-w-reading text-base text-muted-foreground text-pretty">
        Nothing to read here yet. The design foundation is in place.
      </p>
    </main>
  );
}
