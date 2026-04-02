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
    expect(validateLocationInput('   ')).toContain('Enter a location to search for weather.');
  });

  it('rejects unsupported characters', () => {
    expect(validateLocationInput('Paris <>')).toContain(
      'Use only letters, numbers, spaces, and basic punctuation.',
    );
  });
});

