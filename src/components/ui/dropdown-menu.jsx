import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import styled, { css } from "styled-components";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const baseItemStyles = css`
  position: relative;
  display: flex;
  cursor: default;
  user-select: none;
  align-items: center;
  border-radius: 0.25rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  &:focus {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
`;

const SubTriggerRoot = styled(DropdownMenuPrimitive.SubTrigger)`
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

  ${({ $inset }) => $inset && `padding-left: 2rem;`}
`;

const SubChevron = styled(ChevronRight)`
  margin-left: auto;
  width: 1rem;
  height: 1rem;
`;

const SubContentRoot = styled(DropdownMenuPrimitive.SubContent)`
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

const ContentRoot = styled(DropdownMenuPrimitive.Content)`
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

const ItemRoot = styled(DropdownMenuPrimitive.Item)`
  ${baseItemStyles};

  border-radius: 0.5rem;

  ${({ $inset }) => $inset && `padding-left: 2rem;`}
`;

const CheckboxItemRoot = styled(DropdownMenuPrimitive.CheckboxItem)`
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
  transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;

  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  &:focus {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
`;

const RadioItemRoot = styled(DropdownMenuPrimitive.RadioItem)`
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
  transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;

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

const LabelRoot = styled(DropdownMenuPrimitive.Label)`
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;

  ${({ $inset }) => $inset && `padding-left: 2rem;`}
`;

const SeparatorRoot = styled(DropdownMenuPrimitive.Separator)`
  margin: 0.25rem -0.25rem;
  height: 1px;
  background-color: hsl(var(--muted));
`;

const Shortcut = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  opacity: 0.6;
`;

const DropdownMenuSubTrigger = React.forwardRef(function DropdownMenuSubTrigger(
  { className, inset, children, ...props },
  ref,
) {
  return (
    <SubTriggerRoot
      ref={ref}
      $inset={!!inset}
      className={className}
      {...props}
    >
      {children}
      <SubChevron />
    </SubTriggerRoot>
  );
});

const DropdownMenuSubContent = React.forwardRef(function DropdownMenuSubContent(
  { className, ...props },
  ref,
) {
  return <SubContentRoot ref={ref} className={className} {...props} />;
});

const DropdownMenuContent = React.forwardRef(function DropdownMenuContent(
  { className, sideOffset = 4, ...props },
  ref,
) {
  return (
    <DropdownMenuPrimitive.Portal>
      <ContentRoot
        ref={ref}
        sideOffset={sideOffset}
        className={className}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
});

const DropdownMenuItem = React.forwardRef(function DropdownMenuItem(
  { className, inset, ...props },
  ref,
) {
  return (
    <ItemRoot
      ref={ref}
      $inset={!!inset}
      className={className}
      {...props}
    />
  );
});

const DropdownMenuCheckboxItem = React.forwardRef(function DropdownMenuCheckboxItem(
  { className, children, checked, ...props },
  ref,
) {
  return (
    <CheckboxItemRoot ref={ref} className={className} checked={checked} {...props}>
      <IndicatorWrapper>
        <DropdownMenuPrimitive.ItemIndicator>
          <IndicatorCheck />
        </DropdownMenuPrimitive.ItemIndicator>
      </IndicatorWrapper>
      {children}
    </CheckboxItemRoot>
  );
});

const DropdownMenuRadioItem = React.forwardRef(function DropdownMenuRadioItem(
  { className, children, ...props },
  ref,
) {
  return (
    <RadioItemRoot ref={ref} className={className} {...props}>
      <IndicatorWrapper>
        <DropdownMenuPrimitive.ItemIndicator>
          <IndicatorCircle />
        </DropdownMenuPrimitive.ItemIndicator>
      </IndicatorWrapper>
      {children}
    </RadioItemRoot>
  );
});

const DropdownMenuLabel = React.forwardRef(function DropdownMenuLabel(
  { className, inset, ...props },
  ref,
) {
  return (
    <LabelRoot
      ref={ref}
      $inset={!!inset}
      className={className}
      {...props}
    />
  );
});

const DropdownMenuSeparator = React.forwardRef(function DropdownMenuSeparator(
  { className, ...props },
  ref,
) {
  return <SeparatorRoot ref={ref} className={className} {...props} />;
});

const DropdownMenuShortcut = ({ className, ...props }) => {
  return <Shortcut className={className} {...props} />;
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
