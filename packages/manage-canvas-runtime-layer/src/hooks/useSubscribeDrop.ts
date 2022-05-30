import { useEffect } from "react";
import { subscribeDrop } from "@atrilabs/canvas-runtime";
import type { Location } from "@atrilabs/canvas-runtime";
import ReactComponentManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { getId } from "@atrilabs/core";
import { api, BrowserForestManager } from "@atrilabs/core";
import { CreateEvent } from "@atrilabs/forest";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";

function getComponentIndex(parentId: string, loc: Location): number {
  if (parentId === "body") {
    const currentForest = BrowserForestManager.currentForest;
    const tree = currentForest.tree(ComponentTreeId)!;
    const nodeIds = Object.keys(tree.nodes);
    const reverseMap: { [parentId: string]: string[] } = {};
    nodeIds.forEach((nodeId) => {
      const node = tree.nodes[nodeId]!;
      if (reverseMap[node.state.parent.id]) {
        reverseMap[node.state.parent.id].push(nodeId);
      } else {
        reverseMap[node.state.parent.id] = [nodeId];
      }
    });
    // if parentId doesn't appear in reverseMap, then it's the first child for parent
    if (reverseMap[parentId] === undefined) {
      return 0;
    } else {
      return reverseMap[parentId].length;
    }
  } else {
    // TODO: handle component with non-body parent
    return 0;
  }
}

export const useSubscribeDrop = () => {
  useEffect(() => {
    const unsub = subscribeDrop((args, loc, caughtBy) => {
      if (args.dragData.type === "component") {
        const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
        const forestId = BrowserForestManager.currentForest.forestId;
        const pkg = args.dragData.data.pkg;
        const key = args.dragData.data.key;
        const index = getComponentIndex(caughtBy, loc);
        const event: CreateEvent = {
          id: getId(),
          type: `CREATE$$${ComponentTreeId}`,
          meta: {
            pkg: pkg,
            key: key,
            manifestSchemaId: ReactComponentManifestSchemaId,
          },
          state: { parent: { id: caughtBy, index: index } },
        };
        api.postNewEvent(forestPkgId, forestId, event);
      }
    });
    return unsub;
  }, []);
};
