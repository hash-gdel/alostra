"use client";

import { useState } from "react";
import {
  ArticleCard,
  BookCard,
  BookIcon,
  Button,
  EmptyState,
  PageContainer,
  SearchInput,
  SectionHeading,
  Skeleton,
} from "@/components";
import { useLiveQuery } from "@/app/_components/use-live-query";
import {
  ARTICLE_STATUS_LABELS,
  BOOK_STATUS_LABELS,
  articleStatusTone,
  bookStatusTone,
  resolveCoverSrc,
} from "@/lib/domain/labels";
import type { Article, Book, LibraryItem } from "@/lib/domain/types";
import {
  listLibraryItems,
  type LibraryFilter,
} from "@/lib/repositories/library";

const FILTERS: { id: LibraryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "books", label: "Books" },
  { id: "articles", label: "Articles" },
];

function bookProgress(book: Book) {
  if (book.status === "want-to-read") return undefined;
  if (book.totalPages) {
    return {
      page: book.currentPage ?? 0,
      pages: book.totalPages,
    };
  }
  return { percent: book.progressPercent };
}

function bookStatusProps(book: Book) {
  if (book.status === "want-to-read") return {};
  return {
    status: BOOK_STATUS_LABELS[book.status],
    statusTone: bookStatusTone(book.status),
  };
}

function articleStatusProps(article: Article) {
  if (article.status === "saved") return {};
  return {
    status: ARTICLE_STATUS_LABELS[article.status],
    statusTone: articleStatusTone(article.status),
  };
}

function LibraryLoading() {
  return (
    <div className="mt-section space-y-4" aria-busy="true" aria-live="polite">
      <Skeleton variant="block" className="h-20" />
      <Skeleton variant="block" className="h-20" />
      <Skeleton variant="block" className="h-20" />
      <Skeleton variant="block" className="h-20" />
    </div>
  );
}

export default function LibraryPage() {
  const [filter, setFilter] = useState<LibraryFilter>("all");
  const [query, setQuery] = useState("");
  const { data: items, loading } = useLiveQuery<LibraryItem[]>(
    () => listLibraryItems(filter, query),
    [filter, query],
    [],
  );

  const empty = !loading && items.length === 0;

  return (
    <PageContainer className="py-section">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
        <SectionHeading
          id="library-heading"
          title="Library"
          action={
            <Button href="/library/books/new" size="sm">
              Add book
            </Button>
          }
          className="min-w-0 flex-1"
        />
        <Button
          href="/library/articles/new"
          size="sm"
          variant="quiet"
          className="shrink-0 self-start sm:self-end"
        >
          Add article
        </Button>
      </div>

      <div className="mt-section flex flex-col gap-4">
        <div className="max-w-content">
          <SearchInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search titles, authors…"
            aria-label="Search library"
          />
        </div>
        <div
          role="group"
          aria-label="Filter library"
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((item) => (
            <Button
              key={item.id}
              size="md"
              variant={filter === item.id ? "quiet" : "ghost"}
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-section">
        {loading ? (
          <LibraryLoading />
        ) : empty ? (
          <EmptyState
            icon={<BookIcon className="size-6" />}
            title={query ? "No matches" : "Nothing here yet"}
            description={
              query ? "Try a different word." : "Add your first book."
            }
            action={
              query ? (
                <Button variant="quiet" onClick={() => setQuery("")}>
                  Clear search
                </Button>
              ) : (
                <Button href="/library/books/new">Add a book</Button>
              )
            }
          />
        ) : (
          <ul className="flex max-w-content flex-col gap-4">
            {items.map((item) => (
              <li key={item.kind === "book" ? item.book.id : item.article.id}>
                {item.kind === "book" ? (
                  <BookCard
                    layout="row"
                    title={item.book.title}
                    author={item.book.author}
                    coverSrc={resolveCoverSrc(item.book.coverUrl)}
                    href={`/library/books/${item.book.id}/edit`}
                    {...bookStatusProps(item.book)}
                    progress={bookProgress(item.book)}
                  />
                ) : (
                  <ArticleCard
                    title={item.article.title}
                    source={item.article.siteName ?? item.article.author}
                    href={`/library/articles/${item.article.id}/edit`}
                    {...articleStatusProps(item.article)}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageContainer>
  );
}
