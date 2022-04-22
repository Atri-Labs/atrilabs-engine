import { useState, useEffect } from "react";
import { Container } from "@atrilabs/core";
import { canvasContainer } from "../exposed";

export const useCanvasContainer = () => {
  const [container, setContainer] = useState<Container<any> | null>(
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
