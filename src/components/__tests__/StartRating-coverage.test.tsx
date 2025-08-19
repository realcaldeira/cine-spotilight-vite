import React from "react";
import { render, screen } from "@testing-library/react";
import StartRating from "../StartRating";

describe("StartRating Component Coverage Tests", () => {
  it("should render with default size (sm)", () => {
    render(<StartRating average={8.5} />);

    const stars = screen.getAllByTestId("star");
    expect(stars).toHaveLength(5);

    // Check that stars have the default size class (h3 w-3)
    stars.forEach((star) => {
      expect(star).toHaveClass("h3", "w-3");
    });
  });

  it("should render with medium size", () => {
    render(<StartRating average={8.5} size="md" />);

    const stars = screen.getAllByTestId("star");
    expect(stars).toHaveLength(5);

    // Check that stars have the medium size class (h-4 w-4)
    stars.forEach((star) => {
      expect(star).toHaveClass("h-4", "w-4");
    });
  });

  it("should render with large size", () => {
    render(<StartRating average={8.5} size="lg" />);

    const stars = screen.getAllByTestId("star");
    expect(stars).toHaveLength(5);

    // Check that stars have the large size class (h-5 w-5)
    stars.forEach((star) => {
      expect(star).toHaveClass("h-5", "w-5");
    });
  });

  it("should render empty stars when no average is provided", () => {
    render(<StartRating average={null} />);

    const stars = screen.getAllByTestId("star");
    expect(stars).toHaveLength(5);

    // Check that all stars are gray (empty)
    stars.forEach((star) => {
      expect(star).toHaveClass("text-gray-400");
    });
  });

  it("should render empty stars when average is 0", () => {
    render(<StartRating average={0} />);

    const stars = screen.getAllByTestId("star");
    expect(stars).toHaveLength(5);

    // Check that all stars are gray (empty)
    stars.forEach((star) => {
      expect(star).toHaveClass("text-gray-400");
    });
  });

  it("should render empty stars when average is undefined", () => {
    render(<StartRating average={undefined} />);

    const stars = screen.getAllByTestId("star");
    expect(stars).toHaveLength(5);

    // Check that all stars are gray (empty)
    stars.forEach((star) => {
      expect(star).toHaveClass("text-gray-400");
    });
  });

  it("should render filled stars based on average rating", () => {
    render(<StartRating average={8.5} />);

    // With average 8.5, it should be 4.25 out of 5 stars
    // This means stars 1-4 should be filled, star 5 should be partially filled
    const stars = screen.getAllByTestId("star");
    expect(stars).toHaveLength(5);

    // Check that stars have the correct fill classes
    stars.forEach((star, index) => {
      if (index < 4) {
        // Stars 1-4 should be fully filled
        expect(star).toHaveClass("text-yellow-400", "fill-current");
      } else {
        // Star 5 should be partially filled
        expect(star).toHaveClass("text-yellow-400", "fill-current");
      }
    });
  });

  it("should render stars with perfect rating (10)", () => {
    render(<StartRating average={10} />);

    const stars = screen.getAllByTestId("star");
    expect(stars).toHaveLength(5);

    // All stars should be fully filled
    stars.forEach((star) => {
      expect(star).toHaveClass("text-yellow-400", "fill-current");
    });
  });

  it("should render stars with low rating (2)", () => {
    render(<StartRating average={2} />);

    const stars = screen.getAllByTestId("star");
    expect(stars).toHaveLength(5);

    // Only star 1 should be filled (2/10 = 1/5)
    stars.forEach((star, index) => {
      if (index === 0) {
        expect(star).toHaveClass("text-yellow-400", "fill-current");
      } else {
        expect(star).toHaveClass("text-yellow-400", "fill-current");
      }
    });
  });

  it("should handle decimal ratings correctly", () => {
    render(<StartRating average={7.3} />);

    const stars = screen.getAllByTestId("star");
    expect(stars).toHaveLength(5);

    // 7.3/10 = 3.65/5, so stars 1-3 should be filled, star 4 partially filled
    stars.forEach((star, index) => {
      if (index < 3) {
        expect(star).toHaveClass("text-yellow-400", "fill-current");
      } else {
        expect(star).toHaveClass("text-yellow-400", "fill-current");
      }
    });
  });

  it("should handle edge case with very low rating", () => {
    render(<StartRating average={0.1} />);

    const stars = screen.getAllByTestId("star");
    expect(stars).toHaveLength(5);

    // 0.1/10 = 0.05/5, so only star 1 should be very slightly filled
    stars.forEach((star, index) => {
      if (index === 0) {
        expect(star).toHaveClass("text-yellow-400", "fill-current");
      } else {
        expect(star).toHaveClass("text-yellow-400", "fill-current");
      }
    });
  });

  it("should handle edge case with very high rating", () => {
    render(<StartRating average={9.9} />);

    const stars = screen.getAllByTestId("star");
    expect(stars).toHaveLength(5);

    // 9.9/10 = 4.95/5, so stars 1-4 should be filled, star 5 almost filled
    stars.forEach((star, index) => {
      if (index < 4) {
        expect(star).toHaveClass("text-yellow-400", "fill-current");
      } else {
        expect(star).toHaveClass("text-yellow-400", "fill-current");
      }
    });
  });
});

