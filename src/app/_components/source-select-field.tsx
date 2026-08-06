"use client";

import { useId } from "react";
import { Label } from "@/components";
import type { Article, Book } from "@/lib/domain/types";

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
  const options =
    sourceType === "article"
      ? articles.map((article) => ({
          value: article.id,
          label: article.title,
        }))
      : books.map((book) => ({
          value: book.id,
          label: book.author ? `${book.title} — ${book.author}` : book.title,
        }));

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={typeId}>Source type</Label>
        <select
          id={typeId}
          value={sourceType}
          onChange={(event) => {
            onSourceTypeChange(event.target.value);
            onSourceIdChange("");
          }}
          aria-invalid={sourceTypeError ? true : undefined}
          className={[
            "h-11 w-full rounded-md border bg-surface px-3 text-base",
            sourceTypeError ? "border-border-strong" : "border-border",
          ].join(" ")}
        >
          <option value="book">Book</option>
          <option value="article">Article</option>
        </select>
        {sourceTypeError ? (
          <p className="text-xs text-foreground">{sourceTypeError}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={sourceFieldId}>
          {sourceType === "article" ? "Article" : "Book"}
        </Label>
        <select
          id={sourceFieldId}
          value={sourceId}
          onChange={(event) => onSourceIdChange(event.target.value)}
          aria-invalid={sourceIdError ? true : undefined}
          className={[
            "h-11 w-full rounded-md border bg-surface px-3 text-base",
            sourceIdError ? "border-border-strong" : "border-border",
          ].join(" ")}
        >
          <option value="">
            {options.length === 0
              ? "Nothing to attach to yet"
              : "Choose a source"}
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
