import Dexie, { type EntityTable, type Table } from "dexie";
import type { Article, Book, Capture } from "@/lib/domain/types";

/**
 * Alostra local database.
 *
 * Version 1 — books, articles, captures, and a small meta table for seed state.
 * Future schema changes add a new `.version(n).stores(...)` block; never edit
 * an already-shipped version's store definition in place.
 */
export class AlostraDatabase extends Dexie {
  books!: EntityTable<Book, "id">;
  articles!: EntityTable<Article, "id">;
  captures!: EntityTable<Capture, "id">;
  meta!: Table<{ key: string; value: string }, string>;

  constructor(name = "alostra") {
    super(name);

    this.version(1).stores({
      books: "id, title, author, status, updatedAt, lastOpenedAt, createdAt",
      articles: "id, title, url, status, updatedAt, lastOpenedAt, createdAt",
      captures: "id, sourceType, sourceId, [sourceType+sourceId], updatedAt, createdAt",
      meta: "key",
    });
  }
}

let dbInstance: AlostraDatabase | null = null;

/** Singleton for the app. Tests should call `resetDatabaseForTests` instead. */
export function getDb(): AlostraDatabase {
  if (!dbInstance) {
    dbInstance = new AlostraDatabase();
  }
  return dbInstance;
}

/** Close and drop the singleton so tests get a fresh schema. */
export async function resetDatabaseForTests(name = "alostra-test"): Promise<AlostraDatabase> {
  if (dbInstance) {
    dbInstance.close();
    await Dexie.delete(dbInstance.name);
    dbInstance = null;
  }
  dbInstance = new AlostraDatabase(name);
  return dbInstance;
}

export async function deleteDatabaseForTests(name: string): Promise<void> {
  if (dbInstance?.name === name) {
    dbInstance.close();
    dbInstance = null;
  }
  await Dexie.delete(name);
}
