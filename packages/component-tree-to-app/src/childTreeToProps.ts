import {
  PropsGeneratorFunction,
  PropsGeneratorOutput,
} from "@atrilabs/app-generator";
import { generateModuleId } from "@atrilabs/scripts";

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
  if (!options.forestDef.trees[0]?.id.match("componentTree")) {
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
          const refId = refIds[j]!;
          const childId = tree.links[refId]!.childId;
          const childNode = nodes[childId]!;
          if (childNode.state && childNode.state["property"]) {
            output[refId] = { props: childNode.state["property"] };
          }
        }
      }
    }
  }
  return output;
};

export default childTreeToProps;
