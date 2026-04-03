const LOCATION_PATTERN = /^[\p{L}\p{N}\s'",().\/-]+$/u;

export type LocationValidationErrorCode =
  | 'empty'
  | 'tooShort'
  | 'tooLong'
  | 'invalidCharacters'
  | 'missingAlphaNumeric';

export function normalizeLocationInput(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function validateLocationInput(value: string): LocationValidationErrorCode[] {
  const normalized = normalizeLocationInput(value);
  const errors: LocationValidationErrorCode[] = [];

  if (normalized.length === 0) {
    errors.push('empty');
    return errors;
  }

  if (normalized.length < 2) {
    errors.push('tooShort');
  }

  if (normalized.length > 80) {
    errors.push('tooLong');
  }

  if (!LOCATION_PATTERN.test(normalized)) {
    errors.push('invalidCharacters');
  }

  if (!/[A-Za-z\p{L}\p{N}]/u.test(normalized)) {
    errors.push('missingAlphaNumeric');
  }

  return errors;
}
