import type { LibraryItem } from "@/lib/domain/types";
import { filterLibraryItems } from "@/lib/domain/search";
import { listArticles } from "./articles";
import { listBooks } from "./books";

export type LibraryFilter = "all" | "books" | "articles";

function itemTimestamp(item: LibraryItem): string {
  return item.kind === "book" ? item.book.updatedAt : item.article.updatedAt;
}

export async function listLibraryItems(
  filter: LibraryFilter = "all",
  query = "",
): Promise<LibraryItem[]> {
  const [books, articles] = await Promise.all([listBooks(), listArticles()]);

  let items: LibraryItem[] = [];
  if (filter === "all" || filter === "books") {
    items = items.concat(books.map((book) => ({ kind: "book" as const, book })));
  }
  if (filter === "all" || filter === "articles") {
    items = items.concat(
      articles.map((article) => ({ kind: "article" as const, article })),
    );
  }

  items.sort((a, b) => itemTimestamp(b).localeCompare(itemTimestamp(a)));
  return filterLibraryItems(items, query);
}

/** Prefer an in-progress item by lastOpenedAt, then updatedAt. */
export async function getContinueReading(): Promise<LibraryItem | undefined> {
  const [books, articles] = await Promise.all([listBooks(), listArticles()]);

  const readingBooks = books.filter((b) => b.status === "reading");
  const readingArticles = articles.filter((a) => a.status === "reading");

  const candidates: LibraryItem[] = [
    ...readingBooks.map((book) => ({ kind: "book" as const, book })),
    ...readingArticles.map((article) => ({
      kind: "article" as const,
      article,
    })),
  ];

  if (candidates.length === 0) return undefined;

  candidates.sort((a, b) => {
    const aTime =
      (a.kind === "book" ? a.book.lastOpenedAt : a.article.lastOpenedAt) ??
      itemTimestamp(a);
    const bTime =
      (b.kind === "book" ? b.book.lastOpenedAt : b.article.lastOpenedAt) ??
      itemTimestamp(b);
    return bTime.localeCompare(aTime);
  });

  return candidates[0];
}

export async function listRecentlyAdded(limit = 6): Promise<LibraryItem[]> {
  const items = await listLibraryItems("all");
  return items
    .slice()
    .sort((a, b) => {
      const aCreated =
        a.kind === "book" ? a.book.createdAt : a.article.createdAt;
      const bCreated =
        b.kind === "book" ? b.book.createdAt : b.article.createdAt;
      return bCreated.localeCompare(aCreated);
    })
    .slice(0, limit);
}
