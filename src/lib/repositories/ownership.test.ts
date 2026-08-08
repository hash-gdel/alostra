import { describe, expect, it } from "vitest";

/**
 * Mirrors the capture INSERT/UPDATE RLS WITH CHECK from
 * supabase/migrations/20260807000000_library_rls.sql so the ownership rule
 * is unit-tested without a live Postgres.
 */
function captureSourceAllowed(input: {
  userId: string;
  bookId: string | null;
  articleId: string | null;
  books: { id: string; userId: string }[];
  articles: { id: string; userId: string }[];
}): boolean {
  const ownsBook =
    input.bookId != null &&
    input.articleId == null &&
    input.books.some((b) => b.id === input.bookId && b.userId === input.userId);
  const ownsArticle =
    input.articleId != null &&
    input.bookId == null &&
    input.articles.some(
      (a) => a.id === input.articleId && a.userId === input.userId,
    );
  return ownsBook || ownsArticle;
}

describe("capture source ownership (RLS WITH CHECK)", () => {
  const userA = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
  const userB = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
  const bookA = "11111111-1111-1111-1111-111111111111";
  const articleB = "22222222-2222-2222-2222-222222222222";

  it("allows a capture on the user’s own book", () => {
    expect(
      captureSourceAllowed({
        userId: userA,
        bookId: bookA,
        articleId: null,
        books: [{ id: bookA, userId: userA }],
        articles: [],
      }),
    ).toBe(true);
  });

  it("rejects a capture that points at another user’s book", () => {
    expect(
      captureSourceAllowed({
        userId: userA,
        bookId: bookA,
        articleId: null,
        books: [{ id: bookA, userId: userB }],
        articles: [],
      }),
    ).toBe(false);
  });

  it("rejects a capture that points at another user’s article", () => {
    expect(
      captureSourceAllowed({
        userId: userA,
        bookId: null,
        articleId: articleB,
        books: [],
        articles: [{ id: articleB, userId: userB }],
      }),
    ).toBe(false);
  });
});
