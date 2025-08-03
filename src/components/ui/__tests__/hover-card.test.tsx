import { render, screen } from '@testing-library/react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../hover-card';

// Mock @radix-ui/react-hover-card
jest.mock('@radix-ui/react-hover-card', () => ({
  Root: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="hover-card-root">{children}</div>
  ),
  Trigger: ({ children, asChild, ...props }: any) =>
    asChild ? (
      children
    ) : (
      <button data-testid="hover-card-trigger" {...props}>
        {children}
      </button>
    ),
  Portal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="hover-card-portal">{children}</div>
  ),
  Content: ({ className, children, align, sideOffset, ...props }: any) => (
    <div
      data-testid="hover-card-content"
      className={className}
      data-align={align}
      data-side-offset={sideOffset}
      {...props}>
      {children}
    </div>
  ),
}));

describe('HoverCard Components', () => {
  describe('HoverCard', () => {
    it('should render hover card root', () => {
      render(
        <HoverCard>
          <HoverCardTrigger>Hover me</HoverCardTrigger>
        </HoverCard>
      );
      expect(screen.getByTestId('hover-card-root')).toBeInTheDocument();
      expect(screen.getByTestId('hover-card-trigger')).toBeInTheDocument();
    });

    it('should handle openDelay prop', () => {
      render(
        <HoverCard openDelay={100}>
          <HoverCardTrigger>Hover trigger</HoverCardTrigger>
          <HoverCardContent>Content</HoverCardContent>
        </HoverCard>
      );
      expect(screen.getByTestId('hover-card-root')).toBeInTheDocument();
    });
  });

  describe('HoverCardTrigger', () => {
    it('should render hover card trigger', () => {
      render(
        <HoverCard>
          <HoverCardTrigger>Hover over me</HoverCardTrigger>
        </HoverCard>
      );
      expect(screen.getByText('Hover over me')).toBeInTheDocument();
    });

    it('should handle asChild prop', () => {
      render(
        <HoverCard>
          <HoverCardTrigger asChild>
            <span data-testid="custom-trigger">Custom Span</span>
          </HoverCardTrigger>
        </HoverCard>
      );
      expect(screen.getByTestId('custom-trigger')).toBeInTheDocument();
    });
  });

  describe('HoverCardContent', () => {
    it('should render hover card content', () => {
      render(
        <HoverCard>
          <HoverCardTrigger>Trigger</HoverCardTrigger>
          <HoverCardContent>Hover card content</HoverCardContent>
        </HoverCard>
      );
      expect(screen.getByTestId('hover-card-content')).toBeInTheDocument();
      expect(screen.getByText('Hover card content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <HoverCard>
          <HoverCardTrigger>Trigger</HoverCardTrigger>
          <HoverCardContent className="custom-content">
            Content
          </HoverCardContent>
        </HoverCard>
      );
      const content = screen.getByTestId('hover-card-content');
      expect(content).toHaveClass('custom-content');
    });

    it('should handle align prop', () => {
      render(
        <HoverCard>
          <HoverCardTrigger>Trigger</HoverCardTrigger>
          <HoverCardContent align="center">Centered content</HoverCardContent>
        </HoverCard>
      );
      const content = screen.getByTestId('hover-card-content');
      expect(content).toHaveAttribute('data-align', 'center');
    });

    it('should handle sideOffset prop', () => {
      render(
        <HoverCard>
          <HoverCardTrigger>Trigger</HoverCardTrigger>
          <HoverCardContent sideOffset={8}>Offset content</HoverCardContent>
        </HoverCard>
      );
      const content = screen.getByTestId('hover-card-content');
      expect(content).toHaveAttribute('data-side-offset', '8');
    });
  });

  describe('Complete HoverCard Structure', () => {
    it('should render complete hover card with profile info', () => {
      render(
        <HoverCard>
          <HoverCardTrigger asChild>
            <a
              href="https://example.com/profile"
              target="_blank"
              rel="noreferrer">
              @example
            </a>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-x-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">@example</h4>
                <p className="text-sm">
                  The React Framework – created and maintained by @vercel.
                </p>
                <div className="flex items-center pt-2">
                  <span className="text-xs text-muted-foreground">
                    Joined December 2021
                  </span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      );

      expect(screen.getAllByText('@example')[0]).toBeInTheDocument();
      expect(
        screen.getByText(
          'The React Framework – created and maintained by @vercel.'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Joined December 2021')).toBeInTheDocument();
    });

    it('should work with custom trigger elements', () => {
      render(
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="underline" data-testid="username-btn">
              johndoe
            </button>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="space-y-2">
              <h4>John Doe</h4>
              <p>Software Engineer at Example Corp</p>
            </div>
          </HoverCardContent>
        </HoverCard>
      );

      expect(screen.getByTestId('username-btn')).toBeInTheDocument();
      expect(screen.getByText('johndoe')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(
        screen.getByText('Software Engineer at Example Corp')
      ).toBeInTheDocument();
    });

    it('should handle different alignment options', () => {
      render(
        <HoverCard>
          <HoverCardTrigger>Hover for info</HoverCardTrigger>
          <HoverCardContent align="end" sideOffset={12}>
            <div>End-aligned content with offset</div>
          </HoverCardContent>
        </HoverCard>
      );

      const content = screen.getByTestId('hover-card-content');
      expect(content).toHaveAttribute('data-align', 'end');
      expect(content).toHaveAttribute('data-side-offset', '12');
      expect(
        screen.getByText('End-aligned content with offset')
      ).toBeInTheDocument();
    });
  });
});
