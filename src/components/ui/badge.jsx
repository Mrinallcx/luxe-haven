import React from "react";
import styled, { css } from "styled-components";

const BaseBadge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  border-width: 1px;
  border-style: solid;
  padding: 0.125rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  cursor: default;
`;

const variantStyles = {
  default: css`
    border-color: transparent;
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));

    &:hover {
      background-color: hsl(var(--primary) / 0.8);
    }
  `,
  secondary: css`
    border-color: transparent;
    background-color: hsl(var(--secondary));
    color: hsl(var(--secondary-foreground));

    &:hover {
      background-color: hsl(var(--secondary) / 0.8);
    }
  `,
  destructive: css`
    border-color: transparent;
    background-color: hsl(var(--destructive));
    color: hsl(var(--destructive-foreground));

    &:hover {
      background-color: hsl(var(--destructive) / 0.8);
    }
  `,
  outline: css`
    border-color: hsl(var(--border));
    background-color: transparent;
    color: hsl(var(--foreground));
  `,
};

const StyledBadge = styled(BaseBadge)`
  ${({ $variant }) => variantStyles[$variant] || variantStyles.default};
`;

function Badge({ variant = "default", ...props }) {
  return <StyledBadge $variant={variant} {...props} />;
}

export { Badge };
