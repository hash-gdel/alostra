import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  deleteDatabaseForTests,
  resetDatabaseForTests,
} from "@/lib/db/database";
import { SEED_IDS, clearSampleData, seedIfEmpty } from "@/lib/db/seed";
import {
  createArticle,
  deleteArticle,
  getArticle,
  updateArticle,
} from "./articles";
import {
  createBook,
  deleteBook,
  getBook,
  listBooks,
  updateBook,
} from "./books";
import {
  createCapture,
  getCapture,
  listCapturesForSource,
  updateCapture,
} from "./captures";
import { getContinueReading, listLibraryItems } from "./library";

const DB = "alostra-repo-test";

beforeEach(async () => {
  await resetDatabaseForTests(DB);
});

afterEach(async () => {
  await deleteDatabaseForTests(DB);
});

describe("book repository", () => {
  it("creates, updates, lists and deletes", async () => {
    const book = await createBook({
      title: "Ex Libris",
      author: "Anne Fadiman",
      status: "reading",
      currentPage: 40,
      totalPages: 162,
    });
    expect(book.progressPercent).toBe(25);

    const updated = await updateBook(book.id, {
      currentPage: 81,
      totalPages: 162,
    });
    expect(updated.progressPercent).toBe(50);

    const finished = await updateBook(book.id, { status: "finished" });
    expect(finished.progressPercent).toBe(100);

    expect(await listBooks()).toHaveLength(1);
    await deleteBook(book.id);
    expect(await getBook(book.id)).toBeUndefined();
  });
});

describe("article repository", () => {
  it("validates CRUD and finished progress", async () => {
    const article = await createArticle({
      title: "On Typography",
      url: "https://example.com/typography",
      status: "reading",
    });
    const finished = await updateArticle(article.id, { status: "finished" });
    expect(finished.progressPercent).toBe(100);
    await deleteArticle(article.id);
    expect(await getArticle(article.id)).toBeUndefined();
  });
});

describe("capture source relationships", () => {
  it("requires a living source and cascades on delete", async () => {
    await expect(
      createCapture({
        sourceType: "book",
        sourceId: "missing",
        text: "orphan",
      }),
    ).rejects.toThrow(/not found/);

    const book = await createBook({ title: "A Book", author: "Author" });
    const capture = await createCapture({
      sourceType: "book",
      sourceId: book.id,
      text: "A kept line",
      pageNumber: 12,
    });

    expect(await listCapturesForSource("book", book.id)).toHaveLength(1);

    const movedNote = await updateCapture(capture.id, {
      note: "Remember this",
    });
    expect(movedNote.note).toBe("Remember this");

    await deleteBook(book.id);
    expect(await getCapture(capture.id)).toBeUndefined();
  });

  it("cascades article captures too", async () => {
    const article = await createArticle({
      title: "An Article",
      url: "https://example.com/a",
    });
    await createCapture({
      sourceType: "article",
      sourceId: article.id,
      text: "From the article",
    });
    await deleteArticle(article.id);
    expect(await listCapturesForSource("article", article.id)).toHaveLength(0);
  });
});

describe("library queries", () => {
  it("unifies, filters and finds continue-reading", async () => {
    await createBook({
      title: "Shelf Book",
      author: "A",
      status: "want-to-read",
    });
    const reading = await createBook({
      title: "In Progress",
      author: "B",
      status: "reading",
      currentPage: 10,
      totalPages: 100,
    });
    await createArticle({
      title: "Saved Piece",
      url: "https://example.com/saved",
      status: "saved",
    });

    const all = await listLibraryItems("all");
    expect(all).toHaveLength(3);
    expect(await listLibraryItems("books")).toHaveLength(2);
    expect(await listLibraryItems("articles")).toHaveLength(1);
    expect(await listLibraryItems("all", "progress")).toHaveLength(1);

    const cont = await getContinueReading();
    expect(cont?.kind).toBe("book");
    if (cont?.kind === "book") {
      expect(cont.book.id).toBe(reading.id);
    }
  });
});

describe("seed and clear", () => {
  it("seeds only when empty and clears only sample ids", async () => {
    expect(await seedIfEmpty()).toBe(true);
    expect(await seedIfEmpty()).toBe(false);
    expect(await getBook(SEED_IDS.book)).toBeTruthy();

    const userBook = await createBook({ title: "Mine", author: "Me" });
    await clearSampleData();
    expect(await getBook(SEED_IDS.book)).toBeUndefined();
    expect(await getBook(userBook.id)).toBeTruthy();
  });
});
