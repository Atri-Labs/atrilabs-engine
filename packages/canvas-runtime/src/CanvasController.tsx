import React, { useEffect } from "react";
import { Breakpoint } from "./types";

export type CanvasControllerProps = {
  // null to set desktop
  breakpoint: Breakpoint | null;
};

// null for desktop breakpoint
let currentBreakpoint: Breakpoint | null = null;

const breakpointPointSubscribers: ((point: Breakpoint | null) => void)[] = [];
export const subscribeBreakpointChange = (
  cb: (point: Breakpoint | null) => void
) => {
  breakpointPointSubscribers.push(cb);
  return {
    unsub: () => {
      const index = breakpointPointSubscribers.findIndex((curr) => curr === cb);
      if (index >= 0) {
        breakpointPointSubscribers.slice(index, 1);
      }
    },
    value: currentBreakpoint,
  };
};

// set breakpoint using CanvasController React.FC
export const CanvasController: React.FC<CanvasControllerProps> = (props) => {
  useEffect(() => {
    currentBreakpoint = props.breakpoint;
    breakpointPointSubscribers.forEach((sub) => {
      sub(currentBreakpoint);
    });
  }, [props.breakpoint]);
  return <></>;
};

export function getCurrentBreakpoint() {
  return currentBreakpoint;
}
