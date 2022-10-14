import { api, BrowserForestManager, useTree } from "@atrilabs/core";
import { useCallback, useEffect, useState } from "react";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import CustomPropsTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { PatchEvent } from "@atrilabs/forest";
import {
  getComponentProps,
  updateComponentProps,
} from "@atrilabs/canvas-runtime";

export const useManageCustomProps = (id: string | null) => {
  const compTree = useTree(ComponentTreeId);
  const customPropsTree = useTree(CustomPropsTreeId);
  const [customProps, setCustomProps] = useState<any>({});
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
        const customPropsNodeId = customPropsTree.links[id];
        if (customPropsNodeId) {
          const patchEvent: PatchEvent = {
            type: `PATCH$$${CustomPropsTreeId}`,
            slice,
            id: customPropsNodeId.childId,
          };
          api.postNewEvents(forestPkgId, forestId, {
            events: [patchEvent],
            meta: {
              agent: "browser",
            },
            name: "CHANGE_CUSTOM_PROPS",
          });
        }
      }
    },
    [id, compTree, customPropsTree]
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
          if (update.treeId === CustomPropsTreeId) {
            const customPropsNodeLink = customPropsTree.links[id];
            const customPropsNodeId = customPropsNodeLink.childId;
            setCustomProps({
              ...customPropsTree.nodes[customPropsNodeId].state.property.custom,
            });
            // tranform it into props
            const props =
              customPropsTree.nodes[customPropsNodeId].state.property;
            if (props) {
              const oldProps = getComponentProps(id);
              updateComponentProps(id, { ...oldProps, ...props });
            }
          }
        }
      });
      return unsub;
    }
  }, [id, compTree, customPropsTree]);
  useEffect(() => {
    // fetch values everytime id changes
    if (
      id &&
      compTree.nodes[id] &&
      compTree.nodes[id].meta.manifestSchemaId === ReactManifestSchemaId
    ) {
      const customNodeId = customPropsTree.links[id];
      if (customNodeId)
        setCustomProps(
          customPropsTree.nodes[customNodeId.childId].state.property.custom
        );
    }
  }, [id, compTree, customPropsTree]);
  return { patchCb, customProps };
};
