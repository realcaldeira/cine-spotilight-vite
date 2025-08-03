
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import ErrorMessage from '@/components/ErrorMessage';

describe('ErrorMessage', () => {
  it('should render error message', () => {
    render(<ErrorMessage message="Test error message" />);

    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const mockRetry = jest.fn();
    render(<ErrorMessage message="Test error" onRetry={mockRetry} />);

    const retryButton = screen.getByRole('button', { name: /tentar novamente/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Test error" />);

    const retryButton = screen.queryByRole('button', { name: /tentar novamente/i });
    expect(retryButton).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const mockRetry = jest.fn();
    const user = userEvent.setup();
    
    render(<ErrorMessage message="Test error" onRetry={mockRetry} />);

    const retryButton = screen.getByRole('button', { name: /tentar novamente/i });
    await user.click(retryButton);

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ErrorMessage message="Test error" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should render alert icon', () => {
    render(<ErrorMessage message="Test error" />);

    // The AlertCircle icon should be present
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    const { container } = render(<ErrorMessage message="Test error" />);

    const alert = container.firstChild;
    expect(alert).toHaveClass('border-destructive/50', 'text-destructive');
  });
});