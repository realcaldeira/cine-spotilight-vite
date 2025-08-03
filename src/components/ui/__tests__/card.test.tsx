import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '../card';

describe('Card', () => {
  it('should render card with basic content', () => {
    render(
      <Card>
        <CardContent>Basic card content</CardContent>
      </Card>
    );

    const content = screen.getByText('Basic card content');
    expect(content).toBeInTheDocument();
  });

  it('should render card with header and title', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
      </Card>
    );

    const title = screen.getByText('Card Title');
    expect(title).toBeInTheDocument();
  });

  it('should render card with description', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>This is a card description</CardDescription>
        </CardHeader>
      </Card>
    );

    const description = screen.getByText('This is a card description');
    expect(description).toBeInTheDocument();
  });

  it('should render card with footer', () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
        <CardFooter>Footer content</CardFooter>
      </Card>
    );

    const footer = screen.getByText('Footer content');
    expect(footer).toBeInTheDocument();
  });

  it('should render complete card structure', () => {
    render(
      <Card className="custom-card">
        <CardHeader>
          <CardTitle>Complete Card</CardTitle>
          <CardDescription>Full card example</CardDescription>
        </CardHeader>
        <CardContent>Main content area</CardContent>
        <CardFooter>Footer area</CardFooter>
      </Card>
    );

    expect(screen.getByText('Complete Card')).toBeInTheDocument();
    expect(screen.getByText('Full card example')).toBeInTheDocument();
    expect(screen.getByText('Main content area')).toBeInTheDocument();
    expect(screen.getByText('Footer area')).toBeInTheDocument();
  });

  it('should apply custom className to card', () => {
    render(
      <Card className="custom-class">
        <CardContent>Content</CardContent>
      </Card>
    );

    const card = screen.getByText('Content').closest('div');
    expect(card?.parentElement).toHaveClass('custom-class');
  });

  it('should have proper styling classes', () => {
    render(
      <Card data-testid="card">
        <CardContent>Content</CardContent>
      </Card>
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('bg-card');
    expect(card).toHaveClass('text-card-foreground');
    expect(card).toHaveClass('shadow-sm');
  });

  it('should render header with proper spacing', () => {
    render(
      <Card>
        <CardHeader data-testid="header">
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    );

    const header = screen.getByTestId('header');
    expect(header).toHaveClass('flex');
    expect(header).toHaveClass('flex-col');
    expect(header).toHaveClass('space-y-1.5');
    expect(header).toHaveClass('p-6');
  });

  it('should render content with proper padding', () => {
    render(
      <Card>
        <CardContent data-testid="content">Content</CardContent>
      </Card>
    );

    const content = screen.getByTestId('content');
    expect(content).toHaveClass('p-6');
    expect(content).toHaveClass('pt-0');
  });

  it('should render footer with proper styling', () => {
    render(
      <Card>
        <CardFooter data-testid="footer">Footer</CardFooter>
      </Card>
    );

    const footer = screen.getByTestId('footer');
    expect(footer).toHaveClass('flex');
    expect(footer).toHaveClass('items-center');
    expect(footer).toHaveClass('p-6');
    expect(footer).toHaveClass('pt-0');
  });
});
