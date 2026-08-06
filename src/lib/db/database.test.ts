import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { AlostraDatabase, deleteDatabaseForTests } from "./database";

describe("database schema", () => {
  const name = "alostra-schema-test";

  afterEach(async () => {
    await deleteDatabaseForTests(name);
  });

  it("opens version 1 with the expected stores", async () => {
    const db = new AlostraDatabase(name);
    await db.open();
    expect(db.verno).toBe(1);
    expect(db.tables.map((t) => t.name).sort()).toEqual(
      ["articles", "books", "captures", "meta"].sort(),
    );
    db.close();
  });

  it("can migrate forward by adding a versioned store", async () => {
    const v1 = new AlostraDatabase(name);
    await v1.open();
    await v1.books.add({
      id: "b1",
      title: "Kept",
      author: "Author",
      status: "want-to-read",
      progressPercent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    v1.close();

    class V2 extends Dexie {
      books!: Dexie.Table;
      articles!: Dexie.Table;
      captures!: Dexie.Table;
      meta!: Dexie.Table;
      tags!: Dexie.Table;

      constructor() {
        super(name);
        this.version(1).stores({
          books: "id, title, author, status, updatedAt, lastOpenedAt, createdAt",
          articles: "id, title, url, status, updatedAt, lastOpenedAt, createdAt",
          captures:
            "id, sourceType, sourceId, [sourceType+sourceId], updatedAt, createdAt",
          meta: "key",
        });
        this.version(2).stores({
          tags: "id, name",
        });
      }
    }

    const v2 = new V2();
    await v2.open();
    expect(v2.verno).toBe(2);
    const kept = await v2.books.get("b1");
    expect(kept?.title).toBe("Kept");
    expect(v2.tables.map((t) => t.name)).toContain("tags");
    v2.close();
  });
});
