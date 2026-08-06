import type { Article, Book, Capture, LibraryItem } from "./types";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function includes(haystack: string | undefined, needle: string): boolean {
  if (!haystack) return false;
  return normalize(haystack).includes(needle);
}

export function bookMatchesQuery(book: Book, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  return (
    includes(book.title, q) ||
    includes(book.author, q) ||
    includes(book.coverUrl, q)
  );
}

export function articleMatchesQuery(article: Article, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  return (
    includes(article.title, q) ||
    includes(article.author, q) ||
    includes(article.url, q) ||
    includes(article.siteName, q)
  );
}

export function captureMatchesQuery(capture: Capture, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  return includes(capture.text, q) || includes(capture.note, q);
}

/** Case-insensitive filter over a unified library list. */
export function filterLibraryItems(
  items: LibraryItem[],
  query: string,
): LibraryItem[] {
  const q = normalize(query);
  if (!q) return items;
  return items.filter((item) =>
    item.kind === "book"
      ? bookMatchesQuery(item.book, q)
      : articleMatchesQuery(item.article, q),
  );
}

/**
 * Search across books, articles and captures.
 * Capture hits also match when their source title/author/url matches.
 */
export function searchAll(input: {
  query: string;
  books: Book[];
  articles: Article[];
  captures: Capture[];
}): {
  books: Book[];
  articles: Article[];
  captures: Capture[];
} {
  const q = normalize(input.query);
  if (!q) {
    return {
      books: input.books,
      articles: input.articles,
      captures: input.captures,
    };
  }

  const books = input.books.filter((b) => bookMatchesQuery(b, q));
  const articles = input.articles.filter((a) => articleMatchesQuery(a, q));

  const bookById = new Map(input.books.map((b) => [b.id, b]));
  const articleById = new Map(input.articles.map((a) => [a.id, a]));

  const captures = input.captures.filter((c) => {
    if (captureMatchesQuery(c, q)) return true;
    if (c.sourceType === "book") {
      const book = bookById.get(c.sourceId);
      return book ? bookMatchesQuery(book, q) : false;
    }
    const article = articleById.get(c.sourceId);
    return article ? articleMatchesQuery(article, q) : false;
  });

  return { books, articles, captures };
}
