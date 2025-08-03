import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MoviesProvider, useMovies } from '../MoviesContext';
import { Movie } from '../../types/movie';

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  overview: 'Test overview',
  poster_path: '/test.jpg',
  backdrop_path: '/backdrop.jpg',
  release_date: '2024-01-01',
  vote_average: 8.5,
  genre_ids: [28, 12],
  vote_count: 1000,
};

const mockMovie2: Movie = {
  id: 2,
  title: 'Test Movie 2',
  overview: 'Test overview 2',
  poster_path: '/test2.jpg',
  backdrop_path: '/backdrop2.jpg',
  release_date: '2024-02-01',
  vote_average: 7.5,
  genre_ids: [35, 18],
  vote_count: 800,
};

// Test component that uses the context
const TestComponent = () => {
  const { state, addFavorite, removeFavorite, addSearchTerm, isFavorite } =
    useMovies();

  return (
    <div>
      <div data-testid="favorites-count">{state.favorites.length}</div>
      <div data-testid="search-history-count">{state.searchHistory.length}</div>
      <div data-testid="is-favorite-1">{isFavorite(1) ? 'true' : 'false'}</div>
      <div data-testid="is-favorite-2">{isFavorite(2) ? 'true' : 'false'}</div>

      <button
        onClick={() => addFavorite(mockMovie)}
        data-testid="add-favorite-1">
        Add Movie 1
      </button>

      <button
        onClick={() => addFavorite(mockMovie2)}
        data-testid="add-favorite-2">
        Add Movie 2
      </button>

      <button onClick={() => removeFavorite(1)} data-testid="remove-favorite-1">
        Remove Movie 1
      </button>

      <button onClick={() => removeFavorite(2)} data-testid="remove-favorite-2">
        Remove Movie 2
      </button>

      <button
        onClick={() => addSearchTerm('test search')}
        data-testid="add-search">
        Add Search
      </button>

      <button
        onClick={() => addSearchTerm('another search')}
        data-testid="add-another-search">
        Add Another Search
      </button>

      <div data-testid="favorites-list">
        {state.favorites.map((movie) => (
          <div key={movie.id} data-testid={`favorite-movie-${movie.id}`}>
            {movie.title}
          </div>
        ))}
      </div>

      <div data-testid="search-history-list">
        {state.searchHistory.map((term, index) => (
          <div key={index} data-testid={`search-term-${index}`}>
            {term}
          </div>
        ))}
      </div>
    </div>
  );
};

const ContextWrapper = ({ children }: { children: React.ReactNode }) => (
  <MoviesProvider>{children}</MoviesProvider>
);

describe('MoviesContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should provide initial state with empty favorites and search history', () => {
    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );

    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
    expect(screen.getByTestId('search-history-count')).toHaveTextContent('0');
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('false');
    expect(screen.getByTestId('is-favorite-2')).toHaveTextContent('false');
  });

  it('should add movie to favorites', async () => {
    const user = userEvent.setup();

    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );

    await user.click(screen.getByTestId('add-favorite-1'));

    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true');
    expect(screen.getByTestId('favorite-movie-1')).toHaveTextContent(
      'Test Movie'
    );
  });

  it('should add multiple movies to favorites', async () => {
    const user = userEvent.setup();

    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );

    await user.click(screen.getByTestId('add-favorite-1'));
    await user.click(screen.getByTestId('add-favorite-2'));

    expect(screen.getByTestId('favorites-count')).toHaveTextContent('2');
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true');
    expect(screen.getByTestId('is-favorite-2')).toHaveTextContent('true');
    expect(screen.getByTestId('favorite-movie-1')).toHaveTextContent(
      'Test Movie'
    );
    expect(screen.getByTestId('favorite-movie-2')).toHaveTextContent(
      'Test Movie 2'
    );
  });

  it('should not add duplicate movies to favorites', async () => {
    const user = userEvent.setup();

    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );

    await user.click(screen.getByTestId('add-favorite-1'));
    await user.click(screen.getByTestId('add-favorite-1'));

    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true');
  });

  it('should remove movie from favorites', async () => {
    const user = userEvent.setup();

    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );

    // First add a movie
    await user.click(screen.getByTestId('add-favorite-1'));
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');

    // Then remove it
    await user.click(screen.getByTestId('remove-favorite-1'));
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('false');
  });

  it('should handle removing non-existent movie from favorites', async () => {
    const user = userEvent.setup();

    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );

    // Try to remove a movie that doesn't exist
    await user.click(screen.getByTestId('remove-favorite-1'));
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
  });

  it('should add search terms to history', async () => {
    const user = userEvent.setup();

    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );

    await user.click(screen.getByTestId('add-search'));

    expect(screen.getByTestId('search-history-count')).toHaveTextContent('1');
    expect(screen.getByTestId('search-term-0')).toHaveTextContent(
      'test search'
    );
  });

  it('should add multiple search terms to history', async () => {
    const user = userEvent.setup();

    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );

    await user.click(screen.getByTestId('add-search'));
    await user.click(screen.getByTestId('add-another-search'));

    expect(screen.getByTestId('search-history-count')).toHaveTextContent('2');
    // The most recent search term is at index 0 (newer items are prepended)
    expect(screen.getByTestId('search-term-0')).toHaveTextContent(
      'another search'
    );
    expect(screen.getByTestId('search-term-1')).toHaveTextContent(
      'test search'
    );
  });

  it('should handle localStorage interactions', async () => {
    const user = userEvent.setup();

    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );

    await user.click(screen.getByTestId('add-favorite-1'));

    // Check that the favorite was added to state
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('true');
  });

  it('should handle initial loading gracefully', () => {
    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );

    // Should start with empty state
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
    expect(screen.getByTestId('search-history-count')).toHaveTextContent('0');
  });

  it('should handle invalid localStorage data gracefully', () => {
    // Set invalid JSON in localStorage
    localStorage.setItem('netflix-favorites', 'invalid json');

    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );

    // Should fall back to empty arrays
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
    expect(screen.getByTestId('search-history-count')).toHaveTextContent('0');
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useMovies must be used within a MoviesProvider');

    // Restore console.error
    console.error = originalError;
  });

  it('should maintain consistent state across multiple operations', async () => {
    const user = userEvent.setup();

    render(
      <ContextWrapper>
        <TestComponent />
      </ContextWrapper>
    );

    // Add movies to favorites
    await user.click(screen.getByTestId('add-favorite-1'));
    await user.click(screen.getByTestId('add-favorite-2'));

    // Add search terms
    await user.click(screen.getByTestId('add-search'));
    await user.click(screen.getByTestId('add-another-search'));

    // Remove one favorite
    await user.click(screen.getByTestId('remove-favorite-1'));

    // Verify final state
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
    expect(screen.getByTestId('search-history-count')).toHaveTextContent('2');
    expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('false');
    expect(screen.getByTestId('is-favorite-2')).toHaveTextContent('true');
    expect(screen.getByTestId('favorite-movie-2')).toHaveTextContent(
      'Test Movie 2'
    );
  });
});
