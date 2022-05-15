import { useState, useEffect } from "react";
import { ContainerItem } from "@atrilabs/core";
import { baseContainer } from "../exposed";

export const useBaseContainer = () => {
  const [container, setContainer] = useState<ContainerItem | null>(
    baseContainer.items()[0]
  );
  useEffect(() => {
    const { unsubscribe } = baseContainer.listen(({ item, event }) => {
      if (event === "registered") {
        setContainer(item);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [setContainer]);
  return container;
};
