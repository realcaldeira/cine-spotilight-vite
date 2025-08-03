import { Badge, badgeVariants, BadgeProps } from '../badge';

describe('Badge component and exports', () => {
  it('should export Badge component', () => {
    expect(Badge).toBeDefined();
    expect(typeof Badge).toBe('function');
  });

  it('should export badgeVariants', () => {
    expect(badgeVariants).toBeDefined();
    expect(typeof badgeVariants).toBe('function');
  });

  it('should create badge variants for different types', () => {
    const defaultVariant = badgeVariants({ variant: 'default' });
    const secondaryVariant = badgeVariants({ variant: 'secondary' });
    const destructiveVariant = badgeVariants({ variant: 'destructive' });
    const outlineVariant = badgeVariants({ variant: 'outline' });

    expect(typeof defaultVariant).toBe('string');
    expect(typeof secondaryVariant).toBe('string');
    expect(typeof destructiveVariant).toBe('string');
    expect(typeof outlineVariant).toBe('string');

    expect(defaultVariant).toContain('inline-flex');
    expect(secondaryVariant).toContain('inline-flex');
    expect(destructiveVariant).toContain('inline-flex');
    expect(outlineVariant).toContain('inline-flex');
  });

  it('should handle no variant (default)', () => {
    const defaultStyle = badgeVariants();
    expect(typeof defaultStyle).toBe('string');
    expect(defaultStyle).toContain('inline-flex');
  });

  it('should have proper TypeScript interface', () => {

    const props: BadgeProps = {
      className: 'test-class',
      variant: 'secondary',
      onClick: () => {},
    };

    expect(props).toBeDefined();
    expect(props.variant).toBe('secondary');
  });
});
