import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../dialog';

describe('Dialog Components', () => {
  describe('Dialog', () => {
    test('renders dialog with trigger and content', () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Open Dialog</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>Dialog description</DialogDescription>
            </DialogHeader>
            <p>Dialog content</p>
            <DialogFooter>
              <DialogClose asChild>
                <button>Close</button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Open Dialog')).toBeInTheDocument();
    });

    test('renders dialog content when open', () => {
      render(
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent data-testid="dialog-content">
            <DialogHeader>
              <DialogTitle>Test Title</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
  });

  describe('DialogTrigger', () => {
    test('renders trigger button', () => {
      render(
        <Dialog>
          <DialogTrigger data-testid="dialog-trigger">Open</DialogTrigger>
        </Dialog>
      );

      expect(screen.getByTestId('dialog-trigger')).toBeInTheDocument();
      expect(screen.getByText('Open')).toBeInTheDocument();
    });
  });

  describe('DialogContent', () => {
    test('renders content with custom className', () => {
      render(
        <Dialog open={true}>
          <DialogContent className="custom-content" data-testid="content">
            Content
          </DialogContent>
        </Dialog>
      );

      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('custom-content');
    });
  });

  describe('DialogHeader', () => {
    test('renders header section', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader data-testid="dialog-header">
              <DialogTitle>Header Title</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId('dialog-header')).toBeInTheDocument();
      expect(screen.getByText('Header Title')).toBeInTheDocument();
    });
  });

  describe('DialogTitle', () => {
    test('renders title', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogTitle data-testid="dialog-title">
              Test Dialog Title
            </DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId('dialog-title')).toBeInTheDocument();
      expect(screen.getByText('Test Dialog Title')).toBeInTheDocument();
    });
  });

  describe('DialogDescription', () => {
    test('renders description', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogDescription data-testid="dialog-description">
              This is a dialog description
            </DialogDescription>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId('dialog-description')).toBeInTheDocument();
      expect(
        screen.getByText('This is a dialog description')
      ).toBeInTheDocument();
    });
  });

  describe('DialogFooter', () => {
    test('renders footer section', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogFooter data-testid="dialog-footer">
              <button>Cancel</button>
              <button>OK</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId('dialog-footer')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('OK')).toBeInTheDocument();
    });
  });

  describe('DialogClose', () => {
    test('renders close button', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogClose data-testid="dialog-close">Close Dialog</DialogClose>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId('dialog-close')).toBeInTheDocument();
      expect(screen.getByText('Close Dialog')).toBeInTheDocument();
    });
  });
});
