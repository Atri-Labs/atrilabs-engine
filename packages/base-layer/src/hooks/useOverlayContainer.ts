import { useState, useEffect } from "react";
import { Container } from "@atrilabs/core";
import { overlayContainer } from "../exposed";

export const useOverlayContainer = () => {
  const [container, setContainer] = useState<Container<any> | null>(
    overlayContainer.items()[overlayContainer.items().length - 1]
  );
  useEffect(() => {
    const { unsubscribe } = overlayContainer.listen(() => {
      setContainer(
        overlayContainer.items()[overlayContainer.items().length - 1]
      );
    });
    return () => {
      unsubscribe();
    };
  }, [setContainer]);
  return container;
};
