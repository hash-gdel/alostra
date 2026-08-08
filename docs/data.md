# Alostra — data and persistence

Reading library data for Version 1.

**Source of truth:** Supabase PostgreSQL for authenticated users.  
**Architecture:** [`authentication-architecture.md`](./authentication-architecture.md).

There is no device-local library database in production. Visitors see a public
landing page; the product requires sign-in.

**Related:** [`ux-decisions.md`](./ux-decisions.md), frozen UI in
[`components.md`](./components.md).

---

## Domain model

### Book

| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | |
| `title` | string | Required |
| `author` | string | May be empty |
| `coverUrl` | string? | Optional |
| `status` | `want-to-read` \| `reading` \| `finished` | |
| `currentPage` | number? | |
| `totalPages` | number? | |
| `progressPercent` | number | 0–100, derived |
| `createdAt` / `updatedAt` | ISO string | |
| `lastOpenedAt` | ISO string? | |

Books are tracking records only (metadata, status, progress, captures, notes).
No EPUB/PDF/full-book storage.

### Article

| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | |
| `title` | string | Required |
| `url` | string | Required http(s) |
| `author` / `siteName` | string? | |
| `status` | `saved` \| `reading` \| `finished` | |
| `progressPercent` | number? | 100 when finished |
| timestamps | ISO string | |

### Capture

| Field | Type | Notes |
|---|---|---|
| `id` | string (UUID) | |
| `sourceType` | `book` \| `article` | |
| `sourceId` | string | Living source |
| `text` | string | Required |
| `note` | string? | |
| `pageNumber` | number? | Books only |
| timestamps | ISO string | |

Deleting a book or article deletes its captures (`on delete cascade`).

---

## Supabase schema

Tables `books`, `articles`, `captures` with `user_id` referencing
`auth.users`. Captures use `book_id` / `article_id` (exactly one set) with
FK cascade.

Migrations (apply in order):

1. `supabase/migrations/20260807000000_library_rls.sql` — creates tables,
   indexes, constraints, and RLS policies.
2. `supabase/migrations/20260808000000_grant_authenticated_library.sql` —
   grants `SELECT`/`INSERT`/`UPDATE`/`DELETE` on those tables to the
   `authenticated` role.

Capture INSERT/UPDATE policies require the referenced book or article to be
owned by `auth.uid()`. RLS alone is not sufficient for PostgREST; migration 2
supplies the required table privileges.

Never put a service-role key in `NEXT_PUBLIC_*` variables.

---

## Persistence behaviour

- UI talks to `src/lib/repositories/*` only.
- Repositories call `requireUser()` then Supabase with the session JWT.
- RLS enforces ownership; middleware redirects are UX only.
- Env: see `.env.example`. Without Supabase env vars, product routes cannot
  run a library (no silent local fallback).

---

## Progress and search

`src/lib/domain/progress.ts` and `src/lib/domain/search.ts`.

---

## Cover URLs

Remote `http(s)` covers are stored but not shown until `next.config` hosts are
configured. Same-origin `/` paths work.

---

## Out of scope

- Offline bidirectional sync / browser DB as a second source of truth
- Anonymous persistent libraries
- Article extraction, in-app reader, highlighting
- Imports/exports, payments, analytics, notifications
- OAuth providers
- EPUB/PDF book-file storage

---

## Code map

| Concern | Location |
|---|---|
| Types | `src/lib/domain/types.ts` |
| Repositories | `src/lib/repositories/{books,articles,captures,library}.ts` |
| Auth session UI | `src/lib/auth/auth-context.tsx` |
| Route gates | `src/lib/auth/route-gates.ts` |
| Supabase clients | `src/lib/supabase/` |
| Architecture | `docs/authentication-architecture.md` |
