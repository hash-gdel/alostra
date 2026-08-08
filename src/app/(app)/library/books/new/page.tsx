"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Button,
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
import { createBook } from "@/lib/repositories/books";

const STATUS_OPTIONS = (
  Object.entries(BOOK_STATUS_LABELS) as [string, string][]
).map(([value, label]) => ({ value, label }));

export default function NewBookPage() {
  const router = useRouter();
  const { show } = useToast();
  const [values, setValues] = useState<BookFormValues>({
    title: "",
    author: "",
    coverUrl: "",
    status: "want-to-read",
    currentPage: "",
    totalPages: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = validateBookForm(values);
    setErrors(result.errors);
    if (!result.data) return;

    setSaving(true);
    try {
      const book = await createBook(result.data);
      show({ title: "Book added" });
      router.push(`/library/books/${book.id}/edit`);
    } catch {
      show({ title: "Could not save the book" });
      setSaving(false);
    }
  }

  return (
    <ContentContainer className="py-section">
      <SectionHeading
        title="Add a book"
        description="Title is required. Progress is calculated from pages when you provide them."
      />
      <form onSubmit={onSubmit} className="mt-block flex max-w-reading flex-col gap-4">
        <Input
          label="Title"
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          error={errors.title}
          required
        />
        <Input
          label="Author"
          value={values.author}
          onChange={(e) => setValues((v) => ({ ...v, author: e.target.value }))}
        />
        <StatusField
          label="Status"
          name="status"
          value={values.status}
          onChange={(status) => setValues((v) => ({ ...v, status }))}
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
              setValues((v) => ({ ...v, currentPage: e.target.value }))
            }
            error={errors.currentPage}
          />
          <Input
            label="Total pages"
            type="number"
            inputMode="numeric"
            value={values.totalPages}
            onChange={(e) =>
              setValues((v) => ({ ...v, totalPages: e.target.value }))
            }
            error={errors.totalPages}
          />
        </div>
        <Input
          label="Cover URL"
          value={values.coverUrl}
          onChange={(e) =>
            setValues((v) => ({ ...v, coverUrl: e.target.value }))
          }
          description="Optional. Remote covers are stored but not shown until a host is configured."
          error={errors.coverUrl}
        />
        <div className="mt-2 flex flex-wrap gap-3">
          <Button type="submit" loading={saving} loadingLabel="Saving…">
            Save book
          </Button>
          <Button href="/library" variant="ghost">
            Cancel
          </Button>
        </div>
      </form>
    </ContentContainer>
  );
}
