import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const Root = styled(NavigationMenuPrimitive.Root)`
  position: relative;
  z-index: 10;
  display: flex;
  max-width: max-content;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ListRoot = styled(NavigationMenuPrimitive.List)`
  display: flex;
  flex: 1;
  list-style: none;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
`;

const TriggerRoot = styled(NavigationMenuPrimitive.Trigger)`
  display: inline-flex;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  background-color: hsl(var(--background));
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;
  transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;

  &:hover,
  &:focus {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  &[data-active],
  &[data-state="open"] {
    background-color: hsl(var(--accent) / 0.5);
  }
`;

const TriggerChevron = styled(ChevronDown)`
  position: relative;
  top: 1px;
  margin-left: 0.25rem;
  width: 0.75rem;
  height: 0.75rem;
  transition: transform 0.2s ease;

  [data-state="open"] & {
    transform: rotate(180deg);
  }
`;

const ContentRoot = styled(NavigationMenuPrimitive.Content)`
  left: 0;
  top: 0;
  width: 100%;

  @media (min-width: 768px) {
    position: absolute;
    width: auto;
  }
`;

const ViewportWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  display: flex;
  justify-content: center;
`;

const ViewportRoot = styled(NavigationMenuPrimitive.Viewport)`
  position: relative;
  margin-top: 0.375rem;
  height: var(--radix-navigation-menu-viewport-height);
  width: 100%;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.5);

  @media (min-width: 768px) {
    width: var(--radix-navigation-menu-viewport-width);
  }
`;

const IndicatorRoot = styled(NavigationMenuPrimitive.Indicator)`
  top: 100%;
  z-index: 1;
  display: flex;
  height: 0.375rem;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
`;

const IndicatorDiamond = styled.div`
  position: relative;
  top: 60%;
  width: 0.5rem;
  height: 0.5rem;
  transform: rotate(45deg);
  border-radius: 0.125rem 0 0 0;
  background-color: hsl(var(--border));
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.5);
`;

const NavigationMenu = React.forwardRef(function NavigationMenu(
  { className, children, ...props },
  ref,
) {
  return (
    <Root ref={ref} className={cn("", className)} {...props}>
      {children}
      <NavigationMenuViewport />
    </Root>
  );
});

const NavigationMenuList = React.forwardRef(function NavigationMenuList(
  { className, ...props },
  ref,
) {
  return <ListRoot ref={ref} className={cn("", className)} {...props} />;
});

const NavigationMenuItem = NavigationMenuPrimitive.Item;
const NavigationMenuLink = NavigationMenuPrimitive.Link;

// Keep this exported for compatibility, but it now just returns an empty string.
const navigationMenuTriggerStyle = () => "";

const NavigationMenuTrigger = React.forwardRef(function NavigationMenuTrigger(
  { className, children, ...props },
  ref,
) {
  return (
    <TriggerRoot ref={ref} className={cn("", className)} {...props}>
      {children}
      <TriggerChevron aria-hidden="true" />
    </TriggerRoot>
  );
});

const NavigationMenuContent = React.forwardRef(function NavigationMenuContent(
  { className, ...props },
  ref,
) {
  return <ContentRoot ref={ref} className={cn("", className)} {...props} />;
});

const NavigationMenuViewport = React.forwardRef(function NavigationMenuViewport(
  { className, ...props },
  ref,
) {
  return (
    <ViewportWrapper>
      <ViewportRoot ref={ref} className={cn("", className)} {...props} />
    </ViewportWrapper>
  );
});

const NavigationMenuIndicator = React.forwardRef(function NavigationMenuIndicator(
  { className, ...props },
  ref,
) {
  return (
    <IndicatorRoot ref={ref} className={cn("", className)} {...props}>
      <IndicatorDiamond />
    </IndicatorRoot>
  );
});

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
