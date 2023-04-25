import { ForestDef, TreeDef } from "../src/types";

export const componentTreeDef: TreeDef = {
  id: "@atrilabs/app-design-forest/src/componentTree",
  modulePath: "@atrilabs/app-design-forest/src/componentTree",
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
  id: "@atrilabs/app-design-forest/src/cssTree",
  modulePath: "@atrilabs/app-design-forest/src/cssTree",
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
  id: "@atrilabs/app-design-forest/src/callbackHandlerTree",
  modulePath: "@atrilabs/app-design-forest/src/callbackHandlerTree",
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
  id: "@atrilabs/app-design-forest/src/customPropsTree",
  modulePath: "@atrilabs/app-design-forest/src/customPropsTree",
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

export const attributesTreeDef: TreeDef = {
  id: "@atrilabs/app-design-forest/src/attributesTree",
  modulePath: "@atrilabs/app-design-forest/src/attributesTree",
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
  trees: [componentTreeDef, cssTreeDef, callbackTreeDef, customPropsTreeDef,attributesTreeDef],
};
