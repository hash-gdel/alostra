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
import { navigateAfterSuccess } from "@/app/_components/navigate-after-success";
import { StatusField } from "@/app/_components/status-field";
import { ARTICLE_STATUS_LABELS } from "@/lib/domain/labels";
import {
  validateArticleForm,
  type ArticleFormValues,
  type FieldErrors,
} from "@/lib/domain/validation";
import { createArticle } from "@/lib/repositories/articles";

const STATUS_OPTIONS = (
  Object.entries(ARTICLE_STATUS_LABELS) as [string, string][]
).map(([value, label]) => ({ value, label }));

export default function NewArticlePage() {
  const router = useRouter();
  const { show } = useToast();
  const [values, setValues] = useState<ArticleFormValues>({
    title: "",
    url: "",
    author: "",
    siteName: "",
    status: "saved",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = validateArticleForm(values);
    setErrors(result.errors);
    if (!result.data) return;

    setSaving(true);
    setSaved(false);
    try {
      await createArticle(result.data);
      show({ title: "Article added" });
      setSaved(true);
      await navigateAfterSuccess(router, "/library");
    } catch {
      show({ title: "Could not save the article" });
      setSaving(false);
      setSaved(false);
    }
  }

  return (
    <ContentContainer className="py-section">
      <SectionHeading
        title="Add an article"
        description="Title and URL are required. The article is saved as a reference — content is not extracted in this milestone."
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
          label="URL"
          type="url"
          value={values.url}
          onChange={(e) => setValues((v) => ({ ...v, url: e.target.value }))}
          error={errors.url}
          required
        />
        <Input
          label="Author"
          value={values.author}
          onChange={(e) => setValues((v) => ({ ...v, author: e.target.value }))}
        />
        <Input
          label="Site name"
          value={values.siteName}
          onChange={(e) =>
            setValues((v) => ({ ...v, siteName: e.target.value }))
          }
        />
        <StatusField
          label="Status"
          name="status"
          value={values.status}
          onChange={(status) => setValues((v) => ({ ...v, status }))}
          options={STATUS_OPTIONS}
          error={errors.status}
        />
        <div className="mt-2 flex flex-wrap gap-3">
          <Button
            type="submit"
            loading={saving}
            loadingLabel={saved ? "Saved" : "Saving…"}
          >
            Save article
          </Button>
          <Button href="/library" variant="ghost">
            Cancel
          </Button>
        </div>
      </form>
    </ContentContainer>
  );
}
