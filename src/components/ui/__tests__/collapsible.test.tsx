import { render, screen } from '@testing-library/react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../collapsible';

describe('Collapsible Components', () => {
  describe('Collapsible', () => {
    it('should render collapsible root', () => {
      render(
        <Collapsible data-testid="collapsible">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      expect(screen.getByTestId('collapsible')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Collapsible className="custom-collapsible" data-testid="collapsible">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      const collapsible = screen.getByTestId('collapsible');
      expect(collapsible).toHaveClass('custom-collapsible');
    });

    it('should handle open state', () => {
      render(
        <Collapsible open={true} data-testid="collapsible">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      expect(screen.getByTestId('collapsible')).toHaveAttribute(
        'data-state',
        'open'
      );
    });

    it('should handle closed state', () => {
      render(
        <Collapsible open={false} data-testid="collapsible">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      expect(screen.getByTestId('collapsible')).toHaveAttribute(
        'data-state',
        'closed'
      );
    });
  });

  describe('CollapsibleTrigger', () => {
    it('should render collapsible trigger', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      expect(screen.getByText('Toggle')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger className="custom-trigger" data-testid="trigger">
            Toggle
          </CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveClass('custom-trigger');
    });
  });

  describe('CollapsibleContent', () => {
    it('should render collapsible content', () => {
      render(
        <Collapsible open={true}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent data-testid="content">
            <div>Collapsible content here</div>
          </CollapsibleContent>
        </Collapsible>
      );
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByText('Collapsible content here')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Collapsible open={true}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent className="custom-content" data-testid="content">
            Content
          </CollapsibleContent>
        </Collapsible>
      );
      const content = screen.getByTestId('content');
      expect(content).toHaveClass('custom-content');
    });
  });

  describe('Complete Collapsible Structure', () => {
    it('should render complete collapsible with all components', () => {
      render(
        <Collapsible data-testid="collapsible">
          <CollapsibleTrigger data-testid="trigger">
            Expand Section
          </CollapsibleTrigger>
          <CollapsibleContent data-testid="content">
            <div>This is the collapsible content that can be toggled.</div>
            <p>Multiple elements can be placed here.</p>
          </CollapsibleContent>
        </Collapsible>
      );

      expect(screen.getByTestId('collapsible')).toBeInTheDocument();
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      expect(screen.getByText('Expand Section')).toBeInTheDocument();

      // Content should be accessible regardless of state
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });
});
