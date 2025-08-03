import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../Layout';

// Mock do Header para simplificar o teste
jest.mock('../Header', () => {
  return function MockHeader() {
    return <header data-testid="mock-header">Mock Header</header>;
  };
});

// Mock do MoviesProvider para evitar problemas de contexto
jest.mock('../../contexts/MoviesContext', () => ({
  MoviesProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="movies-provider">{children}</div>
  ),
}));

describe('Layout Component', () => {
  it('should render layout with header and children', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div data-testid="test-content">Test Content</div>
        </Layout>
      </BrowserRouter>
    );

    const header = screen.getByTestId('mock-header');
    const content = screen.getByTestId('test-content');

    expect(header).toBeTruthy();
    expect(content).toBeTruthy();
  });

  it('should wrap content in MoviesProvider', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </BrowserRouter>
    );

    const moviesProvider = screen.getByTestId('movies-provider');
    expect(moviesProvider).toBeTruthy();
  });

  it('should have proper CSS structure', () => {
    const { container } = render(
      <BrowserRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </BrowserRouter>
    );

    const mainDiv = container.querySelector('.min-h-screen.bg-background');
    expect(mainDiv).toBeTruthy();
  });

  it('should render main element', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div data-testid="main-content">Main Content</div>
        </Layout>
      </BrowserRouter>
    );

    const mainElement = document.querySelector('main');
    expect(mainElement).toBeTruthy();

    const mainContent = screen.getByTestId('main-content');
    expect(mainContent).toBeTruthy();
  });

  it('should render children prop correctly', () => {
    const TestComponent = () => (
      <span data-testid="test-component">Test Component</span>
    );

    render(
      <BrowserRouter>
        <Layout>
          <TestComponent />
        </Layout>
      </BrowserRouter>
    );

    const testComponent = screen.getByTestId('test-component');
    expect(testComponent).toBeTruthy();
  });

  it('should handle multiple children', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </Layout>
      </BrowserRouter>
    );

    const child1 = screen.getByTestId('child-1');
    const child2 = screen.getByTestId('child-2');
    const child3 = screen.getByTestId('child-3');

    expect(child1).toBeTruthy();
    expect(child2).toBeTruthy();
    expect(child3).toBeTruthy();
  });

  it('should render without crashing when no children provided', () => {
    expect(() => {
      render(
        <BrowserRouter>
          <Layout>{null}</Layout>
        </BrowserRouter>
      );
    }).not.toThrow();
  });

  it('should have correct HTML structure', () => {
    const { container } = render(
      <BrowserRouter>
        <Layout>
          <div>Content</div>
        </Layout>
      </BrowserRouter>
    );

    // Should have MoviesProvider > div > header + main structure
    const moviesProvider = container.querySelector(
      '[data-testid="movies-provider"]'
    );
    const mainDiv = moviesProvider?.querySelector('.min-h-screen');
    const header = mainDiv?.querySelector('[data-testid="mock-header"]');
    const main = mainDiv?.querySelector('main');

    expect(moviesProvider).toBeTruthy();
    expect(mainDiv).toBeTruthy();
    expect(header).toBeTruthy();
    expect(main).toBeTruthy();
  });

  it('should accept TypeScript children prop correctly', () => {
    // This test ensures TypeScript interface is working correctly
    const children: React.ReactNode = <div>TypeScript Content</div>;

    expect(() => {
      render(
        <BrowserRouter>
          <Layout>{children}</Layout>
        </BrowserRouter>
      );
    }).not.toThrow();
  });

  it('should render string children', () => {
    render(
      <BrowserRouter>
        <Layout>Just a string content</Layout>
      </BrowserRouter>
    );

    const content = screen.getByText('Just a string content');
    expect(content).toBeTruthy();
  });
});
