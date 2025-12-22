import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const StyledLabel = styled(LabelPrimitive.Root)`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;

  .peer:disabled ~ & {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Label = React.forwardRef(function Label({ className, ...props }, ref) {
  return <StyledLabel ref={ref} className={cn("", className)} {...props} />;
});

export { Label };
