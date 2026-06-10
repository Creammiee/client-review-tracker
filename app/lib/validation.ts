/**
 * Validation utilities shared between client and server.
 */

/** Amazon ASINs are exactly 10 alphanumeric characters. */
export function validateASIN(asin: string): boolean {
  return /^[A-Z0-9]{10}$/.test(asin.trim().toUpperCase());
}

export function formatASIN(asin: string): string {
  return asin.trim().toUpperCase();
}

export interface ValidationErrors {
  client_name?: string;
  product_asin?: string;
}

export function validateReviewRequest(
  client_name: string,
  product_asin: string
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!client_name || client_name.trim() === '') {
    errors.client_name = 'Client name is required.';
  }

  if (!product_asin || product_asin.trim() === '') {
    errors.product_asin = 'Product ASIN is required.';
  } else if (!validateASIN(product_asin)) {
    errors.product_asin =
      'ASIN must be exactly 10 alphanumeric characters (e.g. B08N5WRWNW).';
  }

  return errors;
}
