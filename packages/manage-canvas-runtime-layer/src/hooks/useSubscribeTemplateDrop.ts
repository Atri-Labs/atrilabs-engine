import { subscribeNewDrop } from "@atrilabs/canvas-runtime";
import {
  api,
  BrowserForestManager,
  getId,
  manifestRegistryController,
  useTree,
} from "@atrilabs/core";
import { useEffect } from "react";
import { getComponentIndex, getComponentIndexInsideBody } from "../utils";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import { CreateEvent, LinkEvent } from "@atrilabs/forest";

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

        const { dir, name } = args.dragData.data;
        api.getTemplateEvents(dir, name, (events) => {
          const replacementIdMap: { [oldId: string]: string } = {};
          function createOrReturnNew(oldId: string) {
            if (replacementIdMap[oldId]) {
              return replacementIdMap[oldId];
            } else {
              const newId = getId();
              replacementIdMap[oldId] = newId;
              return newId;
            }
          }
          events.forEach((event) => {
            if (event.type.match(/^CREATE/)) {
              const createEvent = event as CreateEvent;
              // replace all components with new id
              createEvent.id = createOrReturnNew(createEvent.id);
              if (createEvent.state.parent.id === "templateRoot") {
                // change parent of top template component with caughtBy
                createEvent.state.parent = { id: caughtBy, index };
              } else {
                // create or return new id replacement for old id
                createEvent.state.parent.id = createOrReturnNew(
                  createEvent.state.parent.id
                );
              }
            }
            if (event.type.match(/^LINK/)) {
              const linkEvent = event as LinkEvent;
              linkEvent.childId = createOrReturnNew(linkEvent.childId);
              linkEvent.refId = createOrReturnNew(linkEvent.refId);
            }
            const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
            const forestId = BrowserForestManager.currentForest.forestId;
            api.postNewEvent(forestPkgId, forestId, event);
          });
        });
      }
    });
    return unsub;
  }, [tree]);
};
