import { useTree } from "@atrilabs/core";
import ComponentTreeId from "@atrilabs/app-design-forest/src/componentTree?id";
import CssTreeId from "@atrilabs/app-design-forest/src/cssTree?id";

export const useGetTrees = () => {
  const compTree = useTree(ComponentTreeId);
  const cssTree = useTree(CssTreeId);
  return { compTree, cssTree };
};
