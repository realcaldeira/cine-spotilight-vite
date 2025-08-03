import React from 'react';
import { render, screen } from '@testing-library/react';
import { Separator } from '../separator';

describe('Separator', () => {
  it('should render separator with default orientation', () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('shrink-0');
    expect(separator).toHaveClass('bg-border');
    expect(separator).toHaveClass('h-[1px]');
    expect(separator).toHaveClass('w-full');
  });

  it('should render separator with vertical orientation', () => {
    render(<Separator orientation="vertical" data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('h-full');
    expect(separator).toHaveClass('w-[1px]');
  });

  it('should apply custom className', () => {
    render(<Separator className="custom-separator" data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('custom-separator');
  });

  it('should render as div by default', () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator.tagName).toBe('DIV');
  });

  it('should be decorative by default', () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
  });
});
