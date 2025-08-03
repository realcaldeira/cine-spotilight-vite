import { render, screen } from '@testing-library/react';
import { Input } from '../input';
import userEvent, { UserEvent } from '@testing-library/user-event';

describe('Input', () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should render input element', () => {
    render(<Input data-testid="input" />);
    expect(screen.getByTestId('input')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Input className="custom-input" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('custom-input');
  });

  it('should have proper styling classes', () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveClass(
      'flex',
      'h-10',
      'w-full',
      'rounded-md',
      'border',
      'border-input',
      'bg-background',
      'px-3',
      'py-2'
    );
  });

  it('should handle text input', async () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId('input') as HTMLInputElement;

    await user.type(input, 'Hello World');
    expect(input.value).toBe('Hello World');
  });

  it('should handle placeholder', () => {
    render(<Input placeholder="Enter text" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
  });

  it('should handle disabled state', () => {
    render(<Input disabled data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toBeDisabled();
  });

  it('should handle value prop', () => {
    render(<Input value="Test Value" data-testid="input" readOnly />);
    const input = screen.getByTestId('input') as HTMLInputElement;
    expect(input.value).toBe('Test Value');
  });

  it('should handle onChange event', async () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} data-testid="input" />);
    const input = screen.getByTestId('input');

    await user.type(input, 'a');
    expect(handleChange).toHaveBeenCalled();
  });

  it('should support different input types', () => {
    render(<Input type="password" data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should forward ref correctly', () => {
    const ref = { current: null };
    render(<Input ref={ref} data-testid="input" />);
    expect(ref.current).toBeTruthy();
  });

  it('should render as input element', () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input.tagName).toBe('INPUT');
  });

  it('should support autoFocus attribute', () => {
    render(<Input autoFocus data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveFocus();
  });

  it('should support maxLength attribute', () => {
    render(<Input maxLength={10} data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('maxLength', '10');
  });

  it('should support readOnly attribute', () => {
    render(<Input readOnly data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('readOnly');
  });

  it('should support required attribute', () => {
    render(<Input required data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('required');
  });

  it('should handle focus and blur events', async () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();

    render(
      <Input onFocus={handleFocus} onBlur={handleBlur} data-testid="input" />
    );

    const input = screen.getByTestId('input');

    await user.click(input);
    expect(handleFocus).toHaveBeenCalled();

    await user.tab();
    expect(handleBlur).toHaveBeenCalled();
  });
});
