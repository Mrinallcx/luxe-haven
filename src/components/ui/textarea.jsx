import * as React from "react";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const StyledTextarea = styled.textarea`
  display: flex;
  min-height: 80px;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--input));
  background-color: hsl(var(--background));
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  outline: none;

  &::placeholder {
    color: hsl(var(--muted-foreground));
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Textarea = React.forwardRef(function Textarea({ className, ...props }, ref) {
  return <StyledTextarea ref={ref} className={cn("", className)} {...props} />;
});

export { Textarea };

