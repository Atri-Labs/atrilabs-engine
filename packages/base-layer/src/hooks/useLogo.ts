import { useState, useEffect } from "react";
import { ContainerItem } from "@atrilabs/core";
import { logoContainer } from "../exposed";

export const useLogo = () => {
  const [logoItem, setLogoItem] = useState<ContainerItem["node"] | null>(
    logoContainer.items()[0] ? logoContainer.items()[0]["node"] : null
  );
  useEffect(() => {
    const { unsubscribe } = logoContainer.listen(({ node, event }) => {
      if (event === "registered") {
        setLogoItem(node);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [setLogoItem]);
  return logoItem;
};
