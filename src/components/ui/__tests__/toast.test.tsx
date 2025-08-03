import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '../toast';
import userEvent from '@testing-library/user-event';

// Mock Radix UI Toast
jest.mock('@radix-ui/react-toast', () => ({
  Provider: ({ children }: any) => (
    <div data-testid="toast-provider">{children}</div>
  ),
  Root: ({ children, className, ...props }: any) => (
    <div data-testid="toast-root" className={className} {...props}>
      {children}
    </div>
  ),
  Viewport: ({ children, className, ...props }: any) => (
    <div data-testid="toast-viewport" className={className} {...props}>
      {children}
    </div>
  ),
  Title: ({ children, className, ...props }: any) => (
    <div data-testid="toast-title" className={className} {...props}>
      {children}
    </div>
  ),
  Description: ({ children, className, ...props }: any) => (
    <div data-testid="toast-description" className={className} {...props}>
      {children}
    </div>
  ),
  Action: ({ children, className, altText, ...props }: any) => (
    <button
      data-testid="toast-action"
      className={className}
      aria-label={altText}
      {...props}>
      {children}
    </button>
  ),
  Close: ({ children, className, ...props }: any) => (
    <button data-testid="toast-close" className={className} {...props}>
      {children || '×'}
    </button>
  ),
}));

describe('Toast Components', () => {
  describe('ToastProvider', () => {
    it('should render toast provider', () => {
      render(
        <ToastProvider>
          <div>Content</div>
        </ToastProvider>
      );
      expect(screen.getByTestId('toast-provider')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('ToastViewport', () => {
    it('should render toast viewport', () => {
      render(<ToastViewport />);
      expect(screen.getByTestId('toast-viewport')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<ToastViewport className="custom-viewport" />);
      const viewport = screen.getByTestId('toast-viewport');
      expect(viewport).toHaveClass('custom-viewport');
    });

    it('should have proper styling classes', () => {
      render(<ToastViewport />);
      const viewport = screen.getByTestId('toast-viewport');
      expect(viewport).toHaveClass(
        'fixed',
        'top-0',
        'z-[100]',
        'flex',
        'max-h-screen',
        'w-full',
        'flex-col-reverse',
        'p-4'
      );
    });
  });

  describe('Toast', () => {
    it('should render toast with default variant', () => {
      render(
        <Toast>
          <div>Toast content</div>
        </Toast>
      );
      expect(screen.getByTestId('toast-root')).toBeInTheDocument();
      expect(screen.getByText('Toast content')).toBeInTheDocument();
    });

    it('should render toast with destructive variant', () => {
      render(
        <Toast variant="destructive">
          <div>Error toast</div>
        </Toast>
      );
      const toast = screen.getByTestId('toast-root');
      expect(toast).toHaveClass('destructive');
    });

    it('should apply custom className', () => {
      render(<Toast className="custom-toast">Content</Toast>);
      const toast = screen.getByTestId('toast-root');
      expect(toast).toHaveClass('custom-toast');
    });

    it('should have proper styling classes', () => {
      render(<Toast>Content</Toast>);
      const toast = screen.getByTestId('toast-root');
      expect(toast).toHaveClass(
        'group',
        'pointer-events-auto',
        'relative',
        'flex',
        'w-full',
        'items-center',
        'justify-between',
        'space-x-4',
        'overflow-hidden',
        'rounded-md',
        'border',
        'p-6',
        'pr-8',
        'shadow-lg'
      );
    });
  });

  describe('ToastTitle', () => {
    it('should render toast title', () => {
      render(<ToastTitle>Success!</ToastTitle>);
      expect(screen.getByTestId('toast-title')).toBeInTheDocument();
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<ToastTitle className="custom-title">Title</ToastTitle>);
      const title = screen.getByTestId('toast-title');
      expect(title).toHaveClass('custom-title');
    });

    it('should have proper styling classes', () => {
      render(<ToastTitle>Title</ToastTitle>);
      const title = screen.getByTestId('toast-title');
      expect(title).toHaveClass('text-sm', 'font-semibold');
    });
  });

  describe('ToastDescription', () => {
    it('should render toast description', () => {
      render(<ToastDescription>This is a toast message</ToastDescription>);
      expect(screen.getByTestId('toast-description')).toBeInTheDocument();
      expect(screen.getByText('This is a toast message')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <ToastDescription className="custom-desc">Description</ToastDescription>
      );
      const desc = screen.getByTestId('toast-description');
      expect(desc).toHaveClass('custom-desc');
    });

    it('should have proper styling classes', () => {
      render(<ToastDescription>Description</ToastDescription>);
      const desc = screen.getByTestId('toast-description');
      expect(desc).toHaveClass('text-sm', 'opacity-90');
    });
  });

  describe('ToastAction', () => {
    it('should render toast action button', () => {
      render(<ToastAction altText="Retry action">Retry</ToastAction>);
      expect(screen.getByTestId('toast-action')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Retry action' })
      ).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    it('should handle click events', async () => {
      const handleClick = jest.fn();
      render(
        <ToastAction altText="Click me" onClick={handleClick}>
          Click
        </ToastAction>
      );

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should apply custom className', () => {
      render(
        <ToastAction className="custom-action" altText="Action">
          Action
        </ToastAction>
      );
      const action = screen.getByTestId('toast-action');
      expect(action).toHaveClass('custom-action');
    });

    it('should have proper styling classes', () => {
      render(<ToastAction altText="Action">Action</ToastAction>);
      const action = screen.getByTestId('toast-action');
      expect(action).toHaveClass(
        'inline-flex',
        'h-8',
        'shrink-0',
        'items-center',
        'justify-center',
        'rounded-md',
        'border',
        'bg-transparent',
        'px-3',
        'text-sm',
        'font-medium'
      );
    });
  });

  describe('ToastClose', () => {
    it('should render toast close button', () => {
      render(<ToastClose />);
      expect(screen.getByTestId('toast-close')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should handle click events', async () => {
      const handleClick = jest.fn();
      render(<ToastClose onClick={handleClick} />);

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should apply custom className', () => {
      render(<ToastClose className="custom-close" />);
      const close = screen.getByTestId('toast-close');
      expect(close).toHaveClass('custom-close');
    });

    it('should have proper styling classes', () => {
      render(<ToastClose />);
      const close = screen.getByTestId('toast-close');
      expect(close).toHaveClass(
        'absolute',
        'right-2',
        'top-2',
        'rounded-md',
        'p-1',
        'text-foreground/50'
      );
    });
  });

  describe('Complete Toast Structure', () => {
    it('should render complete toast with all components', () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Operation Successful</ToastTitle>
            <ToastDescription>
              Your action was completed successfully.
            </ToastDescription>
            <ToastAction altText="Undo action">Undo</ToastAction>
            <ToastClose />
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );

      expect(screen.getByTestId('toast-provider')).toBeInTheDocument();
      expect(screen.getByTestId('toast-root')).toBeInTheDocument();
      expect(screen.getByText('Operation Successful')).toBeInTheDocument();
      expect(
        screen.getByText('Your action was completed successfully.')
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Undo action' })
      ).toBeInTheDocument();
      expect(screen.getByTestId('toast-close')).toBeInTheDocument();
      expect(screen.getByTestId('toast-viewport')).toBeInTheDocument();
    });
  });
});
