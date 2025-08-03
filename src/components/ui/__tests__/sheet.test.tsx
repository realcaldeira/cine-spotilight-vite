import { render, screen } from '@testing-library/react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '../sheet';

// Mock @radix-ui/react-navigation-menu
jest.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-root">{children}</div>
  ),
  Trigger: ({ children, ...props }: any) => (
    <button data-testid="sheet-trigger" {...props}>
      {children}
    </button>
  ),
  Portal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-portal">{children}</div>
  ),
  Overlay: ({ className, ...props }: any) => (
    <div data-testid="sheet-overlay" className={className} {...props} />
  ),
  Content: ({ className, children, ...props }: any) => (
    <div data-testid="sheet-content" className={className} {...props}>
      {children}
    </div>
  ),
  Title: ({ className, children, ...props }: any) => (
    <h2 data-testid="sheet-title" className={className} {...props}>
      {children}
    </h2>
  ),
  Description: ({ className, children, ...props }: any) => (
    <p data-testid="sheet-description" className={className} {...props}>
      {children}
    </p>
  ),
  Close: ({ className, children, ...props }: any) => (
    <button data-testid="sheet-close" className={className} {...props}>
      {children}
    </button>
  ),
}));

describe('Sheet Components', () => {
  describe('Sheet', () => {
    it('should render sheet root', () => {
      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
        </Sheet>
      );
      expect(screen.getByTestId('sheet-root')).toBeInTheDocument();
      expect(screen.getByTestId('sheet-trigger')).toBeInTheDocument();
    });
  });

  describe('SheetTrigger', () => {
    it('should render sheet trigger', () => {
      render(
        <Sheet>
          <SheetTrigger data-testid="trigger">Open Sheet</SheetTrigger>
        </Sheet>
      );
      expect(screen.getByText('Open Sheet')).toBeInTheDocument();
    });
  });

  describe('SheetContent', () => {
    it('should render sheet content', () => {
      render(
        <Sheet>
          <SheetContent>
            <div>Sheet Content</div>
          </SheetContent>
        </Sheet>
      );
      expect(screen.getByTestId('sheet-content')).toBeInTheDocument();
      expect(screen.getByText('Sheet Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Sheet>
          <SheetContent className="custom-content">Content</SheetContent>
        </Sheet>
      );
      const content = screen.getByTestId('sheet-content');
      expect(content).toHaveClass('custom-content');
    });
  });

  describe('SheetHeader', () => {
    it('should render sheet header', () => {
      render(
        <SheetHeader data-testid="sheet-header">
          <div>Header Content</div>
        </SheetHeader>
      );
      expect(screen.getByTestId('sheet-header')).toBeInTheDocument();
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <SheetHeader className="custom-header" data-testid="sheet-header">
          Header
        </SheetHeader>
      );
      const header = screen.getByTestId('sheet-header');
      expect(header).toHaveClass('custom-header');
    });
  });

  describe('SheetFooter', () => {
    it('should render sheet footer', () => {
      render(
        <SheetFooter data-testid="sheet-footer">
          <div>Footer Content</div>
        </SheetFooter>
      );
      expect(screen.getByTestId('sheet-footer')).toBeInTheDocument();
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <SheetFooter className="custom-footer" data-testid="sheet-footer">
          Footer
        </SheetFooter>
      );
      const footer = screen.getByTestId('sheet-footer');
      expect(footer).toHaveClass('custom-footer');
    });
  });

  describe('SheetTitle', () => {
    it('should render sheet title', () => {
      render(
        <Sheet>
          <SheetContent>
            <SheetTitle>Sheet Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );
      expect(screen.getByTestId('sheet-title')).toBeInTheDocument();
      expect(screen.getByText('Sheet Title')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Sheet>
          <SheetContent>
            <SheetTitle className="custom-title">Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );
      const title = screen.getByTestId('sheet-title');
      expect(title).toHaveClass('custom-title');
    });
  });

  describe('SheetDescription', () => {
    it('should render sheet description', () => {
      render(
        <Sheet>
          <SheetContent>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetContent>
        </Sheet>
      );
      expect(screen.getByTestId('sheet-description')).toBeInTheDocument();
      expect(screen.getByText('Sheet Description')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Sheet>
          <SheetContent>
            <SheetDescription className="custom-description">
              Description
            </SheetDescription>
          </SheetContent>
        </Sheet>
      );
      const description = screen.getByTestId('sheet-description');
      expect(description).toHaveClass('custom-description');
    });
  });

  describe('Complete Sheet Structure', () => {
    it('should render complete sheet with all components', () => {
      render(
        <Sheet>
          <SheetTrigger>Open Complete Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Complete Sheet Title</SheetTitle>
              <SheetDescription>
                This is a complete sheet example
              </SheetDescription>
            </SheetHeader>
            <div>Main content here</div>
            <SheetFooter>
              <button>Cancel</button>
              <button>Save</button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByText('Open Complete Sheet')).toBeInTheDocument();
      expect(screen.getByText('Complete Sheet Title')).toBeInTheDocument();
      expect(
        screen.getByText('This is a complete sheet example')
      ).toBeInTheDocument();
      expect(screen.getByText('Main content here')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
    });
  });
});
