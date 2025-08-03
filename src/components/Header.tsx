import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Heart, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMovies } from '@/contexts/MoviesContext';

export default function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, addSearchTerm } = useMovies();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addSearchTerm(searchQuery.trim());
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-md'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold text-netflix-red transition-all duration-300 group-hover:scale-110">
              CINE SPOTLIGHT
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white/80 hover:text-white transition-all duration-300 font-medium relative group">
              Início
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-netflix-red transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/favorites"
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300 font-medium relative group">
              <Heart className="h-4 w-4" />
              <span>Favoritos</span>
              {state.favorites.length > 0 && (
                <span className="bg-netflix-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {state.favorites.length}
                </span>
              )}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-netflix-red transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              {showSearch ? (
                <form
                  onSubmit={handleSearch}
                  className="flex items-center space-x-2">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Buscar filmes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 bg-black/60 border-white/20 text-white placeholder:text-white/60 focus:border-netflix-red focus:bg-black/80 transition-all duration-300 pr-10"
                      autoFocus
                      onBlur={() => !searchQuery && setShowSearch(false)}
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                  onClick={() => setShowSearch(true)}>
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            <div className="md:hidden">
              <form
                onSubmit={handleSearch}
                className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4 pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-10 w-40 bg-black/60 border-white/20 text-white placeholder:text-white/60 focus:border-netflix-red"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <Search className="h-3 w-3" />
                  </Button>
                </div>
              </form>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300">
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300">
                <User className="h-5 w-5" />
              </Button>
            </div>

            <Link
              to="/favorites"
              className="md:hidden flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
              <Heart className="h-5 w-5" />
              {state.favorites.length > 0 && (
                <span className="bg-netflix-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.favorites.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
