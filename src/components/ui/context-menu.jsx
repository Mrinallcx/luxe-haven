import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuPortal = ContextMenuPrimitive.Portal;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

const SubTrigger = styled(ContextMenuPrimitive.SubTrigger)`
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

const SubTriggerChevron = styled(ChevronRight)`
  margin-left: auto;
  width: 1rem;
  height: 1rem;
`;

const SubContent = styled(ContextMenuPrimitive.SubContent)`
  z-index: 50;
  min-width: 8rem;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  padding: 0.25rem;
  color: hsl(var(--popover-foreground));
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.5);
`;

const ContentRoot = styled(ContextMenuPrimitive.Content)`
  z-index: 50;
  min-width: 8rem;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  padding: 0.25rem;
  color: hsl(var(--popover-foreground));
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.5);
`;

const ItemRoot = styled(ContextMenuPrimitive.Item)`
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

const CheckboxItemRoot = styled(ContextMenuPrimitive.CheckboxItem)`
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

const RadioItemRoot = styled(ContextMenuPrimitive.RadioItem)`
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

const LabelRoot = styled(ContextMenuPrimitive.Label)`
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: hsl(var(--foreground));
`;

const SeparatorRoot = styled(ContextMenuPrimitive.Separator)`
  margin: 0.25rem -0.25rem;
  height: 1px;
  background-color: hsl(var(--border));
`;

const Shortcut = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: hsl(var(--muted-foreground));
`;

const ContextMenuSubTrigger = React.forwardRef(function ContextMenuSubTrigger(
  { className, inset, children, ...props },
  ref,
) {
  return (
    <SubTrigger
      ref={ref}
      className={cn(inset ? "pl-8" : "", className)}
      {...props}
    >
      {children}
      <SubTriggerChevron />
    </SubTrigger>
  );
});

const ContextMenuSubContent = React.forwardRef(function ContextMenuSubContent(
  { className, ...props },
  ref,
) {
  return <SubContent ref={ref} className={cn("", className)} {...props} />;
});

const ContextMenuContent = React.forwardRef(function ContextMenuContent(
  { className, ...props },
  ref,
) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContentRoot ref={ref} className={cn("", className)} {...props} />
    </ContextMenuPrimitive.Portal>
  );
});

const ContextMenuItem = React.forwardRef(function ContextMenuItem(
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

const ContextMenuCheckboxItem = React.forwardRef(function ContextMenuCheckboxItem(
  { className, children, checked, ...props },
  ref,
) {
  return (
    <CheckboxItemRoot ref={ref} className={cn("", className)} checked={checked} {...props}>
      <IndicatorWrapper>
        <ContextMenuPrimitive.ItemIndicator>
          <IndicatorCheck />
        </ContextMenuPrimitive.ItemIndicator>
      </IndicatorWrapper>
      {children}
    </CheckboxItemRoot>
  );
});

const ContextMenuRadioItem = React.forwardRef(function ContextMenuRadioItem(
  { className, children, ...props },
  ref,
) {
  return (
    <RadioItemRoot ref={ref} className={cn("", className)} {...props}>
      <IndicatorWrapper>
        <ContextMenuPrimitive.ItemIndicator>
          <IndicatorCircle />
        </ContextMenuPrimitive.ItemIndicator>
      </IndicatorWrapper>
      {children}
    </RadioItemRoot>
  );
});

const ContextMenuLabel = React.forwardRef(function ContextMenuLabel(
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

const ContextMenuSeparator = React.forwardRef(function ContextMenuSeparator(
  { className, ...props },
  ref,
) {
  return <SeparatorRoot ref={ref} className={cn("", className)} {...props} />;
});

const ContextMenuShortcut = ({ className, ...props }) => {
  return <Shortcut className={cn("", className)} {...props} />;
};

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
