import { api, BrowserForestManager, useTree } from "@atrilabs/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import CallbackTreeId from "@atrilabs/app-design-forest/lib/callbackHandlerTree?id";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { CallbackHandler } from "@atrilabs/react-component-manifest-schema/lib/types";
import { PatchEvent } from "@atrilabs/forest";
import { getComponentManifest } from "../utils";

export const useManageActionLayer = (id: string | null) => {
  const compTree = useTree(ComponentTreeId);
  const callbackTree = useTree(CallbackTreeId);
  const [callbacks, setCallbacks] = useState<{
    [callbackName: string]: CallbackHandler;
  }>({});
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
          api.postNewEvents(forestPkgId, forestId, {
            events: [patchEvent],
            meta: { agent: "browser" },
            name: "ADD_ACTION",
          });
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

  // get file upload aliases
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

  // get all callbacks associated with component from manifest
  const callbackNames = useMemo(() => {
    const callbackNames: string[] = [];
    if (id) {
      const compNode = compTree.nodes[id];
      if (compNode && compNode.meta && compNode.meta.key)
        callbackNames.push(
          ...Object.keys(
            getComponentManifest(compNode.meta.key).dev.attachCallbacks
          )
        );
    }
    return callbackNames;
  }, [id, compTree]);

  const getAlias = useCallback(
    (id: string) => {
      return compTree.nodes[id].state.alias as string | undefined;
    },
    [compTree]
  );

  return {
    patchCb,
    callbacks,
    callbackNames,
    getAlias,
  };
};
