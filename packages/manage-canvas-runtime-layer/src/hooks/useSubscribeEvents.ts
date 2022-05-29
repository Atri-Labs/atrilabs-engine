import { useEffect } from "react";
import {
  BrowserForestManager,
  manifestRegistryController,
  useTree,
} from "@atrilabs/core";
import ReactComponentManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { createComponent } from "@atrilabs/canvas-runtime";
import type { WireUpdate } from "@atrilabs/forest";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";

export const useSubscribeEvents = () => {
  const tree = useTree(ComponentTreeId);

  useEffect(() => {
    const currentForest = BrowserForestManager.currentForest;
    currentForest.subscribeForest((update) => {
      if (update.type === "wire") {
        const id = (update as WireUpdate).id;
        const node = tree.nodes[id]!;
        const meta = node.meta;
        const manifestSchemaId = meta.manifestSchemaId;
        const pkg = meta.pkg;
        const key = meta.key;
        const parent = node.state.parent;
        if (manifestSchemaId === ReactComponentManifestSchemaId) {
          // find manifest from manifest registry
          const manifestRegistry =
            manifestRegistryController.readManifestRegistry();
          const manifest = manifestRegistry[manifestSchemaId].components.find(
            (curr) => {
              return curr.pkg === pkg && curr.component.meta.key === key;
            }
          );
          // use CanvasAPI to create component
          if (manifest) {
            const component = manifest.component;
            createComponent(
              id,
              component.comp,
              component.props,
              parent,
              // TODO: get decorators from manifest schema
              [],
              // TODO: create catchers from manifest schema
              []
            );
          }
        }
      }
    });
  }, [tree]);
};
