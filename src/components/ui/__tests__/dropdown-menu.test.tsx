import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from '../dropdown-menu';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Check: ({ className }: { className?: string }) => (
    <div data-testid="check-icon" className={className}>
      ✓
    </div>
  ),
  ChevronRight: ({ className }: { className?: string }) => (
    <div data-testid="chevron-right-icon" className={className}>
      →
    </div>
  ),
  Circle: ({ className }: { className?: string }) => (
    <div data-testid="circle-icon" className={className}>
      ○
    </div>
  ),
}));

// Mock Radix UI components
jest.mock('@radix-ui/react-dropdown-menu', () => ({
  Root: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-root" {...props}>
      {children}
    </div>
  ),
  Trigger: React.forwardRef<
    HTMLButtonElement,
    { children: React.ReactNode; className?: string }
  >(({ children, className, ...props }, ref) => (
    <button
      ref={ref}
      data-testid="dropdown-trigger"
      className={className}
      {...props}>
      {children}
    </button>
  )),
  Portal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-portal">{children}</div>
  ),
  Content: React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; className?: string; sideOffset?: number }
  >(({ children, className, sideOffset, ...props }, ref) => (
    <div
      ref={ref}
      data-testid="dropdown-content"
      data-side-offset={sideOffset}
      className={className}
      {...props}>
      {children}
    </div>
  )),
  Item: React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; className?: string }
  >(({ children, className, ...props }, ref) => (
    <div ref={ref} data-testid="dropdown-item" className={className} {...props}>
      {children}
    </div>
  )),
  CheckboxItem: React.forwardRef<
    HTMLDivElement,
    {
      children: React.ReactNode;
      className?: string;
      checked?: boolean;
    }
  >(({ children, className, checked, ...props }, ref) => (
    <div
      ref={ref}
      data-testid="dropdown-checkbox-item"
      data-checked={checked}
      className={className}
      {...props}>
      {children}
    </div>
  )),
  RadioItem: React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; className?: string; value: string }
  >(({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      data-testid="dropdown-radio-item"
      className={className}
      {...props}>
      {children}
    </div>
  )),
  Label: React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; className?: string }
  >(({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      data-testid="dropdown-label"
      className={className}
      {...props}>
      {children}
    </div>
  )),
  Separator: React.forwardRef<HTMLDivElement, { className?: string }>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        data-testid="dropdown-separator"
        className={className}
        {...props}
      />
    )
  ),
  Group: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-group">{children}</div>
  ),
  Sub: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-sub">{children}</div>
  ),
  SubTrigger: React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; className?: string }
  >(({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      data-testid="dropdown-sub-trigger"
      className={className}
      {...props}>
      {children}
    </div>
  )),
  SubContent: React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; className?: string }
  >(({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      data-testid="dropdown-sub-content"
      className={className}
      {...props}>
      {children}
    </div>
  )),
  RadioGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-radio-group">{children}</div>
  ),
  ItemIndicator: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="dropdown-item-indicator">{children}</span>
  ),
}));

describe('DropdownMenu Components', () => {
  describe('DropdownMenu Root', () => {
    it('renders dropdown menu root', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        </DropdownMenu>
      );

      expect(screen.getByTestId('dropdown-root')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument();
      expect(screen.getByText('Open')).toBeInTheDocument();
    });
  });

  describe('DropdownMenuTrigger', () => {
    it('renders trigger with content', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Click me</DropdownMenuTrigger>
        </DropdownMenu>
      );

      const trigger = screen.getByTestId('dropdown-trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('Click me');
    });

    it('applies custom className', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger className="custom-trigger">
            Trigger
          </DropdownMenuTrigger>
        </DropdownMenu>
      );

      const trigger = screen.getByTestId('dropdown-trigger');
      expect(trigger).toHaveClass('custom-trigger');
    });
  });

  describe('DropdownMenuContent', () => {
    it('renders content with default sideOffset', () => {
      render(
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      );

      const content = screen.getByTestId('dropdown-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('data-side-offset', '4');
      expect(screen.getByTestId('dropdown-portal')).toBeInTheDocument();
    });

    it('renders content with custom sideOffset', () => {
      render(
        <DropdownMenuContent sideOffset={8}>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      );

      const content = screen.getByTestId('dropdown-content');
      expect(content).toHaveAttribute('data-side-offset', '8');
    });

    it('applies custom className', () => {
      render(
        <DropdownMenuContent className="custom-content">
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      );

      const content = screen.getByTestId('dropdown-content');
      expect(content).toHaveClass('custom-content');
    });
  });

  describe('DropdownMenuItem', () => {
    it('renders menu item', () => {
      render(<DropdownMenuItem>Menu Item</DropdownMenuItem>);

      const item = screen.getByTestId('dropdown-item');
      expect(item).toBeInTheDocument();
      expect(item).toHaveTextContent('Menu Item');
    });

    it('applies inset className when inset is true', () => {
      render(<DropdownMenuItem inset>Inset Item</DropdownMenuItem>);

      const item = screen.getByTestId('dropdown-item');
      expect(item).toHaveClass('pl-8');
    });

    it('applies custom className', () => {
      render(
        <DropdownMenuItem className="custom-item">Custom Item</DropdownMenuItem>
      );

      const item = screen.getByTestId('dropdown-item');
      expect(item).toHaveClass('custom-item');
    });
  });

  describe('DropdownMenuCheckboxItem', () => {
    it('renders checkbox item with check icon', () => {
      render(
        <DropdownMenuCheckboxItem checked={true}>
          Checkbox Item
        </DropdownMenuCheckboxItem>
      );

      const item = screen.getByTestId('dropdown-checkbox-item');
      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute('data-checked', 'true');
      expect(item).toHaveTextContent('Checkbox Item');
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });

    it('renders unchecked checkbox item', () => {
      render(
        <DropdownMenuCheckboxItem checked={false}>
          Unchecked Item
        </DropdownMenuCheckboxItem>
      );

      const item = screen.getByTestId('dropdown-checkbox-item');
      expect(item).toHaveAttribute('data-checked', 'false');
    });

    it('applies custom className', () => {
      render(
        <DropdownMenuCheckboxItem className="custom-checkbox">
          Checkbox Item
        </DropdownMenuCheckboxItem>
      );

      const item = screen.getByTestId('dropdown-checkbox-item');
      expect(item).toHaveClass('custom-checkbox');
    });
  });

  describe('DropdownMenuRadioItem', () => {
    it('renders radio item with circle icon', () => {
      render(
        <DropdownMenuRadioItem value="radio-item">
          Radio Item
        </DropdownMenuRadioItem>
      );

      const item = screen.getByTestId('dropdown-radio-item');
      expect(item).toBeInTheDocument();
      expect(item).toHaveTextContent('Radio Item');
      expect(screen.getByTestId('circle-icon')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <DropdownMenuRadioItem value="custom-radio" className="custom-radio">
          Radio Item
        </DropdownMenuRadioItem>
      );

      const item = screen.getByTestId('dropdown-radio-item');
      expect(item).toHaveClass('custom-radio');
    });
  });

  describe('DropdownMenuLabel', () => {
    it('renders label', () => {
      render(<DropdownMenuLabel>Label Text</DropdownMenuLabel>);

      const label = screen.getByTestId('dropdown-label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Label Text');
    });

    it('applies inset className when inset is true', () => {
      render(<DropdownMenuLabel inset>Inset Label</DropdownMenuLabel>);

      const label = screen.getByTestId('dropdown-label');
      expect(label).toHaveClass('pl-8');
    });

    it('applies custom className', () => {
      render(
        <DropdownMenuLabel className="custom-label">
          Custom Label
        </DropdownMenuLabel>
      );

      const label = screen.getByTestId('dropdown-label');
      expect(label).toHaveClass('custom-label');
    });
  });

  describe('DropdownMenuSeparator', () => {
    it('renders separator', () => {
      render(<DropdownMenuSeparator />);

      const separator = screen.getByTestId('dropdown-separator');
      expect(separator).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<DropdownMenuSeparator className="custom-separator" />);

      const separator = screen.getByTestId('dropdown-separator');
      expect(separator).toHaveClass('custom-separator');
    });
  });

  describe('DropdownMenuShortcut', () => {
    it('renders shortcut text', () => {
      render(<DropdownMenuShortcut>Ctrl+K</DropdownMenuShortcut>);

      const shortcut = screen.getByText('Ctrl+K');
      expect(shortcut).toBeInTheDocument();
      expect(shortcut.tagName).toBe('SPAN');
    });

    it('applies custom className', () => {
      render(
        <DropdownMenuShortcut className="custom-shortcut">
          Ctrl+S
        </DropdownMenuShortcut>
      );

      const shortcut = screen.getByText('Ctrl+S');
      expect(shortcut).toHaveClass('custom-shortcut');
    });
  });

  describe('DropdownMenuSub Components', () => {
    it('renders sub menu trigger with chevron icon', () => {
      render(
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Submenu</DropdownMenuSubTrigger>
        </DropdownMenuSub>
      );

      expect(screen.getByTestId('dropdown-sub')).toBeInTheDocument();
      expect(screen.getByTestId('dropdown-sub-trigger')).toBeInTheDocument();
      expect(screen.getByText('Submenu')).toBeInTheDocument();
      expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();
    });

    it('renders sub trigger with inset', () => {
      render(
        <DropdownMenuSubTrigger inset>Inset Submenu</DropdownMenuSubTrigger>
      );

      const subTrigger = screen.getByTestId('dropdown-sub-trigger');
      expect(subTrigger).toHaveClass('pl-8');
    });

    it('renders sub content', () => {
      render(
        <DropdownMenuSubContent>
          <DropdownMenuItem>Sub Item</DropdownMenuItem>
        </DropdownMenuSubContent>
      );

      expect(screen.getByTestId('dropdown-sub-content')).toBeInTheDocument();
      expect(screen.getByText('Sub Item')).toBeInTheDocument();
    });

    it('applies custom className to sub components', () => {
      render(
        <>
          <DropdownMenuSubTrigger className="custom-sub-trigger">
            Submenu
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="custom-sub-content">
            Content
          </DropdownMenuSubContent>
        </>
      );

      expect(screen.getByTestId('dropdown-sub-trigger')).toHaveClass(
        'custom-sub-trigger'
      );
      expect(screen.getByTestId('dropdown-sub-content')).toHaveClass(
        'custom-sub-content'
      );
    });
  });

  describe('DropdownMenuRadioGroup', () => {
    it('renders radio group', () => {
      render(
        <DropdownMenuRadioGroup>
          <DropdownMenuRadioItem value="option1">
            Option 1
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="option2">
            Option 2
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      );

      expect(screen.getByTestId('dropdown-radio-group')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });
  });

  describe('Complete Dropdown Menu', () => {
    it('renders complete dropdown menu structure', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuCheckboxItem checked={true}>
              Notifications
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Item 1</DropdownMenuItem>
                <DropdownMenuItem>Sub Item 2</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      // Check all components are rendered
      expect(screen.getByText('Open Menu')).toBeInTheDocument();
      expect(screen.getByText('My Account')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('⇧⌘P')).toBeInTheDocument();
      expect(screen.getByText('Billing')).toBeInTheDocument();
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('More Options')).toBeInTheDocument();
      expect(screen.getByText('Sub Item 1')).toBeInTheDocument();
      expect(screen.getByText('Sub Item 2')).toBeInTheDocument();

      // Check separators
      expect(screen.getAllByTestId('dropdown-separator')).toHaveLength(2);

      // Check icons
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
      expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();
    });
  });
});
