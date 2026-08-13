"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Button,
  ConfirmationDialog,
  ContentContainer,
  Input,
  SectionHeading,
  useToast,
} from "@/components";
import {
  FormActions,
  FormLoading,
  FormSection,
} from "@/app/_components/form-section";
import { navigateAfterSuccess } from "@/app/_components/navigate-after-success";
import { StatusField } from "@/app/_components/status-field";
import { BOOK_STATUS_LABELS } from "@/lib/domain/labels";
import {
  validateBookForm,
  type BookFormValues,
  type FieldErrors,
} from "@/lib/domain/validation";
import { deleteBook, getBook, updateBook } from "@/lib/repositories/books";

const STATUS_OPTIONS = (
  Object.entries(BOOK_STATUS_LABELS) as [string, string][]
).map(([value, label]) => ({ value, label }));

export default function EditBookPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { show } = useToast();
  const [values, setValues] = useState<BookFormValues | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    void getBook(id).then((book) => {
      if (!book) {
        setMissing(true);
        return;
      }
      setValues({
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl ?? "",
        status: book.status,
        currentPage: book.currentPage?.toString() ?? "",
        totalPages: book.totalPages?.toString() ?? "",
      });
    });
  }, [id]);

  if (missing) {
    return (
      <ContentContainer className="py-section">
        <SectionHeading
          title="Book not found"
          description="It may have been deleted."
          action={<Button href="/library">Back to library</Button>}
        />
      </ContentContainer>
    );
  }

  if (!values) {
    return (
      <ContentContainer className="py-section">
        <SectionHeading title="Edit book" />
        <FormLoading label="Loading book" />
      </ContentContainer>
    );
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!values) return;
    const result = validateBookForm(values);
    setErrors(result.errors);
    if (!result.data) return;

    setSaving(true);
    setSaved(false);
    try {
      await updateBook(id, result.data);
      show({ title: "Book updated" });
      setSaved(true);
      await navigateAfterSuccess(router, "/library");
    } catch {
      show({ title: "Could not update the book" });
      setSaving(false);
      setSaved(false);
    }
  }

  return (
    <ContentContainer className="py-section">
      <SectionHeading title="Edit book" />
      <form
        onSubmit={onSubmit}
        className="mt-block flex max-w-reading flex-col gap-block"
      >
        <FormSection legend="Identity">
          <Input
            label="Title"
            value={values.title}
            onChange={(e) =>
              setValues((v) => v && { ...v, title: e.target.value })
            }
            error={errors.title}
            required
          />
          <Input
            label="Author"
            value={values.author}
            onChange={(e) =>
              setValues((v) => v && { ...v, author: e.target.value })
            }
          />
        </FormSection>

        <FormSection legend="Reading">
          <StatusField
            label="Status"
            name="status"
            value={values.status}
            onChange={(status) => setValues((v) => v && { ...v, status })}
            options={STATUS_OPTIONS}
            error={errors.status}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Current page"
              type="number"
              inputMode="numeric"
              value={values.currentPage}
              onChange={(e) =>
                setValues((v) => v && { ...v, currentPage: e.target.value })
              }
              error={errors.currentPage}
            />
            <Input
              label="Total pages"
              type="number"
              inputMode="numeric"
              value={values.totalPages}
              onChange={(e) =>
                setValues((v) => v && { ...v, totalPages: e.target.value })
              }
              error={errors.totalPages}
            />
          </div>
        </FormSection>

        <FormSection legend="Optional">
          <Input
            label="Cover URL"
            value={values.coverUrl}
            onChange={(e) =>
              setValues((v) => v && { ...v, coverUrl: e.target.value })
            }
            description="Optional. Leave blank to use the default cover."
            error={errors.coverUrl}
          />
        </FormSection>

        <FormActions
          primary={
            <Button
              type="submit"
              loading={saving}
              loadingLabel={saved ? "Saved" : "Saving…"}
            >
              Save book
            </Button>
          }
          secondary={
            <Button href="/library" variant="ghost">
              Cancel
            </Button>
          }
          destructive={
            <Button
              type="button"
              variant="quiet"
              onClick={() => setConfirmOpen(true)}
            >
              Delete
            </Button>
          }
        />
      </form>

      <ConfirmationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete this book?"
        description="Captures from this book will be deleted too. This cannot be undone."
        confirmLabel="Delete book"
        confirming={deleting}
        onConfirm={() => {
          setDeleting(true);
          void deleteBook(id)
            .then(async () => {
              show({ title: "Book deleted" });
              await navigateAfterSuccess(router, "/library");
            })
            .catch(() => {
              show({ title: "Could not delete the book" });
              setDeleting(false);
              setConfirmOpen(false);
            });
        }}
      />
    </ContentContainer>
  );
}
