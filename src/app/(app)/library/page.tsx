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
} from "@/components";
import { useLiveQuery } from "@/app/_components/use-live-query";
import {
  ARTICLE_STATUS_LABELS,
  BOOK_STATUS_LABELS,
  articleStatusTone,
  bookStatusTone,
  resolveCoverSrc,
} from "@/lib/domain/labels";
import type { LibraryItem } from "@/lib/domain/types";
import {
  listLibraryItems,
  type LibraryFilter,
} from "@/lib/repositories/library";

const FILTERS: { id: LibraryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "books", label: "Books" },
  { id: "articles", label: "Articles" },
];

export default function LibraryPage() {
  const [filter, setFilter] = useState<LibraryFilter>("all");
  const [query, setQuery] = useState("");
  const { data: items, loading } = useLiveQuery<LibraryItem[]>(
    () => listLibraryItems(filter, query),
    [filter, query],
    [],
  );

  return (
    <PageContainer className="py-section">
      <SectionHeading
        title="Library"
        description="Books and articles together. Search titles, authors and URLs."
        action={
          <div className="flex flex-wrap gap-2">
            <Button href="/library/books/new" size="sm">
              Add book
            </Button>
            <Button href="/library/articles/new" size="sm" variant="quiet">
              Add article
            </Button>
          </div>
        }
      />

      <div className="mt-block flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <SearchInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search titles, authors, URLs…"
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
              size="sm"
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
        {!loading && items.length === 0 ? (
          <EmptyState
            icon={<BookIcon className="size-6" />}
            title={query ? "No matches" : "Nothing in the library yet"}
            description={
              query
                ? "Try a different word, or clear the search."
                : "Add a book or an article. What you save stays on this device."
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
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.kind === "book" ? item.book.id : item.article.id}>
                {item.kind === "book" ? (
                  <BookCard
                    title={item.book.title}
                    author={item.book.author}
                    coverSrc={resolveCoverSrc(item.book.coverUrl)}
                    href={`/library/books/${item.book.id}/edit`}
                    status={BOOK_STATUS_LABELS[item.book.status]}
                    statusTone={bookStatusTone(item.book.status)}
                    progress={
                      item.book.status === "want-to-read"
                        ? undefined
                        : item.book.totalPages
                          ? {
                              page: item.book.currentPage ?? 0,
                              pages: item.book.totalPages,
                            }
                          : { percent: item.book.progressPercent }
                    }
                  />
                ) : (
                  <ArticleCard
                    title={item.article.title}
                    source={item.article.siteName ?? item.article.author}
                    excerpt={item.article.url}
                    href={`/library/articles/${item.article.id}/edit`}
                    status={ARTICLE_STATUS_LABELS[item.article.status]}
                    statusTone={articleStatusTone(item.article.status)}
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
