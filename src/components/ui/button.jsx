import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import styled, { css } from "styled-components";

const baseStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 9999px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  & > svg {
    pointer-events: none;
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }
`;

const variantStyles = {
  default: css`
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    &:hover {
      background-color: hsl(var(--primary) / 0.9);
    }
  `,
  destructive: css`
    background-color: hsl(var(--destructive));
    color: hsl(var(--destructive-foreground));
    &:hover {
      background-color: hsl(var(--destructive) / 0.9);
    }
  `,
  outline: css`
    background-color: transparent;
    color: hsl(var(--foreground));
    border-color: hsl(var(--foreground) / 0.2);
    &:hover {
      background-color: hsl(var(--foreground) / 0.05);
    }
  `,
  secondary: css`
    background-color: hsl(var(--secondary));
    color: hsl(var(--secondary-foreground));
    &:hover {
      background-color: hsl(var(--secondary) / 0.8);
    }
  `,
  ghost: css`
    background-color: transparent;
    color: hsl(var(--accent-foreground));
    &:hover {
      background-color: hsl(var(--accent));
    }
  `,
  link: css`
    background-color: transparent;
    color: hsl(var(--foreground));
    border-radius: 0;
    text-decoration: none;
    text-underline-offset: 4px;
    &:hover {
      text-decoration: underline;
    }
  `,
  premium: css`
    background-color: hsl(var(--charcoal));
    color: hsl(var(--cream));
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 500;
    &:hover {
      background-color: hsl(var(--charcoal) / 0.9);
    }
  `,
  "premium-outline": css`
    background-color: transparent;
    color: hsl(var(--charcoal));
    border-color: hsl(var(--charcoal));
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 500;
    &:hover {
      background-color: hsl(var(--charcoal));
      color: hsl(var(--cream));
    }
  `,
  "premium-light": css`
    background-color: hsl(var(--cream));
    color: hsl(var(--charcoal));
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 500;
    &:hover {
      background-color: hsl(var(--cream) / 0.9);
    }
  `,
  "premium-gold": css`
    background-color: hsl(var(--gold));
    color: hsl(var(--charcoal));
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 500;
    &:hover {
      background-color: hsl(var(--gold) / 0.9);
    }
  `,
};

const sizeStyles = {
  default: css`
    height: 2.5rem;
    padding: 0 1rem;
  `,
  sm: css`
    height: 2.25rem;
    padding: 0 0.75rem;
  `,
  lg: css`
    height: 3rem;
    padding: 0 2rem;
  `,
  xl: css`
    height: 3.5rem;
    padding: 0 3rem;
  `,
  icon: css`
    height: 2.5rem;
    width: 2.5rem;
    padding: 0;
  `,
};

const StyledButton = styled.button`
  ${baseStyles};
  ${({ $variant }) => variantStyles[$variant]};
  ${({ $size }) => sizeStyles[$size]};
`;

const Button = React.forwardRef(function Button(
  { variant = "default", size = "default", asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot : StyledButton;
  const extraProps = asChild ? {} : { $variant: variant, $size: size };
  return <Comp ref={ref} {...extraProps} {...props} />;
});
Button.displayName = "Button";

export { Button };
