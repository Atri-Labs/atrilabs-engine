import { BrowserForestManager, useTree } from "@atrilabs/core";
import { useCallback, useEffect, useState } from "react";
import ComponentTreeId from "@atrilabs/app-design-forest/src/componentTree?id";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import AttributesTreeId from "@atrilabs/app-design-forest/src/attributesTree?id";
import { PatchEvent } from "@atrilabs/forest";
import { api } from "@atrilabs/pwa-builder-manager";


export const useManageAttrs = (id: string | null) => {
  const compTree = useTree(ComponentTreeId);
  console.log("comp tree in attri layer",compTree)
  const attributesTree = useTree(AttributesTreeId);
  console.log("attributesPropsTree", attributesTree, AttributesTreeId);

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
      const unsub = currentForest.subscribeForest((update) => {
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
      return unsub;
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
  //
   return { patchCb, attrs };
};
