import { MenuItem } from "@atrilabs/core";
import { useEffect, useState } from "react";
import { canvasMenu } from "../exposed";

export const useCanvasMenu = () => {
  const [items, setItems] = useState<MenuItem[]>(canvasMenu.items());
  useEffect(() => {
    canvasMenu.listen(() => {
      // Note: Its important to create a copy of the items array
      // because canvasMenu.items() returns the same instance of array every time
      setItems([...canvasMenu.items()]);
    });
  }, [setItems]);
  return items;
};
