import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const Root = styled(ScrollAreaPrimitive.Root)`
  position: relative;
  overflow: hidden;
`;

const Viewport = styled(ScrollAreaPrimitive.Viewport)`
  height: 100%;
  width: 100%;
  border-radius: inherit;
`;

const ScrollbarRoot = styled(ScrollAreaPrimitive.ScrollAreaScrollbar)`
  display: flex;
  touch-action: none;
  user-select: none;
  transition: background-color 0.15s ease;

  &[data-orientation="vertical"] {
    height: 100%;
    width: 0.625rem;
    border-left: 1px solid transparent;
    padding: 1px;
  }

  &[data-orientation="horizontal"] {
    height: 0.625rem;
    flex-direction: column;
    border-top: 1px solid transparent;
    padding: 1px;
  }
`;

const Thumb = styled(ScrollAreaPrimitive.ScrollAreaThumb)`
  position: relative;
  flex: 1;
  border-radius: 9999px;
  background-color: hsl(var(--border));
`;

const ScrollArea = React.forwardRef(function ScrollArea(
  { className, children, ...props },
  ref,
) {
  return (
    <Root ref={ref} className={cn("", className)} {...props}>
      <Viewport>{children}</Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </Root>
  );
});

const ScrollBar = React.forwardRef(function ScrollBar(
  { className, orientation = "vertical", ...props },
  ref,
) {
  return (
    <ScrollbarRoot
      ref={ref}
      orientation={orientation}
      className={cn("", className)}
      {...props}
    >
      <Thumb />
    </ScrollbarRoot>
  );
});

export { ScrollArea, ScrollBar };

