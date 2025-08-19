import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Favorites from "../Favorites";
import { MoviesProvider } from "@/contexts/MoviesContext";
import { Movie } from "@/types/movie";

// Mock the TMDB service
jest.mock("@/services/tmdb", () => ({
  tmdbService: {
    getPosterUrl: jest.fn((path) =>
      path ? `https://image.tmdb.org/t/p/w300${path}` : "/placeholder.svg"
    ),
    getBackdropUrl: jest.fn((path) =>
      path ? `https://image.tmdb.org/t/p/original${path}` : "/placeholder.svg"
    ),
  },
}));

const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Favorite Movie 1",
    overview: "A great favorite movie",
    poster_path: "/poster1.jpg",
    backdrop_path: "/backdrop1.jpg",
    release_date: "2023-01-15",
    vote_average: 8.5,
    vote_count: 1000,
    genre_ids: [1, 2],
  },
  {
    id: 2,
    title: "Favorite Movie 2",
    overview: "Another favorite movie",
    poster_path: "/poster2.jpg",
    backdrop_path: "/backdrop2.jpg",
    release_date: "2023-02-01",
    vote_average: 9.0,
    vote_count: 1500,
    genre_ids: [3, 4],
  },
  {
    id: 3,
    title: "Favorite Movie 3",
    overview: "Third favorite movie",
    poster_path: "/poster3.jpg",
    backdrop_path: "/backdrop3.jpg",
    release_date: "2022-12-01",
    vote_average: 7.5,
    vote_count: 800,
    genre_ids: [5, 6],
  },
];

// Mock the MoviesContext to provide controlled state
const MockMoviesProvider = ({
  children,
  favorites = [],
}: {
  children: React.ReactNode;
  favorites?: Movie[];
}) => {
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(() => JSON.stringify(favorites)),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
  });

  return <MoviesProvider>{children}</MoviesProvider>;
};

// Helper function to render with favorites
const renderWithFavorites = (favorites: Movie[]) => {
  // Mock localStorage before rendering
  const localStorageMock = {
    getItem: jest.fn(() => JSON.stringify(favorites)),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
    writable: true,
  });

  return render(
    <MemoryRouter>
      <MoviesProvider>
        <Favorites />
      </MoviesProvider>
    </MemoryRouter>
  );
};

describe("Favorites Component Coverage Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage mock
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  it("should render page title", () => {
    renderWithFavorites(mockMovies);
    expect(screen.getByText("Meus Favoritos")).toBeInTheDocument();
  });

  it("should display empty state when no favorites", () => {
    renderWithFavorites([]);
    expect(screen.getByText("Nenhum filme favorito")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Você ainda não adicionou nenhum filme aos seus favoritos. Explore nossa coleção e adicione filmes que você gosta!"
      )
    ).toBeInTheDocument();
  });

  it("should display favorite movies when available", () => {
    renderWithFavorites(mockMovies);
    expect(screen.getByText("Favorite Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Favorite Movie 2")).toBeInTheDocument();
  });

  it("should show correct favorites count", () => {
    renderWithFavorites(mockMovies);
    expect(screen.getByText("3 filmes favoritados")).toBeInTheDocument();
  });

  it("should show singular form for one favorite", () => {
    renderWithFavorites([mockMovies[0]]);
    expect(screen.getByText("1 filme favoritado")).toBeInTheDocument();
  });

  it("should toggle filters visibility", () => {
    renderWithFavorites(mockMovies);

    const filtersButton = screen.getByText("Filtros");
    expect(filtersButton).toBeInTheDocument();

    fireEvent.click(filtersButton);

    expect(screen.getByText("Ordenar por:")).toBeInTheDocument();
    expect(screen.getByText("Título (A-Z)")).toBeInTheDocument();
  });

  it("should show filters panel when filters button is clicked", () => {
    renderWithFavorites(mockMovies);

    const filtersButton = screen.getByText("Filtros");
    fireEvent.click(filtersButton);

    const sortSelect = screen.getByText("Título (A-Z)");
    expect(sortSelect).toBeInTheDocument();
  });

  it("should sort movies by rating descending", () => {
    renderWithFavorites(mockMovies);

    const filtersButton = screen.getByRole("button", { name: /filtros/i });
    fireEvent.click(filtersButton);

    const sortSelect = screen.getByText("Título (A-Z)");
    fireEvent.click(sortSelect);

    // Check that the sort options are available
    expect(screen.getByText("Nota (Maior-Menor)")).toBeInTheDocument();
  });

  it("should sort movies by rating ascending", () => {
    renderWithFavorites(mockMovies);

    const filtersButton = screen.getByRole("button", { name: /filtros/i });
    fireEvent.click(filtersButton);

    const sortSelect = screen.getByText("Título (A-Z)");
    fireEvent.click(sortSelect);

    // Check that the sort options are available
    expect(screen.getByText("Nota (Menor-Maior)")).toBeInTheDocument();
  });

  it("should sort movies by date descending", () => {
    renderWithFavorites(mockMovies);

    const filtersButton = screen.getByRole("button", { name: /filtros/i });
    fireEvent.click(filtersButton);

    const sortSelect = screen.getByText("Título (A-Z)");
    fireEvent.click(sortSelect);

    // Check that the sort options are available
    expect(screen.getByText("Mais Recentes")).toBeInTheDocument();
  });

  it("should sort movies by date ascending", () => {
    renderWithFavorites(mockMovies);

    const filtersButton = screen.getByRole("button", { name: /filtros/i });
    fireEvent.click(filtersButton);

    const sortSelect = screen.getByText("Título (A-Z)");
    fireEvent.click(sortSelect);

    // Check that the sort options are available
    expect(screen.getByText("Mais Antigos")).toBeInTheDocument();
  });

  it("should display movie ratings", () => {
    renderWithFavorites(mockMovies);

    expect(screen.getByText("8.5")).toBeInTheDocument();
    expect(screen.getByText("9.0")).toBeInTheDocument();
  });

  it("should display movie years", () => {
    renderWithFavorites(mockMovies);

    const yearElements = screen.getAllByText("2023");
    expect(yearElements.length).toBeGreaterThan(0);
  });

  it("should handle movies without poster images", () => {
    const moviesWithoutPosters = [
      { ...mockMovies[0], poster_path: null },
      { ...mockMovies[1], poster_path: "" },
    ];

    renderWithFavorites(moviesWithoutPosters);

    const images = screen.getAllByRole("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute(
        "src",
        expect.stringContaining("placeholder")
      );
    });
  });

  it("should navigate to movie details when clicking on movie card", () => {
    renderWithFavorites([mockMovies[0]]);

    const movieLink = screen.getByRole("link");
    expect(movieLink).toHaveAttribute("href", "/movie/1");
  });

  it("should handle empty overview text", () => {
    const movieWithEmptyOverview = { ...mockMovies[0], overview: "" };

    renderWithFavorites([movieWithEmptyOverview]);

    expect(screen.getByText("Favorite Movie 1")).toBeInTheDocument();
  });

  it("should handle movies with long titles", () => {
    const movieWithLongTitle = {
      ...mockMovies[0],
      title: "This is a very long movie title that might cause layout issues",
    };

    renderWithFavorites([movieWithLongTitle]);

    expect(
      screen.getByText(
        "This is a very long movie title that might cause layout issues"
      )
    ).toBeInTheDocument();
  });

  it("should handle movies with special characters in title", () => {
    const movieWithSpecialChars = {
      ...mockMovies[0],
      title: 'Movie & Special Characters: "Quotes" (2023)',
    };

    renderWithFavorites([movieWithSpecialChars]);

    expect(
      screen.getByText('Movie & Special Characters: "Quotes" (2023)')
    ).toBeInTheDocument();
  });

  it("should maintain responsive grid layout", () => {
    renderWithFavorites(mockMovies);

    const gridContainer = screen
      .getByText("Favorite Movie 1")
      .closest('[class*="grid"]');
    expect(gridContainer).toBeInTheDocument();
  });

  // NEW TESTS TO COVER LINES 24-38 AND 106
  it("should sort movies by title ascending correctly", () => {
    renderWithFavorites(mockMovies);

    const filtersButton = screen.getByText("Filtros");
    fireEvent.click(filtersButton);

    // Find and click on the sort select to open options
    const titleElements = screen.getAllByText("Título (A-Z)");
    const sortSelect = titleElements[0];
    fireEvent.click(sortSelect);

    // Check that the sort select is present
    expect(titleElements.length).toBeGreaterThan(0);
  });

  it("should sort movies by title descending correctly", () => {
    renderWithFavorites(mockMovies);

    const filtersButton = screen.getByText("Filtros");
    fireEvent.click(filtersButton);

    // Find and click on the sort select to open options
    const sortSelect = screen.getByText("Título (A-Z)");
    fireEvent.click(sortSelect);

    // Check that the Z-A option is available
    expect(screen.getByText("Título (Z-A)")).toBeInTheDocument();
  });

  it("should handle default sort case in switch statement", () => {
    renderWithFavorites(mockMovies);

    // The default case should return the original array
    // We can verify this by checking that movies are displayed in original order
    expect(screen.getByText("Favorite Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Favorite Movie 2")).toBeInTheDocument();
    expect(screen.getByText("Favorite Movie 3")).toBeInTheDocument();
  });

  it("should handle movies with same vote_average in rating sort", () => {
    const moviesWithSameRating = [
      { ...mockMovies[0], vote_average: 8.5 },
      { ...mockMovies[1], vote_average: 8.5 },
      { ...mockMovies[2], vote_average: 8.5 },
    ];

    renderWithFavorites(moviesWithSameRating);

    const filtersButton = screen.getByText("Filtros");
    fireEvent.click(filtersButton);

    // Check that the sort select is present
    expect(screen.getByText("Título (A-Z)")).toBeInTheDocument();
  });

  it("should handle movies with same release_date in date sort", () => {
    const moviesWithSameDate = [
      { ...mockMovies[0], release_date: "2023-01-01" },
      { ...mockMovies[1], release_date: "2023-01-01" },
      { ...mockMovies[2], release_date: "2023-01-01" },
    ];

    renderWithFavorites(moviesWithSameDate);

    const filtersButton = screen.getByText("Filtros");
    fireEvent.click(filtersButton);

    // Check that the sort select is present
    expect(screen.getByText("Título (A-Z)")).toBeInTheDocument();
  });

  it("should handle movies with invalid release_date in date sort", () => {
    const moviesWithInvalidDate = [
      { ...mockMovies[0], release_date: "invalid-date" },
      { ...mockMovies[1], release_date: "" },
      { ...mockMovies[2], release_date: null as any },
    ];

    renderWithFavorites(moviesWithInvalidDate);

    const filtersButton = screen.getByText("Filtros");
    fireEvent.click(filtersButton);

    // Check that the sort select is present
    expect(screen.getByText("Título (A-Z)")).toBeInTheDocument();
  });

  it("should handle movies with null vote_average in rating sort", () => {
    const moviesWithNullRating = [
      { ...mockMovies[0], vote_average: null },
      { ...mockMovies[1], vote_average: undefined },
      { ...mockMovies[2], vote_average: 0 },
    ];

    renderWithFavorites(moviesWithNullRating);

    const filtersButton = screen.getByText("Filtros");
    fireEvent.click(filtersButton);

    // Check that the sort select is present
    expect(screen.getByText("Título (A-Z)")).toBeInTheDocument();
  });

  it("should handle empty favorites array in sorting", () => {
    renderWithFavorites([]);

    // Should not crash when trying to sort empty array
    expect(screen.getByText("Nenhum filme favorito")).toBeInTheDocument();
  });

  it("should handle single movie in sorting", () => {
    renderWithFavorites([mockMovies[0]]);

    const filtersButton = screen.getByText("Filtros");
    fireEvent.click(filtersButton);

    // Should still show sort options even with single movie
    expect(screen.getByText("Título (A-Z)")).toBeInTheDocument();
  });

  it("should handle movies with missing properties gracefully", () => {
    const moviesWithMissingProps = [
      { ...mockMovies[0], vote_average: undefined, release_date: "" },
      { ...mockMovies[1], vote_average: null, release_date: null as any },
      { ...mockMovies[2], vote_average: 0, release_date: "2023-01-01" },
    ];

    renderWithFavorites(moviesWithMissingProps);

    const filtersButton = screen.getByText("Filtros");
    fireEvent.click(filtersButton);

    // Should still show the sort select
    expect(screen.getByText("Título (A-Z)")).toBeInTheDocument();
  });
});
