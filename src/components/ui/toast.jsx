import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { X } from "lucide-react";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ViewportRoot = styled(ToastPrimitives.Viewport)`
  position: fixed;
  top: 0;
  z-index: 100;
  display: flex;
  max-height: 100vh;
  width: 100%;
  flex-direction: column-reverse;
  padding: 1rem;

  @media (min-width: 640px) {
    top: auto;
    bottom: 0;
    right: 0;
    flex-direction: column;
    max-width: 420px;
  }
`;

const ToastViewport = React.forwardRef(function ToastViewport({ className, ...props }, ref) {
  return <ViewportRoot ref={ref} className={cn("", className)} {...props} />;
});

const Root = styled(ToastPrimitives.Root)`
  pointer-events: auto;
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
  padding: 1.5rem 2rem 1.5rem 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.5);
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  transition: transform 0.2s ease, opacity 0.2s ease;

  &[data-variant="destructive"] {
    border-color: hsl(var(--destructive));
    background-color: hsl(var(--destructive));
    color: hsl(var(--destructive-foreground));
  }
`;

const ActionRoot = styled(ToastPrimitives.Action)`
  display: inline-flex;
  height: 2rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
  background-color: transparent;
  padding-inline: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;

  [data-variant="destructive"] & {
    border-color: hsl(var(--muted) / 0.4);
  }

  &:hover {
    background-color: hsl(var(--secondary));
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

const CloseRoot = styled(ToastPrimitives.Close)`
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  border-radius: 0.25rem;
  padding: 0.25rem;
  color: hsl(var(--foreground) / 0.5);
  opacity: 0;
  transition: opacity 0.15s ease, color 0.15s ease;

  &:hover {
    color: hsl(var(--foreground));
  }

  &:focus-visible {
    opacity: 1;
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }

  [data-variant="destructive"] & {
    color: hsl(var(--destructive-foreground) / 0.7);
  }

  ${Root}:hover & {
    opacity: 1;
  }
`;

const CloseIcon = styled(X)`
  width: 1rem;
  height: 1rem;
`;

const TitleRoot = styled(ToastPrimitives.Title)`
  font-size: 0.875rem;
  font-weight: 600;
`;

const DescriptionRoot = styled(ToastPrimitives.Description)`
  font-size: 0.875rem;
  opacity: 0.9;
`;

const Toast = React.forwardRef(function Toast(
  { className, variant = "default", ...props },
  ref,
) {
  return <Root ref={ref} data-variant={variant} className={cn("", className)} {...props} />;
});

const ToastAction = React.forwardRef(function ToastAction({ className, ...props }, ref) {
  return <ActionRoot ref={ref} className={cn("", className)} {...props} />;
});

const ToastClose = React.forwardRef(function ToastClose({ className, ...props }, ref) {
  return (
    <CloseRoot ref={ref} className={cn("", className)} {...props}>
      <CloseIcon />
    </CloseRoot>
  );
});

const ToastTitle = React.forwardRef(function ToastTitle({ className, ...props }, ref) {
  return <TitleRoot ref={ref} className={cn("", className)} {...props} />;
});

const ToastDescription = React.forwardRef(function ToastDescription(
  { className, ...props },
  ref,
) {
  return <DescriptionRoot ref={ref} className={cn("", className)} {...props} />;
});

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};

