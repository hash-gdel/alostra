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
        <p className="text-sm text-muted-foreground">Loading book…</p>
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
    try {
      await updateBook(id, result.data);
      show({ title: "Book updated" });
      router.push("/library");
    } catch {
      show({ title: "Could not update the book" });
      setSaving(false);
    }
  }

  return (
    <ContentContainer className="py-section">
      <SectionHeading
        title="Edit book"
        description="Changing the current page recalculates progress. Finished sets progress to 100%."
      />
      <form onSubmit={onSubmit} className="mt-block flex max-w-reading flex-col gap-4">
        <Input
          label="Title"
          value={values.title}
          onChange={(e) => setValues((v) => v && { ...v, title: e.target.value })}
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
        <Input
          label="Cover URL"
          value={values.coverUrl}
          onChange={(e) =>
            setValues((v) => v && { ...v, coverUrl: e.target.value })
          }
          description="Optional. Remote covers are stored but not shown until a host is configured."
          error={errors.coverUrl}
        />
        <div className="mt-2 flex flex-wrap gap-3">
          <Button type="submit" loading={saving} loadingLabel="Saving…">
            Save changes
          </Button>
          <Button href="/library" variant="ghost">
            Cancel
          </Button>
          <Button
            type="button"
            variant="quiet"
            onClick={() => setConfirmOpen(true)}
          >
            Delete book
          </Button>
        </div>
      </form>

      <ConfirmationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete this book?"
        description="Captures attached to it will be deleted too. This cannot be undone."
        confirmLabel="Delete book"
        confirming={deleting}
        onConfirm={() => {
          setDeleting(true);
          void deleteBook(id)
            .then(() => {
              show({ title: "Book deleted" });
              router.push("/library");
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
