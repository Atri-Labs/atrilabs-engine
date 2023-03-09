import { useEffect, useState } from "react";
import { componentStoreApi } from "../../../api";
import { liveApi } from "../../../api/liveApi";

export function useLiveApi(canvasZoneId: string) {
  const [directChildrenIds, setDirectChildrenIds] = useState<string[]>([]);
  useEffect(() => {
    setDirectChildrenIds(
      componentStoreApi.getCanvasZoneChildrenId(canvasZoneId)
    );
  }, []);
  useEffect(() => {
    return liveApi.subscribeCanvasZone(canvasZoneId, () => {
      console.log("canvas zone subscribedd");
      setDirectChildrenIds(
        componentStoreApi.getCanvasZoneChildrenId(canvasZoneId)
      );
    });
  }, []);
  return { directChildrenIds };
}
