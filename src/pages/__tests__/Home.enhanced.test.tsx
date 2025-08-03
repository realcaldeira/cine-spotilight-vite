import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';
import { MoviesProvider } from '../../contexts/MoviesContext';
import { tmdbService } from '../../services/tmdb';
import { Movie } from '../../types/movie';

// Mock TMDB service
jest.mock('../../services/tmdb', () => ({
  tmdbService: {
    getPopularMovies: jest.fn(),
    getPosterUrl: jest.fn((path) => `https://image.tmdb.org/t/p/w500${path}`),
  },
}));

const mockTmdbService = tmdbService as jest.Mocked<typeof tmdbService>;

const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Popular Movie 1',
    poster_path: '/popular1.jpg',
    backdrop_path: '/backdrop1.jpg',
    vote_average: 8.5,
    vote_count: 1200,
    release_date: '2024-01-01',
    overview: 'A great popular movie',
    genre_ids: [28, 12],
  },
  {
    id: 2,
    title: 'Popular Movie 2',
    poster_path: '/popular2.jpg',
    backdrop_path: '/backdrop2.jpg',
    vote_average: 7.8,
    vote_count: 800,
    release_date: '2024-01-02',
    overview: 'Another popular movie',
    genre_ids: [35, 18],
  },
];

const renderHome = () => {
  return render(
    <BrowserRouter>
      <MoviesProvider>
        <Home />
      </MoviesProvider>
    </BrowserRouter>
  );
};

describe('Home - Enhanced Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load popular movies successfully', async () => {
    mockTmdbService.getPopularMovies.mockResolvedValue({
      results: mockMovies,
      page: 1,
      total_pages: 5,
      total_results: 100,
    });

    renderHome();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
    });

    // Check page title and description
    expect(screen.getByText('Filmes Populares')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Descubra os filmes mais assistidos do momento. Uma curadoria especial com o melhor do cinema mundial.'
      )
    ).toBeInTheDocument();

    // Check movies are displayed
    expect(screen.getByText('Popular Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Popular Movie 2')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    mockTmdbService.getPopularMovies.mockRejectedValue(new Error('API Error'));

    renderHome();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
    });

    // Check error message is displayed
    expect(
      screen.getByText('Erro ao carregar filmes populares. Tente novamente.')
    ).toBeInTheDocument();
  });

  it('should retry loading movies when retry button is clicked', async () => {
    // First call fails, second succeeds
    mockTmdbService.getPopularMovies
      .mockRejectedValueOnce(new Error('API Error'))
      .mockResolvedValue({
        results: mockMovies,
        page: 1,
        total_pages: 5,
        total_results: 100,
      });

    renderHome();

    // Wait for error state
    await waitFor(() => {
      expect(
        screen.getByText('Erro ao carregar filmes populares. Tente novamente.')
      ).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByText('Tentar novamente');
    await userEvent.click(retryButton);

    // Wait for successful load
    await waitFor(() => {
      expect(screen.getByText('Popular Movie 1')).toBeInTheDocument();
    });

    // Verify API was called twice (initial + retry)
    expect(mockTmdbService.getPopularMovies).toHaveBeenCalledTimes(2);
  });

  it('should display loading state initially', () => {
    mockTmdbService.getPopularMovies.mockImplementation(
      () => new Promise(() => {})
    );

    renderHome();

    // Check for skeleton loading elements
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should handle empty movie results', async () => {
    mockTmdbService.getPopularMovies.mockResolvedValue({
      results: [],
      page: 1,
      total_pages: 1,
      total_results: 0,
    });

    renderHome();

    await waitFor(() => {
      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
    });

    // Page headers should still be visible
    expect(screen.getByText('Filmes Populares')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Descubra os filmes mais assistidos do momento. Uma curadoria especial com o melhor do cinema mundial.'
      )
    ).toBeInTheDocument();
  });

  it('should show load more button when there are more pages', async () => {
    mockTmdbService.getPopularMovies.mockResolvedValue({
      results: mockMovies,
      page: 1,
      total_pages: 5,
      total_results: 100,
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Popular Movie 1')).toBeInTheDocument();
    });

    // Should show load more button
    expect(screen.getByText('Carregar mais filmes')).toBeInTheDocument();
  });

  it('should load more movies when load more button is clicked', async () => {
    // First page
    mockTmdbService.getPopularMovies.mockResolvedValueOnce({
      results: [mockMovies[0]],
      page: 1,
      total_pages: 5,
      total_results: 100,
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Popular Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Carregar mais filmes')).toBeInTheDocument();
    });

    // Mock second page
    mockTmdbService.getPopularMovies.mockResolvedValueOnce({
      results: [mockMovies[1]],
      page: 2,
      total_pages: 5,
      total_results: 100,
    });

    // Click load more
    const loadMoreButton = screen.getByText('Carregar mais filmes');
    await userEvent.click(loadMoreButton);

    // Wait for second movie to appear
    await waitFor(() => {
      expect(screen.getByText('Popular Movie 2')).toBeInTheDocument();
    });

    // Both movies should be visible
    expect(screen.getByText('Popular Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Popular Movie 2')).toBeInTheDocument();

    // API should have been called twice
    expect(mockTmdbService.getPopularMovies).toHaveBeenCalledTimes(2);
    expect(mockTmdbService.getPopularMovies).toHaveBeenNthCalledWith(1, 1);
    expect(mockTmdbService.getPopularMovies).toHaveBeenNthCalledWith(2, 2);
  });

  it('should not show load more button on last page', async () => {
    mockTmdbService.getPopularMovies.mockResolvedValue({
      results: mockMovies,
      page: 1,
      total_pages: 1,
      total_results: 20,
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Popular Movie 1')).toBeInTheDocument();
    });

    // Should not show load more button when on last page
    expect(screen.queryByText('Carregar mais filmes')).not.toBeInTheDocument();
  });

  it('should show loading state for load more', async () => {
    // First page loads normally
    mockTmdbService.getPopularMovies.mockResolvedValueOnce({
      results: [mockMovies[0]],
      page: 1,
      total_pages: 5,
      total_results: 100,
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Carregar mais filmes')).toBeInTheDocument();
    });

    // Second page hangs
    mockTmdbService.getPopularMovies.mockImplementation(
      () => new Promise(() => {})
    );

    // Click load more
    await userEvent.click(screen.getByText('Carregar mais filmes'));

    // Should show loading state - check if button text changes or gets disabled
    await waitFor(() => {
      // Button should either show loading text or be disabled
      const loadingButton = screen.getByText('Carregando mais filmes...');
      expect(loadingButton).toBeInTheDocument();
    });
  });

  it('should render movie cards with links', async () => {
    mockTmdbService.getPopularMovies.mockResolvedValue({
      results: [mockMovies[0]],
      page: 1,
      total_pages: 1,
      total_results: 1,
    });

    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Popular Movie 1')).toBeInTheDocument();
    });

    // Check movie card has link to details
    const movieLink = screen.getByText('Popular Movie 1').closest('a');
    expect(movieLink).toHaveAttribute('href', '/movie/1');
  });
});
