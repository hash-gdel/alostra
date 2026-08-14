# Milestone 5 — V1 Production & Launch Readiness Plan

**Status: Approved and frozen for implementation.**

**Important:** This freezes the **implementation plan and scope** only.
Milestone 5 itself is **not** implemented and is **not** complete. Do not
describe M5 as shipped until acceptance criteria are met and this document is
updated to record implementation completion.

This document is the planning source of truth for Milestone 5. Implementation
must follow it. Do not expand scope, invent product features, or weaken
security/privacy/launch gates without a documented reason (see Freeze boundary).

**Objective:** Make the existing Alostra V1 safe, reliable, legally launchable,
observable, deployable, and ready for a small group of real users.

**This is not a feature-expansion milestone.**

Preserve frozen Milestones 1, 2, and 4. Do not casually redesign Home, Library,
Captures, forms, app navigation, Bookmark Thread, typography philosophy,
route-transition philosophy, or design-system APIs. Touch frozen surfaces only
for confirmed bugs, accessibility, security, or production correctness.

### Freeze boundary

The Milestone 5 scope and launch-readiness philosophy are frozen for
implementation.

Implementation agents must **not**:

- expand M5 into new product features
- redesign frozen M1 / M2 / M4 product surfaces
- add unnecessary infrastructure
- add vendors without documented justification
- weaken RLS, auth, or security for convenience
- collect private reading content in analytics, monitoring, or feedback metadata
- silently move P0 / P1 requirements to P2

Changes to this frozen plan require a documented reason such as:

1. a confirmed technical constraint
2. a security, privacy, or legal requirement
3. an external platform limitation
4. evidence discovered during implementation or beta
5. an explicit product decision

Change control: revise this plan only when one of the above applies—not for
aesthetic preference or convenience.

### Approved implementation sequence

Implement and review each sub-milestone separately, in order, unless a concrete
dependency requires otherwise:

1. **M5.1** — Production Foundation  
2. **M5.2** — Account Lifecycle  
3. **M5.3** — Legal & Trust  
4. **M5.4** — Security Hardening & Production QA  
5. **M5.5** — Observability & Minimal Analytics  
6. **M5.6** — User Feedback & Beta Learning  
7. **M5.7** — Private Beta & Launch Gate  

Details for each appear in §21.

### Working decisions (not immutable architecture)

These are approved working defaults. Vendor choice and dashboard configuration
still require verification at the relevant sub-milestone—they are **not**
pretended to already exist in production:

| Decision | Working default |
|----------|-----------------|
| Hosting | **Vercel** preferred for V1 |
| Supabase environments | Separate **development** and **production** projects |
| Email confirmation | **Required** |
| Custom SMTP | **Deferred** unless branding/deliverability requires it |
| Private beta | **Invite-only**, approximately **10–30** readers |
| Feedback storage | **Supabase** table + RLS preferred |
| Analytics during private beta | **May be deferred**; revisit before public V1 |
| Error monitoring | **Required before public V1**; vendor selected later |
| Account deletion | **Self-service required before public V1** |
| Privacy/support contact | Determined once production domain is chosen |

### External decisions (do not block freezing this plan)

Resolve at the appropriate sub-milestone before the related launch gate:

- final production domain
- privacy/support address
- legal-review timing
- analytics beta decision (ship minimal events vs defer)
- monitoring vendor
- beta sign-up restriction method (soft invite note vs hard disable)
- SMTP escalation decision
- data/feedback retention decisions

---

## 0. How to read status labels

| Label | Meaning |
|-------|---------|
| **Implemented** | Present in the repository and usable as described |
| **Needs verification** | Exists or is configured externally; must be checked in production |
| **Needs implementation** | Missing in the repo; engineering work required |
| **Manual / external** | Dashboard, legal, DNS, or human action outside Cursor |
| **Deferred** | Explicitly out of Milestone 5 or post-launch |
| **Working decision** | Approved default for implementation; verify/configure before relying on it in production |

---

## 1. Current-state diagnosis

### 1.1 What is already strong

| Area | Status | Evidence |
|------|--------|----------|
| Email/password auth UI | Implemented | `/sign-up`, `/sign-in`, `/forgot-password`, `/auth/callback`, `/auth/reset-password` |
| Session middleware + product route gates | Implemented | `src/middleware.ts`, `src/lib/supabase/middleware.ts`, `src/lib/auth/route-gates.ts` |
| Safe post-auth redirects | Implemented | `isSafeNextPath` / `resolvePostAuthPath` |
| Supabase browser/server/middleware clients | Implemented | `src/lib/supabase/{client,server,middleware,config}.ts` |
| Anon key only in client bundle | Implemented | Service-role unused in `src/`; commented in `.env.example` |
| Library schema + RLS + grants | Implemented | `supabase/migrations/20260807000000_library_rls.sql`, `…08000000_grant_authenticated_library.sql` |
| Ownership cascade on `auth.users` delete | Implemented (DB) | `user_id → auth.users ON DELETE CASCADE` |
| Signed-in product (Home / Library / Captures / forms) | Implemented + frozen (M4) | `(app)` routes |
| Unit tests (domain, repos mocks, route gates) | Implemented | 7 Vitest files / 36 tests |
| Production build scripts | Implemented | `npm run build` / `next start` |
| Basic landing + root metadata + `icon.svg` | Implemented (partial SEO) | `(marketing)/page.tsx`, `layout.tsx`, `src/app/icon.svg` |

### 1.2 What is partial

| Area | Status | Gap |
|------|--------|-----|
| Landing SEO / social preview | Partial | Title + description only; no Open Graph / Twitter metadata |
| Auth recovery path | Partial | Relies on Supabase recovery link + `/auth/reset-password`; production redirect allowlists must be verified |
| Cross-user isolation confidence | Partial | Mirrored in `ownership.test.ts`; **no live Postgres RLS isolation tests** |
| Auth architecture doc freeze | Partial | `docs/authentication-architecture.md` still “awaiting review freeze” |
| Book covers | Accepted V1 limitation | Optional URL; remote hosts not configured; intentional fallback |

### 1.3 What is missing for launch

| Area | Status |
|------|--------|
| Hosting / CI / production deploy config | Missing |
| Separate production Supabase project + Auth URL allowlists | Manual / needs verification |
| Auth email branding (templates, sender) | Manual / external (+ light copy decisions) |
| Account surface (password change, delete account) | Needs implementation |
| Privacy Policy + Terms pages + footer links | Needs implementation (+ legal review) |
| Account / data deletion product path | Needs implementation (DB cascade exists; app path does not) |
| In-app “Send feedback” + review workflow | Needs implementation (launch infrastructure, not a social feature) |
| Privacy-conscious analytics | Missing (may ship minimal events **or** consciously defer for private beta) |
| Error monitoring | Missing |
| Security headers | Missing |
| Custom `not-found` / `error` routes | Missing |
| Gate `/dev/design-system` in production | Needs implementation or deploy config |
| Import/export, article reader, Pro unlock | Deferred (listed in AGENTS.md V1 scope but **not implemented**; not required to launch current product) |

### 1.4 Do not confuse documentation wish-list with shipped product

`AGENTS.md` Version 1 scope still lists article highlighting, Goodreads import,
Markdown export, JSON backup/restore, in-app feedback, consent-based error
reporting, analytics, and Pro unlock. **Those are not present in the
application today.** Milestone 5 must launch the **existing** reading home
(auth + books/articles/captures), plus the **minimum launch infrastructure**
(deploy, trust, security, feedback, observability)—not silently expand into
the full AGENTS wish-list.

---

## 2. Launch-readiness principles

1. **Ship what exists.** Make the current product safe for real readers.
2. **Privacy over growth.** No reading content in analytics, error logs, or automatic feedback context.
3. **Least infrastructure.** Prefer existing stack (Next.js host + Supabase) and free tiers where honest.
4. **RLS is the authorization boundary.** UI gates are not enough.
5. **Legal clarity without inventing law.** Engineering prepares surfaces; legal review owns claims.
6. **Preserve M1 / M2 / M4 freezes.** Composition and minimal new routes only.
7. **P0 ≠ polish.** Aesthetic perfection is not a launch blocker.
8. **Learn from a small beta.** Invite-only ~10–30 readers before public V1.
9. **Feedback is launch infrastructure**, not a community or feature-request platform.

---

## 3. Production architecture

**Working recommendation — Vercel + Supabase:**

```text
Custom domain (HTTPS)
  → Vercel — Next.js 16 App Router
  → Supabase Auth + PostgreSQL (separate production project)
  → Browser: NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY only
```

### Why Vercel is appropriate for V1

- Native fit for Next.js App Router (middleware, SSR/RSC, static assets).
- HTTPS, previews, and env management without custom Node ops.
- Matches “simplest reliable” constraint for a solo/small team.

### Compatibility / portability notes

- App is standard Next.js (`next build` / `next start`); not Vercel-proprietary APIs today.
- Meaningful lock-in risk is low if we avoid Vercel-only features (Edge Config, proprietary middleware APIs beyond what Next already uses). Prefer standard Next + env vars.
- Migration to another Node host later remains feasible; do **not** add abstraction layers “just in case.”

| Decision | Working decision | Status |
|----------|------------------|--------|
| Hosting | **Vercel** preferred | Working decision — verify before freeze of M5.1 execution |
| Database / Auth | Separate **development** and **production** Supabase projects | Working decision |
| CDN / HTTPS | Host + custom domain | Manual / external |
| Preview deploys | Allowed; Auth redirect URLs must be handled carefully (prefer not pointing previews at production Auth) | Needs verification |
| Complexity to avoid | Kubernetes, multi-region, custom API gateway, dual app databases | Deferred |

**Cursor can implement:** headers/metadata, account/legal/feedback routes, monitoring/analytics wiring after vendor choice, CI, dev-route gating, migrations for feedback table if chosen.

**Operator must perform:** DNS, Vercel project, Supabase projects, Auth allowlists, email templates/SMTP, secrets, backups, legal review, beta invites.

---

## 4. Deployment strategy & environment separation

### 4.1 Environments

| Env | App | Supabase | Auth redirects |
|-----|-----|----------|----------------|
| **Development** | `localhost` (`npm run dev`) | Development project | `http://localhost:3000/auth/callback`, `/auth/reset-password`, etc. |
| **Production** | Custom domain | Production project | `https://<domain>/auth/callback`, `/auth/reset-password`, etc. |
| **Preview** (optional) | Host preview URLs | Prefer **not** production Auth; if used, add preview origins to a non-prod allowlist or disable Auth-heavy testing on previews | Needs careful config |

### 4.2 Environment variables

| Variable | Client-visible? | Notes |
|----------|-----------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Per-environment project URL (no `/rest/v1/` suffix) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Per-environment anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | **No** | Server-only for account deletion (and similar admin Auth ops); never `NEXT_PUBLIC_` |
| Error-monitoring DSN | Per vendor | Scrub reading content / secrets |
| Analytics key | Per vendor (if enabled) | No reading-content events |

### 4.3 Migration workflow (reproducible schema)

1. Author SQL under `supabase/migrations/` in repo (ordered filenames).
2. Apply the same files to **development** first; verify locally.
3. Apply the **same** files to **production** (SQL editor or CLI)—never hand-edit prod schema only.
4. Record which migration versions are applied in each project.
5. Feedback-table migration (if using Supabase storage for feedback) follows the same path.

### 4.4 Auth-related production URLs (must align)

- Site URL → production origin
- Allowlist → `/auth/callback`, `/auth/reset-password`, sign-in/up origins as required
- Email confirmation → `/auth/callback`
- Password recovery → `/auth/reset-password` (current app design)
- Localhost redirects remain configured on the **development** project

### 4.5 Deployment workflow

1. Create Vercel + production Supabase; keep development project for local.
2. Apply all migrations to production.
3. Set production env vars (never reuse prod service-role in local commits).
4. Configure Auth URLs + email templates on **each** project appropriately.
5. Deploy production from `main` (or release branch).
6. Smoke QA (§14).
7. Private beta (§15–16).

**CI (P1 before public):** GitHub Action — `lint`, `tsc`, `test`, `build`.  
**Status:** Needs implementation (no `.github/workflows` today).

---

## 5. Supabase production readiness

| Item | Status | Action |
|------|--------|--------|
| Separate dev vs prod projects | Working decision | Manual |
| Schema migrations applied to production | Needs verification | Manual: apply migration files in order |
| RLS + ownership policies | Implemented in repo; Needs verification in prod | Manual |
| Grants to `authenticated` | Implemented in repo; Needs verification in prod | Manual |
| Anon cannot CRUD library tables | Needs verification | Manual + security checklist |
| Cross-user isolation | Needs verification | Manual two-account test (+ optional automated RLS later) |
| Service-role not in client | Implemented | Keep; audit secrets |
| Email confirmation **required** | Working decision | Manual Auth setting |
| Password reset | Implemented in app; Needs verification in prod | Manual |
| Redirect allowlists (dev + prod) | Manual / external | Per project |
| Backups / restore owner | Manual / external | Document who can restore |
| Feedback table RLS (if used) | Needs implementation | Insert for authenticated owner; no cross-user read via anon |

**Do not weaken RLS for convenience.**

---

## 6. Authentication / email readiness

### 6.1 Email confirmation — working decision

**Email confirmation remains required for V1.**

Why:

- Reduces throwaway / mistyped accounts before library data accumulates.
- Fits an EU-facing trust posture (account control tied to a reachable inbox).
- Matches existing sign-up → `/auth/callback` architecture.

**Production flow:**

```text
Sign up
  → confirmation email (production template)
  → /auth/callback on production domain
  → authenticated session
  → /home
```

**Password recovery flow:**

```text
Forgot password
  → email
  → /auth/reset-password on production domain
  → password update
  → sign-in or Home as appropriate (keep current product behavior unless a bug forces change)
```

Development localhost redirects continue on the **development** Supabase project.

### 6.2 Auth email / SMTP — staged strategy

| Stage | Approach |
|-------|----------|
| **Private beta** | Use simplest reliable **Supabase-supported** email configuration if deliverability and basic branding are acceptable. Customize templates in Dashboard (subject + calm Alostra copy). **Do not require paid SMTP yet.** |
| **Public launch** | Evaluate custom SMTP / transactional email if needed for sender identity (`noreply@<domain>`), branding, deliverability, or reliability. |

**Triggers to move to custom SMTP:** confirmation/reset mail landing in spam for multiple beta users; inability to set a trustworthy From identity; Supabase default limits blocking beta; public-launch volume concerns.

Do not choose a paid email vendor until a trigger is observed or public launch demands it.

| Item | Status |
|------|--------|
| Sign-up / sign-in / sign-out / forgot / reset / callback | Implemented |
| Alostra-toned email copy in Dashboard | Manual + light copy draft |
| Custom SMTP | Deferred until trigger / public need |

**Not legal advice:** Email copy must not over-claim privacy or compliance.

---

## 7. Account management & deletion

### 7.1 Current state

| Capability | Status |
|------------|--------|
| See email in shell | Implemented |
| Sign out | Implemented |
| Reset password via email | Implemented |
| Change password while signed in | Missing |
| Delete account + data | Missing (DB cascade only) |
| Account page | Missing |

### 7.2 Minimal Account surface

**Route:** `/account` (product-gated; **not** a fourth primary nav item).

**Contents:**

- Email (read-only)
- Change password **or** clear “Reset via email” path
- Sign out
- Delete account
- Links to Privacy Policy and Terms
- Optional: quiet entry to Send feedback (if not only in shell footer)

**Shell:** Quiet peripheral link near Sign out (sidebar foot / mobile header area)—**never** beside Home / Library / Captures.

### 7.3 Account deletion — preferred decision

**Implement self-service account deletion before public launch.**  
Do **not** rely on a permanent manual-deletion waiver.

**Invite-only private beta contingency only:** if deletion is not yet shipped, the operator may delete users manually in Supabase Auth (CASCADE removes library rows)—documented, time-boxed, and replaced by self-service before public V1.

**Deletion semantics (plan; do not implement yet):**

1. User opens Delete on `/account`.
2. ConfirmationDialog: irreversible; library data will be removed; “This cannot be undone.”
3. Prefer re-auth / password confirm for destructive Auth admin delete.
4. Server-only path deletes Auth user (service-role **server-side only**).
5. Existing `ON DELETE CASCADE` removes books, articles, captures.
6. Feedback rows: either CASCADE from `user_id` or anonymize—choose one in implementation and disclose in Privacy Policy.
7. On success: invalidate session / sign out; redirect to landing.
8. On failure: stay on Account; safe toast; no partial silent success.

| Work | Status |
|------|--------|
| `/account` UI | Needs implementation |
| Gate `/account` | Needs implementation |
| Server delete-user | Needs implementation |
| Password update | Needs implementation |

---

## 8. Privacy / legal product requirements

**This section is not legal advice.** EU-facing launch implies GDPR-related
considerations. Implementation alone does **not** establish compliance.
Qualified legal review (or authoritative legal guidance) is required before
public claims.

### A. Product / engineering requirements

| Requirement | Status | Notes |
|-------------|--------|-------|
| Privacy Policy page (public) | Needs implementation | Link from landing, account, auth footers as appropriate |
| Terms of Service page (public) | Needs implementation | Same |
| Account deletion | Needs implementation | §7 |
| Library data deletion with account | Needs implementation | CASCADE |
| Feedback collection disclosure | Needs implementation | Category + message (+ optional follow-up); see §9 |
| Analytics disclosure (if enabled) | Needs implementation | Event types; no reading content |
| Error-monitoring disclosure (if enabled) | Needs implementation | Technical diagnostics; scrubbing |
| Cookie / local storage disclosure | Needs implementation (copy) | Auth session storage |
| Processors list | Needs implementation (copy) | Host (Vercel), Supabase; plus analytics/monitoring/SMTP if added |
| Privacy / support contact | Needs implementation | Dedicated address under future Alostra domain where practical — **do not hard-code yet** |
| Data export / access | Deferred or manual ops | Full export product not built; Privacy Policy must be honest; manual fulfillment may be P2 ops |

### B. Operational requirements

| Requirement | Status |
|-------------|--------|
| Privacy/support mailbox monitored | Manual — choose address when domain exists |
| Access / deletion request process | Manual |
| Breach contact ownership | Manual |
| Vendor / processor inventory | Manual |
| Retention for feedback, logs, analytics | Manual (define before enabling each tool) |
| Feedback review cadence during beta | Manual (founder workflow §9.5) |

### C. Legal-review items

- Final Privacy Policy and Terms
- Lawful bases / purposes (account, library, feedback, analytics, monitoring)
- International transfers (hosting / Supabase regions)
- Consent vs legitimate interest for analytics/monitoring
- Age / eligibility
- Marketing claims on landing
- Feedback retention and follow-up email use

**Do not invent legal claims in engineering copy.** Prefer counsel-approved text before public launch (P1).

### Privacy contact (manual pre-launch decision)

Plan for a dedicated privacy/support contact under the future Alostra domain
(e.g. conceptually `privacy@…` / `hello@…`). **Do not hard-code an address in
this plan.** Decide when the production domain is final.

---

## 9. User feedback & beta learning system

### 9.1 Purpose

Alostra needs a lightweight way for real users to report problems, confusion,
ideas, and general feedback during private beta and early launch.

**Not** a community, forum, upvote board, or public feature-request platform.  
**Is** launch infrastructure so the founder can learn and triage.

**P0 preference before inviting beta users:** implement the actual lightweight
**Send feedback** path (peripheral entry, categories, Supabase + RLS, founder
review via Dashboard). Use a documented manual/interim channel **only** if
implementation hits a genuine blocker—not as the default plan.

Do **not** build: public feedback boards, voting, comments, feature-request
communities, admin feedback dashboards, or a feedback SaaS unless later
justified.

### 9.2 In-app experience (minimal)

**Entry:** discreet **“Send feedback”** in a **peripheral** location.

**Recommended location (least intrusive given M4 shell):**

- Desktop: sidebar footer near email / Sign out (with Account).
- Mobile: same peripheral cluster (header Sign-out area or Account page)—**not** bottom primary nav.

Do **not** add Feedback as a fourth primary destination with Home / Library / Captures.

**UI (compose frozen components):** dialog or short dedicated page opened from that link.

**Fields:**

| Field | Required | Notes |
|-------|----------|-------|
| Category | Yes | `Problem` \| `Idea` \| `General feedback` |
| Message | Yes | User-authored only |
| Allow follow-up | Optional (default off) | If on, founder may reply using account email |

**Do not automatically attach:**

- book/article titles, URLs
- captures, notes, reflections
- library contents or search queries

**Optional minimal non-sensitive technical context (bug reports only, if implemented):**

- app version / git SHA or build id
- route pathname **only if** it cannot contain reading content (prefer static route names like `/library`, `/account`—never query strings that might include titles)
- viewport width band (e.g. mobile/desktop)
- user agent (coarse)

Never attach tokens, cookies, Authorization headers, or field values from forms.

### 9.3 Feedback privacy

| Question | Working answer |
|----------|----------------|
| What is collected? | Category, message, timestamps; optional follow-up flag; optional minimal tech context |
| Account email / user id? | Store `user_id` for abuse control and deletion linkage; **do not** display email in a shared inbox dump without need. Use account email for follow-up **only if** user opted in |
| Follow-up permission? | Explicit opt-in; default off |
| Retention | Define short retention (e.g. review within beta + N days post-resolution); document in Privacy Policy — exact period is legal/ops decision |
| Privacy Policy? | **Yes** — feedback must be disclosed |
| Sensitive content in message? | Users may paste reading quotes themselves; treat messages as confidential; restrict access to founder; do not feed into analytics/marketing |

Voluntary submission does **not** mean unlimited reuse.

### 9.4 Storage / delivery — options compared

| Option | Complexity | Privacy | Ops | Cost | Verdict |
|--------|------------|---------|-----|------|---------|
| **Supabase `feedback` table + RLS** | Low–medium (migration + insert API + founder reads via Dashboard/SQL) | Good if RLS: insert own rows; no user-to-user read; founder uses service-role or Dashboard carefully | Simple for solo founder | Uses existing infra | **Recommended V1** |
| Email to controlled inbox | Low | Inbox security + retention less structured | Easy to miss/thread | Email provider | Acceptable fallback if table slips |
| Third-party feedback SaaS | Medium+ | Another processor; Privacy Policy update | Nice UI, more vendors | Often paid | **Avoid for V1** unless Supabase path fails |

**Recommendation:** Prefer a **dedicated Supabase table** with RLS (authenticated insert of own rows; no select of others’ rows for anon/authenticated clients). Founder reviews via Supabase Dashboard / SQL. No admin dashboard product in M5.

### 9.5 Founder review process (no admin app)

Cadence: review new feedback at least **2–3× per week** during beta.

Classify each item as:

- Bug
- Usability / confusion
- Feature request
- Positive signal
- Other

Map to priority:

| Class | Typical gate |
|-------|----------------|
| Security, data loss, auth broken, cross-user leak | **P0** |
| Blocks comprehension of core product or public trust (legal, delete account, monitoring) | **P1** |
| Polish, minor UX, nice-to-haves | **P2** |
| Interesting ideas outside V1 | **Future roadmap** — do **not** auto-schedule |

Not every Idea becomes roadmap work.

### 9.6 Relationship to AGENTS.md “in-app feedback”

AGENTS lists in-app feedback as Version 1 scope; it is **unimplemented** today.
M5 delivers the **minimal** Send-feedback path as launch infrastructure—not a
full support desk.

---

## 10. Analytics

### 10.1 Goal

Understand activation and return **without** compromising private reading.

### 10.2 Private-beta event set (if analytics ships)

- `sign_up_completed`
- `sign_in` (or session start)
- `first_book_created`
- `first_article_created`
- `first_capture_created`
- `reading_progress_updated` (event only—no page numbers/titles)
- `returning_session` / coarse return signal
- Major application errors belong in **error monitoring**, not marketing analytics

### 10.3 Hard prohibitions

Never send:

- book titles / authors
- article titles / URLs / site names
- capture text, notes, reflections
- search queries that may contain reading content
- library contents
- raw email addresses in event properties

**Identifiers:** Prefer **pseudonymous** user ids (Supabase user UUID or derived hash) over email. Anonymous per-device ids alone are weaker for “returning user” across devices—pseudonymous authenticated id is appropriate **if** disclosed.

### 10.4 Include vs defer

**Working recommendation for private beta:** Prefer **in-app feedback + operational monitoring + founder observation** first. Ship product analytics only if it does not create disproportionate legal/privacy/technical complexity before invites.

**Fallback:** Consciously **defer analytics** for private beta; rely on feedback + host/Supabase logs + qualitative interviews. Revisit before public V1 (P1: either minimal events live **or** written deferral with alternate learning plan).

**Prefer minimalism.** One lightweight tool > a warehouse. Do not implement yet.

---

## 11. Observability (separate from product analytics)

Error monitoring diagnoses failures; analytics measures product behavior. Keep them separate.

### Options

| Option | Pros | Cons | Fit |
|--------|------|------|-----|
| **Host / platform logs only** | Zero new vendor | Weak client-error visibility; harder triage | Insufficient alone for public V1 |
| **Sentry (or equivalent)** | Strong client+server exception grouping | Another processor; must scrub aggressively | Good V1 candidate **if** scrubbing is configured |
| **No dedicated monitoring** | Simplest | Blind to production failures | Unacceptable for public V1; risky even for beta |

**Recommendation:**

- **Private beta P0:** Host deploy/uptime awareness + Supabase Auth logs + founder watching feedback for “something is broken.”
- **Public V1 P1:** Dedicated error monitoring (Sentry **or** equivalent) with scrubbing—**or** prove host-native error tracking meets the same bar. Do not lock forever to Sentry without confirming scrubbing + EU data handling fit; evaluate equivalently capable tools the same way.

**Never intentionally send:** captures, notes, book/article content, tokens, passwords, Authorization headers, cookies.

Capture enough technical context to diagnose (stack, route name band, release version).

---

## 12. Security

### 12.1 Checklist (V1)

| Item | Status |
|------|--------|
| `.env*` gitignored; no secrets in `.env.example` | Implemented — verify git history |
| No service-role in client | Implemented |
| Product routes middleware-gated | Implemented |
| RLS ownership | Implemented in migrations — verify in prod |
| Safe `next` redirect | Implemented |
| `npm audit` | Needs verification (ongoing) |
| Security headers | Needs implementation |
| `/dev/design-system` gated in production | Needs implementation |
| Scrub reading content in error tools | Needs implementation when enabling |
| Auth rate limits | Prefer Supabase defaults — Needs verification |
| Controlled `error.tsx` / `not-found` | Needs implementation |

### 12.2 Isolation tests

**Manual P0:** User A must never read/update/delete User B’s books, articles, or captures (UI + direct API with A’s session).

**Automated P1 (optional):** Live RLS test project—or document that mirrored unit tests are insufficient alone.

---

## 13. Landing-page readiness

**Do not redesign** for aesthetics.

| Item | Status | Gate |
|------|--------|------|
| Positioning + CTA | Implemented | — |
| Responsive | Needs verification | P0 smoke |
| Privacy / Terms links | Missing | P1 |
| Favicon | Implemented | — |
| Title / description | Implemented | P2 polish |
| Open Graph / Twitter | Missing | P1 before public share |
| Accessible structure | Needs verification | P1 |

---

## 14. SEO / metadata

| Item | Status |
|------|--------|
| Root title / description | Implemented |
| Privacy/Terms metadata | Needs implementation when pages exist |
| OG / Twitter image | Needs implementation (simple branded image OK) |
| `robots` for `/dev/*` | Needs implementation |
| Sitemap / advanced SEO | Deferred (P2) |

---

## 15. Production QA checklist

### Auth

- [ ] Sign up → confirmation email → session → Home
- [ ] Sign in / sign out
- [ ] Forgot password → reset → usable session
- [ ] Unauthenticated product routes redirect to sign-in
- [ ] Signed-in `/sign-in` redirects away
- [ ] Unsafe `?next=` rejected
- [ ] Localhost Auth still works on **dev** project

### Data

- [ ] CRUD book / article / capture; refresh persistence
- [ ] Cascade delete book → captures gone
- [ ] Second device same account

### Security

- [ ] Cross-user isolation (UI + API)
- [ ] Anon cannot list others’ rows
- [ ] `/dev/design-system` unavailable in production
- [ ] Service-role absent from client bundle

### Account / feedback

- [ ] Account reachable from peripheral shell
- [ ] Delete account removes data (or documented beta contingency)
- [ ] Send feedback submits without attaching library content
- [ ] Follow-up opt-in default off

### UX (preserve M4)

- [ ] Transitions; reduced motion; empty/loading/errors; mobile/desktop; keyboard; dialogs

### Production

- [ ] Domain + HTTPS; email links; metadata; 404/error; Privacy/Terms

---

## 16. Private beta & learning

### 16.1 Access — working decision

**Invite-only private beta**, target **10–30** readers.

Do **not** build: invitation product, referrals, waitlist ranking, access codes, growth loops.

**Simplest operational method:**

1. Soft landing note: “Private beta — invite only.”
2. Operator invites people out-of-band (email/DM) with the production URL.
3. **Tradeoff — open sign-up still technically works:** lowest eng cost; risk of strangers joining. Acceptable if landing is clear and operator monitors new users daily.
4. **If sign-up must be hard-restricted:** minimum options (pick one later)—temporary disable Create account CTA + Auth disable sign-ups in Supabase, or allowlist emails in a tiny server check. Prefer Supabase “disable sign-ups” + operator-created users for strict control.

No complicated access system in M5.

### 16.2 What we are trying to learn

**Activation** — Can a new user:

1. create an account  
2. understand what Alostra is  
3. add a book or article  
4. create a capture  
5. return to their library  

**Comprehension** — Do they understand Home, Library, Captures, reading progress, and how books/articles relate to captures?

**Value** — What makes them return? What feels most useful / unnecessary? What do they use instead? Would they be disappointed if Alostra disappeared? Do they return after the first session?

**Friction** — Confusing terms, failed flows, missing expectations, bugs, mobile issues, auth friction.

Do not turn beta into a giant research program—short feedback prompts + Send feedback + light founder conversations.

### 16.3 Beta success criteria (practical)

**Hard launch blockers (must be absent to proceed to public V1):**

- Cross-user / security failures
- Persistent data-loss bugs
- Auth/email unreliable on production
- Fundamental product-comprehension failure (users cannot explain what Alostra is for after trying it)
- Missing P1 trust surfaces (Privacy/Terms, account deletion, monitoring as required)

**Useful signals (not vanity thresholds):**

- Users complete core flow without 1:1 assistance
- At least some users voluntarily return
- Feedback is actionable and not dominated by “I don’t know what this is”
- No cluster of P0 bugs remaining

**Exploratory metrics:** return rates, time-to-first-capture—observe baselines; **do not** invent retention % gates before data exists.

### 16.4 Duration

Roughly **2–4 weeks** of active use, or until hard blockers are cleared and qualitative feedback stabilizes—whichever is later.

---

## 17. Launch gate (reassessed)

### P0 — before private beta users

Must exist so invited readers can **safely** use the product:

1. Production HTTPS deploy + correct env vars (prod Supabase)
2. Migrations + RLS + grants verified on production
3. Email confirmation + password-reset working on production URLs
4. Cross-user isolation manually verified
5. Service-role not exposed to clients
6. `/dev/design-system` not publicly useful in production
7. Auth + Data + Security smoke QA (§15 subset)
8. **In-app Send feedback available** — prefer the real lightweight mechanism
   (peripheral entry; Problem / Idea / General; no automatic reading-content
   collection; Supabase-backed with RLS; founder review via Dashboard) **before**
   inviting beta users. A documented manual/interim channel is allowed **only**
   if implementation hits a genuine blocker.
9. Account deletion: self-service **or** documented invite-only manual-deletion contingency owned by the operator
10. Founder can receive/review feedback (Dashboard or interim channel)

### P1 — before public V1

1. Privacy Policy + Terms published, linked, legal-reviewed
2. Self-service account deletion (no permanent waiver)
3. Security headers baseline
4. Error monitoring with scrubbing (or proven host-native equivalent)
5. Open Graph / sharing metadata
6. CI for lint/tsc/test/build
7. Backup/restore owner documented
8. Auth email branding acceptable; SMTP evaluated if triggers hit
9. Analytics: minimal events live **or** conscious written deferral with learning plan
10. Custom `not-found` / user-safe `error` UI
11. Privacy/support contact address decided and published
12. Feedback disclosed in Privacy Policy; retention defined
13. Beta success hard blockers cleared; go/no-go recorded

### P2 — after public launch OK

1. Full data-export product  
2. Advanced SEO  
3. Custom SMTP if default still “good enough”  
4. Live automated RLS CI  
5. Richer APM  
6. Cover-host / auto cover discovery  
7. Import/export, article reader, Pro  
8. Landing copy polish beyond trust links  
9. Admin feedback UI (remain on Dashboard)  

---

## 18. Cost discipline

| Service | Class | Notes |
|---------|-------|-------|
| Supabase (dev + prod) | **Required** | Verify current pricing; free tier may cover beta |
| Vercel | **Required** (working host choice) | Verify current pricing |
| Domain | **Required** for public V1; optional for earliest invite tests | Verify registrar pricing |
| Supabase Auth email (default) | **Required** path for beta | Prefer before paid SMTP |
| Custom SMTP | **Optional** → likely public if triggered | Do not buy until needed |
| Error monitoring (Sentry or equiv.) | **Optional** for earliest beta; **Required-class for public P1** | Verify free tier |
| Product analytics | **Optional**; may defer for beta | Verify if enabled |
| Feedback infrastructure | **Required** capability; prefer **existing Supabase** (no new vendor) | — |
| Legal counsel | **Required** process for public; budget separately | Not infra SaaS |

Do not quote prices without current verification.

---

## 19. Accepted V1 limitations

- No automatic remote book-cover fetching; intentional `BookCover` fallback  
- Frozen `SectionHeading` levels; some titles remain `h2`  
- `ContinueReadingCard` eyebrow handled via Home composition  
- Browser Back: enter transition only (M4)  
- Articles are references (text not imported); no EPUB/PDF storage  
- No import/export product yet  
- `/dev/design-system` must not be a public prod tool  

**Book covers:** Acceptable for launch. No Google Books / Open Library in M5.

---

## 20. Explicitly out of scope

Do **not** implement in Milestone 5:

Reading Memories, Journey, Rediscover, Seasons, Connections, Milestones, Monthly Reading Letter, Reflection, Path, Sessions; AI; social; publishing; comments; followers; likes; streaks; gamification; recommendations; subscriptions/payments.

**User feedback is launch infrastructure, not a social/product-content feature.**

---

## 21. Implementation order (sub-milestones)

**Approved sequence** (frozen). Implement and review each separately. Proceed in
order unless a concrete dependency requires otherwise.

### M5.1 — Production Foundation

- **Objective:** Deployable production baseline.  
- **Scope:** Vercel architecture confirmation; env strategy; production Supabase setup plan; domains/redirects; migration apply verification; gate `/dev/*`; deployment runbook.  
- **Dependencies:** Operator access to Vercel/Supabase/DNS.  
- **Implementation:** Docs/runbook; optional CI stub; production gate for `/dev`.  
- **Manual:** Create projects, DNS, env, Auth URLs, apply migrations.  
- **Acceptance:** HTTPS app; Auth + library CRUD on prod; isolation smoke starts.  
- **Gate relevance:** P0 foundation.

### M5.2 — Account Lifecycle

- **Objective:** Identity management and clean exit.  
- **Scope:** `/account`; password change or reset path; self-service delete semantics; shell peripheral link.  
- **Dependencies:** M5.1; service-role server usage decision.  
- **Implementation:** Account UI; server delete; route gate; tests for delete happy-path mocking.  
- **Manual:** Confirm Auth admin delete behavior in prod project.  
- **Acceptance:** User can delete account; data unread afterward; session cleared; no M4 nav redesign.  
- **Gate:** P0 contingency allowed for invite beta; **P1 required** self-service for public.

### M5.3 — Legal & Trust

- **Objective:** Public trust surfaces for EU-facing launch.  
- **Scope:** Privacy/Terms pages; privacy contact placeholder wiring; landing links; OG/metadata; disclose feedback/analytics/monitoring as enabled.  
- **Dependencies:** Legal timeline; domain for contact address.  
- **Implementation:** Public routes + links + metadata.  
- **Manual:** Counsel-approved copy; choose privacy/support address.  
- **Acceptance:** Pages linked; no false legal claims.  
- **Gate:** P1 public; soft disclosure to invitees for beta if full counsel text pending (document risk).

### M5.4 — Security Hardening & Production QA

- **Objective:** Reduce prod risk.  
- **Scope:** RLS verification, isolation tests, security headers, secrets audit, error/not-found UI, `/dev` exposure, execute §15 QA.  
- **Dependencies:** M5.1.  
- **Implementation:** `next.config` headers; error routes; audit notes.  
- **Manual:** Two-account isolation; `npm audit` judgment.  
- **Acceptance:** P0 security items closed; QA checklist signed.  
- **Gate:** P0/P1 security.

### M5.5 — Observability & Minimal Analytics

- **Objective:** See failures; optionally measure activation.  
- **Scope:** Error monitoring + scrubbing; uptime; minimal analytics **or** documented deferral.  
- **Dependencies:** Vendor accounts; Privacy Policy updates if tools added.  
- **Implementation:** Instrumentation wrappers; forbid reading-content payloads.  
- **Manual:** Create projects; verify scrubbing with a test error.  
- **Acceptance:** Test error visible without reading content; analytics audit or written deferral.  
- **Gate:** Monitoring P1 public; analytics P1 decision.

### M5.6 — User Feedback & Beta Learning

- **Objective:** Users can tell us when something is wrong; founder can triage.  
- **Scope:** Send feedback UI; Supabase feedback table + RLS; privacy; review workflow; beta learning prompts.  
- **Dependencies:** M5.1; Privacy disclosure updates (M5.3) as applicable.  
- **Implementation:** Peripheral entry; form; insert API; migration. Prefer completing this **before** M5.7 invites.  
- **Manual:** Review cadence; classification notes.  
- **Acceptance:** Authenticated user can submit Problem/Idea/General; no auto library content; founder can read rows; follow-up opt-in works.  
- **Gate:** **P0** — real Send feedback before beta invites (interim only on genuine blocker); P1 disclosure complete for public.

### M5.7 — Private Beta & Launch Gate

- **Objective:** Learn from 10–30 invitees; decide public readiness.  
- **Scope:** Invites; execute learning questions; classify feedback into P0/P1/P2/roadmap; run launch gate. When M5 *implementation* is complete, record completion separately—do not confuse plan freeze with milestone completion.  
- **Dependencies:** M5.1–M5.6 as required by P0/P1 (especially M5.6 feedback).  
- **Implementation:** Minimal (copy on landing “invite only” if needed).  
- **Manual:** Invites, conversations, go/no-go.  
- **Acceptance:** Beta complete; hard blockers absent; P0=0; P1 closed/waived; public go/no-go recorded.  
- **Gate:** Exit criteria for M5 implementation.

---

## 22. Files / areas expected to change (when implementing)

| Area | Likely paths |
|------|----------------|
| Account | `src/app/(app)/account/**`, `route-gates.ts`, `app-shell.tsx` (peripheral only) |
| Delete user API | Server-only route/action + service-role |
| Feedback | migration + `src/app/.../feedback` or dialog + repository |
| Legal | `(marketing)/privacy`, `terms` |
| Metadata / OG | `layout.tsx`, `opengraph-image` |
| Headers / robots | `next.config.ts` |
| Monitoring / analytics | `src/lib/monitoring/**`, `src/lib/analytics/**`, `instrumentation.ts` |
| Errors | `not-found.tsx`, `error.tsx` |
| CI | `.github/workflows/ci.yml` |
| Docs | this plan; README roadmap when M5 completes |

**Avoid:** M4 redesigns; token/API freezes broken for convenience; new feedback SaaS without cause.

---

## 23. Manual dashboard / external actions

| Action | Where |
|--------|-------|
| Create **dev** and **prod** Supabase projects | Supabase |
| Apply migrations to each | SQL / CLI |
| Auth Site URL + allowlists per project | Supabase Auth |
| Require email confirmation | Supabase Auth |
| Customize Auth email templates | Supabase Auth |
| Create Vercel project; env; domain | Vercel + DNS |
| Backups / restore owner | Supabase |
| Privacy/Terms legal review | Counsel |
| Choose privacy/support address when domain ready | Email DNS |
| Invite 10–30 beta readers | Manual |
| Review feedback in Dashboard | Supabase |
| Decide analytics include/defer; monitoring vendor | Product |
| Verify vendor pricing | Vendor sites |
| SMTP only if triggers hit | Email provider |

---

## 24. Acceptance criteria (Milestone 5 complete)

1. Production HTTPS app with Auth + library persistence on **production** Supabase.  
2. Cross-user isolation verified (manual P0).  
3. Self-service account deletion before public launch.  
4. Privacy Policy + Terms published and linked (legal-reviewed) before public launch.  
5. Send feedback works without auto-attaching reading content; disclosed in Privacy Policy.  
6. Security headers + safe error surfaces meet P1.  
7. Error monitoring active with scrubbing (public), or equivalent proven.  
8. Analytics shipped under prohibitions **or** conscious deferral documented.  
9. Invite-only beta (~10–30) completed; learning questions answered enough for go/no-go.  
10. Launch gate: P0=0; P1 closed/waived in writing.  
11. M1/M2/M4 freezes intact aside from approved production-correctness touches.  
12. `lint`, `tsc`, `test`, `build` pass.  
13. This document marked **Implemented and frozen** only after the above.

---

## 25. Quick answers for future agents

| Question | Answer |
|----------|--------|
| Before private beta? | §17 P0 |
| Before public V1? | §17 P1 |
| What can wait? | §17 P2 |
| What needs code? | Account, feedback, legal pages, headers, errors, monitoring/analytics wiring, `/dev` gate, CI |
| What needs dashboards? | §23 |
| What needs legal/ops decisions? | Privacy/Terms text, contact address, retention, analytics consent posture |
| What data do we collect? | Account auth data; library data user enters; feedback messages; optional analytics events; error diagnostics—**never** auto reading-content to analytics/errors |
| Why? | Provide the product; learn from beta; keep the service secure and reliable |
| How delete account/data? | Self-service `/account` → Auth user delete → CASCADE (§7) |
| How know users understand/value Alostra? | Beta learning §16 + feedback §9 (+ optional analytics) |
| How users report problems? | In-app Send feedback (§9) |
| When **not** to launch publicly? | Any hard blocker in §16.3 / open P0 or unresolved P1 trust/security items |

---

## 26. Decisions required before / during implementation

| # | Decision | Working default |
|---|----------|-----------------|
| 1 | Host | **Vercel** |
| 2 | Separate Supabase dev/prod | **Yes** |
| 3 | Email confirmation required | **Yes** |
| 4 | Custom SMTP timing | **Beta: Supabase default if OK; public if triggers** |
| 5 | Analytics in private beta | **Prefer defer** if feedback+ops suffice; revisit for public |
| 6 | Error monitoring vendor | **Evaluate Sentry vs equivalent**; required-class for public |
| 7 | Feedback storage | **Supabase table + RLS** |
| 8 | Beta access | **Invite-only**; soft landing vs hard disable sign-ups |
| 9 | Manual delete contingency | **Beta only if needed**; public requires self-service |
| 10 | Privacy contact address | **Decide when domain final** — do not hard-code now |
| 11 | Legal counsel timeline | Operator |
| 12 | Feedback retention period | Legal/ops |

---

## 27. Relationship to earlier milestones

| Milestone | Relationship |
|-----------|----------------|
| M1 Design foundation | Frozen |
| M2 Component library | Frozen — compose only |
| Auth & persistence | Keep; freeze architecture doc when M5 lands if still pending |
| M4 Product experience | Frozen — production-correctness exceptions only |
| M5 (this) | Plan **approved and frozen for implementation**; milestone **not** yet implemented. Feedback is infrastructure, not a product genre expansion |

---

*End of Milestone 5 plan. Plan status: approved and frozen for implementation. Milestone 5 product work is not complete until acceptance criteria are met.*
