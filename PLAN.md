# PLAN.md — Client Review Tracker

## Goal
Build a small internal tool to track Amazon review requests for clients.

## Stack
- **Next.js 15** (App Router) + **TypeScript**
- **Supabase** (Postgres) for persistence
- **Tailwind CSS** for styling

---

## Database Schema

```sql
create table review_requests (
  id          uuid primary key default gen_random_uuid(),
  client_name text not null,
  product_asin text not null check (char_length(product_asin) = 10),
  status      text not null default 'Pending'
                check (status in ('Pending', 'In Progress', 'Done')),
  created_at  timestamptz not null default now(),
  -- Duplicate guard: unique constraint on (client_name, product_asin)
  unique (client_name, product_asin)
);
```

## Duplicate Strategy
Reject duplicates at the DB layer via a unique constraint on `(client_name, product_asin)`.  
On conflict, the API returns a 409 with a user-friendly message. Rationale in PROCESS.md.

---

## Features
1. **List page** — server-rendered, shows all requests, filterable by status via URL search param.
2. **Add form** — client component, validates `client_name` (required) & `product_asin` (10 chars).
3. **Status update** — inline dropdown in the list, optimistic UI update, server action to persist.
4. **Filters** — query param `?status=Pending|In Progress|Done|` tabs on the list page.

---

## File Structure

```
app/
  layout.tsx
  page.tsx                     ← redirects to /requests
  requests/
    page.tsx                   ← list + filter (Server Component)
    actions.ts                 ← Server Actions (create, update)
  lib/
    requests.ts                ← getRequestsByStatus (fixed version)
    supabase/
      server.ts
      client.ts
  components/
    RequestList.tsx
    RequestForm.tsx
    StatusBadge.tsx
    StatusFilter.tsx
    StatusSelect.tsx
  types/
    review-request.ts
```

---

## Bug Fix (requests.ts)
Original had two bugs:
1. Missing `await` — returns a Promise, not resolved data.
2. Uses `.rows` — Supabase JS SDK returns `{ data, error }`, not a `.rows` property.

Fixed version awaits the query and returns `data`.

---

## Testing
- Unit test for the `validateASIN` util (10-char check).
- Integration smoke test for the create action.

---

## Commit Plan
1. `chore: scaffold project, install supabase deps`
2. `feat: add supabase client helpers and types`
3. `feat: add db schema sql and env example`
4. `fix: correct getRequestsByStatus bugs`
5. `feat: add server actions for create and update`
6. `feat: add RequestForm component with validation`
7. `feat: add RequestList, StatusBadge, StatusSelect, StatusFilter`
8. `feat: build requests page with server rendering and filters`
9. `test: add unit tests for ASIN validation`
10. `docs: add PROCESS.md and README`
