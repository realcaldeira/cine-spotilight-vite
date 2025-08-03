import { MovieResponse, MovieDetails } from '@/types/movie';

// Simple service for tests that doesn't use import.meta
class TestTMDBService {
  private API_KEY = 'test-api-key';
  private BASE_URL = 'https://api.themoviedb.org/3';
  private IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

  async getPopularMovies(page: number = 1): Promise<MovieResponse> {
    // Mock implementation for tests
    return {
      page,
      results: [],
      total_pages: 1,
      total_results: 0,
    };
  }

  async searchMovies(query: string, page: number = 1): Promise<MovieResponse> {
    // Mock implementation for tests
    return {
      page,
      results: [],
      total_pages: 1,
      total_results: 0,
    };
  }

  async getMovieDetails(id: number): Promise<MovieDetails> {
    // Mock implementation for tests
    return {
      id,
      title: 'Test Movie',
      overview: 'Test overview',
      poster_path: '/test.jpg',
      backdrop_path: '/test-backdrop.jpg',
      release_date: '2023-01-01',
      vote_average: 7.5,
      vote_count: 1000,
      genre_ids: [1, 2, 3],
      genres: [{ id: 1, name: 'Action' }],
      runtime: 120,
      status: 'Released',
      tagline: 'Test tagline',
      budget: 1000000,
      revenue: 5000000,
      production_companies: [
        {
          id: 1,
          name: 'Test Studio',
          logo_path: '/logo.jpg',
        },
      ],
    };
  }

  getPosterUrl(posterPath: string | null): string {
    if (!posterPath) return '/placeholder.svg';
    return `${this.IMAGE_BASE_URL}/w300${posterPath}`;
  }

  getBackdropUrl(backdropPath: string | null): string {
    if (!backdropPath) return '/placeholder.svg';
    return `${this.IMAGE_BASE_URL}/original${backdropPath}`;
  }
}

export const testTmdbService = new TestTMDBService();

// Export individual functions for convenience
export const getPopularMovies = (page?: number) => testTmdbService.getPopularMovies(page);
export const searchMovies = (query: string, page?: number) => testTmdbService.searchMovies(query, page);
export const getMovieDetails = (id: number) => testTmdbService.getMovieDetails(id);
export const getPosterUrl = (posterPath: string | null) => testTmdbService.getPosterUrl(posterPath);
export const getBackdropUrl = (backdropPath: string | null) => testTmdbService.getBackdropUrl(backdropPath);

// Test utilities
export const __setApiKeyForTest = (_key: string) => {
  // Mock implementation for tests
};

export const __clearApiKeyForTest = () => {
  // Mock implementation for tests
};
