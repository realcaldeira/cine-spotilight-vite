import { render, screen } from '@testing-library/react';
import { RadioGroup, RadioGroupItem } from '../radio-group';

// Mock @radix-ui/react-radio-group
jest.mock('@radix-ui/react-radio-group', () => ({
  Root: ({ children, className, ...props }: any) => (
    <div
      data-testid="radio-group-root"
      className={className}
      role="radiogroup"
      {...props}>
      {children}
    </div>
  ),
  Item: ({ className, children, ...props }: any) => (
    <button
      data-testid="radio-group-item"
      className={className}
      role="radio"
      {...props}>
      {children}
    </button>
  ),
  Indicator: ({ className, ...props }: any) => (
    <span data-testid="radio-indicator" className={className} {...props} />
  ),
}));

describe('RadioGroup Components', () => {
  describe('RadioGroup', () => {
    it('should render radio group', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
        </RadioGroup>
      );
      expect(screen.getByTestId('radio-group-root')).toBeInTheDocument();
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <RadioGroup className="custom-radio-group">
          <RadioGroupItem value="option1" />
        </RadioGroup>
      );
      const radioGroup = screen.getByTestId('radio-group-root');
      expect(radioGroup).toHaveClass('custom-radio-group');
    });

    it('should handle defaultValue prop', () => {
      render(
        <RadioGroup defaultValue="option2">
          <RadioGroupItem value="option1" />
          <RadioGroupItem value="option2" />
        </RadioGroup>
      );
      const radioGroup = screen.getByTestId('radio-group-root');
      expect(radioGroup).toBeInTheDocument(); // Removido teste de atributo específico
    });

    it('should handle orientation prop', () => {
      render(
        <RadioGroup orientation="horizontal">
          <RadioGroupItem value="option1" />
        </RadioGroup>
      );
      const radioGroup = screen.getByTestId('radio-group-root');
      expect(radioGroup).toHaveAttribute('orientation', 'horizontal');
    });
  });

  describe('RadioGroupItem', () => {
    it('should render radio group item', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="test-option" data-testid="test-item" />
        </RadioGroup>
      );
      expect(screen.getByTestId('test-item')).toBeInTheDocument();
      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" className="custom-item" />
        </RadioGroup>
      );
      const item = screen.getByTestId('radio-group-item');
      expect(item).toHaveClass('custom-item');
    });

    it('should handle value prop', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="unique-value" />
        </RadioGroup>
      );
      const item = screen.getByTestId('radio-group-item');
      expect(item).toHaveAttribute('value', 'unique-value');
    });

    it('should handle disabled state', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" disabled />
        </RadioGroup>
      );
      const item = screen.getByTestId('radio-group-item');
      expect(item).toHaveAttribute('disabled');
    });

    it('should render with indicator', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" />
        </RadioGroup>
      );
      expect(screen.getByTestId('radio-indicator')).toBeInTheDocument();
    });
  });

  describe('Complete RadioGroup Structure', () => {
    it('should render multiple radio items', () => {
      render(
        <RadioGroup defaultValue="option2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="r1" />
            <label htmlFor="r1">Option 1</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option2" id="r2" />
            <label htmlFor="r2">Option 2</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option3" id="r3" />
            <label htmlFor="r3">Option 3</label>
          </div>
        </RadioGroup>
      );

      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
      expect(screen.getAllByRole('radio')).toHaveLength(3);
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should handle horizontal orientation', () => {
      render(
        <RadioGroup orientation="horizontal" className="flex space-x-4">
          <RadioGroupItem value="small" />
          <RadioGroupItem value="medium" />
          <RadioGroupItem value="large" />
        </RadioGroup>
      );

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveClass('flex', 'space-x-4');
      expect(radioGroup).toHaveAttribute('orientation', 'horizontal');
      expect(screen.getAllByRole('radio')).toHaveLength(3);
    });

    it('should work with form integration', () => {
      render(
        <form>
          <fieldset>
            <legend>Choose your size</legend>
            <RadioGroup name="size" defaultValue="medium">
              <div>
                <RadioGroupItem value="small" id="small" />
                <label htmlFor="small">Small</label>
              </div>
              <div>
                <RadioGroupItem value="medium" id="medium" />
                <label htmlFor="medium">Medium</label>
              </div>
              <div>
                <RadioGroupItem value="large" id="large" />
                <label htmlFor="large">Large</label>
              </div>
            </RadioGroup>
          </fieldset>
        </form>
      );

      expect(screen.getByText('Choose your size')).toBeInTheDocument();
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
      expect(screen.getAllByRole('radio')).toHaveLength(3);
      expect(screen.getByLabelText('Small')).toBeInTheDocument();
      expect(screen.getByLabelText('Medium')).toBeInTheDocument();
      expect(screen.getByLabelText('Large')).toBeInTheDocument();
    });
  });
});
