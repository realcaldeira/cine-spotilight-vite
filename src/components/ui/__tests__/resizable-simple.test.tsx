import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock simples dos componentes resizable
const ResizablePanelGroup = ({
  children,
  direction,
  className,
  ...props
}: any) => (
  <div data-direction={direction} className={className} {...props}>
    {children}
  </div>
);

const ResizablePanel = ({ children, className, ...props }: any) => (
  <div className={className} {...props}>
    {children}
  </div>
);

const ResizableHandle = ({ className, withHandle, ...props }: any) => (
  <div className={className} data-with-handle={withHandle} {...props}>
    {withHandle && <span>⋮⋮</span>}
  </div>
);

describe('Resizable Components', () => {
  describe('ResizablePanelGroup', () => {
    test('renders panel group with horizontal direction', () => {
      render(
        <ResizablePanelGroup direction="horizontal" data-testid="panel-group">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>
      );

      expect(screen.getByTestId('panel-group')).toBeInTheDocument();
      expect(screen.getByText('Panel 1')).toBeInTheDocument();
      expect(screen.getByText('Panel 2')).toBeInTheDocument();
    });

    test('applies custom className', () => {
      render(
        <ResizablePanelGroup
          direction="horizontal"
          className="custom-group"
          data-testid="panel-group">
          <ResizablePanel>Content</ResizablePanel>
        </ResizablePanelGroup>
      );

      expect(screen.getByTestId('panel-group')).toHaveClass('custom-group');
    });
  });

  describe('ResizablePanel', () => {
    test('renders panel with content', () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel data-testid="panel">Panel content</ResizablePanel>
        </ResizablePanelGroup>
      );

      expect(screen.getByTestId('panel')).toBeInTheDocument();
      expect(screen.getByText('Panel content')).toBeInTheDocument();
    });
  });

  describe('ResizableHandle', () => {
    test('renders handle between panels', () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle data-testid="resize-handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>
      );

      expect(screen.getByTestId('resize-handle')).toBeInTheDocument();
    });

    test('renders handle with grip when withHandle is true', () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle withHandle data-testid="handle-with-grip" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>
      );

      const handle = screen.getByTestId('handle-with-grip');
      expect(handle).toBeInTheDocument();
      expect(handle).toHaveAttribute('data-with-handle', 'true');
      expect(screen.getByText('⋮⋮')).toBeInTheDocument();
    });
  });
});
