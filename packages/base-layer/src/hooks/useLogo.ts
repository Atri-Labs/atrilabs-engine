import { useState, useEffect } from "react";
import { ContainerItem } from "@atrilabs/core";
import { logoContainer } from "../exposed";

export const useLogo = () => {
  const [logoItem, setLogoItem] = useState<ContainerItem | null>(
    logoContainer.items()[0]
  );
  useEffect(() => {
    const { unsubscribe } = logoContainer.listen(({ item, event }) => {
      if (event === "registered") {
        setLogoItem(item);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [setLogoItem]);
  return logoItem;
};
