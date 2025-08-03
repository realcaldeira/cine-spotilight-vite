import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '../command';

describe('Command Components', () => {
  describe('Command', () => {
    test('renders basic command component', () => {
      render(
        <Command data-testid="command">
          <div>Command content</div>
        </Command>
      );
      expect(screen.getByTestId('command')).toBeInTheDocument();
    });

    test('applies custom className', () => {
      render(
        <Command className="custom-command" data-testid="command">
          Content
        </Command>
      );
      expect(screen.getByTestId('command')).toHaveClass('custom-command');
    });
  });

  describe('CommandInput', () => {
    test('renders command input with placeholder', () => {
      render(
        <Command>
          <CommandInput placeholder="Type a command..." />
        </Command>
      );
      expect(
        screen.getByPlaceholderText('Type a command...')
      ).toBeInTheDocument();
    });

    test('applies custom className to input', () => {
      render(
        <Command>
          <CommandInput className="custom-input" placeholder="Search" />
        </Command>
      );
      const input = screen.getByPlaceholderText('Search');
      expect(input).toHaveClass('custom-input');
    });
  });

  describe('CommandList', () => {
    test('renders command list', () => {
      render(
        <Command>
          <CommandList data-testid="command-list">
            <div>List content</div>
          </CommandList>
        </Command>
      );
      expect(screen.getByTestId('command-list')).toBeInTheDocument();
    });
  });

  describe('CommandEmpty', () => {
    test('renders empty state message', () => {
      render(
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
          </CommandList>
        </Command>
      );
      expect(screen.getByText('No results found.')).toBeInTheDocument();
    });
  });

  describe('CommandGroup', () => {
    test('renders command group with heading', () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup heading="Suggestions">
              <CommandItem>Item 1</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );
      expect(screen.getByText('Suggestions')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  describe('CommandItem', () => {
    test('renders command item', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem data-testid="command-item">Test Item</CommandItem>
          </CommandList>
        </Command>
      );
      expect(screen.getByTestId('command-item')).toBeInTheDocument();
      expect(screen.getByText('Test Item')).toBeInTheDocument();
    });

    test('applies disabled state', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem disabled data-testid="disabled-item">
              Disabled Item
            </CommandItem>
          </CommandList>
        </Command>
      );
      expect(screen.getByTestId('disabled-item')).toHaveAttribute(
        'data-disabled'
      );
    });
  });

  describe('CommandSeparator', () => {
    test('renders separator', () => {
      render(
        <Command>
          <CommandList>
            <CommandSeparator data-testid="separator" />
          </CommandList>
        </Command>
      );
      expect(screen.getByTestId('separator')).toBeInTheDocument();
    });
  });

  describe('CommandShortcut', () => {
    test('renders keyboard shortcut', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>
              Command
              <CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
          </CommandList>
        </Command>
      );
      expect(screen.getByText('⌘K')).toBeInTheDocument();
    });
  });

  describe('CommandDialog', () => {
    test('renders command dialog when open', () => {
      render(
        <CommandDialog open={true} onOpenChange={() => {}}>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
          </CommandList>
        </CommandDialog>
      );
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });
  });
});
