import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const StyledCheckboxRoot = styled(CheckboxPrimitive.Root)`
  height: 1rem;
  width: 1rem;
  flex-shrink: 0;
  border-radius: 0.125rem;
  border: 1px solid hsl(var(--primary));
  background-color: transparent;
  color: hsl(var(--primary-foreground));
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease,
    opacity 0.15s ease;

  &[data-state="checked"] {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Indicator = styled(CheckboxPrimitive.Indicator)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: currentColor;

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const Checkbox = React.forwardRef(function Checkbox({ className, ...props }, ref) {
  return (
    <StyledCheckboxRoot ref={ref} className={cn("", className)} {...props}>
      <Indicator>
        <Check />
      </Indicator>
    </StyledCheckboxRoot>
  );
});

export { Checkbox };
