import {
  subscribeCanvasActivity,
  getComponentParent,
  raiseSelectEvent,
  getComponentRef,
} from "@atrilabs/canvas-runtime";
import { useEffect } from "react";

export const useRaiseSelect = () => {
  useEffect(() => {
    const keyupCb = (event: KeyboardEvent, parentId: string) => {
      if (event.key === "ArrowUp" && parentId) {
        raiseSelectEvent(parentId);
      }
    };
    const unsub = subscribeCanvasActivity("keyup", (context, event) => {
      if (
        event.type === "keyup" &&
        context.select?.id &&
        event.event.target === getComponentRef(context.select.id).current
      ) {
        keyupCb(event.event, getComponentParent(context.select.id).id);
      }
    });
    return unsub;
  }, []);
};
