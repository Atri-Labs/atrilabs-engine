import { useState, useEffect } from "react";
import { ContainerItem } from "@atrilabs/core";
import { canvasContainer } from "../exposed";

export const useCanvasContainer = () => {
  const [container, setContainer] = useState<ContainerItem | null>(
    canvasContainer.items()[0]
  );
  useEffect(() => {
    const { unsubscribe } = canvasContainer.listen(({ item, event }) => {
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
