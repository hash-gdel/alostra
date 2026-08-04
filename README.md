<div align="center">

# Alostra

### Your private reading corner.

Keep your books, saved articles, and reading notes together in one calm, beautifully designed workspace.

**Built for readers—not content consumers.**

<br>

🚧 **Currently in active development**

*Building towards our first public preview.*

</div>

---

# Reading has become fragmented.

Today, every part of our reading life lives somewhere different.
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

- 📚 Books are tracked in one app.
- 🌐 Articles disappear into endless browser tabs.
- ✍️ Notes live inside random documents.
- 💡 Highlights are scattered across multiple platforms.

Over time, remembering **what we've read** becomes harder than finding something new to read.

---

# Introducing Alostra

Alostra is a private reading workspace designed to bring every part of your reading life together.

Instead of separating books, articles, notes and reading progress across different tools, Alostra treats them as one continuous reading experience.

A place where your library grows with you.

A place designed to disappear while you read.

A place that feels more like your own reading corner than another productivity application.

---

# Why Alostra?

Unlike traditional reading trackers, Alostra isn't designed around social feeds or collecting books.

It's designed around **remembering, organizing and enjoying what you read.**

No followers.

No likes.

No reading streaks.

No pressure.

Just your library.

---

# Features

## 📚 Books

Build your own personal library.

- Track reading progress
- Organize your books
- Continue exactly where you left off
- Keep your reading beautifully organized

---

## 📰 Articles

Save valuable articles before they disappear.

Build a long-term reading collection instead of an endless list of browser tabs.

---

## ✍️ Captures

Collect meaningful thoughts while you read.

Books and articles share the same capture system, making your notes searchable and connected.

---

## 🔍 Unified Search

Instantly search across:

- Books
- Articles
- Captures

Everything lives in one place.

---

## 🏡 A Private Reading Corner

Alostra is intentionally calm.

No feeds.

No social pressure.

No distractions.

The interface supports reading—and then quietly gets out of the way.

---

# Design Philosophy

Alostra is built around one simple principle:

> **Every visual element should either support reading or disappear.**

Our design language is inspired by:

- Physical books
- Quiet libraries
- Editorial layouts
- Warm natural materials
- Calm interactions
- Beautiful typography

Luxury comes from restraint—not decoration.

---

# Technology

Alostra is built with a modern web stack.

- Next.js
- React
- TypeScript
- Tailwind CSS
- IndexedDB (Dexie)
- Vercel

The application is designed to be:

- ⚡ Fast
- 🔒 Privacy-first
- 💻 Local-first
- ♿ Accessible

---

# Roadmap

## ✅ Milestone 1 — Design Foundation

- Visual identity
- Design system
- Typography
- Motion system
- Accessibility
- Documentation

---

## 🚧 In Progress

- Core UI components
- Home experience
- Reading workspace

---

## 🔜 Coming Soon

- Books
- Articles
- Captures
- Reading progress
- Public Preview

---

# Screenshots

Screenshots will be added as the application approaches its first public preview.

---

# Development

Clone the repository.

```bash
git clone https://github.com/YOUR_USERNAME/alostra.git
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
