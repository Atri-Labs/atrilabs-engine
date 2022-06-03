import { useEffect } from "react";
import { subscribeNewDrop } from "@atrilabs/canvas-runtime";
import type { Location } from "@atrilabs/canvas-runtime";
import ReactComponentManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { getId } from "@atrilabs/core";
import {
  api,
  BrowserForestManager,
  manifestRegistryController,
} from "@atrilabs/core";
import { CreateEvent, LinkEvent } from "@atrilabs/forest";
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
    const unsub = subscribeNewDrop((args, loc, caughtBy) => {
      if (args.dragData.type === "component") {
        const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
        const forestId = BrowserForestManager.currentForest.forestId;
        const pkg = args.dragData.data.pkg;
        const key = args.dragData.data.key;
        const compId = args.dragData.data.id;
        const manifestSchemaId = args.dragData.data.manifestSchema;
        const index = getComponentIndex(caughtBy, loc);
        const event: CreateEvent = {
          id: compId,
          type: `CREATE$$${ComponentTreeId}`,
          meta: {
            pkg: pkg,
            key: key,
            manifestSchemaId: manifestSchemaId,
          },
          state: { parent: { id: caughtBy, index: index } },
        };
        api.postNewEvent(forestPkgId, forestId, event);

        if (manifestSchemaId === ReactComponentManifestSchemaId) {
          // find manifest from manifest registry
          const manifestRegistry =
            manifestRegistryController.readManifestRegistry();
          const manifest = manifestRegistry[manifestSchemaId].components.find(
            (curr) => {
              return curr.pkg === pkg && curr.component.meta.key === key;
            }
          );
          setTimeout(() => {
            if (manifest) {
              const component = manifest.component;
              const propsKeys = Object.keys(component.dev.attachProps);
              for (let i = 0; i < propsKeys.length; i++) {
                const propKey = propsKeys[i];
                const treeId = component.dev.attachProps[propKey].treeId;
                const initialValue =
                  component.dev.attachProps[propKey].initialValue;
                const propCompId = getId();
                const createEvent: CreateEvent = {
                  id: propCompId,
                  type: `CREATE$$${treeId}`,
                  meta: {},
                  state: {
                    parent: { id: "", index: 0 },
                    // NOTE: Introducting a convention to store node value in state's property field
                    property: { [propKey]: initialValue },
                  },
                };
                api.postNewEvent(forestPkgId, forestId, createEvent);

                const linkEvent: LinkEvent = {
                  type: `LINK$$${treeId}`,
                  refId: compId,
                  childId: propCompId,
                };
                api.postNewEvent(forestPkgId, forestId, linkEvent);
              }
            }
          }, 3000);
        }
      }
    });
    return unsub;
  }, []);
};
