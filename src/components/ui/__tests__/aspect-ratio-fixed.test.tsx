import { render, screen } from '@testing-library/react';
import { AspectRatio } from '../aspect-ratio';

describe('AspectRatio', () => {
  it('should render aspect ratio component', () => {
    render(
      <AspectRatio ratio={16 / 9} data-testid="aspect-ratio">
        <div>Content</div>
      </AspectRatio>
    );
    expect(screen.getByTestId('aspect-ratio')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should apply correct aspect ratio styles', () => {
    render(
      <AspectRatio ratio={16 / 9} data-testid="aspect-ratio">
        <div>Content</div>
      </AspectRatio>
    );
    const aspectRatio = screen.getByTestId('aspect-ratio');
    expect(aspectRatio).toBeInTheDocument();
    expect(aspectRatio).toHaveStyle('position: absolute');
  });

  it('should apply custom className', () => {
    render(
      <AspectRatio
        ratio={16 / 9}
        className="custom-aspect"
        data-testid="aspect-ratio">
        <div>Content</div>
      </AspectRatio>
    );
    const aspectRatio = screen.getByTestId('aspect-ratio');
    expect(aspectRatio).toHaveClass('custom-aspect');
  });

  it('should handle different ratios', () => {
    const { rerender } = render(
      <AspectRatio ratio={1} data-testid="aspect-ratio">
        <div>Square</div>
      </AspectRatio>
    );
    expect(screen.getByTestId('aspect-ratio')).toBeInTheDocument();

    rerender(
      <AspectRatio ratio={21 / 9} data-testid="aspect-ratio">
        <div>Ultrawide</div>
      </AspectRatio>
    );
    expect(screen.getByText('Ultrawide')).toBeInTheDocument();
  });

  it('should pass through additional props', () => {
    render(
      <AspectRatio ratio={4 / 3} data-testid="aspect-ratio" id="aspect-test">
        <div>Content</div>
      </AspectRatio>
    );
    const aspectRatio = screen.getByTestId('aspect-ratio');
    expect(aspectRatio).toHaveAttribute('id', 'aspect-test');
  });
});
