import { MenuItem } from "@atrilabs/core";
import { useEffect, useState } from "react";
import { headerMenu } from "../exposed";

export const useHeaderMenu = () => {
  const [items, setItems] = useState<MenuItem[]>(headerMenu.items());
  useEffect(() => {
    headerMenu.listen(() => {
      setItems([...headerMenu.items()]);
    });
  }, [setItems]);
  return items;
};
