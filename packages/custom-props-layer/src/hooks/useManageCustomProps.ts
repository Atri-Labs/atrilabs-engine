import {
  api,
  BrowserForestManager,
  manifestRegistryController,
  useTree,
} from "@atrilabs/core";
import React, { useCallback, useEffect, useState } from "react";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import customPropsTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { PatchEvent } from "@atrilabs/forest";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import {
  getComponentProps,
  updateComponentProps,
} from "@atrilabs/canvas-runtime";

export const useManageCustomProps = (id: string | null) => {
  const compTree = useTree(ComponentTreeId);
  const customPropsTree = useTree(customPropsTreeId);
  const [customProps, setCustomProps] = useState<React.CSSProperties>({});
  const [treeOptions, setTreeOptions] = useState<
    | ReactComponentManifestSchema["dev"]["attachProps"]["0"]["treeOptions"]
    | null
  >(null);
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
        const cssNodeId = customPropsTree.links[id];
        if (cssNodeId) {
          const patchEvent: PatchEvent = {
            type: `PATCH$$${customPropsTreeId}`,
            slice,
            id: cssNodeId.childId,
          };
          api.postNewEvent(forestPkgId, forestId, patchEvent);
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
          if (update.treeId === customPropsTreeId) {
            const cssNode = customPropsTree.links[id];
            const cssNodeId = cssNode.childId;
            setCustomProps({
              ...customPropsTree.nodes[cssNodeId].state.property.custom,
            });
            // tranform it into props
            const props = customPropsTree.nodes[cssNodeId].state.property;
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
      const cssNodeId = customPropsTree.links[id];
      if (cssNodeId)
        setCustomProps(
          customPropsTree.nodes[cssNodeId.childId].state.property.custom
        );
    }
  }, [id, compTree, customPropsTree]);
  useEffect(() => {
    // find component registry
    if (
      id &&
      compTree.nodes[id] &&
      compTree.nodes[id].meta.manifestSchemaId === ReactManifestSchemaId
    ) {
      const pkg = compTree.nodes[id].meta.pkg;
      const key = compTree.nodes[id].meta.key;
      const manifestRegistry =
        manifestRegistryController.readManifestRegistry();
      const manifest = manifestRegistry[ReactManifestSchemaId].components.find(
        (curr) => {
          return curr.pkg === pkg && curr.component.meta.key === key;
        }
      );
      if (manifest) {
        const manifestComponent: ReactComponentManifestSchema =
          manifest.component;
        if (manifestComponent.dev.attachProps["custom"]) {
          const treeOptions =
            manifestComponent.dev.attachProps["custom"].treeOptions;
          setTreeOptions(treeOptions);
        }
      }
    }
  }, [id, compTree]);
  return { patchCb, customProps, treeOptions };
};
