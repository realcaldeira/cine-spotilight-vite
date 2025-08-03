import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Movie, MovieResponse } from '@/types/movie';
import { tmdbService } from '@/services/tmdb';
import { useMovies } from '@/contexts/MoviesContext';
import MovieCard from '@/components/MovieCard';
import LoadingSpinner, { LoadingGrid } from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { addSearchTerm } = useMovies();
  const addSearchTermRef = useRef(addSearchTerm);

  useEffect(() => {
    addSearchTermRef.current = addSearchTerm;
  }, [addSearchTerm]);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const searchMovies = useCallback(
    async (searchQuery: string, page: number = 1, reset: boolean = false) => {
      if (!searchQuery.trim()) return;

      try {
        if (page === 1) {
          setLoading(true);
          setLoadingMore(false);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const response: MovieResponse = await tmdbService.searchMovies(
          searchQuery,
          page
        );

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
        setTotalResults(response.total_results || 0);
      } catch (err) {
        setError('Erro ao buscar filmes. Tente novamente.');
        console.error('Error searching movies:', err);

        if (page > 1) {
          setCurrentPage((prev) => prev - 1);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    if (query) {
      addSearchTermRef.current(query);
      setMovies([]);
      setCurrentPage(1);
      searchMovies(query, 1, true);
    }
  }, [query, searchMovies]);

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore && !loading && query) {
      searchMovies(query, currentPage + 1, false);
    }
  };

  const debouncedLoadMore = useDebounce(handleLoadMore, 300);

  const handleRetry = () => {
    if (query) {
      searchMovies(query, 1, true);
    }
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            type="search"
            title="Busque por filmes"
            description="Use a barra de busca no topo da página para encontrar seus filmes favoritos."
            actionText="Ir para início"
            actionLink="/"
          />
        </div>
      </div>
    );
  }

  if (loading && movies.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 w-64 bg-muted animate-pulse rounded mb-2" />
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          </div>
          <LoadingGrid />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Resultados da busca
          </h1>
          <p className="text-muted-foreground">
            {totalResults > 0 ? (
              <>
                {totalResults.toLocaleString()} resultado
                {totalResults !== 1 ? 's' : ''} encontrado
                {totalResults !== 1 ? 's' : ''} para "
                <span className="font-semibold text-foreground">{query}</span>"
              </>
            ) : loading ? (
              'Buscando...'
            ) : (
              `Nenhum resultado encontrado para "${query}"`
            )}
          </p>
        </div>

        {error && (
          <ErrorMessage
            message={error}
            onRetry={handleRetry}
            className="mb-8"
          />
        )}

        {!loading && !error && movies.length === 0 && totalResults === 0 && (
          <EmptyState
            type="search"
            title="Nenhum filme encontrado"
            description={`Não encontramos filmes para "${query}". Tente buscar por outros termos ou verifique a ortografia.`}
            actionText="Voltar ao início"
            actionLink="/"
          />
        )}

        {!error && movies.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} searchTerm={query} />
              ))}
            </div>

            {currentPage < totalPages && (
              <div className="flex justify-center">
                <Button
                  onClick={debouncedLoadMore}
                  disabled={loadingMore || loading}
                  className="bg-netflix-red hover:bg-netflix-red/90"
                  size="lg">
                  {loadingMore ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Carregando...
                    </>
                  ) : (
                    'Carregar mais resultados'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
