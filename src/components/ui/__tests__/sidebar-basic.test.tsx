import React from 'react';
import { render } from '@testing-library/react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
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
} from '../sidebar';

describe('Sidebar Basic Tests', () => {
  it('should render SidebarProvider', () => {
    const { container } = render(
      <SidebarProvider>
        <div>Content</div>
      </SidebarProvider>
    );
    expect(container.textContent).toContain('Content');
  });

  it('should render Sidebar', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar />
      </SidebarProvider>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render SidebarContent', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent />
        </Sidebar>
      </SidebarProvider>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render SidebarHeader', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>Header</SidebarHeader>
        </Sidebar>
      </SidebarProvider>
    );
    expect(container.textContent).toContain('Header');
  });

  it('should render SidebarFooter', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarFooter>Footer</SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    );
    expect(container.textContent).toContain('Footer');
  });

  it('should render SidebarGroup', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup />
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render SidebarGroupLabel', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Label</SidebarGroupLabel>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(container.textContent).toContain('Label');
  });

  it('should render SidebarGroupContent', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>Content</SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(container.textContent).toContain('Content');
  });

  it('should render SidebarMenu components', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Button</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(container.textContent).toContain('Button');
  });

  it('should render SidebarMenuSub components', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Sub Button</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(container.textContent).toContain('Sub Button');
  });

  it('should render SidebarInput', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SidebarInput placeholder="Search" />
          </SidebarHeader>
        </Sidebar>
      </SidebarProvider>
    );
    const input = container.querySelector('input');
    expect(input).toBeTruthy();
  });

  it('should render SidebarTrigger', () => {
    const { container } = render(
      <SidebarProvider>
        <SidebarTrigger />
      </SidebarProvider>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render SidebarInset', () => {
    const { container } = render(
      <SidebarProvider>
        <SidebarInset>Inset Content</SidebarInset>
      </SidebarProvider>
    );
    expect(container.textContent).toContain('Inset Content');
  });

  it('should render SidebarRail', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarRail />
        </Sidebar>
      </SidebarProvider>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render SidebarSeparator', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarSeparator />
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render SidebarMenuSkeleton', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuSkeleton />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );
    expect(container.firstChild).toBeTruthy();
  });
});
