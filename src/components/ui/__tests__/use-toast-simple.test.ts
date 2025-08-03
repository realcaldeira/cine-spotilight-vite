import * as useToastModule from '../use-toast';

describe('use-toast re-exports', () => {
  it('should export useToast', () => {
    expect(typeof useToastModule.useToast).toBe('function');
  });

  it('should export toast', () => {
    expect(typeof useToastModule.toast).toBe('function');
  });

  it('should have all expected exports', () => {
    expect(useToastModule).toHaveProperty('useToast');
    expect(useToastModule).toHaveProperty('toast');
  });
});
