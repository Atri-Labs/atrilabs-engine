import { useTree } from "@atrilabs/core";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import CssTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";

export const useGetTrees = () => {
  const compTree = useTree(ComponentTreeId);
  const cssTree = useTree(CssTreeId);
  return { compTree, cssTree };
};
