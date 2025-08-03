/**
 * @jest-environment jsdom
 */

// Mock global variables before importing modules
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_TMDB_API_KEY: 'test-api-key',
        VITE_TMDB_API_BASE_URL: 'https://api.themoviedb.org/3',
        VITE_TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
      },
    },
  },
  configurable: true,
});

// Mock services with proper typing
jest.mock('@/services/tmdb', () => ({
  tmdbService: {
    getPopularMovies: jest.fn(),
    searchMovies: jest.fn(),
    getMovieDetails: jest.fn(),
    getPosterUrl: jest.fn((path: string | null) => 
      path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder.svg'
    ),
    getBackdropUrl: jest.fn((path: string | null) => 
      path ? `https://image.tmdb.org/t/p/original${path}` : '/placeholder.svg'
    ),
  },
  getPopularMovies: jest.fn(),
  searchMovies: jest.fn(),
  getMovieDetails: jest.fn(),
  getPosterUrl: jest.fn(),
  getBackdropUrl: jest.fn(),
  __setApiKeyForTest: jest.fn(),
  __clearApiKeyForTest: jest.fn(),
}));
