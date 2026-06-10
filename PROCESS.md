# PROCESS.md — Client Review Tracker

## How I used AI

I used Antigravity as a full pair-programming co-pilot throughout this build.

**What I delegated:**
- Scaffolding: `create-next-app` command options, Supabase `@supabase/ssr` boilerplate.
- Generating the core CRUD server actions and the table/form components.
- Writing the initial test suite for the Zod validation utilities with Vitest.
- Restructuring folders for clean architecture (`app/actions/`, `app/lib/validations/`, etc.).

**What worked well:**
- Prompting the AI to generate the fixed `requests.ts` immediately after explaining the bug types — it correctly identified `await`, the `{ data, error }` destructuring, and even caught a subtle immutable query builder bug.
- Implementing Zod validation inside the server action seamlessly alongside the form integration.

**One mistake the AI made:**
- In the first "fixed" draft of `getRequestsByStatus`, the AI wrote `query.eq('status', status)` without reassigning the result. Supabase's query builder is **immutable** — every method returns a new builder; mutating the old reference does nothing. The filter was silently discarded, meaning a status-filtered call still returned *all* rows. I caught this during self-diff review and corrected it to `query = query.eq('status', status)` with `let` instead of `const`.

---

## Duplicate Handling Decision

**Decision: Reject duplicates at the database layer using a unique constraint `UNIQUE (client_name, product_asin)`.**

**Why:**
- Data Integrity: The source of truth should be the DB. Relying only on application-level checks creates a race condition window where concurrent requests could bypass the check.
- Keep Operational Data Clean: A duplicate request for the exact same client and product is likely a mistake. Rejecting it prevents duplicate outreach and keeps the team's queue actionable.
- The server action catches the Postgres error code `23505` (unique_violation) and surfaces a readable, user-friendly message to the user rather than failing silently.

---

## Debug Task: `getRequestsByStatus` Root Cause Analysis

**Original code:**
```ts
import { createClient } from '@/lib/supabase/server'

export async function getRequestsByStatus(status: string) {
  const supabase = createClient()
  const result = supabase
    .from('review_requests')
    .select('*')
    .eq('status', status)
  return result.rows
}
```

**Root Causes Found:**
1. **Missing `await` on `createClient`**: In Next.js 15, `cookies()` is asynchronous, which requires `createClient` to be an `async` function. The original code did not await it.
2. **Missing `await` on Query**: Supabase query builders return a "Thenable". Without `await`, the query is never executed, and `result` is just the builder object.
3. **Invalid `result.rows` Access**: Supabase JS returns `{ data, error }`. It does not return `.rows` like the raw `pg` Node driver.
4. **No Error Handling**: The query could fail (e.g. RLS issues, syntax error), but no error check was performed before returning data.

**Fixed implementation:**
```ts
import { createClient } from '@/lib/supabase/server'

export async function getRequestsByStatus(status: string) {
  const supabase = await createClient()

  let query = supabase.from('review_requests').select('*').order('created_at', { ascending: false });
  
  if (status && status.trim() !== '') {
    query = query.eq('status', status); // Need to reassign because builder is immutable
  }
  
  const { data, error } = await query;

  if (error) {
    throw new Error(error.message)
  }

  return data
}
```

---

## With More Time, I'd Add

- **Row-level security (RLS)** on the Supabase table so only authenticated internal users can read/write.
- **Authentication** with Supabase Auth + middleware to protect `/requests`.
- **Optimistic UI** using React's `useOptimistic` for the status dropdown (currently uses `useTransition` which blocks on network).
- **Pagination** for large datasets.
- **Audit log** — a `status_history` table recording every status transition with timestamp and actor.
- **E2E tests** with Playwright covering the happy path and the duplicate-rejection flow.
