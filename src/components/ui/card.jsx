import * as React from "react";
import styled from "styled-components";

const Root = styled.div`
  border-radius: 0.5rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--card));
  color: hsl(var(--card-foreground));
  box-shadow: 0 1px 2px hsl(var(--charcoal) / 0.08);
`;

const HeaderRoot = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const TitleRoot = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const DescriptionRoot = styled.p`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`;

const ContentRoot = styled.div`
  padding: 1.5rem;
  padding-top: 0;
`;

const FooterRoot = styled.div`
  padding: 1.5rem;
  padding-top: 0;
  display: flex;
  align-items: center;
`;

const Card = React.forwardRef(function Card(props, ref) {
  return <Root ref={ref} {...props} />;
});

const CardHeader = React.forwardRef(function CardHeader(props, ref) {
  return <HeaderRoot ref={ref} {...props} />;
});

const CardTitle = React.forwardRef(function CardTitle(props, ref) {
  return <TitleRoot ref={ref} {...props} />;
});

const CardDescription = React.forwardRef(function CardDescription(props, ref) {
  return <DescriptionRoot ref={ref} {...props} />;
});

const CardContent = React.forwardRef(function CardContent(props, ref) {
  return <ContentRoot ref={ref} {...props} />;
});

const CardFooter = React.forwardRef(function CardFooter(props, ref) {
  return <FooterRoot ref={ref} {...props} />;
});

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
