import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const OverlayRoot = styled(SheetPrimitive.Overlay)`
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.8);
`;

const ContentRoot = styled(SheetPrimitive.Content)`
  position: fixed;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: hsl(var(--background));
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.75);
  transition: transform 0.3s ease, opacity 0.3s ease;
`;

const CloseButton = styled(SheetPrimitive.Close)`
  position: absolute;
  right: 1rem;
  top: 1rem;
  border-radius: 0.125rem;
  opacity: 0.7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s ease;

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
  row-gap: 0.5rem;
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

const TitleRoot = styled(SheetPrimitive.Title)`
  font-size: 1.125rem;
  font-weight: 600;
  color: hsl(var(--foreground));
`;

const DescriptionRoot = styled(SheetPrimitive.Description)`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`;

const SheetOverlay = React.forwardRef(function SheetOverlay({ className, ...props }, ref) {
  return <OverlayRoot ref={ref} className={cn("", className)} {...props} />;
});

const SheetContent = React.forwardRef(function SheetContent(
  { side = "right", className, children, ...props },
  ref,
) {
  const positionStyles =
    side === "top"
      ? { insetInline: 0, top: 0, borderBottom: `1px solid hsl(var(--border))` }
      : side === "bottom"
      ? { insetInline: 0, bottom: 0, borderTop: `1px solid hsl(var(--border))` }
      : side === "left"
      ? {
          insetBlock: 0,
          left: 0,
          height: "100%",
          width: "75%",
          maxWidth: "24rem",
          borderRight: `1px solid hsl(var(--border))`,
        }
      : {
          insetBlock: 0,
          right: 0,
          height: "100%",
          width: "75%",
          maxWidth: "24rem",
          borderLeft: `1px solid hsl(var(--border))`,
        };

  return (
    <SheetPortal>
      <SheetOverlay />
      <ContentRoot
        ref={ref}
        style={positionStyles}
        className={cn("", className)}
        {...props}
      >
        {children}
        <CloseButton>
          <CloseIcon />
          <SrOnly>Close</SrOnly>
        </CloseButton>
      </ContentRoot>
    </SheetPortal>
  );
});

const SheetHeader = ({ className, ...props }) => {
  return <HeaderRoot className={cn("", className)} {...props} />;
};

const SheetFooter = ({ className, ...props }) => {
  return <FooterRoot className={cn("", className)} {...props} />;
};

const SheetTitle = React.forwardRef(function SheetTitle({ className, ...props }, ref) {
  return <TitleRoot ref={ref} className={cn("", className)} {...props} />;
});

const SheetDescription = React.forwardRef(function SheetDescription(
  { className, ...props },
  ref,
) {
  return <DescriptionRoot ref={ref} className={cn("", className)} {...props} />;
});

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};

