import { useTree } from "@atrilabs/core";
import { Id as ComponentTreeId } from "@atrilabs/app-design-forest/src/componentTree";
import { Id as CSSTreeId } from "@atrilabs/app-design-forest/src/cssTree";

export const useGetTrees = () => {
  const compTree = useTree(ComponentTreeId);
  const cssTree = useTree(CSSTreeId);
  return { compTree, cssTree };
};
