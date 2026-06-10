# PROCESS.md — Client Review Tracker

## How I used AI

I used Antigravity (Claude-based) as a full pair-programming co-pilot throughout this build.

**What I delegated:**
- Scaffolding: `create-next-app` command options, Supabase `@supabase/ssr` boilerplate.
- Generating the core CRUD server actions and the table/form components.
- Writing the initial test suite for the validation utilities.

**What worked well:**
- Prompting the AI to generate the fixed `requests.ts` immediately after explaining both bug types — it correctly identified `await` and the `.rows` vs `{ data, error }` distinction in one shot.
- Having it emit the `useActionState` form pattern, which is the idiomatic React 19 / Next.js 15 way to bind server actions to forms.

**One moment the AI was wrong:**
- In the first "fixed" draft of `getRequestsByStatus`, the AI wrote `query.eq('status', status)` without reassigning the result. Supabase's query builder is **immutable** — every method returns a new builder; mutating the old reference does nothing. The filter was silently discarded, meaning a status-filtered call still returned *all* rows. I caught this during self-diff review and corrected it to `query = query.eq('status', status)` with `let` instead of `const`.

---

## Duplicate Handling Decision

**Decision: Reject at the database layer with a user-friendly 409-style message.**

**Why:**
- The source of truth should be the DB. Relying only on application-level checks creates a race condition window (two tabs, two servers).
- A `UNIQUE (client_name, product_asin)` constraint is atomic and survives schema migrations without code changes.
- The tradeoff: this doesn't allow re-requesting a review for the same ASIN after a campaign completes. In a real product, I'd add a `campaign_id` or `cycle` column so multiple campaigns per client+ASIN are distinguishable. For the scope of this test, hard rejection keeps the data clean and the UX honest.
- The server action catches Postgres error code `23505` (unique_violation) and surfaces a readable message to the user — no silent swallows.

**Alternatives considered:**
1. **Allow duplicates** — rejected; creates messy data and hard-to-track state.
2. **Soft-block on the client only** — rejected; race conditions, easy to bypass.
3. **Auto-increment a counter / create a new entry under a campaign** — valid for production; out of scope here.

---

## Bug Fix: `getRequestsByStatus`

**Original code:**
```ts
export async function getRequestsByStatus(status: string) {
  const supabase = createClient()
  const result = supabase         // ← Bug 1: no `await`
    .from('review_requests')
    .select('*')
    .eq('status', status)
  return result.rows              // ← Bug 2: `.rows` doesn't exist on Supabase response
}
```

**Bug 1 — Missing `await`**  
Root cause: the Supabase JS client returns a `PromiseLike` (thenable) when you call `.select()`. Without `await`, `result` is the pending Promise object, not the resolved response. The function returns a Promise rather than data, and any caller that doesn't re-await it gets `undefined` from `.rows`.

**Bug 2 — `.rows` property**  
Root cause: the Supabase JS SDK (v2+) returns `{ data: T[] | null, error: PostgrestError | null }` — not an object with a `.rows` property (that's the `pg` raw Node driver). Accessing `.rows` on the resolved response returns `undefined`.

**Fixed version:**
```ts
let query = supabase.from('review_requests').select('*').order('created_at', { ascending: false });
if (status && status.trim() !== '') {
  query = query.eq('status', status); // reassign — builder is immutable
}
const { data, error } = await query;
if (error) throw new Error(error.message);
return (data ?? []) as ReviewRequest[];
```

**Bug 3 (self-review catch) — Immutable query builder**  
Root cause: the initial "fixed" version called `query.eq('status', status)` without reassigning the result. The Supabase JS query builder is **immutable** — every chaining method returns a *new* builder instance; the original reference is unchanged. The filter was silently dropped and every status-filtered call would return *all* rows. Caught during self-diff review and fixed by changing `const query` → `let query` and reassigning: `query = query.eq(...)`.


---

## With More Time, I'd Add

- **Row-level security (RLS)** on the Supabase table so only authenticated internal users can read/write.
- **Authentication** with Supabase Auth + middleware to protect `/requests`.
- **Optimistic UI** using React's `useOptimistic` for the status dropdown (currently uses `useTransition` which blocks on network).
- **Pagination** for large datasets — `range()` on the Supabase query.
- **Audit log** — a `status_history` table recording every status transition with timestamp and actor.
- **E2E tests** with Playwright covering the happy path and the duplicate-rejection flow.
- **Campaign/cycle concept** to allow re-requesting the same ASIN for a new campaign without fighting the unique constraint.
