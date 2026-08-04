import Image from "next/image";
import { cn } from "./cn";

/**
 * BookCover — a book, at 2:3, with weight.
 *
 * **Purpose.** Every appearance of a book's artwork. Two things make it worth
 * being a component. First, the ratio is fixed at 2:3 and the shadow is the only
 * shadow in the system — a cover is a real object, and nothing else in the
 * product casts one. Second, most real libraries are full of books with no
 * artwork at all, so the *fallback* is the part that matters: it is a designed
 * placeholder rather than a grey rectangle with a broken-image icon.
 *
 * **Props.**
 * - `title`, `author` — used by the fallback, and to keep it honest. Cover
 *   artwork must never contradict its own metadata, so the fallback prints the
 *   real title and author it was given and invents nothing.
 * - `src` — the artwork. Omit it and the fallback is used.
 * - `size` — `"sm"` (64px), `"md"` (96px), `"lg"` (128px) or `"fluid"` (fills
 *   its column, for grids). Height always follows from the ratio.
 * - `sizes` — the `next/image` sizes hint. A sensible default is derived from
 *   `size`.
 * - `decorative` — `true` by default: in every composition here the title is
 *   written beside the cover, so the image is decorative and gets an empty
 *   `alt`. Pass `false` for a cover standing on its own, and it will be
 *   described as "Cover of {title}".
 *
 * ```tsx
 * <BookCover title="The History of Reading" author="Alberto Manguel" size="lg" />
 * <BookCover title="Ex Libris" src="/covers/ex-libris.jpg" size="fluid" />
 * ```
 *
 * **The fallback.** Deterministic: the same book always renders the same
 * placeholder, from a hash of its title and author. It varies only in which
 * quiet material draws the rule and where the rule sits — four variations, all
 * from existing tokens. Terracotta is not one of them: the thread marks your
 * place, and a cover is not a place. No gradients, no fake page edges, no
 * simulated spine.
 *
 * **Accessibility.** `alt` is empty for a decorative cover, which is correct
 * when the adjacent text already names the book — a screen reader that reads the
 * title twice is worse, not more accessible. The fallback is real text, so it is
 * readable and translatable; `foreground` measures 12.07:1 light and 14.98:1
 * dark on the sunken surface it sits on.
 *
 * **Note.** Remote artwork needs `images.remotePatterns` in `next.config.ts`,
 * which is intentionally not configured yet: no metadata source is wired up, and
 * the app should not reach out to arbitrary hosts before one is chosen.
 */
export type BookCoverSize = "sm" | "md" | "lg" | "fluid";

export type BookCoverProps = {
  title: string;
  author?: string;
  src?: string;
  size?: BookCoverSize;
  sizes?: string;
  priority?: boolean;
  decorative?: boolean;
  className?: string;
};

const coverWidths: Record<BookCoverSize, string> = {
  sm: "w-16",
  md: "w-24",
  lg: "w-32",
  fluid: "w-full",
};

const coverSizesHint: Record<BookCoverSize, string> = {
  sm: "4rem",
  md: "6rem",
  lg: "8rem",
  fluid: "(min-width: 640px) 20vw, 45vw",
};

/** Title type scales with the plate, so a 64px placeholder is not shouting. */
const fallbackTitleSize: Record<BookCoverSize, string> = {
  sm: "text-2xs",
  md: "text-xs",
  lg: "text-sm",
  fluid: "text-sm",
};

/** Stable across sessions and machines: the same book is always the same plate. */
function fingerprint(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index++) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

export function BookCover({
  title,
  author,
  src,
  size = "md",
  sizes,
  priority,
  decorative = true,
  className,
}: BookCoverProps) {
  const variant = fingerprint(`${title}${author ?? ""}`) % 4;
  const rule = variant < 2 ? "bg-walnut" : "bg-olive";
  const ruleAboveTitle = variant % 2 === 0;

  return (
    <div
      className={cn(
        "relative aspect-2/3 overflow-hidden rounded-sm border border-border bg-surface-sunken shadow-cover",
        coverWidths[size],
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={decorative ? "" : `Cover of ${title}`}
          fill
          sizes={sizes ?? coverSizesHint[size]}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          className="flex h-full flex-col justify-between p-3"
          role={decorative ? undefined : "img"}
          aria-label={decorative ? undefined : `Cover of ${title}`}
        >
          <div>
            {ruleAboveTitle ? (
              <div aria-hidden className={cn("mb-2 h-px w-6", rule)} />
            ) : null}
            <p
              className={cn(
                "font-serif tracking-display line-clamp-4",
                fallbackTitleSize[size],
              )}
            >
              {title}
            </p>
          </div>
          <div>
            {ruleAboveTitle ? null : (
              <div aria-hidden className={cn("mb-2 h-px w-6", rule)} />
            )}
            {author ? (
              <p className="text-2xs text-muted-foreground line-clamp-2">
                {author}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
