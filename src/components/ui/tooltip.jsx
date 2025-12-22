import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const ContentRoot = styled(TooltipPrimitive.Content)`
  z-index: 50;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  color: hsl(var(--popover-foreground));
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.5);
`;

const TooltipContent = React.forwardRef(function TooltipContent(
  { className, sideOffset = 4, ...props },
  ref,
) {
  return (
    <ContentRoot
      ref={ref}
      sideOffset={sideOffset}
      className={cn("", className)}
      {...props}
    />
  );
});

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

