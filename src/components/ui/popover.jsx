import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const ContentRoot = styled(PopoverPrimitive.Content)`
  z-index: 50;
  width: 18rem;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  padding: 1rem;
  color: hsl(var(--popover-foreground));
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.5);
  outline: none;
`;

const PopoverContent = React.forwardRef(function PopoverContent(
  { className, align = "center", sideOffset = 4, ...props },
  ref,
) {
  return (
    <PopoverPrimitive.Portal>
      <ContentRoot
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn("", className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});

export { Popover, PopoverTrigger, PopoverContent };
