import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const Drawer = ({ shouldScaleBackground = true, ...props }) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);

const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

const Overlay = styled(DrawerPrimitive.Overlay)`
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.8);
`;

const ContentRoot = styled(DrawerPrimitive.Content)`
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 50;
  margin-top: 6rem;
  display: flex;
  flex-direction: column;
  height: auto;
  border-radius: 10px 10px 0 0;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--background));
`;

const Handle = styled.div`
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  width: 100px;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: hsl(var(--muted));
`;

const HeaderRoot = styled.div`
  display: grid;
  gap: 0.375rem;
  padding: 1rem;
  text-align: center;
  @media (min-width: 640px) {
    text-align: left;
  }
`;

const FooterRoot = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
`;

const TitleRoot = styled(DrawerPrimitive.Title)`
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
`;

const DescriptionRoot = styled(DrawerPrimitive.Description)`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`;

const DrawerOverlay = React.forwardRef(function DrawerOverlay({ className, ...props }, ref) {
  return <Overlay ref={ref} className={cn("", className)} {...props} />;
});

const DrawerContent = React.forwardRef(function DrawerContent(
  { className, children, ...props },
  ref,
) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <ContentRoot ref={ref} className={cn("", className)} {...props}>
        <Handle />
        {children}
      </ContentRoot>
    </DrawerPortal>
  );
});

const DrawerHeader = ({ className, ...props }) => {
  return <HeaderRoot className={cn("", className)} {...props} />;
};

const DrawerFooter = ({ className, ...props }) => {
  return <FooterRoot className={cn("", className)} {...props} />;
};

const DrawerTitle = React.forwardRef(function DrawerTitle({ className, ...props }, ref) {
  return <TitleRoot ref={ref} className={cn("", className)} {...props} />;
});

const DrawerDescription = React.forwardRef(function DrawerDescription(
  { className, ...props },
  ref,
) {
  return <DescriptionRoot ref={ref} className={cn("", className)} {...props} />;
});

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
