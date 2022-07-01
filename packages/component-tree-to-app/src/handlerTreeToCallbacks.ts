import {
  CallbackGeneratorFunction,
  CallbackGeneratorOutput,
} from "@atrilabs/app-generator";
import { generateModuleId } from "@atrilabs/scripts";
import { keyCallbackMap } from "./keyCallbackMap";
const handlerTreeToCallbacks: CallbackGeneratorFunction = (options) => {
  const output: CallbackGeneratorOutput = {};
  const componentTreeId = generateModuleId(
    "@atrilabs/app-design-forest/lib/componentTree"
  );
  if (options.forestDef.trees[0]?.id === componentTreeId) {
    const componentTree = options.forest.tree(componentTreeId)!;
    const nodeIds = Object.keys(componentTree.nodes);
    nodeIds.forEach((nodeId) => {
      const node = componentTree.nodes[nodeId]!;
      if (node.meta && node.meta.pkg && node.meta.key) {
        const pkg = node.meta.pkg;
        const key = node.meta.key;
        if (pkg.includes("react-component-manifests")) {
          if (keyCallbackMap[key]) {
            output[node.id] = { callbacks: keyCallbackMap[key]! };
          } else {
            console.log(`Please add key ${key} to keyCallbackMap`);
          }
        } else {
          console.log(
            `Manifest Package Not Configured\nPlease add support for manifest package ${pkg}`
          );
        }
      }
    });
  }
  return output;
};

export default handlerTreeToCallbacks;
