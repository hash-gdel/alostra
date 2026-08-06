import type { ArticleStatus, BookStatus } from "./types";

/** Matches BadgeTone in the component library without importing UI code. */
export type StatusTone = "neutral" | "status" | "emphasis";

export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  "want-to-read": "Want to read",
  reading: "Reading",
  finished: "Finished",
};

export const ARTICLE_STATUS_LABELS: Record<ArticleStatus, string> = {
  saved: "Saved",
  reading: "Reading",
  finished: "Finished",
};

export function bookStatusTone(status: BookStatus): StatusTone {
  if (status === "reading") return "emphasis";
  if (status === "finished") return "status";
  return "neutral";
}

export function articleStatusTone(status: ArticleStatus): StatusTone {
  if (status === "reading") return "emphasis";
  if (status === "finished") return "status";
  return "neutral";
}

/**
 * Remote cover hosts are not enabled in next.config yet (Milestone 2 open
 * question). Same-origin paths work; http(s) URLs are stored but not passed to
 * BookCover, which would otherwise fail to load them.
 */
export function resolveCoverSrc(coverUrl?: string): string | undefined {
  if (!coverUrl) return undefined;
  if (coverUrl.startsWith("/")) return coverUrl;
  return undefined;
}
