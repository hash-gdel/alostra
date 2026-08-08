import { createId, nowIso } from "@/lib/db/ids";
import { computeBookProgress } from "@/lib/domain/progress";
import type { Book, BookInput, BookStatus } from "@/lib/domain/types";
import {
  bookFromRow,
  bookToRow,
  type BookRow,
} from "@/lib/repositories/mappers";
import { requireUser } from "@/lib/repositories/require-user";

function applyProgress(
  status: BookStatus,
  currentPage?: number | null,
  totalPages?: number | null,
) {
  return computeBookProgress({ status, currentPage, totalPages });
}

export async function listBooks(): Promise<Book[]> {
  const { client, userId } = await requireUser();
  const { data, error } = await client
    .from("books")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data as BookRow[]).map(bookFromRow);
}

export async function getBook(id: string): Promise<Book | undefined> {
  const { client, userId } = await requireUser();
  const { data, error } = await client
    .from("books")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ? bookFromRow(data as BookRow) : undefined;
}

export async function createBook(input: BookInput): Promise<Book> {
  const { client, userId } = await requireUser();
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
  const { error } = await client.from("books").insert(bookToRow(book, userId));
  if (error) throw error;
  return book;
}

export async function updateBook(
  id: string,
  input: Partial<BookInput> & { status?: BookStatus; lastOpenedAt?: string },
): Promise<Book> {
  const { client, userId } = await requireUser();
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
    author: input.author !== undefined ? input.author.trim() : existing.author,
    coverUrl:
      input.coverUrl !== undefined
        ? input.coverUrl.trim() || undefined
        : existing.coverUrl,
    status,
    ...progress,
    lastOpenedAt: input.lastOpenedAt ?? existing.lastOpenedAt,
    updatedAt: nowIso(),
  };

  const { error } = await client
    .from("books")
    .update(bookToRow(next, userId))
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
  return next;
}

export async function deleteBook(id: string): Promise<void> {
  const { client, userId } = await requireUser();
  const { error } = await client
    .from("books")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function touchBookOpened(id: string): Promise<Book> {
  return updateBook(id, { lastOpenedAt: nowIso() });
}
