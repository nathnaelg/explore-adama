import { describe, it, expect } from 'vitest';
import { cn } from './helpers';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('flex', 'items-center')).toBe('flex items-center');
  });

  it('handles conditional classes', () => {
    expect(cn('flex', true && 'items-center', false && 'p-4')).toBe('flex items-center');
  });

  it('resolves Tailwind conflicts correctly', () => {
    // twMerge should handle conflicts like px-2 and px-4
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles undefined and null inputs', () => {
    expect(cn('flex', undefined, null)).toBe('flex');
  });

  it('handles array inputs', () => {
    expect(cn(['flex', 'items-center'], 'p-4')).toBe('flex items-center p-4');
  });
});
