import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import styled, { css } from "styled-components";

import { cn } from "../../lib/utils";

const baseStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    opacity 0.15s ease;

  &:hover {
    background-color: hsl(var(--muted));
    color: hsl(var(--muted-foreground));
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &[data-state="on"] {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }
`;

const sizeVariants = {
  default: css`
    height: 2.5rem;
    padding-inline: 0.75rem;
  `,
  sm: css`
    height: 2.25rem;
    padding-inline: 0.625rem;
  `,
  lg: css`
    height: 2.75rem;
    padding-inline: 1.25rem;
  `,
};

const variantStyles = {
  default: css`
    background-color: transparent;
  `,
  outline: css`
    border: 1px solid hsl(var(--input));
    background-color: transparent;

    &:hover {
      background-color: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }
  `,
};

const StyledToggle = styled(TogglePrimitive.Root)`
  ${baseStyles}
`;

const Toggle = React.forwardRef(function Toggle(
  { className, variant = "default", size = "default", ...props },
  ref,
) {
  const variantCss = variantStyles[variant] || variantStyles.default;
  const sizeCss = sizeVariants[size] || sizeVariants.default;

  const DynamicToggle = styled(StyledToggle)`
    ${variantCss}
    ${sizeCss}
  `;

  return <DynamicToggle ref={ref} className={cn("", className)} {...props} />;
});

export { Toggle };

