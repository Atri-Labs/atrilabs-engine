import { MenuItem } from "@atrilabs/core";
import { useEffect, useState } from "react";
import { pageMenu } from "../exposed";

export const usePageMenu = () => {
  const [items, setItems] = useState<MenuItem[]>(pageMenu.items());
  useEffect(() => {
    pageMenu.listen(() => {
      setItems([...pageMenu.items()]);
    });
  }, [setItems]);
  return items;
};
