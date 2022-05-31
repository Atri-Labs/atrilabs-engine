import { useState, useEffect } from "react";
import { TabItem } from "@atrilabs/core";
import { propertiesTab } from "../exposed";

export const usePropertiesTab = () => {
  const [items, setItems] = useState<TabItem[]>(propertiesTab.items());
  useEffect(() => {
    propertiesTab.listen(() => {
      setItems([...propertiesTab.items()]);
    });
  }, [setItems]);
  return items;
};
