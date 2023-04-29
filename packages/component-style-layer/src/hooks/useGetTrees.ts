import { useTree } from "@atrilabs/core";
import { Id as ComponentTreeId } from "@atrilabs/app-design-forest/src/componentTree";
import CssTreeId from "@atrilabs/app-design-forest/src/cssTree?id";

export const useGetTrees = () => {
  const compTree = useTree(ComponentTreeId);
  const cssTree = useTree(CssTreeId);
  return { compTree, cssTree };
};
