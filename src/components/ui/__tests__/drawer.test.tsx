import { render, screen } from '@testing-library/react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from '../drawer';

// Mock vaul with proper structure for DrawerPrimitive
jest.mock('vaul', () => {
  const MockDrawer = Object.assign(
    ({ children }: { children: React.ReactNode }) => (
      <div data-testid="drawer-root">{children}</div>
    ),
    {
      displayName: 'Drawer',
      // Add properties that DrawerPrimitive accesses
      Root: Object.assign(
        ({ children, shouldScaleBackground, ...props }: any) => (
          <div
            data-testid="drawer-primitive-root"
            data-should-scale={shouldScaleBackground}
            {...props}>
            {children}
          </div>
        ),
        { displayName: 'DrawerRoot' }
      ),
      Trigger: Object.assign(
        ({ children, ...props }: any) => (
          <button data-testid="drawer-primitive-trigger" {...props}>
            {children}
          </button>
        ),
        { displayName: 'DrawerTrigger' }
      ),
      Portal: Object.assign(
        ({ children }: { children: React.ReactNode }) => (
          <div data-testid="drawer-primitive-portal">{children}</div>
        ),
        { displayName: 'DrawerPortal' }
      ),
      Overlay: Object.assign(
        ({ className, ...props }: any) => (
          <div
            data-testid="drawer-primitive-overlay"
            className={className}
            {...props}
          />
        ),
        { displayName: 'DrawerOverlay' }
      ),
      Content: Object.assign(
        ({ className, children, ...props }: any) => (
          <div
            data-testid="drawer-primitive-content"
            className={className}
            {...props}>
            {children}
          </div>
        ),
        { displayName: 'DrawerContent' }
      ),
      Title: Object.assign(
        ({ className, children, ...props }: any) => (
          <h2
            data-testid="drawer-primitive-title"
            className={className}
            {...props}>
            {children}
          </h2>
        ),
        { displayName: 'DrawerTitle' }
      ),
      Description: Object.assign(
        ({ className, children, ...props }: any) => (
          <p
            data-testid="drawer-primitive-description"
            className={className}
            {...props}>
            {children}
          </p>
        ),
        { displayName: 'DrawerDescription' }
      ),
      Close: Object.assign(
        ({ className, children, ...props }: any) => (
          <button
            data-testid="drawer-primitive-close"
            className={className}
            {...props}>
            {children}
          </button>
        ),
        { displayName: 'DrawerClose' }
      ),
    }
  );

  return {
    Drawer: MockDrawer,
  };
});

describe('Drawer Components', () => {
  describe('Drawer', () => {
    it('should render drawer root', () => {
      render(
        <Drawer>
          <DrawerTrigger>Open</DrawerTrigger>
        </Drawer>
      );
      expect(screen.getByTestId('drawer-primitive-root')).toBeInTheDocument();
      expect(
        screen.getByTestId('drawer-primitive-trigger')
      ).toBeInTheDocument();
    });
  });

  describe('DrawerTrigger', () => {
    it('should render drawer trigger', () => {
      render(
        <Drawer>
          <DrawerTrigger data-testid="trigger">Open Drawer</DrawerTrigger>
        </Drawer>
      );
      expect(screen.getByText('Open Drawer')).toBeInTheDocument();
    });
  });

  describe('DrawerContent', () => {
    it('should render drawer content', () => {
      render(
        <Drawer>
          <DrawerContent>
            <div>Drawer Content</div>
          </DrawerContent>
        </Drawer>
      );
      expect(
        screen.getByTestId('drawer-primitive-content')
      ).toBeInTheDocument();
      expect(screen.getByText('Drawer Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Drawer>
          <DrawerContent className="custom-content">Content</DrawerContent>
        </Drawer>
      );
      const content = screen.getByTestId('drawer-primitive-content');
      expect(content).toHaveClass('custom-content');
    });
  });

  describe('DrawerHeader', () => {
    it('should render drawer header', () => {
      render(
        <DrawerHeader data-testid="drawer-header">
          <div>Header Content</div>
        </DrawerHeader>
      );
      expect(screen.getByTestId('drawer-header')).toBeInTheDocument();
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <DrawerHeader className="custom-header" data-testid="drawer-header">
          Header
        </DrawerHeader>
      );
      const header = screen.getByTestId('drawer-header');
      expect(header).toHaveClass('custom-header');
    });
  });

  describe('DrawerFooter', () => {
    it('should render drawer footer', () => {
      render(
        <DrawerFooter data-testid="drawer-footer">
          <div>Footer Content</div>
        </DrawerFooter>
      );
      expect(screen.getByTestId('drawer-footer')).toBeInTheDocument();
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <DrawerFooter className="custom-footer" data-testid="drawer-footer">
          Footer
        </DrawerFooter>
      );
      const footer = screen.getByTestId('drawer-footer');
      expect(footer).toHaveClass('custom-footer');
    });
  });

  describe('DrawerTitle', () => {
    it('should render drawer title', () => {
      render(
        <Drawer>
          <DrawerContent>
            <DrawerTitle>Drawer Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      );
      expect(screen.getByTestId('drawer-primitive-title')).toBeInTheDocument();
      expect(screen.getByText('Drawer Title')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Drawer>
          <DrawerContent>
            <DrawerTitle className="custom-title">Title</DrawerTitle>
          </DrawerContent>
        </Drawer>
      );
      const title = screen.getByTestId('drawer-primitive-title');
      expect(title).toHaveClass('custom-title');
    });
  });

  describe('DrawerDescription', () => {
    it('should render drawer description', () => {
      render(
        <Drawer>
          <DrawerContent>
            <DrawerDescription>Drawer Description</DrawerDescription>
          </DrawerContent>
        </Drawer>
      );
      expect(
        screen.getByTestId('drawer-primitive-description')
      ).toBeInTheDocument();
      expect(screen.getByText('Drawer Description')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Drawer>
          <DrawerContent>
            <DrawerDescription className="custom-description">
              Description
            </DrawerDescription>
          </DrawerContent>
        </Drawer>
      );
      const description = screen.getByTestId('drawer-primitive-description');
      expect(description).toHaveClass('custom-description');
    });
  });

  describe('Complete Drawer Structure', () => {
    it('should render complete drawer with all components', () => {
      render(
        <Drawer>
          <DrawerTrigger>Open Complete Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Complete Drawer Title</DrawerTitle>
              <DrawerDescription>
                This is a complete drawer example
              </DrawerDescription>
            </DrawerHeader>
            <div>Main content here</div>
            <DrawerFooter>
              <button>Cancel</button>
              <button>Save</button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );

      expect(screen.getByText('Open Complete Drawer')).toBeInTheDocument();
      expect(screen.getByText('Complete Drawer Title')).toBeInTheDocument();
      expect(
        screen.getByText('This is a complete drawer example')
      ).toBeInTheDocument();
      expect(screen.getByText('Main content here')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
    });
  });
});
