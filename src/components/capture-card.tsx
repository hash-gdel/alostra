import { Card } from "./card";
import { SourceIcon, type SourceType } from "./source-icon";

/**
 * CaptureCard — a highlight or note you kept.
 *
 * **Purpose.** Captures are the product's memory: the sentences worth keeping,
 * from a book or an article, in one stream. The quotation is set in the serif at
 * the quotation size, because it is the thing the user came back for; everything
 * else on the card is small, sans, and out of the way.
 *
 * **Props.**
 * - `quote` — the highlighted text. Required.
 * - `sourceTitle` — the book or article it came from.
 * - `sourceType` — `"book"` (default) or `"article"`, choosing the mark.
 * - `sourceDetail` — a page, chapter or author, shown after the title.
 * - `note` — the user's own note on the capture.
 * - `href` — makes the whole card the link back to the source.
 * - `asButton` + `onClick` — for selecting a capture in a list instead of
 *   navigating.
 * - `selected` — the thread takes the hairline and `aria-current` is set.
 *
 * ```tsx
 * <CaptureCard
 *   quote="We read to know we are not alone."
 *   sourceTitle="The Shadow of the Wind"
 *   sourceDetail="Page 88"
 *   note="Worth returning to when writing about why reading is private."
 *   href="/captures/1"
 * />
 * ```
 *
 * **Accessibility.** Real quotation semantics: `<figure>` wrapping a
 * `<blockquote>` and a `<figcaption>` with a `<cite>`, so the attribution is
 * programmatically tied to the quote instead of merely sitting beneath it.
 * Selection is exposed with `aria-current` by `Card` as well as shown with the
 * thread — the prototype's selected capture was a terracotta line and nothing
 * else, which meant that for a screen-reader user it was not selected at all.
 */
export type CaptureCardProps = {
  quote: string;
  sourceTitle: string;
  sourceType?: Exclude<SourceType, "capture">;
  sourceDetail?: string;
  note?: string;
  href?: string;
  asButton?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  selected?: boolean;
  className?: string;
};

export function CaptureCard({
  quote,
  sourceTitle,
  sourceType = "book",
  sourceDetail,
  note,
  href,
  asButton,
  onClick,
  selected = false,
  className,
}: CaptureCardProps) {
  return (
    <Card
      href={href}
      asButton={asButton}
      onClick={onClick}
      as="article"
      selected={selected}
      padding="md"
      className={className}
    >
      <figure>
        <blockquote className="border-l border-border-strong pl-4 font-serif text-lg text-pretty">
          {quote}
        </blockquote>
        <figcaption className="mt-3 flex items-center gap-2 pl-4 text-xs text-muted-foreground">
          <SourceIcon type={sourceType} className="size-4 shrink-0" />
          <cite className="truncate not-italic">{sourceTitle}</cite>
          {sourceDetail ? (
            <>
              <span aria-hidden>·</span>
              <span className="shrink-0 tabular-nums">{sourceDetail}</span>
            </>
          ) : null}
        </figcaption>
        {note ? (
          <p className="mt-3 pl-4 text-sm text-muted-foreground text-pretty">
            {note}
          </p>
        ) : null}
      </figure>
    </Card>
  );
}
