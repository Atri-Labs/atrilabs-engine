import { subscribeCanvasActivity } from "@atrilabs/canvas-runtime";
import { useEffect } from "react";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import { PatchEvent } from "@atrilabs/forest";
import {
  api,
  BrowserForestManager,
  manifestRegistryController,
  useTree,
} from "@atrilabs/core";
import { getComponentIndex, getComponentIndexInsideBody } from "../utils";

export const useSubscribeReDrop = () => {
  const tree = useTree(ComponentTreeId);
  useEffect(() => {
    const unsub = subscribeCanvasActivity("dragEnd", (context) => {
      // find manifest from manifest registry
      const manifestRegistry =
        manifestRegistryController.readManifestRegistry();
      if (context.finalDropzone && context.dragged) {
        const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
        const forestId = BrowserForestManager.currentForest.forestId;
        const childId = context.dragged.id;
        const newParentId = context.finalDropzone.id;
        const loc = context.finalDropzone.loc;
        let index = 0;
        if (newParentId === "body") {
          index = getComponentIndexInsideBody(loc);
        } else {
          index = getComponentIndex(tree, newParentId, loc, manifestRegistry);
        }
        const patchEvent: PatchEvent = {
          type: `PATCH$$${ComponentTreeId}`,
          id: childId,
          slice: {
            parent: { id: newParentId, index },
          },
        };
        api.postNewEvents(forestPkgId, forestId, {
          events: [patchEvent],
          meta: {
            agent: "browser",
          },
          name: "REDROP",
        });
      }
    });
    return unsub;
  }, [tree]);
};
