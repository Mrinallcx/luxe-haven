import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const Overlay = styled(DialogPrimitive.Overlay)`
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.8);
`;

const ContentRoot = styled(DialogPrimitive.Content)`
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 50;
  display: grid;
  width: 100%;
  max-width: 32rem;
  transform: translate(-50%, -50%);
  gap: 1rem;
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.75);
`;

const CloseButton = styled(DialogPrimitive.Close)`
  position: absolute;
  right: 1rem;
  top: 1rem;
  border-radius: 0.125rem;
  opacity: 0.7;
  transition: opacity 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }

  &:disabled {
    pointer-events: none;
  }
`;

const CloseIcon = styled(X)`
  width: 1rem;
  height: 1rem;
`;

const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const HeaderRoot = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.375rem;
  text-align: center;
  @media (min-width: 640px) {
    text-align: left;
  }
`;

const FooterRoot = styled.div`
  display: flex;
  flex-direction: column-reverse;
  row-gap: 0.5rem;
  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
    column-gap: 0.5rem;
  }
`;

const TitleRoot = styled(DialogPrimitive.Title)`
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
`;

const DescriptionRoot = styled(DialogPrimitive.Description)`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`;

const DialogOverlay = React.forwardRef(function DialogOverlay({ className, ...props }, ref) {
  return <Overlay ref={ref} className={cn("", className)} {...props} />;
});

const DialogContent = React.forwardRef(function DialogContent(
  { className, children, ...props },
  ref,
) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <ContentRoot ref={ref} className={cn("", className)} {...props}>
        {children}
        <CloseButton>
          <CloseIcon />
          <SrOnly>Close</SrOnly>
        </CloseButton>
      </ContentRoot>
    </DialogPortal>
  );
});

const DialogHeader = ({ className, ...props }) => {
  return <HeaderRoot className={cn("", className)} {...props} />;
};

const DialogFooter = ({ className, ...props }) => {
  return <FooterRoot className={cn("", className)} {...props} />;
};

const DialogTitle = React.forwardRef(function DialogTitle({ className, ...props }, ref) {
  return <TitleRoot ref={ref} className={cn("", className)} {...props} />;
});

const DialogDescription = React.forwardRef(function DialogDescription(
  { className, ...props },
  ref,
) {
  return <DescriptionRoot ref={ref} className={cn("", className)} {...props} />;
});

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
