import { useState, useEffect } from "react";
import { ContainerItem } from "@atrilabs/core";
import { baseContainer } from "../exposed";

export const useBaseContainer = () => {
  const [container, setContainer] = useState<ContainerItem["node"] | null>(
    baseContainer.items()[0] ? baseContainer.items()[0]["node"] : null
  );
  useEffect(() => {
    const { unsubscribe } = baseContainer.listen(({ node, event }) => {
      if (event === "registered") {
        setContainer(node);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [setContainer]);
  return container;
};
