import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import styled from "styled-components";

const Nav = styled.nav`
  width: 100%;
`;

const List = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  word-break: break-word;
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));

  @media (min-width: 640px) {
    gap: 0.625rem;
  }
`;

const Item = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
`;

const LinkRoot = styled.a`
  transition: color 0.2s ease;
  color: inherit;
  text-decoration: none;

  &:hover {
    color: hsl(var(--foreground));
  }
`;

const Page = styled.span`
  font-weight: 400;
  color: hsl(var(--foreground));
`;

const SeparatorRoot = styled.li`
  display: inline-flex;
  align-items: center;

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;

const EllipsisRoot = styled.span`
  display: flex;
  width: 2.25rem;
  height: 2.25rem;
  align-items: center;
  justify-content: center;

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const Breadcrumb = React.forwardRef(function Breadcrumb(props, ref) {
  return <Nav ref={ref} aria-label="breadcrumb" {...props} />;
});

const BreadcrumbList = React.forwardRef(function BreadcrumbList(props, ref) {
  return <List ref={ref} {...props} />;
});

const BreadcrumbItem = React.forwardRef(function BreadcrumbItem(props, ref) {
  return <Item ref={ref} {...props} />;
});

const BreadcrumbLink = React.forwardRef(function BreadcrumbLink(
  { asChild, ...props },
  ref,
) {
  const Comp = asChild ? Slot : LinkRoot;
  return <Comp ref={ref} {...props} />;
});

const BreadcrumbPage = React.forwardRef(function BreadcrumbPage(props, ref) {
  return <Page ref={ref} role="link" aria-disabled="true" aria-current="page" {...props} />;
});

const BreadcrumbSeparator = function BreadcrumbSeparator({ children, ...props }) {
  return (
    <SeparatorRoot role="presentation" aria-hidden="true" {...props}>
      {children ?? <ChevronRight />}
    </SeparatorRoot>
  );
};

const BreadcrumbEllipsis = function BreadcrumbEllipsis(props) {
  return (
    <EllipsisRoot role="presentation" aria-hidden="true" {...props}>
      <MoreHorizontal />
      <span className="sr-only">More</span>
    </EllipsisRoot>
  );
};

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
