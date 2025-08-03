import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';
import EmptyState from '@/components/EmptyState';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('EmptyState', () => {
  it('should render with favorites type', () => {
    render(
      <EmptyState
        type="favorites"
        title="No favorites"
        description="Add some movies to favorites"
      />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('No favorites')).toBeInTheDocument();
    expect(
      screen.getByText('Add some movies to favorites')
    ).toBeInTheDocument();
  });

  it('should render with search type', () => {
    render(
      <EmptyState
        type="search"
        title="No results"
        description="Try a different search term"
      />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('No results')).toBeInTheDocument();
    expect(screen.getByText('Try a different search term')).toBeInTheDocument();
  });

  it('should render with general type', () => {
    render(
      <EmptyState
        type="general"
        title="Nothing here"
        description="General empty state"
      />,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.getByText('General empty state')).toBeInTheDocument();
  });

  it('should render action button when provided', () => {
    render(
      <EmptyState
        type="favorites"
        title="No favorites"
        description="Add some movies"
        actionText="Browse movies"
        actionLink="/movies"
      />,
      { wrapper: TestWrapper }
    );

    const actionButton = screen.getByRole('link', { name: 'Browse movies' });
    expect(actionButton).toBeInTheDocument();
    expect(actionButton).toHaveAttribute('href', '/movies');
  });

  it('should not render action button when not provided', () => {
    render(
      <EmptyState
        type="favorites"
        title="No favorites"
        description="Add some movies"
      />,
      { wrapper: TestWrapper }
    );

    const actionButton = screen.queryByRole('link');
    expect(actionButton).not.toBeInTheDocument();
  });

  it('should have correct styling structure', () => {
    const { container } = render(
      <EmptyState
        type="favorites"
        title="Test"
        description="Test description"
      />,
      { wrapper: TestWrapper }
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center'
    );
  });
});
