import { useState, useEffect } from "react";
import { ContainerItem } from "@atrilabs/core";
import { dropContainer } from "../exposed";

export const useDropContainer = () => {
  const [container, setContainer] = useState<ContainerItem | null>(
    dropContainer.items()[dropContainer.items().length - 1]
  );
  useEffect(() => {
    const { unsubscribe } = dropContainer.listen(() => {
      setContainer(dropContainer.items()[dropContainer.items().length - 1]);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return container;
};
