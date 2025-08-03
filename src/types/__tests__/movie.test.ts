import { Movie, Genre, MovieResponse, MovieDetails } from '../movie';

describe('Movie type definitions', () => {
  it('should have proper Movie interface structure', () => {
    const movie: Movie = {
      id: 1,
      title: 'Test Movie',
      overview: 'Test overview',
      poster_path: '/test.jpg',
      backdrop_path: '/backdrop.jpg',
      release_date: '2024-01-01',
      vote_average: 8.5,
      vote_count: 100,
      genre_ids: [1, 2, 3],
    };

    expect(movie).toBeDefined();
    expect(typeof movie.id).toBe('number');
    expect(typeof movie.title).toBe('string');
    expect(typeof movie.overview).toBe('string');
    expect(typeof movie.vote_average).toBe('number');
    expect(Array.isArray(movie.genre_ids)).toBe(true);
  });

  it('should allow optional fields to be undefined', () => {
    const minimalMovie: Movie = {
      id: 1,
      title: 'Test Movie',
      overview: 'Test overview',
      poster_path: null,
      backdrop_path: null,
      release_date: '2024-01-01',
      vote_average: 8.5,
      vote_count: 100,
      genre_ids: [1, 2, 3],
    };

    expect(minimalMovie).toBeDefined();
    expect(minimalMovie.poster_path).toBeNull();
    expect(minimalMovie.backdrop_path).toBeNull();
  });

  it('should have proper Genre interface structure', () => {
    const genre: Genre = {
      id: 1,
      name: 'Action',
    };

    expect(genre).toBeDefined();
    expect(typeof genre.id).toBe('number');
    expect(typeof genre.name).toBe('string');
  });

  it('should have proper MovieResponse interface structure', () => {
    const response: MovieResponse = {
      page: 1,
      results: [],
      total_pages: 10,
      total_results: 200,
    };

    expect(response).toBeDefined();
    expect(typeof response.page).toBe('number');
    expect(Array.isArray(response.results)).toBe(true);
    expect(typeof response.total_pages).toBe('number');
    expect(typeof response.total_results).toBe('number');
  });

  it('should have proper MovieDetails interface extending Movie', () => {
    const movieDetails: MovieDetails = {
      id: 1,
      title: 'Test Movie',
      overview: 'Test overview',
      poster_path: '/test.jpg',
      backdrop_path: '/backdrop.jpg',
      release_date: '2024-01-01',
      vote_average: 8.5,
      vote_count: 100,
      genre_ids: [1, 2, 3],
      genres: [{ id: 1, name: 'Action' }],
      runtime: 120,
      status: 'Released',
      tagline: 'Amazing movie',
      budget: 1000000,
      revenue: 5000000,
      production_companies: [
        {
          id: 1,
          name: 'Test Company',
          logo_path: '/logo.jpg',
        },
      ],
    };

    expect(movieDetails).toBeDefined();
    expect(Array.isArray(movieDetails.genres)).toBe(true);
    expect(typeof movieDetails.runtime).toBe('number');
    expect(typeof movieDetails.status).toBe('string');
    expect(typeof movieDetails.tagline).toBe('string');
    expect(typeof movieDetails.budget).toBe('number');
    expect(typeof movieDetails.revenue).toBe('number');
    expect(Array.isArray(movieDetails.production_companies)).toBe(true);
  });
});
