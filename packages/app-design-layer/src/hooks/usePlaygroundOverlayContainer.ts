import { useState, useEffect } from "react";
import { ContainerItem } from "@atrilabs/core";
import { playgroundOverlayContainer } from "../exposed";

export const usePlaygroundContainer = () => {
  const [container, setContainer] = useState<ContainerItem | null>(
    playgroundOverlayContainer.items()[0]
  );
  useEffect(() => {
    const { unsubscribe } = playgroundOverlayContainer.listen(() => {
      setContainer(
        playgroundOverlayContainer.items()[
          playgroundOverlayContainer.items().length - 1
        ]
      );
    });
    return () => {
      unsubscribe();
    };
  }, [setContainer]);
  return container;
};
