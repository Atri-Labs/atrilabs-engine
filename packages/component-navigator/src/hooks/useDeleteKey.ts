import { api, BrowserForestManager } from "@atrilabs/core";
import { useEffect } from "react";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import { DeleteEvent } from "@atrilabs/forest";
import { NavigatorNode } from "../types";

export const useDeleteKey = (
  selectedNode: NavigatorNode | null,
  removeMarginOverlay: () => void
) => {
  useEffect(() => {
    let key = "Backspace";
    if (window.navigator) {
      if (!window.navigator.userAgent.indexOf("Mac")) {
        key = "Delete";
      }
    }
    const keyupCb = (event: KeyboardEvent) => {
      if (!selectedNode) {
        return;
      }
      if (event.key !== key) {
        return;
      }
      const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
      const forestId = BrowserForestManager.currentForest.forestId;
      const deleteEvent: DeleteEvent = {
        type: `DELETE$$${ComponentTreeId}`,
        id: selectedNode.id,
      };
      api.postNewEvents(forestPkgId, forestId, {
        events: [deleteEvent],
        meta: {
          agent: "browser",
        },
        name: "DELETE_COMPONENT",
      });
      removeMarginOverlay();
    };
    window.addEventListener("keyup", keyupCb);
    return () => {
      window.removeEventListener("keyup", keyupCb);
    };
  }, [selectedNode]);
};
