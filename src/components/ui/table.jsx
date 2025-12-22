import * as React from "react";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  caption-side: bottom;
  font-size: 0.875rem;
`;

const StyledThead = styled.thead`
  & tr {
    border-bottom: 1px solid hsl(var(--border));
  }
`;

const StyledTbody = styled.tbody`
  & tr:last-child {
    border-bottom: none;
  }
`;

const StyledTfoot = styled.tfoot`
  border-top: 1px solid hsl(var(--border));
  background-color: hsl(var(--muted) / 0.5);
  font-weight: 500;

  & > tr:last-child {
    border-bottom: none;
  }
`;

const StyledTr = styled.tr`
  border-bottom: 1px solid hsl(var(--border));
  transition: background-color 0.15s ease;

  &[data-state="selected"] {
    background-color: hsl(var(--muted));
  }

  &:hover {
    background-color: hsl(var(--muted) / 0.5);
  }
`;

const StyledTh = styled.th`
  height: 3rem;
  padding-inline: 1rem;
  text-align: left;
  vertical-align: middle;
  font-weight: 500;
  color: hsl(var(--muted-foreground));

  &:has([role="checkbox"]) {
    padding-right: 0;
  }
`;

const StyledTd = styled.td`
  padding: 1rem;
  vertical-align: middle;

  &:has([role="checkbox"]) {
    padding-right: 0;
  }
`;

const StyledCaption = styled.caption`
  margin-top: 1rem;
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`;

const Table = React.forwardRef(function Table({ className, ...props }, ref) {
  return (
    <Wrapper>
      <StyledTable ref={ref} className={cn("", className)} {...props} />
    </Wrapper>
  );
});

const TableHeader = React.forwardRef(function TableHeader({ className, ...props }, ref) {
  return <StyledThead ref={ref} className={cn("", className)} {...props} />;
});

const TableBody = React.forwardRef(function TableBody({ className, ...props }, ref) {
  return <StyledTbody ref={ref} className={cn("", className)} {...props} />;
});

const TableFooter = React.forwardRef(function TableFooter({ className, ...props }, ref) {
  return <StyledTfoot ref={ref} className={cn("", className)} {...props} />;
});

const TableRow = React.forwardRef(function TableRow({ className, ...props }, ref) {
  return <StyledTr ref={ref} className={cn("", className)} {...props} />;
});

const TableHead = React.forwardRef(function TableHead({ className, ...props }, ref) {
  return <StyledTh ref={ref} className={cn("", className)} {...props} />;
});

const TableCell = React.forwardRef(function TableCell({ className, ...props }, ref) {
  return <StyledTd ref={ref} className={cn("", className)} {...props} />;
});

const TableCaption = React.forwardRef(function TableCaption({ className, ...props }, ref) {
  return <StyledCaption ref={ref} className={cn("", className)} {...props} />;
});

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };

