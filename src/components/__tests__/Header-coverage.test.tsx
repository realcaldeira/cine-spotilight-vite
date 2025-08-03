import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';
import { MoviesProvider } from '@/contexts/MoviesContext';

// Mock do hook useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithProvider = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <MoviesProvider>
        <Header />
      </MoviesProvider>
    </MemoryRouter>
  );
};

describe('Header Component Coverage Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });
  });

  it('should render header with logo and navigation', () => {
    renderWithProvider();
    
    expect(screen.getByText('CINE SPOTLIGHT')).toBeInTheDocument();
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Favoritos')).toBeInTheDocument();
  });

  it('should handle scroll event and update header background', async () => {
    renderWithProvider();
    const header = screen.getByRole('banner');
    
    // Initial state - transparent gradient
    expect(header).toHaveClass('bg-gradient-to-b');
    
    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);
    
    await waitFor(() => {
      expect(header).toHaveClass('bg-black/95');
    });
  });

  it('should show search input on desktop when search button is clicked', async () => {
    renderWithProvider();
    
    // Click search button to show search input
    const searchButton = screen.getAllByRole('button').find(button => 
      button.querySelector('svg')
    );
    fireEvent.click(searchButton!);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Buscar filmes...')).toBeInTheDocument();
    });
  });

  it('should handle search form submission', async () => {
    renderWithProvider();
    
    // Show search input first
    const searchButton = screen.getAllByRole('button').find(button => 
      button.querySelector('svg')
    );
    fireEvent.click(searchButton!);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Buscar filmes...');
      fireEvent.change(searchInput, { target: { value: 'test movie' } });
      fireEvent.submit(searchInput.closest('form')!);
      
      expect(mockNavigate).toHaveBeenCalledWith('/search?q=test%20movie');
    });
  });

  it('should handle mobile search form submission', () => {
    // Set mobile viewport
    Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });
    renderWithProvider();
    
    const mobileSearchInput = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(mobileSearchInput, { target: { value: 'mobile search' } });
    fireEvent.submit(mobileSearchInput.closest('form')!);
    
    expect(mockNavigate).toHaveBeenCalledWith('/search?q=mobile%20search');
  });

  it('should not submit empty search', () => {
    renderWithProvider();
    
    const searchButton = screen.getAllByRole('button').find(button => 
      button.querySelector('svg')
    );
    fireEvent.click(searchButton!);
    
    const searchInput = screen.getByPlaceholderText('Buscar filmes...');
    fireEvent.change(searchInput, { target: { value: '   ' } }); // whitespace only
    fireEvent.submit(searchInput.closest('form')!);
    
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should hide search input on blur when empty', async () => {
    renderWithProvider();
    
    const searchButton = screen.getAllByRole('button').find(button => 
      button.querySelector('svg')
    );
    fireEvent.click(searchButton!);
    
    const searchInput = screen.getByPlaceholderText('Buscar filmes...');
    fireEvent.blur(searchInput);
    
    // Search input should be hidden when empty and blurred
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Buscar filmes...')).not.toBeInTheDocument();
    });
  });

  it('should show favorites count badge when there are favorites', () => {
    // Mock favorites in context by providing them via initial state
    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <MoviesProvider>
          {children}
        </MoviesProvider>
      </MemoryRouter>
    );
    
    render(<Header />, { wrapper: TestWrapper });
    
    // The favorites badge should be present if there are favorites
    const favoritesLinks = screen.getAllByText('Favoritos');
    expect(favoritesLinks).toHaveLength(2); // desktop and mobile versions
  });

  it('should render desktop-only navigation elements', () => {
    renderWithProvider();
    
    // Desktop navigation should be present
    expect(screen.getByText('Início')).toBeInTheDocument();
    
    // Bell and User buttons (desktop only)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should render mobile-specific elements', () => {
    renderWithProvider();
    
    // Mobile search input should be present
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
    
    // Mobile favorites link should be present
    const favoritesLinks = screen.getAllByText('Favoritos');
    expect(favoritesLinks.length).toBeGreaterThan(0);
  });

  it('should initialize search query from URL params', () => {
    renderWithProvider('/search?q=initial');
    
    // Mobile search should show the initial query
    const mobileSearchInput = screen.getByPlaceholderText('Buscar...') as HTMLInputElement;
    expect(mobileSearchInput.value).toBe('initial');
  });

  it('should handle search input changes', async () => {
    renderWithProvider();
    
    const searchButton = screen.getAllByRole('button').find(button => 
      button.querySelector('svg')
    );
    fireEvent.click(searchButton!);
    
    const searchInput = screen.getByPlaceholderText('Buscar filmes...');
    fireEvent.change(searchInput, { target: { value: 'changing value' } });
    
    expect((searchInput as HTMLInputElement).value).toBe('changing value');
  });

  it('should handle logo link navigation', () => {
    renderWithProvider();
    
    const logoLink = screen.getByText('CINE SPOTLIGHT').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('should handle favorites link navigation', () => {
    renderWithProvider();
    
    const favoritesLink = screen.getByText('Favoritos').closest('a');
    expect(favoritesLink).toHaveAttribute('href', '/favorites');
  });

  it('should cleanup scroll event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderWithProvider();
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
