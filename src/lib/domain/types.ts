/**
 * Domain types for Alostra library data.
 * Supabase PostgreSQL is the source of truth; these shapes are the contract.
 */

export type BookStatus = "want-to-read" | "reading" | "finished";
export type ArticleStatus = "saved" | "reading" | "finished";
export type CaptureSourceType = "book" | "article";

export type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  status: BookStatus;
  currentPage?: number;
  totalPages?: number;
  /** 0–100. Derived from pages when possible; 100 when finished. */
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt?: string;
};

export type Article = {
  id: string;
  title: string;
  url: string;
  author?: string;
  siteName?: string;
  status: ArticleStatus;
  progressPercent?: number;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt?: string;
};

export type Capture = {
  id: string;
  sourceType: CaptureSourceType;
  sourceId: string;
  text: string;
  note?: string;
  /** Page number when the source is a book. */
  pageNumber?: number;
  createdAt: string;
  updatedAt: string;
};

export type LibraryItem =
  | { kind: "book"; book: Book }
  | { kind: "article"; article: Article };

export type BookInput = {
  title: string;
  author?: string;
  coverUrl?: string;
  status?: BookStatus;
  currentPage?: number | null;
  totalPages?: number | null;
};

export type ArticleInput = {
  title: string;
  url: string;
  author?: string;
  siteName?: string;
  status?: ArticleStatus;
  progressPercent?: number | null;
};

export type CaptureInput = {
  sourceType: CaptureSourceType;
  sourceId: string;
  text: string;
  note?: string;
  pageNumber?: number | null;
};
