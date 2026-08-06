import { describe, expect, it } from "vitest";
import {
  articleMatchesQuery,
  bookMatchesQuery,
  filterLibraryItems,
  searchAll,
} from "./search";
import type { Article, Book, Capture } from "./types";

const book: Book = {
  id: "b1",
  title: "The History of Reading",
  author: "Alberto Manguel",
  status: "reading",
  progressPercent: 50,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
};

const article: Article = {
  id: "a1",
  title: "How to Mark a Book",
  url: "https://example.com/how-to-mark-a-book",
  author: "Mortimer J. Adler",
  siteName: "Saturday Review",
  status: "saved",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const capture: Capture = {
  id: "c1",
  sourceType: "book",
  sourceId: "b1",
  text: "To own a book is to make it part of yourself",
  createdAt: "2026-01-02T00:00:00.000Z",
  updatedAt: "2026-01-02T00:00:00.000Z",
};

describe("search matching", () => {
  it("is case-insensitive for titles and authors", () => {
    expect(bookMatchesQuery(book, "HISTORY")).toBe(true);
    expect(bookMatchesQuery(book, "manguel")).toBe(true);
    expect(articleMatchesQuery(article, "EXAMPLE.COM")).toBe(true);
  });

  it("filters a unified library list", () => {
    const items = filterLibraryItems(
      [
        { kind: "book", book },
        { kind: "article", article },
      ],
      "mark",
    );
    expect(items).toHaveLength(1);
    expect(items[0]?.kind).toBe("article");
  });

  it("matches captures by text and by source title", () => {
    const byText = searchAll({
      query: "part of yourself",
      books: [book],
      articles: [article],
      captures: [capture],
    });
    expect(byText.captures).toHaveLength(1);

    const bySource = searchAll({
      query: "history",
      books: [book],
      articles: [article],
      captures: [capture],
    });
    expect(bySource.books).toHaveLength(1);
    expect(bySource.captures).toHaveLength(1);
  });
});
