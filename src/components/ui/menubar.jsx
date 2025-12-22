import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const MenubarMenu = MenubarPrimitive.Menu;
const MenubarGroup = MenubarPrimitive.Group;
const MenubarPortal = MenubarPrimitive.Portal;
const MenubarSub = MenubarPrimitive.Sub;
const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

const Root = styled(MenubarPrimitive.Root)`
  display: flex;
  height: 2.5rem;
  align-items: center;
  gap: 0.25rem;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
  padding: 0.25rem;
`;

const TriggerRoot = styled(MenubarPrimitive.Trigger)`
  display: flex;
  cursor: default;
  user-select: none;
  align-items: center;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;

  &[data-state="open"],
  &:focus {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
`;

const SubTriggerRoot = styled(MenubarPrimitive.SubTrigger)`
  display: flex;
  cursor: default;
  user-select: none;
  align-items: center;
  border-radius: 0.25rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  outline: none;

  &[data-state="open"],
  &:focus {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
`;

const SubChevron = styled(ChevronRight)`
  margin-left: auto;
  width: 1rem;
  height: 1rem;
`;

const SubContentRoot = styled(MenubarPrimitive.SubContent)`
  z-index: 50;
  min-width: 8rem;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  padding: 0.25rem;
  color: hsl(var(--popover-foreground));
`;

const ContentRoot = styled(MenubarPrimitive.Content)`
  z-index: 50;
  min-width: 12rem;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  padding: 0.25rem;
  color: hsl(var(--popover-foreground));
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.5);
`;

const ItemRoot = styled(MenubarPrimitive.Item)`
  position: relative;
  display: flex;
  cursor: default;
  user-select: none;
  align-items: center;
  border-radius: 0.25rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  outline: none;

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  &:focus {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
`;

const CheckboxItemRoot = styled(MenubarPrimitive.CheckboxItem)`
  position: relative;
  display: flex;
  cursor: default;
  user-select: none;
  align-items: center;
  border-radius: 0.25rem;
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  padding-left: 2rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  outline: none;

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  &:focus {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
`;

const RadioItemRoot = styled(MenubarPrimitive.RadioItem)`
  position: relative;
  display: flex;
  cursor: default;
  user-select: none;
  align-items: center;
  border-radius: 0.25rem;
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  padding-left: 2rem;
  padding-right: 0.5rem;
  font-size: 0.875rem;
  outline: none;

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  &:focus {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
`;

const IndicatorWrapper = styled.span`
  position: absolute;
  left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.875rem;
  height: 0.875rem;
`;

const IndicatorCheck = styled(Check)`
  width: 1rem;
  height: 1rem;
`;

const IndicatorCircle = styled(Circle)`
  width: 0.5rem;
  height: 0.5rem;
  fill: currentColor;
`;

const LabelRoot = styled(MenubarPrimitive.Label)`
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
`;

const SeparatorRoot = styled(MenubarPrimitive.Separator)`
  margin: 0.25rem -0.25rem;
  height: 1px;
  background-color: hsl(var(--muted));
`;

const Shortcut = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: hsl(var(--muted-foreground));
`;

const Menubar = React.forwardRef(function Menubar({ className, ...props }, ref) {
  return <Root ref={ref} className={cn("", className)} {...props} />;
});

const MenubarTrigger = React.forwardRef(function MenubarTrigger({ className, ...props }, ref) {
  return <TriggerRoot ref={ref} className={cn("", className)} {...props} />;
});

const MenubarSubTrigger = React.forwardRef(function MenubarSubTrigger(
  { className, inset, children, ...props },
  ref,
) {
  return (
    <SubTriggerRoot
      ref={ref}
      className={cn(inset ? "pl-8" : "", className)}
      {...props}
    >
      {children}
      <SubChevron />
    </SubTriggerRoot>
  );
});

const MenubarSubContent = React.forwardRef(function MenubarSubContent(
  { className, ...props },
  ref,
) {
  return <SubContentRoot ref={ref} className={cn("", className)} {...props} />;
});

const MenubarContent = React.forwardRef(function MenubarContent(
  { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
  ref,
) {
  return (
    <MenubarPrimitive.Portal>
      <ContentRoot
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn("", className)}
        {...props}
      />
    </MenubarPrimitive.Portal>
  );
});

const MenubarItem = React.forwardRef(function MenubarItem(
  { className, inset, ...props },
  ref,
) {
  return (
    <ItemRoot
      ref={ref}
      className={cn(inset ? "pl-8" : "", className)}
      {...props}
    />
  );
});

const MenubarCheckboxItem = React.forwardRef(function MenubarCheckboxItem(
  { className, children, checked, ...props },
  ref,
) {
  return (
    <CheckboxItemRoot ref={ref} className={cn("", className)} checked={checked} {...props}>
      <IndicatorWrapper>
        <MenubarPrimitive.ItemIndicator>
          <IndicatorCheck />
        </MenubarPrimitive.ItemIndicator>
      </IndicatorWrapper>
      {children}
    </CheckboxItemRoot>
  );
});

const MenubarRadioItem = React.forwardRef(function MenubarRadioItem(
  { className, children, ...props },
  ref,
) {
  return (
    <RadioItemRoot ref={ref} className={cn("", className)} {...props}>
      <IndicatorWrapper>
        <MenubarPrimitive.ItemIndicator>
          <IndicatorCircle />
        </MenubarPrimitive.ItemIndicator>
      </IndicatorWrapper>
      {children}
    </RadioItemRoot>
  );
});

const MenubarLabel = React.forwardRef(function MenubarLabel(
  { className, inset, ...props },
  ref,
) {
  return (
    <LabelRoot
      ref={ref}
      className={cn(inset ? "pl-8" : "", className)}
      {...props}
    />
  );
});

const MenubarSeparator = React.forwardRef(function MenubarSeparator(
  { className, ...props },
  ref,
) {
  return <SeparatorRoot ref={ref} className={cn("", className)} {...props} />;
});

const MenubarShortcut = ({ className, ...props }) => {
  return <Shortcut className={cn("", className)} {...props} />;
};

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};

