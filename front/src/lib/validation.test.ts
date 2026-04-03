import { describe, expect, it } from 'vitest';
import { normalizeLocationInput, validateLocationInput } from './validation';

describe('location validation', () => {
  it('normalizes whitespace', () => {
    expect(normalizeLocationInput('  New   York  ')).toBe('New York');
  });

  it('accepts a normal location', () => {
    expect(validateLocationInput('Helsinki')).toEqual([]);
  });

  it('rejects an empty value', () => {
    expect(validateLocationInput('   ')).toContain('empty');
  });

  it('rejects unsupported characters', () => {
    expect(validateLocationInput('Paris <>')).toContain('invalidCharacters');
  });
});
