import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input', () => {
  it('should render input with placeholder', () => {
    render(<Input placeholder="Enter text here" />);

    const input = screen.getByPlaceholderText('Enter text here');
    expect(input).toBeInTheDocument();
  });

  it('should handle text input', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);

    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'Hello World');

    expect(input).toHaveValue('Hello World');
  });

  it('should handle onChange event', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    expect(handleChange).toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />);

    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
  });

  it('should apply custom className', () => {
    render(<Input className="custom-input" placeholder="Custom" />);

    const input = screen.getByPlaceholderText('Custom');
    expect(input).toHaveClass('custom-input');
  });

  it('should have proper styling classes', () => {
    render(<Input placeholder="Styled input" />);

    const input = screen.getByPlaceholderText('Styled input');
    expect(input).toHaveClass('flex');
    expect(input).toHaveClass('h-10');
    expect(input).toHaveClass('w-full');
    expect(input).toHaveClass('rounded-md');
    expect(input).toHaveClass('border');
    expect(input).toHaveClass('border-input');
    expect(input).toHaveClass('bg-background');
    expect(input).toHaveClass('px-3');
    expect(input).toHaveClass('py-2');
  });

  it('should support different input types', () => {
    render(<Input type="email" placeholder="Email" />);

    const input = screen.getByPlaceholderText('Email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should handle value prop', () => {
    render(<Input value="controlled value" readOnly />);

    const input = screen.getByDisplayValue('controlled value');
    expect(input).toBeInTheDocument();
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Ref test" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
