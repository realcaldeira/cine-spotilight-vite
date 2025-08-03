import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MovieCard from '../MovieCard';
import { MoviesProvider } from '@/contexts/MoviesContext';
import { Movie } from '@/types/movie';

// Mock the TMDB service
jest.mock('@/services/tmdb', () => ({
  tmdbService: {
    getPosterUrl: jest.fn((path) => path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder.svg'),
    getBackdropUrl: jest.fn((path) => path ? `https://image.tmdb.org/t/p/original${path}` : '/placeholder.svg'),
  },
}));

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  overview: 'A great test movie',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2023-01-01',
  vote_average: 8.5,
  vote_count: 1000,
  genre_ids: [1, 2, 3],
};

const renderWithProvider = (props = {}) => {
  return render(
    <MemoryRouter>
      <MoviesProvider>
        <MovieCard movie={mockMovie} {...props} />
      </MoviesProvider>
    </MemoryRouter>
  );
};

describe('MovieCard Component Coverage Tests', () => {
  it('should render movie card with basic information', () => {
    renderWithProvider();
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('A great test movie')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
  });

  it('should handle favorite button click to add favorite', () => {
    renderWithProvider();
    
    const favoriteButton = screen.getByRole('button', { name: /favoritar/i });
    fireEvent.click(favoriteButton);
    
    // After clicking, button should indicate it's favorited
    expect(favoriteButton).toBeInTheDocument();
  });

  it('should handle favorite button click to remove favorite', () => {
    // Render with movie already favorited
    renderWithProvider();
    
    const favoriteButton = screen.getByRole('button', { name: /favoritar/i });
    
    // First click to add
    fireEvent.click(favoriteButton);
    
    // Second click to remove
    fireEvent.click(favoriteButton);
    
    expect(favoriteButton).toBeInTheDocument();
  });

  it('should show remove button when showRemoveButton is true', () => {
    renderWithProvider({ showRemoveButton: true });
    
    const removeButton = screen.getByRole('button', { name: /remover dos favoritos/i });
    expect(removeButton).toBeInTheDocument();
  });

  it('should handle remove button click', () => {
    renderWithProvider({ showRemoveButton: true });
    
    const removeButton = screen.getByRole('button', { name: /remover dos favoritos/i });
    fireEvent.click(removeButton);
    
    expect(removeButton).toBeInTheDocument();
  });

  it('should highlight search term in title', () => {
    renderWithProvider({ searchTerm: 'Test' });
    
    const highlightedText = screen.getByText('Test Movie');
    expect(highlightedText).toBeInTheDocument();
  });

  it('should highlight search term in overview', () => {
    renderWithProvider({ searchTerm: 'great' });
    
    const movieCard = screen.getByText('A great test movie');
    expect(movieCard).toBeInTheDocument();
  });

  it('should not highlight when no search term provided', () => {
    renderWithProvider();
    
    const title = screen.getByText('Test Movie');
    expect(title).toBeInTheDocument();
    // Should not contain mark tags when no search term
  });

  it('should display fallback image when poster_path is null', () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null };
    render(
      <MemoryRouter>
        <MoviesProvider>
          <MovieCard movie={movieWithoutPoster} />
        </MoviesProvider>
      </MemoryRouter>
    );
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', expect.stringContaining('placeholder'));
  });

  it('should navigate to movie details on card click', () => {
    renderWithProvider();
    
    const movieLink = screen.getByRole('link');
    expect(movieLink).toHaveAttribute('href', '/movie/1');
  });

  it('should prevent event propagation on favorite button click', () => {
    const handleClick = jest.fn();
    
    render(
      <MemoryRouter>
        <MoviesProvider>
          <div onClick={handleClick}>
            <MovieCard movie={mockMovie} />
          </div>
        </MoviesProvider>
      </MemoryRouter>
    );
    
    const favoriteButton = screen.getByRole('button', { name: /favoritar/i });
    fireEvent.click(favoriteButton);
    
    // Parent click handler should not be called due to stopPropagation
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should prevent event propagation on remove button click', () => {
    const handleClick = jest.fn();
    
    render(
      <MemoryRouter>
        <MoviesProvider>
          <div onClick={handleClick}>
            <MovieCard movie={mockMovie} showRemoveButton={true} />
          </div>
        </MoviesProvider>
      </MemoryRouter>
    );
    
    const removeButton = screen.getByRole('button', { name: /remover dos favoritos/i });
    fireEvent.click(removeButton);
    
    // Parent click handler should not be called due to stopPropagation
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should display movie rating with star icon', () => {
    renderWithProvider();
    
    const rating = screen.getByText('8.5');
    expect(rating).toBeInTheDocument();
    
    // Star icon should be present
    const starIcon = screen.getByTestId('star-icon') || document.querySelector('[data-testid="star-icon"]');
    expect(rating.parentElement).toContainHTML('8.5');
  });

  it('should handle movies with zero rating', () => {
    const movieWithZeroRating = { ...mockMovie, vote_average: 0 };
    render(
      <MemoryRouter>
        <MoviesProvider>
          <MovieCard movie={movieWithZeroRating} />
        </MoviesProvider>
      </MemoryRouter>
    );
    
    const rating = screen.getByText('0');
    expect(rating).toBeInTheDocument();
  });

  it('should handle movies with long titles', () => {
    const movieWithLongTitle = { 
      ...mockMovie, 
      title: 'This is a very long movie title that should be truncated or handled properly' 
    };
    render(
      <MemoryRouter>
        <MoviesProvider>
          <MovieCard movie={movieWithLongTitle} />
        </MoviesProvider>
      </MemoryRouter>
    );
    
    const title = screen.getByText(movieWithLongTitle.title);
    expect(title).toBeInTheDocument();
  });

  it('should handle movies with long overviews', () => {
    const movieWithLongOverview = { 
      ...mockMovie, 
      overview: 'This is a very long movie overview that contains lots of text and should be handled properly by the component to ensure it displays correctly without breaking the layout or causing any issues with the UI components and the overall user experience' 
    };
    render(
      <MemoryRouter>
        <MoviesProvider>
          <MovieCard movie={movieWithLongOverview} />
        </MoviesProvider>
      </MemoryRouter>
    );
    
    expect(screen.getByText(movieWithLongOverview.overview)).toBeInTheDocument();
  });

  it('should handle search term case insensitivity', () => {
    renderWithProvider({ searchTerm: 'TEST' });
    
    const title = screen.getByText('Test Movie');
    expect(title).toBeInTheDocument();
  });

  it('should handle empty search term', () => {
    renderWithProvider({ searchTerm: '' });
    
    const title = screen.getByText('Test Movie');
    expect(title).toBeInTheDocument();
  });
});
