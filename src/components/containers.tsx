import { cn } from "./cn";

/**
 * The three containers.
 *
 * **Purpose.** Reading and browsing are different activities and must not share
 * a container, so the system has three measures and these are the only way to
 * apply them. A screen picks one and stops thinking about page width.
 *
 * - `PageContainer` — `max-w-library` (1200px). Browsing: shelves, grids, the
 *   queue. The outermost shell of a normal screen.
 * - `ContentContainer` — `max-w-content` (768px). A single column of mixed
 *   content: home, a book's detail page, settings.
 * - `ReadingContainer` — `max-w-reading` (608px, about 66 characters). Prose.
 *   Sets the reading type scale by default, which no other container does.
 *
 * **Props (all three).**
 * - `as` — the element to render. Use `"main"` once per page.
 * - `gutters` — page gutters, on by default. Turn them off on a nested
 *   container so the padding is not applied twice.
 * - `ReadingContainer` additionally takes `prose` (default `true`), which
 *   applies `font-serif text-reading`. Set it to `false` to borrow the measure
 *   for something that is not prose.
 *
 * ```tsx
 * <PageContainer as="main">
 *   <ContentContainer gutters={false}>…</ContentContainer>
 * </PageContainer>
 *
 * <ReadingContainer as="article">
 *   <p>The reader, at nineteen pixels across sixty-six characters.</p>
 * </ReadingContainer>
 * ```
 *
 * **Accessibility.** These are layout elements with no semantics of their own,
 * which is exactly why `as` exists: the landmark should be chosen by the screen
 * (`main`, `article`, `aside`), not imposed by a wrapper. A measure of about 66
 * characters is a readability requirement, not a taste: long lines cost the
 * reader their place on every return sweep.
 */
type ContainerElement =
  | "div"
  | "main"
  | "section"
  | "article"
  | "header"
  | "footer"
  | "aside";

type ContainerProps = {
  as?: ContainerElement;
  gutters?: boolean;
  className?: string;
  children: React.ReactNode;
};

function Container({
  as: Tag = "div",
  gutters,
  width,
  className,
  children,
}: ContainerProps & { width: string }) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full",
        width,
        gutters !== false && "px-gutter md:px-gutter-lg",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function PageContainer(props: ContainerProps) {
  return <Container {...props} width="max-w-library" />;
}

export function ContentContainer(props: ContainerProps) {
  return <Container {...props} width="max-w-content" />;
}

export function ReadingContainer({
  prose = true,
  className,
  ...rest
}: ContainerProps & { prose?: boolean }) {
  return (
    <Container
      {...rest}
      width="max-w-reading"
      className={cn(prose && "font-serif text-reading", className)}
    />
  );
}
