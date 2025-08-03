import React from 'react';
import { render, screen } from '@testing-library/react';
import { Label } from '../label';

describe('Label', () => {
  it('should render label with text', () => {
    render(<Label>Test Label</Label>);

    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Label className="custom-label">Custom Label</Label>);

    const label = screen.getByText('Custom Label');
    expect(label).toHaveClass('custom-label');
  });

  it('should have proper styling classes', () => {
    render(<Label data-testid="label">Styled Label</Label>);

    const label = screen.getByTestId('label');
    expect(label).toHaveClass('text-sm');
    expect(label).toHaveClass('font-medium');
  });

  it('should associate with form input using htmlFor', () => {
    render(
      <div>
        <Label htmlFor="test-input">Input Label</Label>
        <input id="test-input" type="text" />
      </div>
    );

    const label = screen.getByText('Input Label');
    const input = screen.getByRole('textbox');

    expect(label).toHaveAttribute('for', 'test-input');
    expect(input).toHaveAttribute('id', 'test-input');
  });
});
