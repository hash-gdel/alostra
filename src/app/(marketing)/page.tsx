import { Button, ContentContainer } from "@/components";

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-canvas text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,color-mix(in_oklab,var(--color-accent)_12%,transparent),transparent_55%),radial-gradient(ellipse_at_80%_100%,color-mix(in_oklab,var(--color-border-strong)_40%,transparent),transparent_50%)]"
      />
      <ContentContainer className="relative flex min-h-dvh flex-col justify-center py-section">
        <p className="font-serif text-5xl tracking-display sm:text-6xl">
          Alostra
        </p>
        <h1 className="mt-block max-w-reading font-serif text-2xl tracking-display text-balance sm:text-3xl">
          The private home for everything you read
        </h1>
        <p className="mt-4 max-w-reading text-base text-muted-foreground text-pretty">
          Books, articles, captures and notes in one calm reading corner —
          available on every device you use.
        </p>
        <div className="mt-section flex flex-wrap items-center gap-3">
          <Button href="/sign-up">Create account</Button>
          <Button href="/sign-in" variant="quiet">
            Sign in
          </Button>
        </div>
        <p className="mt-block max-w-reading text-xs text-muted-foreground text-pretty">
          An account keeps your reading home durable and private to you. No
          social feeds. No noise.
        </p>
      </ContentContainer>
    </div>
  );
}
