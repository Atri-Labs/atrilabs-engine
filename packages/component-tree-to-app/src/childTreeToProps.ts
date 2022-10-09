import {
  PropsGeneratorFunction,
  PropsGeneratorOptions,
  PropsGeneratorOutput,
} from "@atrilabs/app-generator";
import { TreeNode } from "@atrilabs/forest";
import { generateModuleId } from "@atrilabs/scripts";
import { keyIoPropMap } from "./keyIoPropMap";
import { keySourcePropMap } from "./keySourcePropMap";

function transformBreakpointProps(data: {
  [maxWidth: string]: { property: any };
}): { [maxWidth: string]: { [propName: string]: React.CSSProperties } } {
  const result: { [maxWidth: string]: any } = {};
  const maxWidths = Object.keys(data);
  maxWidths.forEach((maxWidth) => {
    if (data[maxWidth]!.property) {
      result[maxWidth] = data[maxWidth]!.property;
    }
  });
  return result;
}

function extractBreakpointProps(
  breakpoints: {
    [maxWidth: string]: { [propName: string]: React.CSSProperties };
  },
  propName: string
) {
  const result: { [maxWidth: string]: React.CSSProperties } = {};
  const widths = Object.keys(breakpoints);
  widths.forEach((width) => {
    const props = breakpoints[width]![propName];
    if (props) {
      result[width] = props;
    }
  });
  return result;
}

function extractUrl(urlString: string) {
  const match = urlString.match(/url\("(.+)"\)$/);
  if (match !== null && match[1]) {
    return match[1];
  }
  return;
}

function preprocessCSSTreeProps(
  state: {
    property: { [propName: string]: React.CSSProperties };
  },
  options: PropsGeneratorOptions
) {
  if (state.property && options.infos.build.assetUrlPrefix.trim() !== "") {
    const propNames = Object.keys(state.property);
    propNames.forEach((propName) => {
      // append prefix to background image
      if (state.property[propName]!.backgroundImage) {
        const extractedUrl = extractUrl(
          state.property[propName]!.backgroundImage!
        );
        if (extractedUrl && extractedUrl.startsWith("/app-assets")) {
          state.property[
            propName
          ]!.backgroundImage = `url("${options.infos.build.assetUrlPrefix.trim()}${extractedUrl}")`;
        }
      }
    });
  }
}

function preprocessCustomTreeProps(
  componentNode: TreeNode,
  state: {
    property: { [propName: string]: { [subPropNames: string]: any } };
  },
  options: PropsGeneratorOptions
) {
  if (componentNode.meta.key && componentNode.meta.key in keySourcePropMap) {
    const prop = keySourcePropMap[componentNode.meta.key];
    const propNames = Object.keys(prop);
    propNames.forEach((propName) => {
      const subProps = prop[propName];
      const subPropNames = Object.keys(subProps);
      subPropNames.forEach((subPropName) => {
        if (
          propName in state.property &&
          subPropName in state.property[propName]!
        ) {
          if (subProps[subPropName] === "static_asset") {
            const subPropOldValue = state.property[propName]![subPropName]!;
            if (subPropOldValue && subPropOldValue.startsWith("/app-assets")) {
              state.property[propName]![
                subPropName
              ]! = `${options.infos.build.assetUrlPrefix.trim()}${subPropOldValue}`;
            }
          }
          if (
            subPropName === "array_static_asset" &&
            Array.isArray(state.property[propName]![subPropName]!)
          ) {
            const arr: string[] = state.property[propName]![subPropName]!;
            arr.forEach((url, index) => {
              arr[index] = `${options.infos.build.assetUrlPrefix.trim()}${url}`;
            });
          }
        }
      });
    });
  }
}

function createCSSProps(cssTreeState: {
  property?: { [propName: string]: any };
  breakpoints?: {
    [maxWidth: string]: { [propName: string]: React.CSSProperties };
  };
}) {
  const cssProps: PropsGeneratorOutput["0"]["cssProps"] = {};

  const propsWithProperty = Object.keys(cssTreeState.property || {});
  const breakpointWidths = Object.keys(cssTreeState.breakpoints || {});
  const propsWithBreakpoints = breakpointWidths
    .map((width) => {
      return Object.keys(cssTreeState.breakpoints![width]!);
    })
    .flat();
  const allPropNames = Array.from(
    new Set([...propsWithProperty, ...propsWithBreakpoints])
  );

  allPropNames.forEach((propName) => {
    const props =
      cssTreeState.property && cssTreeState.property[propName]
        ? cssTreeState.property[propName]
        : {};
    const breakpoints = cssTreeState.breakpoints
      ? extractBreakpointProps(cssTreeState.breakpoints, propName)
      : {};
    cssProps[propName] = {
      props,
      breakpoints,
    };
  });

  return cssProps;
}

// will exclude trees in options.custom.excludes
const childTreeToProps: PropsGeneratorFunction = (options) => {
  const output: PropsGeneratorOutput = {};
  const excludedTrees: string[] = [];
  if (
    options.custom &&
    options.custom.excludes &&
    Array.isArray(options.custom.excludes)
  ) {
    options.custom.excludes.forEach((excludedTree: any) => {
      if (typeof excludedTree === "string") {
        const treeId = generateModuleId(excludedTree);
        excludedTrees.push(treeId);
      }
    });
  }

  const componentTreeId = generateModuleId(
    "@atrilabs/app-design-forest/lib/componentTree"
  );
  const forest = options.forest;
  const componentTree = forest.tree(componentTreeId);
  if (!componentTree) {
    throw Error("Component Tree not found in forest.");
  }

  const cssTreeId = generateModuleId("@atrilabs/app-design-forest/lib/cssTree");
  const customPropsTreeId = generateModuleId(
    "@atrilabs/app-design-forest/lib/customPropsTree"
  );

  const treeDefs = options.forestDef.trees;
  for (let i = 0; i < treeDefs.length; i++) {
    const treeDef = treeDefs[i]!;
    const treeId = treeDef.id;
    if (excludedTrees.includes(treeId)) {
      continue;
    }
    const tree = options.forest.tree(treeId);
    if (tree) {
      const nodes = tree.nodes;
      const refIds = Object.keys(tree.links);
      for (let j = 0; j < refIds.length; j++) {
        // add props
        const refId = refIds[j]!;
        // component might have been deleted
        if (componentTree.nodes[refId] === undefined) {
          continue;
        }
        const childId = tree.links[refId]!.childId;
        const childNode = nodes[childId]!;
        if (childNode.state && childNode.state["property"]) {
          // preprocess values like adding asset prefix url
          if (treeId === cssTreeId) {
            preprocessCSSTreeProps(childNode.state as any, options);
          } else if (treeId === customPropsTreeId) {
            preprocessCustomTreeProps(
              componentTree.nodes[refId]!,
              childNode.state as any,
              options
            );
          }
          if (output[refId] && output[refId]!["props"]) {
            output[refId] = {
              props: {
                ...output[refId]!["props"],
                ...(treeId !== cssTreeId ? childNode.state["property"] : {}),
              },
              breakpointProps: {
                ...output[refId]!["breakpointProps"],
                ...(childNode.state["breakpoints"]
                  ? transformBreakpointProps(childNode.state["breakpoints"])
                  : {}),
              },
              cssProps: {
                ...output[refId]!["cssProps"],
                ...(treeId === cssTreeId
                  ? createCSSProps({
                      property: childNode.state["property"],
                      breakpoints: childNode.state["breakpoints"]
                        ? transformBreakpointProps(
                            childNode.state["breakpoints"]
                          )
                        : undefined,
                    })
                  : {}),
              },
            };
          } else {
            output[refId] = {
              props: treeId !== cssTreeId ? childNode.state["property"] : {},
              breakpointProps: childNode.state["breakpoints"]
                ? transformBreakpointProps(childNode.state["breakpoints"])
                : {},
              cssProps:
                treeId === cssTreeId
                  ? createCSSProps({
                      property: childNode.state["property"],
                      breakpoints: childNode.state["breakpoints"]
                        ? transformBreakpointProps(
                            childNode.state["breakpoints"]
                          )
                        : undefined,
                    })
                  : {},
            };
          }
        }
        // add ioProps (assuming components have ReactComponentManifestSchema)
        if (
          componentTree.nodes[refId]?.meta &&
          componentTree.nodes[refId]?.meta.key &&
          keyIoPropMap[componentTree.nodes[refId]!.meta.key]
        ) {
          const ioProps = keyIoPropMap[componentTree.nodes[refId]!.meta.key];
          if (output[refId]) {
            output[refId]!["ioProps"] = ioProps;
          } else {
            output[refId] = { ioProps, props: {} };
          }
        }
      }
    }
  }

  return output;
};

export default childTreeToProps;
