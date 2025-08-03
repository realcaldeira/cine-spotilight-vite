import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import useEmblaCarousel from 'embla-carousel-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '../carousel';

// Mock embla-carousel-react
const mockScrollPrev = jest.fn();
const mockScrollNext = jest.fn();
const mockCanScrollPrev = jest.fn(() => true);
const mockCanScrollNext = jest.fn(() => true);
const mockOn = jest.fn();
const mockOff = jest.fn();

const mockApi = {
  scrollPrev: mockScrollPrev,
  scrollNext: mockScrollNext,
  canScrollPrev: mockCanScrollPrev,
  canScrollNext: mockCanScrollNext,
  on: mockOn,
  off: mockOff,
};

const mockCarouselRef = React.createRef<HTMLDivElement>();

jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: jest.fn(() => [mockCarouselRef, mockApi]),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ArrowLeft: ({ className, ...props }: React.ComponentProps<'span'>) => (
    <span data-testid="arrow-left-icon" className={className} {...props}>
      ArrowLeft
    </span>
  ),
  ArrowRight: ({ className, ...props }: React.ComponentProps<'span'>) => (
    <span data-testid="arrow-right-icon" className={className} {...props}>
      ArrowRight
    </span>
  ),
}));

// Mock Button component
jest.mock('../button', () => ({
  Button: React.forwardRef<HTMLButtonElement, React.ComponentProps<'button'>>(
    ({ children, className, onClick, disabled, ...props }, ref) => (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={className}
        data-testid="button"
        {...props}>
        {children}
      </button>
    )
  ),
}));

describe('Carousel Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCanScrollPrev.mockReturnValue(true);
    mockCanScrollNext.mockReturnValue(true);
  });

  describe('Carousel Root', () => {
    it('renders carousel container', () => {
      render(
        <Carousel>
          <div>Carousel content</div>
        </Carousel>
      );

      const carousel = screen.getByRole('region');
      expect(carousel).toBeInTheDocument();
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
    });

    it('applies custom className', () => {
      render(
        <Carousel className="custom-carousel">
          <div>Content</div>
        </Carousel>
      );

      const carousel = screen.getByRole('region');
      expect(carousel).toHaveClass('custom-carousel');
    });

    it('handles horizontal orientation by default', () => {
      render(
        <Carousel>
          <div>Content</div>
        </Carousel>
      );

      expect(useEmblaCarousel).toHaveBeenCalledWith(
        expect.objectContaining({
          axis: 'x',
        }),
        undefined
      );
    });

    it('handles vertical orientation', () => {
      render(
        <Carousel orientation="vertical">
          <div>Content</div>
        </Carousel>
      );

      expect(useEmblaCarousel).toHaveBeenCalledWith(
        expect.objectContaining({
          axis: 'y',
        }),
        undefined
      );
    });

    it('passes options to embla carousel', () => {
      const opts = { loop: true, align: 'start' as const };

      render(
        <Carousel opts={opts}>
          <div>Content</div>
        </Carousel>
      );

      expect(useEmblaCarousel).toHaveBeenCalledWith(
        expect.objectContaining({
          ...opts,
          axis: 'x',
        }),
        undefined
      );
    });

    it('passes plugins to embla carousel', () => {
      const mockPlugin = {
        name: 'test-plugin',
        options: {},
        init: jest.fn(),
        destroy: jest.fn(),
      };
      const plugins = [mockPlugin];

      render(
        <Carousel plugins={plugins}>
          <div>Content</div>
        </Carousel>
      );

      expect(useEmblaCarousel).toHaveBeenCalledWith(expect.anything(), plugins);
    });

    it('calls setApi when api changes', async () => {
      const setApi = jest.fn();

      render(
        <Carousel setApi={setApi}>
          <div>Content</div>
        </Carousel>
      );

      await waitFor(() => {
        expect(setApi).toHaveBeenCalledWith(mockApi);
      });
    });

    it('handles keyboard navigation - arrow left', () => {
      render(
        <Carousel>
          <div>Content</div>
        </Carousel>
      );

      const carousel = screen.getByRole('region');
      fireEvent.keyDown(carousel, { key: 'ArrowLeft' });

      expect(mockScrollPrev).toHaveBeenCalled();
    });

    it('handles keyboard navigation - arrow right', () => {
      render(
        <Carousel>
          <div>Content</div>
        </Carousel>
      );

      const carousel = screen.getByRole('region');
      fireEvent.keyDown(carousel, { key: 'ArrowRight' });

      expect(mockScrollNext).toHaveBeenCalled();
    });

    it('sets up event listeners on api', async () => {
      render(
        <Carousel>
          <div>Content</div>
        </Carousel>
      );

      await waitFor(() => {
        expect(mockOn).toHaveBeenCalledWith('reInit', expect.any(Function));
        expect(mockOn).toHaveBeenCalledWith('select', expect.any(Function));
      });
    });

    it('cleans up event listeners on unmount', async () => {
      const { unmount } = render(
        <Carousel>
          <div>Content</div>
        </Carousel>
      );

      unmount();

      await waitFor(() => {
        expect(mockOff).toHaveBeenCalledWith('select', expect.any(Function));
      });
    });
  });

  describe('CarouselContent', () => {
    it('renders content container', () => {
      render(
        <Carousel>
          <CarouselContent>
            <div>Content items</div>
          </CarouselContent>
        </Carousel>
      );

      const content = screen.getByText('Content items').parentElement;
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('flex');
    });

    it('applies horizontal styling by default', () => {
      render(
        <Carousel>
          <CarouselContent>
            <div>Content</div>
          </CarouselContent>
        </Carousel>
      );

      const content = screen.getByText('Content').parentElement;
      expect(content).toHaveClass('-ml-4');
      expect(content).not.toHaveClass('flex-col');
    });

    it('applies vertical styling for vertical orientation', () => {
      render(
        <Carousel orientation="vertical">
          <CarouselContent>
            <div>Content</div>
          </CarouselContent>
        </Carousel>
      );

      const content = screen.getByText('Content').parentElement;
      expect(content).toHaveClass('-mt-4', 'flex-col');
    });

    it('applies custom className', () => {
      render(
        <Carousel>
          <CarouselContent className="custom-content">
            <div>Content</div>
          </CarouselContent>
        </Carousel>
      );

      const content = screen.getByText('Content').parentElement;
      expect(content).toHaveClass('custom-content');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Carousel>
          <CarouselContent ref={ref}>
            <div>Content</div>
          </CarouselContent>
        </Carousel>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CarouselItem', () => {
    it('renders carousel item', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <div>Item content</div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      );

      const item = screen.getByRole('group');
      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute('aria-roledescription', 'slide');
      expect(screen.getByText('Item content')).toBeInTheDocument();
    });

    it('applies horizontal spacing by default', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <div>Item</div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      );

      const item = screen.getByRole('group');
      expect(item).toHaveClass('pl-4');
      expect(item).not.toHaveClass('pt-4');
    });

    it('applies vertical spacing for vertical orientation', () => {
      render(
        <Carousel orientation="vertical">
          <CarouselContent>
            <CarouselItem>
              <div>Item</div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      );

      const item = screen.getByRole('group');
      expect(item).toHaveClass('pt-4');
      expect(item).not.toHaveClass('pl-4');
    });

    it('applies custom className', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem className="custom-item">
              <div>Item</div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      );

      const item = screen.getByRole('group');
      expect(item).toHaveClass('custom-item');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem ref={ref}>
              <div>Item</div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CarouselPrevious', () => {
    it('renders previous button with arrow icon', () => {
      render(
        <Carousel>
          <CarouselPrevious />
        </Carousel>
      );

      const button = screen.getByTestId('button');
      expect(button).toBeInTheDocument();
      expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
      expect(screen.getByText('Previous slide')).toBeInTheDocument();
    });

    it('calls scrollPrev when clicked', () => {
      render(
        <Carousel>
          <CarouselPrevious />
        </Carousel>
      );

      const button = screen.getByTestId('button');
      fireEvent.click(button);

      expect(mockScrollPrev).toHaveBeenCalled();
    });

    it('is disabled when cannot scroll prev', () => {
      mockCanScrollPrev.mockReturnValue(false);

      render(
        <Carousel>
          <CarouselPrevious />
        </Carousel>
      );

      const button = screen.getByTestId('button');
      expect(button).toBeDisabled();
    });

    it('applies horizontal positioning by default', () => {
      render(
        <Carousel>
          <CarouselPrevious />
        </Carousel>
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('-left-12', 'top-1/2', '-translate-y-1/2');
      expect(button).not.toHaveClass('rotate-90');
    });

    it('applies vertical positioning for vertical orientation', () => {
      render(
        <Carousel orientation="vertical">
          <CarouselPrevious />
        </Carousel>
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveClass(
        '-top-12',
        'left-1/2',
        '-translate-x-1/2',
        'rotate-90'
      );
    });

    it('applies custom className', () => {
      render(
        <Carousel>
          <CarouselPrevious className="custom-prev" />
        </Carousel>
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('custom-prev');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <Carousel>
          <CarouselPrevious ref={ref} />
        </Carousel>
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('CarouselNext', () => {
    it('renders next button with arrow icon', () => {
      render(
        <Carousel>
          <CarouselNext />
        </Carousel>
      );

      const button = screen.getByTestId('button');
      expect(button).toBeInTheDocument();
      expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument();
      expect(screen.getByText('Next slide')).toBeInTheDocument();
    });

    it('calls scrollNext when clicked', () => {
      render(
        <Carousel>
          <CarouselNext />
        </Carousel>
      );

      const button = screen.getByTestId('button');
      fireEvent.click(button);

      expect(mockScrollNext).toHaveBeenCalled();
    });

    it('is disabled when cannot scroll next', () => {
      mockCanScrollNext.mockReturnValue(false);

      render(
        <Carousel>
          <CarouselNext />
        </Carousel>
      );

      const button = screen.getByTestId('button');
      expect(button).toBeDisabled();
    });

    it('applies horizontal positioning by default', () => {
      render(
        <Carousel>
          <CarouselNext />
        </Carousel>
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('-right-12', 'top-1/2', '-translate-y-1/2');
      expect(button).not.toHaveClass('rotate-90');
    });

    it('applies vertical positioning for vertical orientation', () => {
      render(
        <Carousel orientation="vertical">
          <CarouselNext />
        </Carousel>
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveClass(
        '-bottom-12',
        'left-1/2',
        '-translate-x-1/2',
        'rotate-90'
      );
    });

    it('applies custom className', () => {
      render(
        <Carousel>
          <CarouselNext className="custom-next" />
        </Carousel>
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('custom-next');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <Carousel>
          <CarouselNext ref={ref} />
        </Carousel>
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('useCarousel hook error handling', () => {
    it('components work correctly within Carousel context', () => {
      render(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Item</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      );

      // All components should render without errors
      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getByRole('group')).toBeInTheDocument();
      expect(screen.getAllByTestId('button')).toHaveLength(2);
    });
  });

  describe('Complete Carousel', () => {
    it('renders complete carousel structure', () => {
      render(
        <Carousel>
          <CarouselPrevious />
          <CarouselContent>
            <CarouselItem>
              <div>Slide 1</div>
            </CarouselItem>
            <CarouselItem>
              <div>Slide 2</div>
            </CarouselItem>
            <CarouselItem>
              <div>Slide 3</div>
            </CarouselItem>
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      );

      // Check carousel container
      expect(screen.getByRole('region')).toBeInTheDocument();

      // Check slides
      const slides = screen.getAllByRole('group');
      expect(slides).toHaveLength(3);
      expect(screen.getByText('Slide 1')).toBeInTheDocument();
      expect(screen.getByText('Slide 2')).toBeInTheDocument();
      expect(screen.getByText('Slide 3')).toBeInTheDocument();

      // Check navigation buttons
      const buttons = screen.getAllByTestId('button');
      expect(buttons).toHaveLength(2);
      expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument();
    });

    it('handles complex carousel interactions', async () => {
      render(
        <Carousel>
          <CarouselPrevious />
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      );

      const carousel = screen.getByRole('region');
      const buttons = screen.getAllByTestId('button');
      const [prevButton, nextButton] = buttons;

      // Test keyboard navigation
      fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
      expect(mockScrollPrev).toHaveBeenCalled();

      fireEvent.keyDown(carousel, { key: 'ArrowRight' });
      expect(mockScrollNext).toHaveBeenCalled();

      // Test button clicks
      fireEvent.click(prevButton);
      expect(mockScrollPrev).toHaveBeenCalledTimes(2);

      fireEvent.click(nextButton);
      expect(mockScrollNext).toHaveBeenCalledTimes(2);
    });
  });
});
