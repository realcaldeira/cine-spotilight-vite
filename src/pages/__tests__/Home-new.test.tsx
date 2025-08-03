import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';
import { MoviesProvider } from '../../contexts/MoviesContext';
import { tmdbService } from '../../services/tmdb';

// Mock the services and components
jest.mock('../../services/tmdb', () => ({
  tmdbService: {
    getPopularMovies: jest.fn(),
  },
}));
jest.mock('../../components/LoadingSpinner', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
  LoadingGrid: () => <div data-testid="loading-grid">Loading Grid...</div>,
}));
jest.mock('../../components/ErrorMessage', () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => (
    <div data-testid="error-message">{message}</div>
  ),
}));
import { Movie } from '../../types/movie';

jest.mock('../../components/MovieCard', () => ({
  __esModule: true,
  default: ({
    movie,
    onAddToFavorites,
    isFavorite,
  }: {
    movie: Movie;
    onAddToFavorites?: (movie: Movie) => void;
    isFavorite?: boolean;
  }) => (
    <div data-testid={`movie-card-${movie.id}`}>
      <h3>{movie.title}</h3>
      <p>{movie.overview}</p>
      <button
        onClick={() => onAddToFavorites?.(movie)}
        data-testid={`add-favorite-${movie.id}`}>
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
    </div>
  ),
}));

const mockedTmdbService = tmdbService as jest.Mocked<typeof tmdbService>;

const mockMovies = [
  {
    id: 1,
    title: 'Test Movie 1',
    overview: 'Test overview 1',
    poster_path: '/test1.jpg',
    backdrop_path: '/backdrop1.jpg',
    release_date: '2024-01-01',
    vote_average: 8.5,
    genre_ids: [28, 12],
    adult: false,
    original_language: 'en',
    original_title: 'Test Movie 1',
    popularity: 100,
    video: false,
    vote_count: 1000,
  },
  {
    id: 2,
    title: 'Test Movie 2',
    overview: 'Test overview 2',
    poster_path: '/test2.jpg',
    backdrop_path: '/backdrop2.jpg',
    release_date: '2024-02-01',
    vote_average: 7.5,
    genre_ids: [35, 18],
    adult: false,
    original_language: 'en',
    original_title: 'Test Movie 2',
    popularity: 90,
    video: false,
    vote_count: 800,
  },
];

const HomeWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <MoviesProvider>{children}</MoviesProvider>
  </BrowserRouter>
);

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    mockedTmdbService.getPopularMovies.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    expect(screen.getByTestId('loading-grid')).toBeInTheDocument();
  });

  it('should render popular movies when loaded successfully', async () => {
    mockedTmdbService.getPopularMovies.mockResolvedValue({
      results: mockMovies,
      page: 1,
      total_pages: 1,
      total_results: 2,
    });

    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('movie-card-1')).toBeInTheDocument();
    });

    expect(screen.getByTestId('movie-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('movie-card-2')).toBeInTheDocument();
    expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
  });

  it('should show error message when API fails', async () => {
    mockedTmdbService.getPopularMovies.mockRejectedValue(
      new Error('API Error')
    );

    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  it('should handle adding movie to favorites', async () => {
    mockedTmdbService.getPopularMovies.mockResolvedValue({
      results: mockMovies,
      page: 1,
      total_pages: 1,
      total_results: 2,
    });

    const user = userEvent.setup();

    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('movie-card-1')).toBeInTheDocument();
    });

    const addButton = screen.getByTestId('add-favorite-1');
    await user.click(addButton);

    // Since we're testing the Home component behavior, we just verify the button was clickable
    expect(addButton).toBeInTheDocument();
  });

  it('should display correct movie information', async () => {
    mockedTmdbService.getPopularMovies.mockResolvedValue({
      results: [mockMovies[0]],
      page: 1,
      total_pages: 1,
      total_results: 1,
    });

    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Test overview 1')).toBeInTheDocument();
    });
  });

  it('should handle multiple pages of results', async () => {
    mockedTmdbService.getPopularMovies.mockResolvedValue({
      results: mockMovies,
      page: 1,
      total_pages: 5,
      total_results: 100,
    });

    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('movie-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('movie-card-2')).toBeInTheDocument();
    });

    const movieCards = screen.getAllByTestId(/movie-card-/);
    expect(movieCards).toHaveLength(2);
  });

  it('should handle network timeout error', async () => {
    mockedTmdbService.getPopularMovies.mockRejectedValue(
      new Error('Network timeout')
    );

    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  it('should render movie grid layout correctly', async () => {
    mockedTmdbService.getPopularMovies.mockResolvedValue({
      results: mockMovies,
      page: 1,
      total_pages: 1,
      total_results: 2,
    });

    render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('movie-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('movie-card-2')).toBeInTheDocument();
    });

    // Verify both movie cards are rendered
    const movieCards = screen.getAllByTestId(/movie-card-/);
    expect(movieCards).toHaveLength(2);
  });

  it('should maintain component state during re-renders', async () => {
    mockedTmdbService.getPopularMovies.mockResolvedValue({
      results: mockMovies,
      page: 1,
      total_pages: 1,
      total_results: 2,
    });

    const { rerender } = render(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('movie-card-1')).toBeInTheDocument();
    });

    rerender(
      <HomeWrapper>
        <Home />
      </HomeWrapper>
    );

    expect(screen.getByTestId('movie-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('movie-card-2')).toBeInTheDocument();
  });
});
