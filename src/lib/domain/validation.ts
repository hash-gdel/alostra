import type { ArticleStatus, BookStatus, CaptureSourceType } from "./types";

export type FieldErrors = Record<string, string>;

const BOOK_STATUSES: BookStatus[] = ["want-to-read", "reading", "finished"];
const ARTICLE_STATUSES: ArticleStatus[] = ["saved", "reading", "finished"];
const CAPTURE_SOURCES: CaptureSourceType[] = ["book", "article"];

function trim(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseOptionalNumber(value: unknown): number | null | undefined {
  if (value === "" || value === null || value === undefined) return undefined;
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** http(s) URL with a host. Relative paths and bare words are rejected. */
export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.hostname.length > 0
    );
  } catch {
    return false;
  }
}

export type BookFormValues = {
  title: string;
  author: string;
  coverUrl: string;
  status: string;
  currentPage: string;
  totalPages: string;
};

export type ValidBookForm = {
  title: string;
  author: string;
  coverUrl?: string;
  status: BookStatus;
  currentPage?: number;
  totalPages?: number;
};

export function validateBookForm(values: BookFormValues): {
  errors: FieldErrors;
  data?: ValidBookForm;
} {
  const errors: FieldErrors = {};
  const title = trim(values.title);
  const author = trim(values.author);
  const coverUrl = trim(values.coverUrl);
  const status = trim(values.status) as BookStatus;

  if (!title) errors.title = "A title is required.";
  if (!BOOK_STATUSES.includes(status)) {
    errors.status = "Choose a reading status.";
  }

  const currentPage = parseOptionalNumber(values.currentPage);
  const totalPages = parseOptionalNumber(values.totalPages);

  if (currentPage === null) errors.currentPage = "Enter a whole number, or leave blank.";
  if (totalPages === null) errors.totalPages = "Enter a whole number, or leave blank.";

  if (currentPage !== null && currentPage !== undefined && currentPage < 0) {
    errors.currentPage = "Page cannot be negative.";
  }
  if (totalPages !== null && totalPages !== undefined && totalPages < 0) {
    errors.totalPages = "Total pages cannot be negative.";
  }
  if (
    currentPage != null &&
    totalPages != null &&
    currentPage > totalPages
  ) {
    errors.currentPage = "Current page cannot be past the last page.";
  }

  if (coverUrl && !isValidHttpUrl(coverUrl) && !coverUrl.startsWith("/")) {
    errors.coverUrl = "Use a full http(s) link, or a path starting with /.";
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    errors,
    data: {
      title,
      author,
      coverUrl: coverUrl || undefined,
      status,
      currentPage: currentPage ?? undefined,
      totalPages: totalPages ?? undefined,
    },
  };
}

export type ArticleFormValues = {
  title: string;
  url: string;
  author: string;
  siteName: string;
  status: string;
};

export type ValidArticleForm = {
  title: string;
  url: string;
  author?: string;
  siteName?: string;
  status: ArticleStatus;
};

export function validateArticleForm(values: ArticleFormValues): {
  errors: FieldErrors;
  data?: ValidArticleForm;
} {
  const errors: FieldErrors = {};
  const title = trim(values.title);
  const url = trim(values.url);
  const author = trim(values.author);
  const siteName = trim(values.siteName);
  const status = trim(values.status) as ArticleStatus;

  if (!title) errors.title = "A title is required.";
  if (!url) errors.url = "A URL is required.";
  else if (!isValidHttpUrl(url)) {
    errors.url = "That does not look like a valid http(s) link.";
  }
  if (!ARTICLE_STATUSES.includes(status)) {
    errors.status = "Choose a reading status.";
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    errors,
    data: {
      title,
      url,
      author: author || undefined,
      siteName: siteName || undefined,
      status,
    },
  };
}

export type CaptureFormValues = {
  sourceType: string;
  sourceId: string;
  text: string;
  note: string;
  pageNumber: string;
};

export type ValidCaptureForm = {
  sourceType: CaptureSourceType;
  sourceId: string;
  text: string;
  note?: string;
  pageNumber?: number;
};

export function validateCaptureForm(values: CaptureFormValues): {
  errors: FieldErrors;
  data?: ValidCaptureForm;
} {
  const errors: FieldErrors = {};
  const sourceType = trim(values.sourceType) as CaptureSourceType;
  const sourceId = trim(values.sourceId);
  const text = trim(values.text);
  const note = trim(values.note);
  const pageNumber = parseOptionalNumber(values.pageNumber);

  if (!CAPTURE_SOURCES.includes(sourceType)) {
    errors.sourceType = "Choose a book or an article.";
  }
  if (!sourceId) errors.sourceId = "Choose what this capture belongs to.";
  if (!text) errors.text = "Capture text is required.";
  if (pageNumber === null) {
    errors.pageNumber = "Enter a whole number, or leave blank.";
  } else if (pageNumber !== undefined && pageNumber < 0) {
    errors.pageNumber = "Page cannot be negative.";
  }
  if (sourceType === "article" && pageNumber !== undefined && pageNumber !== null) {
    errors.pageNumber = "Page numbers are only for books.";
  }

  if (Object.keys(errors).length > 0) return { errors };

  return {
    errors,
    data: {
      sourceType,
      sourceId,
      text,
      note: note || undefined,
      pageNumber:
        sourceType === "book" ? (pageNumber ?? undefined) : undefined,
    },
  };
}
