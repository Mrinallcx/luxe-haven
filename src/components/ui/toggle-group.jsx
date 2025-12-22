import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import styled, { css } from "styled-components";

import { cn } from "../../lib/utils";

const ToggleGroupContext = React.createContext({
  size: "default",
  variant: "default",
});

const GroupRoot = styled(ToggleGroupPrimitive.Root)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
`;

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

const ItemBase = styled(ToggleGroupPrimitive.Item)`
  ${baseStyles}
`;

const ToggleGroup = React.forwardRef(function ToggleGroup(
  { className, variant = "default", size = "default", children, ...props },
  ref,
) {
  return (
    <GroupRoot ref={ref} className={cn("", className)} {...props}>
      <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
    </GroupRoot>
  );
});

const ToggleGroupItem = React.forwardRef(function ToggleGroupItem(
  { className, children, variant, size, ...props },
  ref,
) {
  const context = React.useContext(ToggleGroupContext);
  const resolvedVariant = variant || context.variant || "default";
  const resolvedSize = size || context.size || "default";

  const VariantItem = styled(ItemBase)`
    ${variantStyles[resolvedVariant] || variantStyles.default}
    ${sizeVariants[resolvedSize] || sizeVariants.default}
  `;

  return (
    <VariantItem ref={ref} className={cn("", className)} {...props}>
      {children}
    </VariantItem>
  );
});

export { ToggleGroup, ToggleGroupItem };

