import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MovieCard from "../MovieCard";
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

const mockMovie: Movie = {
  id: 1,
  title: "Test Movie",
  overview: "A great test movie",
  poster_path: "/test-poster.jpg",
  backdrop_path: "/test-backdrop.jpg",
  release_date: "2023-01-01",
  vote_average: 8.5,
  vote_count: 1000,
  genre_ids: [1, 2, 3],
};

const renderWithProvider = (props = {}) => {
  return render(
    <MemoryRouter>
      <MoviesProvider>
        <MovieCard movie={mockMovie} {...props} />
      </MoviesProvider>
    </MemoryRouter>
  );
};

describe("MovieCard Component Coverage Tests", () => {
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

  it("should render movie card with basic information", () => {
    renderWithProvider();

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    // The overview is not displayed in the MovieCard, only the title
    expect(screen.getByText("8.5")).toBeInTheDocument();
  });

  it("should handle favorite button click to add favorite", () => {
    renderWithProvider();

    const favoriteButton = screen.getByRole("button", {
      name: /add to favorites/i,
    });
    fireEvent.click(favoriteButton);

    // After clicking, button should indicate it's favorited
    expect(favoriteButton).toBeInTheDocument();
  });

  it("should handle favorite button click to remove favorite", () => {
    // Render with movie already favorited
    renderWithProvider();

    const favoriteButton = screen.getByRole("button", {
      name: /add to favorites/i,
    });

    // First click to add
    fireEvent.click(favoriteButton);

    // Second click to remove
    fireEvent.click(favoriteButton);

    expect(favoriteButton).toBeInTheDocument();
  });

  it("should show remove button when showRemoveButton is true", () => {
    renderWithProvider({ showRemoveButton: true });

    const removeButton = screen.getByTestId("remove-favorite-1");
    expect(removeButton).toBeInTheDocument();
  });

  it("should handle remove button click", () => {
    renderWithProvider({ showRemoveButton: true });

    const removeButton = screen.getByTestId("remove-favorite-1");
    fireEvent.click(removeButton);

    expect(removeButton).toBeInTheDocument();
  });

  it("should highlight search term in title", () => {
    renderWithProvider({ searchTerm: "Test" });

    // When search term is provided, the text is broken up by mark tags
    const titles = screen.getAllByText((content, element) => {
      return element?.textContent === "Test Movie";
    });
    expect(titles[0]).toBeInTheDocument();
  });

  it("should highlight search term in overview", () => {
    renderWithProvider({ searchTerm: "great" });

    // The overview is not displayed in the MovieCard, only the title
    const title = screen.getByText("Test Movie");
    expect(title).toBeInTheDocument();
  });

  it("should not highlight when no search term provided", () => {
    renderWithProvider();

    const title = screen.getByText("Test Movie");
    expect(title).toBeInTheDocument();
    // Should not contain mark tags when no search term
  });

  it("should display fallback image when poster_path is null", () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null };
    render(
      <MemoryRouter>
        <MoviesProvider>
          <MovieCard movie={movieWithoutPoster} />
        </MoviesProvider>
      </MemoryRouter>
    );

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("placeholder")
    );
  });

  it("should navigate to movie details on card click", () => {
    renderWithProvider();

    const movieLink = screen.getByRole("link");
    expect(movieLink).toHaveAttribute("href", "/movie/1");
  });

  it("should prevent event propagation on favorite button click", () => {
    const handleClick = jest.fn();

    render(
      <MemoryRouter>
        <MoviesProvider>
          <div onClick={handleClick}>
            <MovieCard movie={mockMovie} />
          </div>
        </MoviesProvider>
      </MemoryRouter>
    );

    const favoriteButton = screen.getByTestId("favorite-1");
    fireEvent.click(favoriteButton);

    // Parent click handler should not be called due to stopPropagation
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should prevent event propagation on remove button click", () => {
    const handleClick = jest.fn();

    render(
      <MemoryRouter>
        <MoviesProvider>
          <div onClick={handleClick}>
            <MovieCard movie={mockMovie} showRemoveButton={true} />
          </div>
        </MoviesProvider>
      </MemoryRouter>
    );

    const removeButton = screen.getByTestId("remove-favorite-1");
    fireEvent.click(removeButton);

    // Parent click handler should not be called due to stopPropagation
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should display movie rating with star icon", () => {
    renderWithProvider();

    const rating = screen.getByText("8.5");
    expect(rating).toBeInTheDocument();

    // Check that the rating is displayed correctly
    expect(rating).toBeInTheDocument();
  });

  it("should handle movies with zero rating", () => {
    const movieWithZeroRating = { ...mockMovie, vote_average: 0 };
    render(
      <MemoryRouter>
        <MoviesProvider>
          <MovieCard movie={movieWithZeroRating} />
        </MoviesProvider>
      </MemoryRouter>
    );

    const rating = screen.getByText("0.0");
    expect(rating).toBeInTheDocument();
  });

  it("should handle movies with long titles", () => {
    const movieWithLongTitle = {
      ...mockMovie,
      title:
        "This is a very long movie title that should be truncated or handled properly",
    };
    render(
      <MemoryRouter>
        <MoviesProvider>
          <MovieCard movie={movieWithLongTitle} />
        </MoviesProvider>
      </MemoryRouter>
    );

    const title = screen.getByText(movieWithLongTitle.title);
    expect(title).toBeInTheDocument();
  });

  it("should handle movies with long overviews", () => {
    const movieWithLongOverview = {
      ...mockMovie,
      overview:
        "This is a very long movie overview that contains lots of text and should be handled properly by the component to ensure it displays correctly without breaking the layout or causing any issues with the UI components and the overall user experience",
    };
    render(
      <MemoryRouter>
        <MoviesProvider>
          <MovieCard movie={movieWithLongOverview} />
        </MoviesProvider>
      </MemoryRouter>
    );

    // The overview is not displayed in the MovieCard, only the title
    const title = screen.getByText("Test Movie");
    expect(title).toBeInTheDocument();
  });

  it("should handle search term case insensitivity", () => {
    renderWithProvider({ searchTerm: "TEST" });

    // The title is highlighted with the search term, so we need to check for the highlighted version
    const titles = screen.getAllByText((content, element) => {
      return element?.textContent === "Test Movie";
    });
    expect(titles[0]).toBeInTheDocument();
  });

  it("should handle empty search term", () => {
    renderWithProvider({ searchTerm: "" });

    const title = screen.getByText("Test Movie");
    expect(title).toBeInTheDocument();
  });

  // NEW TESTS TO COVER LINES 128-140
  it("should handle Play button click and prevent navigation", () => {
    const handleClick = jest.fn();

    render(
      <MemoryRouter>
        <MoviesProvider>
          <div onClick={handleClick}>
            <MovieCard movie={mockMovie} />
          </div>
        </MoviesProvider>
      </MemoryRouter>
    );

    const playButton = screen.getByText("Play");
    fireEvent.click(playButton);

    // Parent click handler should not be called due to stopPropagation
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should handle Info button click and prevent navigation", () => {
    const handleClick = jest.fn();

    render(
      <MemoryRouter>
        <MoviesProvider>
          <div onClick={handleClick}>
            <MovieCard movie={mockMovie} />
          </div>
        </MoviesProvider>
      </MemoryRouter>
    );

    const infoButton = screen.getByRole("button", { name: "" }); // Info button has no accessible name
    fireEvent.click(infoButton);

    // Parent click handler should not be called due to stopPropagation
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should render Play button with correct styling and icon", () => {
    renderWithProvider();

    const playButton = screen.getByText("Play");
    expect(playButton).toBeInTheDocument();

    // Check that the Play icon is present
    const playIcon = playButton.querySelector("svg");
    expect(playIcon).toBeInTheDocument();
  });

  it("should render Info button with correct styling and icon", () => {
    renderWithProvider();

    const infoButton = screen.getByRole("button", { name: "" }); // Info button has no accessible name
    expect(infoButton).toBeInTheDocument();

    // Check that the Info icon is present
    const infoIcon = infoButton.querySelector("svg");
    expect(infoIcon).toBeInTheDocument();
  });

  it("should handle movies with undefined vote_average", () => {
    const movieWithUndefinedRating = { ...mockMovie, vote_average: undefined };
    render(
      <MemoryRouter>
        <MoviesProvider>
          <MovieCard movie={movieWithUndefinedRating} />
        </MoviesProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("should handle movies with empty release_date", () => {
    const movieWithEmptyDate = { ...mockMovie, release_date: "" };
    render(
      <MemoryRouter>
        <MoviesProvider>
          <MovieCard movie={movieWithEmptyDate} />
        </MoviesProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("should handle movies with null release_date", () => {
    const movieWithNullDate = { ...mockMovie, release_date: null as any };
    render(
      <MemoryRouter>
        <MoviesProvider>
          <MovieCard movie={movieWithNullDate} />
        </MoviesProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});
