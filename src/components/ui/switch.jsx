import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const Root = styled(SwitchPrimitives.Root)`
  display: inline-flex;
  height: 1.5rem;
  width: 2.75rem;
  flex-shrink: 0;
  cursor: pointer;
  align-items: center;
  border-radius: 9999px;
  border: 2px solid transparent;
  transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;

  &[data-state="checked"] {
    background-color: hsl(var(--primary));
  }

  &[data-state="unchecked"] {
    background-color: hsl(var(--input));
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Thumb = styled(SwitchPrimitives.Thumb)`
  pointer-events: none;
  display: block;
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 9999px;
  background-color: hsl(var(--background));
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.5);
  transform: translateX(0);
  transition: transform 0.15s ease;

  &[data-state="checked"] {
    transform: translateX(1.25rem);
  }
`;

const Switch = React.forwardRef(function Switch({ className, ...props }, ref) {
  return (
    <Root ref={ref} className={cn("", className)} {...props}>
      <Thumb />
    </Root>
  );
});

export { Switch };
