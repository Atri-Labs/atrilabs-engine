import {
  PropsGeneratorFunction,
  PropsGeneratorOutput,
} from "@atrilabs/app-generator";
import { generateModuleId } from "@atrilabs/scripts";
import { keyIoPropMap } from "./keyIoPropMap";

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
        const childId = tree.links[refId]!.childId;
        const childNode = nodes[childId]!;
        if (childNode.state && childNode.state["property"]) {
          if (output[refId] && output[refId]!["props"]) {
            output[refId] = {
              props: {
                ...output[refId]!["props"],
                ...childNode.state["property"],
              },
            };
          } else {
            output[refId] = { props: childNode.state["property"] };
          }
        }
        // add ioProps
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
