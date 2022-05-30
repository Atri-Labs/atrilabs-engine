import { useEffect } from "react";
import {
  BrowserForestManager,
  manifestRegistryController,
  useTree,
} from "@atrilabs/core";
import ReactComponentManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { clearCanvas, createComponent } from "@atrilabs/canvas-runtime";
import type { LinkUpdate, WireUpdate } from "@atrilabs/forest";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import CssTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";

export const useSubscribeEvents = () => {
  const tree = useTree(ComponentTreeId);

  useEffect(() => {
    const currentForest = BrowserForestManager.currentForest;
    const unsub = currentForest.subscribeForest((update) => {
      if (update.type === "wire") {
        const wireUpdate = update as WireUpdate;
        // skip update if some other tree in the current forest is updated
        // for example, update may be in cssTree
        if (wireUpdate.treeId !== ComponentTreeId) {
          return;
        }
        const id = wireUpdate.id;
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
            const propsKeys = Object.keys(component.dev.attachProps);
            const props: { [key: string]: any } = {};
            for (let i = 0; i < propsKeys.length; i++) {
              const propKey = propsKeys[i];
              const treeId = component.dev.attachProps[propKey].treeId;
              const tree = BrowserForestManager.getForest(
                currentForest.forestPkgId,
                currentForest.forestId
              )?.tree(treeId);
              if (tree) {
                if (tree.links[id] && tree.links[id].childId) {
                  const propNodeId = tree.links[id].childId;
                  const value = tree.nodes[propNodeId].state.property;
                  props[propKey] = value;
                }
              }
            }
            console.log("Created props during create event", props);
            createComponent(
              id,
              component.render.comp,
              props,
              parent,
              // TODO: get decorators from manifest
              [],
              // TODO: create catchers from manifest
              [],
              // TODO: get acceptsChild from manifest
              false
            );
          }
        }
      }

      if (update.type === "link") {
        const linkUpdate = update as LinkUpdate;
        if (linkUpdate.rootTreeId === ComponentTreeId) {
          const treeId = linkUpdate.treeId;
          const compId = linkUpdate.refId;
          const propId = linkUpdate.childId;
          const node = tree.nodes[compId]!;
          const meta = node.meta;
          const manifestSchemaId = meta.manifestSchemaId;
          const pkg = meta.pkg;
          const key = meta.key;
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
              const propsKeys = Object.keys(component.dev.attachProps);
              let props: { [key: string]: any } = {};
              for (let i = 0; i < propsKeys.length; i++) {
                const propKey = propsKeys[i];
                if (component.dev.attachProps[propKey].treeId !== CssTreeId) {
                  console.log(
                    `Some other tree than cssTree`,
                    component.dev.attachProps[propKey].treeId
                  );
                  return;
                }
                const tree = BrowserForestManager.getForest(
                  currentForest.forestPkgId,
                  currentForest.forestId
                )?.tree(treeId);
                if (tree) {
                  if (
                    tree.links[compId] &&
                    tree.links[compId].childId === propId
                  ) {
                    const value = tree.nodes[propId].state.property;
                    props = value;
                  }
                }
              }
              console.log("Created props during link event", props);
            }
          }
        }
      }
    });
    return unsub;
  }, [tree]);

  useEffect(() => {
    const currentForest = BrowserForestManager.currentForest;
    // TODO
    // if currentForest is already set when this hook is called,
    // then, send all the event to the canvas

    // handle when current forest is changed in future
    const unsub = currentForest.on("reset", () => {
      clearCanvas();
      // TODO: send new forest data to canvas
    });
    return unsub;
  }, []);
};
