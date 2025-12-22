import styled, { keyframes } from "styled-components";

import { cn } from "../../lib/utils";

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
`;

const SkeletonRoot = styled.div`
  border-radius: 0.375rem;
  background-color: hsl(var(--muted));
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

function Skeleton({ className, ...props }) {
  return <SkeletonRoot className={cn("", className)} {...props} />;
}

export { Skeleton };
