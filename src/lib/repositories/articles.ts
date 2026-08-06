import { getDb } from "@/lib/db/database";
import { createId, nowIso } from "@/lib/db/ids";
import { computeArticleProgress } from "@/lib/domain/progress";
import type { Article, ArticleInput, ArticleStatus } from "@/lib/domain/types";

export async function listArticles(): Promise<Article[]> {
  return getDb().articles.orderBy("updatedAt").reverse().toArray();
}

export async function getArticle(id: string): Promise<Article | undefined> {
  return getDb().articles.get(id);
}

export async function createArticle(input: ArticleInput): Promise<Article> {
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
  await getDb().articles.add(article);
  return article;
}

export async function updateArticle(
  id: string,
  input: Partial<ArticleInput> & {
    status?: ArticleStatus;
    lastOpenedAt?: string;
  },
): Promise<Article> {
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

  await getDb().articles.put(next);
  return next;
}

export async function deleteArticle(id: string): Promise<void> {
  const db = getDb();
  await db.transaction("rw", db.articles, db.captures, async () => {
    await db.articles.delete(id);
    await db.captures.where({ sourceType: "article", sourceId: id }).delete();
  });
}

export async function touchArticleOpened(id: string): Promise<Article> {
  return updateArticle(id, { lastOpenedAt: nowIso() });
}
