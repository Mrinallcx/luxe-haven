import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styled from "styled-components";

import { cn } from "../../lib/utils";
import { Button } from "./button";

// Context without TypeScript types
const CarouselContext = React.createContext(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

// Styled components
const StyledCarouselRoot = styled.div`
  position: relative;
`;

const StyledViewport = styled.div`
  overflow: hidden;
`;

const StyledCarouselContent = styled.div`
  display: flex;
`;

const StyledCarouselItem = styled.div`
  min-width: 0;
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: 100%;
`;

const StyledNavButton = styled(Button)`
  position: absolute;
  height: 2rem;
  width: 2rem;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 1rem;
    height: 1rem;
  }
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

const Carousel = React.forwardRef(function Carousel(
  { orientation = "horizontal", opts, setApi, plugins, className, children, ...props },
  ref,
) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...(opts || {}),
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback(
    (emblaApi) => {
      if (!emblaApi) return;
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    },
    [setCanScrollPrev, setCanScrollNext],
  );

  const scrollPrev = React.useCallback(() => {
    if (api) api.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    if (api) api.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  const value = {
    carouselRef,
    api,
    opts,
    orientation: orientation || (opts && opts.axis === "y" ? "vertical" : "horizontal"),
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
  };

  return (
    <CarouselContext.Provider value={value}>
      <StyledCarouselRoot
        ref={ref}
        onKeyDownCapture={handleKeyDown}
        className={cn("", className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </StyledCarouselRoot>
    </CarouselContext.Provider>
  );
});

const CarouselContent = React.forwardRef(function CarouselContent({ className, ...props }, ref) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <StyledViewport ref={carouselRef}>
      <StyledCarouselContent
        ref={ref}
        className={cn("", className)}
        style={
          orientation === "horizontal"
            ? { marginLeft: "-1rem" }
            : { marginTop: "-1rem", flexDirection: "column" }
        }
        {...props}
      />
    </StyledViewport>
  );
});

const CarouselItem = React.forwardRef(function CarouselItem({ className, ...props }, ref) {
  const { orientation } = useCarousel();

  return (
    <StyledCarouselItem
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn("", className)}
      style={orientation === "horizontal" ? { paddingLeft: "1rem" } : { paddingTop: "1rem" }}
      {...props}
    />
  );
});

const CarouselPrevious = React.forwardRef(function CarouselPrevious(
  { className, variant = "outline", size = "icon", ...props },
  ref,
) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  const extraStyle =
    orientation === "horizontal"
      ? { left: "-3rem", top: "50%", transform: "translateY(-50%)" }
      : { top: "-3rem", left: "50%", transform: "translateX(-50%) rotate(90deg)" };

  return (
    <StyledNavButton
      ref={ref}
      variant={variant}
      size={size}
      className={cn("", className)}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      style={extraStyle}
      {...props}
    >
      <IconWrapper>
        <ArrowLeft />
      </IconWrapper>
      <SrOnly>Previous slide</SrOnly>
    </StyledNavButton>
  );
});

const CarouselNext = React.forwardRef(function CarouselNext(
  { className, variant = "outline", size = "icon", ...props },
  ref,
) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  const extraStyle =
    orientation === "horizontal"
      ? { right: "-3rem", top: "50%", transform: "translateY(-50%)" }
      : { bottom: "-3rem", left: "50%", transform: "translateX(-50%) rotate(90deg)" };

  return (
    <StyledNavButton
      ref={ref}
      variant={variant}
      size={size}
      className={cn("", className)}
      disabled={!canScrollNext}
      onClick={scrollNext}
      style={extraStyle}
      {...props}
    >
      <IconWrapper>
        <ArrowRight />
      </IconWrapper>
      <SrOnly>Next slide</SrOnly>
    </StyledNavButton>
  );
});

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
