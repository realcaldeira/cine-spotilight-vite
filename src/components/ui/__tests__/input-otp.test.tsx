import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '../input-otp';

// Mock slots data (must be defined before jest.mock)
const mockSlots = [
  { char: '1', hasFakeCaret: false, isActive: false },
  { char: '2', hasFakeCaret: false, isActive: true },
  { char: '', hasFakeCaret: true, isActive: false },
  { char: '', hasFakeCaret: false, isActive: false },
];

const mockOTPInputContext = {
  slots: mockSlots,
  isFocused: true,
  inputRef: { current: null },
};

// Mock input-otp library completely
jest.mock('input-otp', () => ({
  OTPInput: React.forwardRef(
    (props: Record<string, unknown>, ref: React.Ref<HTMLDivElement>) => {
      const { className, containerClassName, children, maxLength, ...rest } =
        props;
      return React.createElement(
        'div',
        {
          ref,
          'data-testid': 'otp-input',
          className: containerClassName as string,
          'data-input-classname': className as string,
          'data-max-length': maxLength as number,
          ...rest,
        },
        children as React.ReactNode
      );
    }
  ),
  OTPInputContext: React.createContext({
    slots: [
      { char: '1', hasFakeCaret: false, isActive: false },
      { char: '2', hasFakeCaret: false, isActive: true },
      { char: '', hasFakeCaret: true, isActive: false },
      { char: '', hasFakeCaret: false, isActive: false },
      { char: '', hasFakeCaret: false, isActive: false },
      { char: '', hasFakeCaret: false, isActive: false },
    ],
    isFocused: true,
    inputRef: { current: null },
  }),
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Dot: ({ className }: { className?: string }) => (
    <div data-testid="dot-icon" className={className}>
      •
    </div>
  ),
}));

describe('InputOTP Components', () => {
  describe('InputOTP', () => {
    it('renders OTP input with default props', () => {
      render(
        <InputOTP maxLength={4}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
        </InputOTP>
      );

      const otpInput = screen.getByTestId('otp-input');
      expect(otpInput).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <InputOTP className="custom-input" maxLength={4}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
          </InputOTPGroup>
        </InputOTP>
      );

      const otpInput = screen.getByTestId('otp-input');
      expect(otpInput).toHaveAttribute(
        'data-input-classname',
        expect.stringContaining('custom-input')
      );
    });

    it('applies custom containerClassName', () => {
      render(
        <InputOTP containerClassName="custom-container" maxLength={4}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
          </InputOTPGroup>
        </InputOTP>
      );

      const otpInput = screen.getByTestId('otp-input');
      expect(otpInput).toHaveClass('custom-container');
    });

    it('passes through additional props', () => {
      const handleChange = jest.fn();
      render(
        <InputOTP maxLength={6} onChange={handleChange}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
          </InputOTPGroup>
        </InputOTP>
      );

      const otpInput = screen.getByTestId('otp-input');
      expect(otpInput).toHaveAttribute('data-max-length', '6');
    });
  });

  describe('InputOTPGroup', () => {
    it('renders group container', () => {
      const { container } = render(
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
      );

      const groupDiv = container.querySelector('.flex.items-center');
      expect(groupDiv).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <InputOTPGroup className="custom-group">
          <InputOTPSlot index={0} />
        </InputOTPGroup>
      );

      const groupDiv = container.querySelector('.custom-group');
      expect(groupDiv).toBeInTheDocument();
      expect(groupDiv).toHaveClass('custom-group');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <InputOTPGroup ref={ref}>
          <InputOTPSlot index={0} />
        </InputOTPGroup>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('InputOTPSlot', () => {
    it('renders slot with character from context', () => {
      render(<InputOTPSlot index={0} />);

      const slot = screen.getByText('1');
      expect(slot).toBeInTheDocument();
    });

    it('renders active slot with ring styles', () => {
      render(<InputOTPSlot index={1} />);

      const slot = screen.getByText('2');
      expect(slot).toHaveClass(
        'z-10',
        'ring-2',
        'ring-ring',
        'ring-offset-background'
      );
    });

    it('renders fake caret for empty active slot', () => {
      const { container } = render(<InputOTPSlot index={2} />);

      const caretElement = container.querySelector('.animate-caret-blink');
      expect(caretElement).toBeInTheDocument();
      expect(caretElement).toHaveClass('h-4', 'w-px', 'bg-foreground');
    });

    it('renders empty slot without caret when not active', () => {
      const { container } = render(<InputOTPSlot index={3} />);

      const caretElements = container.querySelectorAll('.animate-caret-blink');
      expect(caretElements).toHaveLength(0);
    });

    it('applies custom className', () => {
      render(<InputOTPSlot index={0} className="custom-slot" />);

      const slot = screen.getByText('1');
      expect(slot).toHaveClass('custom-slot');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<InputOTPSlot ref={ref} index={0} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('applies border and layout classes', () => {
      render(<InputOTPSlot index={0} />);

      const slot = screen.getByText('1');
      expect(slot).toHaveClass(
        'relative',
        'flex',
        'h-10',
        'w-10',
        'items-center',
        'justify-center',
        'border-y',
        'border-r',
        'border-input'
      );
    });
  });

  describe('InputOTPSeparator', () => {
    it('renders separator with dot icon', () => {
      render(<InputOTPSeparator />);

      const separator = screen.getByRole('separator');
      expect(separator).toBeInTheDocument();
      expect(screen.getByTestId('dot-icon')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<InputOTPSeparator ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('applies additional props', () => {
      render(<InputOTPSeparator data-testid="custom-separator" />);

      const separator = screen.getByTestId('custom-separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute('role', 'separator');
    });
  });

  describe('Complete OTP Input Structure', () => {
    it('renders complete OTP input with groups and separators', () => {
      const handleChange = jest.fn();

      const { container } = render(
        <InputOTP maxLength={6} onChange={handleChange}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      );

      // Check main container
      expect(screen.getByTestId('otp-input')).toBeInTheDocument();

      // Check groups exist
      const groupElements = container.querySelectorAll('.flex.items-center');
      expect(groupElements.length).toBeGreaterThanOrEqual(2);

      // Check separator
      expect(screen.getByRole('separator')).toBeInTheDocument();
      expect(screen.getByTestId('dot-icon')).toBeInTheDocument();

      // Check that at least some slots render (based on mock data)
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('renders with custom styling throughout', () => {
      const { container } = render(
        <InputOTP
          className="custom-otp"
          containerClassName="custom-container"
          maxLength={4}>
          <InputOTPGroup className="custom-group">
            <InputOTPSlot index={0} className="custom-slot" />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator data-testid="separator" />
          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      );

      const otpInput = screen.getByTestId('otp-input');
      expect(otpInput).toHaveClass('custom-container');
      expect(otpInput).toHaveAttribute(
        'data-input-classname',
        expect.stringContaining('custom-otp')
      );

      const customSlot = screen.getByText('1');
      expect(customSlot).toHaveClass('custom-slot');

      const customGroup = container.querySelector('.custom-group');
      expect(customGroup).toBeInTheDocument();
      expect(customGroup).toHaveClass('custom-group');

      expect(screen.getByTestId('separator')).toBeInTheDocument();
    });
  });

  describe('Context Integration', () => {
    it('uses OTP input context correctly', () => {
      const { container } = render(
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      );

      // Based on our mock context
      expect(screen.getByText('1')).toBeInTheDocument(); // index 0
      expect(screen.getByText('2')).toBeInTheDocument(); // index 1

      // Check active state (index 1 is active in mock)
      const activeSlot = screen.getByText('2');
      expect(activeSlot).toHaveClass('z-10', 'ring-2');

      // Check fake caret (index 2 has fake caret in mock)
      const caretElement = container.querySelector('.animate-caret-blink');
      expect(caretElement).toBeInTheDocument();
    });
  });
});
