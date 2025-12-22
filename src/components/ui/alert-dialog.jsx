import React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import styled from "styled-components";

const Overlay = styled(AlertDialogPrimitive.Overlay)`
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.8);
`;

const ContentRoot = styled(AlertDialogPrimitive.Content)`
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 50;
  max-width: 32rem;
  width: 100%;
  transform: translate(-50%, -50%);
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
  box-shadow: 0 20px 40px hsl(var(--charcoal) / 0.2);
`;

const HeaderRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;

  @media (min-width: 640px) {
    text-align: left;
  }
`;

const FooterRoot = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
  }
`;

const TitleText = styled(AlertDialogPrimitive.Title)`
  font-size: 1.125rem;
  font-weight: 600;
`;

const DescriptionText = styled(AlertDialogPrimitive.Description)`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`;

const BaseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
`;

const PrimaryButton = styled(BaseButton)`
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));

  &:hover {
    background-color: hsl(var(--primary) / 0.9);
  }
`;

const OutlineButton = styled(BaseButton)`
  background-color: transparent;
  color: hsl(var(--foreground));
  border-color: hsl(var(--border));

  &:hover {
    background-color: hsl(var(--muted));
  }
`;

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef(function AlertDialogOverlay(props, ref) {
  return <Overlay ref={ref} {...props} />;
});

const AlertDialogContent = React.forwardRef(function AlertDialogContent(props, ref) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <ContentRoot ref={ref} {...props} />
    </AlertDialogPortal>
  );
});

const AlertDialogHeader = function AlertDialogHeader(props) {
  return <HeaderRoot {...props} />;
};

const AlertDialogFooter = function AlertDialogFooter(props) {
  return <FooterRoot {...props} />;
};

const AlertDialogTitle = React.forwardRef(function AlertDialogTitle(props, ref) {
  return <TitleText ref={ref} {...props} />;
});

const AlertDialogDescription = React.forwardRef(function AlertDialogDescription(props, ref) {
  return <DescriptionText ref={ref} {...props} />;
});

const AlertDialogAction = React.forwardRef(function AlertDialogAction(props, ref) {
  return (
    <AlertDialogPrimitive.Action asChild>
      <PrimaryButton ref={ref} type="button" {...props} />
    </AlertDialogPrimitive.Action>
  );
});

const AlertDialogCancel = React.forwardRef(function AlertDialogCancel(props, ref) {
  return (
    <AlertDialogPrimitive.Cancel asChild>
      <OutlineButton ref={ref} type="button" {...props} />
    </AlertDialogPrimitive.Cancel>
  );
});

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
