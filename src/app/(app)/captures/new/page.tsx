"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Button,
  ContentContainer,
  Input,
  SectionHeading,
  Textarea,
  useToast,
} from "@/components";
import { SourceSelectField } from "@/app/_components/source-select-field";
import type { Article, Book } from "@/lib/domain/types";
import {
  validateCaptureForm,
  type CaptureFormValues,
  type FieldErrors,
} from "@/lib/domain/validation";
import { listArticles } from "@/lib/repositories/articles";
import { listBooks } from "@/lib/repositories/books";
import { createCapture } from "@/lib/repositories/captures";

export default function NewCapturePage() {
  const router = useRouter();
  const { show } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [values, setValues] = useState<CaptureFormValues>({
    sourceType: "book",
    sourceId: "",
    text: "",
    note: "",
    pageNumber: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void Promise.all([listBooks(), listArticles()]).then(([b, a]) => {
      setBooks(b);
      setArticles(a);
    });
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = validateCaptureForm(values);
    setErrors(result.errors);
    if (!result.data) return;

    setSaving(true);
    try {
      const capture = await createCapture(result.data);
      show({ title: "Capture saved" });
      router.push(`/captures/${capture.id}/edit`);
    } catch {
      show({ title: "Could not save the capture" });
      setSaving(false);
    }
  }

  return (
    <ContentContainer className="py-section">
      <SectionHeading
        title="Add a capture"
        description="Attach a kept line to a book or an article already in your library."
      />
      <form onSubmit={onSubmit} className="mt-block flex max-w-reading flex-col gap-4">
        <SourceSelectField
          books={books}
          articles={articles}
          sourceType={values.sourceType}
          sourceId={values.sourceId}
          onSourceTypeChange={(sourceType) =>
            setValues((v) => ({ ...v, sourceType, pageNumber: "" }))
          }
          onSourceIdChange={(sourceId) => setValues((v) => ({ ...v, sourceId }))}
          sourceTypeError={errors.sourceType}
          sourceIdError={errors.sourceId}
        />
        <Textarea
          label="Capture text"
          value={values.text}
          onChange={(e) => setValues((v) => ({ ...v, text: e.target.value }))}
          error={errors.text}
          rows={5}
          required
        />
        <Textarea
          label="Note"
          value={values.note}
          onChange={(e) => setValues((v) => ({ ...v, note: e.target.value }))}
          description="Optional. Your own words about why this mattered."
          rows={3}
        />
        {values.sourceType === "book" ? (
          <Input
            label="Page number"
            type="number"
            inputMode="numeric"
            value={values.pageNumber}
            onChange={(e) =>
              setValues((v) => ({ ...v, pageNumber: e.target.value }))
            }
            error={errors.pageNumber}
          />
        ) : null}
        <div className="mt-2 flex flex-wrap gap-3">
          <Button type="submit" loading={saving} loadingLabel="Saving…">
            Save capture
          </Button>
          <Button href="/captures" variant="ghost">
            Cancel
          </Button>
        </div>
      </form>
    </ContentContainer>
  );
}
