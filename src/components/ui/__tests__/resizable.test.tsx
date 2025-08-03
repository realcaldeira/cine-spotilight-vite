import { render, screen } from '@testing-library/react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../resizable';

describe('Resizable Components', () => {
  describe('ResizablePanelGroup', () => {
    it('renders a resizable panel group', () => {
      render(
        <ResizablePanelGroup
          direction="horizontal"
          data-testid="resizable-group">
          <ResizablePanel data-testid="panel-1">Panel 1</ResizablePanel>
          <ResizableHandle data-testid="resizable-handle" />
          <ResizablePanel data-testid="panel-2">Panel 2</ResizablePanel>
        </ResizablePanelGroup>
      );

      expect(screen.getByTestId('resizable-group')).toBeInTheDocument();
      expect(screen.getByTestId('panel-1')).toBeInTheDocument();
      expect(screen.getByTestId('panel-2')).toBeInTheDocument();
      expect(screen.getByTestId('resizable-handle')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <ResizablePanelGroup
          direction="vertical"
          className="custom-group"
          data-testid="resizable-group">
          <ResizablePanel>Panel</ResizablePanel>
        </ResizablePanelGroup>
      );

      const group = screen.getByTestId('resizable-group');
      expect(group).toHaveClass('custom-group');
    });
  });

  describe('ResizablePanel', () => {
    it('renders with custom props', () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            className="custom-panel"
            data-testid="panel"
            defaultSize={30}>
            Panel Content
          </ResizablePanel>
        </ResizablePanelGroup>
      );

      const panel = screen.getByTestId('panel');
      expect(panel).toBeInTheDocument();
      expect(panel).toHaveClass('custom-panel');
      expect(screen.getByText('Panel Content')).toBeInTheDocument();
    });
  });

  describe('ResizableHandle', () => {
    it('renders handle with icon', () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle withHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>
      );

      const handle = screen.getByTestId('handle');
      expect(handle).toBeInTheDocument();
    });

    it('renders handle without icon', () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>
      );

      const handle = screen.getByTestId('handle');
      expect(handle).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>Panel 1</ResizablePanel>
          <ResizableHandle className="custom-handle" data-testid="handle" />
          <ResizablePanel>Panel 2</ResizablePanel>
        </ResizablePanelGroup>
      );

      const handle = screen.getByTestId('handle');
      expect(handle).toHaveClass('custom-handle');
    });
  });
});
