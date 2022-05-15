import { useState, useEffect } from "react";
import { ContainerItem } from "@atrilabs/core";
import { overlayContainer } from "../exposed";

export const useOverlayContainer = () => {
  const [container, setContainer] = useState<ContainerItem | null>(
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
