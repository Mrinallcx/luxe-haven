import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const Root = styled(ProgressPrimitive.Root)`
  position: relative;
  height: 1rem;
  width: 100%;
  overflow: hidden;
  border-radius: 9999px;
  background-color: hsl(var(--secondary));
`;

const Indicator = styled(ProgressPrimitive.Indicator)`
  height: 100%;
  width: 100%;
  flex: 1;
  background-color: hsl(var(--primary));
  transition: transform 0.2s ease;
`;

const Progress = React.forwardRef(function Progress({ className, value = 0, ...props }, ref) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <Root ref={ref} className={cn("", className)} {...props}>
      <Indicator style={{ transform: `translateX(-${100 - clamped}%)` }} />
    </Root>
  );
});

export { Progress };
