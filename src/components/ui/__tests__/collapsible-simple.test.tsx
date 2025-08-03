import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../collapsible';

describe('Collapsible re-exports', () => {
  it('should export Collapsible', () => {
    expect(Collapsible).toBeDefined();
    expect(typeof Collapsible).toBe('object');
  });

  it('should export CollapsibleTrigger', () => {
    expect(CollapsibleTrigger).toBeDefined();
    expect(typeof CollapsibleTrigger).toBe('object');
  });

  it('should export CollapsibleContent', () => {
    expect(CollapsibleContent).toBeDefined();
    expect(typeof CollapsibleContent).toBe('object');
  });

  it('should have all expected exports', () => {
    const exports = { Collapsible, CollapsibleTrigger, CollapsibleContent };
    expect(exports).toHaveProperty('Collapsible');
    expect(exports).toHaveProperty('CollapsibleTrigger');
    expect(exports).toHaveProperty('CollapsibleContent');
  });
});
