"use client";

import { useState } from "react";
import {
  Button,
  CaptureCard,
  EmptyState,
  HighlightIcon,
  PageContainer,
  SearchInput,
  SectionHeading,
} from "@/components";
import { useLiveQuery } from "@/app/_components/use-live-query";
import { captureMatchesQuery } from "@/lib/domain/search";
import {
  listCapturesWithSources,
  type CaptureWithSource,
} from "@/lib/repositories/captures";

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

  return (
    <PageContainer className="py-section">
      <SectionHeading
        title="Captures"
        description="Lines and notes kept from books and articles, in one place."
        action={
          <Button href="/captures/new" size="sm">
            Add capture
          </Button>
        }
      />

      <div className="mt-block max-w-content">
        <SearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search capture text and sources…"
        />
      </div>

      <div className="mt-section">
        {!loading && visible.length === 0 ? (
          <EmptyState
            icon={<HighlightIcon className="size-6" />}
            title={query ? "No matching captures" : "No captures yet"}
            description={
              query
                ? "Try another word, or clear the search."
                : "Keep a line from a book or article and it will appear here."
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
          <ul className="grid max-w-content gap-4">
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
    </PageContainer>
  );
}
