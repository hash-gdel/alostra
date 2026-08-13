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
import {
  FormActions,
  FormSection,
} from "@/app/_components/form-section";
import { navigateAfterSuccess } from "@/app/_components/navigate-after-success";
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
  const [saved, setSaved] = useState(false);

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
    setSaved(false);
    try {
      await createCapture(result.data);
      show({ title: "Capture saved" });
      setSaved(true);
      await navigateAfterSuccess(router, "/captures");
    } catch {
      show({ title: "Could not save the capture" });
      setSaving(false);
      setSaved(false);
    }
  }

  return (
    <ContentContainer className="py-section">
      <SectionHeading title="Add a capture" />
      <form
        onSubmit={onSubmit}
        className="mt-block flex max-w-reading flex-col gap-block"
      >
        <FormSection legend="Source">
          <SourceSelectField
            books={books}
            articles={articles}
            sourceType={values.sourceType}
            sourceId={values.sourceId}
            onSourceTypeChange={(sourceType) =>
              setValues((v) => ({ ...v, sourceType, pageNumber: "" }))
            }
            onSourceIdChange={(sourceId) =>
              setValues((v) => ({ ...v, sourceId }))
            }
            sourceTypeError={errors.sourceType}
            sourceIdError={errors.sourceId}
          />
        </FormSection>

        <FormSection legend="Passage">
          <Textarea
            label="Passage"
            value={values.text}
            onChange={(e) => setValues((v) => ({ ...v, text: e.target.value }))}
            error={errors.text}
            rows={7}
            required
          />
        </FormSection>

        <FormSection legend="Reflection">
          <Textarea
            label="Note"
            value={values.note}
            onChange={(e) => setValues((v) => ({ ...v, note: e.target.value }))}
            description="Optional"
            rows={3}
          />
          {values.sourceType === "book" ? (
            <Input
              label="Page"
              type="number"
              inputMode="numeric"
              value={values.pageNumber}
              onChange={(e) =>
                setValues((v) => ({ ...v, pageNumber: e.target.value }))
              }
              error={errors.pageNumber}
            />
          ) : null}
        </FormSection>

        <FormActions
          primary={
            <Button
              type="submit"
              loading={saving}
              loadingLabel={saved ? "Saved" : "Saving…"}
            >
              Save capture
            </Button>
          }
          secondary={
            <Button href="/captures" variant="ghost">
              Cancel
            </Button>
          }
        />
      </form>
    </ContentContainer>
  );
}
