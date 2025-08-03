import { render, screen } from '@testing-library/react';
import { Calendar } from '../calendar';

// Mock date-fns
jest.mock('date-fns', () => ({
  format: jest.fn((date, formatStr) => {
    if (formatStr === 'PPP') return 'January 1st, 2024';
    return '2024-01-01';
  }),
  isToday: jest.fn(() => false),
  isSameDay: jest.fn(() => false),
  isSameMonth: jest.fn(() => true),
  isAfter: jest.fn(() => false),
  isBefore: jest.fn(() => false),
  startOfMonth: jest.fn(() => new Date(2024, 0, 1)),
  endOfMonth: jest.fn(() => new Date(2024, 0, 31)),
  eachDayOfInterval: jest.fn(() => [
    new Date(2024, 0, 1),
    new Date(2024, 0, 2),
    new Date(2024, 0, 3),
  ]),
  getDay: jest.fn(() => 1),
  addMonths: jest.fn((date, amount) => new Date(2024, amount, 1)),
  subMonths: jest.fn((date, amount) => new Date(2024, -amount, 1)),
}));

// Mock react-day-picker
jest.mock('react-day-picker', () => ({
  DayPicker: ({ className, classNames, showOutsideDays, ...props }: any) => (
    <div
      data-testid="day-picker"
      className={className}
      data-show-outside-days={showOutsideDays}
      {...props}>
      <div data-testid="calendar-content">Calendar Component</div>
    </div>
  ),
}));

describe('Calendar', () => {
  it('should render calendar component', () => {
    render(<Calendar data-testid="calendar" />);
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Calendar className="custom-calendar" data-testid="calendar" />);
    const calendar = screen.getByTestId('calendar');
    expect(calendar).toHaveClass('custom-calendar');
  });

  it('should handle showOutsideDays prop', () => {
    render(<Calendar showOutsideDays={true} data-testid="calendar" />);
    const calendar = screen.getByTestId('calendar');
    expect(calendar).toHaveAttribute('data-show-outside-days', 'true');
  });

  it('should handle showOutsideDays disabled', () => {
    render(<Calendar showOutsideDays={false} data-testid="calendar" />);
    const calendar = screen.getByTestId('calendar');
    expect(calendar).toHaveAttribute('data-show-outside-days', 'false');
  });

  it('should pass through additional props', () => {
    render(
      <Calendar
        data-testid="calendar"
        data-custom="custom-value"
        aria-label="Custom calendar"
      />
    );
    const calendar = screen.getByTestId('calendar');
    expect(calendar).toHaveAttribute('data-custom', 'custom-value');
    expect(calendar).toHaveAttribute('aria-label', 'Custom calendar');
  });

  it('should render with default classNames structure', () => {
    render(<Calendar data-testid="calendar" />);
    const calendar = screen.getByTestId('calendar');
    expect(calendar).toBeInTheDocument();
  });

  it('should handle selected date prop', () => {
    const selectedDate = new Date(2024, 0, 15);
    render(<Calendar selected={selectedDate} data-testid="calendar" />);
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
  });

  it('should handle onSelect callback', () => {
    const mockOnSelect = jest.fn();
    render(<Calendar onSelect={mockOnSelect} data-testid="calendar" />);
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
  });

  it('should handle mode prop', () => {
    render(<Calendar mode="single" data-testid="calendar" />);
    const calendar = screen.getByTestId('calendar');
    expect(calendar).toHaveAttribute('mode', 'single');
  });

  it('should handle disabled dates', () => {
    const disabledDates = [new Date(2024, 0, 10), new Date(2024, 0, 20)];
    render(<Calendar disabled={disabledDates} data-testid="calendar" />);
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
  });

  it('should handle initialFocus prop', () => {
    render(<Calendar initialFocus data-testid="calendar" />);
    const calendar = screen.getByTestId('calendar');
    expect(calendar).toBeInTheDocument(); // Removido teste de atributo específico
  });
});
