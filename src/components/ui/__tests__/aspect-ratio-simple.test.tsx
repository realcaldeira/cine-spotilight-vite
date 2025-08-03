import { AspectRatio } from '../aspect-ratio';

describe('AspectRatio re-exports', () => {
  it('should export AspectRatio', () => {
    expect(AspectRatio).toBeDefined();
    expect(typeof AspectRatio).toBe('object');
  });

  it('should have all expected exports', () => {
    const exports = { AspectRatio };
    expect(exports).toHaveProperty('AspectRatio');
  });
});
