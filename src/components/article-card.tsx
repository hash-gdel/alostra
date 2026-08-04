import { Badge, type BadgeTone } from "./badge";
import { Card } from "./card";
import { SourceIcon } from "./source-icon";

/**
 * ArticleCard — a saved article in a queue or a list.
 *
 * **Purpose.** The other half of the product thesis: articles sitting beside
 * books rather than in a separate app. It is deliberately built from the same
 * parts as `BookCard` — same `Card`, same title treatment, same badge — so a
 * mixed queue reads as one collection instead of two lists sharing a page. An
 * article has no cover, so its mark is a source icon and its measure of length
 * is a reading time.
 *
 * **Props.**
 * - `title` — required.
 * - `source` — the publication or domain, as plain text.
 * - `readingTime` — minutes, rendered as "8 min read".
 * - `excerpt` — two lines at most, clamped.
 * - `href` — makes the whole card the link.
 * - `status` / `statusTone` — a `Badge`, e.g. `"Unread"`.
 * - `selected`, `headingLevel`, `className` — as `BookCard`.
 *
 * ```tsx
 * <ArticleCard
 *   title="The Reading Brain in the Digital Age"
 *   source="Scientific American"
 *   readingTime={8}
 *   excerpt="Reading on paper and reading on screens engage attention differently…"
 *   href="/read/reading-brain"
 *   status="Unread"
 * />
 * ```
 *
 * **Accessibility.** One link, one tab stop, a real heading for the title, and
 * metadata in a single line whose separators are `aria-hidden` so the dots are
 * not announced. The source icon is decorative: "Article" is already implied by
 * the reading time and the source, and a card that announces "image, article"
 * before its title is slower to listen to, not clearer.
 */
export type ArticleCardProps = {
  title: string;
  source?: string;
  readingTime?: number;
  excerpt?: string;
  href?: string;
  status?: string;
  statusTone?: BadgeTone;
  selected?: boolean;
  headingLevel?: 3 | 4;
  className?: string;
};

export function ArticleCard({
  title,
  source,
  readingTime,
  excerpt,
  href,
  status,
  statusTone = "neutral",
  selected = false,
  headingLevel = 3,
  className,
}: ArticleCardProps) {
  const Heading = headingLevel === 4 ? "h4" : "h3";

  return (
    <Card
      href={href}
      as="article"
      selected={selected}
      padding="md"
      className={className}
    >
      <div className="flex items-start gap-3">
        <SourceIcon
          type="article"
          className="mt-1 size-4 shrink-0 text-muted-foreground"
        />
        <div className="min-w-0">
          <Heading className="font-serif text-lg tracking-display text-pretty line-clamp-2">
            {title}
          </Heading>
          {source || readingTime !== undefined ? (
            <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
              {source ? <span className="truncate">{source}</span> : null}
              {source && readingTime !== undefined ? (
                <span aria-hidden>·</span>
              ) : null}
              {readingTime !== undefined ? (
                <span className="tabular-nums">{readingTime} min read</span>
              ) : null}
            </p>
          ) : null}
          {excerpt ? (
            <p className="mt-2 text-sm text-muted-foreground text-pretty line-clamp-2">
              {excerpt}
            </p>
          ) : null}
          {status ? (
            <div className="mt-3">
              <Badge tone={statusTone}>{status}</Badge>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
