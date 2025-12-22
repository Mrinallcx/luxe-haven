import * as React from "react";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const StyledInput = styled.input`
  display: flex;
  height: 2.5rem;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--input));
  background-color: hsl(var(--background));
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
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

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

const Input = React.forwardRef(function Input({ className, type, ...props }, ref) {
  return <StyledInput ref={ref} type={type} className={cn("", className)} {...props} />;
});

export { Input };
