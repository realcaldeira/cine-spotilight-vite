import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '@/pages/NotFound';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('NotFound', () => {
  it('should render 404 message', () => {
    render(<NotFound />, { wrapper: TestWrapper });

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Oops! Page not found')).toBeInTheDocument();
  });

  it('should render description text', () => {
    render(<NotFound />, { wrapper: TestWrapper });

    expect(screen.getByText('Oops! Page not found')).toBeInTheDocument();
  });

  it('should render back to home button', () => {
    render(<NotFound />, { wrapper: TestWrapper });

    const homeButton = screen.getByText('Return to Home');
    expect(homeButton).toBeInTheDocument();
    expect(homeButton.closest('a')).toHaveAttribute('href', '/');
  });

  it('should have correct styling structure', () => {
    const { container } = render(<NotFound />, { wrapper: TestWrapper });

    // Should have centered layout
    expect(container.querySelector('.min-h-screen')).toBeInTheDocument();
    expect(
      container.querySelector('.flex.items-center.justify-center')
    ).toBeInTheDocument();
  });

  it('should log 404 error to console', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<NotFound />, { wrapper: TestWrapper });

    expect(consoleSpy).toHaveBeenCalledWith(
      '404 Error: User attempted to access non-existent route:',
      '/'
    );

    consoleSpy.mockRestore();
  });
});
