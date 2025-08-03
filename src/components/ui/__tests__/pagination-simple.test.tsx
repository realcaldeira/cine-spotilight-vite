import { render } from '@testing-library/react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '../pagination';

describe('Pagination Components', () => {
  it('renders pagination components correctly', () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(container.firstChild).toBeDefined();
  });
});
