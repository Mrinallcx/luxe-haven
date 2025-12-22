import React from "react";
import styled, { css } from "styled-components";

const AlertRoot = styled.div`
  position: relative;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
  padding: 1rem;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));

  & > svg {
    position: absolute;
    left: 1rem;
    top: 1rem;
    width: 1rem;
    height: 1rem;
    color: hsl(var(--foreground));
  }

  & > svg + div {
    transform: translateY(-3px);
  }

  & > svg ~ * {
    padding-left: 1.75rem;
  }
`;

const destructiveStyles = css`
  border-color: hsl(var(--destructive) / 0.5);
  color: hsl(var(--destructive));

  & > svg {
    color: hsl(var(--destructive));
  }
`;

const AlertTitleText = styled.h5`
  margin-bottom: 0.25rem;
  font-weight: 500;
  letter-spacing: -0.01em;
`;

const AlertDescriptionBox = styled.div`
  font-size: 0.875rem;

  p {
    line-height: 1.6;
  }
`;

function Alert({ variant = "default", ...props }) {
  const Styled = styled(AlertRoot)`
    ${variant === "destructive" ? destructiveStyles : ""}
  `;
  return <Styled role="alert" {...props} />;
}

const AlertTitle = React.forwardRef(function AlertTitle(props, ref) {
  return <AlertTitleText ref={ref} {...props} />;
});

const AlertDescription = React.forwardRef(function AlertDescription(props, ref) {
  return <AlertDescriptionBox ref={ref} {...props} />;
});

export { Alert, AlertTitle, AlertDescription };
