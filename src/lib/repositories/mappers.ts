import type { Article, Book, Capture } from "@/lib/domain/types";

export type BookRow = {
  id: string;
  user_id: string;
  title: string;
  author: string;
  cover_url: string | null;
  status: Book["status"];
  current_page: number | null;
  total_pages: number | null;
  progress_percent: number;
  created_at: string;
  updated_at: string;
  last_opened_at: string | null;
};

export type ArticleRow = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  author: string | null;
  site_name: string | null;
  status: Article["status"];
  progress_percent: number | null;
  created_at: string;
  updated_at: string;
  last_opened_at: string | null;
};

export type CaptureRow = {
  id: string;
  user_id: string;
  book_id: string | null;
  article_id: string | null;
  text: string;
  note: string | null;
  page_number: number | null;
  created_at: string;
  updated_at: string;
};

export function bookFromRow(row: BookRow): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    coverUrl: row.cover_url ?? undefined,
    status: row.status,
    currentPage: row.current_page ?? undefined,
    totalPages: row.total_pages ?? undefined,
    progressPercent: row.progress_percent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastOpenedAt: row.last_opened_at ?? undefined,
  };
}

export function articleFromRow(row: ArticleRow): Article {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    author: row.author ?? undefined,
    siteName: row.site_name ?? undefined,
    status: row.status,
    progressPercent: row.progress_percent ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastOpenedAt: row.last_opened_at ?? undefined,
  };
}

export function captureFromRow(row: CaptureRow): Capture {
  if (row.book_id) {
    return {
      id: row.id,
      sourceType: "book",
      sourceId: row.book_id,
      text: row.text,
      note: row.note ?? undefined,
      pageNumber: row.page_number ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
  if (row.article_id) {
    return {
      id: row.id,
      sourceType: "article",
      sourceId: row.article_id,
      text: row.text,
      note: row.note ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
  throw new Error(`Capture ${row.id} has no source`);
}

export function bookToRow(book: Book, userId: string): BookRow {
  return {
    id: book.id,
    user_id: userId,
    title: book.title,
    author: book.author,
    cover_url: book.coverUrl ?? null,
    status: book.status,
    current_page: book.currentPage ?? null,
    total_pages: book.totalPages ?? null,
    progress_percent: book.progressPercent,
    created_at: book.createdAt,
    updated_at: book.updatedAt,
    last_opened_at: book.lastOpenedAt ?? null,
  };
}

export function articleToRow(article: Article, userId: string): ArticleRow {
  return {
    id: article.id,
    user_id: userId,
    title: article.title,
    url: article.url,
    author: article.author ?? null,
    site_name: article.siteName ?? null,
    status: article.status,
    progress_percent: article.progressPercent ?? null,
    created_at: article.createdAt,
    updated_at: article.updatedAt,
    last_opened_at: article.lastOpenedAt ?? null,
  };
}

export function captureToRow(capture: Capture, userId: string): CaptureRow {
  return {
    id: capture.id,
    user_id: userId,
    book_id: capture.sourceType === "book" ? capture.sourceId : null,
    article_id: capture.sourceType === "article" ? capture.sourceId : null,
    text: capture.text,
    note: capture.note ?? null,
    page_number: capture.pageNumber ?? null,
    created_at: capture.createdAt,
    updated_at: capture.updatedAt,
  };
}
