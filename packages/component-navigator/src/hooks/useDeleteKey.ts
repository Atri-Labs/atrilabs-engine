import { api, BrowserForestManager } from "@atrilabs/core";
import { useEffect } from "react";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import { DeleteEvent } from "@atrilabs/forest";
import { NavigatorNode } from "../types";

/**
 * keyupCb returns a event handler for keyboard event. It handles the delete key and delete the selected node if exists
 * @param selectedNode the selected node to be deleted
 * @param removeMarginOverlay function to remove the margin overlay in canvas once a node is deleted in component navigator
 * @param deleteKey key string denoting a delete key
 * @returns handler that listens to delete events and deletes the selected node
 */
const keyupCb =
  (
    selectedNode: NavigatorNode | null,
    removeMarginOverlay: () => void,
    deleteKey: string
  ) =>
  (event: KeyboardEvent) => {
    if (!selectedNode) {
      return;
    }
    if (event.key !== deleteKey) {
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

/**
 * useDeleteKey captures the delete key event and deletes the selected node in the navigator as well as from canvas
 * @param selectedNode the selected node to be deleted
 * @param removeMarginOverlay function to remove the margin overlay in canvas once a node is deleted in component navigator
 */
export const useDeleteKey = (
  selectedNode: NavigatorNode | null,
  removeMarginOverlay: () => void
) => {
  useEffect(() => {
    //handling for delete key in mac
    let key = "Backspace";
    if (window.navigator) {
      if (!window.navigator.userAgent.indexOf("Mac")) {
        key = "Delete";
      }
    }
    let keyup = keyupCb(selectedNode, removeMarginOverlay, key);
    window.addEventListener("keyup", keyup);
    return () => {
      window.removeEventListener("keyup", keyup);
    };
  }, [selectedNode, removeMarginOverlay]);
};
