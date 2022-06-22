import {
  PythonStubGeneratorFunction,
  PythonStubGeneratorOptions,
  PythonStubGeneratorOutput,
} from "@atrilabs/app-generator";
import generateModuleId from "@atrilabs/scripts/build/babel/generateModuleId";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import { keyPropMap } from "./keyPropMap";
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
    const nodeIds = Object.keys(componentTree.nodes);
    nodeIds.forEach((nodeId) => {
      const node = componentTree.nodes[nodeId]!;
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
                    value: value,
                    gettable: true,
                    updateable: true,
                  };
                  break;
                case "module":
                  if (found.modulePath) {
                    try {
                      const value = require(found.modulePath)["default"];
                      stub.vars[alias] = {
                        type: "",
                        value: value,
                        gettable: true,
                        updateable: true,
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
    const nodeIds = Object.keys(componentTree.nodes);
    nodeIds.forEach((nodeId) => {
      const node = componentTree.nodes[nodeId]!;
      const alias = node.state["alias"];
      if (node.meta && node.meta.pkg && node.meta.key && alias) {
        const pkg = node.meta.pkg;
        const key = node.meta.key;
        if (pkg.includes("react-component-manifests")) {
          if (keyPropMap[key]) {
            stub.vars[alias] = {
              type: "",
              value: keyPropMap[key],
              gettable: true,
              updateable: true,
            };
          } else {
            console.log(`Please add key ${key} to keyPropMap`);
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
