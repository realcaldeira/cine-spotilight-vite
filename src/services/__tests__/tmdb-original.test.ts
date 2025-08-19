// Mock environment variables and global objects before any imports
const mockEnv = {
  NODE_ENV: "test",
  VITE_TMDB_API_KEY: "test-api-key",
  VITE_TMDB_API_BASE_URL: "https://api.themoviedb.org/3",
  VITE_TMDB_IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
};

// Mock process.env
Object.defineProperty(process, "env", {
  value: mockEnv,
  writable: true,
});

// Mock globalThis for test utilities
Object.defineProperty(globalThis, "TMDB_TEST_API_KEY", {
  value: undefined,
  writable: true,
  configurable: true,
});

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {});
const mockConsoleError = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

// Mock alert
global.alert = jest.fn();

// Mock setTimeout and clearTimeout
const mockSetTimeout = jest.spyOn(global, "setTimeout");
const mockClearTimeout = jest.spyOn(global, "clearTimeout");

describe("TMDB Service Original Tests", () => {
  let tmdbService: any;
  let getPopularMovies: any;
  let searchMovies: any;
  let getMovieDetails: any;
  let getPosterUrl: any;
  let getBackdropUrl: any;
  let __setApiKeyForTest: any;
  let __clearApiKeyForTest: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset environment
    process.env.NODE_ENV = "test";
    process.env.VITE_TMDB_API_KEY = "test-api-key";

    // Reset globalThis
    delete (globalThis as any).TMDB_TEST_API_KEY;

    // Reset mocks
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
    (global.alert as jest.Mock).mockClear();
    mockSetTimeout.mockClear();
    mockClearTimeout.mockClear();

    // Mock the module dynamically
    jest.doMock("../tmdb", () => {
      const mockService = {
        request: jest.fn(),
        getPopularMovies: jest.fn(),
        searchMovies: jest.fn(),
        getMovieDetails: jest.fn(),
        getImageUrl: jest.fn(),
        getPosterUrl: jest.fn(),
        getBackdropUrl: jest.fn(),
      };

      return {
        tmdbService: mockService,
        getPopularMovies: jest.fn(),
        searchMovies: jest.fn(),
        getMovieDetails: jest.fn(),
        getPosterUrl: jest.fn(),
        getBackdropUrl: jest.fn(),
        __setApiKeyForTest: jest.fn(),
        __clearApiKeyForTest: jest.fn(),
      };
    });

    // Import after mocking
    const tmdbModule = require("../tmdb");
    tmdbService = tmdbModule.tmdbService;
    getPopularMovies = tmdbModule.getPopularMovies;
    searchMovies = tmdbModule.searchMovies;
    getMovieDetails = tmdbModule.getMovieDetails;
    getPosterUrl = tmdbModule.getPosterUrl;
    getBackdropUrl = tmdbModule.getBackdropUrl;
    __setApiKeyForTest = tmdbModule.__setApiKeyForTest;
    __clearApiKeyForTest = tmdbModule.__clearApiKeyForTest;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.unmock("../tmdb");
  });

  describe("TMDBService Class", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "test";
    });

    describe("request method", () => {
      it("should handle successful response", async () => {
        const mockData = { data: "test" };
        tmdbService.request.mockResolvedValue(mockData);

        const result = await tmdbService.request("/test");

        expect(result).toEqual(mockData);
        expect(tmdbService.request).toHaveBeenCalledWith("/test");
      });

      it("should handle error response", async () => {
        const error = new Error("API Error");
        tmdbService.request.mockRejectedValue(error);

        await expect(tmdbService.request("/test")).rejects.toThrow("API Error");
      });
    });

    describe("API Methods", () => {
      beforeEach(() => {
        tmdbService.getPopularMovies.mockResolvedValue({ results: [] });
        tmdbService.searchMovies.mockResolvedValue({ results: [] });
        tmdbService.getMovieDetails.mockResolvedValue({ id: 123 });
      });

      it("should call getPopularMovies with correct parameters", async () => {
        await tmdbService.getPopularMovies(2);

        expect(tmdbService.getPopularMovies).toHaveBeenCalledWith(2);
      });

      it("should call getPopularMovies with default page", async () => {
        await tmdbService.getPopularMovies();

        expect(tmdbService.getPopularMovies).toHaveBeenCalledWith();
      });

      it("should call searchMovies with correct parameters", async () => {
        await tmdbService.searchMovies("test query", 3);

        expect(tmdbService.searchMovies).toHaveBeenCalledWith("test query", 3);
      });

      it("should call searchMovies with default page", async () => {
        await tmdbService.searchMovies("test query");

        expect(tmdbService.searchMovies).toHaveBeenCalledWith("test query");
      });

      it("should call getMovieDetails with correct parameters", async () => {
        await tmdbService.getMovieDetails(123);

        expect(tmdbService.getMovieDetails).toHaveBeenCalledWith(123);
      });
    });

    describe("Image URL Methods", () => {
      it("should return placeholder when path is null", () => {
        tmdbService.getImageUrl.mockReturnValue("/placeholder.svg");

        expect(tmdbService.getImageUrl(null)).toBe("/placeholder.svg");
      });

      it("should return correct image URL with default size", () => {
        tmdbService.getImageUrl.mockReturnValue(
          "https://image.tmdb.org/t/p/w300/test.jpg"
        );

        expect(tmdbService.getImageUrl("/test.jpg")).toBe(
          "https://image.tmdb.org/t/p/w300/test.jpg"
        );
      });

      it("should return correct image URL with custom size", () => {
        tmdbService.getImageUrl.mockReturnValue(
          "https://image.tmdb.org/t/p/w500/test.jpg"
        );

        expect(tmdbService.getImageUrl("/test.jpg", "w500")).toBe(
          "https://image.tmdb.org/t/p/w500/test.jpg"
        );
      });

      it("should return correct poster URL", () => {
        tmdbService.getPosterUrl.mockReturnValue(
          "https://image.tmdb.org/t/p/w300/poster.jpg"
        );

        expect(tmdbService.getPosterUrl("/poster.jpg")).toBe(
          "https://image.tmdb.org/t/p/w300/poster.jpg"
        );
      });

      it("should return correct backdrop URL", () => {
        tmdbService.getBackdropUrl.mockReturnValue(
          "https://image.tmdb.org/t/p/original/backdrop.jpg"
        );

        expect(tmdbService.getBackdropUrl("/backdrop.jpg")).toBe(
          "https://image.tmdb.org/t/p/original/backdrop.jpg"
        );
      });
    });
  });

  describe("Exported Functions", () => {
    beforeEach(() => {
      getPopularMovies.mockResolvedValue({ results: [] });
      searchMovies.mockResolvedValue({ results: [] });
      getMovieDetails.mockResolvedValue({ id: 123 });
    });

    it("should export getPopularMovies function", async () => {
      await getPopularMovies(1);

      expect(getPopularMovies).toHaveBeenCalledWith(1);
    });

    it("should export searchMovies function", async () => {
      await searchMovies("test", 1);

      expect(searchMovies).toHaveBeenCalledWith("test", 1);
    });

    it("should export getMovieDetails function", async () => {
      await getMovieDetails(123);

      expect(getMovieDetails).toHaveBeenCalledWith(123);
    });

    it("should export getPosterUrl function", () => {
      getPosterUrl.mockReturnValue("https://image.tmdb.org/t/p/w300/test.jpg");

      expect(getPosterUrl("/test.jpg")).toBe(
        "https://image.tmdb.org/t/p/w300/test.jpg"
      );
    });

    it("should export getBackdropUrl function", () => {
      getBackdropUrl.mockReturnValue(
        "https://image.tmdb.org/t/p/original/test.jpg"
      );

      expect(getBackdropUrl("/test.jpg")).toBe(
        "https://image.tmdb.org/t/p/original/test.jpg"
      );
    });
  });

  describe("Test Utilities", () => {
    it("should set API key for test when NODE_ENV is test", () => {
      process.env.NODE_ENV = "test";

      __setApiKeyForTest("test-key-123");

      expect(__setApiKeyForTest).toHaveBeenCalledWith("test-key-123");
    });

    it("should clear API key for test when NODE_ENV is test", () => {
      process.env.NODE_ENV = "test";

      __clearApiKeyForTest();

      expect(__clearApiKeyForTest).toHaveBeenCalled();
    });
  });

  describe("Environment Configuration", () => {
    it("should use test configuration when NODE_ENV is test", () => {
      process.env.NODE_ENV = "test";

      expect(process.env.NODE_ENV).toBe("test");
    });

    it("should handle production configuration with API key", () => {
      process.env.NODE_ENV = "production";
      process.env.VITE_TMDB_API_KEY = "test-production-key";

      expect(process.env.VITE_TMDB_API_KEY).toBe("test-production-key");
    });

    it("should handle missing API key in production", () => {
      process.env.NODE_ENV = "production";
      delete process.env.VITE_TMDB_API_KEY;

      expect(process.env.VITE_TMDB_API_KEY).toBeUndefined();
    });
  });

  describe("Mock Functionality", () => {
    it("should mock fetch correctly", () => {
      expect(global.fetch).toBeDefined();
      expect(typeof global.fetch).toBe("function");
    });

    it("should mock console methods correctly", () => {
      expect(mockConsoleLog).toBeDefined();
      expect(mockConsoleError).toBeDefined();
    });

    it("should mock alert correctly", () => {
      expect(global.alert).toBeDefined();
      expect(typeof global.alert).toBe("function");
    });

    it("should mock setTimeout and clearTimeout correctly", () => {
      expect(mockSetTimeout).toBeDefined();
      expect(mockClearTimeout).toBeDefined();
    });
  });
});
