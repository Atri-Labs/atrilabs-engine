import { useEffect } from "react";
import { subscribeNewDrop } from "@atrilabs/canvas-runtime";
import ReactComponentManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { getId, useTree } from "@atrilabs/core";
import {
  api,
  BrowserForestManager,
  manifestRegistryController,
} from "@atrilabs/core";
import { CreateEvent, LinkEvent, PatchEvent } from "@atrilabs/forest";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import { getComponentIndex, getComponentIndexInsideBody } from "../utils";

export const useSubscribeNewDrop = () => {
  const tree = useTree(ComponentTreeId);
  useEffect(() => {
    const unsub = subscribeNewDrop((args, loc, caughtBy) => {
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
      if (args.dragData.type === "component") {
        const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
        const forestId = BrowserForestManager.currentForest.forestId;
        const pkg = args.dragData.data.pkg;
        const key = args.dragData.data.key;
        const compId = args.dragData.data.id;
        const manifestSchemaId = args.dragData.data.manifestSchema;

        if (manifestSchemaId === ReactComponentManifestSchemaId) {
          const manifest = manifestRegistry[manifestSchemaId].components.find(
            (curr) => {
              return curr.pkg === pkg && curr.component.meta.key === key;
            }
          );
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

          // TODO: fetch a new alias using key, then emit a alias event
          api.getNewAlias(forestPkgId, key, (alias) => {
            const setAliasEvent: PatchEvent = {
              id: compId,
              type: `PATCH$$${ComponentTreeId}`,
              slice: {
                alias,
              },
            };
            api.postNewEvent(forestPkgId, forestId, setAliasEvent);
          });

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
  }, [tree]);
};
