import { getDb } from "@/lib/db/database";
import { createId, nowIso } from "@/lib/db/ids";
import { computeBookProgress } from "@/lib/domain/progress";
import type { Book, BookInput, BookStatus } from "@/lib/domain/types";

function applyProgress(
  status: BookStatus,
  currentPage?: number | null,
  totalPages?: number | null,
) {
  return computeBookProgress({ status, currentPage, totalPages });
}

export async function listBooks(): Promise<Book[]> {
  const db = getDb();
  return db.books.orderBy("updatedAt").reverse().toArray();
}

export async function getBook(id: string): Promise<Book | undefined> {
  return getDb().books.get(id);
}

export async function createBook(input: BookInput): Promise<Book> {
  const status = input.status ?? "want-to-read";
  const progress = applyProgress(status, input.currentPage, input.totalPages);
  const now = nowIso();
  const book: Book = {
    id: createId(),
    title: input.title.trim(),
    author: (input.author ?? "").trim(),
    coverUrl: input.coverUrl?.trim() || undefined,
    status,
    ...progress,
    createdAt: now,
    updatedAt: now,
  };
  await getDb().books.add(book);
  return book;
}

export async function updateBook(
  id: string,
  input: Partial<BookInput> & { status?: BookStatus; lastOpenedAt?: string },
): Promise<Book> {
  const existing = await getBook(id);
  if (!existing) throw new Error(`Book not found: ${id}`);

  const status = input.status ?? existing.status;
  const currentPage =
    input.currentPage !== undefined ? input.currentPage : existing.currentPage;
  const totalPages =
    input.totalPages !== undefined ? input.totalPages : existing.totalPages;
  const progress = applyProgress(status, currentPage, totalPages);

  const next: Book = {
    ...existing,
    title: input.title !== undefined ? input.title.trim() : existing.title,
    author:
      input.author !== undefined ? input.author.trim() : existing.author,
    coverUrl:
      input.coverUrl !== undefined
        ? input.coverUrl.trim() || undefined
        : existing.coverUrl,
    status,
    ...progress,
    lastOpenedAt: input.lastOpenedAt ?? existing.lastOpenedAt,
    updatedAt: nowIso(),
  };

  await getDb().books.put(next);
  return next;
}

export async function deleteBook(id: string): Promise<void> {
  const db = getDb();
  await db.transaction("rw", db.books, db.captures, async () => {
    await db.books.delete(id);
    await db.captures.where({ sourceType: "book", sourceId: id }).delete();
  });
}

export async function touchBookOpened(id: string): Promise<Book> {
  return updateBook(id, { lastOpenedAt: nowIso() });
}
