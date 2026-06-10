import { validateASIN, validateReviewRequest } from '@/app/lib/validation';

describe('validateASIN', () => {
  test('accepts a standard uppercase ASIN', () => {
    expect(validateASIN('B08N5WRWNW')).toBe(true);
  });

  test('accepts a lowercase ASIN (normalised internally)', () => {
    expect(validateASIN('b08n5wrwnw')).toBe(true);
  });

  test('rejects an ASIN shorter than 10 chars', () => {
    expect(validateASIN('B08N5WRW')).toBe(false);
  });

  test('rejects an ASIN longer than 10 chars', () => {
    expect(validateASIN('B08N5WRWNW1')).toBe(false);
  });

  test('rejects an ASIN with special characters', () => {
    expect(validateASIN('B08N5WRW-W')).toBe(false);
  });

  test('rejects an empty string', () => {
    expect(validateASIN('')).toBe(false);
  });

  test('trims whitespace before validating', () => {
    expect(validateASIN('  B08N5WRWNW  ')).toBe(true);
  });
});

describe('validateReviewRequest', () => {
  test('returns no errors for valid input', () => {
    const errors = validateReviewRequest('Acme Corp', 'B08N5WRWNW');
    expect(errors).toEqual({});
  });

  test('returns error for missing client_name', () => {
    const errors = validateReviewRequest('', 'B08N5WRWNW');
    expect(errors.client_name).toBeDefined();
  });

  test('returns error for invalid ASIN', () => {
    const errors = validateReviewRequest('Acme Corp', 'TOOSHORT');
    expect(errors.product_asin).toBeDefined();
  });

  test('returns both errors for fully empty input', () => {
    const errors = validateReviewRequest('', '');
    expect(errors.client_name).toBeDefined();
    expect(errors.product_asin).toBeDefined();
  });
});
