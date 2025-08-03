import { render, screen } from '@testing-library/react';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from '../form';
import { useForm } from 'react-hook-form';

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  FormProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-provider">{children}</div>
  ),
  useFormContext: () => ({
    control: {},
    formState: { errors: {} },
    getFieldState: () => ({ error: null }),
  }),
  Controller: ({ render, name }: any) =>
    render({
      field: { name, value: '', onChange: jest.fn(), onBlur: jest.fn() },
      fieldState: { error: null },
    }),
}));

// Test wrapper component
const TestForm = ({ children }: { children: React.ReactNode }) => {
  const form = useForm();
  return <Form {...form}>{children}</Form>;
};

describe('Form Components', () => {
  describe('Form', () => {
    it('should render form provider', () => {
      render(
        <TestForm>
          <div>Form content</div>
        </TestForm>
      );
      expect(screen.getByTestId('form-provider')).toBeInTheDocument();
      expect(screen.getByText('Form content')).toBeInTheDocument();
    });
  });

  describe('FormItem', () => {
    it('should render form item', () => {
      render(
        <FormItem data-testid="form-item">
          <div>Item content</div>
        </FormItem>
      );
      expect(screen.getByTestId('form-item')).toBeInTheDocument();
      expect(screen.getByText('Item content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <FormItem className="custom-item" data-testid="form-item">
          Content
        </FormItem>
      );
      const item = screen.getByTestId('form-item');
      expect(item).toHaveClass('custom-item');
    });
  });

  describe('FormLabel', () => {
    it('should render form label', () => {
      render(<FormLabel data-testid="form-label">Label Text</FormLabel>);
      expect(screen.getByTestId('form-label')).toBeInTheDocument();
      expect(screen.getByText('Label Text')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <FormLabel className="custom-label" data-testid="form-label">
          Label
        </FormLabel>
      );
      const label = screen.getByTestId('form-label');
      expect(label).toHaveClass('custom-label');
    });
  });

  describe('FormControl', () => {
    it('should render form control', () => {
      render(
        <FormControl data-testid="form-control">
          <input type="text" />
        </FormControl>
      );
      expect(screen.getByTestId('form-control')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <FormControl className="custom-control" data-testid="form-control">
          <input type="text" />
        </FormControl>
      );
      const control = screen.getByTestId('form-control');
      expect(control).toHaveClass('custom-control');
    });
  });

  describe('FormDescription', () => {
    it('should render form description', () => {
      render(
        <FormDescription data-testid="form-description">
          Description text
        </FormDescription>
      );
      expect(screen.getByTestId('form-description')).toBeInTheDocument();
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <FormDescription
          className="custom-description"
          data-testid="form-description">
          Description
        </FormDescription>
      );
      const description = screen.getByTestId('form-description');
      expect(description).toHaveClass('custom-description');
    });
  });

  describe('FormMessage', () => {
    it('should render form message', () => {
      render(
        <FormMessage data-testid="form-message">Error message</FormMessage>
      );
      expect(screen.getByTestId('form-message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <FormMessage className="custom-message" data-testid="form-message">
          Message
        </FormMessage>
      );
      const message = screen.getByTestId('form-message');
      expect(message).toHaveClass('custom-message');
    });
  });

  describe('FormField', () => {
    it('should render form field with control', () => {
      render(
        <TestForm>
          <FormField
            name="test"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Field</FormLabel>
                <FormControl>
                  <input {...field} data-testid="test-input" />
                </FormControl>
              </FormItem>
            )}
          />
        </TestForm>
      );
      expect(screen.getByText('Test Field')).toBeInTheDocument();
      expect(screen.getByTestId('test-input')).toBeInTheDocument();
    });
  });

  describe('Complete Form Structure', () => {
    it('should render complete form with all components', () => {
      render(
        <TestForm>
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    data-testid="email-input"
                  />
                </FormControl>
                <FormDescription>
                  We'll never share your email with anyone else.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </TestForm>
      );

      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Enter your email')
      ).toBeInTheDocument();
      expect(
        screen.getByText("We'll never share your email with anyone else.")
      ).toBeInTheDocument();
    });

    it('should handle multiple form fields', () => {
      render(
        <TestForm>
          <FormField
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <input {...field} data-testid="username-input" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="password"
                    data-testid="password-input"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </TestForm>
      );

      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
      expect(screen.getByTestId('username-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
    });
  });
});
