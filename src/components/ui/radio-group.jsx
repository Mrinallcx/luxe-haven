import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const Root = styled(RadioGroupPrimitive.Root)`
  display: grid;
  gap: 0.5rem;
`;

const ItemRoot = styled(RadioGroupPrimitive.Item)`
  aspect-ratio: 1 / 1;
  height: 1rem;
  width: 1rem;
  border-radius: 9999px;
  border: 1px solid hsl(var(--primary));
  color: hsl(var(--primary));
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  &:focus-visible {
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const IndicatorRoot = styled(RadioGroupPrimitive.Indicator)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IndicatorCircle = styled(Circle)`
  width: 0.625rem;
  height: 0.625rem;
  fill: currentColor;
`;

const RadioGroup = React.forwardRef(function RadioGroup({ className, ...props }, ref) {
  return <Root ref={ref} className={cn("", className)} {...props} />;
});

const RadioGroupItem = React.forwardRef(function RadioGroupItem({ className, ...props }, ref) {
  return (
    <ItemRoot ref={ref} className={cn("", className)} {...props}>
      <IndicatorRoot>
        <IndicatorCircle />
      </IndicatorRoot>
    </ItemRoot>
  );
});

export { RadioGroup, RadioGroupItem };
