import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';
import Home from '@/pages/Home';
import { MoviesProvider } from '@/contexts/MoviesContext';
import { mockMovieResponse, mockEmptyMovieResponse } from '@/test/mocks';

// Mock the TMDB service
jest.mock('@/services/tmdb', () => ({
  tmdbService: {
    getPopularMovies: jest.fn(),
    getPosterUrl: jest.fn(
      (path: string) => `https://image.tmdb.org/t/p/w300${path}`
    ),
  },
}));

// Import the mock after it's defined
import { tmdbService } from '@/services/tmdb';
const mockGetPopularMovies =
  tmdbService.getPopularMovies as jest.MockedFunction<
    typeof tmdbService.getPopularMovies
  >;

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <MoviesProvider>{children}</MoviesProvider>
  </BrowserRouter>
);

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    mockGetPopularMovies.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Home />, { wrapper: TestWrapper });

    // Should show loading skeletons
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render movies when loaded successfully', async () => {
    mockGetPopularMovies.mockResolvedValueOnce(mockMovieResponse);

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Filmes Populares')).toBeInTheDocument();
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });
  });

  it('should render error state when API fails', async () => {
    mockGetPopularMovies.mockRejectedValueOnce(new Error('API Error'));

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(
        screen.getByText(/Erro ao carregar filmes populares/)
      ).toBeInTheDocument();
    });
  });

  it('should render load more button when there are more pages', async () => {
    const multiPageResponse = {
      ...mockMovieResponse,
      total_pages: 2,
      page: 1,
    };
    mockGetPopularMovies.mockResolvedValueOnce(multiPageResponse);

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Carregar mais filmes')).toBeInTheDocument();
    });
  });

  it('should not render load more button when on last page', async () => {
    const lastPageResponse = {
      ...mockMovieResponse,
      total_pages: 1,
      page: 1,
    };
    mockGetPopularMovies.mockResolvedValueOnce(lastPageResponse);

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(
        screen.queryByText('Carregar mais filmes')
      ).not.toBeInTheDocument();
    });
  });

  it('should render page title and description', async () => {
    mockGetPopularMovies.mockResolvedValueOnce(mockMovieResponse);

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Filmes Populares')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Descubra os filmes mais assistidos do momento. Uma curadoria especial com o melhor do cinema mundial.'
        )
      ).toBeInTheDocument();
    });
  });

  it('should handle empty results', async () => {
    mockGetPopularMovies.mockResolvedValueOnce(mockEmptyMovieResponse);

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      // Should not show load more button
      expect(
        screen.queryByText('Carregar mais filmes')
      ).not.toBeInTheDocument();
    });
  });
});
