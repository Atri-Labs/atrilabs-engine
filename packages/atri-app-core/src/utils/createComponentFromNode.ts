import { Forest, TreeNode } from "@atrilabs/forest";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";

function extractStylesFromStyleNode(cssNode: TreeNode) {
  const breakpoints: { [breakpoint: string]: React.CSSProperties } = {};
  if (cssNode.state["property"]?.["breakpoints"]) {
    Object.keys(cssNode.state["property"]["breakpoints"]).forEach(
      (breakpoint) => {
        breakpoints[breakpoint] =
          cssNode.state["property"]["breakpoints"]["property"]["styles"];
      }
    );
  }

  return { styles: cssNode.state["property"]?.["styles"] || {}, breakpoints };
}

function createPropsFromManifestComponent(
  compId: string,
  manifet: any,
  forest: Forest
) {
  const propsKeys = Object.keys(manifet.dev.attachProps);
  const props: { [key: string]: any } = {};
  for (let i = 0; i < propsKeys.length; i++) {
    const propKey = propsKeys[i];
    const treeId = manifet.dev.attachProps[propKey].treeId;
    const tree = forest.tree(treeId);
    if (tree) {
      if (tree.links[compId] && tree.links[compId].childId) {
        const propNodeId = tree.links[compId].childId;
        // convention that state.property field in tree contains the value
        const value = tree.nodes[propNodeId].state.property;
        if (value) {
          if (propKey === "styles") {
            const styles = extractStylesFromStyleNode(tree.nodes[propNodeId]);
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
  forest: Forest,
  componentManifests: {
    [pkg: string]: {
      [key: string]: { manifest: ReactComponentManifestSchema };
    };
  }
) {
  const id = node.id;
  const meta = node.meta;
  const pkg = meta.pkg;
  const key = meta.key;
  const parent = {
    id: node.state.parent.id,
    index: node.state.parent.index,
    canvasZoneId: node.state.parent.canvasZoneId,
  };
  // find manifest from manifest registry
  const fullManifest = componentManifests[pkg]![key]!.manifest;
  // use CanvasAPI to create component
  if (fullManifest) {
    const manifest = fullManifest;
    const props = createPropsFromManifestComponent(id, manifest, forest);
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
      alias: node.state.alias,
      type: manifest.dev.isRepeating
        ? ("repeating" as const)
        : typeof manifest.dev.acceptsChild === "function"
        ? ("parent" as const)
        : ("normal" as const),
    };
  }
}
