import {
  testTmdbService,
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  getPosterUrl,
  getBackdropUrl,
} from "../tmdb-test";

describe("TMDB Service Tests", () => {
  describe("testTmdbService", () => {
    it("should return popular movies", async () => {
      const result = await testTmdbService.getPopularMovies(1);

      expect(result).toHaveProperty("page", 1);
      expect(result).toHaveProperty("results");
      expect(result).toHaveProperty("total_pages");
      expect(result).toHaveProperty("total_results");
      expect(Array.isArray(result.results)).toBe(true);
    });

    it("should return popular movies with default page", async () => {
      const result = await testTmdbService.getPopularMovies();

      expect(result.page).toBe(1);
    });

    it("should search movies", async () => {
      const result = await testTmdbService.searchMovies("test query", 2);

      expect(result).toHaveProperty("page", 2);
      expect(result).toHaveProperty("results");
      expect(result).toHaveProperty("total_pages");
      expect(result).toHaveProperty("total_results");
    });

    it("should search movies with default page", async () => {
      const result = await testTmdbService.searchMovies("test query");

      expect(result.page).toBe(1);
    });

    it("should get movie details", async () => {
      const result = await testTmdbService.getMovieDetails(123);

      expect(result).toHaveProperty("id", 123);
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("overview");
      expect(result).toHaveProperty("poster_path");
      expect(result).toHaveProperty("backdrop_path");
      expect(result).toHaveProperty("release_date");
      expect(result).toHaveProperty("vote_average");
      expect(result).toHaveProperty("vote_count");
      expect(result).toHaveProperty("genres");
      expect(result).toHaveProperty("runtime");
    });

    it("should get poster URL with valid path", () => {
      const result = testTmdbService.getPosterUrl("/test.jpg");

      expect(result).toBe("https://image.tmdb.org/t/p/w300/test.jpg");
    });

    it("should return placeholder for null poster path", () => {
      const result = testTmdbService.getPosterUrl(null);

      expect(result).toBe("/placeholder.svg");
    });

    it("should get backdrop URL with valid path", () => {
      const result = testTmdbService.getBackdropUrl("/backdrop.jpg");

      expect(result).toBe("https://image.tmdb.org/t/p/original/backdrop.jpg");
    });

    it("should return placeholder for null backdrop path", () => {
      const result = testTmdbService.getBackdropUrl(null);

      expect(result).toBe("/placeholder.svg");
    });
  });

  describe("Exported Functions", () => {
    it("should export getPopularMovies function", async () => {
      const result = await getPopularMovies(3);

      expect(result.page).toBe(3);
    });

    it("should export getPopularMovies with default page", async () => {
      const result = await getPopularMovies();

      expect(result.page).toBe(1);
    });

    it("should export searchMovies function", async () => {
      const result = await searchMovies("action", 2);

      expect(result.page).toBe(2);
    });

    it("should export searchMovies with default page", async () => {
      const result = await searchMovies("comedy");

      expect(result.page).toBe(1);
    });

    it("should export getMovieDetails function", async () => {
      const result = await getMovieDetails(456);

      expect(result.id).toBe(456);
    });

    it("should export getPosterUrl function", () => {
      const result = getPosterUrl("/poster.jpg");

      expect(result).toBe("https://image.tmdb.org/t/p/w300/poster.jpg");
    });

    it("should export getPosterUrl with null path", () => {
      const result = getPosterUrl(null);

      expect(result).toBe("/placeholder.svg");
    });

    it("should export getBackdropUrl function", () => {
      const result = getBackdropUrl("/backdrop.jpg");

      expect(result).toBe("https://image.tmdb.org/t/p/original/backdrop.jpg");
    });

    it("should export getBackdropUrl with null path", () => {
      const result = getBackdropUrl(null);

      expect(result).toBe("/placeholder.svg");
    });
  });

  describe("Data Structure Validation", () => {
    it("should return valid MovieResponse structure", async () => {
      const result = await getPopularMovies(1);

      expect(typeof result.page).toBe("number");
      expect(typeof result.total_pages).toBe("number");
      expect(typeof result.total_results).toBe("number");
      expect(Array.isArray(result.results)).toBe(true);
    });

    it("should return valid MovieDetails structure", async () => {
      const result = await getMovieDetails(789);

      expect(typeof result.id).toBe("number");
      expect(typeof result.title).toBe("string");
      expect(typeof result.overview).toBe("string");
      expect(typeof result.vote_average).toBe("number");
      expect(typeof result.vote_count).toBe("number");
      expect(typeof result.runtime).toBe("number");
      expect(Array.isArray(result.genres)).toBe(true);
      expect(Array.isArray(result.production_companies)).toBe(true);
    });

    it("should return valid genre structure in movie details", async () => {
      const result = await getMovieDetails(999);

      expect(result.genres.length).toBeGreaterThan(0);
      expect(result.genres[0]).toHaveProperty("id");
      expect(result.genres[0]).toHaveProperty("name");
      expect(typeof result.genres[0].id).toBe("number");
      expect(typeof result.genres[0].name).toBe("string");
    });

    it("should return valid production company structure in movie details", async () => {
      const result = await getMovieDetails(1001);

      expect(result.production_companies.length).toBeGreaterThan(0);
      expect(result.production_companies[0]).toHaveProperty("id");
      expect(result.production_companies[0]).toHaveProperty("name");
      expect(result.production_companies[0]).toHaveProperty("logo_path");
      expect(typeof result.production_companies[0].id).toBe("number");
      expect(typeof result.production_companies[0].name).toBe("string");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string poster path", () => {
      const result = getPosterUrl("");

      expect(result).toBe("/placeholder.svg");
    });

    it("should handle empty string backdrop path", () => {
      const result = getBackdropUrl("");

      expect(result).toBe("/placeholder.svg");
    });

    it("should handle page 0 for popular movies", async () => {
      const result = await getPopularMovies(0);

      expect(result.page).toBe(0);
    });

    it("should handle negative page for search movies", async () => {
      const result = await searchMovies("test", -1);

      expect(result.page).toBe(-1);
    });

    it("should handle empty search query", async () => {
      const result = await searchMovies("");

      expect(result).toHaveProperty("results");
      expect(Array.isArray(result.results)).toBe(true);
    });

    it("should handle special characters in search query", async () => {
      const result = await searchMovies("test & special chars!@#$%");

      expect(result).toHaveProperty("results");
      expect(result.page).toBe(1);
    });

    it("should handle very large movie ID", async () => {
      const largeId = 999999999;
      const result = await getMovieDetails(largeId);

      expect(result.id).toBe(largeId);
    });

    it("should handle zero movie ID", async () => {
      const result = await getMovieDetails(0);

      expect(result.id).toBe(0);
    });
  });
});
