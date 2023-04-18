import { useEffect, useState } from "react";
import { subscribeEditorMachine } from "@atrilabs/pwa-builder-manager";

export const useComponentSelected = () => {
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    subscribeEditorMachine("SELECT", (_context, event) => {
      if (event.type === "SELECT") {
        setSelected(event.id);
      }
    });
    subscribeEditorMachine("SELECT_END", (_context, event) => {
      setSelected("");
    });
  }, []);
  return { selected };
};
