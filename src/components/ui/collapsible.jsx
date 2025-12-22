import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import styled from "styled-components";

// These are very thin wrappers; styling is usually handled where they are used.
const Collapsible = CollapsiblePrimitive.Root;

const StyledTrigger = styled(CollapsiblePrimitive.CollapsibleTrigger)`
  cursor: pointer;
`;

const StyledContent = styled(CollapsiblePrimitive.CollapsibleContent)`
  overflow: hidden;
`;

const CollapsibleTrigger = StyledTrigger;
const CollapsibleContent = StyledContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
