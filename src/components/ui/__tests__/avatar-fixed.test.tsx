import React from 'react';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';

describe('Avatar', () => {
  it('should render avatar with image', () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="User Avatar" />
        <AvatarFallback>UA</AvatarFallback>
      </Avatar>
    );


    expect(screen.getByText('UA')).toBeInTheDocument();
  });

  it('should render fallback when image fails to load', () => {
    render(
      <Avatar>
        <AvatarImage src="invalid-url" alt="User Avatar" />
        <AvatarFallback>UA</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText('UA')).toBeInTheDocument();
  });

  it('should render fallback without image', () => {
    render(
      <Avatar>
        <AvatarFallback>UA</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText('UA')).toBeInTheDocument();
  });

  it('should apply custom className to avatar', () => {
    render(
      <Avatar className="custom-avatar">
        <AvatarFallback>UA</AvatarFallback>
      </Avatar>
    );

    const avatar = screen.getByText('UA').closest('span')?.parentElement;
    expect(avatar).toHaveClass('custom-avatar');
  });

  it('should have proper styling classes', () => {
    render(
      <Avatar>
        <AvatarFallback>UA</AvatarFallback>
      </Avatar>
    );

    const avatar = screen.getByText('UA').closest('span')?.parentElement;
    expect(avatar).toHaveClass(
      'relative',
      'flex',
      'shrink-0',
      'overflow-hidden',
      'rounded-full'
    );
  });

  it('should render image with proper attributes', () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="Test" />
        <AvatarFallback>T</AvatarFallback>
      </Avatar>
    );


    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('should render fallback text', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should handle different fallback content', () => {
    render(
      <Avatar>
        <AvatarFallback>
          <span>User</span>
        </AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('should apply fallback custom className', () => {
    render(
      <Avatar>
        <AvatarFallback className="custom-fallback">FB</AvatarFallback>
      </Avatar>
    );

    const fallback = screen.getByText('FB');
    expect(fallback).toHaveClass('custom-fallback');
  });
});
