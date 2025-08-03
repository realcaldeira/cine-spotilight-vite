import { render, screen } from '@testing-library/react';
import { Toggle } from '../toggle';

describe('Toggle', () => {
  it('should render toggle component', () => {
    render(<Toggle data-testid="toggle">Toggle me</Toggle>);
    expect(screen.getByTestId('toggle')).toBeInTheDocument();
    expect(screen.getByText('Toggle me')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <Toggle className="custom-toggle" data-testid="toggle">
        Toggle
      </Toggle>
    );
    const toggle = screen.getByTestId('toggle');
    expect(toggle).toHaveClass('custom-toggle');
  });

  it('should handle pressed state', () => {
    render(
      <Toggle pressed data-testid="toggle">
        Pressed
      </Toggle>
    );
    const toggle = screen.getByTestId('toggle');
    expect(toggle).toHaveAttribute('data-state', 'on');
  });

  it('should handle unpressed state', () => {
    render(
      <Toggle pressed={false} data-testid="toggle">
        Unpressed
      </Toggle>
    );
    const toggle = screen.getByTestId('toggle');
    expect(toggle).toHaveAttribute('data-state', 'off');
  });

  it('should handle disabled state', () => {
    render(
      <Toggle disabled data-testid="toggle">
        Disabled
      </Toggle>
    );
    const toggle = screen.getByTestId('toggle');
    expect(toggle).toBeDisabled();
  });

  it('should pass through additional props', () => {
    render(
      <Toggle data-testid="toggle" aria-label="Custom toggle">
        Toggle
      </Toggle>
    );
    const toggle = screen.getByTestId('toggle');
    expect(toggle).toHaveAttribute('aria-label', 'Custom toggle');
  });

  it('should have default styling classes', () => {
    render(<Toggle data-testid="toggle">Toggle</Toggle>);
    const toggle = screen.getByTestId('toggle');
    expect(toggle).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-md'
    );
  });

  it('should apply size variants', () => {
    const { rerender } = render(
      <Toggle size="sm" data-testid="toggle">
        Small
      </Toggle>
    );
    let toggle = screen.getByTestId('toggle');
    expect(toggle).toHaveClass('h-9', 'px-2.5');

    rerender(
      <Toggle size="lg" data-testid="toggle">
        Large
      </Toggle>
    );
    toggle = screen.getByTestId('toggle');
    expect(toggle).toHaveClass('h-11', 'px-5');
  });

  it('should apply variant styles', () => {
    const { rerender } = render(
      <Toggle variant="default" data-testid="toggle">
        Default
      </Toggle>
    );
    let toggle = screen.getByTestId('toggle');
    expect(toggle).toHaveClass('bg-transparent');

    rerender(
      <Toggle variant="outline" data-testid="toggle">
        Outline
      </Toggle>
    );
    toggle = screen.getByTestId('toggle');
    expect(toggle).toHaveClass('border', 'border-input', 'bg-transparent');
  });
});
