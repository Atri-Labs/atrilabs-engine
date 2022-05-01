import { Tree } from "@atrilabs/forest";
import { useEffect, useState } from "react";
import { currentForest } from "./setCurrentForest";

/**
 *
 * @param name name of the tree
 */
export const useTree = (name: string) => {
  const getTree = (name: string) => {
    if (currentForest.tree(name)) return currentForest.tree(name)!;
    else
      throw Error(
        `Tree with name ${name} not found in currentForest with name ${currentForest.name}`
      );
  };
  const [tree, setTree] = useState<Tree>(getTree(name));

  // listen for reset of current forest
  useEffect(() => {
    const unsubscribe = currentForest.on("reset", () => {
      setTree(getTree(name));
    });
    return () => {
      unsubscribe();
    };
  }, [name, setTree]);

  return tree;
};
