import { cn } from '@/lib/utils';

describe('utils', () => {
  it('should merge class names correctly', () => {
    const result = cn('class1', 'class2');
    expect(typeof result).toBe('string');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const isHidden = false;
    const result = cn('base', isActive && 'conditional', isHidden && 'hidden');
    expect(typeof result).toBe('string');
    expect(result).toContain('base');
    expect(result).toContain('conditional');
    expect(result).not.toContain('hidden');
  });

  it('should handle empty inputs', () => {
    const result = cn();
    expect(typeof result).toBe('string');
  });

  it('should handle undefined and null', () => {
    const result = cn('class1', undefined, null, 'class2');
    expect(typeof result).toBe('string');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });
});
