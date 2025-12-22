import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";
import styled, { keyframes } from "styled-components";

import { cn } from "../../lib/utils";

const GroupRoot = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:has(:disabled) {
    opacity: 0.5;
  }
`;

const SlotRoot = styled.div`
  position: relative;
  display: flex;
  height: 2.5rem;
  width: 2.5rem;
  align-items: center;
  justify-content: center;
  border-top: 1px solid hsl(var(--input));
  border-bottom: 1px solid hsl(var(--input));
  border-right: 1px solid hsl(var(--input));
  font-size: 0.875rem;
  transition: all 0.15s ease;

  &:first-child {
    border-left: 1px solid hsl(var(--input));
    border-radius: 0.375rem 0 0 0.375rem;
  }

  &:last-child {
    border-radius: 0 0.375rem 0.375rem 0;
  }
`;

const activeRing = `
  z-index: 10;
  box-shadow: 0 0 0 2px hsl(var(--ring));
`;

const caretBlink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const CaretWrapper = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Caret = styled.div`
  height: 1rem;
  width: 1px;
  background-color: hsl(var(--foreground));
  animation: ${caretBlink} 1s step-end infinite;
`;

const SeparatorRoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SeparatorDot = styled(Dot)`
  width: 1rem;
  height: 1rem;
`;

const InputOTP = React.forwardRef(function InputOTP(
  { className, containerClassName, ...props },
  ref,
) {
  return (
    <OTPInput
      ref={ref}
      containerClassName={cn("", containerClassName)}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
});

const InputOTPGroup = React.forwardRef(function InputOTPGroup({ className, ...props }, ref) {
  return <GroupRoot ref={ref} className={cn("", className)} {...props} />;
});

const InputOTPSlot = React.forwardRef(function InputOTPSlot(
  { index, className, ...props },
  ref,
) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <SlotRoot
      ref={ref}
      className={cn(isActive ? activeRing : "", className)}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <CaretWrapper>
          <Caret />
        </CaretWrapper>
      )}
    </SlotRoot>
  );
});

const InputOTPSeparator = React.forwardRef(function InputOTPSeparator(props, ref) {
  return (
    <SeparatorRoot ref={ref} role="separator" {...props}>
      <SeparatorDot />
    </SeparatorRoot>
  );
});

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
