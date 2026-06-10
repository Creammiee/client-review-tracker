export type ReviewStatus = 'Pending' | 'In Progress' | 'Done';

export const STATUS_OPTIONS: ReviewStatus[] = ['Pending', 'In Progress', 'Done'];

export interface ReviewRequest {
  id: string;
  client_name: string;
  product_asin: string;
  status: ReviewStatus;
  created_at: string;
}
