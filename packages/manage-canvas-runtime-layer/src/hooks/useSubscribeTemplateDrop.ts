import { subscribeNewDrop } from "@atrilabs/canvas-runtime";
import {
  api,
  BrowserForestManager,
  manifestRegistryController,
  useTree,
} from "@atrilabs/core";
import { useEffect } from "react";
import { getComponentIndex, getComponentIndexInsideBody } from "../utils";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import { postTemplateEvents } from "@atrilabs/canvas-runtime-utils";

export const useSubscribeTemplateDrop = () => {
  const tree = useTree(ComponentTreeId);
  useEffect(() => {
    const unsub = subscribeNewDrop((args, loc, caughtBy) => {
      if (args.dragData.type === "template") {
        // get index
        // find manifest from manifest registry
        const manifestRegistry =
          manifestRegistryController.readManifestRegistry();
        let index = 0;
        if (caughtBy === "body") {
          index = getComponentIndexInsideBody(loc);
        } else {
          // Don't process if caughtBy/parent does not belong to component tree
          if (!tree.nodes[caughtBy]) {
            return;
          }
          index = getComponentIndex(tree, caughtBy, loc, manifestRegistry);
        }

        const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
        const forestId = BrowserForestManager.currentForest.forestId;
        const { dir, name, newTemplateRootId } = args.dragData.data;

        api.getTemplateEvents(dir, name, (events) => {
          postTemplateEvents({
            forestPkgId,
            forestId,
            newTemplateRootId,
            events,
            parentId: caughtBy,
            index,
          });
        });
      }
    });
    return unsub;
  }, [tree]);
};
