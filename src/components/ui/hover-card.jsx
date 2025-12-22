import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

const ContentRoot = styled(HoverCardPrimitive.Content)`
  z-index: 50;
  width: 16rem;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--popover));
  padding: 1rem;
  color: hsl(var(--popover-foreground));
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.5);
  outline: none;
`;

const HoverCardContent = React.forwardRef(function HoverCardContent(
  { className, align = "center", sideOffset = 4, ...props },
  ref,
) {
  return (
    <ContentRoot
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn("", className)}
      {...props}
    />
  );
});

export { HoverCard, HoverCardTrigger, HoverCardContent };
