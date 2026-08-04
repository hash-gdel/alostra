# Alostra

Alostra is a private, local-first reading workspace where users track
books, save articles, create highlights and notes, and revisit everything
through one unified capture library.

## Version 1 promise

Add a book or article and keep what mattered from it in one private,
exportable workspace.

## Core validation question

Will users who currently track books and separately save articles want
both workflows in one application strongly enough to pay for it?

## Version 1 features

- Unified queue
- Book tracking
- Clean article reader
- Article highlighting
- Book notes
- Unified captures
- Goodreads CSV import
- Markdown export
- Complete JSON backup and restore
- Local-first storage
- Feedback and error reporting
- One-time paid unlock

## Explicit exclusions

Version 1 does not include cloud sync, native mobile apps, AI chat,
PDF annotation, external note-app integrations, social features, or
audiobook tracking.

## Documentation

- [`docs/design-system.md`](./docs/design-system.md) — the tokens, and the
  rules for using them. Mirrors `src/app/globals.css`.
- [`docs/components.md`](./docs/components.md) — the reusable component
  library in `src/components/`.
- [`docs/ux-decisions.md`](./docs/ux-decisions.md) — what we decided and why.

`/dev/design-system` renders every token and every component, in both modes,
and computes its contrast table from the real token definitions at build time.
It is not linked from the application and is excluded from search indexing.

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Before completing a milestone:

```bash
npm run lint
npx tsc --noEmit
npm run build
```
