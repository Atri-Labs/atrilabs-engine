import { useEffect, useState } from "react";
import { subscribeBreakpointChange } from "../CanvasController";
import { Breakpoint } from "../types";

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null);
  useEffect(() => {
    const { unsub, value } = subscribeBreakpointChange((point) => {
      setBreakpoint(point);
    });
    setBreakpoint(value);
    return unsub;
  }, []);
  return breakpoint;
};
