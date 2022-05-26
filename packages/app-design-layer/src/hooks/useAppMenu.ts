import { MenuItem } from "@atrilabs/core";
import { useEffect, useState } from "react";
import { appMenu } from "../exposed";

export const useAppMenu = () => {
  const [items, setItems] = useState<MenuItem[]>(appMenu.items());
  useEffect(() => {
    appMenu.listen(() => {
      setItems([...appMenu.items()]);
    });
  }, [setItems]);
  return items;
};
