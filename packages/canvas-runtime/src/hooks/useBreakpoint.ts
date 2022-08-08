import { useEffect, useState } from "react";
import { subscribeBreakpointChange } from "../CanvasController";
import { Breakpoint } from "../types";

const desktopBreakpoint = { max: 1200, min: 900 };

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(desktopBreakpoint);
  useEffect(() => {
    const { unsub, value } = subscribeBreakpointChange((point) => {
      if (point) setBreakpoint(point);
      else setBreakpoint(desktopBreakpoint);
    });
    if (value) setBreakpoint(value);
    else setBreakpoint(desktopBreakpoint);
    return unsub;
  }, []);
  return breakpoint;
};
