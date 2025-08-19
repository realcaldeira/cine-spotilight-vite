import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Calendar, Clock, Star, Heart } from "lucide-react";
import { MovieDetails as MovieDetailsType } from "@/types/movie";
import { tmdbService } from "@/services/tmdb";
import { useMovies } from "@/contexts/MoviesContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StartRating from "@/components/StartRating";

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addFavorite, removeFavorite, isFavorite } = useMovies();

  const movieId = parseInt(id || "0");
  const favorite = isFavorite(movieId);

  useEffect(() => {
    if (!id || isNaN(movieId)) return;

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const movieDetails = await tmdbService.getMovieDetails(movieId);
        setMovie(movieDetails);
      } catch (err) {
        setError("Erro ao carregar detalhes do filme. Tente novamente.");
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, movieId]);

  const handleFavoriteClick = () => {
    if (!movie) return;

    if (favorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  const handleRetry = () => {
    if (movieId) {
      window.location.reload();
    }
  };

  if (!id || isNaN(movieId)) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage
            message={error || "Filme não encontrado"}
            onRetry={error ? handleRetry : undefined}
          />
        </div>
      </div>
    );
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={tmdbService.getBackdropUrl(movie.backdrop_path)}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <img
                src={tmdbService.getPosterUrl(movie.poster_path)}
                alt={movie.title}
                className="w-full max-w-sm mx-auto lg:mx-0 rounded-lg shadow-elevated"
              />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-lg text-muted-foreground italic">
                    "{movie.tagline}"
                  </p>
                )}
              </div>

              <Button
                onClick={handleFavoriteClick}
                variant={favorite ? "default" : "outline"}
                className={`${
                  favorite
                    ? "bg-netflix-red hover:bg-netflix-red/90"
                    : "border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white"
                } min-w-fit`}
              >
                <Heart
                  className={`mr-2 h-4 w-4 ${favorite ? "fill-current" : ""}`}
                />
                {favorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(movie.release_date)}</span>
              </div>

              {movie.runtime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}

              <StartRating average={movie.vote_average} size="sm" />
              <div className="flex items-center gap-1">
                {/* <Star className="h-4 w-4 text-yellow-400 fill-current" /> */}
                <span className="font-medium text-foreground">
                  {movie.vote_average !== null &&
                  movie.vote_average !== undefined
                    ? `${movie.vote_average.toFixed(1)}/10`
                    : "N/A"}
                </span>
                <span>({movie.vote_count.toLocaleString()} votos)</span>
              </div>
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <Badge
                    key={genre.id}
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground"
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-3 text-foreground">
                Sinopse
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {movie.overview || "Sinopse não disponível."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-card rounded-lg">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Status</h3>
                <p className="text-muted-foreground">{movie.status}</p>
              </div>

              {movie.budget > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Orçamento
                  </h3>
                  <p className="text-muted-foreground">
                    ${movie.budget.toLocaleString()}
                  </p>
                </div>
              )}

              {movie.revenue > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Receita
                  </h3>
                  <p className="text-muted-foreground">
                    ${movie.revenue.toLocaleString()}
                  </p>
                </div>
              )}

              {movie.production_companies &&
                movie.production_companies.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Produtoras
                    </h3>
                    <p className="text-muted-foreground">
                      {movie.production_companies
                        .map((company) => company.name)
                        .join(", ")}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
