import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuGroup,
  ContextMenuLabel,
} from '../context-menu';

interface MockProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface MockForwardRefProps extends MockProps {
  ref?: React.Ref<HTMLElement>;
}

// Mock Radix UI Context Menu
jest.mock('@radix-ui/react-context-menu', () => ({
  Root: ({ children, ...props }: MockProps) => (
    <div data-testid="context-menu-root" {...props}>
      {children}
    </div>
  ),
  Trigger: React.forwardRef<HTMLDivElement, MockForwardRefProps>(
    ({ children, className, ...props }, ref) => (
      <div
        ref={ref}
        data-testid="context-menu-trigger"
        className={className}
        {...props}>
        {children}
      </div>
    )
  ),
  Portal: ({ children, ...props }: MockProps) => (
    <div data-testid="context-menu-portal" {...props}>
      {children}
    </div>
  ),
  Content: React.forwardRef<
    HTMLDivElement,
    MockForwardRefProps & { sideOffset?: number }
  >(({ children, className, sideOffset = 4, ...props }, ref) => (
    <div
      ref={ref}
      data-testid="context-menu-content"
      data-side-offset={sideOffset}
      className={className}
      {...props}>
      {children}
    </div>
  )),
  Item: React.forwardRef<HTMLDivElement, MockForwardRefProps>(
    ({ children, className, ...props }, ref) => (
      <div
        ref={ref}
        data-testid="context-menu-item"
        className={className}
        {...props}>
        {children}
      </div>
    )
  ),
  CheckboxItem: React.forwardRef<
    HTMLDivElement,
    MockForwardRefProps & { checked?: boolean }
  >(({ children, className, checked, ...props }, ref) => (
    <div
      ref={ref}
      data-testid="context-menu-checkbox-item"
      data-checked={checked}
      className={className}
      {...props}>
      {children}
    </div>
  )),
  RadioItem: React.forwardRef<
    HTMLDivElement,
    MockForwardRefProps & { value?: string }
  >(({ children, className, value, ...props }, ref) => (
    <div
      ref={ref}
      data-testid="context-menu-radio-item"
      data-value={value}
      className={className}
      {...props}>
      {children}
    </div>
  )),
  RadioGroup: ({ children, ...props }: MockProps) => (
    <div data-testid="context-menu-radio-group" {...props}>
      {children}
    </div>
  ),
  Label: React.forwardRef<HTMLDivElement, MockForwardRefProps>(
    ({ children, className, ...props }, ref) => (
      <div
        ref={ref}
        data-testid="context-menu-label"
        className={className}
        {...props}>
        {children}
      </div>
    )
  ),
  Separator: React.forwardRef<HTMLDivElement, MockForwardRefProps>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        data-testid="context-menu-separator"
        className={className}
        role="separator"
        {...props}
      />
    )
  ),
  Group: ({ children, ...props }: MockProps) => (
    <div data-testid="context-menu-group" {...props}>
      {children}
    </div>
  ),
  Sub: ({ children, ...props }: MockProps) => (
    <div data-testid="context-menu-sub" {...props}>
      {children}
    </div>
  ),
  SubTrigger: React.forwardRef<HTMLDivElement, MockForwardRefProps>(
    ({ children, className, ...props }, ref) => (
      <div
        ref={ref}
        data-testid="context-menu-sub-trigger"
        className={className}
        {...props}>
        {children}
      </div>
    )
  ),
  SubContent: React.forwardRef<HTMLDivElement, MockForwardRefProps>(
    ({ children, className, ...props }, ref) => (
      <div
        ref={ref}
        data-testid="context-menu-sub-content"
        className={className}
        {...props}>
        {children}
      </div>
    )
  ),
  ItemIndicator: ({ children, ...props }: MockProps) => (
    <div data-testid="context-menu-item-indicator" {...props}>
      {children}
    </div>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Check: () => <span data-testid="check-icon">✓</span>,
  ChevronRight: () => <span data-testid="chevron-right-icon">›</span>,
  Circle: () => <span data-testid="circle-icon">○</span>,
}));

describe('ContextMenu Components', () => {
  describe('ContextMenu Root', () => {
    it('renders context menu root', () => {
      render(
        <ContextMenu>
          <div>Context menu content</div>
        </ContextMenu>
      );

      expect(screen.getByTestId('context-menu-root')).toBeInTheDocument();
      expect(screen.getByText('Context menu content')).toBeInTheDocument();
    });
  });

  describe('ContextMenuTrigger', () => {
    it('renders trigger with content', () => {
      render(<ContextMenuTrigger>Right click me</ContextMenuTrigger>);

      expect(screen.getByTestId('context-menu-trigger')).toBeInTheDocument();
      expect(screen.getByText('Right click me')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <ContextMenuTrigger className="custom-trigger">
          Trigger content
        </ContextMenuTrigger>
      );

      const trigger = screen.getByTestId('context-menu-trigger');
      expect(trigger).toHaveClass('custom-trigger');
    });
  });

  describe('ContextMenuContent', () => {
    it('renders content with default sideOffset', () => {
      render(
        <ContextMenuContent>
          <div>Content items</div>
        </ContextMenuContent>
      );

      const content = screen.getByTestId('context-menu-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('data-side-offset', '4');
    });

    it('renders content with custom sideOffset', () => {
      render(
        <ContextMenuContent className="custom-sideoffset">
          <div>Content</div>
        </ContextMenuContent>
      );

      const content = screen.getByTestId('context-menu-content');
      expect(content).toHaveClass('custom-sideoffset');
    });

    it('applies custom className', () => {
      render(
        <ContextMenuContent className="custom-content">
          <div>Content</div>
        </ContextMenuContent>
      );

      const content = screen.getByTestId('context-menu-content');
      expect(content).toHaveClass('custom-content');
    });
  });

  describe('ContextMenuItem', () => {
    it('renders menu item', () => {
      render(<ContextMenuItem>Copy</ContextMenuItem>);

      expect(screen.getByTestId('context-menu-item')).toBeInTheDocument();
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });

    it('applies inset className when inset is true', () => {
      render(<ContextMenuItem inset>Indented Item</ContextMenuItem>);

      const item = screen.getByTestId('context-menu-item');
      expect(item).toHaveClass('pl-8');
    });

    it('applies custom className', () => {
      render(
        <ContextMenuItem className="custom-item">Custom Item</ContextMenuItem>
      );

      const item = screen.getByTestId('context-menu-item');
      expect(item).toHaveClass('custom-item');
    });
  });

  describe('ContextMenuCheckboxItem', () => {
    it('renders checkbox item with check icon', () => {
      render(
        <ContextMenuCheckboxItem checked>
          Show Hidden Files
        </ContextMenuCheckboxItem>
      );

      expect(
        screen.getByTestId('context-menu-checkbox-item')
      ).toBeInTheDocument();
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
      expect(screen.getByText('Show Hidden Files')).toBeInTheDocument();
    });

    it('renders unchecked checkbox item', () => {
      render(
        <ContextMenuCheckboxItem checked={false}>
          Hidden Option
        </ContextMenuCheckboxItem>
      );

      const item = screen.getByTestId('context-menu-checkbox-item');
      expect(item).toHaveAttribute('data-checked', 'false');
      // When unchecked, the check icon is still rendered but controlled by indicator
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <ContextMenuCheckboxItem className="custom-checkbox" checked>
          Checkbox
        </ContextMenuCheckboxItem>
      );

      const item = screen.getByTestId('context-menu-checkbox-item');
      expect(item).toHaveClass('custom-checkbox');
    });
  });

  describe('ContextMenuRadioItem', () => {
    it('renders radio item with circle icon', () => {
      render(
        <ContextMenuRadioItem value="option1">Option 1</ContextMenuRadioItem>
      );

      expect(screen.getByTestId('context-menu-radio-item')).toBeInTheDocument();
      expect(screen.getByTestId('circle-icon')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <ContextMenuRadioItem className="custom-radio" value="option2">
          Option 2
        </ContextMenuRadioItem>
      );

      const item = screen.getByTestId('context-menu-radio-item');
      expect(item).toHaveClass('custom-radio');
      expect(item).toHaveAttribute('data-value', 'option2');
    });
  });

  describe('ContextMenuLabel', () => {
    it('renders label', () => {
      render(<ContextMenuLabel>Actions</ContextMenuLabel>);

      expect(screen.getByTestId('context-menu-label')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('applies inset className when inset is true', () => {
      render(<ContextMenuLabel inset>Indented Label</ContextMenuLabel>);

      const label = screen.getByTestId('context-menu-label');
      expect(label).toHaveClass('pl-8');
    });

    it('applies custom className', () => {
      render(
        <ContextMenuLabel className="custom-label">
          Custom Label
        </ContextMenuLabel>
      );

      const label = screen.getByTestId('context-menu-label');
      expect(label).toHaveClass('custom-label');
    });
  });

  describe('ContextMenuSeparator', () => {
    it('renders separator', () => {
      render(<ContextMenuSeparator />);

      const separator = screen.getByTestId('context-menu-separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute('role', 'separator');
    });

    it('applies custom className', () => {
      render(<ContextMenuSeparator className="custom-separator" />);

      const separator = screen.getByTestId('context-menu-separator');
      expect(separator).toHaveClass('custom-separator');
    });
  });

  describe('ContextMenuShortcut', () => {
    it('renders shortcut text', () => {
      render(<ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>);

      expect(screen.getByText('Ctrl+C')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <ContextMenuShortcut className="custom-shortcut">
          Ctrl+V
        </ContextMenuShortcut>
      );

      const shortcut = screen.getByText('Ctrl+V');
      expect(shortcut).toHaveClass('custom-shortcut');
    });
  });

  describe('ContextMenuSub Components', () => {
    it('renders sub menu trigger with chevron icon', () => {
      render(<ContextMenuSubTrigger>More Options</ContextMenuSubTrigger>);

      expect(
        screen.getByTestId('context-menu-sub-trigger')
      ).toBeInTheDocument();
      expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();
      expect(screen.getByText('More Options')).toBeInTheDocument();
    });

    it('renders sub trigger with inset', () => {
      render(
        <ContextMenuSubTrigger inset>Indented Submenu</ContextMenuSubTrigger>
      );

      const trigger = screen.getByTestId('context-menu-sub-trigger');
      expect(trigger).toHaveClass('pl-8');
    });

    it('renders sub content', () => {
      render(
        <ContextMenuSubContent>
          <div>Submenu content</div>
        </ContextMenuSubContent>
      );

      expect(
        screen.getByTestId('context-menu-sub-content')
      ).toBeInTheDocument();
      expect(screen.getByText('Submenu content')).toBeInTheDocument();
    });

    it('applies custom className to sub components', () => {
      render(
        <>
          <ContextMenuSubTrigger className="custom-sub-trigger">
            Submenu
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="custom-sub-content">
            Content
          </ContextMenuSubContent>
        </>
      );

      const trigger = screen.getByTestId('context-menu-sub-trigger');
      const content = screen.getByTestId('context-menu-sub-content');

      expect(trigger).toHaveClass('custom-sub-trigger');
      expect(content).toHaveClass('custom-sub-content');
    });
  });

  describe('ContextMenuRadioGroup', () => {
    it('renders radio group', () => {
      render(
        <ContextMenuRadioGroup>
          <div>Radio options</div>
        </ContextMenuRadioGroup>
      );

      expect(
        screen.getByTestId('context-menu-radio-group')
      ).toBeInTheDocument();
      expect(screen.getByText('Radio options')).toBeInTheDocument();
    });
  });

  describe('ContextMenuGroup', () => {
    it('renders group', () => {
      render(
        <ContextMenuGroup>
          <div>Group content</div>
        </ContextMenuGroup>
      );

      expect(screen.getByTestId('context-menu-group')).toBeInTheDocument();
      expect(screen.getByText('Group content')).toBeInTheDocument();
    });
  });

  describe('ContextMenuPortal', () => {
    it('renders portal', () => {
      render(
        <ContextMenuPortal>
          <div>Portal content</div>
        </ContextMenuPortal>
      );

      expect(screen.getByTestId('context-menu-portal')).toBeInTheDocument();
      expect(screen.getByText('Portal content')).toBeInTheDocument();
    });
  });

  describe('ContextMenuSub', () => {
    it('renders sub menu', () => {
      render(
        <ContextMenuSub>
          <div>Sub menu content</div>
        </ContextMenuSub>
      );

      expect(screen.getByTestId('context-menu-sub')).toBeInTheDocument();
      expect(screen.getByText('Sub menu content')).toBeInTheDocument();
    });
  });

  describe('Complete ContextMenu', () => {
    it('renders complete context menu structure', () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>Right-click me</ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>Actions</ContextMenuLabel>
            <ContextMenuItem>Copy</ContextMenuItem>
            <ContextMenuItem>Paste</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem checked>
              Show Icons
            </ContextMenuCheckboxItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>View</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>List</ContextMenuItem>
                <ContextMenuItem>Grid</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuRadioGroup>
              <ContextMenuRadioItem value="small">Small</ContextMenuRadioItem>
              <ContextMenuRadioItem value="large">Large</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      );

      // Check main structure
      expect(screen.getByTestId('context-menu-root')).toBeInTheDocument();
      expect(screen.getByTestId('context-menu-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('context-menu-content')).toBeInTheDocument();

      // Check menu items
      expect(screen.getByText('Right-click me')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
      expect(screen.getByText('Copy')).toBeInTheDocument();
      expect(screen.getByText('Paste')).toBeInTheDocument();
      expect(screen.getByText('Show Icons')).toBeInTheDocument();
      expect(screen.getByText('View')).toBeInTheDocument();
      expect(screen.getByText('List')).toBeInTheDocument();
      expect(screen.getByText('Grid')).toBeInTheDocument();
      expect(screen.getByText('Small')).toBeInTheDocument();
      expect(screen.getByText('Large')).toBeInTheDocument();

      // Check icons
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
      expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();
      expect(screen.getAllByTestId('circle-icon')).toHaveLength(2);

      // Check separator
      expect(screen.getByTestId('context-menu-separator')).toBeInTheDocument();
    });
  });
});
