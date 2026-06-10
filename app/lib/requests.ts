// app/lib/requests.ts
// FIXED version — see PROCESS.md for the original bugs and root cause.
import { createClient } from '@/app/lib/supabase/server';
import { ReviewRequest } from '@/app/types/review-request';

/**
 * Load all review requests, optionally filtered by status.
 * Passing an empty string (or no argument) returns all requests.
 */
export async function getRequestsByStatus(status?: string): Promise<ReviewRequest[]> {
  const supabase = createClient();

  // Bug fix 1: await the query (original was missing `await`)
  // Bug fix 2: Supabase JS SDK returns { data, error } — not `.rows`
  const query = supabase
    .from('review_requests')
    .select('*')
    .order('created_at', { ascending: false });

  // Only apply the status filter when a non-empty value is provided
  if (status && status.trim() !== '') {
    query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch review requests: ${error.message}`);
  }

  return (data ?? []) as ReviewRequest[];
}
