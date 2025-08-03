import { render, screen } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '../table';

describe('Table Components', () => {
  describe('Table', () => {
    it('should render table element', () => {
      render(
        <Table data-testid="table">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByTestId('table')).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Table className="custom-table" data-testid="table">
          <TableBody>
            <TableRow>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const table = screen.getByTestId('table');
      expect(table).toHaveClass('custom-table');
    });
  });

  describe('TableHeader', () => {
    it('should render table header', () => {
      render(
        <Table>
          <TableHeader data-testid="table-header">
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      expect(screen.getByTestId('table-header')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Table>
          <TableHeader className="custom-header" data-testid="table-header">
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      const header = screen.getByTestId('table-header');
      expect(header).toHaveClass('custom-header');
    });
  });

  describe('TableBody', () => {
    it('should render table body', () => {
      render(
        <Table>
          <TableBody data-testid="table-body">
            <TableRow>
              <TableCell>Body content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByTestId('table-body')).toBeInTheDocument();
      expect(screen.getByText('Body content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Table>
          <TableBody className="custom-body" data-testid="table-body">
            <TableRow>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const body = screen.getByTestId('table-body');
      expect(body).toHaveClass('custom-body');
    });
  });

  describe('TableFooter', () => {
    it('should render table footer', () => {
      render(
        <Table>
          <TableFooter data-testid="table-footer">
            <TableRow>
              <TableCell>Footer content</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
      expect(screen.getByTestId('table-footer')).toBeInTheDocument();
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Table>
          <TableFooter className="custom-footer" data-testid="table-footer">
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
      const footer = screen.getByTestId('table-footer');
      expect(footer).toHaveClass('custom-footer');
    });
  });

  describe('TableRow', () => {
    it('should render table row', () => {
      render(
        <Table>
          <TableBody>
            <TableRow data-testid="table-row">
              <TableCell>Row content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByTestId('table-row')).toBeInTheDocument();
      expect(screen.getByText('Row content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Table>
          <TableBody>
            <TableRow className="custom-row" data-testid="table-row">
              <TableCell>Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const row = screen.getByTestId('table-row');
      expect(row).toHaveClass('custom-row');
    });
  });

  describe('TableHead', () => {
    it('should render table head cell', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead data-testid="table-head">Column Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      expect(screen.getByTestId('table-head')).toBeInTheDocument();
      expect(screen.getByText('Column Header')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="custom-head" data-testid="table-head">
                Header
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      const head = screen.getByTestId('table-head');
      expect(head).toHaveClass('custom-head');
    });
  });

  describe('TableCell', () => {
    it('should render table cell', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell data-testid="table-cell">Cell content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByTestId('table-cell')).toBeInTheDocument();
      expect(screen.getByText('Cell content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="custom-cell" data-testid="table-cell">
                Content
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const cell = screen.getByTestId('table-cell');
      expect(cell).toHaveClass('custom-cell');
    });
  });

  describe('TableCaption', () => {
    it('should render table caption', () => {
      render(
        <Table>
          <TableCaption data-testid="table-caption">
            Table description
          </TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByTestId('table-caption')).toBeInTheDocument();
      expect(screen.getByText('Table description')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Table>
          <TableCaption className="custom-caption" data-testid="table-caption">
            Caption
          </TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Content</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const caption = screen.getByTestId('table-caption');
      expect(caption).toHaveClass('custom-caption');
    });
  });

  describe('Complete Table Structure', () => {
    it('should render complete table with all components', () => {
      render(
        <Table data-testid="complete-table">
          <TableCaption>User Information Table</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
              <TableCell>Admin</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane Smith</TableCell>
              <TableCell>jane@example.com</TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total: 2 users</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      expect(screen.getByTestId('complete-table')).toBeInTheDocument();
      expect(screen.getByText('User Information Table')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByText('Total: 2 users')).toBeInTheDocument();
    });
  });
});
