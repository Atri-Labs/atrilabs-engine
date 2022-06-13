import type {
  ComponentGeneratorFunction,
  ComponentGeneratorOutput,
} from "@atrilabs/app-generator";
import generateModuleId from "@atrilabs/scripts/build/babel/generateModuleId";

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
      const nodeIds = Object.keys(nodes);
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
            };
        }
      }
    }
  }
  return output;
};

export default componentTreeToComponentDef;
