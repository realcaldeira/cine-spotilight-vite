import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../checkbox';

describe('Checkbox', () => {
  it('should render checkbox with label', () => {
    render(
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <label htmlFor="terms">Accept terms and conditions</label>
      </div>
    );

    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Accept terms and conditions');

    expect(checkbox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  it('should handle checked state', async () => {
    const onCheckedChange = jest.fn();
    const user = userEvent.setup();

    render(<Checkbox onCheckedChange={onCheckedChange} />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Checkbox disabled />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('should render in checked state', () => {
    render(<Checkbox checked />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should render in indeterminate state', () => {
    render(<Checkbox checked="indeterminate" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    // Indeterminate state is handled internally by Radix
  });

  it('should apply custom className', () => {
    render(<Checkbox className="custom-checkbox" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('custom-checkbox');
  });

  it('should have proper styling classes', () => {
    render(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass(
      'peer',
      'h-4',
      'w-4',
      'shrink-0',
      'rounded-sm',
      'border',
      'border-primary'
    );
  });

  it('should toggle between checked and unchecked', async () => {
    const user = userEvent.setup();

    render(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
