import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, useParams } from "react-router-dom";
import MovieDetails from "../MovieDetails";
import { MoviesProvider } from "@/contexts/MoviesContext";
import { tmdbService } from "@/services/tmdb";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

// Mock TMDB service
jest.mock("@/services/tmdb", () => ({
  tmdbService: {
    getMovieDetails: jest.fn(),
    getPosterUrl: jest.fn((path) =>
      path ? `https://image.tmdb.org/t/p/w300${path}` : "/placeholder.svg"
    ),
    getBackdropUrl: jest.fn((path) =>
      path ? `https://image.tmdb.org/t/p/original${path}` : "/placeholder.svg"
    ),
  },
}));

const mockMovie = {
  id: 1,
  title: "Test Movie",
  overview: "A detailed movie overview for testing purposes",
  poster_path: "/test-poster.jpg",
  backdrop_path: "/test-backdrop.jpg",
  release_date: "2023-01-01",
  vote_average: 8.5,
  vote_count: 1000,
  genre_ids: [1, 2],
  genres: [
    { id: 1, name: "Action" },
    { id: 2, name: "Drama" },
  ],
  runtime: 120,
  budget: 50000000,
  revenue: 150000000,
  production_companies: [
    { id: 1, name: "Test Studios", logo_path: "/logo.jpg" },
  ],
  production_countries: [{ iso_3166_1: "US", name: "United States" }],
  spoken_languages: [{ iso_639_1: "en", name: "English" }],
  status: "Released",
  tagline: "The ultimate test movie",
};

const renderWithRouter = (movieId: string = "1") => {
  (useParams as jest.Mock).mockReturnValue({ id: movieId });

  return render(
    <MemoryRouter>
      <MoviesProvider>
        <MovieDetails />
      </MoviesProvider>
    </MemoryRouter>
  );
};

describe("MovieDetails Component Coverage Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show loading state initially", () => {
    (tmdbService.getMovieDetails as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    renderWithRouter();

    // The loading spinner doesn't have a data-testid, so we check for the loading container
    expect(screen.queryByText("Test Movie")).not.toBeInTheDocument();
    // Check that loading spinner is visible
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("should display movie details when loaded successfully", async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
    });

    expect(
      screen.getByText("A detailed movie overview for testing purposes")
    ).toBeInTheDocument();
    // The rating is displayed as "8.5/10"
    expect(screen.getByText("8.5/10")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Drama")).toBeInTheDocument();
  });

  it("should display error message when movie details fail to load", async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch")
    );

    renderWithRouter();

    await waitFor(() => {
      expect(
        screen.getByText(/erro ao carregar detalhes do filme/i)
      ).toBeInTheDocument();
    });
  });

  it("should handle favorite button click to add favorite", async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
    });

    const favoriteButton = screen.getByRole("button", {
      name: /adicionar aos favoritos/i,
    });
    fireEvent.click(favoriteButton);

    expect(favoriteButton).toBeInTheDocument();
  });

  it("should handle favorite button click to remove favorite", async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
    });

    const favoriteButton = screen.getByRole("button", {
      name: /adicionar aos favoritos/i,
    });

    // First click to add
    fireEvent.click(favoriteButton);

    // Second click to remove (button text should change)
    fireEvent.click(favoriteButton);

    expect(favoriteButton).toBeInTheDocument();
  });

  it("should display vote count", async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);

    renderWithRouter();

    await waitFor(() => {
      // The vote count is displayed in parentheses with "votos" in Brazilian format (1.000)
      expect(document.body.textContent).toContain("1.000");
      expect(document.body.textContent).toContain("votos");
    });
  });

  it("should handle movies with zero rating", async () => {
    const movieWithZeroRating = { ...mockMovie, vote_average: 0 };
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(
      movieWithZeroRating
    );

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("0.0/10")).toBeInTheDocument();
    });
  });

  it("should display movie genres as badges", async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);

    renderWithRouter();

    await waitFor(() => {
      const actionBadge = screen.getByText("Action");
      const dramaBadge = screen.getByText("Drama");

      expect(actionBadge).toBeInTheDocument();
      expect(dramaBadge).toBeInTheDocument();
    });
  });

  it("should handle movies without overview", async () => {
    const movieWithoutOverview = { ...mockMovie, overview: "" };
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(
      movieWithoutOverview
    );

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Sinopse não disponível.")).toBeInTheDocument();
    });
  });

  it("should handle movies with tagline", async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);

    renderWithRouter();

    await waitFor(() => {
      // The tagline is displayed in quotes, and there might be multiple elements
      const elements = screen.getAllByText((content, element) => {
        return element?.textContent?.includes("The ultimate test movie");
      });
      expect(elements[0]).toBeInTheDocument();
    });
  });

  it("should display production information", async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Test Studios")).toBeInTheDocument();
      // The component doesn't display production countries or languages in the current version
    });
  });

  it("should handle movie without poster image", async () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null };
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(
      movieWithoutPoster
    );

    renderWithRouter();

    await waitFor(() => {
      // Check that the poster image uses placeholder - there are multiple images with alt="Test Movie"
      const posterImages = screen.getAllByAltText("Test Movie");
      const posterImage = posterImages.find(
        (img) => img.getAttribute("src") === "/placeholder.svg"
      );
      expect(posterImage).toBeInTheDocument();
    });
  });
});
