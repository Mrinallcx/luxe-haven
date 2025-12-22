import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const Root = styled(SeparatorPrimitive.Root)`
  flex-shrink: 0;
  background-color: hsl(var(--border));

  &[data-orientation="horizontal"] {
    height: 1px;
    width: 100%;
  }

  &[data-orientation="vertical"] {
    width: 1px;
    height: 100%;
  }
`;

const Separator = React.forwardRef(function Separator(
  { className, orientation = "horizontal", decorative = true, ...props },
  ref,
) {
  return (
    <Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn("", className)}
      {...props}
    />
  );
});

export { Separator };
