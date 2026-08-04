import { ArticleIcon, BookIcon, HighlightIcon } from "./icons";

/**
 * SourceIcon — what kind of thing this is.
 *
 * **Purpose.** One mapping from a source kind to its mark, so a book always
 * looks like a book across cards, lists and the reader. The product's whole
 * premise is that books, articles and captures live in one place, which only
 * works if the eye can tell them apart instantly.
 *
 * **Props.**
 * - `type` — `"book" | "article" | "capture"`.
 * - `label` — supply one only when the icon is the *only* indication of the
 *   kind. Then it is exposed as an image with that name; otherwise the icon is
 *   decorative, because the card text beside it already says what it is.
 *
 * ```tsx
 * <SourceIcon type="article" className="text-muted-foreground" />
 * <SourceIcon type="book" label="Book" />
 * ```
 *
 * **Accessibility.** Decorative by default, so a screen reader is not told
 * "image" before every title in a list. Colour comes from `currentColor`; the
 * icons are line marks and clear 3:1 in both modes at `muted-foreground` and
 * above.
 *
 * **Privacy.** Deliberately not a favicon. Fetching a site's icon would tell
 * that site what its reader is reading, from their own device, which is exactly
 * the thing this product promises not to do. A drawn mark costs nothing and
 * leaks nothing.
 */
export type SourceType = "book" | "article" | "capture";

export type SourceIconProps = {
  type: SourceType;
  label?: string;
  className?: string;
};

export function SourceIcon({ type, label, className }: SourceIconProps) {
  const icon =
    type === "book" ? (
      <BookIcon className={className} />
    ) : type === "article" ? (
      <ArticleIcon className={className} />
    ) : (
      <HighlightIcon className={className} />
    );

  if (label) {
    return (
      <span role="img" aria-label={label} className="inline-flex">
        {icon}
      </span>
    );
  }

  return icon;
}
