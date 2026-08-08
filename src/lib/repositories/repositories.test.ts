import { beforeEach, describe, expect, it, vi } from "vitest";

const { mock } = vi.hoisted(() => {
  type InnerRow = Record<string, unknown>;
  const tables: Record<string, InnerRow[]> = {
    books: [],
    articles: [],
    captures: [],
  };
  const userId = "user-test-1";

  function from(table: string) {
    const state = {
      filters: {} as Record<string, unknown>,
      orderCol: null as string | null,
      ascending: false,
      maybe: false,
      action: "select" as "select" | "insert" | "update" | "delete",
      payload: null as InnerRow | null,
    };

    const api: {
      select: () => typeof api;
      insert: (row: InnerRow) => typeof api;
      update: (row: InnerRow) => typeof api;
      delete: () => typeof api;
      eq: (col: string, value: unknown) => typeof api;
      order: (col: string, opts?: { ascending?: boolean }) => typeof api;
      maybeSingle: () => typeof api;
      then: (
        resolve: (value: { data: unknown; error: null }) => unknown,
      ) => Promise<unknown>;
    } = {
      select() {
        state.action = "select";
        return api;
      },
      insert(row: InnerRow) {
        state.action = "insert";
        state.payload = row;
        return api;
      },
      update(row: InnerRow) {
        state.action = "update";
        state.payload = row;
        return api;
      },
      delete() {
        state.action = "delete";
        return api;
      },
      eq(col: string, value: unknown) {
        state.filters[col] = value;
        return api;
      },
      order(col: string, opts?: { ascending?: boolean }) {
        state.orderCol = col;
        state.ascending = Boolean(opts?.ascending);
        return api;
      },
      maybeSingle() {
        state.maybe = true;
        return api;
      },
      then(resolve) {
        const rows = tables[table] ?? [];
        if (state.action === "insert") {
          const row = { ...(state.payload as InnerRow) };
          rows.push(row);
          return Promise.resolve(resolve({ data: row, error: null }));
        }
        let matched = rows.filter((row) =>
          Object.entries(state.filters).every(([k, v]) => row[k] === v),
        );
        if (state.action === "update") {
          const payload = state.payload as InnerRow;
          for (const row of matched) Object.assign(row, payload);
          return Promise.resolve(resolve({ data: matched, error: null }));
        }
        if (state.action === "delete") {
          const deleted = rows.filter((row) =>
            Object.entries(state.filters).every(([k, v]) => row[k] === v),
          );
          if (table === "books") {
            const deletedIds = new Set(deleted.map((row) => row.id));
            tables.captures = tables.captures.filter(
              (c) => !deletedIds.has(c.book_id),
            );
          }
          if (table === "articles") {
            const deletedIds = new Set(deleted.map((row) => row.id));
            tables.captures = tables.captures.filter(
              (c) => !deletedIds.has(c.article_id),
            );
          }
          tables[table] = rows.filter(
            (row) =>
              !Object.entries(state.filters).every(([k, v]) => row[k] === v),
          );
          return Promise.resolve(resolve({ data: null, error: null }));
        }
        if (state.orderCol) {
          const col = state.orderCol;
          matched = [...matched].sort((a, b) => {
            const av = String(a[col] ?? "");
            const bv = String(b[col] ?? "");
            return state.ascending ? av.localeCompare(bv) : bv.localeCompare(av);
          });
        }
        if (state.maybe) {
          return Promise.resolve(
            resolve({ data: matched[0] ?? null, error: null }),
          );
        }
        return Promise.resolve(resolve({ data: matched, error: null }));
      },
    };
    return api;
  }

  return {
    mock: {
      userId,
      tables,
      client: {
        from,
        auth: {
          getUser: async () => ({
            data: { user: { id: userId, email: "test@example.com" } },
            error: null,
          }),
        },
      },
    },
  };
});

vi.mock("@/lib/repositories/require-user", () => ({
  AuthenticationRequiredError: class AuthenticationRequiredError extends Error {
    constructor(message = "Authentication required.") {
      super(message);
      this.name = "AuthenticationRequiredError";
    }
  },
  requireUser: async () => ({
    client: mock.client,
    user: { id: mock.userId },
    userId: mock.userId,
  }),
}));

import {
  createArticle,
  deleteArticle,
  listArticles,
} from "@/lib/repositories/articles";
import {
  createBook,
  deleteBook,
  getBook,
  listBooks,
  updateBook,
} from "@/lib/repositories/books";
import {
  createCapture,
  listCaptures,
  listCapturesWithSources,
} from "@/lib/repositories/captures";
import { listLibraryItems } from "@/lib/repositories/library";

describe("Supabase repositories", () => {
  beforeEach(() => {
    mock.tables.books.length = 0;
    mock.tables.articles.length = 0;
    mock.tables.captures.length = 0;
  });

  it("creates and lists books for the signed-in user", async () => {
    await createBook({
      title: "The Dispossessed",
      author: "Ursula K. Le Guin",
      status: "reading",
      currentPage: 40,
      totalPages: 400,
    });
    const books = await listBooks();
    expect(books).toHaveLength(1);
    expect(books[0]?.title).toBe("The Dispossessed");
    expect(books[0]?.progressPercent).toBe(10);
    expect(mock.tables.books[0]?.user_id).toBe(mock.userId);
  });

  it("updates book progress", async () => {
    const book = await createBook({
      title: "Dune",
      author: "Frank Herbert",
      status: "reading",
      currentPage: 10,
      totalPages: 100,
    });
    const updated = await updateBook(book.id, { currentPage: 50 });
    expect(updated.progressPercent).toBe(50);
    const again = await getBook(book.id);
    expect(again?.currentPage).toBe(50);
  });

  it("cascades capture deletion when a book is deleted", async () => {
    const book = await createBook({ title: "Book", author: "A" });
    await createCapture({
      sourceType: "book",
      sourceId: book.id,
      text: "A line worth keeping",
      pageNumber: 12,
    });
    expect(await listCaptures()).toHaveLength(1);
    await deleteBook(book.id);
    expect(await listCaptures()).toHaveLength(0);
    expect(await listBooks()).toHaveLength(0);
  });

  it("creates articles and lists library items", async () => {
    await createBook({ title: "Book", author: "A" });
    await createArticle({
      title: "Essay",
      url: "https://example.com/essay",
      status: "saved",
    });
    const items = await listLibraryItems();
    expect(items).toHaveLength(2);
    expect(await listArticles()).toHaveLength(1);
  });

  it("lists captures with source titles", async () => {
    const book = await createBook({ title: "Source Book", author: "A" });
    await createCapture({
      sourceType: "book",
      sourceId: book.id,
      text: "Kept line",
    });
    const withSources = await listCapturesWithSources();
    expect(withSources).toHaveLength(1);
    expect(withSources[0]?.sourceTitle).toBe("Source Book");
  });

  it("rejects captures for missing sources", async () => {
    await expect(
      createCapture({
        sourceType: "article",
        sourceId: "missing-id",
        text: "Nope",
      }),
    ).rejects.toThrow(/not found/);
  });

  it("cascades captures when an article is deleted", async () => {
    const article = await createArticle({
      title: "Piece",
      url: "https://example.com/a",
    });
    await createCapture({
      sourceType: "article",
      sourceId: article.id,
      text: "Quote",
    });
    await deleteArticle(article.id);
    expect(await listCaptures()).toHaveLength(0);
  });
});
