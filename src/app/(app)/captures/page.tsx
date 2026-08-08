"use client";

import { useState } from "react";
import {
  Button,
  CaptureCard,
  ContentContainer,
  EmptyState,
  HighlightIcon,
  SearchInput,
  SectionHeading,
  Skeleton,
} from "@/components";
import { useLiveQuery } from "@/app/_components/use-live-query";
import { captureMatchesQuery } from "@/lib/domain/search";
import {
  listCapturesWithSources,
  type CaptureWithSource,
} from "@/lib/repositories/captures";

function CapturesLoading() {
  return (
    <div className="mt-section space-y-5" aria-busy="true" aria-live="polite">
      <Skeleton variant="block" className="h-28" />
      <Skeleton variant="block" className="h-28" />
      <Skeleton variant="block" className="h-28" />
    </div>
  );
}

export default function CapturesPage() {
  const [query, setQuery] = useState("");
  const { data: items, loading } = useLiveQuery<CaptureWithSource[]>(
    () => listCapturesWithSources(),
    [],
    [],
  );

  const visible = items.filter(
    ({ capture, sourceTitle, sourceDetail }) =>
      captureMatchesQuery(capture, query) ||
      sourceTitle.toLowerCase().includes(query.trim().toLowerCase()) ||
      (sourceDetail ?? "").toLowerCase().includes(query.trim().toLowerCase()),
  );

  const empty = !loading && visible.length === 0;

  return (
    <ContentContainer className="py-section">
      <SectionHeading
        id="captures-heading"
        title="Captures"
        action={
          <Button href="/captures/new" size="sm">
            Add capture
          </Button>
        }
      />

      <div className="mt-section">
        <SearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search passages and sources…"
          aria-label="Search captures"
        />
      </div>

      <div className="mt-section">
        {loading ? (
          <CapturesLoading />
        ) : empty ? (
          <EmptyState
            icon={<HighlightIcon className="size-6" />}
            title={query ? "No matching captures" : "No captures yet"}
            description={
              query
                ? "Try another word, or clear the search."
                : "Keep a line from a book or article."
            }
            action={
              query ? (
                <Button variant="quiet" onClick={() => setQuery("")}>
                  Clear search
                </Button>
              ) : (
                <Button href="/captures/new">Add a capture</Button>
              )
            }
          />
        ) : (
          <ul className="flex flex-col gap-5">
            {visible.map(({ capture, sourceTitle, sourceDetail }) => (
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
        )}
      </div>
    </ContentContainer>
  );
}
