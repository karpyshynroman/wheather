export function validateEmailInput(value: string): string[] {
  const normalized = value.trim();
  const errors: string[] = [];

  if (normalized.length === 0) {
    errors.push('auth.email.required');
    return errors;
  }

  if (normalized.length > 254) {
    errors.push('auth.email.tooLong');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    errors.push('auth.email.invalid');
  }

  return errors;
}

export function validatePasswordInput(value: string): string[] {
  const normalized = value.trim();
  const errors: string[] = [];

  if (normalized.length === 0) {
    errors.push('auth.password.required');
    return errors;
  }

  if (normalized.length < 8) {
    errors.push('auth.password.tooShort');
  }

  if (normalized.length > 128) {
    errors.push('auth.password.tooLong');
  }

  return errors;
}
