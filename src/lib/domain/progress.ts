import type { ArticleStatus, BookStatus } from "./types";

/** Clamp a number into [min, max]. Non-finite values become min. */
export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function asOptionalPage(value: number | null | undefined): number | undefined {
  if (value == null || !Number.isFinite(value)) return undefined;
  return Math.floor(value);
}

/**
 * Derive book page fields and progressPercent.
 *
 * Rules:
 * - pages are non-negative integers; current page cannot exceed total pages;
 * - finished always yields 100%;
 * - when both pages are known, percent is round(current / total * 100);
 * - otherwise progress is 0 (unless finished).
 */
export function computeBookProgress(input: {
  status: BookStatus;
  currentPage?: number | null;
  totalPages?: number | null;
}): {
  currentPage?: number;
  totalPages?: number;
  progressPercent: number;
} {
  let totalPages = asOptionalPage(input.totalPages);
  let currentPage = asOptionalPage(input.currentPage);

  if (totalPages !== undefined) {
    totalPages = clamp(totalPages, 0, Number.MAX_SAFE_INTEGER);
    if (totalPages === 0) totalPages = undefined;
  }

  if (currentPage !== undefined) {
    const max = totalPages ?? Number.MAX_SAFE_INTEGER;
    currentPage = clamp(currentPage, 0, max);
  }

  if (input.status === "finished") {
    return {
      currentPage: totalPages ?? currentPage,
      totalPages,
      progressPercent: 100,
    };
  }

  if (totalPages !== undefined && currentPage !== undefined) {
    return {
      currentPage,
      totalPages,
      progressPercent: clamp(Math.round((currentPage / totalPages) * 100), 0, 100),
    };
  }

  return {
    currentPage,
    totalPages,
    progressPercent: 0,
  };
}

/**
 * Article progress is a simple optional percent.
 * Finished always yields 100%; other statuses clamp 0–100 when provided.
 */
export function computeArticleProgress(input: {
  status: ArticleStatus;
  progressPercent?: number | null;
}): number | undefined {
  if (input.status === "finished") return 100;
  if (input.progressPercent == null || !Number.isFinite(input.progressPercent)) {
    return undefined;
  }
  return clamp(Math.round(input.progressPercent), 0, 100);
}
