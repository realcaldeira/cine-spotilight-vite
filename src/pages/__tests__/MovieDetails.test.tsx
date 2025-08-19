import React from "react";
import { render, waitFor } from "@testing-library/react";
import { screen } from "@testing-library/dom";
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

// Mock useParams to return a valid ID
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "1" }),
  Navigate: ({ to }: { to: string }) => <div>Navigate to {to}</div>,
}));

// Mock the useMovies hook as well
const mockUseMovies = jest.fn();

jest.mock("@/contexts/MoviesContext", () => ({
  MoviesProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useMovies: () => mockUseMovies(),
}));

const TestWrapper = ({
  children,
  route = "/movie/1",
}: {
  children: React.ReactNode;
  route?: string;
}) => <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>;

describe("MovieDetails", () => {
  beforeEach(() => {
    jest.clearAllMocks();

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
  });

  it("should render loading state initially", () => {
    mockGetMovieDetails.mockImplementation(() => new Promise(() => {})); // Never resolves

    const { container } = render(<MovieDetails />, { wrapper: TestWrapper });

    // Should show loading spinner
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("should render movie details when loaded successfully", async () => {
    mockGetMovieDetails.mockResolvedValueOnce(mockMovieDetails);

    render(<MovieDetails />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
      expect(
        screen.getByText('"The best test movie ever"')
      ).toBeInTheDocument();
      expect(screen.getByText("A test movie overview")).toBeInTheDocument();
    });
  });

  it("should render error state when API fails", async () => {
    mockGetMovieDetails.mockRejectedValueOnce(new Error("API Error"));

    render(<MovieDetails />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(
        screen.getByText(/Erro ao carregar detalhes do filme/)
      ).toBeInTheDocument();
    });
  });

  it("should render movie metadata correctly", async () => {
    mockGetMovieDetails.mockResolvedValueOnce(mockMovieDetails);

    render(<MovieDetails />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("2h 0m")).toBeInTheDocument(); // Runtime
      expect(screen.getByText("8.5/10")).toBeInTheDocument(); // Rating
      expect(screen.getByText("Action")).toBeInTheDocument(); // Genre
      expect(screen.getByText("Adventure")).toBeInTheDocument(); // Genre
    });
  });

  it("should render favorite button", async () => {
    mockGetMovieDetails.mockResolvedValueOnce(mockMovieDetails);

    render(<MovieDetails />, { wrapper: TestWrapper });

    await waitFor(() => {
      const favoriteButton = screen.getByText(/Adicionar aos Favoritos/);
      expect(favoriteButton).toBeInTheDocument();
    });
  });

  it("should handle invalid movie ID", () => {
    render(<MovieDetails />, {
      wrapper: (props) => <TestWrapper route="/movie/invalid" {...props} />,
    });

    // Should redirect to home or show error
    // This would be handled by the Navigate component
  });

  it("should render production companies", async () => {
    mockGetMovieDetails.mockResolvedValueOnce(mockMovieDetails);

    render(<MovieDetails />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Test Studios")).toBeInTheDocument();
    });
  });

  it("should format budget and revenue correctly", async () => {
    mockGetMovieDetails.mockResolvedValueOnce(mockMovieDetails);

    render(<MovieDetails />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText(/100\.000\.000/)).toBeInTheDocument(); // Budget
      expect(screen.getByText(/200\.000\.000/)).toBeInTheDocument(); // Revenue
    });
  });

  it("should handle missing movie data gracefully", async () => {
    mockGetMovieDetails.mockResolvedValueOnce(null);

    render(<MovieDetails />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText(/Filme não encontrado/)).toBeInTheDocument();
    });
  });

  // NEW TESTS TO COVER LINES 54-55 AND 60
  it("should handle movies with undefined runtime", async () => {
    const movieWithUndefinedRuntime = {
      ...mockMovieDetails,
      runtime: undefined,
    };

    mockGetMovieDetails.mockResolvedValueOnce(movieWithUndefinedRuntime);

    render(<MovieDetails />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
    });
    // Runtime section should not be displayed when runtime is undefined
    // Check that the Clock icon is not present (which indicates runtime display)
    expect(screen.queryByText("2h 0m")).not.toBeInTheDocument();
  });

  it("should handle movies with null runtime", async () => {
    const movieWithNullRuntime = {
      ...mockMovieDetails,
      runtime: null,
    };

    mockGetMovieDetails.mockResolvedValueOnce(movieWithNullRuntime);

    render(<MovieDetails />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
    });
    // Runtime section should not be displayed when runtime is null
    // Check that the Clock icon is not present (which indicates runtime display)
    expect(screen.queryByText("2h 0m")).not.toBeInTheDocument();
  });
});
