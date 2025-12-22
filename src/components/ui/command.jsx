import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import styled from "styled-components";

import { cn } from "../../lib/utils";
import { Dialog, DialogContent } from "./dialog";

const StyledCommand = styled(CommandPrimitive)`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  overflow: hidden;
  border-radius: 0.375rem;
  background-color: hsl(var(--popover));
  color: hsl(var(--popover-foreground));
`;

const StyledDialogContent = styled(DialogContent)`
  overflow: hidden;
  padding: 0;
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.5);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid hsl(var(--border));
  padding: 0 0.75rem;
`;

const InputIcon = styled(Search)`
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  opacity: 0.5;
`;

const StyledInput = styled(CommandPrimitive.Input)`
  display: flex;
  height: 2.75rem;
  width: 100%;
  border-radius: 0.375rem;
  background-color: transparent;
  padding: 0.75rem 0;
  font-size: 0.875rem;
  outline: none;
  &::placeholder {
    color: hsl(var(--muted-foreground));
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledList = styled(CommandPrimitive.List)`
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const StyledEmpty = styled(CommandPrimitive.Empty)`
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
`;

const StyledGroup = styled(CommandPrimitive.Group)`
  overflow: hidden;
  padding: 0.25rem;
  color: hsl(var(--foreground));
  [cmdk-group-heading] {
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: hsl(var(--muted-foreground));
  }
`;

const StyledSeparator = styled(CommandPrimitive.Separator)`
  margin-left: -0.25rem;
  margin-right: -0.25rem;
  height: 1px;
  background-color: hsl(var(--border));
`;

const StyledItem = styled(CommandPrimitive.Item)`
  position: relative;
  display: flex;
  cursor: default;
  user-select: none;
  align-items: center;
  border-radius: 0.25rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  outline: none;

  &[data-disabled="true"] {
    pointer-events: none;
    opacity: 0.5;
  }

  &[data-selected="true"] {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
`;

const Shortcut = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: hsl(var(--muted-foreground));
`;

const Command = React.forwardRef(function Command({ className, ...props }, ref) {
  return <StyledCommand ref={ref} className={cn("", className)} {...props} />;
});

const CommandDialog = ({ children, ...props }) => {
  return (
    <Dialog {...props}>
      <StyledDialogContent>
        <Command>{children}</Command>
      </StyledDialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef(function CommandInput({ className, ...props }, ref) {
  return (
    <InputWrapper cmdk-input-wrapper="">
      <InputIcon />
      <StyledInput ref={ref} className={cn("", className)} {...props} />
    </InputWrapper>
  );
});

const CommandList = React.forwardRef(function CommandList({ className, ...props }, ref) {
  return <StyledList ref={ref} className={cn("", className)} {...props} />;
});

const CommandEmpty = React.forwardRef(function CommandEmpty(props, ref) {
  return <StyledEmpty ref={ref} {...props} />;
});

const CommandGroup = React.forwardRef(function CommandGroup({ className, ...props }, ref) {
  return <StyledGroup ref={ref} className={cn("", className)} {...props} />;
});

const CommandSeparator = React.forwardRef(function CommandSeparator({ className, ...props }, ref) {
  return <StyledSeparator ref={ref} className={cn("", className)} {...props} />;
});

const CommandItem = React.forwardRef(function CommandItem({ className, ...props }, ref) {
  return <StyledItem ref={ref} className={cn("", className)} {...props} />;
});

const CommandShortcut = ({ className, ...props }) => {
  return <Shortcut className={cn("", className)} {...props} />;
};

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};

