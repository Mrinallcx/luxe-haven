import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import styled from "styled-components";

const Root = styled(AvatarPrimitive.Root)`
  position: relative;
  display: flex;
  height: 2.5rem;
  width: 2.5rem;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 9999px;
`;

const Image = styled(AvatarPrimitive.Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Fallback = styled(AvatarPrimitive.Fallback)`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: hsl(var(--muted));
`;

const Avatar = React.forwardRef(function Avatar(props, ref) {
  return <Root ref={ref} {...props} />;
});

const AvatarImage = React.forwardRef(function AvatarImage(props, ref) {
  return <Image ref={ref} {...props} />;
});

const AvatarFallback = React.forwardRef(function AvatarFallback(props, ref) {
  return <Fallback ref={ref} {...props} />;
});

export { Avatar, AvatarImage, AvatarFallback };
