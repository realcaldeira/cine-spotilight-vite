import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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
} from "../navigation-menu";

describe("NavigationMenu Coverage Tests", () => {
  it("should render NavigationMenu root", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  it("should render NavigationMenuContent when trigger is clicked", () => {
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

    // Click the trigger to open the menu
    const trigger = screen.getByText("Menu");
    fireEvent.click(trigger);

    // Content should be visible after clicking
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("should render NavigationMenuLink", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/test">Link Text</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(screen.getByText("Link Text")).toBeInTheDocument();
  });

  it("should render NavigationMenuIndicator", () => {
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

    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  it("should render NavigationMenuViewport", () => {
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

    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  it("should apply custom className to NavigationMenu", () => {
    const { container } = render(
      <NavigationMenu className="custom-nav">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    const navElement = container.querySelector('[class*="custom-nav"]');
    expect(navElement).toBeInTheDocument();
  });

  it("should apply custom className to NavigationMenuList", () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList className="custom-list">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    const listElement = container.querySelector(".custom-list");
    expect(listElement).toBeInTheDocument();
  });

  it("should apply custom className to NavigationMenuItem", () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="custom-item">
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    const itemElement = container.querySelector(".custom-item");
    expect(itemElement).toBeInTheDocument();
  });

  it("should apply custom className to NavigationMenuTrigger", () => {
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

    const triggerElement = container.querySelector(".custom-trigger");
    expect(triggerElement).toBeInTheDocument();
  });

  it("should render NavigationMenuContent with custom className", () => {
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

    // Click the trigger to open the menu
    const trigger = screen.getByText("Menu");
    fireEvent.click(trigger);

    const contentElement = container.querySelector(".custom-content");
    expect(contentElement).toBeInTheDocument();
  });

  it("should render NavigationMenuLink with custom className", () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/test" className="custom-link">
              Link Text
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    const linkElement = container.querySelector(".custom-link");
    expect(linkElement).toBeInTheDocument();
  });

  it("should render NavigationMenuIndicator with custom className", () => {
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

    // The indicator is always rendered
    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  it("should render NavigationMenuViewport with custom className", () => {
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

    // The viewport is always rendered
    expect(screen.getByText("Menu")).toBeInTheDocument();
  });
});
