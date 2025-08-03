import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';

describe('Select', () => {
  it('should render select trigger with placeholder', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
      </Select>
    );

    expect(screen.getByText('Select option')).toBeInTheDocument();
  });

  it('should render select with options', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText('Choose option')).toBeInTheDocument();
  });

  it('should render select trigger with proper styling', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue />
        </SelectTrigger>
      </Select>
    );

    const trigger = screen.getByTestId('select-trigger');
    expect(trigger).toHaveClass('flex');
    expect(trigger).toHaveClass('h-10');
    expect(trigger).toHaveClass('w-full');
    expect(trigger).toHaveClass('items-center');
    expect(trigger).toHaveClass('justify-between');
    expect(trigger).toHaveClass('rounded-md');
    expect(trigger).toHaveClass('border');
  });

  it('should apply custom className to trigger', () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger">
          <SelectValue />
        </SelectTrigger>
      </Select>
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('custom-trigger');
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Disabled select" />
        </SelectTrigger>
      </Select>
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDisabled();
  });

  it('should render with default value', () => {
    render(
      <Select defaultValue="option1">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">First Option</SelectItem>
          <SelectItem value="option2">Second Option</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText('First Option')).toBeInTheDocument();
  });

  it('should render select content with proper styling', () => {
    render(
      <Select defaultOpen>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent data-testid="select-content">
          <SelectItem value="test">Test Item</SelectItem>
        </SelectContent>
      </Select>
    );

    const content = screen.getByTestId('select-content');
    expect(content).toHaveClass('relative');
    expect(content).toHaveClass('z-50');
    expect(content).toHaveClass('max-h-96');
    expect(content).toHaveClass('min-w-[8rem]');
    expect(content).toHaveClass('overflow-hidden');
    expect(content).toHaveClass('rounded-md');
    expect(content).toHaveClass('border');
  });

  it('should render select items with proper structure', () => {
    render(
      <Select defaultOpen>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="item1" data-testid="select-item">
            Item 1
          </SelectItem>
        </SelectContent>
      </Select>
    );

    const item = screen.getByTestId('select-item');
    expect(item).toHaveClass('relative');
    expect(item).toHaveClass('flex');
    expect(item).toHaveClass('w-full');
    expect(item).toHaveClass('cursor-default');
    expect(item).toHaveClass('select-none');
    expect(item).toHaveClass('items-center');
  });
});
