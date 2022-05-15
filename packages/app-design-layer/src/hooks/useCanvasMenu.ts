import { MenuItem } from "@atrilabs/core";
import { useEffect, useState } from "react";
import { canvasMenu } from "../exposed";

export const useCanvasMenu = () => {
  const [items, setItems] = useState<MenuItem[]>(canvasMenu.items());
  useEffect(() => {
    canvasMenu.listen(() => {
      setItems(canvasMenu.items());
    });
  }, [setItems]);
  return items;
};
