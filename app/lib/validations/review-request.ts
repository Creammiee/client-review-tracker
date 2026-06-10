import { z } from 'zod';

export const reviewRequestSchema = z.object({
  client_name: z.string().trim().min(1, 'Client name is required.'),
  product_asin: z
    .string()
    .trim()
    .toUpperCase()
    .length(10, 'ASIN must be exactly 10 alphanumeric characters (e.g. B08N5WRWNW).')
    .regex(/^[A-Z0-9]{10}$/, 'ASIN must contain only uppercase letters and numbers.'),
});

export type ReviewRequestInput = z.infer<typeof reviewRequestSchema>;
