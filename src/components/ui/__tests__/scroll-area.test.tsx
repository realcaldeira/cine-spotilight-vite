import { render, screen } from '@testing-library/react';
import { ScrollArea, ScrollBar } from '../scroll-area';

// Mock @radix-ui/react-scroll-area with proper structure for ScrollAreaPrimitive
jest.mock('@radix-ui/react-scroll-area', () => ({
  Root: Object.assign(
    ({ className, children, ...props }: any) => (
      <div
        data-testid="scroll-area-primitive-root"
        className={className}
        {...props}>
        {children}
      </div>
    ),
    { displayName: 'ScrollAreaRoot' }
  ),
  Viewport: Object.assign(
    ({ className, children, ...props }: any) => (
      <div
        data-testid="scroll-area-primitive-viewport"
        className={className}
        {...props}>
        {children}
      </div>
    ),
    { displayName: 'ScrollAreaViewport' }
  ),
  ScrollAreaScrollbar: Object.assign(
    ({ className, orientation, children, ...props }: any) => (
      <div
        data-testid="scroll-area-primitive-scrollbar"
        className={className}
        data-orientation={orientation}
        {...props}>
        {children}
      </div>
    ),
    { displayName: 'ScrollAreaScrollbar' }
  ),
  ScrollAreaThumb: Object.assign(
    ({ className, ...props }: any) => (
      <div
        data-testid="scroll-area-primitive-thumb"
        className={className}
        {...props}
      />
    ),
    { displayName: 'ScrollAreaThumb' }
  ),
  Corner: Object.assign(
    ({ className, ...props }: any) => (
      <div
        data-testid="scroll-area-primitive-corner"
        className={className}
        {...props}
      />
    ),
    { displayName: 'ScrollAreaCorner' }
  ),
}));

describe('ScrollArea Components', () => {
  describe('ScrollArea', () => {
    it('should render scroll area', () => {
      render(
        <ScrollArea className="h-72 w-48 rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="text-sm">
                Tag {i + 1}
              </div>
            ))}
          </div>
        </ScrollArea>
      );

      expect(
        screen.getByTestId('scroll-area-primitive-root')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('scroll-area-primitive-viewport')
      ).toBeInTheDocument();
      expect(screen.getByText('Tags')).toBeInTheDocument();
      expect(screen.getByText('Tag 1')).toBeInTheDocument();
      expect(screen.getByText('Tag 50')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <ScrollArea className="custom-scroll-area">
          <div>Content</div>
        </ScrollArea>
      );
      const scrollArea = screen.getByTestId('scroll-area-primitive-root');
      expect(scrollArea).toHaveClass('custom-scroll-area');
    });

    it('should render children in viewport', () => {
      render(
        <ScrollArea>
          <div data-testid="scroll-content">Scrollable content</div>
        </ScrollArea>
      );
      expect(screen.getByTestId('scroll-content')).toBeInTheDocument();
      expect(screen.getByText('Scrollable content')).toBeInTheDocument();
    });
  });

  describe('ScrollBar', () => {
    it('should render vertical scrollbar by default', () => {
      render(<ScrollBar />);
      const scrollbar = screen.getByTestId('scroll-area-primitive-scrollbar');
      expect(scrollbar).toBeInTheDocument();
      expect(scrollbar).toHaveAttribute('data-orientation', 'vertical');
    });

    it('should render horizontal scrollbar', () => {
      render(<ScrollBar orientation="horizontal" />);
      const scrollbar = screen.getByTestId('scroll-area-primitive-scrollbar');
      expect(scrollbar).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('should apply custom className', () => {
      render(<ScrollBar className="custom-scrollbar" />);
      const scrollbar = screen.getByTestId('scroll-area-primitive-scrollbar');
      expect(scrollbar).toHaveClass('custom-scrollbar');
    });

    it('should render with thumb', () => {
      render(<ScrollBar />);
      expect(
        screen.getByTestId('scroll-area-primitive-scrollbar')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('scroll-area-primitive-thumb')
      ).toBeInTheDocument();
    });
  });

  describe('Complete ScrollArea Structure', () => {
    it('should render complete scroll area with both scrollbars', () => {
      render(
        <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
          <div className="space-y-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full" />
                <span>
                  Item {i + 1} with a very long text that might overflow
                  horizontally
                </span>
              </div>
            ))}
          </div>
          <ScrollBar />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      );

      expect(
        screen.getByTestId('scroll-area-primitive-root')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('scroll-area-primitive-viewport')
      ).toBeInTheDocument();
      expect(
        screen.getAllByTestId('scroll-area-primitive-scrollbar')
      ).toHaveLength(3); // ScrollArea + 2 custom ScrollBars
      expect(
        screen.getByText(
          'Item 1 with a very long text that might overflow horizontally'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Item 20 with a very long text that might overflow horizontally'
        )
      ).toBeInTheDocument();
    });

    it('should work with different content types', () => {
      render(
        <ScrollArea className="h-72 w-48">
          <div className="p-4 space-y-4">
            <div>
              <h3>Section 1</h3>
              <p>Some content here</p>
            </div>
            <div>
              <h3>Section 2</h3>
              <ul>
                <li>List item 1</li>
                <li>List item 2</li>
                <li>List item 3</li>
              </ul>
            </div>
            <div>
              <h3>Section 3</h3>
              <img src="/placeholder.jpg" alt="Placeholder" />
            </div>
          </div>
          <ScrollBar />
        </ScrollArea>
      );

      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
      expect(screen.getByText('Section 3')).toBeInTheDocument();
      expect(screen.getByText('List item 1')).toBeInTheDocument();
      expect(screen.getByAltText('Placeholder')).toBeInTheDocument();
    });

    it('should handle custom sizing and styling', () => {
      render(
        <ScrollArea className="h-40 w-64 border-2 border-dashed">
          <div className="p-6">
            <p>Custom styled scroll area content</p>
          </div>
          <ScrollBar className="bg-gray-200" />
        </ScrollArea>
      );

      const scrollArea = screen.getByTestId('scroll-area-primitive-root');
      const scrollBars = screen.getAllByTestId(
        'scroll-area-primitive-scrollbar'
      );

      expect(scrollArea).toHaveClass(
        'h-40',
        'w-64',
        'border-2',
        'border-dashed'
      );
      expect(scrollBars[0]).toHaveClass('bg-gray-200'); // first scrollbar has the custom class
      expect(
        screen.getByText('Custom styled scroll area content')
      ).toBeInTheDocument();
    });
  });
});
