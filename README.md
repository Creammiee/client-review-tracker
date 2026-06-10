# Client Review Tracker

An internal tool to track Amazon product review requests by client and ASIN.

**Stack:** Next.js 15 (App Router) · TypeScript · Supabase (Postgres) · Tailwind CSS

---

## Features

- **List view** — all review requests, server-rendered
- **Add form** — validates `client_name` (required) and `product_asin` (exactly 10 chars)
- **Inline status update** — change Pending → In Progress → Done from the table
- **Filter by status** — tab-style filter using URL search params
- **Duplicate prevention** — same client + ASIN is rejected with a clear message

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd client-review-tracker
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your Supabase project URL and anon key:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

You can find these in your Supabase project → **Settings → API**.

### 3. Set up the database

In the **Supabase SQL Editor**, run the contents of [`supabase/schema.sql`](./supabase/schema.sql).

This creates the `review_requests` table with the correct constraints and indexes.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/requests`.

---

## Running Tests

```bash
npm test
```

Tests cover the ASIN validation logic and the combined form validator (`__tests__/validation.test.ts`).

---

## Project Structure

```
app/
  components/         UI components (form, list, badges, filters)
  lib/
    requests.ts       Server-side data fetcher (fixed from buggy original)
    validation.ts     Shared validation utilities
    supabase/
      server.ts       Supabase server client (@supabase/ssr)
      client.ts       Supabase browser client
  requests/
    page.tsx          Main list page (Server Component)
    actions.ts        Server Actions for create + update
  types/
    review-request.ts Shared TypeScript types
supabase/
  schema.sql          Database schema (run in Supabase SQL editor)
__tests__/
  validation.test.ts  Unit tests
```

---

## Design Decisions

See [PROCESS.md](./PROCESS.md) for:
- How AI was used during development
- Duplicate handling rationale
- Bug fix analysis
- What I'd improve with more time
