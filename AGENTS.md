# Alostra development rules

Alostra is a private web application that unifies books, articles, and
reading captures into one continuous reading home.

## Core hypothesis

Test whether users want to track books and save highlighted articles
inside one unified workspace and are willing to pay for that workflow.

## Version 1 scope

Implement only:

- authenticated accounts (email/password via Supabase Auth);
- unified queue for books and articles;
- book status and optional page progress;
- clean article reader;
- article highlighting;
- book notes;
- unified captures;
- Goodreads CSV import;
- Markdown export;
- complete JSON backup and restore;
- Supabase PostgreSQL as the library source of truth;
- in-app feedback;
- consent-based error reporting;
- minimal privacy-friendly analytics;
- free limits and a one-time Pro unlock.

Do not implement:

- anonymous persistent libraries;
- browser IndexedDB as a second source of truth;
- offline bidirectional sync;
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
- advanced statistics;
- EPUB/PDF/full-book file storage.

## Technical rules

- Use Next.js App Router.
- Use TypeScript strict mode.
- Use Tailwind CSS.
- Use Supabase Auth + Supabase PostgreSQL for library data.
- Require authentication for product/library routes; keep a public landing page.
- Treat Supabase (with RLS) as the source of truth for user library rows.
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
- Follow `docs/authentication-architecture.md` for auth and persistence.
- Follow `docs/milestone-4-product-experience-plan.md` for Milestone 4 signed-in product UX (**implemented and frozen**).
- Before changing signed-in UX (Home, Library, Captures, forms, shell, route transitions, Thread usage, empty/loading patterns, or typography philosophy), read that Milestone 4 plan and treat its decisions as frozen. Do not redesign those surfaces incidentally while doing unrelated work. Future approved milestones may explicitly supersede frozen decisions; casual redesign does not.
- Follow `docs/milestone-5-production-launch-readiness-plan.md` for production and launch readiness (**plan approved and frozen for implementation; Milestone 5 is not yet complete**). Before deploy, account deletion, legal pages, security hardening, monitoring, analytics, feedback, or private-beta work, read that plan and preserve its P0 / P1 / P2 boundaries, working decisions, and sub-milestone order (M5.1–M5.7). Do not expand M5 into deferred product features or weaken security/privacy for convenience.
