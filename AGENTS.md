# Alostra development rules

Alostra is a private, local-first web application that unifies books,
articles, and reading captures.

## Core hypothesis

Test whether users want to track books and save highlighted articles
inside one unified workspace and are willing to pay for that workflow.

## Version 1 scope

Implement only:

- unified queue for books and articles;
- book status and optional page progress;
- clean article reader;
- article highlighting;
- book notes;
- unified captures;
- Goodreads CSV import;
- Markdown export;
- complete JSON backup and restore;
- device-local storage;
- in-app feedback;
- consent-based error reporting;
- minimal privacy-friendly analytics;
- free limits and a one-time Pro unlock.

Do not implement:

- cloud synchronization;
- native mobile applications;
- AI chat;
- article summaries;
- PDF highlighting;
- StoryGraph import;
- Notion or Obsidian integrations;
- browser extensions;
- social features;
- reading challenges;
- recommendations;
- audiobooks;
- advanced statistics.

## Technical rules

- Use Next.js App Router.
- Use TypeScript strict mode.
- Use Tailwind CSS.
- Use IndexedDB through Dexie for reading data.
- Treat device-local data as the source of truth.
- Add database migrations for schema changes.
- Keep business logic separate from UI components.
- Never send article text, highlights, notes, or titles to analytics.
- Never log user reading content in Sentry.
- Do not bypass paywalls or authenticated websites.
- Clearly report unsupported article extraction.
- Preserve imported data and report unmatched CSV rows.
- Write tests for imports, exports, migrations, and entitlement limits.
- Run lint, type checking, tests, and production build before completing each milestone.
- Work in small, independently testable milestones.
- Never implement future features without explicit approval.