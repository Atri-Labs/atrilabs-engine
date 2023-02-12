import {
  Breakpoint,
  BrowserForestManager,
  manifestRegistryController,
} from "@atrilabs/core";
import { TreeNode } from "@atrilabs/forest";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import { getEffectiveStyle } from "./getEffectiveStyle";

function createPropsFromManifestComponent(
  compId: string,
  manifet: any,
  breakpoint: Breakpoint
) {
  const propsKeys = Object.keys(manifet.dev.attachProps);
  const props: { [key: string]: any } = {};
  for (let i = 0; i < propsKeys.length; i++) {
    const propKey = propsKeys[i];
    const treeId = manifet.dev.attachProps[propKey].treeId;
    const tree = BrowserForestManager.currentForest.tree(treeId);
    if (tree) {
      if (tree.links[compId] && tree.links[compId].childId) {
        const propNodeId = tree.links[compId].childId;
        // convention that state.property field in tree contains the value
        const value = tree.nodes[propNodeId].state.property;
        const breakpoints = tree.nodes[propNodeId].state.breakpoints;
        // temporary fix: handle breakpoint for styles prop only

        if (value) {
          if (breakpoints && propKey === "styles" && breakpoint) {
            const styles = getEffectiveStyle(
              breakpoint,
              breakpoints,
              value["styles"]
            );
            props[propKey] = styles;
          } else {
            props[propKey] = value[propKey];
          }
        }
      }
    }
  }
  return props;
}

export function createComponentFromNode(
  node: TreeNode,
  breakpoint: Breakpoint
) {
  const id = node.id;
  const meta = node.meta;
  const manifestSchemaId = meta.manifestSchemaId;
  const pkg = meta.pkg;
  const key = meta.key;
  const parent = {
    id: node.state.parent.id,
    index: node.state.parent.index,
    canvasZoneId: node.state.parent.zoneId,
  };
  // find manifest from manifest registry
  const manifestRegistry = manifestRegistryController.readManifestRegistry();
  const fullManifest = manifestRegistry[manifestSchemaId].manifests.find(
    (curr) => {
      return curr.pkg === pkg && curr.manifest.meta.key === key;
    }
  );
  // use CanvasAPI to create component
  if (fullManifest) {
    const manifest = fullManifest.manifest as ReactComponentManifestSchema;
    const props = createPropsFromManifestComponent(id, manifest, breakpoint);
    const callbacks =
      manifest.dev["attachCallbacks"] &&
      typeof manifest.dev["attachCallbacks"] === "object" &&
      !Array.isArray(manifest.dev["attachCallbacks"])
        ? manifest.dev["attachCallbacks"]
        : {};
    return {
      id,
      props,
      parent,
      acceptsChild: typeof manifest.dev.acceptsChild === "function",
      callbacks,
      meta: node.meta,
    };
  }
}
