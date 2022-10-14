import {
  PythonStubGeneratorFunction,
  PythonStubGeneratorOptions,
  PythonStubGeneratorOutput,
} from "@atrilabs/app-generator";
import generateModuleId from "@atrilabs/scripts/build/babel/generateModuleId";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import { keyPropMap } from "./keyPropMap";
import { keyCallbackMap } from "./keyCallbackMap";
import { keyIoPropMap } from "./keyIoPropMap";
import {
  createReverseMap,
  extractCallbackHandlers,
  getAllNodeIdsFromReverseMap,
} from "./utils";
type Options = Omit<PythonStubGeneratorOptions, "custom"> & {
  custom: {
    treeId: string;
    from: "module" | "initialValue";
    modulePath?: string;
  }[];
};

// Creates python stub for components that follow ReactComponentManifestSchema
export const pythonStubGenerator: PythonStubGeneratorFunction = (
  options: Options
) => {
  const stub: PythonStubGeneratorOutput = { vars: {} };
  // TODO: get value and type from tree definition
  // stub.vars = {
  //   Flex1: {
  //     type: {},
  //     value: { styles: { display: "flex" }, custom: {} },
  //     gettable: true,
  //     updateable: true,
  //   },
  //   Button1: {
  //     type: {},
  //     value: {
  //       styles: { background: "pink", color: "black", opacity: 0.5 },
  //       custom: { text: "Click Me" },
  //     },
  //     gettable: true,
  //     updateable: true,
  //   },
  // };
  const componentTreeId = generateModuleId(
    "@atrilabs/app-design-forest/lib/componentTree"
  );
  if (options.forestDef.trees[0]?.id === componentTreeId) {
    const componentTree = options.forest.tree(componentTreeId)!;
    const nodes = componentTree.nodes;
    const reverseMap = createReverseMap(nodes);
    const nodeIds = getAllNodeIdsFromReverseMap(reverseMap);
    nodeIds.forEach((nodeId) => {
      const node = nodes[nodeId]!;
      const alias = node.state["alias"];
      if (node.meta && node.meta.pkg && node.meta.key && alias) {
        const manifest: ReactComponentManifestSchema = options.getManifest(
          node.meta
        );
        const propNames = Object.keys(manifest.dev.attachProps);
        propNames.forEach((propName) => {
          const propDef = manifest.dev.attachProps[propName]!;
          const propTreeId = propDef.treeId;
          if (Array.isArray(options.custom)) {
            const concernedTrees = options.custom;
            const found = concernedTrees.find(
              (curr) => curr.treeId === propTreeId
            );
            if (found) {
              const from = found.from;
              switch (from) {
                case "initialValue":
                  const value =
                    manifest.dev.attachProps[propName]!.initialValue;
                  stub.vars[alias] = {
                    type: "",
                    key: "",
                    value: value,
                    gettable: true,
                    updateable: true,
                    // TODO: fill in correct callbacks
                    callbacks: {},
                  };
                  break;
                case "module":
                  if (found.modulePath) {
                    try {
                      const value = require(found.modulePath)["default"];
                      stub.vars[alias] = {
                        type: "",
                        key: "",
                        value: value,
                        gettable: true,
                        updateable: true,
                        // TODO: fill in correct callbacks
                        callbacks: {},
                      };
                    } catch {}
                  }
                  break;
              }
            }
          }
        });
      }
    });
  }
  return stub;
};

const tempPythonStubGenerator: PythonStubGeneratorFunction = (
  options: Options
) => {
  const stub: PythonStubGeneratorOutput = { vars: {} };
  const componentTreeId = generateModuleId(
    "@atrilabs/app-design-forest/lib/componentTree"
  );
  if (options.forestDef.trees[0]?.id === componentTreeId) {
    const componentTree = options.forest.tree(componentTreeId)!;
    const nodes = componentTree.nodes;
    const reverseMap = createReverseMap(nodes);
    const nodeIds = getAllNodeIdsFromReverseMap(reverseMap);
    nodeIds.forEach((nodeId) => {
      const node = nodes[nodeId]!;
      const alias = node.state["alias"];
      if (node.meta && node.meta.pkg && node.meta.key && alias) {
        const pkg = node.meta.pkg;
        const key = node.meta.key;
        if (pkg.includes("react-component-manifests")) {
          if (keyPropMap[key] && keyCallbackMap[key]) {
            const callbackInfo: typeof keyCallbackMap[""] = JSON.parse(
              JSON.stringify(keyCallbackMap[key])
            );
            const handlers = extractCallbackHandlers(options.forest, node.id);
            const callbackNames = Object.keys(callbackInfo);
            callbackNames.forEach((callbackName) => {
              callbackInfo![callbackName]!.handlers =
                handlers[callbackName] || [];
            });
            stub.vars[alias] = {
              type: "",
              key: key,
              value: keyPropMap[key],
              ioProps: keyIoPropMap[key],
              callbacks: callbackInfo,
              gettable: true,
              updateable: true,
            };
          } else {
            console.log(`Please add key ${key} to keyPropMap & keyCallbackMap`);
          }
        } else {
          console.log(
            `Manifest Package Not Configured\nPlease add support for manifest package ${pkg}`
          );
        }
      }
    });
  }
  return stub;
};

export default tempPythonStubGenerator;
