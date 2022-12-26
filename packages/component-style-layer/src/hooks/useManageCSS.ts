import {
  api,
  BrowserForestManager,
  manifestRegistryController,
} from "@atrilabs/core";
import React, { useCallback, useEffect, useState } from "react";
import cssTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { PatchEvent, Tree } from "@atrilabs/forest";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import {
  getComponentProps,
  updateComponentProps,
  subscribeBreakpointChange,
  Breakpoint,
} from "@atrilabs/canvas-runtime";
import { getEffectiveStyle } from "@atrilabs/canvas-runtime-utils";

export const useManageCSS = (props: {
  id: string | null;
  compTree: Tree;
  cssTree: Tree;
}) => {
  const id = props.id;
  const compTree = props.compTree;
  const cssTree = props.cssTree;
  const [styles, setStyles] = useState<React.CSSProperties>({});
  const [treeOptions, setTreeOptions] = useState<
    | ReactComponentManifestSchema["dev"]["attachProps"]["0"]["treeOptions"]
    | null
  >(null);

  // handle breakpoints
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null);
  useEffect(() => {
    subscribeBreakpointChange((breakpoint) => {
      setBreakpoint(breakpoint);
      // update styles for all components on breakpoint change
      const nodeIds = Object.keys(compTree.nodes);
      nodeIds.forEach((nodeId) => {
        const cssLink = cssTree.links[nodeId];
        if (cssLink) {
          const cssNode = cssTree.nodes[cssLink.childId];
          if (cssNode) {
            const styles = cssNode.state.property.styles;
            const breakpoints = cssNode.state.breakpoints;
            if (breakpoints && breakpoint) {
              const effectiveStyle = getEffectiveStyle(
                breakpoint,
                breakpoints,
                styles
              );
              const oldProps = getComponentProps(nodeId);
              updateComponentProps(nodeId, {
                ...oldProps,
                styles: effectiveStyle,
              });
            }
            if (breakpoint === null) {
              const oldProps = getComponentProps(nodeId);
              updateComponentProps(nodeId, {
                ...oldProps,
                styles: { ...styles },
              });
            }
          }
        }
      });
    });
  }, [compTree, cssTree]);

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
            slice: breakpoint
              ? {
                  // respects only max-width. If in future need arises for min-width
                  // or the combination of min-width and max-width we will add new fields
                  // to the state of css node in css tree.
                  breakpoints: {
                    [breakpoint.max]: slice,
                  },
                }
              : slice,
            id: cssNodeId.childId,
          };
          api.postNewEvents(forestPkgId, forestId, {
            events: [patchEvent],
            meta: {
              agent: "browser",
            },
            name: "CHANGE_CSS",
          });
        }
      }
    },
    [id, compTree, cssTree, breakpoint]
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
            const styles = cssTree.nodes[cssNodeId].state.property.styles;
            const breakpoints = cssTree.nodes[cssNodeId].state.breakpoints;
            if (breakpoint && breakpoints) {
              const effectiveStyle = getEffectiveStyle(
                breakpoint,
                breakpoints,
                styles
              );
              setStyles(effectiveStyle);
              // tranform it into props
              const props = { ...cssTree.nodes[cssNodeId].state.property };
              props.styles = effectiveStyle;
              if (props) {
                const oldProps = getComponentProps(id);
                updateComponentProps(id, { ...oldProps, ...props });
              }
            } else {
              setStyles({ ...cssTree.nodes[cssNodeId].state.property.styles });
              // tranform it into props
              const props = cssTree.nodes[cssNodeId].state.property;
              if (props) {
                const oldProps = getComponentProps(id);
                updateComponentProps(id, { ...oldProps, ...props });
              }
            }

            // TODO: update inherited styles (maybe inside a startTransition)
          }
        }
      });
      return unsub;
    }
  }, [id, compTree, cssTree, breakpoint]);
  useEffect(() => {
    // fetch values everytime id changes
    if (
      id &&
      compTree.nodes[id] &&
      compTree.nodes[id].meta.manifestSchemaId === ReactManifestSchemaId
    ) {
      const cssLink = cssTree.links[id];
      if (cssLink) {
        const styles = cssTree.nodes[cssLink.childId].state.property.styles;
        const breakpoints = cssTree.nodes[cssLink.childId].state.breakpoints;
        if (breakpoint && breakpoints) {
          setStyles(getEffectiveStyle(breakpoint, breakpoints, styles));
        } else {
          setStyles(styles);
        }
      }
    }
  }, [id, compTree, cssTree, breakpoint]);
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
        if (manifestComponent.dev.attachProps["styles"]) {
          const treeOptions =
            manifestComponent.dev.attachProps["styles"].treeOptions;
          setTreeOptions(treeOptions);
        } else {
          setTreeOptions(null);
        }
      }
    }
  }, [id, compTree]);

  return { patchCb, styles, treeOptions, breakpoint };
};
