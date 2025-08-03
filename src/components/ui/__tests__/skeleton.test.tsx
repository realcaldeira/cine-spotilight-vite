import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Skeleton } from '../skeleton';

describe('Skeleton Component', () => {
  test('renders skeleton with default styling', () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('animate-pulse');
  });

  test('applies custom className', () => {
    render(
      <Skeleton className="custom-skeleton h-4 w-full" data-testid="skeleton" />
    );

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('custom-skeleton');
    expect(skeleton).toHaveClass('h-4');
    expect(skeleton).toHaveClass('w-full');
  });

  test('renders with custom dimensions', () => {
    render(<Skeleton className="h-8 w-32" data-testid="skeleton" />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('h-8');
    expect(skeleton).toHaveClass('w-32');
  });

  test('renders multiple skeletons for loading state', () => {
    render(
      <div>
        <Skeleton className="h-4 w-full mb-2" data-testid="skeleton-1" />
        <Skeleton className="h-4 w-3/4 mb-2" data-testid="skeleton-2" />
        <Skeleton className="h-4 w-1/2" data-testid="skeleton-3" />
      </div>
    );

    expect(screen.getByTestId('skeleton-1')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-2')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-3')).toBeInTheDocument();
  });

  test('can be used for different shapes', () => {
    render(
      <div>
        <Skeleton
          className="h-12 w-12 rounded-full"
          data-testid="avatar-skeleton"
        />
        <Skeleton className="h-4 w-full" data-testid="text-skeleton" />
        <Skeleton
          className="h-32 w-full rounded-md"
          data-testid="image-skeleton"
        />
      </div>
    );

    expect(screen.getByTestId('avatar-skeleton')).toHaveClass('rounded-full');
    expect(screen.getByTestId('text-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('image-skeleton')).toHaveClass('rounded-md');
  });
});
