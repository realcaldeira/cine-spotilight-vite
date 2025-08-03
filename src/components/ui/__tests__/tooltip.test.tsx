import { render, screen } from '@testing-library/react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../tooltip';

describe('Tooltip Components', () => {
  describe('TooltipProvider', () => {
    it('should render tooltip provider', () => {
      render(
        <TooltipProvider>
          <div data-testid="provider-content">Content</div>
        </TooltipProvider>
      );
      expect(screen.getByTestId('provider-content')).toBeInTheDocument();
    });

    it('should handle delayDuration prop', () => {
      render(
        <TooltipProvider delayDuration={500}>
          <div data-testid="provider-content">Content</div>
        </TooltipProvider>
      );
      expect(screen.getByTestId('provider-content')).toBeInTheDocument();
    });

    it('should handle skipDelayDuration prop', () => {
      render(
        <TooltipProvider skipDelayDuration={200}>
          <div data-testid="provider-content">Content</div>
        </TooltipProvider>
      );
      expect(screen.getByTestId('provider-content')).toBeInTheDocument();
    });

    it('should handle disableHoverableContent prop', () => {
      render(
        <TooltipProvider disableHoverableContent>
          <div data-testid="provider-content">Content</div>
        </TooltipProvider>
      );
      expect(screen.getByTestId('provider-content')).toBeInTheDocument();
    });
  });

  describe('Tooltip', () => {
    it('should render tooltip root', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger data-testid="trigger">Trigger</TooltipTrigger>
            <TooltipContent data-testid="content">Content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
    });

    it('should handle open state', () => {
      render(
        <TooltipProvider>
          <Tooltip open={true}>
            <TooltipTrigger data-testid="trigger">Open Trigger</TooltipTrigger>
            <TooltipContent data-testid="content">Open Content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
    });

    it('should handle defaultOpen state', () => {
      render(
        <TooltipProvider>
          <Tooltip defaultOpen={true}>
            <TooltipTrigger data-testid="trigger">Default Open</TooltipTrigger>
            <TooltipContent data-testid="content">
              Default Content
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
    });
  });

  describe('TooltipTrigger', () => {
    it('should render tooltip trigger', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger data-testid="trigger">Hover me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('should handle asChild prop', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button data-testid="custom-trigger">Custom Button</button>
            </TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      expect(screen.getByTestId('custom-trigger')).toBeInTheDocument();
      expect(screen.getByText('Custom Button')).toBeInTheDocument();
    });
  });

  describe('TooltipContent', () => {
    it('should render tooltip content', () => {
      render(
        <TooltipProvider>
          <Tooltip open={true}>
            <TooltipTrigger>Trigger</TooltipTrigger>
            <TooltipContent data-testid="content">
              Tooltip content here
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getAllByText('Tooltip content here')).toHaveLength(2); // Aceita múltiplas ocorrências
    });

    it('should apply custom className', () => {
      render(
        <TooltipProvider>
          <Tooltip open={true}>
            <TooltipTrigger>Trigger</TooltipTrigger>
            <TooltipContent className="custom-tooltip" data-testid="content">
              Custom styled tooltip
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      const content = screen.getByTestId('content');
      expect(content).toHaveClass('custom-tooltip');
    });

    it('should handle sideOffset prop', () => {
      render(
        <TooltipProvider>
          <Tooltip open={true}>
            <TooltipTrigger>Trigger</TooltipTrigger>
            <TooltipContent sideOffset={10} data-testid="content">
              Offset tooltip
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });

  describe('Complete Tooltip Structure', () => {
    it('should render complete tooltip with all components', () => {
      render(
        <TooltipProvider>
          <Tooltip open={true}>
            <TooltipTrigger data-testid="complete-trigger">
              Help Icon
            </TooltipTrigger>
            <TooltipContent data-testid="complete-content">
              <p>
                This is a helpful tooltip that provides additional information.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.getByTestId('complete-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('complete-content')).toBeInTheDocument();
      expect(screen.getByText('Help Icon')).toBeInTheDocument();
      expect(
        screen.getAllByText(
          'This is a helpful tooltip that provides additional information.'
        )
      ).toHaveLength(2); // Aceita múltiplas ocorrências
    });

    it('should handle multiple tooltips', () => {
      render(
        <TooltipProvider>
          <div>
            <Tooltip open={true}>
              <TooltipTrigger data-testid="trigger1">
                First Trigger
              </TooltipTrigger>
              <TooltipContent data-testid="content1">
                First Tooltip
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger data-testid="trigger2">
                Second Trigger
              </TooltipTrigger>
              <TooltipContent data-testid="content2">
                Second Tooltip
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      );

      expect(screen.getByTestId('trigger1')).toBeInTheDocument();
      expect(screen.getByTestId('trigger2')).toBeInTheDocument();
      expect(screen.getByTestId('content1')).toBeInTheDocument();
      expect(screen.getByText('First Trigger')).toBeInTheDocument();
      expect(screen.getByText('Second Trigger')).toBeInTheDocument();
      expect(screen.getAllByText('First Tooltip')).toHaveLength(2); // Aceita múltiplas ocorrências
    });
  });
});
