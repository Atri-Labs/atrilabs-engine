import {
  BrowserForestManager,
  manifestRegistryController,
  useTree,
} from "@atrilabs/core";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import { useCallback } from "react";
import { AnyEvent, CreateEvent } from "@atrilabs/forest";

export const useCreateTemplate = () => {
  const componentTree = useTree(ComponentTreeId);

  const createTemplate = useCallback(
    (selectedId: string) => {
      function getComponentNode(nodeId: string) {
        return componentTree.nodes[nodeId];
      }

      function getComponentPropsNodes(nodeId: string) {}

      function createReverseMap() {
        const reverseMap: { [parentId: string]: string[] } = { body: [] };
        Object.keys(componentTree.nodes).forEach((currId) => {
          const currParentId = componentTree.nodes[currId].state.parent.id;
          if (reverseMap[currParentId]) {
            reverseMap[currParentId].push(currId);
          } else {
            reverseMap[currParentId] = [currId];
          }
        });
        return reverseMap;
      }

      const reverseMap = createReverseMap();

      // selected component and all it's decendants
      const allCapturedNodes = [selectedId];
      let currIndex = 0;
      while (currIndex < allCapturedNodes.length) {
        const currId = allCapturedNodes[currIndex];
        if (reverseMap[currId]) {
          allCapturedNodes.push(...reverseMap[currId]);
        }
        currIndex++;
      }

      const events: AnyEvent[] = [];
      allCapturedNodes.reverse().forEach((currNodeId) => {
        const currNode = getComponentNode(currNodeId);
        // convert component node to events
        const event: CreateEvent = {
          id: currNode.id,
          type: `CREATE$$${ComponentTreeId}`,
          meta: currNode.meta,
          state: currNode.state,
        };
        // change parent of event if it's the top component of template
        if (event.id === selectedId) {
          event.state.parent.id = "templateRoot";
          event.state.parent.index = 0;
        }
        events.push(event);
      });

      return events;
    },
    [componentTree]
  );

  return createTemplate;
};
