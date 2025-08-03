import { render, screen } from '@testing-library/react';
import { Alert, AlertDescription, AlertTitle } from '../alert';

describe('Alert Components', () => {
  describe('Alert', () => {
    it('should render alert with children', () => {
      render(
        <Alert>
          <div>Alert content</div>
        </Alert>
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Alert content')).toBeInTheDocument();
    });

    it('should render alert with default variant', () => {
      render(
        <Alert data-testid="alert">
          <div>Default alert</div>
        </Alert>
      );
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('bg-background', 'text-foreground');
    });

    it('should render alert with destructive variant', () => {
      render(
        <Alert variant="destructive" data-testid="alert">
          <div>Error alert</div>
        </Alert>
      );
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('border-destructive/50', 'text-destructive');
    });

    it('should apply custom className', () => {
      render(
        <Alert className="custom-alert" data-testid="alert">
          Content
        </Alert>
      );
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass('custom-alert');
    });

    it('should have proper styling classes', () => {
      render(<Alert data-testid="alert">Content</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert).toHaveClass(
        'relative',
        'w-full',
        'rounded-lg',
        'border',
        'p-4'
      );
    });

    it('should render as div element', () => {
      render(<Alert data-testid="alert">Content</Alert>);
      const alert = screen.getByTestId('alert');
      expect(alert.tagName).toBe('DIV');
    });
  });

  describe('AlertTitle', () => {
    it('should render alert title', () => {
      render(<AlertTitle>Warning</AlertTitle>);
      expect(screen.getByText('Warning')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <AlertTitle className="custom-title" data-testid="alert-title">
          Title
        </AlertTitle>
      );
      const title = screen.getByTestId('alert-title');
      expect(title).toHaveClass('custom-title');
    });

    it('should have proper styling classes', () => {
      render(<AlertTitle data-testid="alert-title">Title</AlertTitle>);
      const title = screen.getByTestId('alert-title');
      expect(title).toHaveClass(
        'mb-1',
        'font-medium',
        'leading-none',
        'tracking-tight'
      );
    });

    it('should render as h5 element by default', () => {
      render(<AlertTitle data-testid="alert-title">Title</AlertTitle>);
      const title = screen.getByTestId('alert-title');
      expect(title.tagName).toBe('H5');
    });
  });

  describe('AlertDescription', () => {
    it('should render alert description', () => {
      render(<AlertDescription>This is an important message</AlertDescription>);
      expect(
        screen.getByText('This is an important message')
      ).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <AlertDescription className="custom-desc" data-testid="alert-desc">
          Description
        </AlertDescription>
      );
      const desc = screen.getByTestId('alert-desc');
      expect(desc).toHaveClass('custom-desc');
    });

    it('should have proper styling classes', () => {
      render(
        <AlertDescription data-testid="alert-desc">
          Description
        </AlertDescription>
      );
      const desc = screen.getByTestId('alert-desc');
      expect(desc).toHaveClass('text-sm');
    });

    it('should render as div element by default', () => {
      render(
        <AlertDescription data-testid="alert-desc">
          Description
        </AlertDescription>
      );
      const desc = screen.getByTestId('alert-desc');
      expect(desc.tagName).toBe('DIV');
    });
  });

  describe('Complete Alert Structure', () => {
    it('should render complete alert with title and description', () => {
      render(
        <Alert data-testid="complete-alert">
          <AlertTitle>System Update</AlertTitle>
          <AlertDescription>
            A new system update is available. Please restart your application.
          </AlertDescription>
        </Alert>
      );

      expect(screen.getByTestId('complete-alert')).toBeInTheDocument();
      expect(screen.getByText('System Update')).toBeInTheDocument();
      expect(
        screen.getByText(
          'A new system update is available. Please restart your application.'
        )
      ).toBeInTheDocument();
    });

    it('should render destructive alert with all components', () => {
      render(
        <Alert variant="destructive" data-testid="error-alert">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again later.
          </AlertDescription>
        </Alert>
      );

      const alert = screen.getByTestId('error-alert');
      expect(alert).toHaveClass('border-destructive/50', 'text-destructive');
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(
        screen.getByText('Something went wrong. Please try again later.')
      ).toBeInTheDocument();
    });

    it('should support forwarded refs', () => {
      const ref = { current: null };
      render(
        <Alert ref={ref} data-testid="ref-alert">
          Content
        </Alert>
      );
      expect(screen.getByTestId('ref-alert')).toBeInTheDocument();
    });
  });
});
