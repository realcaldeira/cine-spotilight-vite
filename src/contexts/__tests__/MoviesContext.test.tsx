
import { renderHook, act } from '@testing-library/react';
import { MoviesProvider, useMovies } from '@/contexts/MoviesContext';
import { mockMovie } from '@/test/mocks';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('MoviesContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MoviesProvider>{children}</MoviesProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('should provide initial state', () => {
    const { result } = renderHook(() => useMovies(), { wrapper });

    expect(result.current.state.favorites).toEqual([]);
    expect(result.current.state.searchHistory).toEqual([]);
  });

  it('should load favorites from localStorage on mount', () => {
    const savedFavorites = [mockMovie];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedFavorites));

    const { result } = renderHook(() => useMovies(), { wrapper });

    expect(result.current.state.favorites).toEqual(savedFavorites);
  });

  it('should handle localStorage parsing errors', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid json');
    console.error = jest.fn();

    const { result } = renderHook(() => useMovies(), { wrapper });

    expect(result.current.state.favorites).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });

  it('should add movie to favorites', () => {
    const { result } = renderHook(() => useMovies(), { wrapper });

    act(() => {
      result.current.addFavorite(mockMovie);
    });

    expect(result.current.state.favorites).toContain(mockMovie);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'netflix-favorites',
      JSON.stringify([mockMovie])
    );
  });

  it('should not add duplicate favorites', () => {
    const { result } = renderHook(() => useMovies(), { wrapper });

    act(() => {
      result.current.addFavorite(mockMovie);
      result.current.addFavorite(mockMovie);
    });

    expect(result.current.state.favorites).toHaveLength(1);
  });

  it('should remove movie from favorites', () => {
    const { result } = renderHook(() => useMovies(), { wrapper });

    act(() => {
      result.current.addFavorite(mockMovie);
    });

    expect(result.current.state.favorites).toContain(mockMovie);

    act(() => {
      result.current.removeFavorite(mockMovie.id);
    });

    expect(result.current.state.favorites).not.toContain(mockMovie);
  });

  it('should check if movie is favorite', () => {
    const { result } = renderHook(() => useMovies(), { wrapper });

    expect(result.current.isFavorite(mockMovie.id)).toBe(false);

    act(() => {
      result.current.addFavorite(mockMovie);
    });

    expect(result.current.isFavorite(mockMovie.id)).toBe(true);
  });

  it('should add search term to history', () => {
    const { result } = renderHook(() => useMovies(), { wrapper });

    act(() => {
      result.current.addSearchTerm('test search');
    });

    expect(result.current.state.searchHistory).toContain('test search');
  });

  it('should not add empty search terms', () => {
    const { result } = renderHook(() => useMovies(), { wrapper });

    act(() => {
      result.current.addSearchTerm('   ');
    });

    expect(result.current.state.searchHistory).toHaveLength(0);
  });

  it('should limit search history to 5 items', () => {
    const { result } = renderHook(() => useMovies(), { wrapper });

    act(() => {
      for (let i = 1; i <= 7; i++) {
        result.current.addSearchTerm(`search ${i}`);
      }
    });

    expect(result.current.state.searchHistory).toHaveLength(5);
    expect(result.current.state.searchHistory[0]).toBe('search 7');
  });

  it('should move existing search term to top', () => {
    const { result } = renderHook(() => useMovies(), { wrapper });

    act(() => {
      result.current.addSearchTerm('search 1');
      result.current.addSearchTerm('search 2');
      result.current.addSearchTerm('search 1');
    });

    expect(result.current.state.searchHistory[0]).toBe('search 1');
    expect(result.current.state.searchHistory).toHaveLength(2);
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useMovies());
    }).toThrow('useMovies must be used within a MoviesProvider');
  });
});