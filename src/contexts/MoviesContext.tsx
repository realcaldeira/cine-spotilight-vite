import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Movie } from '@/types/movie';

interface MoviesState {
  favorites: Movie[];
  searchHistory: string[];
}

type MoviesAction =
  | { type: 'ADD_FAVORITE'; payload: Movie }
  | { type: 'REMOVE_FAVORITE'; payload: number }
  | { type: 'ADD_SEARCH_TERM'; payload: string }
  | { type: 'LOAD_FAVORITES'; payload: Movie[] };

interface MoviesContextType {
  state: MoviesState;
  addFavorite: (movie: Movie) => void;
  removeFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
  addSearchTerm: (term: string) => void;
}

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

const initialState: MoviesState = {
  favorites: [],
  searchHistory: [],
};

function moviesReducer(state: MoviesState, action: MoviesAction): MoviesState {
  switch (action.type) {
    case 'ADD_FAVORITE':
      if (state.favorites.some((movie) => movie.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };

    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(
          (movie) => movie.id !== action.payload
        ),
      };

    case 'ADD_SEARCH_TERM': {
      const filteredHistory = state.searchHistory.filter(
        (term) => term !== action.payload
      );
      return {
        ...state,
        searchHistory: [action.payload, ...filteredHistory].slice(0, 5),
      };
    }

    case 'LOAD_FAVORITES':
      return {
        ...state,
        favorites: action.payload,
      };

    default:
      return state;
  }
}

export function MoviesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(moviesReducer, initialState);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('netflix-favorites');
    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        dispatch({ type: 'LOAD_FAVORITES', payload: favorites });
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('netflix-favorites', JSON.stringify(state.favorites));
  }, [state.favorites]);

  const addFavorite = (movie: Movie) => {
    dispatch({ type: 'ADD_FAVORITE', payload: movie });
  };

  const removeFavorite = (movieId: number) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: movieId });
  };

  const isFavorite = (movieId: number) => {
    return state.favorites.some((movie) => movie.id === movieId);
  };

  const addSearchTerm = (term: string) => {
    if (term.trim()) {
      dispatch({ type: 'ADD_SEARCH_TERM', payload: term.trim() });
    }
  };

  return (
    <MoviesContext.Provider
      value={{
        state,
        addFavorite,
        removeFavorite,
        isFavorite,
        addSearchTerm,
      }}>
      {children}
    </MoviesContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MoviesContext);
  if (context === undefined) {
    throw new Error('useMovies must be used within a MoviesProvider');
  }
  return context;
}
