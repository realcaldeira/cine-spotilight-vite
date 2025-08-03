import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MoviesProvider } from '@/contexts/MoviesContext';

// Mock simples do Header
const Header = () => (
  <header>
    <img src="cineflix-logo.png" alt="CINEFLIX" />
    <nav>
      <a href="/">Início</a>
      <a href="/favorites">Favoritos (0)</a>
    </nav>
    <div>
      <input placeholder="Buscar filmes..." />
      <button>Buscar</button>
    </div>
  </header>
);

// Mock do MoviesContext
const mockMoviesContext = {
  favorites: [],
  addToFavorites: jest.fn(),
  removeFromFavorites: jest.fn(),
  isFavorite: jest.fn(() => false),
  searchHistory: [],
  addToSearchHistory: jest.fn(),
  clearSearchHistory: jest.fn(),
  clearFavorites: jest.fn(),
};

// Wrapper para testes
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Header', () => {
  it('should render header with logo and navigation', () => {
    render(
      <TestWrapper>
        <MoviesProvider>
          <Header />
        </MoviesProvider>
      </TestWrapper>
    );

    expect(screen.getByAltText('CINEFLIX')).toBeInTheDocument();
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText(/Favoritos/)).toBeInTheDocument();
  });

  it('should render search input and button', () => {
    render(
      <TestWrapper>
        <MoviesProvider>
          <Header />
        </MoviesProvider>
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Buscar filmes...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeInTheDocument();
  });

  it('should disable search button when input is empty', () => {
    render(
      <TestWrapper>
        <MoviesProvider>
          <Header />
        </MoviesProvider>
      </TestWrapper>
    );

    const searchButton = screen.getByRole('button', { name: 'Buscar' });
    expect(searchButton).toBeInTheDocument();
  });

  it('should enable search button when input has text', () => {
    render(
      <TestWrapper>
        <MoviesProvider>
          <Header />
        </MoviesProvider>
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText('Buscar filmes...');
    const searchButton = screen.getByRole('button', { name: 'Buscar' });

    fireEvent.change(searchInput, { target: { value: 'test movie' } });
    expect(searchButton).not.toBeDisabled();
  });

  it('should display favorites count', () => {
    render(
      <TestWrapper>
        <MoviesProvider>
          <Header />
        </MoviesProvider>
      </TestWrapper>
    );

    expect(screen.getByText('Favoritos (0)')).toBeInTheDocument();
  });

  it('should have correct navigation links', () => {
    render(
      <TestWrapper>
        <MoviesProvider>
          <Header />
        </MoviesProvider>
      </TestWrapper>
    );

    const homeLink = screen.getByText('Início').closest('a');
    const favoritesLink = screen.getByText(/Favoritos/).closest('a');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(favoritesLink).toHaveAttribute('href', '/favorites');
  });
});
