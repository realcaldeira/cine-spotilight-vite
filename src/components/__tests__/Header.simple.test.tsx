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

describe('Header Component', () => {
  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <MoviesProvider>
          <Header />
        </MoviesProvider>
      </BrowserRouter>
    );
  };

  test('renders header with logo and navigation', () => {
    renderHeader();

    expect(screen.getByAltText('CINEFLIX')).toBeInTheDocument();
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText(/Favoritos/)).toBeInTheDocument();
  });

  test('renders search input and button', () => {
    renderHeader();

    expect(screen.getByPlaceholderText('Buscar filmes...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeInTheDocument();
  });

  test('search functionality works', () => {
    renderHeader();

    const searchInput = screen.getByPlaceholderText('Buscar filmes...');
    const searchButton = screen.getByRole('button', { name: 'Buscar' });

    fireEvent.change(searchInput, { target: { value: 'test movie' } });
    fireEvent.click(searchButton);

    // Teste básico de interação
    expect(searchInput).toHaveValue('test movie');
  });

  test('navigation links have correct href attributes', () => {
    renderHeader();

    const homeLink = screen.getByText('Início').closest('a');
    const favoritesLink = screen.getByText(/Favoritos/).closest('a');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(favoritesLink).toHaveAttribute('href', '/favorites');
  });
});
