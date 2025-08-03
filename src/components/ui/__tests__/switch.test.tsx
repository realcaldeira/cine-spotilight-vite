import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '../switch';

// Mock Radix UI Switch
jest.mock('@radix-ui/react-switch', () => ({
  Root: ({
    children,
    className,
    onCheckedChange,
    onClick,
    checked,
    defaultChecked,
    ...props
  }: any) => (
    <button
      data-testid="switch-root"
      className={className}
      role="switch"
      data-state={
        checked ? 'checked' : defaultChecked ? 'checked' : 'unchecked'
      }
      onClick={(e) => {
        onClick?.(e);
        onCheckedChange?.(true);
      }}
      {...props}>
      {children}
    </button>
  ),
  Thumb: ({ className, ...props }: any) => (
    <span data-testid="switch-thumb" className={className} {...props} />
  ),
}));

describe('Switch', () => {
  it('should render switch component', () => {
    render(<Switch />);
    expect(screen.getByTestId('switch-root')).toBeInTheDocument();
    expect(screen.getByTestId('switch-thumb')).toBeInTheDocument();
  });

  it('should render switch with role switch', () => {
    render(<Switch />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Switch className="custom-switch" />);
    const switchElement = screen.getByTestId('switch-root');
    expect(switchElement).toHaveClass('custom-switch');
  });

  it('should have proper styling classes on root', () => {
    render(<Switch />);
    const switchElement = screen.getByTestId('switch-root');
    expect(switchElement).toHaveClass(
      'peer',
      'inline-flex',
      'h-6',
      'w-11',
      'shrink-0',
      'cursor-pointer',
      'items-center',
      'rounded-full',
      'border-2',
      'border-transparent'
    );
  });

  it('should have proper styling classes on thumb', () => {
    render(<Switch />);
    const thumb = screen.getByTestId('switch-thumb');
    expect(thumb).toHaveClass(
      'pointer-events-none',
      'block',
      'h-5',
      'w-5',
      'rounded-full',
      'bg-background',
      'shadow-lg',
      'ring-0'
    );
  });

  it('should handle checked state', () => {
    render(<Switch checked />);
    const switchElement = screen.getByTestId('switch-root');
    expect(switchElement).toHaveAttribute('data-state', 'checked');
  });

  it('should handle disabled state', () => {
    render(<Switch disabled />);
    const switchElement = screen.getByTestId('switch-root');
    expect(switchElement).toHaveAttribute('disabled');
  });

  it('should handle click events', async () => {
    const handleClick = jest.fn();
    render(<Switch onClick={handleClick} />);

    await userEvent.click(screen.getByTestId('switch-root'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should handle onCheckedChange events', async () => {
    const handleCheckedChange = jest.fn();
    render(<Switch onCheckedChange={handleCheckedChange} />);

    await userEvent.click(screen.getByTestId('switch-root'));
    expect(handleCheckedChange).toHaveBeenCalled();
  });

  it('should forward ref correctly', () => {
    const ref = { current: null };
    render(<Switch ref={ref} />);
    expect(screen.getByTestId('switch-root')).toBeInTheDocument();
  });

  it('should support controlled state', () => {
    const { rerender } = render(<Switch checked={false} />);
    let switchElement = screen.getByTestId('switch-root');
    expect(switchElement).toHaveAttribute('data-state', 'unchecked');

    rerender(<Switch checked={true} />);
    switchElement = screen.getByTestId('switch-root');
    expect(switchElement).toHaveAttribute('data-state', 'checked');
  });

  it('should support defaultChecked prop', () => {
    render(<Switch defaultChecked />);
    const switchElement = screen.getByTestId('switch-root');
    expect(switchElement).toHaveAttribute('data-state', 'checked');
  });

  it('should support name attribute for forms', () => {
    render(<Switch name="notifications" />);
    const switchElement = screen.getByTestId('switch-root');
    expect(switchElement).toHaveAttribute('name', 'notifications');
  });

  it('should support value attribute for forms', () => {
    render(<Switch value="enabled" />);
    const switchElement = screen.getByTestId('switch-root');
    expect(switchElement).toHaveAttribute('value', 'enabled');
  });

  it('should support required attribute', () => {
    render(<Switch required />);
    const switchElement = screen.getByTestId('switch-root');
    expect(switchElement).toHaveAttribute('required');
  });

  it('should support id attribute', () => {
    render(<Switch id="toggle-switch" />);
    const switchElement = screen.getByTestId('switch-root');
    expect(switchElement).toHaveAttribute('id', 'toggle-switch');
  });

  it('should support aria-label for accessibility', () => {
    render(<Switch aria-label="Toggle notifications" />);
    const switchElement = screen.getByTestId('switch-root');
    expect(switchElement).toHaveAttribute('aria-label', 'Toggle notifications');
  });
});
