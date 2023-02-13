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
          setChildCompIds(
            componentStoreApi.getCanvasZoneChildrenId(params.canvasZoneId)
          );
      }
    );
  }, []);
  return { childCompIds };
}
