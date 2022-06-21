import { useEffect } from "react";
import {
  BrowserForestManager,
  manifestRegistryController,
  useTree,
} from "@atrilabs/core";
import ReactComponentManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import {
  Catcher,
  clearCanvas,
  createComponent,
  deleteComponent,
  getComponentProps,
  updateComponentParent,
  updateComponentProps,
} from "@atrilabs/canvas-runtime";
import type { LinkUpdate, TreeNode, WireUpdate } from "@atrilabs/forest";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import CssTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";

/**
 * This function is an escape hatch and should be removed with urgency.
 * It waits till manifestRegistry has react manfiest loaded.
 */
function tryUntilManifestRegistryHasReactComponentManifestSchemaId() {
  return new Promise<void>((res) => {
    const manifestRegistry = manifestRegistryController.readManifestRegistry();
    if (
      manifestRegistry[ReactComponentManifestSchemaId].components.length > 0
    ) {
      res();
      return;
    }
    const timer = setInterval(() => {
      const manifestRegistry =
        manifestRegistryController.readManifestRegistry();
      if (
        manifestRegistry[ReactComponentManifestSchemaId].components.length > 0
      ) {
        res();
        clearInterval(timer);
      }
      console.log("interval tried");
    }, 1000);
  });
}

function createPropsFromManifestComponent(
  compId: string,
  manifetComponent: any
) {
  const propsKeys = Object.keys(manifetComponent.dev.attachProps);
  const props: { [key: string]: any } = {};
  for (let i = 0; i < propsKeys.length; i++) {
    const propKey = propsKeys[i];
    const treeId = manifetComponent.dev.attachProps[propKey].treeId;
    const tree = BrowserForestManager.currentForest.tree(treeId);
    if (tree) {
      if (tree.links[compId] && tree.links[compId].childId) {
        const propNodeId = tree.links[compId].childId;
        // convention that state.property field in tree contains the value
        const value = tree.nodes[propNodeId].state.property;
        if (value) props[propKey] = value[propKey];
      }
    }
  }
  return props;
}

function createComponentFromNode(node: TreeNode) {
  const id = node.id;
  const meta = node.meta;
  const manifestSchemaId = meta.manifestSchemaId;
  const pkg = meta.pkg;
  const key = meta.key;
  const parent = node.state.parent;
  if (manifestSchemaId === ReactComponentManifestSchemaId) {
    // find manifest from manifest registry
    const manifestRegistry = manifestRegistryController.readManifestRegistry();
    const manifest = manifestRegistry[manifestSchemaId].components.find(
      (curr) => {
        return curr.pkg === pkg && curr.component.meta.key === key;
      }
    );
    // use CanvasAPI to create component
    if (manifest) {
      const manifestComponent = manifest.component;
      const props = createPropsFromManifestComponent(id, manifestComponent);
      const component =
        manifestComponent.dev.comp || manifestComponent.render.comp;
      const acceptsChild = manifestComponent.dev.acceptsChild;
      const catchers: Catcher[] = [];
      if (manifestComponent.dev.acceptsChild) {
        // add catchers
        // accept child catcher
        const componentCatcher: Catcher = (dragData, _loc) => {
          if (dragData.type === "component" || dragData.type === "redrop") {
            return true;
          }
          return false;
        };
        catchers.push(componentCatcher);
      }
      createComponent(
        id,
        component,
        props,
        parent,
        // TODO: get decorators from manifest
        [],
        // TODO: create catchers from manifest
        catchers,
        // TODO: get acceptsChild from manifest
        acceptsChild
      );
    }
  }
}

export const useSubscribeEvents = () => {
  const tree = useTree(ComponentTreeId);
  const cssTree = useTree(CssTreeId);

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
        createComponentFromNode(node);
      }

      if (update.type === "link") {
        const linkUpdate = update as LinkUpdate;
        // updates prop from the tree that is newly linked
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
              for (let i = 0; i < propsKeys.length; i++) {
                const tree = BrowserForestManager.getForest(
                  currentForest.forestPkgId,
                  currentForest.forestId
                )?.tree(treeId);
                // update prop from the tree whose link update we received
                if (tree) {
                  if (
                    tree.links[compId] &&
                    tree.links[compId].childId === propId
                  ) {
                    const props = tree.nodes[propId].state.property;
                    if (props) {
                      const oldProps = getComponentProps(compId);
                      updateComponentProps(compId, { ...oldProps, ...props });
                    }
                    break;
                  }
                }
              }
            }
          }
        }
      }

      if (update.type === "rewire") {
        updateComponentParent(update.childId, {
          id: update.newParentId,
          index: update.newIndex,
        });
      }

      if (update.type === "dewire") {
        deleteComponent(update.childId);
      }

      if (update.type === "change") {
        if (update.treeId === CssTreeId) {
          const links = Object.values(cssTree.links);
          const link = links.find((link) => {
            return link.childId === update.id;
          });
          if (link === undefined) {
            return;
          }
          const compId = link.refId;
          const cssNode = cssTree.nodes[update.id];
          // tranform it into props
          const props = cssNode.state.property;
          if (props) {
            const oldProps = getComponentProps(compId);
            updateComponentProps(compId, { ...oldProps, ...props });
          }
        }
      }
    });
    return unsub;
  }, [tree, cssTree]);

  useEffect(() => {
    // TODO
    // if currentForest is already set when this hook is called,
    // then, send all the event to the canvas
    tryUntilManifestRegistryHasReactComponentManifestSchemaId().then(() => {
      function nodesToEvents() {
        const nodes = tree.nodes;
        const nodeIds = Object.keys(nodes);
        nodeIds.forEach((nodeId) => {
          const node = nodes[nodeId]!;
          createComponentFromNode(node);
        });
      }
      try {
        clearCanvas();
        console.log("clearCanvas done");
        nodesToEvents();
      } catch (err) {
        console.log("caught error during nodeToEvents", err);
      }
    });
  }, [tree]);
};
