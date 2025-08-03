import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Trash2, Play, Info } from 'lucide-react';
import { Movie } from '@/types/movie';
import { tmdbService } from '@/services/tmdb';
import { useMovies } from '@/contexts/MoviesContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MovieCardProps {
  movie: Movie;
  showRemoveButton?: boolean;
  searchTerm?: string;
}

export default function MovieCard({
  movie,
  showRemoveButton = false,
  searchTerm,
}: MovieCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useMovies();
  const favorite = isFavorite(movie.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (favorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavorite(movie.id);
  };

  const highlightSearchTerm = (text: string, term?: string) => {
    if (!term) return text;

    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-netflix-red/30 text-netflix-text">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-zinc-900 transition-all duration-500 hover:scale-105 hover:z-10">
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
          <img
            src={tmdbService.getPosterUrl(movie.poster_path)}
            alt={movie.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            {showRemoveButton ? (
              <Button
                size="sm"
                variant="destructive"
                className="h-9 w-9 p-0 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
                onClick={handleRemoveClick}
                data-testid={`remove-favorite-${movie.id}`}>
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                className={`h-9 w-9 p-0 rounded-full shadow-lg hover:scale-110 transition-all duration-200 ${
                  favorite
                    ? 'bg-netflix-red hover:bg-netflix-red/90 text-white border-2 border-white/20'
                    : 'bg-black/60 hover:bg-black/80 text-white border-2 border-white/20'
                }`}
                onClick={handleFavoriteClick}
                aria-label={
                  favorite ? 'Remove from favorites' : 'Add to favorites'
                }
                data-testid={`favorite-${movie.id}`}>
                <Heart
                  className={`h-4 w-4 transition-transform duration-200 ${
                    favorite ? 'fill-current scale-110' : 'hover:scale-110'
                  }`}
                />
              </Button>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center space-x-1 bg-black/80 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs font-bold text-white">
                  {movie.vote_average !== null &&
                  movie.vote_average !== undefined
                    ? movie.vote_average.toFixed(1)
                    : 'N/A'}
                </span>
              </div>
              <div className="bg-black/80 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <span className="text-xs font-medium text-white">
                  {movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                className="bg-white text-black hover:bg-white/90 font-semibold rounded-full px-4 py-2 h-8 transition-all duration-200 hover:scale-105"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}>
                <Play className="h-3 w-3 mr-1.5 fill-current" />
                Play
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-black/60 border-white/30 text-white hover:bg-black/80 hover:border-white/50 rounded-full h-8 w-8 p-0 transition-all duration-200 hover:scale-105"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}>
                <Info className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-3 bg-zinc-900">
          <h3 className="font-semibold text-sm text-white line-clamp-2 mb-1 group-hover:text-netflix-red transition-colors duration-300">
            {highlightSearchTerm(movie.title, searchTerm)}
          </h3>
        </div>
      </Link>
    </div>
  );
}
