import {
  BrowserForestManager,
  getId,
  manifestRegistryController,
  useTree,
} from "@atrilabs/core";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { useCallback } from "react";
import {
  AnyEvent,
  CreateEvent,
  LinkEvent,
  TreeLink,
  TreeNode,
} from "@atrilabs/forest";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import CallbackTreeId from "@atrilabs/app-design-forest/lib/callbackHandlerTree?id";

export const useCreateTemplate = () => {
  const componentTree = useTree(ComponentTreeId);
  const callbackTree = useTree(CallbackTreeId);

  const createTemplate = useCallback(
    (
      selectedId: string,
      options: { copyCallbacks: boolean; copyDefaulCallbacks: boolean }
    ) => {
      function getComponentNode(nodeId: string) {
        return componentTree.nodes[nodeId];
      }

      function getComponentManifest(compId: string) {
        const compNode = getComponentNode(compId);
        const { pkg, key } = compNode.meta;
        if (pkg && key) {
          const registry = manifestRegistryController.readManifestRegistry();
          const manifest = registry[ReactManifestSchemaId].components.find(
            (curr) => curr.pkg === pkg
          );
          return manifest;
        }
      }

      function getComponentPropsNodes(nodeId: string) {
        // refId is needed to create LINK event
        const propNodes: {
          propNode: TreeNode;
          propTreeId: string;
          link: TreeLink;
        }[] = [];
        const manifest = getComponentManifest(nodeId);
        if (manifest) {
          const manifestComponent =
            manifest.component as ReactComponentManifestSchema;
          const propNames = Object.keys(manifestComponent.dev.attachProps);
          propNames.forEach((propName) => {
            const prop = manifestComponent.dev.attachProps[propName];
            const treeId = prop.treeId;
            const propTree = BrowserForestManager.currentForest.tree(treeId);
            if (propTree) {
              const link = propTree.links[nodeId];
              if (link) {
                const propNodeId = link.childId;
                const propNode = propTree.nodes[propNodeId];
                propNodes.push({ propNode, propTreeId: treeId, link });
              }
            }
          });
        }

        return propNodes;
      }

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

      // convert nodes to events for child component first
      allCapturedNodes.reverse();

      const events: AnyEvent[] = [];

      // convert prop nodes to events first
      allCapturedNodes.forEach((currNodeId) => {
        if (currNodeId === "body") {
          return;
        }
        const propNodes = getComponentPropsNodes(currNodeId);
        propNodes.forEach(({ propNode, propTreeId, link }) => {
          // create CreateEvent and LinkEvent
          const createEvent: CreateEvent = {
            type: `CREATE$$${propTreeId}`,
            id: propNode.id,
            meta: propNode.meta,
            state: propNode.state,
          };
          events.push(createEvent);
          const linkEvent: LinkEvent = {
            type: `LINK$$${propTreeId}`,
            ...link,
          };
          events.push(linkEvent);
        });
      });

      // convert callback nodes to events
      if (options.copyCallbacks) {
        allCapturedNodes.forEach((currNodeId) => {
          const callbackLink = callbackTree.links[currNodeId];
          if (callbackLink) {
            const callbackNode = callbackTree.nodes[callbackLink.childId];
            const callbackCompId = getId();
            const callbackCreateEvent: CreateEvent = {
              id: callbackCompId,
              type: `CREATE$$${CallbackTreeId}`,
              meta: callbackNode.meta,
              state: JSON.parse(JSON.stringify(callbackNode.state)),
            };
            events.push(callbackCreateEvent);
            const callbackLinkEvent: LinkEvent = {
              type: `LINK$$${CallbackTreeId}`,
              refId: currNodeId,
              childId: callbackCompId,
            };
            events.push(callbackLinkEvent);
          }
        });
      }

      // convert defaultCallbackHandlers to events
      if (options.copyDefaulCallbacks) {
        allCapturedNodes.forEach((currNodeId) => {
          if (currNodeId === "body") {
            return;
          }
          const manifest = getComponentManifest(currNodeId)!;
          const component = manifest.component as ReactComponentManifestSchema;
          const defaultCallbacks = component.dev.defaultCallbackHandlers;
          const callbackCompId = getId();
          const callbackCreateEvent: CreateEvent = {
            id: callbackCompId,
            type: `CREATE$$${CallbackTreeId}`,
            meta: {},
            state: {
              parent: { id: "", index: 0 },
              // NOTE: Following a convention to store node value in state's property field
              property: { callbacks: defaultCallbacks },
            },
          };
          events.push(callbackCreateEvent);
          const callbackLinkEvent: LinkEvent = {
            type: `LINK$$${CallbackTreeId}`,
            refId: currNodeId,
            childId: callbackCompId,
          };
          events.push(callbackLinkEvent);
        });
      }

      // convert component nodes to events at last
      allCapturedNodes.forEach((currNodeId) => {
        if (currNodeId === "body") {
          return;
        }
        const currNode = getComponentNode(currNodeId);
        // convert component node to events
        const event: CreateEvent = {
          id: currNode.id,
          type: `CREATE$$${ComponentTreeId}`,
          meta: currNode.meta,
          // we are going to override
          state: currNode.state,
        };
        // change parent of event if it's the top component of template
        if (event.id === selectedId) {
          // JSONify to prevent overriding the original node
          event.state = JSON.parse(JSON.stringify(event.state));
          event.state.parent.id = "templateRoot";
          event.state.parent.index = 0;
        }
        events.push(event);
      });

      return events;
    },
    [componentTree, callbackTree]
  );

  return createTemplate;
};
