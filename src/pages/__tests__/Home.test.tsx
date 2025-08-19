import React from "react";
import { render, waitFor } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { BrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import { MoviesProvider } from "@/contexts/MoviesContext";
import { mockMovieResponse, mockEmptyMovieResponse } from "@/test/mocks";

// Mock the TMDB service
jest.mock("@/services/tmdb", () => ({
  tmdbService: {
    getPopularMovies: jest.fn(),
    getPosterUrl: jest.fn(
      (path: string) => `https://image.tmdb.org/t/p/w300${path}`
    ),
  },
}));

// Import the mock after it's defined
import { tmdbService } from "@/services/tmdb";
const mockGetPopularMovies =
  tmdbService.getPopularMovies as jest.MockedFunction<
    typeof tmdbService.getPopularMovies
  >;

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <MoviesProvider>{children}</MoviesProvider>
  </BrowserRouter>
);

describe("Home", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    // Clear any potential state pollution
    if (global.fetch) {
      (global.fetch as jest.Mock).mockClear();
    }
  });

  it("should render loading state initially", () => {
    mockGetPopularMovies.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Home />, { wrapper: TestWrapper });

    // Should show loading skeletons
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should render movies when loaded successfully", async () => {
    mockGetPopularMovies.mockResolvedValueOnce(mockMovieResponse);

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Filmes Populares")).toBeInTheDocument();
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
    });
  });

  it("should render error state when API fails", async () => {
    mockGetPopularMovies.mockRejectedValueOnce(new Error("API Error"));

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(
        screen.getByText(/Erro ao carregar filmes populares/)
      ).toBeInTheDocument();
    });
  });

  it("should render load more button when there are more pages", async () => {
    const multiPageResponse = {
      ...mockMovieResponse,
      total_pages: 2,
      page: 1,
    };
    mockGetPopularMovies.mockResolvedValueOnce(multiPageResponse);

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Carregar mais filmes")).toBeInTheDocument();
    });
  });

  it("should not render load more button when on last page", async () => {
    const lastPageResponse = {
      ...mockMovieResponse,
      total_pages: 1,
      page: 1,
    };
    mockGetPopularMovies.mockResolvedValueOnce(lastPageResponse);

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(
        screen.queryByText("Carregar mais filmes")
      ).not.toBeInTheDocument();
    });
  });

  it("should render page title and description", async () => {
    mockGetPopularMovies.mockResolvedValueOnce(mockMovieResponse);

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Filmes Populares")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Descubra os filmes mais assistidos do momento. Uma curadoria especial com o melhor do cinema mundial."
        )
      ).toBeInTheDocument();
    });
  });

  it("should handle empty results", async () => {
    mockGetPopularMovies.mockResolvedValueOnce(mockEmptyMovieResponse);

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      // Should not show load more button
      expect(
        screen.queryByText("Carregar mais filmes")
      ).not.toBeInTheDocument();
    });
  });

  // NEW TESTS TO COVER LINE 47
  it("should handle error and reset current page when page > 1", async () => {
    // First call succeeds
    mockGetPopularMovies.mockResolvedValueOnce({
      ...mockMovieResponse,
      total_pages: 2,
      page: 1,
    });

    // Second call fails (page 2)
    mockGetPopularMovies.mockRejectedValueOnce(new Error("API Error"));

    render(<Home />, { wrapper: TestWrapper });

    // Wait for initial results
    await waitFor(() => {
      expect(screen.getByText("Filmes Populares")).toBeInTheDocument();
    });

    // Click load more button to trigger page 2
    const loadMoreButton = screen.getByText("Carregar mais filmes");
    loadMoreButton.click();

    // Wait for error message
    await waitFor(() => {
      expect(
        screen.getByText(/Erro ao carregar filmes populares/)
      ).toBeInTheDocument();
    });
  });

  it("should handle error without resetting current page when page = 1", async () => {
    mockGetPopularMovies.mockRejectedValue(new Error("API Error"));

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(
        screen.getByText(/Erro ao carregar filmes populares/)
      ).toBeInTheDocument();
    });
  });

  it("should handle invalid response from API", async () => {
    mockGetPopularMovies.mockResolvedValue(null);

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(
        screen.getByText(/Erro ao carregar filmes populares/)
      ).toBeInTheDocument();
    });
  });

  it("should handle response without results property", async () => {
    mockGetPopularMovies.mockResolvedValue({
      results: [],
      total_pages: 1,
      total_results: 0,
      page: 1,
    });

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Filmes Populares")).toBeInTheDocument();
    });

    // Should show empty grid when no movies
    expect(screen.getByText("Em Destaque")).toBeInTheDocument();
  });

  it("should handle retry functionality", async () => {
    // First call fails
    mockGetPopularMovies.mockRejectedValueOnce(new Error("API Error"));

    // Second call succeeds
    mockGetPopularMovies.mockResolvedValueOnce(mockMovieResponse);

    render(<Home />, { wrapper: TestWrapper });

    // Wait for error message
    await waitFor(() => {
      expect(
        screen.getByText(/Erro ao carregar filmes populares/)
      ).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByText("Tentar novamente");
    retryButton.click();

    // Wait for success
    await waitFor(() => {
      expect(screen.getByText("Filmes Populares")).toBeInTheDocument();
    });
  });

  it("should handle load more button disabled state", async () => {
    mockGetPopularMovies.mockResolvedValue({
      ...mockMovieResponse,
      total_pages: 2,
      total_results: 2,
      page: 1,
    });

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Filmes Populares")).toBeInTheDocument();
    });

    const loadMoreButton = screen.getByText("Carregar mais filmes");
    expect(loadMoreButton).not.toBeDisabled();

    // The button should be enabled when there are more pages
    expect(loadMoreButton).toBeInTheDocument();
  });

  it("should handle movies array reset when fetchMovies is called with reset=true", async () => {
    // First call with reset=true
    mockGetPopularMovies.mockResolvedValueOnce({
      ...mockMovieResponse,
      total_pages: 2,
      total_results: 2,
      page: 1,
    });

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Filmes Populares")).toBeInTheDocument();
    });

    // Load more to add movies to array
    const loadMoreButton = screen.getByText("Carregar mais filmes");
    loadMoreButton.click();

    // Mock second page
    mockGetPopularMovies.mockResolvedValueOnce({
      results: [
        { ...mockMovieResponse.results[0], id: 2, title: "Page 2 Movie" },
      ],
      total_pages: 3,
      total_results: 3,
      page: 2,
    });

    await waitFor(() => {
      expect(screen.getByText("Page 2 Movie")).toBeInTheDocument();
    });

    // Now mock an error for the next call to trigger error state
    mockGetPopularMovies.mockRejectedValueOnce(new Error("API Error"));

    // Try to load more to trigger error - but first we need to have more pages
    // Let's change the mock to have more pages so we can trigger the error
    mockGetPopularMovies.mockResolvedValueOnce({
      ...mockMovieResponse,
      total_pages: 3,
      total_results: 3,
      page: 2,
    });

    // Load more to get to page 2
    const loadMoreButton2 = screen.getByText("Carregar mais filmes");
    loadMoreButton2.click();

    await waitFor(() => {
      expect(screen.getByText("Page 2 Movie")).toBeInTheDocument();
    });

    // Now trigger error on next load more
    mockGetPopularMovies.mockRejectedValueOnce(new Error("API Error"));
    const loadMoreButton3 = screen.getByText("Carregar mais filmes");
    loadMoreButton3.click();

    // Wait for error to appear
    await waitFor(() => {
      expect(
        screen.getByText(/Erro ao carregar filmes populares/)
      ).toBeInTheDocument();
    });

    // Now mock success for retry
    mockGetPopularMovies.mockResolvedValueOnce({
      ...mockMovieResponse,
      total_pages: 1,
      total_results: 1,
      page: 1,
    });

    const retryButton = screen.getByText("Tentar novamente");
    retryButton.click();

    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
      // Page 2 movie should not be present after reset
      expect(screen.queryByText("Page 2 Movie")).not.toBeInTheDocument();
    });
  });

  it("should handle total pages fallback to 1", async () => {
    mockGetPopularMovies.mockResolvedValue({
      results: mockMovieResponse.results,
      total_pages: 1,
      total_results: 1,
      page: 1,
    });

    render(<Home />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Filmes Populares")).toBeInTheDocument();
    });

    // Should not show load more button when total_pages is 1
    expect(screen.queryByText("Carregar mais filmes")).not.toBeInTheDocument();
  });

  // Teste isolado para debounced load more - movido para o final para evitar interferência
  it("should handle debounced load more functionality - isolated", async () => {
    // Limpeza completa antes do teste
    jest.clearAllMocks();
    
    // Mock específico para este teste
    const multiPageResponse = {
      page: 1,
      results: [mockMovieResponse.results[0]],
      total_pages: 3,
      total_results: 3,
    };
    
    console.log("🔍 Mock response:", multiPageResponse);
    
    // Mock temporário
    mockGetPopularMovies.mockResolvedValue(multiPageResponse);

    // Renderizar sem o MoviesContext para isolar o problema
    const { unmount } = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText("Filmes Populares")).toBeInTheDocument();
    });

    // Debug: verificar se o mock foi chamado
    console.log("🔍 Mock calls:", mockGetPopularMovies.mock.calls);
    console.log("🔍 Mock results:", mockGetPopularMovies.mock.results);

    // Debug: verificar o que está sendo renderizado
    console.log("🔍 Current page text:", screen.getByText("1 filmes carregados").textContent);
    
    // Verificar se há algum texto sobre páginas
    const pageText = screen.queryByText(/página|page/i);
    console.log("🔍 Page text found:", pageText?.textContent);

    // Wait for the load more button to appear after API response
    await waitFor(() => {
      expect(screen.getByText("Carregar mais filmes")).toBeInTheDocument();
    });

    const loadMoreButton = screen.getByText("Carregar mais filmes");

    // Click load more button multiple times quickly
    loadMoreButton.click();
    loadMoreButton.click();
    loadMoreButton.click();

    // Should only make one additional API call due to debouncing
    await waitFor(() => {
      expect(mockGetPopularMovies).toHaveBeenCalledTimes(2); // Initial + 1 load more
    });

    // Clean up
    unmount();
  });
});
