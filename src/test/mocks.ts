import { Movie, MovieResponse, MovieDetails } from '@/types/movie';

export const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  overview: 'A test movie overview',
  poster_path: '/test-poster.jpg',
  backdrop_path: '/test-backdrop.jpg',
  release_date: '2024-01-01',
  vote_average: 8.5,
  vote_count: 1000,
  genre_ids: [28, 12],
};

export const mockMovieDetails: MovieDetails = {
  ...mockMovie,
  genres: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' }
  ],
  runtime: 120,
  status: 'Released',
  tagline: 'The best test movie ever',
  budget: 100000000,
  revenue: 200000000,
  production_companies: [
    {
      id: 1,
      name: 'Test Studios',
      logo_path: '/test-logo.jpg'
    }
  ]
};

export const mockMovieResponse: MovieResponse = {
  page: 1,
  results: [mockMovie],
  total_pages: 1,
  total_results: 1,
};

export const mockEmptyMovieResponse: MovieResponse = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};