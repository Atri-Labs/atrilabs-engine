import { useRef } from "react";

export function useOpenClose() {
  const openCloseMap = useRef<{ [compId: string]: boolean }>({});
  const canvasOpenOrCloseMap = useRef<{ [canvasZoneId: string]: boolean }>({});
  return {
    openOrCloseMap: openCloseMap.current,
    canvasOpenOrCloseMap: canvasOpenOrCloseMap.current,
  };
}
