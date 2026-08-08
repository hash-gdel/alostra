"use client";

import {
  ArticleCard,
  BookCard,
  BookIcon,
  Button,
  CaptureCard,
  ContinueReadingCard,
  ContentContainer,
  EmptyState,
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

function HomeLoading() {
  return (
    <div className="mt-section space-y-section" aria-busy="true" aria-live="polite">
      <section aria-labelledby="continue-heading">
        <h1
          id="continue-heading"
          className="font-serif text-3xl tracking-display text-balance"
        >
          Continue reading
        </h1>
        <div className="mt-block flex gap-5">
          <Skeleton variant="cover" className="w-24 shrink-0 sm:w-32" />
          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton lines={2} />
            <Skeleton variant="block" className="h-2 max-w-80" />
            <Skeleton variant="block" className="h-10 w-28" />
          </div>
        </div>
      </section>
      <section aria-labelledby="recent-heading">
        <SectionHeading id="recent-heading" title="Recently added" />
        <div className="mt-block space-y-4">
          <Skeleton variant="block" className="h-20" />
          <Skeleton variant="block" className="h-20" />
          <Skeleton variant="block" className="h-20" />
        </div>
      </section>
      <section aria-labelledby="captures-heading">
        <SectionHeading id="captures-heading" title="Recent captures" />
        <div className="mt-block space-y-4">
          <Skeleton variant="block" className="h-28" />
          <Skeleton variant="block" className="h-28" />
        </div>
      </section>
    </div>
  );
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
    <ContentContainer className="py-section">
      {loading ? (
        <HomeLoading />
      ) : empty ? (
        <div className="mt-block">
          <EmptyState
            icon={<BookIcon className="size-6" />}
            title="Nothing here yet"
            description="Add a book or an article to begin."
            action={<Button href="/library">Open the library</Button>}
          />
        </div>
      ) : (
        <div className="space-y-section">
          <section aria-labelledby="continue-heading">
            <h1
              id="continue-heading"
              className="font-serif text-3xl tracking-display text-balance"
            >
              Continue reading
            </h1>
            <div className="mt-block">
              {continueItem ? (
                continueItem.kind === "book" ? (
                  <ContinueReadingCard
                    title={continueItem.book.title}
                    author={continueItem.book.author}
                    coverSrc={resolveCoverSrc(continueItem.book.coverUrl)}
                    href={`/library/books/${continueItem.book.id}/edit`}
                    progress={bookProgress(continueItem.book)}
                    actionLabel="Continue"
                    className="[&_span.tracking-label]:hidden"
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
                    actionLabel="Continue"
                    className="[&_span.tracking-label]:hidden"
                  />
                )
              ) : (
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 text-sm text-muted-foreground">
                  <span>Nothing in progress.</span>
                  <Button href="/library" variant="quiet" size="sm">
                    Library
                  </Button>
                </div>
              )}
            </div>
          </section>

          {recent.length > 0 ? (
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
              <ul className="mt-block flex flex-col gap-4">
                {recent.map((item) =>
                  item.kind === "book" ? (
                    <li key={item.book.id}>
                      <BookCard
                        layout="row"
                        title={item.book.title}
                        author={item.book.author}
                        coverSrc={resolveCoverSrc(item.book.coverUrl)}
                        href={`/library/books/${item.book.id}/edit`}
                        {...bookStatusProps(item.book)}
                        progress={bookProgress(item.book)}
                      />
                    </li>
                  ) : (
                    <li key={item.article.id}>
                      <ArticleCard
                        title={item.article.title}
                        source={
                          item.article.siteName ?? item.article.author
                        }
                        href={`/library/articles/${item.article.id}/edit`}
                        {...articleStatusProps(item.article)}
                      />
                    </li>
                  ),
                )}
              </ul>
            </section>
          ) : null}

          {captures.length > 0 ? (
            <section aria-labelledby="captures-heading">
              <SectionHeading
                id="captures-heading"
                title="Recent captures"
                action={
                  <Button href="/captures" variant="quiet" size="sm">
                    Captures
                  </Button>
                }
              />
              <ul className="mt-block flex flex-col gap-4">
                {captures.map(({ capture, sourceTitle, sourceDetail }) => (
                  <li key={capture.id}>
                    <CaptureCard
                      quote={capture.text}
                      sourceTitle={sourceTitle}
                      sourceType={capture.sourceType}
                      sourceDetail={sourceDetail}
                      note={capture.note}
                      href={`/captures/${capture.id}/edit`}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-labelledby="library-entry-heading" className="pt-block">
            <h2
              id="library-entry-heading"
              className="font-serif text-lg tracking-display"
            >
              Your Library
            </h2>
            <p className="mt-2 max-w-reading text-sm text-muted-foreground text-pretty">
              Books and articles in one place.
            </p>
            <div className="mt-block">
              <Button href="/library" variant="quiet">
                Open library
              </Button>
            </div>
          </section>
        </div>
      )}
    </ContentContainer>
  );
}
