import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import MovieDetails from "@/pages/MovieDetails";
import { MoviesProvider } from "@/contexts/MoviesContext";
import { mockMovieDetails } from "@/test/mocks";

// Mock the TMDB service
jest.mock("@/services/tmdb", () => ({
  tmdbService: {
    getMovieDetails: jest.fn(),
    getBackdropUrl: jest.fn(
      (path: string) => `https://image.tmdb.org/t/p/original${path}`
    ),
    getPosterUrl: jest.fn(
      (path: string) => `https://image.tmdb.org/t/p/w300${path}`
    ),
  },
}));

// Import the mock after it's defined
import { tmdbService } from "@/services/tmdb";
const mockGetMovieDetails = tmdbService.getMovieDetails as jest.MockedFunction<
  typeof tmdbService.getMovieDetails
>;

// Mock useParams and Navigate separately for different test scenarios
const mockUseParams = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => mockUseParams(),
  Navigate: ({ to }: { to: string }) => {
    mockNavigate(to);
    return <div>Navigate to {to}</div>;
  },
}));

// Mock the useMovies hook
const mockUseMovies = jest.fn();

jest.mock("@/contexts/MoviesContext", () => ({
  MoviesProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useMovies: () => mockUseMovies(),
}));

// Mock window.location.reload
const mockReload = jest.fn();

const TestWrapper = ({
  children,
  route = "/movie/1",
}: {
  children: React.ReactNode;
  route?: string;
}) => <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>;

describe("MovieDetails - Full Coverage Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReload.mockClear();
    mockNavigate.mockClear();

    // Setup default mock for useMovies
    mockUseMovies.mockReturnValue({
      state: {
        favorites: [],
        searchResults: [],
        loading: false,
        error: null,
        query: "",
      },
      dispatch: jest.fn(),
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
      isFavorite: jest.fn().mockReturnValue(false),
    });

    // Default useParams mock
    mockUseParams.mockReturnValue({ id: "1" });
  });

  it("should navigate to home when id is missing", () => {
    mockUseParams.mockReturnValue({ id: undefined });

    render(<MovieDetails />, { wrapper: TestWrapper });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should navigate to home when id is not a number", () => {
    mockUseParams.mockReturnValue({ id: "not-a-number" });

    render(<MovieDetails />, { wrapper: TestWrapper });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should navigate to home when id is empty string", () => {
    mockUseParams.mockReturnValue({ id: "" });

    render(<MovieDetails />, { wrapper: TestWrapper });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should handle retry functionality and reload the page", async () => {
    // Mock window.location.reload for this test
    Object.defineProperty(window, "location", {
      value: { reload: mockReload },
      writable: true,
    });

    mockGetMovieDetails.mockRejectedValueOnce(new Error("API Error"));

    render(<MovieDetails />, { wrapper: TestWrapper });

    // Wait for error state to appear
    await waitFor(() => {
      expect(
        screen.getByText(/Erro ao carregar detalhes do filme/)
      ).toBeInTheDocument();
    });

    // Find and click the retry button
    const retryButton = screen.getByRole("button", {
      name: /tentar novamente/i,
    });
    fireEvent.click(retryButton);

    // Should call window.location.reload()
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it("should handle retry with valid movieId", async () => {
    // Mock window.location.reload for this test
    Object.defineProperty(window, "location", {
      value: { reload: mockReload },
      writable: true,
    });

    mockUseParams.mockReturnValue({ id: "123" });
    mockGetMovieDetails.mockRejectedValueOnce(new Error("API Error"));

    render(<MovieDetails />, { wrapper: TestWrapper });

    // Wait for error state to appear
    await waitFor(() => {
      expect(
        screen.getByText(/Erro ao carregar detalhes do filme/)
      ).toBeInTheDocument();
    });

    // Find and click the retry button
    const retryButton = screen.getByRole("button", {
      name: /tentar novamente/i,
    });
    fireEvent.click(retryButton);

    // Should call window.location.reload() because movieId is valid (123)
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it("should not call reload when movieId is 0", async () => {
    mockUseParams.mockReturnValue({ id: "0" });
    mockGetMovieDetails.mockRejectedValueOnce(new Error("API Error"));

    render(<MovieDetails />, { wrapper: TestWrapper });

    // Wait for error state to appear
    await waitFor(() => {
      expect(
        screen.getByText(/Erro ao carregar detalhes do filme/)
      ).toBeInTheDocument();
    });

    // Find and click the retry button - but there shouldn't be one since movieId is 0
    // The error should be "Filme não encontrado" without retry button
    expect(
      screen.queryByRole("button", { name: /tentar novamente/i })
    ).not.toBeInTheDocument();
  });

  it("should handle movie not found case (null response)", async () => {
    mockGetMovieDetails.mockResolvedValueOnce(null);

    render(<MovieDetails />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText(/Filme não encontrado/)).toBeInTheDocument();
    });

    // Should not have retry button for "not found" case
    expect(
      screen.queryByRole("button", { name: /tentar novamente/i })
    ).not.toBeInTheDocument();
  });

  it("should handle favorite button clicks correctly", async () => {
    const mockAddFavorite = jest.fn();
    const mockRemoveFavorite = jest.fn();
    const mockIsFavorite = jest.fn();

    mockUseMovies.mockReturnValue({
      state: {
        favorites: [],
        searchResults: [],
        loading: false,
        error: null,
        query: "",
      },
      dispatch: jest.fn(),
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite,
      isFavorite: mockIsFavorite,
    });

    // Start with not favorite
    mockIsFavorite.mockReturnValue(false);
    mockGetMovieDetails.mockResolvedValueOnce(mockMovieDetails);

    const { rerender } = render(<MovieDetails />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
    });

    // Find and click the favorite button
    const favoriteButton = screen.getByText(/Adicionar aos Favoritos/);
    fireEvent.click(favoriteButton);

    expect(mockAddFavorite).toHaveBeenCalledWith(mockMovieDetails);

    // Now test removing from favorites
    mockIsFavorite.mockReturnValue(true);

    rerender(<MovieDetails />);

    await waitFor(() => {
      const removeFavoriteButton = screen.getByText(/Remover dos Favoritos/);
      fireEvent.click(removeFavoriteButton);
    });

    expect(mockRemoveFavorite).toHaveBeenCalledWith(mockMovieDetails.id);
  });

  it("should handle favorite click when movie is null", async () => {
    const mockAddFavorite = jest.fn();
    const mockRemoveFavorite = jest.fn();

    mockUseMovies.mockReturnValue({
      state: {
        favorites: [],
        searchResults: [],
        loading: false,
        error: null,
        query: "",
      },
      dispatch: jest.fn(),
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite,
      isFavorite: jest.fn().mockReturnValue(false),
    });

    // Mock an error scenario where movie becomes null
    mockGetMovieDetails.mockResolvedValueOnce(null);

    render(<MovieDetails />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText(/Filme não encontrado/)).toBeInTheDocument();
    });

    // No favorite button should be present when movie is null
    expect(
      screen.queryByText(/Adicionar aos Favoritos/)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Remover dos Favoritos/)).not.toBeInTheDocument();
  });

  it("should render movie with all optional fields present", async () => {
    const fullMovieDetails = {
      ...mockMovieDetails,
      tagline: "The ultimate test",
      runtime: 150, // 2h 30m
      budget: 50000000,
      revenue: 100000000,
      production_companies: [
        { id: 1, name: "Test Studios" },
        { id: 2, name: "Another Studio" },
      ],
      genres: [
        { id: 1, name: "Action" },
        { id: 2, name: "Adventure" },
        { id: 3, name: "Sci-Fi" },
      ],
    };

    mockGetMovieDetails.mockResolvedValueOnce(fullMovieDetails);

    render(<MovieDetails />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
      expect(screen.getByText('"The ultimate test"')).toBeInTheDocument();
      expect(screen.getByText("2h 30m")).toBeInTheDocument();
      expect(
        screen.getByText("Test Studios, Another Studio")
      ).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
      expect(screen.getByText("Adventure")).toBeInTheDocument();
      expect(screen.getByText("Sci-Fi")).toBeInTheDocument();
    });
  });

  it("should render movie with missing optional fields", async () => {
    const minimalMovieDetails = {
      ...mockMovieDetails,
      tagline: null,
      runtime: null,
      budget: 0,
      revenue: 0,
      production_companies: [],
      genres: [],
    };

    mockGetMovieDetails.mockResolvedValueOnce(minimalMovieDetails);

    render(<MovieDetails />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
      // Tagline should not be rendered
      expect(
        screen.queryByText(/The best test movie ever/)
      ).not.toBeInTheDocument();
      // Runtime should not be rendered
      expect(screen.queryByText(/2h/)).not.toBeInTheDocument();
      // Budget and revenue sections should not be rendered
      expect(screen.queryByText("Orçamento")).not.toBeInTheDocument();
      expect(screen.queryByText("Receita")).not.toBeInTheDocument();
      // Production companies section should not be rendered
      expect(screen.queryByText("Produtoras")).not.toBeInTheDocument();
    });
  });
});
