import Link from "next/link";
import { BookCover } from "./book-cover";
import { Button } from "./button";
import { Card } from "./card";
import { Label } from "./label";
import {
  ReadingProgress,
  type ReadingProgressValue,
} from "./reading-progress";

/**
 * ContinueReadingCard — the one thing you are part-way through.
 *
 * **Purpose.** The most prominent card in the product: what a reader most likely
 * came back to do. It is a wider, calmer arrangement of the same parts as
 * `BookCard` — larger cover, the title at the book-title size, the thread showing
 * where you stopped, and a single obvious way back in. It works for an article
 * as well as a book; pass no `coverSrc` and the fallback plate is used.
 *
 * **Props.**
 * - `title`, `author`, `coverSrc`, `href` — the book and where it opens.
 * - `progress` — `{ page, pages }` or `{ percent }`.
 * - `eyebrow` — defaults to `"Continue reading"`, the product's own wording.
 * - `actionLabel` — defaults to `"Continue reading"`.
 *
 * ```tsx
 * <ContinueReadingCard
 *   title="The History of Reading"
 *   author="Alberto Manguel"
 *   href="/read/history-of-reading"
 *   progress={{ page: 214, pages: 344 }}
 * />
 * ```
 *
 * **Accessibility.** The card itself is an `<article>`, not a link, because it
 * contains a button — nesting interactive elements makes the inner one
 * unreachable by keyboard. Instead the title is a link and the action is a
 * second link with its own wording, giving two sensible tab stops that both go
 * to the same place. The heading is an `<h3>`, so the card sits under the
 * section heading above it. Progress is announced from the bar's
 * `aria-valuetext`.
 */
export type ContinueReadingCardProps = {
  title: string;
  author?: string;
  coverSrc?: string;
  href: string;
  progress?: ReadingProgressValue;
  eyebrow?: string;
  actionLabel?: string;
  className?: string;
};

export function ContinueReadingCard({
  title,
  author,
  coverSrc,
  href,
  progress,
  eyebrow = "Continue reading",
  actionLabel = "Continue reading",
  className,
}: ContinueReadingCardProps) {
  return (
    <Card as="article" padding="lg" className={className}>
      <div className="flex gap-5">
        {/* One plate that grows at `sm`, rather than two that would both load. */}
        <BookCover
          title={title}
          author={author}
          src={coverSrc}
          size="md"
          sizes="(min-width: 640px) 8rem, 6rem"
          className="shrink-0 sm:w-32"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Label as="span" variant="eyebrow">
            {eyebrow}
          </Label>
          <h3 className="mt-1.5 font-serif text-2xl tracking-display text-balance">
            <Link href={href} className="underline-offset-4 hover:underline">
              {title}
            </Link>
          </h3>
          {author ? (
            <p className="mt-1 text-sm text-muted-foreground">{author}</p>
          ) : null}
          {progress ? (
            <ReadingProgress {...progress} className="mt-4 max-w-80" />
          ) : null}
          <div className="mt-5">
            <Button href={href}>{actionLabel}</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
