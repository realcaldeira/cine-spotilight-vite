Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        MODE: 'test',
        VITE_TMDB_API_KEY: 'test-api-key',
        VITE_TMDB_API_BASE_URL: 'https://api.themoviedb.org/3',
        VITE_TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
      },
    },
  },
  configurable: true,
});

interface ImportMeta {
  env: {
    MODE: string;
    VITE_TMDB_API_KEY: string;
    VITE_TMDB_API_BASE_URL: string;
    VITE_TMDB_IMAGE_BASE_URL: string;
  };
}

declare global {
  interface Global {
    import: {
      meta: ImportMeta;
    };
  }
}

export {};
