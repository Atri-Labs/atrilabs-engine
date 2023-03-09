import { useEffect } from "react";
import { liveApi } from "../../../api/liveApi";

export function useLiveApi(canvasZoneId: string) {
  useEffect(() => {
    liveApi.subscribeCanvasZone(canvasZoneId, () => {
      console.log("canvas zone subscribed");
    });
  }, []);
}
