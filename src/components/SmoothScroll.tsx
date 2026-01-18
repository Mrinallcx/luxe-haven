import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useLocation } from "react-router-dom";

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Check if element is scrollable and should handle its own scroll
    const isScrollableElement = (element: HTMLElement | null): boolean => {
      if (!element) return false;
      const style = window.getComputedStyle(element);
      const overflowY = style.overflowY;
      const hasScrollableContent = element.scrollHeight > element.clientHeight;
      return (overflowY === 'auto' || overflowY === 'scroll') && hasScrollableContent;
    };

    // Handle wheel events - let scrollable containers handle their own scroll
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      let currentElement: HTMLElement | null = target;

      // Check if the target or any parent is a scrollable container
      while (currentElement && currentElement !== document.body) {
        if (isScrollableElement(currentElement)) {
          const { scrollTop, scrollHeight, clientHeight } = currentElement;
          const isAtTop = scrollTop === 0;
          const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
          const isScrollingUp = e.deltaY < 0;
          const isScrollingDown = e.deltaY > 0;

          // If we can scroll in the direction of the wheel, prevent Lenis from handling it
          if ((isScrollingUp && !isAtTop) || (isScrollingDown && !isAtBottom)) {
            lenis.stop();
            // Resume after a short delay
            setTimeout(() => {
              lenis.start();
            }, 100);
            return;
          }
        }
        currentElement = currentElement.parentElement;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });

    // Animation frame function
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleWheel);
      lenis.destroy();
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: false });
    }
  }, [location.pathname]);

  return <>{children}</>;
};

export default SmoothScroll;
