import { Breakpoint } from "@atrilabs/core";

const breakpoints: Breakpoint[] = [];
let activeBreakpoint: Breakpoint | null = null;
let referenceBreakpoint: Breakpoint | null = null;
const breakpointChangeSubscribers: (() => void)[] = [];
function addBreakpoints(newBreakpoints: Breakpoint[]) {
  breakpoints.push(...newBreakpoints);
}
function activateBreakpoint(breakpointIndex: number) {
  activeBreakpoint = breakpoints[breakpointIndex];
  breakpointChangeSubscribers.forEach((cb) => {
    try {
      cb();
    } catch (err) {
      console.log(`Failed to run a breakpoint change subscriber with err`, err);
    }
  });
}
function getBreakpoints() {
  return [...breakpoints];
}
function getActiveBreakpoint() {
  if (activeBreakpoint) {
    return activeBreakpoint;
  }
  throw Error("No breakpoint is active!");
}
function getReferenceBreakpoint() {
  if (referenceBreakpoint) {
    return referenceBreakpoint;
  }
  throw Error("No breakpoint is set as reference!");
}
function setReferenceBreakpoint(breakpointIndex: number) {
  referenceBreakpoint = breakpoints[breakpointIndex];
}
function subscribeBreakpointChange(cb: () => void) {
  breakpointChangeSubscribers.push(cb);
  return () => {
    const foundIndex = breakpointChangeSubscribers.findIndex(
      (curr) => curr === cb
    );
    if (foundIndex >= 0) {
      breakpointChangeSubscribers.splice(foundIndex, 1);
    }
  };
}

export const breakpointApi = {
  addBreakpoints,
  activateBreakpoint,
  getBreakpoints,
  getActiveBreakpoint,
  getReferenceBreakpoint,
  setReferenceBreakpoint,
  subscribeBreakpointChange,
};
