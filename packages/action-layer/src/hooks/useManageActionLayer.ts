import {
  api,
  BrowserForestManager,
  manifestRegistryController,
  useTree,
} from "@atrilabs/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import CallbackTreeId from "@atrilabs/app-design-forest/lib/callbackHandlerTree?id";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import {
  CallbackHandler,
  ReactComponentManifestSchema,
} from "@atrilabs/react-component-manifest-schema/lib/types";
import { PatchEvent } from "@atrilabs/forest";

function getFileUploadManifests() {
  const fileUploadManifests: { pkg: string; key: string }[] = [];
  const registry = manifestRegistryController.readManifestRegistry();
  registry[ReactManifestSchemaId].components.forEach((manifest) => {
    const component: ReactComponentManifestSchema = manifest.component;
    if (component.dev.ioProps) {
      Object.keys(component.dev.ioProps).forEach((propName) => {
        Object.keys(component.dev.ioProps![propName]).forEach((key) => {
          const ioProp = component.dev.ioProps![propName][key];
          if (ioProp.mode === "upload" && ioProp.type === "files") {
            fileUploadManifests.push({
              pkg: manifest.pkg,
              key: component.meta.key,
            });
          }
        });
      });
    }
  });
  return fileUploadManifests;
}

function getComponentManifest(key: string) {
  const registry = manifestRegistryController.readManifestRegistry();
  const manifest = registry[ReactManifestSchemaId].components.find(
    (manifest) => {
      const manifestComp = manifest.component as ReactComponentManifestSchema;
      return manifestComp.meta.key === key;
    }
  );
  return manifest?.component as ReactComponentManifestSchema;
}

export const useManageActionLayer = (id: string | null) => {
  const compTree = useTree(ComponentTreeId);
  const callbackTree = useTree(CallbackTreeId);
  const [callbacks, setCallbacks] = useState<{
    [callbackName: string]: CallbackHandler;
  }>({});
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
        const callbackNodeLink = callbackTree.links[id];
        if (callbackNodeLink) {
          const patchEvent: PatchEvent = {
            type: `PATCH$$${CallbackTreeId}`,
            slice,
            id: callbackNodeLink.childId,
          };
          api.postNewEvent(forestPkgId, forestId, patchEvent);
        }
      }
    },
    [id, compTree, callbackTree]
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
          if (update.treeId === CallbackTreeId) {
            const callbackLink = callbackTree.links[id];
            const callbackNodeId = callbackLink.childId;
            setCallbacks({
              ...callbackTree.nodes[callbackNodeId].state.property.callbacks,
            });
          }
        }
      });
      return unsub;
    }
  }, [id, compTree, callbackTree]);

  // get file upload aliases
  useEffect(() => {
    // fetch values everytime id changes
    if (
      id &&
      compTree.nodes[id] &&
      compTree.nodes[id].meta.manifestSchemaId === ReactManifestSchemaId
    ) {
      const callbackNodeLink = callbackTree.links[id];
      if (callbackNodeLink)
        setCallbacks({
          ...callbackTree.nodes[callbackNodeLink.childId].state.property
            .callbacks,
        });
    }
  }, [id, compTree, callbackTree]);
  // get all components from manifest registry with ioProps field set
  const [fileUploadManifests, setFileUploadManifests] = useState<
    { pkg: string; key: string }[]
  >([]);
  useEffect(() => {
    const fileUploadManifests = getFileUploadManifests();
    setFileUploadManifests(fileUploadManifests);

    manifestRegistryController.subscribe(() => {
      const fileUploadManifests = getFileUploadManifests();
      setFileUploadManifests(fileUploadManifests);
    });
  }, []);
  // get alias of all components with pkg and key in fileUploadManifests
  const fileUploadAliases = useMemo(() => {
    const aliases: string[] = [];
    const nodeIds = Object.keys(compTree.nodes);
    nodeIds.forEach((nodeId) => {
      const { key, pkg } = compTree.nodes[nodeId].meta;
      const { alias } = compTree.nodes[nodeId].state.alias;
      if (key && pkg && alias) {
        const found = fileUploadManifests.find((manifest) => {
          return manifest.pkg === pkg && manifest.key === key;
        });
        if (found) {
          aliases.push(alias);
        }
      }
    });
    return aliases;
  }, [fileUploadManifests, compTree]);

  // get all page routes
  const routes = useMemo(() => {
    const routes: string[] = [];
    const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
    api.getPages(forestPkgId, (pages) => {
      const pageIds = Object.keys(pages);
      pageIds.forEach((pageId) => {
        routes.push(pages[pageId].route);
      });
    });
  }, []);

  // get all callbacks associated with component from manifest
  const callbackNames = useMemo(() => {
    if (id) {
      const compNode = compTree.nodes[id];
      if (compNode.meta && compNode.meta.key)
        getComponentManifest(compNode.meta.key);
    }
  }, [id, compTree]);

  return { patchCb, callbacks, fileUploadAliases, routes, callbackNames };
};
