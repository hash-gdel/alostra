import { getDb } from "@/lib/db/database";
import { createId, nowIso } from "@/lib/db/ids";
import type { Capture, CaptureInput } from "@/lib/domain/types";
import { getArticle } from "./articles";
import { getBook } from "./books";

export async function listCaptures(): Promise<Capture[]> {
  return getDb().captures.orderBy("updatedAt").reverse().toArray();
}

export async function getCapture(id: string): Promise<Capture | undefined> {
  return getDb().captures.get(id);
}

export async function listCapturesForSource(
  sourceType: Capture["sourceType"],
  sourceId: string,
): Promise<Capture[]> {
  return getDb()
    .captures.where({ sourceType, sourceId })
    .reverse()
    .sortBy("updatedAt");
}

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
  if (!article) throw new Error(`Capture source article not found: ${sourceId}`);
}

export async function createCapture(input: CaptureInput): Promise<Capture> {
  await assertSourceExists(input.sourceType, input.sourceId);
  const now = nowIso();
  const capture: Capture = {
    id: createId(),
    sourceType: input.sourceType,
    sourceId: input.sourceId,
    text: input.text.trim(),
    note: input.note?.trim() || undefined,
    pageNumber:
      input.sourceType === "book"
        ? input.pageNumber ?? undefined
        : undefined,
    createdAt: now,
    updatedAt: now,
  };
  await getDb().captures.add(capture);
  return capture;
}

export async function updateCapture(
  id: string,
  input: Partial<CaptureInput>,
): Promise<Capture> {
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

  await getDb().captures.put(next);
  return next;
}

export async function deleteCapture(id: string): Promise<void> {
  await getDb().captures.delete(id);
}

export type CaptureWithSource = {
  capture: Capture;
  sourceTitle: string;
  sourceDetail?: string;
};

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
