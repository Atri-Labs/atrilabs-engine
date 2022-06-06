import {
  api,
  BrowserForestManager,
  manifestRegistryController,
  useTree,
} from "@atrilabs/core";
import React, { useCallback, useEffect, useState } from "react";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import cssTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { PatchEvent } from "@atrilabs/forest";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/index";
import {
  getComponentProps,
  updateComponentProps,
} from "@atrilabs/canvas-runtime";

export const useManageCSS = (id: string | null) => {
  const compTree = useTree(ComponentTreeId);
  const cssTree = useTree(cssTreeId);
  const [styles, setStyles] = useState<React.CSSProperties>({});
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
        const cssNodeId = cssTree.links[id];
        if (cssNodeId) {
          const patchEvent: PatchEvent = {
            type: `PATCH$$${cssTreeId}`,
            slice,
            id: cssNodeId.childId,
          };
          api.postNewEvent(forestPkgId, forestId, patchEvent);
        }
      }
    },
    [id, compTree, cssTree]
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
          if (update.treeId === cssTreeId) {
            const cssNode = cssTree.links[id];
            const cssNodeId = cssNode.childId;
            setStyles({ ...cssTree.nodes[cssNodeId].state.property.styles });
            // tranform it into props
            const props = cssTree.nodes[cssNodeId].state.property;
            if (props) {
              const oldProps = getComponentProps(id);
              updateComponentProps(id, { ...oldProps, ...props });
            }
          }
        }
      });
      return unsub;
    }
  }, [id, compTree, cssTree]);
  useEffect(() => {
    // fetch values everytime id changes
    if (
      id &&
      compTree.nodes[id] &&
      compTree.nodes[id].meta.manifestSchemaId === ReactManifestSchemaId
    ) {
      const cssNodeId = cssTree.links[id];
      if (cssNodeId)
        setStyles(cssTree.nodes[cssNodeId.childId].state.property.styles);
    }
  }, [id, compTree, cssTree]);
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
        const treeOptions =
          manifestComponent.dev.attachProps["styles"].treeOptions;
        setTreeOptions(treeOptions);
      }
    }
  }, [id, compTree]);
  return { patchCb, styles, treeOptions };
};
