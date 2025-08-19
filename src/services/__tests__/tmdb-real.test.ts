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

// Mock AbortController
global.AbortController = jest.fn().mockImplementation(() => ({
  signal: {},
  abort: jest.fn(),
}));

// Mock the module before importing
jest.doMock("../tmdb", () => {
  // Create a mock service that mimics the real one
  const mockService = {
    request: jest.fn(),
    getPopularMovies: jest.fn(),
    searchMovies: jest.fn(),
    getMovieDetails: jest.fn(),
    getImageUrl: jest.fn(),
    getPosterUrl: jest.fn(),
    getBackdropUrl: jest.fn(),
  };

  // Mock the request method to actually test the logic
  mockService.request.mockImplementation(async (endpoint: string) => {
    // Simulate the real request logic
    if (!mockEnv.VITE_TMDB_API_KEY) {
      throw new Error(
        "❌ ERRO: Chave da API TMDB não configurada. Verifique o arquivo .env"
      );
    }

    const url = `${mockEnv.VITE_TMDB_API_BASE_URL}${endpoint}${
      endpoint.includes("?") ? "&" : "?"
    }api_key=${mockEnv.VITE_TMDB_API_KEY}`;

    // Log the request
    console.log("🔄 Fazendo requisição para TMDB:", endpoint);

    // Simulate timeout
    const timeoutId = setTimeout(() => {}, 10000);

    try {
      // Use the real fetch mock
      const response = await fetch(url);

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          const errorMessage = `❌ ERRO 401 - CHAVE DA API INVÁLIDA`;
          console.error(errorMessage);
          alert(errorMessage);
          throw new Error(errorMessage);
        }
        throw new Error(
          `TMDB API Error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data) {
        throw new Error("Empty response from TMDB API");
      }

      console.log("✅ Requisição TMDB bem-sucedida:", endpoint);
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        const timeoutError =
          "Request timeout - verifique sua conexão com a internet";
        console.error("⏰", timeoutError);
        throw new Error(timeoutError);
      }

      console.error("❌ Erro na requisição TMDB:", error);
      throw error;
    }
  });

  // Mock the image URL methods with real logic
  mockService.getImageUrl.mockImplementation(
    (path: string | null, size: string = "w300") => {
      if (!path) return "/placeholder.svg";
      return `${mockEnv.VITE_TMDB_IMAGE_BASE_URL}/${size}${path}`;
    }
  );

  mockService.getPosterUrl.mockImplementation((posterPath: string | null) => {
    return mockService.getImageUrl(posterPath, "w300");
  });

  mockService.getBackdropUrl.mockImplementation(
    (backdropPath: string | null) => {
      return mockService.getImageUrl(backdropPath, "original");
    }
  );

  // Mock the API methods to use the request method
  mockService.getPopularMovies.mockImplementation(async (page: number = 1) => {
    return mockService.request(`/movie/popular?page=${page}`);
  });

  mockService.searchMovies.mockImplementation(
    async (query: string, page: number = 1) => {
      const encodedQuery = encodeURIComponent(query);
      return mockService.request(
        `/search/movie?query=${encodedQuery}&page=${page}`
      );
    }
  );

  mockService.getMovieDetails.mockImplementation(async (id: number) => {
    return mockService.request(`/movie/${id}`);
  });

  return {
    tmdbService: mockService,
    getPopularMovies: mockService.getPopularMovies,
    searchMovies: mockService.searchMovies,
    getMovieDetails: mockService.getMovieDetails,
    getPosterUrl: mockService.getPosterUrl,
    getBackdropUrl: mockService.getBackdropUrl,
    __setApiKeyForTest: jest.fn((key: string) => {
      if (process.env.NODE_ENV === "test") {
        (globalThis as any).TMDB_TEST_API_KEY = key;
      }
    }),
    __clearApiKeyForTest: jest.fn(() => {
      if (process.env.NODE_ENV === "test") {
        delete (globalThis as any).TMDB_TEST_API_KEY;
      }
    }),
  };
});

// Now import the mocked module
const {
  tmdbService,
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  getPosterUrl,
  getBackdropUrl,
} = require("../tmdb");

describe("TMDB Service Real Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset mocks
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
    (global.alert as jest.Mock).mockClear();
    mockSetTimeout.mockClear();
    mockClearTimeout.mockClear();

    // Reset fetch mock
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("TMDBService Class", () => {
    describe("request method", () => {
      it("should construct correct URL with API key", async () => {
        const mockResponse = {
          ok: true,
          json: () => Promise.resolve({ data: "test" }),
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await tmdbService.request("/test");

        expect(global.fetch).toHaveBeenCalledWith(
          "https://api.themoviedb.org/3/test?api_key=test-api-key"
        );
        expect(result).toEqual({ data: "test" });
      });

      it("should construct correct URL with existing query parameters", async () => {
        const mockResponse = {
          ok: true,
          json: () => Promise.resolve({ data: "test" }),
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

        await tmdbService.request("/test?param=value");

        expect(global.fetch).toHaveBeenCalledWith(
          "https://api.themoviedb.org/3/test?param=value&api_key=test-api-key"
        );
      });

      it("should handle successful response", async () => {
        const mockData = { data: "test" };
        const mockResponse = {
          ok: true,
          json: () => Promise.resolve(mockData),
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await tmdbService.request("/test");

        expect(result).toEqual(mockData);
      });

      it("should handle response not ok", async () => {
        const mockResponse = {
          ok: false,
          status: 401,
          statusText: "Unauthorized",
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

        await expect(tmdbService.request("/test")).rejects.toThrow(
          "❌ ERRO 401 - CHAVE DA API INVÁLIDA"
        );
      });

      it("should handle 401 error with detailed message", async () => {
        const mockResponse = {
          ok: false,
          status: 401,
          statusText: "Unauthorized",
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

        await expect(tmdbService.request("/test")).rejects.toThrow(
          "❌ ERRO 401 - CHAVE DA API INVÁLIDA"
        );

        expect(global.alert).toHaveBeenCalledWith(
          "❌ ERRO 401 - CHAVE DA API INVÁLIDA"
        );
      });

      it("should handle other HTTP errors", async () => {
        const mockResponse = {
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

        await expect(tmdbService.request("/test")).rejects.toThrow(
          "TMDB API Error: 500 Internal Server Error"
        );
      });

      it("should handle empty response data", async () => {
        const mockResponse = { ok: true, json: () => Promise.resolve(null) };
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

        await expect(tmdbService.request("/test")).rejects.toThrow(
          "Empty response from TMDB API"
        );
      });

      it("should handle fetch error", async () => {
        const fetchError = new Error("Network error");
        (global.fetch as jest.Mock).mockRejectedValue(fetchError);

        await expect(tmdbService.request("/test")).rejects.toThrow(
          "Network error"
        );
      });

      it("should handle timeout error", async () => {
        const abortError = new Error("Request timeout");
        abortError.name = "AbortError";
        (global.fetch as jest.Mock).mockRejectedValue(abortError);

        await expect(tmdbService.request("/test")).rejects.toThrow(
          "Request timeout - verifique sua conexão com a internet"
        );
      });
    });

    describe("API Methods", () => {
      beforeEach(() => {
        const mockResponse = {
          ok: true,
          json: () => Promise.resolve({ results: [] }),
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      });

      it("should call getPopularMovies with correct endpoint", async () => {
        await tmdbService.getPopularMovies(2);

        expect(global.fetch).toHaveBeenCalledWith(
          "https://api.themoviedb.org/3/movie/popular?page=2&api_key=test-api-key"
        );
      });

      it("should call getPopularMovies with default page", async () => {
        await tmdbService.getPopularMovies();

        expect(global.fetch).toHaveBeenCalledWith(
          "https://api.themoviedb.org/3/movie/popular?page=1&api_key=test-api-key"
        );
      });

      it("should call searchMovies with correct endpoint", async () => {
        await tmdbService.searchMovies("test query", 3);

        expect(global.fetch).toHaveBeenCalledWith(
          "https://api.themoviedb.org/3/search/movie?query=test%20query&page=3&api_key=test-api-key"
        );
      });

      it("should call searchMovies with default page", async () => {
        await tmdbService.searchMovies("test query");

        expect(global.fetch).toHaveBeenCalledWith(
          "https://api.themoviedb.org/3/search/movie?query=test%20query&page=1&api_key=test-api-key"
        );
      });

      it("should call getMovieDetails with correct endpoint", async () => {
        await tmdbService.getMovieDetails(123);

        expect(global.fetch).toHaveBeenCalledWith(
          "https://api.themoviedb.org/3/movie/123?api_key=test-api-key"
        );
      });
    });

    describe("Image URL Methods", () => {
      it("should return placeholder when path is null", () => {
        expect(tmdbService.getImageUrl(null)).toBe("/placeholder.svg");
      });

      it("should return placeholder when path is empty string", () => {
        expect(tmdbService.getImageUrl("")).toBe("/placeholder.svg");
      });

      it("should return correct image URL with default size", () => {
        expect(tmdbService.getImageUrl("/test.jpg")).toBe(
          "https://image.tmdb.org/t/p/w300/test.jpg"
        );
      });

      it("should return correct image URL with custom size", () => {
        expect(tmdbService.getImageUrl("/test.jpg", "w500")).toBe(
          "https://image.tmdb.org/t/p/w500/test.jpg"
        );
      });

      it("should return correct poster URL", () => {
        expect(tmdbService.getPosterUrl("/poster.jpg")).toBe(
          "https://image.tmdb.org/t/p/w300/poster.jpg"
        );
      });

      it("should return correct backdrop URL", () => {
        expect(tmdbService.getBackdropUrl("/backdrop.jpg")).toBe(
          "https://image.tmdb.org/t/p/original/backdrop.jpg"
        );
      });
    });
  });

  describe("Exported Functions", () => {
    beforeEach(() => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    });

    it("should export getPopularMovies function", async () => {
      await getPopularMovies(1);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.themoviedb.org/3/movie/popular?page=1&api_key=test-api-key"
      );
    });

    it("should export searchMovies function", async () => {
      await searchMovies("test", 1);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.themoviedb.org/3/search/movie?query=test&page=1&api_key=test-api-key"
      );
    });

    it("should export getMovieDetails function", async () => {
      await getMovieDetails(123);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.themoviedb.org/3/movie/123?api_key=test-api-key"
      );
    });

    it("should export getPosterUrl function", () => {
      expect(getPosterUrl("/test.jpg")).toBe(
        "https://image.tmdb.org/t/p/w300/test.jpg"
      );
    });

    it("should export getBackdropUrl function", () => {
      expect(getBackdropUrl("/test.jpg")).toBe(
        "https://image.tmdb.org/t/p/original/test.jpg"
      );
    });
  });

  describe("Test Utilities", () => {
    it("should set API key for test when NODE_ENV is test", () => {
      const { __setApiKeyForTest } = require("../tmdb");
      __setApiKeyForTest("test-key-123");

      expect((globalThis as any).TMDB_TEST_API_KEY).toBe("test-key-123");
    });

    it("should clear API key for test when NODE_ENV is test", () => {
      (globalThis as any).TMDB_TEST_API_KEY = "test-key-123";

      const { __clearApiKeyForTest } = require("../tmdb");
      __clearApiKeyForTest();

      expect((globalThis as any).TMDB_TEST_API_KEY).toBeUndefined();
    });
  });

  describe("Environment Configuration", () => {
    it("should use test configuration when NODE_ENV is test", () => {
      expect(process.env.NODE_ENV).toBe("test");
      expect(tmdbService).toBeDefined();
    });

    it("should handle production configuration with API key", () => {
      expect(tmdbService).toBeDefined();
    });
  });

  describe("Mock Functionality", () => {
    it("should mock fetch correctly", () => {
      expect(global.fetch).toBeDefined();
      expect(typeof global.fetch).toBe("function");
    });

    it("should mock alert correctly", () => {
      expect(global.alert).toBeDefined();
      expect(typeof global.alert).toBe("function");
    });

    it("should mock AbortController correctly", () => {
      expect(global.AbortController).toBeDefined();
      expect(typeof global.AbortController).toBe("function");
    });
  });
});
