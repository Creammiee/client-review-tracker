import { describe, test, expect } from 'vitest';
import { reviewRequestSchema } from '../review-request';

describe('reviewRequestSchema', () => {
  test('accepts valid input', () => {
    const result = reviewRequestSchema.safeParse({
      client_name: 'Acme Corp',
      product_asin: 'B08N5WRWNW',
    });
    expect(result.success).toBe(true);
  });

  test('normalizes ASIN to uppercase and trims', () => {
    const result = reviewRequestSchema.safeParse({
      client_name: '  Acme Corp  ',
      product_asin: ' b08n5wrwnw ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.client_name).toBe('Acme Corp');
      expect(result.data.product_asin).toBe('B08N5WRWNW');
    }
  });

  test('rejects missing client_name', () => {
    const result = reviewRequestSchema.safeParse({
      client_name: '',
      product_asin: 'B08N5WRWNW',
    });
    expect(result.success).toBe(false);
  });

  test('rejects invalid ASIN length', () => {
    const result = reviewRequestSchema.safeParse({
      client_name: 'Acme Corp',
      product_asin: 'B08N5WRW',
    });
    expect(result.success).toBe(false);
  });
  
  test('rejects invalid ASIN characters', () => {
    const result = reviewRequestSchema.safeParse({
      client_name: 'Acme Corp',
      product_asin: 'B08N5-RWNW',
    });
    expect(result.success).toBe(false);
  });
});
