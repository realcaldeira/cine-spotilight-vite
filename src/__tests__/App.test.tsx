import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

jest.mock('../components/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return (
      <div data-testid="layout">
        <header data-testid="header">Header</header>
        <main data-testid="main">{children}</main>
      </div>
    );
  };
});

jest.mock('../pages/Home', () => {
  return function MockHome() {
    return (
      <div data-testid="home-page">
        <h1>Descubra seus próximos filmes favoritos</h1>
        <p>Explore uma vasta coleção de filmes</p>
      </div>
    );
  };
});

jest.mock('../pages/Favorites', () => {
  return function MockFavorites() {
    return (
      <div data-testid="favorites-page">
        <h1>Meus Favoritos</h1>
        <p>Seus filmes favoritos salvos</p>
      </div>
    );
  };
});

jest.mock('../pages/Search', () => {
  return function MockSearch() {
    return (
      <div data-testid="search-page">
        <h1>Buscar Filmes</h1>
        <input placeholder="Digite o nome do filme" />
      </div>
    );
  };
});

jest.mock('../pages/MovieDetails', () => {
  return function MockMovieDetails() {
    return (
      <div data-testid="movie-details-page">
        <h1>Detalhes do Filme</h1>
        <p>Informações detalhadas sobre o filme</p>
      </div>
    );
  };
});

jest.mock('../pages/NotFound', () => {
  return function MockNotFound() {
    return (
      <div data-testid="not-found-page">
        <h1>Oops! Page not found</h1>
        <p>The page you're looking for doesn't exist</p>
      </div>
    );
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
}));

const renderWithRouter = (
  component: React.ReactElement,
  { route = '/' } = {}
) => {
  return render(
    <MemoryRouter initialEntries={[route]}>{component}</MemoryRouter>
  );
};

describe('App', () => {
  it('should render home page by default', () => {
    renderWithRouter(<App />);

    expect(
      screen.getByText('Descubra seus próximos filmes favoritos')
    ).toBeInTheDocument();
  });

  it('should render favorites page on /favorites route', () => {
    renderWithRouter(<App />, { route: '/favorites' });

    expect(screen.getByText('Meus Favoritos')).toBeInTheDocument();
  });

  it('should render search page on /search route', () => {
    renderWithRouter(<App />, { route: '/search' });

    expect(screen.getByText('Buscar Filmes')).toBeInTheDocument();
  });

  it('should render movie details page on /movie/:id route', () => {
    renderWithRouter(<App />, { route: '/movie/123' });

    expect(screen.getByText('Detalhes do Filme')).toBeInTheDocument();
  });

  it('should render not found page for invalid routes', () => {
    renderWithRouter(<App />, { route: '/invalid-route' });

    expect(screen.getByText('Oops! Page not found')).toBeInTheDocument();
  });

  it('should have layout structure with header and main content', () => {
    const { container } = renderWithRouter(<App />);

    expect(container.querySelector('header')).toBeInTheDocument();

    expect(container.querySelector('main')).toBeInTheDocument();
  });
});
