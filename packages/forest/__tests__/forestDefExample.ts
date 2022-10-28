import { ForestDef, TreeDef } from "../src/types";

export const componentTreeDef: TreeDef = {
  id: "@atrilabs/app-design-forest/lib/componentTree.js",
  modulePath: "@atrilabs/app-design-forest/lib/componentTree.js",
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
  id: "@atrilabs/app-design-forest/lib/cssTree.js",
  modulePath: "@atrilabs/app-design-forest/lib/cssTree.js",
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

export const callbackTreeDef: TreeDef = {
  id: "@atrilabs/app-design-forest/lib/callbackHandlerTree.js",
  modulePath: "@atrilabs/app-design-forest/lib/callbackHandlerTree.js",
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

export const customPropsTreeDef: TreeDef = {
  id: "@atrilabs/app-design-forest/lib/customPropsTree.js",
  modulePath: "@atrilabs/app-design-forest/lib/customPropsTree.js",
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
  trees: [componentTreeDef, cssTreeDef, callbackTreeDef, customPropsTreeDef],
};
