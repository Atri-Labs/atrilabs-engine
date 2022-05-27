import { useState, useEffect } from "react";
import { ContainerItem } from "@atrilabs/core";
import { canvasContainer } from "../exposed";

export const useCanvasContainer = () => {
  const [container, setContainer] = useState<ContainerItem | null>(
    canvasContainer.items()[0]
  );
  useEffect(() => {
    const { unsubscribe } = canvasContainer.listen(() => {
      setContainer(canvasContainer.items()[canvasContainer.items().length - 1]);
    });
    return () => {
      unsubscribe();
    };
  }, [setContainer]);
  return container;
};
