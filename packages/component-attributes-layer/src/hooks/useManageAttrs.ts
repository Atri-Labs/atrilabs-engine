import { BrowserForestManager, useTree } from "@atrilabs/core";
import { useCallback, useEffect, useState } from "react";
import { Id as ComponentTreeId } from "@atrilabs/app-design-forest/src/componentTree";
import { Id as ReactManifestSchemaId } from "@atrilabs/react-component-manifest-schema";
import { Id as AttributesTreeId } from "@atrilabs/app-design-forest/src/attributesTree";
import { PatchEvent } from "@atrilabs/forest";
import { api } from "@atrilabs/pwa-builder-manager";

export const useManageAttrs = (id: string | null) => {
  const compTree = useTree(ComponentTreeId);
  const attributesTree = useTree(AttributesTreeId);

  const [attrs, setAttrs] = useState<any>({});
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
        const attributesTreeNodeId = attributesTree.links[id];

        if (attributesTreeNodeId) {
          const patchEvent: PatchEvent = {
            type: `PATCH$$${AttributesTreeId}`,
            slice,
            id: attributesTreeNodeId.childId,
          };
          api.postNewEvents(forestPkgId, forestId, {
            events: [patchEvent],
            meta: {
              agent: "browser",
            },
            name: "CHANGE_ATTRS",
          });
        }
      }
    },
    [id, compTree, attributesTree]
  );

  useEffect(() => {
    if (
      id &&
      compTree.nodes[id] &&
      compTree.nodes[id].meta.manifestSchemaId === ReactManifestSchemaId
    ) {
      // subscribe to forest
      const currentForest = BrowserForestManager.currentForest;
      return currentForest.subscribeForest((update) => {
        if (update.type === "change") {
          if (update.treeId === AttributesTreeId) {
            const attrsNodeLink = attributesTree.links[id];
            const attrsNodeId = attrsNodeLink.childId;
            setAttrs({
              ...attributesTree.nodes[attrsNodeId].state.property.attrs,
            });
          }
        }
      });
    }
  }, [id, compTree, attributesTree]);

  useEffect(() => {
    // fetch values everytime id changes
    if (
      id &&
      compTree.nodes[id] &&
      compTree.nodes[id].meta.manifestSchemaId === ReactManifestSchemaId
    ) {
      const attrsNodeId = attributesTree.links[id];
      if (attrsNodeId)
        setAttrs(
          attributesTree.nodes[attrsNodeId.childId].state.property.attrs
        );
    }
  }, [id, compTree, attributesTree]);

  return { patchCb, attrs };
};
