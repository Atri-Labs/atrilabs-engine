import { useEffect, useState } from "react";
import { canvasApi, componentStoreApi } from "../../../api";

export function useCanvasZoneEventSubscriber(params: { canvasZoneId: string }) {
  const [childCompIds, setChildCompIds] = useState<string[]>([]);
  useEffect(() => {
    return canvasApi.subscribeCanvasZoneEvent(
      params.canvasZoneId,
      "new_component",
      () => {
        if (componentStoreApi.getCanvasZoneChildrenId(params.canvasZoneId))
          setChildCompIds([
            ...componentStoreApi.getCanvasZoneChildrenId(params.canvasZoneId),
          ]);
      }
    );
  }, []);
  useEffect(() => {
    return canvasApi.subscribeCanvasZoneEvent(
      params.canvasZoneId,
      "children_updated",
      () => {
        if (componentStoreApi.getCanvasZoneChildrenId(params.canvasZoneId))
          setChildCompIds([
            ...componentStoreApi.getCanvasZoneChildrenId(params.canvasZoneId),
          ]);
      }
    );
  }, []);
  useEffect(() => {
    if (componentStoreApi.getCanvasZoneChildrenId(params.canvasZoneId))
      setChildCompIds([
        ...componentStoreApi.getCanvasZoneChildrenId(params.canvasZoneId),
      ]);
  }, [params.canvasZoneId]);
  return { childCompIds };
}
