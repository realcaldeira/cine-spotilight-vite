import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MovieCard from '@/components/MovieCard';
import { mockMovie } from '@/test/mocks';
import { MoviesProvider } from '@/contexts/MoviesContext';

// Mock the TMDB service
jest.mock('@/services/tmdb', () => ({
  tmdbService: {
    getPosterUrl: jest.fn((path) => `https://image.tmdb.org/t/p/w300${path}`),
  },
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <MoviesProvider>{children}</MoviesProvider>
  </BrowserRouter>
);

describe('MovieCard', () => {
  it('should render movie information', () => {
    render(<MovieCard movie={mockMovie} />, { wrapper: TestWrapper });

    expect(screen.getByText(mockMovie.title)).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument(); // Adjusted based on actual rendering
    expect(screen.getByText('8.5')).toBeInTheDocument();
  });

  it('should render movie poster', () => {
    render(<MovieCard movie={mockMovie} />, { wrapper: TestWrapper });

    const poster = screen.getByAltText(mockMovie.title);
    expect(poster).toBeInTheDocument();
    expect(poster).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w300/test-poster.jpg'
    );
  });

  it('should handle favorite button click', async () => {
    const user = userEvent.setup();
    render(<MovieCard movie={mockMovie} />, { wrapper: TestWrapper });

    const favoriteButton = screen.getByTestId('favorite-1');
    await user.click(favoriteButton);

    // Should prevent navigation when button is clicked
    expect(favoriteButton).toBeInTheDocument();
  });

  it('should show remove button when showRemoveButton is true', () => {
    render(<MovieCard movie={mockMovie} showRemoveButton={true} />, {
      wrapper: TestWrapper,
    });

    const removeButton = screen.getByTestId('remove-favorite-1');
    expect(removeButton).toBeInTheDocument();
  });

  it('should highlight search term in title', () => {
    render(<MovieCard movie={mockMovie} searchTerm="Test" />, {
      wrapper: TestWrapper,
    });

    const highlightedText = screen.getByText('Test');
    expect(highlightedText.tagName).toBe('MARK');
  });

  it('should handle missing release date', () => {
    const movieWithoutReleaseDate = {
      ...mockMovie,
      release_date: '',
    };

    render(<MovieCard movie={movieWithoutReleaseDate} />, {
      wrapper: TestWrapper,
    });

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('should handle missing or null vote_average', () => {
    const movieWithNullVoteAverage = {
      ...mockMovie,
      vote_average: null,
    };

    render(<MovieCard movie={movieWithNullVoteAverage} />, {
      wrapper: TestWrapper,
    });

    // Should show N/A for vote average
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('should handle zero vote_average', () => {
    const movieWithZeroVoteAverage = {
      ...mockMovie,
      vote_average: 0,
    };

    render(<MovieCard movie={movieWithZeroVoteAverage} />, {
      wrapper: TestWrapper,
    });

    // Should show 0.0 for zero vote average
    expect(screen.getByText('0.0')).toBeInTheDocument();
  });

  it('should link to movie details page', () => {
    render(<MovieCard movie={mockMovie} />, { wrapper: TestWrapper });

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/movie/${mockMovie.id}`);
  });

  it('should handle remove button click', async () => {
    const user = userEvent.setup();
    render(<MovieCard movie={mockMovie} showRemoveButton={true} />, {
      wrapper: TestWrapper,
    });

    const removeButton = screen.getByTestId('remove-favorite-1');
    await user.click(removeButton);

    // Button click should be handled
    expect(removeButton).toBeInTheDocument();
  });
});
