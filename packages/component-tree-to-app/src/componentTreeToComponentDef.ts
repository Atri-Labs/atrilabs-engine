import type {
  ComponentGeneratorFunction,
  ComponentGeneratorOutput,
} from "@atrilabs/app-generator";
import generateModuleId from "@atrilabs/scripts/build/babel/generateModuleId";
import { createReverseMap, getAllNodeIdsFromReverseMap } from "./utils";

const componentTreeToComponentDef: ComponentGeneratorFunction = (options) => {
  const output: ComponentGeneratorOutput = {};
  const componentTreeId = generateModuleId(
    "@atrilabs/app-design-forest/lib/componentTree"
  );
  if (options.forestDef.trees[0]?.id === componentTreeId) {
    const forest = options.forest;
    const componentTree = forest.tree(componentTreeId);
    if (componentTree) {
      const nodes = componentTree.nodes;
      const reverseMap = createReverseMap(nodes);
      const nodeIds = getAllNodeIdsFromReverseMap(reverseMap);
      for (let i = 0; i < nodeIds.length; i++) {
        const nodeId = nodeIds[i]!;
        const node = nodes[nodeId]!;
        const key = node.meta["key"];
        const pkg = node.meta["pkg"];
        if (
          node.state["alias"] &&
          typeof node.state["alias"] === "string" &&
          key &&
          pkg
        ) {
          const alias = node.state["alias"];
          const component = options.getComponentFromManifest({ pkg, key });
          if (component)
            output[nodeId] = {
              alias,
              exportedVarName: component.exportedVarName,
              modulePath: component.modulePath,
              parent: node.state.parent,
            };
        }
      }
    }
  }
  return output;
};

export default componentTreeToComponentDef;
