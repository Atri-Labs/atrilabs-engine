import { Breakpoint, ComponentCoordsWM } from "@atrilabs/canvas-runtime";

// ================== body ===============================
export function lrtbSort(coords: ComponentCoordsWM[]) {
  coords.sort((a, b) => {
    const topDiff = a.topWM - b.topWM;
    if (topDiff === 0) {
      return a.leftWM - b.leftWM;
    }
    return topDiff;
  });
  return coords;
}

export function getEffectiveBreakpointWidths(
  canvasBreakpoint: Breakpoint,
  breakpoints: { [maxWidth: string]: { property: { styles: any } } }
) {
  const effectiveBreapointWidths = Object.keys(breakpoints).filter(
    (currMax) => {
      return parseInt(currMax) >= canvasBreakpoint.max;
    }
  );
  return effectiveBreapointWidths.sort((a, b) => {
    return parseInt(b) - parseInt(a);
  });
}

export function getEffectiveStyle(
  canvasBreakpoint: Breakpoint,
  breakpoints: { [maxWidth: string]: { property: { styles: any } } },
  styles: any
) {
  const effectiveBreakpointWidths = getEffectiveBreakpointWidths(
    canvasBreakpoint,
    breakpoints
  );
  let effectiveStyle = { ...styles };
  effectiveBreakpointWidths.forEach((curr) => {
    effectiveStyle = {
      ...effectiveStyle,
      ...breakpoints[curr].property.styles,
    };
  });
  return effectiveStyle;
}
