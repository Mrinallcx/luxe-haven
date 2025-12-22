import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const NavRoot = styled.nav`
  margin-left: auto;
  margin-right: auto;
  display: flex;
  width: 100%;
  justify-content: center;
`;

const ListRoot = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.25rem;
`;

const ItemRoot = styled.li``;

const LinkRoot = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  border: 1px solid transparent;
  background-color: transparent;
  color: hsl(var(--foreground));
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;

  &[data-size="default"] {
    padding-inline: 0.625rem;
    height: 2.25rem;
  }

  &[data-size="icon"] {
    width: 2.25rem;
    height: 2.25rem;
  }

  &[data-variant="ghost"] {
    &:hover {
      background-color: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }
  }

  &[data-variant="outline"],
  &[aria-current="page"] {
    border-color: hsl(var(--border));
    background-color: hsl(var(--background));
  }
`;

const IconLeft = styled(ChevronLeft)`
  width: 1rem;
  height: 1rem;
`;

const IconRight = styled(ChevronRight)`
  width: 1rem;
  height: 1rem;
`;

const EllipsisRoot = styled.span`
  display: flex;
  width: 2.25rem;
  height: 2.25rem;
  align-items: center;
  justify-content: center;
`;

const EllipsisIcon = styled(MoreHorizontal)`
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

const Pagination = ({ className, ...props }) => (
  <NavRoot role="navigation" aria-label="pagination" className={cn("", className)} {...props} />
);

const PaginationContent = React.forwardRef(function PaginationContent(
  { className, ...props },
  ref,
) {
  return <ListRoot ref={ref} className={cn("", className)} {...props} />;
});

const PaginationItem = React.forwardRef(function PaginationItem({ className, ...props }, ref) {
  return <ItemRoot ref={ref} className={cn("", className)} {...props} />;
});

const PaginationLink = ({ className, isActive, size = "icon", ...props }) => (
  <LinkRoot
    aria-current={isActive ? "page" : undefined}
    data-variant={isActive ? "outline" : "ghost"}
    data-size={size}
    className={cn("", className)}
    {...props}
  />
);

const PaginationPrevious = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <IconLeft />
    <span>Previous</span>
  </PaginationLink>
);

const PaginationNext = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <IconRight />
  </PaginationLink>
);

const PaginationEllipsis = ({ className, ...props }) => (
  <EllipsisRoot aria-hidden className={cn("", className)} {...props}>
    <EllipsisIcon />
    <SrOnly>More pages</SrOnly>
  </EllipsisRoot>
);

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};

