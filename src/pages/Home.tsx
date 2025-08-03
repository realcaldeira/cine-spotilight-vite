import React, { useState, useEffect } from 'react';
import { Movie, MovieResponse } from '@/types/movie';
import { tmdbService } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import LoadingSpinner, { LoadingGrid } from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMovies = async (page: number = 1, reset: boolean = false) => {
    try {
      if (page === 1) {
        setLoading(true);
        setLoadingMore(false);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const response: MovieResponse = await tmdbService.getPopularMovies(page);

      if (!response || !response.results) {
        throw new Error('Invalid response from API');
      }

      if (reset || page === 1) {
        setMovies(response.results);
      } else {
        setMovies((prev) => [...prev, ...response.results]);
      }

      setCurrentPage(page);
      setTotalPages(response.total_pages || 1);
    } catch (err) {
      setError('Erro ao carregar filmes populares. Tente novamente.');
      console.error('Error fetching popular movies:', err);

      if (page > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore && !loading) {
      fetchMovies(currentPage + 1, false);
    }
  };

  const debouncedLoadMore = useDebounce(handleLoadMore, 300);

  const handleRetry = () => {
    fetchMovies(1, true);
  };

  if (loading && movies.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
            <div className="h-6 w-96 bg-muted animate-pulse rounded" />
          </div>
          <LoadingGrid />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black"></div>
        <div className="relative pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Filmes Populares
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                Descubra os filmes mais assistidos do momento. Uma curadoria
                especial com o melhor do cinema mundial.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-netflix-red rounded-full animate-pulse"></div>
                  <span className="text-gray-400">Atualizado diariamente</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400">
                    {movies.length} filmes carregados
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {error && (
          <div className="mb-12">
            <ErrorMessage
              message={error}
              onRetry={handleRetry}
              className="bg-red-900/20 border-red-500/30"
            />
          </div>
        )}

        {!error && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Em Destaque
              </h2>
              <div className="w-16 h-1 bg-netflix-red rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-12">
              {movies.map((movie, index) => (
                <div
                  key={movie.id}
                  className="animate-fade-in-up opacity-0"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'forwards',
                  }}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>

            {currentPage < totalPages && (
              <div className="flex justify-center">
                <Button
                  onClick={debouncedLoadMore}
                  disabled={loadingMore || loading}
                  className="bg-netflix-red hover:bg-netflix-red/90 text-white font-semibold px-8 py-3 text-lg rounded-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-netflix-red/25"
                  size="lg">
                  {loadingMore ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-3" />
                      <span className="animate-pulse">
                        Carregando mais filmes...
                      </span>
                    </>
                  ) : (
                    <span className="flex items-center">
                      Carregar mais filmes
                      <svg
                        className="ml-2 w-5 h-5 transform transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  )}
                </Button>
              </div>
            )}

            {currentPage >= totalPages && movies.length > 0 && (
              <div className="text-center pt-12">
                <div className="inline-flex items-center space-x-2 text-gray-500">
                  <div className="w-16 h-px bg-gray-600"></div>
                  <span>Fim dos resultados</span>
                  <div className="w-16 h-px bg-gray-600"></div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
