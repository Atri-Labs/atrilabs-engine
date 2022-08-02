import { api, BrowserForestManager, useTree } from "@atrilabs/core";
import { useCallback, useEffect, useState } from "react";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import CallbackTreeId from "@atrilabs/app-design-forest/lib/callbackHandlerTree?id";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { PatchEvent } from "@atrilabs/forest";

export const useManageActionLayer = (id: string | null) => {
  const compTree = useTree(ComponentTreeId);
  const callbackTree = useTree(CallbackTreeId);
  const [callbacks, setCallbacks] = useState<{ [callbackName: string]: {} }>(
    {}
  );
  // callback to post patch event -> takes a slice
  const patchCb = useCallback(
    (slice: any) => {
      if (
        id &&
        compTree.nodes[id] &&
        compTree.nodes[id].meta.manifestSchemaId === ReactManifestSchemaId
      ) {
        const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
        const forestId = BrowserForestManager.currentForest.forestId;
        const callbackNodeLink = callbackTree.links[id];
        if (callbackNodeLink) {
          const patchEvent: PatchEvent = {
            type: `PATCH$$${CallbackTreeId}`,
            slice,
            id: callbackNodeLink.childId,
          };
          api.postNewEvent(forestPkgId, forestId, patchEvent);
        }
      }
    },
    [id, compTree, callbackTree]
  );
  useEffect(() => {
    if (
      id &&
      compTree.nodes[id] &&
      compTree.nodes[id].meta.manifestSchemaId === ReactManifestSchemaId
    ) {
      // subscribe to forest
      const currentForest = BrowserForestManager.currentForest;
      const unsub = currentForest.subscribeForest((update) => {
        if (update.type === "change") {
          if (update.treeId === CallbackTreeId) {
            const callbackLink = callbackTree.links[id];
            const callbackNodeId = callbackLink.childId;
            setCallbacks({
              ...callbackTree.nodes[callbackNodeId].state.property.callbacks,
            });
          }
        }
      });
      return unsub;
    }
  }, [id, compTree, callbackTree]);
  useEffect(() => {
    // fetch values everytime id changes
    if (
      id &&
      compTree.nodes[id] &&
      compTree.nodes[id].meta.manifestSchemaId === ReactManifestSchemaId
    ) {
      const callbackNodeLink = callbackTree.links[id];
      if (callbackNodeLink)
        setCallbacks({
          ...callbackTree.nodes[callbackNodeLink.childId].state.property
            .callbacks,
        });
    }
  }, [id, compTree, callbackTree]);
  return { patchCb, callbacks };
};
