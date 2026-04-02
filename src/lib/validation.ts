const LOCATION_PATTERN = /^[\p{L}\p{N}\s'",().\/-]+$/u;

export function normalizeLocationInput(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function validateLocationInput(value: string): string[] {
  const normalized = normalizeLocationInput(value);
  const errors: string[] = [];

  if (normalized.length === 0) {
    errors.push('Enter a location to search for weather.');
    return errors;
  }

  if (normalized.length < 2) {
    errors.push('Location must contain at least 2 characters.');
  }

  if (normalized.length > 80) {
    errors.push('Location must be 80 characters or fewer.');
  }

  if (!LOCATION_PATTERN.test(normalized)) {
    errors.push('Use only letters, numbers, spaces, and basic punctuation.');
  }

  if (!/[A-Za-z\p{L}\p{N}]/u.test(normalized)) {
    errors.push('Location must include at least one letter or number.');
  }

  return errors;
}

