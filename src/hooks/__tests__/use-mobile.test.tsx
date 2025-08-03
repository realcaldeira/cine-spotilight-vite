import { renderHook } from '@testing-library/react';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock window.matchMedia and window.innerWidth
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

describe('useIsMobile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true for mobile screen sizes', () => {
    mockMatchMedia(true);
    mockInnerWidth(500); // Mobile width

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('should return false for desktop screen sizes', () => {
    mockMatchMedia(false);
    mockInnerWidth(1024); // Desktop width

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('should use correct media query', () => {
    mockMatchMedia(false);
    mockInnerWidth(1024);

    renderHook(() => useIsMobile());

    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)');
  });
});
