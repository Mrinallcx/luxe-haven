import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const Root = styled(SliderPrimitive.Root)`
  position: relative;
  display: flex;
  width: 100%;
  touch-action: none;
  user-select: none;
  align-items: center;
`;

const Track = styled(SliderPrimitive.Track)`
  position: relative;
  height: 0.5rem;
  width: 100%;
  flex-grow: 1;
  overflow: hidden;
  border-radius: 9999px;
  background-color: hsl(var(--secondary));
`;

const Range = styled(SliderPrimitive.Range)`
  position: absolute;
  height: 100%;
  background-color: hsl(var(--primary));
`;

const Thumb = styled(SliderPrimitive.Thumb)`
  display: block;
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 9999px;
  border: 2px solid hsl(var(--primary));
  background-color: hsl(var(--background));
  outline: none;
  transition: background-color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;

  &:focus-visible {
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

const Slider = React.forwardRef(function Slider({ className, ...props }, ref) {
  return (
    <Root ref={ref} className={cn("", className)} {...props}>
      <Track>
        <Range />
      </Track>
      <Thumb />
    </Root>
  );
});

export { Slider };

