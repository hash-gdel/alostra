"use client";

import { useId } from "react";
import { Label } from "@/components";
import type { Article, Book } from "@/lib/domain/types";

const selectClasses = (invalid: boolean) =>
  [
    "h-11 w-full rounded-md border bg-surface px-3 text-base text-foreground",
    "transition-colors duration-(--duration-quick) ease-standard",
    "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-muted-foreground",
    invalid ? "border-border-strong" : "border-border",
  ].join(" ");

/**
 * Native selects for attaching a capture to a book or article.
 * App-local — there is no Select primitive in the frozen component library.
 */
export function SourceSelectField({
  books,
  articles,
  sourceType,
  sourceId,
  onSourceTypeChange,
  onSourceIdChange,
  sourceTypeError,
  sourceIdError,
}: {
  books: Book[];
  articles: Article[];
  sourceType: string;
  sourceId: string;
  onSourceTypeChange: (value: string) => void;
  onSourceIdChange: (value: string) => void;
  sourceTypeError?: string;
  sourceIdError?: string;
}) {
  const typeId = useId();
  const sourceFieldId = useId();
  const isArticle = sourceType === "article";
  const options = isArticle
    ? articles.map((article) => ({
        value: article.id,
        label: article.title,
      }))
    : books.map((book) => ({
        value: book.id,
        label: book.author ? `${book.title} — ${book.author}` : book.title,
      }));

  const emptyLabel = isArticle ? "No articles yet" : "No books yet";
  const chooseLabel = isArticle ? "Choose an article" : "Choose a book";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={typeId}>From</Label>
        <select
          id={typeId}
          value={sourceType}
          onChange={(event) => {
            onSourceTypeChange(event.target.value);
            onSourceIdChange("");
          }}
          aria-invalid={sourceTypeError ? true : undefined}
          className={selectClasses(Boolean(sourceTypeError))}
        >
          <option value="book">Book</option>
          <option value="article">Article</option>
        </select>
        {sourceTypeError ? (
          <p className="text-xs text-foreground">{sourceTypeError}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={sourceFieldId}>{isArticle ? "Article" : "Book"}</Label>
        <select
          id={sourceFieldId}
          value={sourceId}
          onChange={(event) => onSourceIdChange(event.target.value)}
          aria-invalid={sourceIdError ? true : undefined}
          className={selectClasses(Boolean(sourceIdError))}
        >
          <option value="">
            {options.length === 0 ? emptyLabel : chooseLabel}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {sourceIdError ? (
          <p className="text-xs text-foreground">{sourceIdError}</p>
        ) : null}
      </div>
    </div>
  );
}
