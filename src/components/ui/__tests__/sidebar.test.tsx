import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '../sidebar';

describe('Sidebar Components', () => {
  describe('SidebarProvider', () => {
    test('renders sidebar provider with children', () => {
      render(
        <SidebarProvider>
          <div data-testid="sidebar-child">Child content</div>
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-child')).toBeInTheDocument();
    });
  });

  describe('Sidebar', () => {
    test('renders sidebar with default props', () => {
      render(
        <SidebarProvider>
          <Sidebar data-testid="sidebar">
            <SidebarContent>Content</SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    test('renders with different sides', () => {
      render(
        <SidebarProvider>
          <Sidebar side="right" data-testid="sidebar-right">
            Content
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-right')).toBeInTheDocument();
    });

    test('renders with different variants', () => {
      render(
        <SidebarProvider>
          <Sidebar variant="floating" data-testid="sidebar-floating">
            Content
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-floating')).toBeInTheDocument();
    });
  });

  describe('SidebarTrigger', () => {
    test('renders trigger button', () => {
      render(
        <SidebarProvider>
          <SidebarTrigger data-testid="sidebar-trigger" />
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-trigger')).toBeInTheDocument();
    });
  });

  describe('SidebarInset', () => {
    test('renders inset container', () => {
      render(
        <SidebarProvider>
          <SidebarInset data-testid="sidebar-inset">
            <div>Inset content</div>
          </SidebarInset>
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-inset')).toBeInTheDocument();
      expect(screen.getByText('Inset content')).toBeInTheDocument();
    });
  });

  describe('SidebarInput', () => {
    test('renders input field', () => {
      render(
        <SidebarProvider>
          <SidebarInput placeholder="Search..." data-testid="sidebar-input" />
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-input')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });
  });

  describe('SidebarHeader', () => {
    test('renders header section', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader data-testid="sidebar-header">
              <h2>Header Title</h2>
            </SidebarHeader>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-header')).toBeInTheDocument();
      expect(screen.getByText('Header Title')).toBeInTheDocument();
    });
  });

  describe('SidebarContent', () => {
    test('renders content section', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent data-testid="sidebar-content">
              <div>Main content</div>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-content')).toBeInTheDocument();
      expect(screen.getByText('Main content')).toBeInTheDocument();
    });
  });

  describe('SidebarFooter', () => {
    test('renders footer section', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarFooter data-testid="sidebar-footer">
              <div>Footer content</div>
            </SidebarFooter>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-footer')).toBeInTheDocument();
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });
  });

  describe('SidebarGroup', () => {
    test('renders group container', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarGroup data-testid="sidebar-group">
                <SidebarGroupLabel>Group Label</SidebarGroupLabel>
                <SidebarGroupContent>Group content</SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-group')).toBeInTheDocument();
      expect(screen.getByText('Group Label')).toBeInTheDocument();
      expect(screen.getByText('Group content')).toBeInTheDocument();
    });
  });

  describe('SidebarMenu', () => {
    test('renders menu with items', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarMenu data-testid="sidebar-menu">
                <SidebarMenuItem>
                  <SidebarMenuButton>Menu Item</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-menu')).toBeInTheDocument();
      expect(screen.getByText('Menu Item')).toBeInTheDocument();
    });
  });

  describe('SidebarMenuButton', () => {
    test('renders as link when href provided', () => {
      render(
        <SidebarProvider>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild data-testid="menu-link">
                <a href="/dashboard">Dashboard</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarProvider>
      );

      const link = screen.getByTestId('menu-link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/dashboard');
    });

    test('renders as button when no href', () => {
      render(
        <SidebarProvider>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton data-testid="menu-button">
                Button
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarProvider>
      );

      expect(screen.getByTestId('menu-button')).toBeInTheDocument();
    });
  });

  describe('SidebarSeparator', () => {
    test('renders separator', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarSeparator data-testid="sidebar-separator" />
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-separator')).toBeInTheDocument();
    });
  });
});
