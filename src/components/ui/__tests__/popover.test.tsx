import { render, screen } from '@testing-library/react';
import { Popover, PopoverTrigger, PopoverContent } from '../popover';

// Mock @radix-ui/react-popover
jest.mock('@radix-ui/react-popover', () => ({
  Root: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-root">{children}</div>
  ),
  Trigger: ({ children, asChild, ...props }: any) =>
    asChild ? (
      children
    ) : (
      <button data-testid="popover-trigger" {...props}>
        {children}
      </button>
    ),
  Portal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-portal">{children}</div>
  ),
  Content: ({ className, children, align, sideOffset, ...props }: any) => (
    <div
      data-testid="popover-content"
      className={className}
      data-align={align}
      data-side-offset={sideOffset}
      {...props}>
      {children}
    </div>
  ),
}));

describe('Popover Components', () => {
  describe('Popover', () => {
    it('should render popover root', () => {
      render(
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
        </Popover>
      );
      expect(screen.getByTestId('popover-root')).toBeInTheDocument();
      expect(screen.getByTestId('popover-trigger')).toBeInTheDocument();
    });

    it('should handle open state', () => {
      render(
        <Popover open={true}>
          <PopoverTrigger>Open Trigger</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      );
      expect(screen.getByTestId('popover-root')).toBeInTheDocument();
    });
  });

  describe('PopoverTrigger', () => {
    it('should render popover trigger', () => {
      render(
        <Popover>
          <PopoverTrigger>Click me</PopoverTrigger>
        </Popover>
      );
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should handle asChild prop', () => {
      render(
        <Popover>
          <PopoverTrigger asChild>
            <button data-testid="custom-trigger">Custom Button</button>
          </PopoverTrigger>
        </Popover>
      );
      expect(screen.getByTestId('custom-trigger')).toBeInTheDocument();
    });
  });

  describe('PopoverContent', () => {
    it('should render popover content', () => {
      render(
        <Popover>
          <PopoverTrigger>Trigger</PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
      );
      expect(screen.getByTestId('popover-content')).toBeInTheDocument();
      expect(screen.getByText('Popover content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Popover>
          <PopoverTrigger>Trigger</PopoverTrigger>
          <PopoverContent className="custom-content">Content</PopoverContent>
        </Popover>
      );
      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass('custom-content');
    });

    it('should handle align prop', () => {
      render(
        <Popover>
          <PopoverTrigger>Trigger</PopoverTrigger>
          <PopoverContent align="start">Aligned content</PopoverContent>
        </Popover>
      );
      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-align', 'start');
    });

    it('should handle sideOffset prop', () => {
      render(
        <Popover>
          <PopoverTrigger>Trigger</PopoverTrigger>
          <PopoverContent sideOffset={4}>Offset content</PopoverContent>
        </Popover>
      );
      const content = screen.getByTestId('popover-content');
      expect(content).toHaveAttribute('data-side-offset', '4');
    });
  });

  describe('Complete Popover Structure', () => {
    it('should render complete popover with trigger and content', () => {
      render(
        <Popover>
          <PopoverTrigger>Open popover</PopoverTrigger>
          <PopoverContent>
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Dimensions</h4>
                <p className="text-sm text-muted-foreground">
                  Set the dimensions for the layer.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="width">Width</label>
                  <input
                    id="width"
                    defaultValue="100%"
                    className="col-span-2"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="height">Height</label>
                  <input
                    id="height"
                    defaultValue="25px"
                    className="col-span-2"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      );

      expect(screen.getByText('Open popover')).toBeInTheDocument();
      expect(screen.getByText('Dimensions')).toBeInTheDocument();
      expect(
        screen.getByText('Set the dimensions for the layer.')
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Width')).toBeInTheDocument();
      expect(screen.getByLabelText('Height')).toBeInTheDocument();
    });

    it('should work with custom trigger component', () => {
      render(
        <Popover>
          <PopoverTrigger asChild>
            <button className="btn-primary" data-testid="custom-btn">
              Settings
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <div>Settings panel</div>
          </PopoverContent>
        </Popover>
      );

      expect(screen.getByTestId('custom-btn')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Settings panel')).toBeInTheDocument();
    });
  });
});
