import { ForestDef, TreeDef } from "../src/types";

export const componentTreeDef: TreeDef = {
  id: "componentTreeModule",
  modulePath: "componentTreeModule",
  defFn: () => {
    return {
      validateCreate(_event) {
        return true;
      },
      validatePatch(_event) {
        return true;
      },
      onCreate(_event) {},
    };
  },
};

export const cssTreeDef: TreeDef = {
  id: "cssTreeModule",
  modulePath: "cssTreeModule",
  defFn: () => {
    return {
      validateCreate(_event) {
        return true;
      },
      validatePatch(_event) {
        return true;
      },
      onCreate(_event) {},
    };
  },
};

export const forestDef: ForestDef = {
  id: "forestId",
  pkg: "forestPkg",
  trees: [componentTreeDef, cssTreeDef],
};
