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
import { ARTICLE_STATUS_LABELS } from "@/lib/domain/labels";
import {
  validateArticleForm,
  type ArticleFormValues,
  type FieldErrors,
} from "@/lib/domain/validation";
import {
  deleteArticle,
  getArticle,
  updateArticle,
} from "@/lib/repositories/articles";

const STATUS_OPTIONS = (
  Object.entries(ARTICLE_STATUS_LABELS) as [string, string][]
).map(([value, label]) => ({ value, label }));

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { show } = useToast();
  const [values, setValues] = useState<ArticleFormValues | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    void getArticle(id).then((article) => {
      if (!article) {
        setMissing(true);
        return;
      }
      setValues({
        title: article.title,
        url: article.url,
        author: article.author ?? "",
        siteName: article.siteName ?? "",
        status: article.status,
      });
    });
  }, [id]);

  if (missing) {
    return (
      <ContentContainer className="py-section">
        <SectionHeading
          title="Article not found"
          description="It may have been deleted."
          action={<Button href="/library">Back to library</Button>}
        />
      </ContentContainer>
    );
  }

  if (!values) {
    return (
      <ContentContainer className="py-section">
        <p className="text-sm text-muted-foreground">Loading article…</p>
      </ContentContainer>
    );
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!values) return;
    const result = validateArticleForm(values);
    setErrors(result.errors);
    if (!result.data) return;

    setSaving(true);
    try {
      await updateArticle(id, result.data);
      show({ title: "Article updated" });
      router.push("/library");
    } catch {
      show({ title: "Could not update the article" });
      setSaving(false);
    }
  }

  return (
    <ContentContainer className="py-section">
      <SectionHeading
        title="Edit article"
        description="Finished sets progress to 100%. Article text is not stored in this milestone."
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
          label="URL"
          type="url"
          value={values.url}
          onChange={(e) => setValues((v) => v && { ...v, url: e.target.value })}
          error={errors.url}
          required
        />
        <Input
          label="Author"
          value={values.author}
          onChange={(e) =>
            setValues((v) => v && { ...v, author: e.target.value })
          }
        />
        <Input
          label="Site name"
          value={values.siteName}
          onChange={(e) =>
            setValues((v) => v && { ...v, siteName: e.target.value })
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
            Delete article
          </Button>
        </div>
      </form>

      <ConfirmationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete this article?"
        description="Captures attached to it will be deleted too. This cannot be undone."
        confirmLabel="Delete article"
        confirming={deleting}
        onConfirm={() => {
          setDeleting(true);
          void deleteArticle(id)
            .then(() => {
              show({ title: "Article deleted" });
              router.push("/library");
            })
            .catch(() => {
              show({ title: "Could not delete the article" });
              setDeleting(false);
              setConfirmOpen(false);
            });
        }}
      />
    </ContentContainer>
  );
}
