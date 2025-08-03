import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarLabel,
} from '../menubar';

interface MockProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface MockForwardRefProps extends MockProps {
  ref?: React.Ref<HTMLElement>;
}

// Mock Radix UI Menubar
jest.mock('@radix-ui/react-menubar', () => ({
  Root: ({ children, className, ...props }: MockProps) => (
    <div data-testid="menubar-root" className={className} {...props}>
      {children}
    </div>
  ),
  Menu: ({ children, ...props }: MockProps) => (
    <div data-testid="menubar-menu" {...props}>
      {children}
    </div>
  ),
  Group: ({ children, ...props }: MockProps) => (
    <div data-testid="menubar-group" {...props}>
      {children}
    </div>
  ),
  Portal: ({ children, ...props }: MockProps) => (
    <div data-testid="menubar-portal" {...props}>
      {children}
    </div>
  ),
  Sub: ({ children, ...props }: MockProps) => (
    <div data-testid="menubar-sub" {...props}>
      {children}
    </div>
  ),
  RadioGroup: ({ children, ...props }: MockProps) => (
    <div data-testid="menubar-radio-group" {...props}>
      {children}
    </div>
  ),
  ItemIndicator: ({ children, ...props }: MockProps) => (
    <div data-testid="menubar-item-indicator" {...props}>
      {children}
    </div>
  ),
  Trigger: React.forwardRef<HTMLButtonElement, MockForwardRefProps>(
    ({ children, className, ...props }, ref) => (
      <button
        ref={ref}
        data-testid="menubar-trigger"
        className={className}
        {...props}>
        {children}
      </button>
    )
  ),
  SubTrigger: React.forwardRef<HTMLButtonElement, MockForwardRefProps>(
    ({ children, className, ...props }, ref) => (
      <button
        ref={ref}
        data-testid="menubar-sub-trigger"
        className={className}
        {...props}>
        {children}
      </button>
    )
  ),
  Content: React.forwardRef<
    HTMLDivElement,
    MockForwardRefProps & { align?: string; sideOffset?: number }
  >(
    (
      { children, className, align = 'start', sideOffset = 8, ...props },
      ref
    ) => (
      <div
        ref={ref}
        data-testid="menubar-content"
        data-align={align}
        data-side-offset={sideOffset}
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
        data-testid="menubar-sub-content"
        className={className}
        {...props}>
        {children}
      </div>
    )
  ),
  Item: React.forwardRef<HTMLDivElement, MockForwardRefProps>(
    ({ children, className, ...props }, ref) => (
      <div
        ref={ref}
        data-testid="menubar-item"
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
      data-testid="menubar-checkbox-item"
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
      data-testid="menubar-radio-item"
      data-value={value}
      className={className}
      {...props}>
      {children}
    </div>
  )),
  Label: React.forwardRef<HTMLDivElement, MockForwardRefProps>(
    ({ children, className, ...props }, ref) => (
      <div
        ref={ref}
        data-testid="menubar-label"
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
        data-testid="menubar-separator"
        className={className}
        role="separator"
        {...props}
      />
    )
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Check: () => <span data-testid="check-icon">✓</span>,
  ChevronRight: () => <span data-testid="chevron-right-icon">›</span>,
  Circle: () => <span data-testid="circle-icon">○</span>,
}));

describe('Menubar Components', () => {
  describe('Menubar Root', () => {
    it('renders menubar root', () => {
      render(
        <Menubar>
          <div>Menubar content</div>
        </Menubar>
      );

      expect(screen.getByTestId('menubar-root')).toBeInTheDocument();
      expect(screen.getByText('Menubar content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Menubar className="custom-menubar">
          <div>Content</div>
        </Menubar>
      );

      const menubar = screen.getByTestId('menubar-root');
      expect(menubar).toHaveClass('custom-menubar');
    });
  });

  describe('MenubarMenu', () => {
    it('renders menu', () => {
      render(
        <MenubarMenu>
          <div>Menu content</div>
        </MenubarMenu>
      );

      expect(screen.getByTestId('menubar-menu')).toBeInTheDocument();
      expect(screen.getByText('Menu content')).toBeInTheDocument();
    });
  });

  describe('MenubarTrigger', () => {
    it('renders trigger with content', () => {
      render(<MenubarTrigger>File</MenubarTrigger>);

      expect(screen.getByTestId('menubar-trigger')).toBeInTheDocument();
      expect(screen.getByText('File')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<MenubarTrigger className="custom-trigger">Edit</MenubarTrigger>);

      const trigger = screen.getByTestId('menubar-trigger');
      expect(trigger).toHaveClass('custom-trigger');
    });
  });

  describe('MenubarContent', () => {
    it('renders content with default align and sideOffset', () => {
      render(
        <MenubarContent>
          <div>Content items</div>
        </MenubarContent>
      );

      const content = screen.getByTestId('menubar-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('data-align', 'start');
      expect(content).toHaveAttribute('data-side-offset', '8');
    });

    it('renders content with custom align and sideOffset', () => {
      render(
        <MenubarContent align="center" sideOffset={8}>
          <div>Content</div>
        </MenubarContent>
      );

      const content = screen.getByTestId('menubar-content');
      expect(content).toHaveAttribute('data-align', 'center');
      expect(content).toHaveAttribute('data-side-offset', '8');
    });

    it('applies custom className', () => {
      render(
        <MenubarContent className="custom-content">
          <div>Content</div>
        </MenubarContent>
      );

      const content = screen.getByTestId('menubar-content');
      expect(content).toHaveClass('custom-content');
    });
  });

  describe('MenubarItem', () => {
    it('renders menu item', () => {
      render(<MenubarItem>New File</MenubarItem>);

      expect(screen.getByTestId('menubar-item')).toBeInTheDocument();
      expect(screen.getByText('New File')).toBeInTheDocument();
    });

    it('applies inset className when inset is true', () => {
      render(<MenubarItem inset>Indented Item</MenubarItem>);

      const item = screen.getByTestId('menubar-item');
      expect(item).toHaveClass('pl-8');
    });

    it('applies custom className', () => {
      render(<MenubarItem className="custom-item">Custom Item</MenubarItem>);

      const item = screen.getByTestId('menubar-item');
      expect(item).toHaveClass('custom-item');
    });
  });

  describe('MenubarCheckboxItem', () => {
    it('renders checkbox item with check icon', () => {
      render(<MenubarCheckboxItem checked>Show Toolbar</MenubarCheckboxItem>);

      expect(screen.getByTestId('menubar-checkbox-item')).toBeInTheDocument();
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
      expect(screen.getByText('Show Toolbar')).toBeInTheDocument();
    });

    it('renders unchecked checkbox item', () => {
      render(
        <MenubarCheckboxItem checked={false}>Hidden Option</MenubarCheckboxItem>
      );

      const item = screen.getByTestId('menubar-checkbox-item');
      expect(item).toHaveAttribute('data-checked', 'false');
      // When unchecked, the check icon is still rendered but the indicator controls visibility
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <MenubarCheckboxItem className="custom-checkbox" checked>
          Checkbox
        </MenubarCheckboxItem>
      );

      const item = screen.getByTestId('menubar-checkbox-item');
      expect(item).toHaveClass('custom-checkbox');
    });
  });

  describe('MenubarRadioItem', () => {
    it('renders radio item with circle icon', () => {
      render(<MenubarRadioItem value="option1">Option 1</MenubarRadioItem>);

      expect(screen.getByTestId('menubar-radio-item')).toBeInTheDocument();
      expect(screen.getByTestId('circle-icon')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <MenubarRadioItem className="custom-radio" value="option2">
          Option 2
        </MenubarRadioItem>
      );

      const item = screen.getByTestId('menubar-radio-item');
      expect(item).toHaveClass('custom-radio');
      expect(item).toHaveAttribute('data-value', 'option2');
    });
  });

  describe('MenubarLabel', () => {
    it('renders label', () => {
      render(<MenubarLabel>Recent Files</MenubarLabel>);

      expect(screen.getByTestId('menubar-label')).toBeInTheDocument();
      expect(screen.getByText('Recent Files')).toBeInTheDocument();
    });

    it('applies inset className when inset is true', () => {
      render(<MenubarLabel inset>Indented Label</MenubarLabel>);

      const label = screen.getByTestId('menubar-label');
      expect(label).toHaveClass('pl-8');
    });

    it('applies custom className', () => {
      render(
        <MenubarLabel className="custom-label">Custom Label</MenubarLabel>
      );

      const label = screen.getByTestId('menubar-label');
      expect(label).toHaveClass('custom-label');
    });
  });

  describe('MenubarSeparator', () => {
    it('renders separator', () => {
      render(<MenubarSeparator />);

      const separator = screen.getByTestId('menubar-separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute('role', 'separator');
    });

    it('applies custom className', () => {
      render(<MenubarSeparator className="custom-separator" />);

      const separator = screen.getByTestId('menubar-separator');
      expect(separator).toHaveClass('custom-separator');
    });
  });

  describe('MenubarShortcut', () => {
    it('renders shortcut text', () => {
      render(<MenubarShortcut>⌘N</MenubarShortcut>);

      expect(screen.getByText('⌘N')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <MenubarShortcut className="custom-shortcut">Ctrl+S</MenubarShortcut>
      );

      const shortcut = screen.getByText('Ctrl+S');
      expect(shortcut).toHaveClass('custom-shortcut');
    });
  });

  describe('MenubarSub Components', () => {
    it('renders sub menu trigger with chevron icon', () => {
      render(<MenubarSubTrigger>More Options</MenubarSubTrigger>);

      expect(screen.getByTestId('menubar-sub-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();
      expect(screen.getByText('More Options')).toBeInTheDocument();
    });

    it('renders sub trigger with inset', () => {
      render(<MenubarSubTrigger inset>Indented Submenu</MenubarSubTrigger>);

      const trigger = screen.getByTestId('menubar-sub-trigger');
      expect(trigger).toHaveClass('pl-8');
    });

    it('renders sub content', () => {
      render(
        <MenubarSubContent>
          <div>Submenu content</div>
        </MenubarSubContent>
      );

      expect(screen.getByTestId('menubar-sub-content')).toBeInTheDocument();
      expect(screen.getByText('Submenu content')).toBeInTheDocument();
    });

    it('applies custom className to sub components', () => {
      render(
        <>
          <MenubarSubTrigger className="custom-sub-trigger">
            Submenu
          </MenubarSubTrigger>
          <MenubarSubContent className="custom-sub-content">
            Content
          </MenubarSubContent>
        </>
      );

      const trigger = screen.getByTestId('menubar-sub-trigger');
      const content = screen.getByTestId('menubar-sub-content');

      expect(trigger).toHaveClass('custom-sub-trigger');
      expect(content).toHaveClass('custom-sub-content');
    });
  });

  describe('MenubarRadioGroup', () => {
    it('renders radio group', () => {
      render(
        <MenubarRadioGroup>
          <div>Radio options</div>
        </MenubarRadioGroup>
      );

      expect(screen.getByTestId('menubar-radio-group')).toBeInTheDocument();
      expect(screen.getByText('Radio options')).toBeInTheDocument();
    });
  });

  describe('Complete Menubar', () => {
    it('renders complete menubar structure', () => {
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New</MenubarItem>
              <MenubarItem>Open</MenubarItem>
              <MenubarSeparator />
              <MenubarCheckboxItem checked>Show Toolbar</MenubarCheckboxItem>
              <MenubarSub>
                <MenubarSubTrigger>Recent</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>file1.txt</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarRadioGroup>
                <MenubarRadioItem value="light">Light Theme</MenubarRadioItem>
                <MenubarRadioItem value="dark">Dark Theme</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      );

      // Check main structure
      expect(screen.getByTestId('menubar-root')).toBeInTheDocument();
      expect(screen.getByTestId('menubar-menu')).toBeInTheDocument();
      expect(screen.getByTestId('menubar-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('menubar-content')).toBeInTheDocument();

      // Check menu items
      expect(screen.getByText('File')).toBeInTheDocument();
      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByText('Open')).toBeInTheDocument();
      expect(screen.getByText('Show Toolbar')).toBeInTheDocument();
      expect(screen.getByText('Recent')).toBeInTheDocument();
      expect(screen.getByText('Light Theme')).toBeInTheDocument();
      expect(screen.getByText('Dark Theme')).toBeInTheDocument();

      // Check icons
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
      expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();

      // Check separator
      expect(screen.getByTestId('menubar-separator')).toBeInTheDocument();
    });
  });
});
