import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Search from '../Search';
import { MoviesProvider } from '@/contexts/MoviesContext';

// Mock do serviço de busca
jest.mock('@/services/tmdb', () => ({
  searchMovies: jest.fn(),
}));

// Mock do hook de debounce
jest.mock('@/hooks/use-debounce', () => ({
  useDebounce: (fn: (...args: unknown[]) => unknown) => fn,
}));

const mockSearchMovies = require('@/services/tmdb').searchMovies;

const renderWithProvider = (initialRoute = '/search') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <MoviesProvider>
        <Search />
      </MoviesProvider>
    </MemoryRouter>
  );
};

const mockMovie = {
  id: 1,
  title: 'Test Movie',
  overview: 'Test overview',
  poster_path: '/test.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2023-01-01',
  vote_average: 7.5,
  vote_count: 1000,
  genre_ids: [1, 2, 3],
};

describe('Search Component Coverage Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty search state', () => {
    renderWithProvider('/search');
    expect(screen.getByText('Busque por filmes')).toBeInTheDocument();
  });

  it('should handle search with results', async () => {
    mockSearchMovies.mockResolvedValue({
      results: [mockMovie],
      total_pages: 1,
      total_results: 1,
      page: 1,
    });

    renderWithProvider('/search?q=test');

    await waitFor(() => {
      expect(screen.getByText('Resultados da busca')).toBeInTheDocument();
    });
  });

  it('should handle search with no results', async () => {
    mockSearchMovies.mockResolvedValue({
      results: [],
      total_pages: 1,
      total_results: 0,
      page: 1,
    });

    renderWithProvider('/search?q=empty');

    await waitFor(() => {
      expect(screen.getByText('Nenhum filme encontrado')).toBeInTheDocument();
    });
  });

  it('should handle search error', async () => {
    mockSearchMovies.mockRejectedValue(new Error('API Error'));

    renderWithProvider('/search?q=error');

    await waitFor(() => {
      expect(screen.getByText('Erro ao buscar filmes')).toBeInTheDocument();
    });
  });

  it('should handle load more functionality', async () => {
    // First call with more pages
    mockSearchMovies.mockResolvedValueOnce({
      results: [mockMovie],
      total_pages: 2,
      total_results: 2,
      page: 1,
    });

    // Second call for page 2
    mockSearchMovies.mockResolvedValueOnce({
      results: [{ ...mockMovie, id: 2, title: 'Movie 2' }],
      total_pages: 2,
      total_results: 2,
      page: 2,
    });

    renderWithProvider('/search?q=pagination');

    // Wait for initial results
    await waitFor(() => {
      expect(screen.getByText('Resultados da busca')).toBeInTheDocument();
    });

    // Click load more button
    const loadMoreButton = screen.getByText('Carregar mais resultados');
    fireEvent.click(loadMoreButton);

    // Wait for more results
    await waitFor(() => {
      expect(mockSearchMovies).toHaveBeenCalledTimes(2);
    });
  });

  it('should handle loading state', async () => {
    // Mock a delayed response
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockSearchMovies.mockReturnValue(promise);

    renderWithProvider('/search?q=loading');

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    // Resolve the promise
    resolvePromise!({
      results: [mockMovie],
      total_pages: 1,
      total_results: 1,
      page: 1,
    });

    // Should show results
    await waitFor(() => {
      expect(screen.getByText('Resultados da busca')).toBeInTheDocument();
    });
  });

  it('should show correct result count text', async () => {
    mockSearchMovies.mockResolvedValue({
      results: [mockMovie, { ...mockMovie, id: 2 }],
      total_pages: 1,
      total_results: 2,
      page: 1,
    });

    renderWithProvider('/search?q=multiple');

    await waitFor(() => {
      expect(screen.getByText('2 resultados encontrados para')).toBeInTheDocument();
    });
  });

  it('should handle search term tracking', async () => {
    mockSearchMovies.mockResolvedValue({
      results: [mockMovie],
      total_pages: 1,
      total_results: 1,
      page: 1,
    });

    renderWithProvider('/search?q=tracking');

    await waitFor(() => {
      expect(screen.getByText('Resultados da busca')).toBeInTheDocument();
    });
  });
});
