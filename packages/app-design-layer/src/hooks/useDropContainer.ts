import { useState, useEffect } from "react";
import { Container } from "@atrilabs/core";
import { dropContainer } from "../exposed";

export const useDropContainer = () => {
  const [container, setContainer] = useState<Container<any> | null>(
    dropContainer.items()[0]
  );
  useEffect(() => {
    const { unsubscribe } = dropContainer.listen(({ item, event }) => {
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
