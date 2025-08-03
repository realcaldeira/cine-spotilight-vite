import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Filter } from 'lucide-react';
import { useMovies } from '@/contexts/MoviesContext';
import { Movie } from '@/types/movie';
import MovieCard from '@/components/MovieCard';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SortOption = 'title-asc' | 'title-desc' | 'rating-desc' | 'rating-asc' | 'date-desc' | 'date-asc';

export default function Favorites() {
  const { state } = useMovies();
  const [sortBy, setSortBy] = useState<SortOption>('title-asc');
  const [showFilters, setShowFilters] = useState(false);

  const sortedFavorites = useMemo(() => {
    const favorites = [...state.favorites];
    
    switch (sortBy) {
      case 'title-asc':
        return favorites.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return favorites.sort((a, b) => b.title.localeCompare(a.title));
      case 'rating-desc':
        return favorites.sort((a, b) => b.vote_average - a.vote_average);
      case 'rating-asc':
        return favorites.sort((a, b) => a.vote_average - b.vote_average);
      case 'date-desc':
        return favorites.sort((a, b) => 
          new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
        );
      case 'date-asc':
        return favorites.sort((a, b) => 
          new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
        );
      default:
        return favorites;
    }
  }, [state.favorites, sortBy]);

  const getSortLabel = (option: SortOption) => {
    const labels = {
      'title-asc': 'Título (A-Z)',
      'title-desc': 'Título (Z-A)',
      'rating-desc': 'Nota (Maior-Menor)',
      'rating-asc': 'Nota (Menor-Maior)',
      'date-desc': 'Mais Recentes',
      'date-asc': 'Mais Antigos'
    };
    return labels[option];
  };

  if (state.favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            type="favorites"
            title="Nenhum filme favorito"
            description="Você ainda não adicionou nenhum filme aos seus favoritos. Explore nossa coleção e adicione filmes que você gosta!"
            actionText="Descobrir filmes"
            actionLink="/"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Meus Favoritos
            </h1>
            <p className="text-muted-foreground">
              {state.favorites.length} {state.favorites.length === 1 ? 'filme favoritado' : 'filmes favoritados'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="border-border hover:bg-secondary"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        
        {showFilters && (
          <div className="bg-card border border-border rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Ordenar por:</span>
              </div>
              
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Selecione a ordenação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title-asc">{getSortLabel('title-asc')}</SelectItem>
                  <SelectItem value="title-desc">{getSortLabel('title-desc')}</SelectItem>
                  <SelectItem value="rating-desc">{getSortLabel('rating-desc')}</SelectItem>
                  <SelectItem value="rating-asc">{getSortLabel('rating-asc')}</SelectItem>
                  <SelectItem value="date-desc">{getSortLabel('date-desc')}</SelectItem>
                  <SelectItem value="date-asc">{getSortLabel('date-asc')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sortedFavorites.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              showRemoveButton={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}