import { MovieResponse, MovieDetails } from '@/types/movie';

let API_KEY: string;
let BASE_URL: string;
let IMAGE_BASE_URL: string;

if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
  API_KEY = 'test-api-key';
  BASE_URL = 'https://api.themoviedb.org/3';
  IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
} else if (typeof window !== 'undefined' && (window as unknown as { import?: { meta?: { env?: Record<string, string> } } }).import?.meta?.env) {
  const env = (window as unknown as { import: { meta: { env: Record<string, string> } } }).import.meta.env;
  API_KEY = env.VITE_TMDB_API_KEY || '';
  BASE_URL = env.VITE_TMDB_API_BASE_URL || 'https://api.themoviedb.org/3';
  IMAGE_BASE_URL = env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
} else {
  API_KEY = 'test-api-key';
  BASE_URL = 'https://api.themoviedb.org/3';
  IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
}

class TMDBService {
  private async request<T>(endpoint: string): Promise<T> {
    if (!API_KEY && typeof process !== 'undefined' && process.env?.NODE_ENV !== 'test') {
      throw new Error('TMDB API key not found. Please check your .env file.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data) {
        throw new Error('Empty response from TMDB API');
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - verifique sua conexão com a internet');
      }

      throw error;
    }
  }

  async getPopularMovies(page: number = 1): Promise<MovieResponse> {
    return this.request<MovieResponse>(`/movie/popular?page=${page}`);
  }

  async searchMovies(query: string, page: number = 1): Promise<MovieResponse> {
    const encodedQuery = encodeURIComponent(query);
    return this.request<MovieResponse>(
      `/search/movie?query=${encodedQuery}&page=${page}`
    );
  }

  async getMovieDetails(id: number): Promise<MovieDetails> {
    return this.request<MovieDetails>(`/movie/${id}`);
  }

  getImageUrl(path: string | null, size: string = 'w300'): string {
    if (!path) return '/placeholder.svg';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }

  getPosterUrl(posterPath: string | null): string {
    return this.getImageUrl(posterPath, 'w300');
  }

  getBackdropUrl(backdropPath: string | null): string {
    return this.getImageUrl(backdropPath, 'original');
  }
}

export const tmdbService = new TMDBService();

export const getPopularMovies = (page?: number) => tmdbService.getPopularMovies(page);
export const searchMovies = (query: string, page?: number) => tmdbService.searchMovies(query, page);
export const getMovieDetails = (id: number) => tmdbService.getMovieDetails(id);
export const getPosterUrl = (posterPath: string | null) => tmdbService.getPosterUrl(posterPath);
export const getBackdropUrl = (backdropPath: string | null) => tmdbService.getBackdropUrl(backdropPath);

export const __setApiKeyForTest = () => {
  // Mock implementation for tests
};

export const __clearApiKeyForTest = () => {
  // Mock implementation for tests
};
