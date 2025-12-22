import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import styled from "styled-components";

const StyledItem = styled(AccordionPrimitive.Item)`
  border-bottom: 1px solid hsl(var(--border));
`;

const Header = styled(AccordionPrimitive.Header)`
  display: flex;
`;

const TriggerButton = styled(AccordionPrimitive.Trigger)`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  border: none;
  text-align: left;
  transition: color 0.2s ease, text-decoration 0.2s ease;

  &:hover {
    text-decoration: underline;
  }

  svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  &[data-state="open"] svg {
    transform: rotate(180deg);
  }
`;

const ContentRoot = styled(AccordionPrimitive.Content)`
  overflow: hidden;
  font-size: 0.875rem;
`;

const ContentInner = styled.div`
  padding-bottom: 1rem;
`;

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef(function AccordionItem(props, ref) {
  return <StyledItem ref={ref} {...props} />;
});

const AccordionTrigger = React.forwardRef(function AccordionTrigger(
  { children, ...props },
  ref,
) {
  return (
    <Header>
      <TriggerButton ref={ref} {...props}>
        {children}
        <ChevronDown />
      </TriggerButton>
    </Header>
  );
});

const AccordionContent = React.forwardRef(function AccordionContent(
  { children, ...props },
  ref,
) {
  return (
    <ContentRoot ref={ref} {...props}>
      <ContentInner>{children}</ContentInner>
    </ContentRoot>
  );
});

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
