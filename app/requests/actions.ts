'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/app/lib/supabase/server';
import { formatASIN, validateReviewRequest } from '@/app/lib/validation';
import { ReviewStatus } from '@/app/types/review-request';

export interface ActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

// ─── Create ────────────────────────────────────────────────────────────────

export async function createReviewRequest(
  formData: FormData
): Promise<ActionResult> {
  const client_name = (formData.get('client_name') as string) ?? '';
  const product_asin = (formData.get('product_asin') as string) ?? '';

  // Server-side validation
  const fieldErrors = validateReviewRequest(client_name, product_asin);
  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  const supabase = createClient();

  const { error } = await supabase.from('review_requests').insert({
    client_name: client_name.trim(),
    product_asin: formatASIN(product_asin),
  });

  if (error) {
    // Postgres unique-violation code: 23505
    if (error.code === '23505') {
      return {
        success: false,
        error: `A review request for "${client_name.trim()}" with ASIN ${formatASIN(product_asin)} already exists.`,
      };
    }
    return { success: false, error: `Database error: ${error.message}` };
  }

  revalidatePath('/requests');
  return { success: true };
}

// ─── Update Status ─────────────────────────────────────────────────────────

export async function updateRequestStatus(
  id: string,
  status: ReviewStatus
): Promise<ActionResult> {
  const supabase = createClient();

  const { error } = await supabase
    .from('review_requests')
    .update({ status })
    .eq('id', id);

  if (error) {
    return { success: false, error: `Failed to update status: ${error.message}` };
  }

  revalidatePath('/requests');
  return { success: true };
}
