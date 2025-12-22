import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

// Radix AspectRatio is already a layout primitive; no extra Tailwind classes were used.
// We simply re-export it so it can be used in styled-components based projects.
const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };
