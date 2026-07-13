import { formatCurrency, slugify, isValidEmail, isValidPhone, calculatePagination, formatFileSize, capitalize, toTitleCase } from '../index';

describe('formatCurrency', () => {
  it('formats IDR correctly', () => {
    const result = formatCurrency(15000);
    expect(result).toContain('Rp');
    expect(result).toContain('15');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toContain('0');
  });
});

describe('slugify', () => {
  it('converts text to slug', () => {
    expect(slugify('Toko Dodol Mak')).toBe('toko-dodol-mak');
  });

  it('removes special characters', () => {
    expect(slugify('Halo! @Dunia #2024')).toBe('halo-dunia-2024');
  });

  it('handles multiple spaces', () => {
    expect(slugify('a   b')).toBe('a-b');
  });
});

describe('isValidEmail', () => {
  it('accepts valid email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(isValidEmail('invalid')).toBe(false);
  });
});

describe('isValidPhone', () => {
  it('accepts Indonesian phone', () => {
    expect(isValidPhone('081234567890')).toBe(true);
  });

  it('accepts phone with +62', () => {
    expect(isValidPhone('+6281234567890')).toBe(true);
  });

  it('rejects too short phone', () => {
    expect(isValidPhone('081')).toBe(false);
  });
});

describe('calculatePagination', () => {
  it('calculates pagination correctly', () => {
    const result = calculatePagination(1, 10, 25);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(3);
    expect(result.hasNext).toBe(true);
    expect(result.hasPrev).toBe(false);
  });

  it('handles last page', () => {
    const result = calculatePagination(3, 10, 25);
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(true);
  });
});

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(500)).toContain('Bytes');
  });

  it('formats KB', () => {
    expect(formatFileSize(2048)).toContain('KB');
  });

  it('formats MB', () => {
    expect(formatFileSize(1048576)).toContain('MB');
  });
});

describe('capitalize', () => {
  it('capitalizes first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });
});

describe('toTitleCase', () => {
  it('converts to title case', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
  });
});
