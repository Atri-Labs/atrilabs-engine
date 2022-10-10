import {
  getCurrentMachineContext,
  getCurrentState,
  subscribeCanvasActivity,
} from "@atrilabs/canvas-runtime";
import { api, BrowserForestManager } from "@atrilabs/core";
import { useEffect } from "react";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import { DeleteEvent } from "@atrilabs/forest";

export const useDeleteKey = () => {
  useEffect(() => {
    let key = "Backspace";
    if (window.navigator) {
      if (window.navigator.userAgent.indexOf("Mac") < 0) {
        key = "Delete";
      }
    }
    const keyupCb = (event: KeyboardEvent) => {
      if (event.key === key) {
        const state = getCurrentState();
        const context = getCurrentMachineContext();
        if (state.valueOf().hasOwnProperty("select")) {
          const selectedId = context.select!.id;
          const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
          const forestId = BrowserForestManager.currentForest.forestId;
          const deleteEvent: DeleteEvent = {
            type: `DELETE$$${ComponentTreeId}`,
            id: selectedId,
          };
          api.postNewEvents(forestPkgId, forestId, {
            events: [deleteEvent],
            meta: {
              agent: "browser",
            },
            name: "DELETE_COMPONENT",
          });
        }
      }
    };
    const unsub = subscribeCanvasActivity("keyup", (context, event) => {
      if (event.type === "keyup") keyupCb(event.event);
    });
    return unsub;
  }, []);
};
