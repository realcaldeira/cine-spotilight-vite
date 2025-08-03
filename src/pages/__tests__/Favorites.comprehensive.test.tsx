import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Favorites from '../Favorites';
import { Movie } from '@/types/movie';
import { useMovies } from '@/contexts/MoviesContext';

// Mock dos componentes
jest.mock('@/components/MovieCard', () => {
  return function MockMovieCard({ movie }: { movie: Movie }) {
    return (
      <div data-testid="movie-card">
        <h3>{movie.title}</h3>
        <span>Rating: {movie.vote_average ?? 'N/A'}</span>
        <span>Date: {movie.release_date}</span>
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
    title: 'A Movie',
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
    title: 'B Movie',
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
    title: 'C Movie',
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

describe('Favorites - Enhanced Coverage', () => {
  const useMoviesMock = useMovies as jest.MockedFunction<typeof useMovies>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should toggle filters visibility', async () => {
    const user = userEvent.setup();
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

    // Clicar no botão de filtros
    await user.click(screen.getByText('Filtros'));

    // Agora o select deve estar visível
    expect(screen.getByRole('combobox')).toBeInTheDocument();

    // Clicar novamente para esconder
    await user.click(screen.getByText('Filtros'));

    // Os filtros devem estar escondidos novamente
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('should display sorting with default order (title ascending)', () => {
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

    // Verificar que os filmes estão ordenados por título (A, B, C)
    const movieCards = screen.getAllByTestId('movie-card');
    expect(movieCards[0]).toHaveTextContent('A Movie');
    expect(movieCards[1]).toHaveTextContent('B Movie');
    expect(movieCards[2]).toHaveTextContent('C Movie');
  });

  it('should handle component with different numbers of favorites', () => {
    const singleMovie = [mockMovies[0]];

    useMoviesMock.mockReturnValue({
      state: {
        favorites: singleMovie,
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
    expect(screen.getAllByTestId('movie-card')).toHaveLength(1);
  });

  it('should render component structure correctly', () => {
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

    // Verificar estrutura básica
    expect(screen.getByText('Meus Favoritos')).toBeInTheDocument();
    expect(screen.getByText('Filtros')).toBeInTheDocument();

    // Verificar que todos os filmes são renderizados
    mockMovies.forEach((movie) => {
      expect(screen.getByText(movie.title)).toBeInTheDocument();
    });
  });

  it('should handle state with search history', () => {
    useMoviesMock.mockReturnValue({
      state: {
        favorites: mockMovies,
        searchHistory: ['action', 'comedy'],
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

    // O componente deve renderizar normalmente mesmo com histórico de busca
    expect(screen.getByText('Meus Favoritos')).toBeInTheDocument();
    expect(screen.getAllByTestId('movie-card')).toHaveLength(3);
  });
});
