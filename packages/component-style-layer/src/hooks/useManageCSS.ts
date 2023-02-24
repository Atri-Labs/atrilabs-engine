import {
  BrowserForestManager,
  manifestRegistryController,
} from "@atrilabs/core";
import React, { useCallback, useEffect, useState } from "react";
import cssTreeId from "@atrilabs/app-design-forest/src/cssTree?id";
import ReactManifestSchemaId from "@atrilabs/react-component-manifest-schema?id";
import { PatchEvent, Tree } from "@atrilabs/forest";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import { getEffectiveStyle, Breakpoint } from "@atrilabs/core";
import { api, breakpointApi } from "@atrilabs/pwa-builder-manager";

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
    breakpointApi.subscribeBreakpointChange(() => {
      const breakpoint = breakpointApi.getActiveBreakpoint();
      setBreakpoint(breakpoint);
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
      const fullManifest = manifestRegistry[
        ReactManifestSchemaId
      ].manifests.find((curr) => {
        return curr.pkg === pkg && curr.manifest.meta.key === key;
      });
      if (fullManifest) {
        const manifest: ReactComponentManifestSchema = fullManifest.manifest;
        if (manifest.dev.attachProps["styles"]) {
          const treeOptions = manifest.dev.attachProps["styles"].treeOptions;
          setTreeOptions(treeOptions);
        } else {
          setTreeOptions(null);
        }
      }
    }
  }, [id, compTree]);

  return { patchCb, styles, treeOptions, breakpoint };
};
