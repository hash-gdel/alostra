"use client";

import {
  ArticleCard,
  BookCard,
  BookIcon,
  Button,
  CaptureCard,
  ContinueReadingCard,
  EmptyState,
  PageContainer,
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
  getContinueReading,
  listRecentlyAdded,
} from "@/lib/repositories/library";
import { listCapturesWithSources } from "@/lib/repositories/captures";

type HomeData = {
  continueItem?: LibraryItem;
  recent: LibraryItem[];
  captures: Awaited<ReturnType<typeof listCapturesWithSources>>;
};

async function loadHome(): Promise<HomeData> {
  const [continueItem, recent, captures] = await Promise.all([
    getContinueReading(),
    listRecentlyAdded(6),
    listCapturesWithSources(),
  ]);
  return {
    continueItem,
    recent,
    captures: captures.slice(0, 4),
  };
}

export default function HomePage() {
  const { data, loading } = useLiveQuery(loadHome, [], {
    continueItem: undefined,
    recent: [],
    captures: [],
  });

  const { continueItem, recent, captures } = data;
  const empty =
    !loading && !continueItem && recent.length === 0 && captures.length === 0;

  return (
    <PageContainer className="py-section">
      <header className="max-w-content">
        <p className="text-2xs font-medium uppercase tracking-label text-muted-foreground">
          Home
        </p>
        <h1 className="mt-2 font-serif text-3xl tracking-display text-balance">
          Continue where you left off
        </h1>
        <p className="mt-3 max-w-reading text-base text-muted-foreground text-pretty">
          Your books, articles and the lines worth keeping — in one place.
        </p>
      </header>

      {empty ? (
        <div className="mt-section">
          <EmptyState
            icon={<BookIcon className="size-6" />}
            title="Your reading corner is empty"
            description="Add a book or an article to begin. What you save stays private to your account."
            action={<Button href="/library">Open the library</Button>}
          />
        </div>
      ) : (
        <div className="mt-section space-y-section">
          <section aria-labelledby="continue-heading">
            <SectionHeading
              id="continue-heading"
              title="Continue reading"
              description="The thing you are most likely here for."
            />
            <div className="mt-block">
              {continueItem ? (
                continueItem.kind === "book" ? (
                  <ContinueReadingCard
                    title={continueItem.book.title}
                    author={continueItem.book.author}
                    coverSrc={resolveCoverSrc(continueItem.book.coverUrl)}
                    href={`/library/books/${continueItem.book.id}/edit`}
                    progress={
                      continueItem.book.totalPages
                        ? {
                            page: continueItem.book.currentPage ?? 0,
                            pages: continueItem.book.totalPages,
                          }
                        : { percent: continueItem.book.progressPercent }
                    }
                    actionLabel="Update progress"
                  />
                ) : (
                  <ContinueReadingCard
                    title={continueItem.article.title}
                    author={
                      continueItem.article.author ??
                      continueItem.article.siteName
                    }
                    href={`/library/articles/${continueItem.article.id}/edit`}
                    progress={
                      continueItem.article.progressPercent != null
                        ? { percent: continueItem.article.progressPercent }
                        : undefined
                    }
                    actionLabel="Open details"
                  />
                )
              ) : (
                <EmptyState
                  headingLevel={3}
                  title="Nothing in progress"
                  description="Mark a book or article as reading and it will appear here."
                  action={<Button href="/library">Browse the library</Button>}
                />
              )}
            </div>
          </section>

          <section aria-labelledby="recent-heading">
            <SectionHeading
              id="recent-heading"
              title="Recently added"
              action={
                <Button href="/library" variant="quiet" size="sm">
                  Library
                </Button>
              }
            />
            <div className="mt-block grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((item) =>
                item.kind === "book" ? (
                  <BookCard
                    key={item.book.id}
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
                    key={item.article.id}
                    title={item.article.title}
                    source={item.article.siteName ?? item.article.author}
                    excerpt={item.article.url}
                    href={`/library/articles/${item.article.id}/edit`}
                    status={ARTICLE_STATUS_LABELS[item.article.status]}
                    statusTone={articleStatusTone(item.article.status)}
                  />
                ),
              )}
            </div>
          </section>

          <section aria-labelledby="captures-heading">
            <SectionHeading
              id="captures-heading"
              title="Recent captures"
              action={
                <Button href="/captures" variant="quiet" size="sm">
                  All captures
                </Button>
              }
            />
            <div className="mt-block grid gap-4">
              {captures.length === 0 ? (
                <EmptyState
                  headingLevel={3}
                  title="No captures yet"
                  description="Keep a line from a book or article and it will show up here."
                  action={<Button href="/captures/new">Add a capture</Button>}
                />
              ) : (
                captures.map(({ capture, sourceTitle, sourceDetail }) => (
                  <CaptureCard
                    key={capture.id}
                    quote={capture.text}
                    sourceTitle={sourceTitle}
                    sourceType={capture.sourceType}
                    sourceDetail={sourceDetail}
                    note={capture.note}
                    href={`/captures/${capture.id}/edit`}
                  />
                ))
              )}
            </div>
          </section>
        </div>
      )}
    </PageContainer>
  );
}
