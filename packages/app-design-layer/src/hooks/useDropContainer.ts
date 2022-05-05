import { useState, useEffect } from "react";
import { Container } from "@atrilabs/core";
import { dropContainer } from "../exposed";

export const useDropContainer = () => {
  const [container, setContainer] = useState<Container<any> | null>(
    dropContainer.items()[dropContainer.items().length - 1]
  );
  useEffect(() => {
    const { unsubscribe } = dropContainer.listen(() => {
      setContainer(dropContainer.items()[dropContainer.items().length - 1]);
    });
    return () => {
      unsubscribe();
    };
  }, [setContainer]);
  return container;
};
