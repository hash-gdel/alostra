import { ContentContainer } from "@/components";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-canvas text-foreground">
      <ContentContainer className="flex min-h-dvh flex-col justify-center py-section">
        <p className="font-serif text-lg tracking-display">Alostra</p>
        <p className="mt-1 text-2xs text-muted-foreground">
          Your private reading corner
        </p>
        <div className="mt-section">{children}</div>
      </ContentContainer>
    </div>
  );
}
