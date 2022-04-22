import { useState, useEffect } from "react";
import { Container } from "@atrilabs/core";
import { logoContainer } from "../exposed";

export const useLogo = () => {
  const [logoItem, setLogoItem] = useState<Container<any> | null>(null);
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
