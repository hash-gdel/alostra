import { createId, nowIso } from "@/lib/db/ids";
import { computeArticleProgress } from "@/lib/domain/progress";
import type { Article, ArticleInput, ArticleStatus } from "@/lib/domain/types";
import {
  articleFromRow,
  articleToRow,
  type ArticleRow,
} from "@/lib/repositories/mappers";
import { requireUser } from "@/lib/repositories/require-user";

export async function listArticles(): Promise<Article[]> {
  const { client, userId } = await requireUser();
  const { data, error } = await client
    .from("articles")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data as ArticleRow[]).map(articleFromRow);
}

export async function getArticle(id: string): Promise<Article | undefined> {
  const { client, userId } = await requireUser();
  const { data, error } = await client
    .from("articles")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ? articleFromRow(data as ArticleRow) : undefined;
}

export async function createArticle(input: ArticleInput): Promise<Article> {
  const { client, userId } = await requireUser();
  const status = input.status ?? "saved";
  const now = nowIso();
  const article: Article = {
    id: createId(),
    title: input.title.trim(),
    url: input.url.trim(),
    author: input.author?.trim() || undefined,
    siteName: input.siteName?.trim() || undefined,
    status,
    progressPercent: computeArticleProgress({
      status,
      progressPercent: input.progressPercent,
    }),
    createdAt: now,
    updatedAt: now,
  };
  const { error } = await client
    .from("articles")
    .insert(articleToRow(article, userId));
  if (error) throw error;
  return article;
}

export async function updateArticle(
  id: string,
  input: Partial<ArticleInput> & {
    status?: ArticleStatus;
    lastOpenedAt?: string;
  },
): Promise<Article> {
  const { client, userId } = await requireUser();
  const existing = await getArticle(id);
  if (!existing) throw new Error(`Article not found: ${id}`);

  const status = input.status ?? existing.status;
  const progressPercent = computeArticleProgress({
    status,
    progressPercent:
      input.progressPercent !== undefined
        ? input.progressPercent
        : existing.progressPercent,
  });

  const next: Article = {
    ...existing,
    title: input.title !== undefined ? input.title.trim() : existing.title,
    url: input.url !== undefined ? input.url.trim() : existing.url,
    author:
      input.author !== undefined
        ? input.author.trim() || undefined
        : existing.author,
    siteName:
      input.siteName !== undefined
        ? input.siteName.trim() || undefined
        : existing.siteName,
    status,
    progressPercent,
    lastOpenedAt: input.lastOpenedAt ?? existing.lastOpenedAt,
    updatedAt: nowIso(),
  };

  const { error } = await client
    .from("articles")
    .update(articleToRow(next, userId))
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
  return next;
}

export async function deleteArticle(id: string): Promise<void> {
  const { client, userId } = await requireUser();
  const { error } = await client
    .from("articles")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function touchArticleOpened(id: string): Promise<Article> {
  return updateArticle(id, { lastOpenedAt: nowIso() });
}
