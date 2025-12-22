import { GripVertical } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";
import styled from "styled-components";

import { cn } from "../../lib/utils";

const GroupRoot = styled(ResizablePrimitive.PanelGroup)`
  display: flex;
  height: 100%;
  width: 100%;

  &[data-panel-group-direction="vertical"] {
    flex-direction: column;
  }
`;

const HandleRoot = styled(ResizablePrimitive.PanelResizeHandle)`
  position: relative;
  display: flex;
  width: 1px;
  align-items: center;
  justify-content: center;
  background-color: hsl(var(--border));
  outline: none;

  &[data-panel-group-direction="vertical"] {
    height: 1px;
    width: 100%;
  }

  &:focus-visible {
    box-shadow: 0 0 0 1px hsl(var(--ring));
  }
`;

const HandleBar = styled.div`
  position: absolute;
  inset-block: 0;
  left: 50%;
  width: 0.25rem;
  transform: translateX(-50%);

  [data-panel-group-direction="vertical"] & {
    left: 0;
    width: 100%;
    height: 0.25rem;
    transform: translateY(-50%);
  }
`;

const HandleGrip = styled.div`
  z-index: 10;
  display: flex;
  height: 1rem;
  width: 0.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--border));

  svg {
    width: 0.625rem;
    height: 0.625rem;
  }

  [data-panel-group-direction="vertical"] & {
    transform: rotate(90deg);
  }
`;

const ResizablePanelGroup = ({ className, ...props }) => (
  <GroupRoot className={cn("", className)} {...props} />
);

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({ withHandle, className, ...props }) => (
  <HandleRoot className={cn("", className)} {...props}>
    <HandleBar />
    {withHandle && (
      <HandleGrip>
        <GripVertical />
      </HandleGrip>
    )}
  </HandleRoot>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };

