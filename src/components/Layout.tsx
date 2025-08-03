import React from 'react';
import Header from './Header';
import { MoviesProvider } from '@/contexts/MoviesContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <MoviesProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main>{children}</main>
      </div>
    </MoviesProvider>
  );
}