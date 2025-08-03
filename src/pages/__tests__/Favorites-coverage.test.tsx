import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Favorites from '../Favorites';
import { MoviesProvider } from '@/contexts/MoviesContext';
import { Movie } from '@/types/movie';

// Mock the TMDB service
jest.mock('@/services/tmdb', () => ({
  tmdbService: {
    getPosterUrl: jest.fn((path) => path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder.svg'),
    getBackdropUrl: jest.fn((path) => path ? `https://image.tmdb.org/t/p/original${path}` : '/placeholder.svg'),
  },
}));

const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Favorite Movie 1',
    overview: 'A great favorite movie',
    poster_path: '/poster1.jpg',
    backdrop_path: '/backdrop1.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    genre_ids: [1, 2],
  },
  {
    id: 2,
    title: 'Favorite Movie 2',
    overview: 'Another favorite movie',
    poster_path: '/poster2.jpg',
    backdrop_path: '/backdrop2.jpg',
    release_date: '2023-02-01',
    vote_average: 9.0,
    vote_count: 1500,
    genre_ids: [3, 4],
  },
];

// Mock the MoviesContext to provide controlled state
const MockMoviesProvider = ({ children, favorites = [] }: { children: React.ReactNode; favorites?: Movie[] }) => {
  const mockContextValue = {
    movies: [],
    favorites,
    searchTerm: '',
    isLoading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    searchMovies: jest.fn(),
    loadMoreMovies: jest.fn(),
    addToFavorites: jest.fn(),
    removeFromFavorites: jest.fn(),
    isFavorite: jest.fn((id: number) => favorites.some(movie => movie.id === id)),
    clearSearch: jest.fn(),
  };

  return (
    <MoviesProvider>
      {React.cloneElement(children as React.ReactElement, { context: mockContextValue })}
    </MoviesProvider>
  );
};

describe('Favorites Component Coverage Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render page title', () => {
    render(
      <MemoryRouter>
        <MockMoviesProvider>
          <Favorites />
        </MockMoviesProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Meus Favoritos')).toBeInTheDocument();
  });

  it('should display empty state when no favorites', () => {
    render(
      <MemoryRouter>
        <MockMoviesProvider favorites={[]}>
          <Favorites />
        </MockMoviesProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Nenhum filme favoritado')).toBeInTheDocument();
    expect(screen.getByText('Você ainda não favoritou nenhum filme. Explore nossa coleção e adicione seus filmes favoritos!')).toBeInTheDocument();
  });

  it('should display favorite movies when available', () => {
    render(
      <MemoryRouter>
        <MockMoviesProvider favorites={mockMovies}>
          <Favorites />
        </MockMoviesProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Favorite Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Favorite Movie 2')).toBeInTheDocument();
  });

  it('should show movie cards with remove buttons', () => {
    render(
      <MemoryRouter>
        <MockMoviesProvider favorites={mockMovies}>
          <Favorites />
        </MockMoviesProvider>
      </MemoryRouter>
    );

    const removeButtons = screen.getAllByRole('button', { name: /remover dos favoritos/i });
    expect(removeButtons).toHaveLength(2);
  });

  it('should handle single favorite movie', () => {
    render(
      <MemoryRouter>
        <MockMoviesProvider favorites={[mockMovies[0]]}>
          <Favorites />
        </MockMoviesProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Favorite Movie 1')).toBeInTheDocument();
    expect(screen.queryByText('Favorite Movie 2')).not.toBeInTheDocument();
  });

  it('should display correct movie count', () => {
    render(
      <MemoryRouter>
        <MockMoviesProvider favorites={mockMovies}>
          <Favorites />
        </MockMoviesProvider>
      </MemoryRouter>
    );

    // Should show 2 movie cards
    const movieCards = screen.getAllByRole('link');
    expect(movieCards).toHaveLength(mockMovies.length);
  });

  it('should handle movies with different ratings', () => {
    const moviesWithDifferentRatings = [
      { ...mockMovies[0], vote_average: 0 },
      { ...mockMovies[1], vote_average: 10 },
    ];

    render(
      <MemoryRouter>
        <MockMoviesProvider favorites={moviesWithDifferentRatings}>
          <Favorites />
        </MockMoviesProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should handle movies without poster images', () => {
    const moviesWithoutPosters = [
      { ...mockMovies[0], poster_path: null },
      { ...mockMovies[1], poster_path: '' },
    ];

    render(
      <MemoryRouter>
        <MockMoviesProvider favorites={moviesWithoutPosters}>
          <Favorites />
        </MockMoviesProvider>
      </MemoryRouter>
    );

    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('src', expect.stringContaining('placeholder'));
    });
  });

  it('should navigate to movie details when clicking on movie card', () => {
    render(
      <MemoryRouter>
        <MockMoviesProvider favorites={[mockMovies[0]]}>
          <Favorites />
        </MockMoviesProvider>
      </MemoryRouter>
    );

    const movieLink = screen.getByRole('link');
    expect(movieLink).toHaveAttribute('href', '/movie/1');
  });

  it('should handle empty overview text', () => {
    const movieWithEmptyOverview = { ...mockMovies[0], overview: '' };

    render(
      <MemoryRouter>
        <MockMoviesProvider favorites={[movieWithEmptyOverview]}>
          <Favorites />
        </MockMoviesProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Favorite Movie 1')).toBeInTheDocument();
  });

  it('should handle movies with long titles', () => {
    const movieWithLongTitle = { 
      ...mockMovies[0], 
      title: 'This is a very long movie title that might cause layout issues' 
    };

    render(
      <MemoryRouter>
        <MockMoviesProvider favorites={[movieWithLongTitle]}>
          <Favorites />
        </MockMoviesProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(movieWithLongTitle.title)).toBeInTheDocument();
  });

  it('should handle movies with special characters in title', () => {
    const movieWithSpecialChars = { 
      ...mockMovies[0], 
      title: 'Movie & Special Characters: "Quotes" (2023)' 
    };

    render(
      <MemoryRouter>
        <MockMoviesProvider favorites={[movieWithSpecialChars]}>
          <Favorites />
        </MockMoviesProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(movieWithSpecialChars.title)).toBeInTheDocument();
  });

  it('should maintain responsive grid layout', () => {
    render(
      <MemoryRouter>
        <MockMoviesProvider favorites={mockMovies}>
          <Favorites />
        </MockMoviesProvider>
      </MemoryRouter>
    );

    const gridContainer = screen.getByText('Favorite Movie 1').closest('[class*="grid"]');
    expect(gridContainer).toBeInTheDocument();
  });
});
