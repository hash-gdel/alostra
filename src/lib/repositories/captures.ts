import { createId, nowIso } from "@/lib/db/ids";
import type { Capture, CaptureInput } from "@/lib/domain/types";
import { getArticle } from "@/lib/repositories/articles";
import { getBook } from "@/lib/repositories/books";
import {
  captureFromRow,
  captureToRow,
  type CaptureRow,
} from "@/lib/repositories/mappers";
import { requireUser } from "@/lib/repositories/require-user";
import type { CaptureWithSource } from "@/lib/repositories/types";

export type { CaptureWithSource };

async function assertSourceExists(
  sourceType: Capture["sourceType"],
  sourceId: string,
): Promise<void> {
  if (sourceType === "book") {
    const book = await getBook(sourceId);
    if (!book) throw new Error(`Capture source book not found: ${sourceId}`);
    return;
  }
  const article = await getArticle(sourceId);
  if (!article) {
    throw new Error(`Capture source article not found: ${sourceId}`);
  }
}

export async function listCaptures(): Promise<Capture[]> {
  const { client, userId } = await requireUser();
  const { data, error } = await client
    .from("captures")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data as CaptureRow[]).map(captureFromRow);
}

export async function getCapture(id: string): Promise<Capture | undefined> {
  const { client, userId } = await requireUser();
  const { data, error } = await client
    .from("captures")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ? captureFromRow(data as CaptureRow) : undefined;
}

export async function listCapturesForSource(
  sourceType: Capture["sourceType"],
  sourceId: string,
): Promise<Capture[]> {
  const { client, userId } = await requireUser();
  let query = client.from("captures").select("*").eq("user_id", userId);
  query =
    sourceType === "book"
      ? query.eq("book_id", sourceId)
      : query.eq("article_id", sourceId);
  const { data, error } = await query.order("updated_at", {
    ascending: false,
  });
  if (error) throw error;
  return (data as CaptureRow[]).map(captureFromRow);
}

export async function createCapture(input: CaptureInput): Promise<Capture> {
  const { client, userId } = await requireUser();
  await assertSourceExists(input.sourceType, input.sourceId);
  const now = nowIso();
  const capture: Capture = {
    id: createId(),
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    text: input.text.trim(),
    note: input.note?.trim() || undefined,
    pageNumber:
      input.sourceType === "book" ? input.pageNumber ?? undefined : undefined,
    createdAt: now,
    updatedAt: now,
  };
  const { error } = await client
    .from("captures")
    .insert(captureToRow(capture, userId));
  if (error) throw error;
  return capture;
}

export async function updateCapture(
  id: string,
  input: Partial<CaptureInput>,
): Promise<Capture> {
  const { client, userId } = await requireUser();
  const existing = await getCapture(id);
  if (!existing) throw new Error(`Capture not found: ${id}`);

  const sourceType = input.sourceType ?? existing.sourceType;
  const sourceId = input.sourceId ?? existing.sourceId;
  await assertSourceExists(sourceType, sourceId);

  const next: Capture = {
    ...existing,
    sourceType,
    sourceId,
    text: input.text !== undefined ? input.text.trim() : existing.text,
    note:
      input.note !== undefined ? input.note.trim() || undefined : existing.note,
    pageNumber:
      sourceType === "book"
        ? input.pageNumber !== undefined
          ? input.pageNumber ?? undefined
          : existing.pageNumber
        : undefined,
    updatedAt: nowIso(),
  };

  const { error } = await client
    .from("captures")
    .update(captureToRow(next, userId))
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
  return next;
}

export async function deleteCapture(id: string): Promise<void> {
  const { client, userId } = await requireUser();
  const { error } = await client
    .from("captures")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function listCapturesWithSources(): Promise<CaptureWithSource[]> {
  const captures = await listCaptures();
  const result: CaptureWithSource[] = [];
  for (const capture of captures) {
    if (capture.sourceType === "book") {
      const book = await getBook(capture.sourceId);
      if (!book) continue;
      result.push({
        capture,
        sourceTitle: book.title,
        sourceDetail:
          capture.pageNumber != null
            ? `Page ${capture.pageNumber}`
            : book.author || undefined,
      });
    } else {
      const article = await getArticle(capture.sourceId);
      if (!article) continue;
      result.push({
        capture,
        sourceTitle: article.title,
        sourceDetail: article.siteName || article.author || undefined,
      });
    }
  }
  return result;
}
