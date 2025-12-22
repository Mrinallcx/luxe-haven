import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const TriggerRoot = styled(SelectPrimitive.Trigger)`
  display: flex;
  height: 2.5rem;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--input));
  background-color: hsl(var(--background));
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  outline: none;

  &::placeholder {
    color: hsl(var(--muted-foreground));
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  & > span {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const TriggerIcon = styled(ChevronDown)`
  width: 1rem;
  height: 1rem;
  opacity: 0.5;
`;

const ScrollButtonRoot = styled.div`
  display: flex;
  cursor: default;
  align-items: center;
  justify-content: center;
  padding-block: 0.25rem;
`;

const ScrollIconUp = styled(ChevronUp)`
  width: 1rem;
  height: 1rem;
`;

const ScrollIconDown = styled(ChevronDown)`
  width: 1rem;
  height: 1rem;
`;

const ContentRoot = styled(SelectPrimitive.Content)`
  position: relative;
  z-index: 50;
  max-height: 24rem;
  min-width: 8rem;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.5);
`;

const ViewportRoot = styled(SelectPrimitive.Viewport)`
  padding: 0.25rem;

  &[data-position="popper"] {
    height: var(--radix-select-trigger-height);
    width: 100%;
    min-width: var(--radix-select-trigger-width);
  }
`;

const LabelRoot = styled(SelectPrimitive.Label)`
  padding: 0.375rem 0.5rem 0.375rem 2rem;
  font-size: 0.875rem;
  font-weight: 600;
`;

const ItemRoot = styled(SelectPrimitive.Item)`
  position: relative;
  display: flex;
  width: 100%;
  cursor: default;
  user-select: none;
  align-items: center;
  border-radius: 0.25rem;
  padding: 0.375rem 0.5rem 0.375rem 2rem;
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

const ItemIndicatorWrapper = styled.span`
  position: absolute;
  left: 0.5rem;
  display: flex;
  width: 0.875rem;
  height: 0.875rem;
  align-items: center;
  justify-content: center;
`;

const ItemIndicatorIcon = styled(Check)`
  width: 1rem;
  height: 1rem;
`;

const SeparatorRoot = styled(SelectPrimitive.Separator)`
  margin: 0.25rem -0.25rem;
  height: 1px;
  background-color: hsl(var(--muted));
`;

const SelectTrigger = React.forwardRef(function SelectTrigger(
  { className, children, ...props },
  ref,
) {
  return (
    <TriggerRoot ref={ref} className={cn("", className)} {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <TriggerIcon />
      </SelectPrimitive.Icon>
    </TriggerRoot>
  );
});

const SelectScrollUpButton = React.forwardRef(function SelectScrollUpButton(
  { className, ...props },
  ref,
) {
  return (
    <SelectPrimitive.ScrollUpButton asChild>
      <ScrollButtonRoot ref={ref} className={cn("", className)} {...props}>
        <ScrollIconUp />
      </ScrollButtonRoot>
    </SelectPrimitive.ScrollUpButton>
  );
});

const SelectScrollDownButton = React.forwardRef(function SelectScrollDownButton(
  { className, ...props },
  ref,
) {
  return (
    <SelectPrimitive.ScrollDownButton asChild>
      <ScrollButtonRoot ref={ref} className={cn("", className)} {...props}>
        <ScrollIconDown />
      </ScrollButtonRoot>
    </SelectPrimitive.ScrollDownButton>
  );
});

const SelectContent = React.forwardRef(function SelectContent(
  { className, children, position = "popper", ...props },
  ref,
) {
  return (
    <SelectPrimitive.Portal>
      <ContentRoot
        ref={ref}
        position={position}
        className={cn("", className)}
        {...props}
      >
        <SelectScrollUpButton />
        <ViewportRoot data-position={position} className={cn("")}>
          {children}
        </ViewportRoot>
        <SelectScrollDownButton />
      </ContentRoot>
    </SelectPrimitive.Portal>
  );
});

const SelectLabel = React.forwardRef(function SelectLabel(
  { className, ...props },
  ref,
) {
  return <LabelRoot ref={ref} className={cn("", className)} {...props} />;
});

const SelectItem = React.forwardRef(function SelectItem(
  { className, children, ...props },
  ref,
) {
  return (
    <ItemRoot ref={ref} className={cn("", className)} {...props}>
      <ItemIndicatorWrapper>
        <SelectPrimitive.ItemIndicator>
          <ItemIndicatorIcon />
        </SelectPrimitive.ItemIndicator>
      </ItemIndicatorWrapper>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </ItemRoot>
  );
});

const SelectSeparator = React.forwardRef(function SelectSeparator(
  { className, ...props },
  ref,
) {
  return <SeparatorRoot ref={ref} className={cn("", className)} {...props} />;
});

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
