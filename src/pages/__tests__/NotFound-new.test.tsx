import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MoviesProvider } from '../../contexts/MoviesContext';
import NotFound from '../NotFound';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <MoviesProvider>{component}</MoviesProvider>
    </BrowserRouter>
  );
};

describe('NotFound', () => {
  it('should render not found page', () => {
    renderWithRouter(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Oops! Page not found')).toBeInTheDocument();
  });

  it('should render back to home link', () => {
    renderWithRouter(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /return to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should have proper styling', () => {
    renderWithRouter(<NotFound />);

    const container = screen.getByText('404').closest('div');
    expect(container).toHaveClass('text-center');
  });

  it('should display error code prominently', () => {
    renderWithRouter(<NotFound />);

    const errorCode = screen.getByText('404');
    expect(errorCode).toHaveClass('text-4xl', 'font-bold');
  });

  it('should have accessible navigation', () => {
    renderWithRouter(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /return to home/i });
    expect(homeLink).toBeInTheDocument();
  });
});
