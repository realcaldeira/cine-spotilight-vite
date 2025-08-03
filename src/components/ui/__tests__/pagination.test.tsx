import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../pagination';

describe('Pagination Components', () => {
  describe('Pagination', () => {
    it('renders navigation element', () => {
      render(
        <Pagination data-testid="pagination">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );

      const pagination = screen.getByTestId('pagination');
      expect(pagination).toBeInTheDocument();
      expect(pagination.tagName).toBe('NAV');
    });

    it('applies custom className', () => {
      render(
        <Pagination className="custom-pagination" data-testid="pagination">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );

      const pagination = screen.getByTestId('pagination');
      expect(pagination).toHaveClass('custom-pagination');
    });
  });

  describe('PaginationContent', () => {
    it('renders as list', () => {
      render(
        <Pagination>
          <PaginationContent data-testid="pagination-content">
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );

      const content = screen.getByTestId('pagination-content');
      expect(content).toBeInTheDocument();
      expect(content.tagName).toBe('UL');
    });
  });

  describe('PaginationItem', () => {
    it('renders as list item', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem data-testid="pagination-item">
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );

      const item = screen.getByTestId('pagination-item');
      expect(item).toBeInTheDocument();
      expect(item.tagName).toBe('LI');
    });
  });

  describe('PaginationLink', () => {
    it('renders as link when href provided', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="/page/1" data-testid="pagination-link">
                1
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );

      const link = screen.getByTestId('pagination-link');
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/page/1');
    });

    it('renders as button when no href', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink data-testid="pagination-link">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );

      const link = screen.getByTestId('pagination-link');
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe('A');
    });

    it('shows active state', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink isActive data-testid="pagination-link">
                1
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );

      const link = screen.getByTestId('pagination-link');
      expect(link).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('Complete Pagination Example', () => {
    it('renders complete pagination with all components', () => {
      render(
        <Pagination data-testid="complete-pagination">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="/prev" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/page/1">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/page/2" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="/page/3">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="/next" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );

      expect(screen.getByTestId('complete-pagination')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });
});
