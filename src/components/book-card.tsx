import { Badge, type BadgeTone } from "./badge";
import { BookCover } from "./book-cover";
import { Card } from "./card";
import {
  ReadingProgress,
  type ReadingProgressValue,
} from "./reading-progress";

/**
 * BookCard — a book on a shelf or in a list.
 *
 * **Purpose.** The unit of the library. It is a composition, not a new surface:
 * `Card` for the panel, `BookCover` for the artwork, `Badge` for status,
 * `ReadingProgress` for the thread. Two layouts, because browsing and scanning
 * want different shapes — a `grid` of covers to be looked at, and a `row` to be
 * read down.
 *
 * **Props.**
 * - `title`, `author`, `coverSrc` — passed through to `BookCover`.
 * - `href` — makes the whole card the link to the book.
 * - `status` / `statusTone` — a `Badge`, e.g. `"Reading"` with
 *   `tone="emphasis"`, `"Finished"` with `tone="status"`.
 * - `progress` — `{ page, pages }` or `{ percent }`. Omit it for a book that has
 *   not been started; an untouched book with a zero-length thread looks like a
 *   mistake.
 * - `layout` — `"grid"` (default, cover above the title) or `"row"`.
 * - `selected` — passed to `Card`; the thread takes the hairline.
 * - `headingLevel` — `3` (default) or `4`, to sit correctly under the section
 *   heading above it.
 *
 * ```tsx
 * <BookCard
 *   title="The History of Reading"
 *   author="Alberto Manguel"
 *   href="/books/history-of-reading"
 *   status="Reading"
 *   statusTone="emphasis"
 *   progress={{ page: 214, pages: 344 }}
 * />
 * ```
 *
 * **Accessibility.** The whole card is one link, so there is a single tab stop
 * per book and nothing interactive nested inside it. The title is a real heading
 * at the level you pass, which lets a screen-reader user move through a shelf by
 * heading. Status is written out, never carried by colour alone, and progress is
 * announced from the bar's `aria-valuetext`.
 */
export type BookCardProps = {
  title: string;
  author?: string;
  coverSrc?: string;
  href?: string;
  status?: string;
  statusTone?: BadgeTone;
  progress?: ReadingProgressValue;
  layout?: "grid" | "row";
  selected?: boolean;
  headingLevel?: 3 | 4;
  className?: string;
};

export function BookCard({
  title,
  author,
  coverSrc,
  href,
  status,
  statusTone = "neutral",
  progress,
  layout = "grid",
  selected = false,
  headingLevel = 3,
  className,
}: BookCardProps) {
  const Heading = headingLevel === 4 ? "h4" : "h3";
  const grid = layout === "grid";

  const details = (
    <>
      <Heading className="font-serif text-lg tracking-display text-pretty line-clamp-2">
        {title}
      </Heading>
      {author ? (
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
          {author}
        </p>
      ) : null}
      {status ? (
        <div className="mt-2">
          <Badge tone={statusTone}>{status}</Badge>
        </div>
      ) : null}
      {progress ? <ReadingProgress {...progress} className="mt-3" /> : null}
    </>
  );

  return (
    <Card
      href={href}
      as="article"
      selected={selected}
      padding={grid ? "sm" : "md"}
      className={className}
    >
      {grid ? (
        <>
          <BookCover
            title={title}
            author={author}
            src={coverSrc}
            size="fluid"
          />
          <div className="mt-3">{details}</div>
        </>
      ) : (
        <div className="flex gap-4">
          <BookCover
            title={title}
            author={author}
            src={coverSrc}
            size="sm"
            className="shrink-0"
          />
          <div className="min-w-0 flex-1">{details}</div>
        </div>
      )}
    </Card>
  );
}
