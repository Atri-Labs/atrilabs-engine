import { useState, useEffect } from "react";
import { Container } from "@atrilabs/core";
import { overlayContainer } from "../exposed";

export const useOverlayContainer = () => {
  const [container, setContainer] = useState<Container<any> | null>(
    overlayContainer.items()[0]
  );
  useEffect(() => {
    const { unsubscribe } = overlayContainer.listen(({ item, event }) => {
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
