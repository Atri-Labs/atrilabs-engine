import { Breakpoint } from "@atrilabs/core";
import { breakpointApi } from "@atrilabs/pwa-builder-manager";
import { useState, useEffect } from "react";

export function useGetActiveBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null);
  useEffect(() => {
    try {
      setBreakpoint(breakpointApi.getActiveBreakpoint());
    } catch (err) {}
  }, []);
  useEffect(() => {
    return breakpointApi.subscribeBreakpointChange(() => {
      setBreakpoint(breakpointApi.getActiveBreakpoint());
    });
  }, []);
  return { breakpoint };
}
