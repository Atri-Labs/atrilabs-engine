import { MenuItem } from "@atrilabs/core";
import { useEffect, useState } from "react";
import { footerMenu } from "../exposed";

export const useFooterMenu = () => {
  const [items, setItems] = useState<MenuItem[]>(footerMenu.items());
  useEffect(() => {
    footerMenu.listen(() => {
      setItems([...footerMenu.items()]);
    });
  }, [setItems]);
  return items;
};
