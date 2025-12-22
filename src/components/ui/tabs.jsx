import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const Tabs = TabsPrimitive.Root;

const ListRoot = styled(TabsPrimitive.List)`
  display: inline-flex;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  background-color: hsl(var(--muted));
  padding: 0.25rem;
  color: hsl(var(--muted-foreground));
`;

const TriggerRoot = styled(TabsPrimitive.Trigger)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;
  transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;

  &[data-state="active"] {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.25);
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

const ContentRoot = styled(TabsPrimitive.Content)`
  margin-top: 0.5rem;
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 2px hsl(var(--ring));
  }
`;

const TabsList = React.forwardRef(function TabsList({ className, ...props }, ref) {
  return <ListRoot ref={ref} className={cn("", className)} {...props} />;
});

const TabsTrigger = React.forwardRef(function TabsTrigger({ className, ...props }, ref) {
  return <TriggerRoot ref={ref} className={cn("", className)} {...props} />;
});

const TabsContent = React.forwardRef(function TabsContent({ className, ...props }, ref) {
  return <ContentRoot ref={ref} className={cn("", className)} {...props} />;
});

export { Tabs, TabsList, TabsTrigger, TabsContent };

