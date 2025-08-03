import { useToast, toast } from '../use-toast';

describe('use-toast re-exports', () => {
  it('exports useToast hook', () => {
    expect(typeof useToast).toBe('function');
  });

  it('exports toast function', () => {
    expect(typeof toast).toBe('function');
  });

  it('toast function can be called', () => {
    const result = toast({ title: 'Test' });
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('dismiss');
    expect(result).toHaveProperty('update');
  });
});
