'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/app/lib/supabase/server';
import { reviewRequestSchema } from '@/app/lib/validations/review-request';
import { ReviewStatus } from '@/app/types/review-request';

export interface ActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

// ─── Create ────────────────────────────────────────────────────────────────

export async function createReviewRequest(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = reviewRequestSchema.safeParse({
    client_name: formData.get('client_name'),
    product_asin: formData.get('product_asin'),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const error of parsed.error.issues) {
      if (error.path[0]) {
        fieldErrors[error.path[0] as string] = error.message;
      }
    }
    return { success: false, fieldErrors };
  }

  const { client_name, product_asin } = parsed.data;

  const supabase = await createClient();

  const { error } = await supabase.from('review_requests').insert({
    client_name,
    product_asin,
  });

  if (error) {
    // Postgres unique-violation code: 23505
    if (error.code === '23505') {
      return {
        success: false,
        error: `A review request for "${client_name}" with ASIN ${product_asin} already exists.`,
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
  const supabase = await createClient();

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
