import { getDb } from "./database";
import type { Article, Book, Capture } from "@/lib/domain/types";

/** Stable IDs so sample data can be cleared without a schema flag. */
export const SEED_IDS = {
  book: "seed-book-history-of-reading",
  article: "seed-article-reading-brain",
  captureBook: "seed-capture-book-1",
  captureArticle: "seed-capture-article-1",
} as const;

const META_SEEDED = "sampleSeeded";

export async function hasSampleData(): Promise<boolean> {
  const db = getDb();
  const meta = await db.meta.get(META_SEEDED);
  if (meta?.value === "1") return true;
  const book = await db.books.get(SEED_IDS.book);
  return Boolean(book);
}

/**
 * Insert tasteful sample records only when every store is empty.
 * Safe to call on every app start.
 */
export async function seedIfEmpty(): Promise<boolean> {
  const db = getDb();
  const [bookCount, articleCount, captureCount] = await Promise.all([
    db.books.count(),
    db.articles.count(),
    db.captures.count(),
  ]);

  if (bookCount + articleCount + captureCount > 0) return false;

  const now = new Date();
  const earlier = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3);
  const yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 20);

  const book: Book = {
    id: SEED_IDS.book,
    title: "The History of Reading",
    author: "Alberto Manguel",
    status: "reading",
    currentPage: 214,
    totalPages: 372,
    progressPercent: 58,
    createdAt: earlier.toISOString(),
    updatedAt: yesterday.toISOString(),
    lastOpenedAt: yesterday.toISOString(),
  };

  const article: Article = {
    id: SEED_IDS.article,
    title: "How to Mark a Book",
    url: "https://example.com/how-to-mark-a-book",
    author: "Mortimer J. Adler",
    siteName: "Saturday Review",
    status: "saved",
    createdAt: earlier.toISOString(),
    updatedAt: earlier.toISOString(),
  };

  const bookCapture: Capture = {
    id: SEED_IDS.captureBook,
    sourceType: "book",
    sourceId: SEED_IDS.book,
    text: "To own a book is to make it part of yourself, not merely to have it on a shelf.",
    note: "On the difference between collecting and reading.",
    pageNumber: 88,
    createdAt: yesterday.toISOString(),
    updatedAt: yesterday.toISOString(),
  };

  const articleCapture: Capture = {
    id: SEED_IDS.captureArticle,
    sourceType: "article",
    sourceId: SEED_IDS.article,
    text: "Marking a book is not an act of mutilation but of love.",
    note: "Keep this beside the captures workflow.",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  await db.transaction("rw", db.books, db.articles, db.captures, db.meta, async () => {
    await db.books.add(book);
    await db.articles.add(article);
    await db.captures.bulkAdd([bookCapture, articleCapture]);
    await db.meta.put({ key: META_SEEDED, value: "1" });
  });

  return true;
}

/** Remove only the known sample records. User-created data is left alone. */
export async function clearSampleData(): Promise<void> {
  const db = getDb();
  await db.transaction("rw", db.books, db.articles, db.captures, db.meta, async () => {
    await db.books.delete(SEED_IDS.book);
    await db.articles.delete(SEED_IDS.article);
    await db.captures.delete(SEED_IDS.captureBook);
    await db.captures.delete(SEED_IDS.captureArticle);
    await db.meta.delete(META_SEEDED);
  });
}
