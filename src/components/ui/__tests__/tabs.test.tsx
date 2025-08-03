import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs';

// Simple mock for Radix UI Tabs
jest.mock('@radix-ui/react-tabs', () => ({
  Root: ({ children, className, defaultValue, ...props }: any) => (
    <div
      data-testid="tabs-root"
      className={className}
      data-value={defaultValue}
      {...props}>
      {children}
    </div>
  ),
  List: ({ children, className, ...props }: any) => (
    <div
      data-testid="tabs-list"
      className={className}
      role="tablist"
      {...props}>
      {children}
    </div>
  ),
  Trigger: ({ children, className, value, ...props }: any) => (
    <button
      data-testid="tabs-trigger"
      className={className}
      data-value={value}
      role="tab"
      {...props}>
      {children}
    </button>
  ),
  Content: ({ children, className, value, ...props }: any) => (
    <div
      data-testid="tabs-content"
      className={className}
      data-value={value}
      role="tabpanel"
      {...props}>
      {children}
    </div>
  ),
}));

describe('Tabs Components', () => {
  describe('Tabs', () => {
    it('should render tabs root', () => {
      render(
        <Tabs defaultValue="tab1">
          <div>Tabs content</div>
        </Tabs>
      );
      expect(screen.getByTestId('tabs-root')).toBeInTheDocument();
    });

    it('should pass defaultValue prop', () => {
      render(
        <Tabs defaultValue="home">
          <div>Content</div>
        </Tabs>
      );
      const tabs = screen.getByTestId('tabs-root');
      expect(tabs).toHaveAttribute('data-value', 'home');
    });

    it('should apply custom className', () => {
      render(
        <Tabs className="custom-tabs">
          <div>Content</div>
        </Tabs>
      );
      const tabs = screen.getByTestId('tabs-root');
      expect(tabs).toHaveClass('custom-tabs');
    });
  });

  describe('TabsList', () => {
    it('should render tabs list', () => {
      render(
        <TabsList>
          <div>List content</div>
        </TabsList>
      );
      expect(screen.getByTestId('tabs-list')).toBeInTheDocument();
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <TabsList className="custom-list">
          <div>Content</div>
        </TabsList>
      );
      const list = screen.getByTestId('tabs-list');
      expect(list).toHaveClass('custom-list');
    });

    it('should have proper styling classes', () => {
      render(<TabsList>Content</TabsList>);
      const list = screen.getByTestId('tabs-list');
      expect(list).toHaveClass(
        'inline-flex',
        'h-10',
        'items-center',
        'justify-center',
        'rounded-md',
        'bg-muted',
        'p-1',
        'text-muted-foreground'
      );
    });
  });

  describe('TabsTrigger', () => {
    it('should render tabs trigger', () => {
      render(<TabsTrigger value="tab1">Tab 1</TabsTrigger>);
      expect(screen.getByTestId('tabs-trigger')).toBeInTheDocument();
      expect(screen.getByRole('tab')).toBeInTheDocument();
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
    });

    it('should pass value prop', () => {
      render(<TabsTrigger value="profile">Profile</TabsTrigger>);
      const trigger = screen.getByTestId('tabs-trigger');
      expect(trigger).toHaveAttribute('data-value', 'profile');
    });

    it('should apply custom className', () => {
      render(
        <TabsTrigger value="tab1" className="custom-trigger">
          Tab
        </TabsTrigger>
      );
      const trigger = screen.getByTestId('tabs-trigger');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('should have proper styling classes', () => {
      render(<TabsTrigger value="tab1">Tab</TabsTrigger>);
      const trigger = screen.getByTestId('tabs-trigger');
      expect(trigger).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'whitespace-nowrap',
        'rounded-sm',
        'px-3',
        'py-1.5',
        'text-sm',
        'font-medium',
        'ring-offset-background'
      );
    });

    it('should handle click events', async () => {
      const handleClick = jest.fn();
      render(
        <TabsTrigger value="tab1" onClick={handleClick}>
          Click Tab
        </TabsTrigger>
      );

      await userEvent.click(screen.getByRole('tab'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
      render(
        <TabsTrigger value="tab1" disabled>
          Disabled Tab
        </TabsTrigger>
      );
      const trigger = screen.getByRole('tab');
      expect(trigger).toBeDisabled();
    });
  });

  describe('TabsContent', () => {
    it('should render tabs content', () => {
      render(
        <TabsContent value="tab1">
          <div>Tab 1 content</div>
        </TabsContent>
      );
      expect(screen.getByTestId('tabs-content')).toBeInTheDocument();
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
      expect(screen.getByText('Tab 1 content')).toBeInTheDocument();
    });

    it('should pass value prop', () => {
      render(
        <TabsContent value="settings">
          <div>Settings content</div>
        </TabsContent>
      );
      const content = screen.getByTestId('tabs-content');
      expect(content).toHaveAttribute('data-value', 'settings');
    });

    it('should apply custom className', () => {
      render(
        <TabsContent value="tab1" className="custom-content">
          Content
        </TabsContent>
      );
      const content = screen.getByTestId('tabs-content');
      expect(content).toHaveClass('custom-content');
    });

    it('should have proper styling classes', () => {
      render(<TabsContent value="tab1">Content</TabsContent>);
      const content = screen.getByTestId('tabs-content');
      expect(content).toHaveClass('mt-2', 'ring-offset-background');
    });
  });

  describe('Complete Tabs Structure', () => {
    it('should render complete tabs with all components', () => {
      render(
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div>Overview content here</div>
          </TabsContent>
          <TabsContent value="analytics">
            <div>Analytics content here</div>
          </TabsContent>
          <TabsContent value="reports">
            <div>Reports content here</div>
          </TabsContent>
        </Tabs>
      );

      expect(screen.getByTestId('tabs-root')).toBeInTheDocument();
      expect(screen.getByRole('tablist')).toBeInTheDocument();

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3);
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();

      const tabPanels = screen.getAllByRole('tabpanel');
      expect(tabPanels).toHaveLength(3);
      expect(screen.getByText('Overview content here')).toBeInTheDocument();
      expect(screen.getByText('Analytics content here')).toBeInTheDocument();
      expect(screen.getByText('Reports content here')).toBeInTheDocument();
    });

    it('should support multiple tabs with different configurations', () => {
      render(
        <Tabs defaultValue="tab1" orientation="vertical">
          <TabsList>
            <TabsTrigger value="tab1" disabled>
              Disabled Tab
            </TabsTrigger>
            <TabsTrigger value="tab2">Active Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const disabledTab = screen.getByText('Disabled Tab');
      const activeTab = screen.getByText('Active Tab');

      expect(disabledTab).toBeInTheDocument();
      expect(activeTab).toBeInTheDocument();
    });
  });
});
