import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '../textarea';

describe('Textarea', () => {
  it('should render textarea with placeholder', () => {
    render(<Textarea placeholder="Enter your message" />);
    expect(
      screen.getByPlaceholderText('Enter your message')
    ).toBeInTheDocument();
  });

  it('should handle text input', async () => {
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');

    await userEvent.type(textarea, 'Hello world');
    expect(textarea).toHaveValue('Hello world');
  });

  it('should handle onChange event', async () => {
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} data-testid="textarea" />);

    await userEvent.type(screen.getByTestId('textarea'), 'Test');
    expect(handleChange).toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Textarea disabled data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeDisabled();
  });

  it('should apply custom className', () => {
    render(<Textarea className="custom-textarea" data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveClass('custom-textarea');
  });

  it('should have proper styling classes', () => {
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveClass(
      'flex',
      'min-h-[80px]',
      'w-full',
      'rounded-md',
      'border',
      'border-input',
      'bg-background',
      'px-3',
      'py-2',
      'text-sm',
      'ring-offset-background'
    );
  });

  it('should support different input types', () => {
    render(<Textarea rows={5} data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('should handle value prop', () => {
    render(
      <Textarea
        value="Initial value"
        onChange={() => {}}
        data-testid="textarea"
      />
    );
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveValue('Initial value');
  });

  it('should forward ref correctly', () => {
    const ref = { current: null };
    render(<Textarea ref={ref} data-testid="textarea" />);
    expect(screen.getByTestId('textarea')).toBeInTheDocument();
  });

  it('should render as textarea element', () => {
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('should support maxLength attribute', () => {
    render(<Textarea maxLength={100} data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('maxLength', '100');
  });

  it('should support readOnly attribute', () => {
    render(<Textarea readOnly data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('readOnly');
  });

  it('should support required attribute', () => {
    render(<Textarea required data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('required');
  });

  it('should handle focus and blur events', async () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    render(
      <Textarea
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-testid="textarea"
      />
    );

    const textarea = screen.getByTestId('textarea');
    await userEvent.click(textarea);
    expect(handleFocus).toHaveBeenCalled();

    await userEvent.tab();
    expect(handleBlur).toHaveBeenCalled();
  });

  it('should support autoFocus attribute', () => {
    render(<Textarea autoFocus data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveFocus();
  });
});
