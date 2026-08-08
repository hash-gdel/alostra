"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Button,
  ConfirmationDialog,
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
import {
  deleteCapture,
  getCapture,
  updateCapture,
} from "@/lib/repositories/captures";

export default function EditCapturePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { show } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [values, setValues] = useState<CaptureFormValues | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    void Promise.all([getCapture(id), listBooks(), listArticles()]).then(
      ([capture, bookList, articleList]) => {
        setBooks(bookList);
        setArticles(articleList);
        if (!capture) {
          setMissing(true);
          return;
        }
        setValues({
          sourceType: capture.sourceType,
          sourceId: capture.sourceId,
          text: capture.text,
          note: capture.note ?? "",
          pageNumber: capture.pageNumber?.toString() ?? "",
        });
      },
    );
  }, [id]);

  if (missing) {
    return (
      <ContentContainer className="py-section">
        <SectionHeading
          title="Capture not found"
          description="It may have been deleted."
          action={<Button href="/captures">Back to captures</Button>}
        />
      </ContentContainer>
    );
  }

  if (!values) {
    return (
      <ContentContainer className="py-section">
        <p className="text-sm text-muted-foreground">Loading capture…</p>
      </ContentContainer>
    );
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!values) return;
    const result = validateCaptureForm(values);
    setErrors(result.errors);
    if (!result.data) return;

    setSaving(true);
    try {
      await updateCapture(id, result.data);
      show({ title: "Capture updated" });
      router.push("/captures");
    } catch {
      show({ title: "Could not update the capture" });
      setSaving(false);
    }
  }

  return (
    <ContentContainer className="py-section">
      <SectionHeading
        title="Edit capture"
        description="The source stays visible so you can always tell where a line came from."
      />
      <form onSubmit={onSubmit} className="mt-block flex max-w-reading flex-col gap-4">
        <SourceSelectField
          books={books}
          articles={articles}
          sourceType={values.sourceType}
          sourceId={values.sourceId}
          onSourceTypeChange={(sourceType) =>
            setValues((v) => v && { ...v, sourceType, pageNumber: "" })
          }
          onSourceIdChange={(sourceId) =>
            setValues((v) => v && { ...v, sourceId })
          }
          sourceTypeError={errors.sourceType}
          sourceIdError={errors.sourceId}
        />
        <Textarea
          label="Capture text"
          value={values.text}
          onChange={(e) =>
            setValues((v) => v && { ...v, text: e.target.value })
          }
          error={errors.text}
          rows={5}
          required
        />
        <Textarea
          label="Note"
          value={values.note}
          onChange={(e) =>
            setValues((v) => v && { ...v, note: e.target.value })
          }
          rows={3}
        />
        {values.sourceType === "book" ? (
          <Input
            label="Page number"
            type="number"
            inputMode="numeric"
            value={values.pageNumber}
            onChange={(e) =>
              setValues((v) => v && { ...v, pageNumber: e.target.value })
            }
            error={errors.pageNumber}
          />
        ) : null}
        <div className="mt-2 flex flex-wrap gap-3">
          <Button type="submit" loading={saving} loadingLabel="Saving…">
            Save changes
          </Button>
          <Button href="/captures" variant="ghost">
            Cancel
          </Button>
          <Button
            type="button"
            variant="quiet"
            onClick={() => setConfirmOpen(true)}
          >
            Delete capture
          </Button>
        </div>
      </form>

      <ConfirmationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete this capture?"
        description="This cannot be undone."
        confirmLabel="Delete capture"
        confirming={deleting}
        onConfirm={() => {
          setDeleting(true);
          void deleteCapture(id)
            .then(() => {
              show({ title: "Capture deleted" });
              router.push("/captures");
            })
            .catch(() => {
              show({ title: "Could not delete the capture" });
              setDeleting(false);
              setConfirmOpen(false);
            });
        }}
      />
    </ContentContainer>
  );
}
