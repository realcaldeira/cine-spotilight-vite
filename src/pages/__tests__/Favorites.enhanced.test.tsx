import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Favorites from '../Favorites';
import { Movie } from '@/types/movie';
import { useMovies } from '@/contexts/MoviesContext';

// Mock dos componentes
jest.mock('@/components/MovieCard', () => {
  return function MockMovieCard({
    movie,
    showRemoveButton,
  }: {
    movie: Movie;
    showRemoveButton?: boolean;
  }) {
    return (
      <div data-testid="movie-card">
        <h3>{movie.title}</h3>
        <span>Rating: {movie.vote_average ?? 'N/A'}</span>
        <span>Date: {movie.release_date}</span>
        {showRemoveButton && <button>Remove</button>}
      </div>
    );
  };
});

jest.mock('@/components/EmptyState', () => {
  return function MockEmptyState({
    type,
    title,
  }: {
    type: string;
    title: string;
  }) {
    return (
      <div data-testid="empty-state">
        <h2>{title}</h2>
        <span>Type: {type}</span>
      </div>
    );
  };
});

// Mock do contexto
jest.mock('@/contexts/MoviesContext', () => ({
  useMovies: jest.fn(),
  MoviesProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Movie A',
    vote_average: 8.5,
    release_date: '2023-01-15',
    poster_path: '/poster1.jpg',
    backdrop_path: '/backdrop1.jpg',
    overview: 'Overview A',
    genre_ids: [],
    vote_count: 1000,
  },
  {
    id: 2,
    title: 'Movie B',
    vote_average: 7.2,
    release_date: '2024-05-20',
    poster_path: '/poster2.jpg',
    backdrop_path: '/backdrop2.jpg',
    overview: 'Overview B',
    genre_ids: [],
    vote_count: 2000,
  },
  {
    id: 3,
    title: 'Movie C',
    vote_average: 9.1,
    release_date: '2022-12-01',
    poster_path: '/poster3.jpg',
    backdrop_path: '/backdrop3.jpg',
    overview: 'Overview C',
    genre_ids: [],
    vote_count: 3000,
  },
];

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Favorites', () => {
  const useMoviesMock = useMovies as jest.MockedFunction<typeof useMovies>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when no favorites', () => {
    useMoviesMock.mockReturnValue({
      state: {
        favorites: [],
        searchHistory: [],
      },
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(),
      addSearchTerm: jest.fn(),
    });

    render(
      <TestWrapper>
        <Favorites />
      </TestWrapper>
    );

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('Nenhum filme favorito')).toBeInTheDocument();
  });

  it('should render favorites list when has favorites', () => {
    useMoviesMock.mockReturnValue({
      state: {
        favorites: mockMovies,
        searchHistory: [],
      },
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(),
      addSearchTerm: jest.fn(),
    });

    render(
      <TestWrapper>
        <Favorites />
      </TestWrapper>
    );

    expect(screen.getByText('Meus Favoritos')).toBeInTheDocument();
    expect(screen.getAllByTestId('movie-card')).toHaveLength(3);
    expect(screen.getByText('Movie A')).toBeInTheDocument();
    expect(screen.getByText('Movie B')).toBeInTheDocument();
    expect(screen.getByText('Movie C')).toBeInTheDocument();
  });

  it('should show sort and filter controls when has favorites', () => {
    useMoviesMock.mockReturnValue({
      state: {
        favorites: mockMovies,
        searchHistory: [],
      },
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(),
      addSearchTerm: jest.fn(),
    });

    render(
      <TestWrapper>
        <Favorites />
      </TestWrapper>
    );

    // Deve haver um botão de filtros específico
    expect(screen.getByText('Filtros')).toBeInTheDocument();
  });

  it('should display correct movie count', () => {
    useMoviesMock.mockReturnValue({
      state: {
        favorites: mockMovies,
        searchHistory: [],
      },
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(),
      addSearchTerm: jest.fn(),
    });

    render(
      <TestWrapper>
        <Favorites />
      </TestWrapper>
    );

    // Verifica se há uma descrição da quantidade
    const paragraph = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'p' &&
        content.includes('filmes favoritados')
      );
    });
    expect(paragraph).toBeInTheDocument();
  });

  it('should render movie cards with remove button', () => {
    useMoviesMock.mockReturnValue({
      state: {
        favorites: mockMovies,
        searchHistory: [],
      },
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(),
      addSearchTerm: jest.fn(),
    });

    render(
      <TestWrapper>
        <Favorites />
      </TestWrapper>
    );

    const removeButtons = screen.getAllByText('Remove');
    expect(removeButtons).toHaveLength(3);
  });

  it('should handle empty favorites gracefully', () => {
    useMoviesMock.mockReturnValue({
      state: {
        favorites: [],
        searchHistory: [],
      },
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn(),
      addSearchTerm: jest.fn(),
    });

    render(
      <TestWrapper>
        <Favorites />
      </TestWrapper>
    );

    // Não deve mostrar controles de filtro
    expect(screen.queryByText('filmes')).not.toBeInTheDocument();

    // Deve mostrar estado vazio
    expect(screen.getByText('Type: favorites')).toBeInTheDocument();
  });
});
