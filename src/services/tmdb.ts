import { MovieResponse, MovieDetails } from '@/types/movie';

let API_KEY: string;
let BASE_URL: string;
let IMAGE_BASE_URL: string;

if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
  API_KEY = 'test-api-key';
  BASE_URL = 'https://api.themoviedb.org/3';
  IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
} else {
  API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
  BASE_URL =
    import.meta.env.VITE_TMDB_API_BASE_URL || 'https://api.themoviedb.org/3';
  IMAGE_BASE_URL =
    import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

  if (!API_KEY) {
    const errorMessage = `
❌ ERRO DE CONFIGURAÇÃO - TMDB API KEY
      
A chave da API do TMDB não foi encontrada!

Para corrigir:
1. Crie/edite o arquivo .env na raiz do projeto
2. Adicione a linha: VITE_TMDB_API_KEY=sua_chave_aqui
3. Obtenha sua chave em: https://www.themoviedb.org/settings/api
4. Reinicie o servidor (npm run dev)

Arquivo .env deve conter:
VITE_TMDB_API_KEY=código
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
    `;

    console.error(errorMessage);
    alert(errorMessage);
    throw new Error('TMDB API key not found. Please check your .env file.');
  }

  console.log('✅ TMDB API configurada com sucesso!');
  console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'VAZIA');
  console.log('Base URL:', BASE_URL);
  console.log('Image URL:', IMAGE_BASE_URL);
}

class TMDBService {
  private async request<T>(endpoint: string): Promise<T> {
    if (!API_KEY) {
      const errorMessage =
        '❌ ERRO: Chave da API TMDB não configurada. Verifique o arquivo .env';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;

    console.log('🔄 Fazendo requisição para TMDB:', endpoint);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `TMDB API Error: ${response.status} ${response.statusText}`;

        if (response.status === 401) {
          errorMessage = `
❌ ERRO 401 - CHAVE DA API INVÁLIDA

Sua chave da API TMDB é inválida ou expirou.

Para corrigir:
1. Vá para: https://www.themoviedb.org/settings/api
2. Gere uma nova chave da API
3. Atualize o arquivo .env com: VITE_TMDB_API_KEY=nova_chave_aqui
4. Reinicie o servidor

Chave atual: ${API_KEY ? `${API_KEY.substring(0, 10)}...` : 'VAZIA'}
          `;
          console.error(errorMessage);
          alert(errorMessage);
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data) {
        throw new Error('Empty response from TMDB API');
      }

      console.log('✅ Requisição TMDB bem-sucedida:', endpoint);
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        const timeoutError =
          'Request timeout - verifique sua conexão com a internet';
        console.error('⏰', timeoutError);
        throw new Error(timeoutError);
      }

      console.error('❌ Erro na requisição TMDB:', error);
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

// Export individual functions for convenience
export const getPopularMovies = (page?: number) => tmdbService.getPopularMovies(page);
export const searchMovies = (query: string, page?: number) => tmdbService.searchMovies(query, page);
export const getMovieDetails = (id: number) => tmdbService.getMovieDetails(id);
export const getPosterUrl = (posterPath: string | null) => tmdbService.getPosterUrl(posterPath);
export const getBackdropUrl = (backdropPath: string | null) => tmdbService.getBackdropUrl(backdropPath);

// Test utilities
export const __setApiKeyForTest = (key: string) => {
  if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).TMDB_TEST_API_KEY = key;
  }
};

export const __clearApiKeyForTest = () => {
  if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).TMDB_TEST_API_KEY;
  }
};
