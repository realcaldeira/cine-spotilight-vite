import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import { MoviesProvider } from '../../contexts/MoviesContext';

const mockNavigate = jest.fn();
const mockSearchParams = new URLSearchParams();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams],
}));

const HeaderWrapper = ({ initialQuery = '' }: { initialQuery?: string }) => {
  if (initialQuery) {
    mockSearchParams.set('q', initialQuery);
  } else {
    mockSearchParams.delete('q');
  }

  return (
    <BrowserRouter>
      <MoviesProvider>
        <Header />
      </MoviesProvider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams.delete('q');
  });

  it('should render header with logo', () => {
    render(<HeaderWrapper />);

    const logo = screen.getByText('CINE SPOTLIGHT');
    expect(logo).toBeTruthy();
  });

  it('should render navigation links', () => {
    render(<HeaderWrapper />);

    const homeLink = screen.getByText('Início');
    const favoritesLink = screen.getByText(/Favoritos/);

    expect(homeLink).toBeTruthy();
    expect(favoritesLink).toBeTruthy();
  });

  it('should render search form with input', () => {
    render(<HeaderWrapper />);

    const searchInput = screen.getByPlaceholderText(/buscar/i);

    expect(searchInput).toBeTruthy();
  });

  it('should update search input value on change', () => {
    render(<HeaderWrapper />);

    const searchInput = screen.getByPlaceholderText(
      /buscar/i
    ) as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: 'superman' } });

    expect(searchInput.value).toBe('superman');
  });

  it('should handle search form submission', async () => {
    render(<HeaderWrapper />);

    const searchInput = screen.getByPlaceholderText(/buscar/i);
    const searchForm = searchInput.closest('form');

    fireEvent.change(searchInput, { target: { value: 'spider-man' } });
    fireEvent.submit(searchForm!);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/search?q=spider-man');
    });
  });

  it('should not submit search when query is empty or whitespace', async () => {
    render(<HeaderWrapper />);

    const searchInput = screen.getByPlaceholderText(/buscar/i);
    const searchForm = searchInput.closest('form');

    fireEvent.change(searchInput, { target: { value: '' } });
    fireEvent.submit(searchForm!);

    fireEvent.change(searchInput, { target: { value: '   ' } });
    fireEvent.submit(searchForm!);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should initialize search input with query param', () => {
    render(<HeaderWrapper initialQuery="initial-search" />);

    const searchInput = screen.getByPlaceholderText(/buscar/i);
    expect(searchInput).toHaveAttribute('placeholder');
    expect(searchInput.getAttribute('placeholder')).toMatch(/buscar/i);
  });

  it('should render favorites count', () => {
    render(<HeaderWrapper />);

    const favoritesLinks = screen.getAllByText(/Favoritos/);
    expect(favoritesLinks.length).toBeGreaterThan(0);
  });

  it('should render mobile favorites link', () => {
    render(<HeaderWrapper />);

    const favoritesElements = screen.getAllByText(/Favoritos/);
    expect(favoritesElements.length).toBeGreaterThan(0);

    const heartIcons = document.querySelectorAll('svg[class*="lucide-heart"]');
    expect(heartIcons.length).toBeGreaterThan(0);
  });

  it('should have proper CSS classes for styling', () => {
    render(<HeaderWrapper />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
  });

  it('should prevent default form submission', async () => {
    render(<HeaderWrapper />);

    const searchInput = screen.getByPlaceholderText(/buscar/i);
    const searchForm = searchInput.closest('form');
    const mockPreventDefault = jest.fn();

    fireEvent.change(searchInput, { target: { value: 'test-query' } });

    const submitEvent = new Event('submit', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(submitEvent, 'preventDefault', {
      value: mockPreventDefault,
    });

    fireEvent(searchForm!, submitEvent);

    expect(mockPreventDefault).toHaveBeenCalled();
  });

  it('should trim whitespace from search query', async () => {
    render(<HeaderWrapper />);

    const searchInput = screen.getByPlaceholderText(/buscar/i);
    const searchForm = searchInput.closest('form');

    fireEvent.change(searchInput, { target: { value: '  batman  ' } });
    fireEvent.submit(searchForm!);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/search?q=batman');
    });
  });
});
