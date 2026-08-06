# Alostra — data and persistence

Device-local reading data for Milestone 3. IndexedDB through Dexie is the
source of truth. Nothing here is synced to a server.

**Related:** domain decisions and milestone boundaries live in
[`ux-decisions.md`](./ux-decisions.md). UI primitives are frozen in
[`components.md`](./components.md).

---

## Domain model

### Book

| Field | Type | Notes |
|---|---|---|
| `id` | string | UUID |
| `title` | string | Required |
| `author` | string | May be empty |
| `coverUrl` | string? | Optional. Stored as given |
| `status` | `want-to-read` \| `reading` \| `finished` | |
| `currentPage` | number? | Non-negative integer when set |
| `totalPages` | number? | Positive integer when set |
| `progressPercent` | number | 0–100, derived |
| `createdAt` | ISO string | |
| `updatedAt` | ISO string | |
| `lastOpenedAt` | ISO string? | |

### Article

| Field | Type | Notes |
|---|---|---|
| `id` | string | UUID |
| `title` | string | Required |
| `url` | string | Required http(s) URL |
| `author` | string? | |
| `siteName` | string? | |
| `status` | `saved` \| `reading` \| `finished` | |
| `progressPercent` | number? | 0–100; 100 when finished |
| `createdAt` | ISO string | |
| `updatedAt` | ISO string | |
| `lastOpenedAt` | ISO string? | |

### Capture

| Field | Type | Notes |
|---|---|---|
| `id` | string | UUID |
| `sourceType` | `book` \| `article` | |
| `sourceId` | string | Must reference a living source |
| `text` | string | Required |
| `note` | string? | |
| `pageNumber` | number? | Books only |
| `createdAt` | ISO string | |
| `updatedAt` | ISO string | |

Deleting a book or article also deletes captures that point at it.

---

## Dexie schema

Database name: `alostra`. Current version: **1**.

| Store | Primary key | Indexes |
|---|---|---|
| `books` | `id` | `title`, `author`, `status`, `updatedAt`, `lastOpenedAt`, `createdAt` |
| `articles` | `id` | `title`, `url`, `status`, `updatedAt`, `lastOpenedAt`, `createdAt` |
| `captures` | `id` | `sourceType`, `sourceId`, `[sourceType+sourceId]`, `updatedAt`, `createdAt` |
| `meta` | `key` | — |

Future changes add a new `.version(n).stores(...)` block. Do not edit a shipped
version's store definition in place. Implementation:
`src/lib/db/database.ts`.

---

## Persistence behaviour

- All reads and writes go through repository functions in
  `src/lib/repositories/`. Presentational components do not open Dexie.
- Data survives refresh and tab close because it lives in IndexedDB.
- There is no cloud sync, backup export, or multi-device account in this
  milestone.
- On first open of an empty database, tasteful sample records are seeded
  (`src/lib/db/seed.ts`). Sample IDs are stable; Home exposes **Clear sample
  data** when they are present. User-created records are never cleared by that
  action.

---

## Progress rules

Implemented in `src/lib/domain/progress.ts`:

- Pages are clamped to non-negative integers; current page cannot exceed total
  pages.
- When both pages are known, `progressPercent = round(current / total * 100)`,
  clamped 0–100.
- `status: "finished"` always sets progress to **100%** (books and articles).
- Invalid, negative or over-limit values are never stored as-is.

---

## Search behaviour

Implemented in `src/lib/domain/search.ts`:

- Case-insensitive.
- Library search matches book title/author, article title/author/URL/site name.
- Capture search matches capture text and note, and also the source title /
  author / URL so a search for a book name surfaces its captures.

---

## Cover URLs

`BookCover` (frozen) uses `next/image` and does not yet allow remote hosts —
see the open question in `ux-decisions.md`. Cover URLs are stored on the book
record. Same-origin paths starting with `/` are shown; `http(s)` URLs fall back
to the designed placeholder until hosts are configured.

---

## What this milestone does not include

- Article content extraction or an in-app reader
- Highlighting inside article bodies
- Goodreads / Notion / Markdown import or export
- Cloud sync, authentication, payments
- Analytics, notifications, reading guidance

---

## Code map

| Concern | Location |
|---|---|
| Types | `src/lib/domain/types.ts` |
| Progress / validation / search | `src/lib/domain/*.ts` |
| Database | `src/lib/db/database.ts` |
| Seed / clear sample | `src/lib/db/seed.ts` |
| Repositories | `src/lib/repositories/*.ts` |
| App shell & screens | `src/app/(app)/` |
