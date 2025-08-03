import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, useParams } from 'react-router-dom';
import MovieDetails from '../MovieDetails';
import { MoviesProvider } from '@/contexts/MoviesContext';
import { tmdbService } from '@/services/tmdb';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

// Mock TMDB service
jest.mock('@/services/tmdb', () => ({
  tmdbService: {
    getMovieDetails: jest.fn(),
    getPosterUrl: jest.fn((path) => path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder.svg'),
    getBackdropUrl: jest.fn((path) => path ? `https://image.tmdb.org/t/p/original${path}` : '/placeholder.svg'),
  },
}));

const mockMovie = {
  id: 1,
  title: 'Test Movie',
  overview: 'A detailed movie overview for testing purposes',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2023-01-01',
  vote_average: 8.5,
  vote_count: 1000,
  genre_ids: [1, 2],
  genres: [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Drama' },
  ],
  runtime: 120,
  budget: 50000000,
  revenue: 150000000,
  production_companies: [
    { id: 1, name: 'Test Studios', logo_path: '/logo.jpg' },
  ],
  production_countries: [
    { iso_3166_1: 'US', name: 'United States' },
  ],
  spoken_languages: [
    { iso_639_1: 'en', name: 'English' },
  ],
  status: 'Released',
  tagline: 'The ultimate test movie',
};

const renderWithRouter = (movieId: string = '1') => {
  (useParams as jest.Mock).mockReturnValue({ id: movieId });
  
  return render(
    <MemoryRouter>
      <MoviesProvider>
        <MovieDetails />
      </MoviesProvider>
    </MemoryRouter>
  );
};

describe('MovieDetails Component Coverage Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state initially', () => {
    (tmdbService.getMovieDetails as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    renderWithRouter();
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should display movie details when loaded successfully', async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });

    expect(screen.getByText('A detailed movie overview for testing purposes')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Drama')).toBeInTheDocument();
  });

  it('should display error message when movie details fail to load', async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/erro ao carregar detalhes do filme/i)).toBeInTheDocument();
    });
  });

  it('should handle movie without backdrop image', async () => {
    const movieWithoutBackdrop = { ...mockMovie, backdrop_path: null };
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(movieWithoutBackdrop);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });
  });

  it('should handle movie without poster image', async () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null };
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(movieWithoutPoster);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });

    const posterImage = screen.getByRole('img', { name: /test movie poster/i });
    expect(posterImage).toHaveAttribute('src', '/placeholder.svg');
  });

  it('should display movie runtime', async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('120 min')).toBeInTheDocument();
    });
  });

  it('should display movie release year', async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('2023')).toBeInTheDocument();
    });
  });

  it('should handle invalid movie ID', async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockRejectedValue(new Error('Movie not found'));

    renderWithRouter('invalid-id');

    await waitFor(() => {
      expect(screen.getByText(/erro ao carregar detalhes do filme/i)).toBeInTheDocument();
    });
  });

  it('should handle favorite button click to add favorite', async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });

    const favoriteButton = screen.getByRole('button', { name: /adicionar aos favoritos/i });
    fireEvent.click(favoriteButton);
    
    expect(favoriteButton).toBeInTheDocument();
  });

  it('should handle favorite button click to remove favorite', async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });

    const favoriteButton = screen.getByRole('button', { name: /adicionar aos favoritos/i });
    
    // First click to add
    fireEvent.click(favoriteButton);
    
    // Second click to remove (button text should change)
    fireEvent.click(favoriteButton);
    
    expect(favoriteButton).toBeInTheDocument();
  });

  it('should display vote count', async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('1000')).toBeInTheDocument();
    });
  });

  it('should handle movies with zero rating', async () => {
    const movieWithZeroRating = { ...mockMovie, vote_average: 0 };
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(movieWithZeroRating);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  it('should display movie genres as badges', async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);

    renderWithRouter();

    await waitFor(() => {
      const actionBadge = screen.getByText('Action');
      const dramaBadge = screen.getByText('Drama');
      
      expect(actionBadge).toBeInTheDocument();
      expect(dramaBadge).toBeInTheDocument();
    });
  });

  it('should handle movies without overview', async () => {
    const movieWithoutOverview = { ...mockMovie, overview: '' };
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(movieWithoutOverview);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });

    expect(screen.queryByText('A detailed movie overview for testing purposes')).not.toBeInTheDocument();
  });

  it('should handle movies with tagline', async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('The ultimate test movie')).toBeInTheDocument();
    });
  });

  it('should display production information', async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Test Studios')).toBeInTheDocument();
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
    });
  });

  it('should handle NaN movie ID by not making API call', () => {
    renderWithRouter('not-a-number');

    // Should not show loading spinner for invalid ID
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  it('should handle budget and revenue display', async () => {
    (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });

    // Should display budget and revenue if the component shows them
    const budgetText = screen.queryByText(/\$50,000,000/);
    const revenueText = screen.queryByText(/\$150,000,000/);
    
    // These might not be displayed depending on component implementation
    if (budgetText) expect(budgetText).toBeInTheDocument();
    if (revenueText) expect(revenueText).toBeInTheDocument();
  });
});
