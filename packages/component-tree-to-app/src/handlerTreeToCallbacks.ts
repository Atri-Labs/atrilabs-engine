import {
  CallbackGeneratorFunction,
  CallbackGeneratorOutput,
} from "@atrilabs/app-generator";
import { generateModuleId } from "@atrilabs/scripts";
import { keyCallbackMap } from "./keyCallbackMap";
import { extractCallbackHandlers } from "./utils";
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
            // merge handlers from callbackHandlerTree with keyCallbackMap
            const callbackInfo: typeof keyCallbackMap[""] = JSON.parse(
              JSON.stringify(keyCallbackMap[key])
            );
            const handlers = extractCallbackHandlers(options.forest, node.id);
            const callbackNames = Object.keys(callbackInfo);
            callbackNames.forEach((callbackName) => {
              callbackInfo![callbackName]!.handlers =
                handlers[callbackName] || [];
            });
            output[node.id] = { callbacks: callbackInfo };
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
