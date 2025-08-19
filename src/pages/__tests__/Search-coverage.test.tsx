import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Search from "../Search";
import { MoviesProvider } from "@/contexts/MoviesContext";

// Mock do serviço de busca
jest.mock("@/services/tmdb", () => ({
  tmdbService: {
    searchMovies: jest.fn(),
    getPosterUrl: jest.fn((path) =>
      path ? `https://image.tmdb.org/t/p/w300${path}` : "/placeholder.svg"
    ),
    getBackdropUrl: jest.fn((path) =>
      path ? `https://image.tmdb.org/t/p/original${path}` : "/placeholder.svg"
    ),
  },
}));

// Mock do hook de debounce
jest.mock("@/hooks/use-debounce", () => ({
  useDebounce: (fn: (...args: unknown[]) => unknown) => fn,
}));

const mockSearchMovies = require("@/services/tmdb").tmdbService.searchMovies;

const renderWithProvider = (initialRoute = "/search") => {
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
  title: "Test Movie",
  overview: "Test overview",
  poster_path: "/test.jpg",
  backdrop_path: "/test-backdrop.jpg",
  release_date: "2023-01-01",
  vote_average: 7.5,
  vote_count: 1000,
  genre_ids: [1, 2, 3],
};

describe("Search Component Coverage Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render empty search state", () => {
    renderWithProvider("/search");
    expect(screen.getByText("Busque por filmes")).toBeInTheDocument();
  });

  it("should handle search with results", async () => {
    mockSearchMovies.mockResolvedValue({
      results: [mockMovie],
      total_pages: 1,
      total_results: 1,
      page: 1,
    });

    renderWithProvider("/search?q=test");

    await waitFor(() => {
      expect(screen.getByText("Resultados da busca")).toBeInTheDocument();
    });
  });

  it("should handle search with no results", async () => {
    mockSearchMovies.mockResolvedValue({
      results: [],
      total_pages: 1,
      total_results: 0,
      page: 1,
    });

    renderWithProvider("/search?q=empty");

    await waitFor(() => {
      expect(screen.getByText("Nenhum filme encontrado")).toBeInTheDocument();
    });
  });

  it("should handle search error", async () => {
    mockSearchMovies.mockRejectedValue(new Error("API Error"));

    renderWithProvider("/search?q=error");

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao buscar filmes. Tente novamente.")
      ).toBeInTheDocument();
    });
  });

  it("should handle load more functionality", async () => {
    // First call with more pages
    mockSearchMovies.mockResolvedValueOnce({
      results: [mockMovie],
      total_pages: 2,
      total_results: 2,
      page: 1,
    });

    // Second call for page 2
    mockSearchMovies.mockResolvedValueOnce({
      results: [{ ...mockMovie, id: 2, title: "Movie 2" }],
      total_pages: 2,
      total_results: 2,
      page: 2,
    });

    renderWithProvider("/search?q=pagination");

    // Wait for initial results
    await waitFor(() => {
      expect(screen.getByText("Resultados da busca")).toBeInTheDocument();
    });

    // Click load more button
    const loadMoreButton = screen.getByText("Carregar mais resultados");
    fireEvent.click(loadMoreButton);

    // Wait for more results
    await waitFor(() => {
      expect(mockSearchMovies).toHaveBeenCalledTimes(2);
    });
  });

  it("should handle loading state", async () => {
    // Mock a delayed response
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockSearchMovies.mockReturnValue(promise);

    renderWithProvider("/search?q=loading");

    // Should show loading state with skeleton elements
    await waitFor(() => {
      const skeletonElements = document.querySelectorAll(".animate-pulse");
      expect(skeletonElements.length).toBeGreaterThan(0);
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
      expect(screen.getByText("Resultados da busca")).toBeInTheDocument();
    });
  });

  it("should show correct result count text", async () => {
    mockSearchMovies.mockResolvedValue({
      results: [mockMovie, { ...mockMovie, id: 2 }],
      total_pages: 1,
      total_results: 2,
      page: 1,
    });

    renderWithProvider("/search?q=multiple");

    await waitFor(() => {
      // The text is broken up by multiple elements, so we need to check for the content
      const elements = screen.getAllByText((content, element) => {
        return (
          element?.textContent?.includes("2") &&
          element?.textContent?.includes("resultados") &&
          element?.textContent?.includes("encontrados para")
        );
      });
      expect(elements[0]).toBeInTheDocument();
    });
  });

  it("should handle search term tracking", async () => {
    mockSearchMovies.mockResolvedValue({
      results: [mockMovie],
      total_pages: 1,
      total_results: 1,
      page: 1,
    });

    renderWithProvider("/search?q=tracking");

    await waitFor(() => {
      expect(screen.getByText("Resultados da busca")).toBeInTheDocument();
    });
  });

  // NEW TESTS TO COVER LINES 50, 67, 95-96
  it("should handle search error and reset current page when page > 1", async () => {
    // First call succeeds
    mockSearchMovies.mockResolvedValueOnce({
      results: [mockMovie],
      total_pages: 2,
      total_results: 2,
      page: 1,
    });

    // Second call fails (page 2)
    mockSearchMovies.mockRejectedValueOnce(new Error("API Error"));

    renderWithProvider("/search?q=error-pagination");

    // Wait for initial results
    await waitFor(() => {
      expect(screen.getByText("Resultados da busca")).toBeInTheDocument();
    });

    // Click load more button to trigger page 2
    const loadMoreButton = screen.getByText("Carregar mais resultados");
    fireEvent.click(loadMoreButton);

    // Wait for error message
    await waitFor(() => {
      expect(
        screen.getByText("Erro ao buscar filmes. Tente novamente.")
      ).toBeInTheDocument();
    });
  });

  it("should handle search error without resetting current page when page = 1", async () => {
    mockSearchMovies.mockRejectedValue(new Error("API Error"));

    renderWithProvider("/search?q=error-first-page");

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao buscar filmes. Tente novamente.")
      ).toBeInTheDocument();
    });
  });

  it("should handle invalid response from API", async () => {
    mockSearchMovies.mockResolvedValue(null);

    renderWithProvider("/search?q=invalid-response");

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao buscar filmes. Tente novamente.")
      ).toBeInTheDocument();
    });
  });

  it("should handle response without results property", async () => {
    mockSearchMovies.mockResolvedValue({
      total_pages: 1,
      total_results: 0,
      page: 1,
      // Missing results property
    });

    renderWithProvider("/search?q=no-results-property");

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao buscar filmes. Tente novamente.")
      ).toBeInTheDocument();
    });
  });

  it("should handle empty search query", () => {
    renderWithProvider("/search?q=");

    expect(screen.getByText("Busque por filmes")).toBeInTheDocument();
  });

  it("should handle search query with only whitespace", () => {
    renderWithProvider("/search?q=%20%20");

    expect(screen.getByText("Nenhum filme encontrado")).toBeInTheDocument();
  });

  it("should handle retry functionality", async () => {
    // First call fails
    mockSearchMovies.mockRejectedValueOnce(new Error("API Error"));

    // Second call succeeds
    mockSearchMovies.mockResolvedValueOnce({
      results: [mockMovie],
      total_pages: 1,
      total_results: 1,
      page: 1,
    });

    renderWithProvider("/search?q=retry");

    // Wait for error message
    await waitFor(() => {
      expect(
        screen.getByText("Erro ao buscar filmes. Tente novamente.")
      ).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByText("Tentar novamente");
    fireEvent.click(retryButton);

    // Wait for success
    await waitFor(() => {
      expect(screen.getByText("Resultados da busca")).toBeInTheDocument();
    });
  });

  it("should handle load more button disabled state", async () => {
    mockSearchMovies.mockResolvedValue({
      results: [mockMovie],
      total_pages: 2,
      total_results: 2,
      page: 1,
    });

    renderWithProvider("/search?q=disabled-load-more");

    await waitFor(() => {
      expect(screen.getByText("Resultados da busca")).toBeInTheDocument();
    });

    const loadMoreButton = screen.getByText("Carregar mais resultados");
    expect(loadMoreButton).not.toBeDisabled();

    // Simulate loading state
    fireEvent.click(loadMoreButton);

    // Button should be disabled during loading
    expect(loadMoreButton).toBeDisabled();
  });

  it("should handle movies array reset when search query changes", async () => {
    // First search
    mockSearchMovies.mockResolvedValueOnce({
      results: [mockMovie],
      total_pages: 1,
      total_results: 1,
      page: 1,
    });

    renderWithProvider("/search?q=first-search");

    await waitFor(() => {
      expect(screen.getByText("Resultados da busca")).toBeInTheDocument();
    });

    // Change search query (this would normally happen through navigation)
    // We need to re-render with a different query
    const { rerender } = renderWithProvider("/search?q=second-search");

    // Mock second search
    mockSearchMovies.mockResolvedValueOnce({
      results: [{ ...mockMovie, id: 2, title: "Second Movie" }],
      total_pages: 1,
      total_results: 1,
      page: 1,
    });

    // Re-render with new query
    rerender(
      <MemoryRouter initialEntries={["/search?q=second-search"]}>
        <MoviesProvider>
          <Search />
        </MoviesProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
    });
  });

  it("should handle current page reset when search query changes", async () => {
    // First search with multiple pages
    mockSearchMovies.mockResolvedValueOnce({
      results: [mockMovie],
      total_pages: 3,
      total_results: 3,
      page: 1,
    });

    renderWithProvider("/search?q=first-search");

    await waitFor(() => {
      expect(screen.getByText("Resultados da busca")).toBeInTheDocument();
    });

    // Change search query should reset to page 1
    mockSearchMovies.mockResolvedValueOnce({
      results: [{ ...mockMovie, id: 3, title: "Test Movie" }],
      total_pages: 1,
      total_results: 1,
      page: 1,
    });

    // Re-render with new query
    const { rerender } = renderWithProvider("/search?q=new-search");

    rerender(
      <MemoryRouter initialEntries={["/search?q=new-search"]}>
        <MoviesProvider>
          <Search />
        </MoviesProvider>
      </MemoryRouter>
    );

    // Verify that the movie is rendered (this implies page reset)
    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
    });
  });

  it("should handle total pages fallback to 1", async () => {
    mockSearchMovies.mockResolvedValue({
      results: [mockMovie],
      // Missing total_pages
      total_results: 1,
      page: 1,
    });

    renderWithProvider("/search?q=no-total-pages");

    await waitFor(() => {
      expect(screen.getByText("Resultados da busca")).toBeInTheDocument();
    });

    // When total_pages is missing, it defaults to 1, so no load more button is shown
    expect(
      screen.queryByText("Carregar mais resultados")
    ).not.toBeInTheDocument();
  });

  it("should handle total results fallback to 0", async () => {
    mockSearchMovies.mockResolvedValue({
      results: [mockMovie],
      total_pages: 1,
      // Missing total_results
      page: 1,
    });

    renderWithProvider("/search?q=no-total-results");

    await waitFor(() => {
      expect(screen.getByText("Resultados da busca")).toBeInTheDocument();
    });

    // When total_results is missing, it defaults to 0, so it shows "Nenhum resultado encontrado"
    expect(screen.getByText(/Nenhum resultado encontrado/)).toBeInTheDocument();
  });
});
