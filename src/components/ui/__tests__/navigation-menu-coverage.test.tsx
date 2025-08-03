import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '../navigation-menu';

describe('NavigationMenu Coverage Tests', () => {
  it('should render NavigationMenu root', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('should render NavigationMenuContent', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div>Content</div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should render NavigationMenuLink', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/test">
              Link Text
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    
    expect(screen.getByText('Link Text')).toBeInTheDocument();
  });

  it('should render NavigationMenuIndicator', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
            <NavigationMenuIndicator />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('should render NavigationMenuViewport', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
      </NavigationMenu>
    );
    
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('should apply custom className to NavigationMenu', () => {
    const { container } = render(
      <NavigationMenu className="custom-nav">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    
    expect(container.firstChild).toHaveClass('custom-nav');
  });

  it('should apply custom className to NavigationMenuList', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList className="custom-list">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    
    expect(container.querySelector('.custom-list')).toBeInTheDocument();
  });

  it('should apply custom className to NavigationMenuItem', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="custom-item">
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    
    expect(container.querySelector('.custom-item')).toBeInTheDocument();
  });

  it('should apply navigationMenuTriggerStyle', () => {
    const triggerClass = navigationMenuTriggerStyle();
    expect(typeof triggerClass).toBe('string');
    expect(triggerClass.length).toBeGreaterThan(0);
  });

  it('should apply navigationMenuTriggerStyle with custom className', () => {
    const triggerClass = navigationMenuTriggerStyle({ className: 'custom' });
    expect(typeof triggerClass).toBe('string');
    expect(triggerClass).toContain('custom');
  });

  it('should render NavigationMenuContent with custom className', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
            <NavigationMenuContent className="custom-content">
              <div>Content</div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    
    expect(container.querySelector('.custom-content')).toBeInTheDocument();
  });

  it('should render NavigationMenuTrigger with custom className', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="custom-trigger">
              Menu
            </NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    
    expect(container.querySelector('.custom-trigger')).toBeInTheDocument();
  });

  it('should render NavigationMenuLink with custom className', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink className="custom-link" href="/test">
              Link Text
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    
    expect(container.querySelector('.custom-link')).toBeInTheDocument();
  });

  it('should render NavigationMenuIndicator with custom className', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
            <NavigationMenuIndicator className="custom-indicator" />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    
    expect(container.querySelector('.custom-indicator')).toBeInTheDocument();
  });

  it('should render NavigationMenuViewport with custom className', () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport className="custom-viewport" />
      </NavigationMenu>
    );
    
    expect(container.querySelector('.custom-viewport')).toBeInTheDocument();
  });
});
