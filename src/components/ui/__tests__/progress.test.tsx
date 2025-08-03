import { render, screen } from '@testing-library/react';
import { Progress } from '../progress';

describe('Progress', () => {
  it('should render progress component', () => {
    render(<Progress value={50} data-testid="progress" />);
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('should display correct progress value', () => {
    render(<Progress value={75} data-testid="progress" />);
    const progress = screen.getByTestId('progress');
    const indicator =
      progress.querySelector('[data-state="complete"]') ||
      progress.querySelector('div');
    expect(indicator).toHaveStyle('transform: translateX(-25%)'); // 100% - 75% = 25%
  });

  it('should handle zero value', () => {
    render(<Progress value={0} data-testid="progress" />);
    const progress = screen.getByTestId('progress');
    const indicator =
      progress.querySelector('[data-state="complete"]') ||
      progress.querySelector('div');
    expect(indicator).toHaveStyle('transform: translateX(-100%)');
  });

  it('should handle maximum value', () => {
    render(<Progress value={100} data-testid="progress" />);
    const progress = screen.getByTestId('progress');
    const indicator =
      progress.querySelector('[data-state="complete"]') ||
      progress.querySelector('div');
    expect(indicator).toHaveStyle('transform: translateX(-0%)');
  });

  it('should apply custom className', () => {
    render(
      <Progress value={50} className="custom-progress" data-testid="progress" />
    );
    const progress = screen.getByTestId('progress');
    expect(progress).toHaveClass('custom-progress');
  });

  it('should handle values beyond range gracefully', () => {
    render(<Progress value={150} data-testid="progress" />);
    const progress = screen.getByTestId('progress');
    expect(progress).toBeInTheDocument();
  });

  it('should handle negative values gracefully', () => {
    render(<Progress value={-10} data-testid="progress" />);
    const progress = screen.getByTestId('progress');
    expect(progress).toBeInTheDocument();
  });

  it('should render without value prop', () => {
    render(<Progress data-testid="progress" />);
    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(<Progress value={60} data-testid="progress" />);
    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('role', 'progressbar');
  });

  it('should pass through additional props', () => {
    render(
      <Progress
        value={30}
        data-testid="progress"
        aria-label="Loading progress"
      />
    );
    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('aria-label', 'Loading progress');
  });

  it('should have default styling classes', () => {
    render(<Progress value={40} data-testid="progress" />);
    const progress = screen.getByTestId('progress');
    expect(progress).toHaveClass(
      'relative',
      'w-full',
      'overflow-hidden',
      'rounded-full',
      'bg-secondary'
    );
  });

  it('should render indicator with proper styling', () => {
    render(<Progress value={80} data-testid="progress" />);
    const progress = screen.getByTestId('progress');
    const indicator =
      progress.querySelector('div div') || progress.querySelector('div');
    expect(indicator).toHaveClass(
      'h-full',
      'w-full',
      'flex-1',
      'bg-primary',
      'transition-all'
    );
  });
});
