# PLAN.md — Client Review Tracker

## Goal
Build a small internal tool to track Amazon review requests for clients, demonstrating an AI-assisted workflow, clean architecture, and sound engineering decisions.

## Stack
- **Next.js 15+** (App Router) + **TypeScript**
- **Supabase** (Postgres) for database
- **Tailwind CSS** for styling
- **Zod** for schema validation
- **Vitest** for testing

---

## Architecture & File Structure

```text
app/
  layout.tsx
  page.tsx                     ← redirects to /requests
  actions/
    requests.ts                ← Server Actions (create, update)
  components/
    RequestList.tsx            ← Renders the table
    RequestForm.tsx            ← Client form component
    StatusBadge.tsx
    StatusFilter.tsx
    StatusSelect.tsx
  lib/
    services/
      requests.ts              ← Server-side fetching
    validations/
      review-request.ts        ← Zod schema
    supabase/
      server.ts
      client.ts
  requests/
    page.tsx                   ← list + filter (Server Component)
  types/
    review-request.ts          ← Shared types
__tests__/                     ← Handled in same directories via vitest, or root __tests__
```

---

## Database Schema

```sql
create table review_requests (
  id          uuid primary key default gen_random_uuid(),
  client_name text not null,
  product_asin text not null,
  status      text not null default 'Pending'
                check (status in ('Pending', 'In Progress', 'Done')),
  created_at  timestamptz not null default now(),
  -- Duplicate guard: unique constraint on (client_name, product_asin)
  unique (client_name, product_asin)
);
```

## Features & Implementation Steps
1. **Initialize Project**: Setup Next.js, Tailwind, Supabase helpers, Zod, and Vitest.
2. **List Page**: Server-rendered `app/requests/page.tsx` showing requests, filtering by status.
3. **Add Form**: Client-side form using `useActionState`, calling a Server Action.
4. **Validation**: Use Zod to enforce `client_name` presence and 10-character `product_asin` format.
5. **Duplicate Handling**: Rely on the DB `UNIQUE` constraint to reject duplicates and map Postgres error `23505` to a user-friendly UI message.
6. **Tests**: Add Vitest to verify ASIN validation behavior via Zod schema.
