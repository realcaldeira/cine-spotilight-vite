
import { render } from '@testing-library/react';
import LoadingSpinner, { LoadingGrid, LoadingSection } from '@/components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render with default size', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('div[class*="animate-spin"]');
    expect(spinner).toHaveClass('h-8', 'w-8');
  });

  it('should render with small size', () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    
    const spinner = container.querySelector('div[class*="animate-spin"]');
    expect(spinner).toHaveClass('h-4', 'w-4');
  });

  it('should render with large size', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    
    const spinner = container.querySelector('div[class*="animate-spin"]');
    expect(spinner).toHaveClass('h-12', 'w-12');
  });

  it('should apply custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('LoadingGrid', () => {
  it('should render 12 skeleton items', () => {
    const { container } = render(<LoadingGrid />);
    
    const skeletonItems = container.querySelectorAll('div[class*="animate-pulse"]');
    expect(skeletonItems).toHaveLength(12);
  });

  it('should apply correct grid classes', () => {
    const { container } = render(<LoadingGrid />);
    
    const grid = container.firstChild;
    expect(grid).toHaveClass('grid', 'grid-cols-2', 'gap-4');
  });
});

describe('LoadingSection', () => {
  it('should render title skeleton and grid', () => {
    const { container } = render(<LoadingSection title="Test Title" />);
    
    // Should render title skeleton and grid skeletons
    const skeletonItems = container.querySelectorAll('div[class*="animate-pulse"]');
    expect(skeletonItems.length).toBeGreaterThan(12); // Title + 12 grid items
  });

  it('should have proper structure', () => {
    const { container } = render(<LoadingSection title="Test Title" />);
    
    const section = container.firstChild;
    expect(section).toHaveClass('space-y-4');
  });
});