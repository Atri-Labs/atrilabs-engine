import { MenuItem } from "@atrilabs/core";
import { useEffect, useState } from "react";
import { publishMenu } from "../exposed";

export const usePublishMenu = () => {
  const [items, setItems] = useState<MenuItem[]>(publishMenu.items());
  useEffect(() => {
    publishMenu.listen(() => {
      setItems([...publishMenu.items()]);
    });
  }, [setItems]);
  return items;
};
